from flask import Flask, render_template, request, session
from flask_socketio import SocketIO, emit, send, join_room, leave_room
# from flask_cors import CORS
from json import dumps, loads
import time
import requests
import threading


app : Flask = Flask(__name__)
app.config["SECRET"] = "awklgnklangkljagknaw"
socketio : SocketIO = SocketIO(app, cors_allowed_origins="*")

# cors = CORS(app=app, origins="http://localhost:5173", supports_credentials=True)
ROOMS : list = ["lounge", "news", "games", "coding"]

ONLINE_USERS : list = []
ALL_USERS : dict = {}
USERS_AND_ROOMS : dict = {}


@socketio.on("user_connected")
def user_connected(data):
    token : str = data.get("token")
    print(token)
    # make_user_online(token)
    sid = request.sid
    
    if not token in ONLINE_USERS:
        ONLINE_USERS.append(token)
        session["token"] = token
    
    if not sid in ALL_USERS:
        ALL_USERS[sid] = token
        session["token"] = token
    
    for user in ALL_USERS:
        emit("user_online", {"user_uuid" : token}, to=user, include_self=False)
    
    emit("connected", {"data" : ONLINE_USERS})



@socketio.on("disconnect")
def user_disconnected():
    print("disconnected")
    # print(request.sid)
    sid = request.sid
    token : str = session.get("token")
    try:
        if token in ONLINE_USERS:
            print(ONLINE_USERS)
            print(session.get("token"))
            ONLINE_USERS.remove(token)
        if sid in ALL_USERS:
            print(ALL_USERS)
            del ALL_USERS[sid]
            print(ALL_USERS)
            print("token=/>")
            print(token)
            print("=====")
            for user in ALL_USERS:
                print(user)
                emit("user_offline", {"user_uuid" : token}, to=user, include_self=False)
        for chat_id in USERS_AND_ROOMS:
            if token in USERS_AND_ROOMS[chat_id]:
                USERS_AND_ROOMS[chat_id].remove(token)
                emit("user-left", {"user_status" : False, "users_in_room" : USERS_AND_ROOMS[chat_id], "user_left" : token}, room=chat_id, include_self=False)
                break
    except:
        print("failed to pop")
    # print(ONLINE_USERS)

    emit("disconnected", {"data" : ONLINE_USERS})


@socketio.on("message")
def handle_message(message):
    print(message.get("chat_id"))
    token = message["token"]
    print(token)
    chat_id = message["chat_id"]
    media = message["media"]
    message = message["data"]
    print(message)
    if message != "User connected!":
        result : dict = save_message(token=token, text=message, from_user_id="", chat_id=chat_id, media=media)
        print(result)
        if result["result"] == True:
            message : str = dumps(result["message_data"])
            print(message)
            emit("message", {"message" : message}, room=chat_id)


@socketio.on("server_chat_message")
def handle_server_chat_message(message):
    print(message.get("chat_id"))
    token = message["token"]
    print(token)
    chat_id = message["chat_id"]
    server_id = message["server_id"]
    media = message["media"]
    message = message["data"]
    print(message)
    if message != "User connected!":
        result : dict = save_server_chat_message(token=token, text=message, from_user_id="", chat_id=chat_id, server_id=server_id, media=media)
        print(result)
        if result["result"] == True:
            message : str = dumps(result["message_data"])
            print(message)
            emit("server_chat_message", {"message" : message}, room=chat_id)


@socketio.on("join")
def join(data):
    user_uuid : str = data.get("uuid")
    chat_id : str = data.get("chat_id")
    token : str = data.get("token")
    print(data)
    join_room(data.get("chat_id"))
    users_data = get_chat_info(
        token=None,
        chat_id=data.get("chat_id")
    )
    
    if users_data.get("result"):
        if chat_id in USERS_AND_ROOMS:
            if user_uuid in USERS_AND_ROOMS[chat_id]:
                ...
            else:
                USERS_AND_ROOMS[chat_id].append(user_uuid)
        else:
            USERS_AND_ROOMS[chat_id] = []
            USERS_AND_ROOMS[chat_id].append(user_uuid)
    
    emit("join", {"users_data" : users_data})
    emit("user-changed", {"user_status" : True, "users_in_room" : USERS_AND_ROOMS[chat_id]}, room=data.get("chat_id"), include_self=True)
    send(message=users_data, room=data.get("chat_id"))


@socketio.on("join_server_chat")
def join_server_chat(data):
    join_room(data.get("chat_id"))
    users_data = get_server_chat_info(
        token=None,
        chat_id=data.get("chat_id")
    )
    emit("join_server_chat", {"users_data" : users_data})
    send(message=users_data, room=data.get("chat_id"))


@socketio.on("leave")
def leave(data):
    user_uuid : str = data.get("uuid")
    chat_id : str = data.get("chat_id")
    token : str = data.get("token")
    print(chat_id)
    print(user_uuid in USERS_AND_ROOMS[chat_id])
    if user_uuid in USERS_AND_ROOMS[chat_id]:
        print("delete")
        USERS_AND_ROOMS[chat_id].remove(user_uuid)
    leave_room(chat_id)
    emit("user-changed", {"user_status" : False, "user_uuid" : user_uuid}, room=chat_id, include_self=False)
    send(message="new user left the room", room=chat_id)


@app.route("/", methods=["GET", "POST"])
def view():
    # save_message(token="",text="mgwakgma", from_user_id="", chat_id="")
    return render_template("index.html", rooms=ROOMS)



def make_user_online(token : str) -> None:
    requests.post("http://127.0.0.1:8000/api/v1/makeUserOnline", data={"token" : token})



def save_message(token : str, text : str, from_user_id : str, chat_id : str, media : dict) -> dict:
    data : dict = {
        "token" : token,
        "text" : text,
        "from_user_id" : from_user_id,
        "chat_id" : chat_id,
    }
    file = media["file"] if media else None
    file_name : str = media["name"].split("/")[-1] if media else None
    files : dict = {
        file_name : file,
    }
    result = requests.post("http://127.0.0.1:8000/api/v1/saveMessage", data=data, files=files)
    # print(result)
    return result.json()


def save_server_chat_message(token : str, text : str, from_user_id : str, chat_id : str, server_id : str, media : dict) -> dict:
    data : dict = {
        "token" : token,
        "text" : text,
        "from_user_id" : from_user_id,
        "chat_id" : chat_id,
        "server_id" : server_id,
    }
    file = media["file"] if media else None
    file_name : str = media["name"].split("/")[-1] if media else None
    files : dict = {
        file_name : file,
    }
    result = requests.post("http://127.0.0.1:8000/api/v1/serverChatMessageSave", data=data, files=files)
    print(result)
    return result.json()


def get_chat_info(token : str, chat_id : str) -> dict:
    response = requests.post("http://127.0.0.1:8000/api/v1/getUsersChat", data={"token" : token, "chat_id" : chat_id})
    return response.json()


def get_token_info(token : str) -> dict:
    response = requests.post("http://127.0.0.1:8000/api/v1/getTokenInfo", data={"token" : token})
    data : dict = response.json()
    return data


def get_server_chat_info(token : str, chat_id : str) -> dict:
    response = requests.post("http://127.0.0.1:8000/api/v1/getUsersServerChat", data={"token" : token, "chat_id" : chat_id})
    print(response.json())
    return response.json()


def monitor_online(delay : float) -> None:
    while True:
        time.sleep(delay)
        print(ALL_USERS)


thread : threading.Thread = threading.Thread(target=monitor_online, args=(0.2,), daemon=True)

# thread.start()

if __name__ == "__main__":
    socketio.run(app, host="127.0.0.1", port=5000)