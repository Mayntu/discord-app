from flask import Flask, render_template, request, session
from flask_socketio import SocketIO, emit, send, join_room, leave_room
# from flask_cors import CORS
from json import dumps, loads
import requests


app : Flask = Flask(__name__)
app.config["SECRET"] = "awklgnklangkljagknaw"
socketio : SocketIO = SocketIO(app, cors_allowed_origins="*")

# cors = CORS(app=app, origins="http://localhost:5173", supports_credentials=True)
ROOMS : list = ["lounge", "news", "games", "coding"]

ONLINE_USERS : list = []


@socketio.on("user_connected")
def user_connected(data):
    token : str = data.get("token")
    # make_user_online(token)
    
    if not token in ONLINE_USERS:
        ONLINE_USERS.append(token)
        session["token"] = token
    
    emit("connected", {"data" : ONLINE_USERS})



@socketio.on("disconnect")
def user_disconnected():
    print("disconnected")
    # print(request.sid)
    try:
        print(ONLINE_USERS)
        ONLINE_USERS.pop(ONLINE_USERS.index(session.get("token")))
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
            emit("server_chat_message", {"message" : message})


@socketio.on("join")
def join(data):
    join_room(data.get("chat_id"))
    users_data = get_chat_info(
        token=None,
        chat_id=data.get("chat_id")
    )
    emit("join", {"users_data" : users_data})
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
    leave_room(data["chat_id"])
    send(message="new user left the room", room=data["chat_id"])


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
    print(result)
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


def get_server_chat_info(token : str, chat_id : str) -> dict:
    response = requests.post("http://127.0.0.1:8000/api/v1/getUsersServerChat", data={"token" : token, "chat_id" : chat_id})
    print(response.json())
    return response.json()


if __name__ == "__main__":
    socketio.run(app, host="127.0.0.1", port=5000, debug=True)