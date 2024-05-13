from flask import Flask, request, session, render_template
from flask_socketio import SocketIO, emit, join_room, leave_room
from engineio.payload import Payload
Payload.max_decode_packets = 200
app : Flask = Flask(__name__)
app.config["SECRET_KEY"] = "supersecretkey"

socketio : SocketIO = SocketIO(
    app=app
)

CONNECTED_USERS : list = []
ROOMS : dict = {
    "room_id1" : []
}

@app.route("/", methods=["GET", "POST"])
def main():
    return "index test"


@app.route("/test", methods=["GET", "POST"])
def test_view():
    return render_template("test.html")



@socketio.on("connect")
def user_connect():
    print(f"{request.sid}")
    CONNECTED_USERS.append(request.sid)
    print(CONNECTED_USERS)
    print(ROOMS)


@socketio.on("join-room")
def join_room(data):
    room_id : str = data.get("roomID")
    print(room_id)
    if isinstance(ROOMS.get(room_id), list):
        ROOMS[room_id].append(request.sid)
        emit("join-room", {"data" : ROOMS[room_id]}, broadcast=True)
    


@socketio.on("disconnect")
def user_dis_connect():
    print(request.sid)
    CONNECTED_USERS.remove(request.sid)


if __name__ == "__main__":
    app.run(
        debug=True,
        host="0.0.0.0",
        port=5555,
    )