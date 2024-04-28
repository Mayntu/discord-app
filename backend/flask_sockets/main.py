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
        request.session["token"] = token
    
    emit("connected", {"data" : ONLINE_USERS})



@socketio.on("disconnect")
def user_disconnected():
    print("disconnected")
    # print(request.sid)
    user = ONLINE_USERS.pop(ONLINE_USERS.index(request.session.get("token")))
    # print(ONLINE_USERS)

    emit("connected", {"data" : ONLINE_USERS})


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
            send(message=message, room=chat_id)


@socketio.on("join")
def join(data):
    join_room(data.get("chat_id"))
    users_data = get_chat_info(
        token=None,
        chat_id=data.get("chat_id")
    )
    emit("join", {"users_data" : users_data})
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


def get_chat_info(token : str, chat_id : str) -> dict:
    response = requests.post("http://127.0.0.1:8000/api/v1/getUsersChat", data={"token" : token, "chat_id" : chat_id})
    return response.json()


if __name__ == "__main__":
    socketio.run(app, host="127.0.0.1", port=5000, debug=True)