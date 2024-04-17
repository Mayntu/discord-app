from flask import Flask, render_template
from flask_socketio import SocketIO, send, join_room, leave_room
import requests


app : Flask = Flask(__name__)
app.config["SECRET"] = "awklgnklangkljagknaw"
socketio : SocketIO = SocketIO(app, cors_allowed_origin="*")
ROOMS : list = ["lounge", "news", "games", "coding"]


@socketio.on("message")
def handle_message(message):
    print(message.get("chat_id"))
    token = message["token"]
    chat_id = message["chat_id"]
    message = message["data"]
    print(message)
    if message != "User connected!":
        send(message=message, room=chat_id)
        save_message(token=token, text=message, from_user_id="", chat_id=chat_id)


@socketio.on("join")
def join(data):
    join_room(data["chat_id"])
    send(message="new user joined the room", room=data["chat_id"])


@socketio.on("leave")
def leave(data):
    leave_room(data["chat_id"])
    send(message="new user left the room", room=data["room"])


@app.route("/", methods=["GET", "POST"])
def view():
    # save_message(token="",text="mgwakgma", from_user_id="", chat_id="")
    return render_template("index.html", rooms=ROOMS)



def save_message(token : str, text : str, from_user_id : str, chat_id : str) -> None:
    data : dict = {
        "token" : token,
        "text" : text,
        "from_user_id" : from_user_id,
        "chat_id" : chat_id,
        "media" : "",
    }
    result = requests.post("http://127.0.0.1:8000/api/v1/saveMessage", data=data)
    print(result.json())



if __name__ == "__main__":
    socketio.run(app, host="127.0.0.1", port=5000, debug=True)