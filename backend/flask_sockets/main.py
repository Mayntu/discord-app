from flask import Flask, render_template
from flask_socketio import SocketIO, send, join_room, leave_room


app : Flask = Flask(__name__)
app.config["SECRET"] = "awklgnklangkljagknaw"
socketio : SocketIO = SocketIO(app, cors_allowed_origin="*")
ROOMS : list = ["lounge", "news", "games", "coding"]


@socketio.on("message")
def handle_message(message):
    room = message["room"]
    message = message["data"]
    message = "user: " + message
    if message != "User connected!":
        send(message=message, room=room)


@socketio.on("join")
def join(data):
    join_room(data["room"])
    send(message="new user joined the room", room=data["room"])


@socketio.on("leave")
def leave(data):
    leave_room(data["room"])
    send(message="new user left the room", room=data["room"])


@app.route("/", methods=["GET", "POST"])
def view():
    return render_template("index.html", rooms=ROOMS)


if __name__ == "__main__":
    socketio.run(app, host="127.0.0.1", port=5000, debug=True)