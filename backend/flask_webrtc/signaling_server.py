from flask import Flask, render_template, request, redirect, url_for, session
from flask_socketio import SocketIO, emit, join_room, leave_room


from engineio.payload import Payload
Payload.max_decode_packets = 200

from events import ACTIONS

app = Flask(__name__)
app.config["SECRET"] = "awlkmngkalmgkma"
socketio : SocketIO = SocketIO(app, cors_allowed_origins="*")


_users_in_room = {}
_room_of_sid = {}
_name_of_sid = {}


@app.route("/", methods=["GET", "POST"])
def index():
    return render_template("test.html")


@socketio.on("connect")
def on_connect():
    sid = request.sid
    print("New socket connected ", sid)
    

@socketio.on("join-room")
def on_join_room(data):
    sid = request.sid
    room_id = data["room_id"]
    display_name = data["name"]
    
    join_room(room_id)
    _room_of_sid[sid] = room_id
    _name_of_sid[sid] = display_name

    
    

    
    print("[{}] New member joined: {}<{}>".format(room_id, display_name, sid))
    emit("user-connect", {"sid": sid, "name": display_name}, broadcast=True, include_self=False, room=room_id)
    
    if room_id not in _users_in_room:
        _users_in_room[room_id] = [sid]
        emit("user-list", {"my_id": sid})
    else:
        _users_in_room[room_id].append(sid)
        usrlist = {u_id:_name_of_sid[u_id] for u_id in _users_in_room[room_id]}
        emit("user-list", {"list": usrlist}, broadcast=True, include_self=True, room=room_id)

    for user_id in _users_in_room[room_id]:
        emit(ACTIONS.ADD_PEER, {"peerID" : request.sid, "createOffer" : False}, to=user_id)
        emit(ACTIONS.ADD_PEER, {"peerID" : user_id, "createOffer" : True})
    

    
    print("\nusers: ", _users_in_room, "\n")


@socketio.on("leave-room")
def on_leave_room():
    try:
        sid = request.sid
        room_id = _room_of_sid[sid]
        display_name = _name_of_sid[sid]
        print("[{}] Member left: {}<{}>".format(room_id, display_name, sid))
        # emit("user-disconnect", {"sid": sid}, broadcast=True, include_self=False, room=room_id)
       
        print("wgagagwa")
        print(_users_in_room[room_id])
        _users_in_room[room_id].remove(sid)
        print("_users_in_room=",_users_in_room)
        try:
            if len(_users_in_room[room_id]) == 0:
                _users_in_room.pop(room_id)
        except:
            print("no users")

        for user_id in _users_in_room:
            print("user_id=",user_id)
            emit(ACTIONS.REMOVE_PEER, {"peerID" : request.sid}, to=user_id)
            emit(ACTIONS.REMOVE_PEER, {"peerID" : user_id})
        
        _room_of_sid.pop(sid)
        _name_of_sid.pop(sid)

        print("users in room")
        print("\nusers: ", _users_in_room, "\n")
    except:
        ...


@socketio.on("disconnect")
def on_disconnect():
    try:
        sid = request.sid
        room_id = _room_of_sid[sid]
        display_name = _name_of_sid[sid]

        print("[{}] Member left: {}<{}>".format(room_id, display_name, sid))
        # emit("user-disconnect", {"sid": sid}, broadcast=True, include_self=False, room=room_id)

        _users_in_room[room_id].remove(sid)
        try:
            if len(_users_in_room[room_id]) == 0:
                _users_in_room.pop(room_id)
        except:
            print("no users")

        for user_id in _users_in_room:
            emit(ACTIONS.REMOVE_PEER, {"peerID" : request.sid}, to=user_id)
            emit(ACTIONS.REMOVE_PEER, {"peerID" : user_id})
        
        _room_of_sid.pop(sid)
        _name_of_sid.pop(sid)

        print("\nusers: ", _users_in_room, "\n")
    except:
        ...


@socketio.on("data")
def on_data(data):
    sender_sid = data['sender_id']
    target_sid = data['target_id']
    if sender_sid != request.sid:
        print("[Not supposed to happen!] request.sid and sender_id don't match!!!")

    if data["type"] != "new-ice-candidate":
        print('{} message from {} to {}'.format(data["type"], sender_sid, target_sid))
    socketio.emit('data', data, room=target_sid)


@socketio.on(ACTIONS.RELAY_SDP)
def relay_sdp(data):
    peer_id : str = data.get("peer_id")
    session_description : str = data.get("session_description")
    emit(ACTIONS.SESSION_DESCRPTION, {"peerID" : request.sid, "sessionDescription" : session_description}, to=peer_id)


@socketio.on(ACTIONS.RELAY_ICE)
def relay_ice(data):
    peer_id : str = data.get("peer_id")
    ice_candidate : str = data.get("ice_candidate")
    print("RELAY_ICE")
    emit(ACTIONS.ICE_CANDIDATE, {"peerID" : request.sid, "iceCandidate" : ice_candidate}, to=peer_id)



if __name__ == "__main__":
    socketio.run(
        app, 
        host="127.0.0.1",
        port=5555
    )
