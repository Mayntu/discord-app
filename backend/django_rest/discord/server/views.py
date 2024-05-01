from django.shortcuts import render
from django.http import JsonResponse

from discord.settings import SECRET_KEY, BASE_DIR

from server.models import (
    User,
    Message,
    Chat,
    Server,
    ServerChatRoom,
    ServerMessage,
)
from server.serializers import (
    UserSerializer,
    MessageSerializer,
    ChatSerializer,
    ServerSerializer,
    ServerMessageSerializer,
    ServerRoomSerializer,
)
from server.utils import (
    generate_jwt,
    get_token,
    handle_upload_file,
    handle_upload_file_server,
)


import json
import os



def api_auth(request):
    if request.method == "POST":
        for i in range(0, 5): print(json.loads(request.body))
        data : dict = json.loads(request.body)
        login    : str = data.get("login")
        password : str = data.get("password")

        user_bool : bool = User.objects.filter(login=login, password=password).exists()

        
        print(user_bool)

        if user_bool:
            user : User = User.objects.get(login=login, password=password)

            token : str = generate_jwt(
                uuid=str(user.uuid),
                login=user.login,
                password=user.password,
            )

            return JsonResponse(data={"result" : True, "uuid" : user.uuid, "login" : user.login, "token" : token}, safe=True)
        
        return JsonResponse(data={"result" : False, "error" : "not valid login or password"})
    
    return JsonResponse(data={"result" : False, "error" : "method not allowed"})


def api_reg(request):
    if request.method == "POST":
        for i in range(0, 5): print(json.loads(request.body))
        data : dict = json.loads(request.body)
        email     : str = data.get("email")
        login    : str = data.get("login")
        password : str = data.get("password")

        user_bool = User.objects.filter(login=login) | User.objects.filter(email=email)
        user_bool : bool = user_bool.exists()

        if not user_bool:
            user : User = User.objects.create(email=email, login=login, password=password)

            token : str = generate_jwt(
                uuid=str(user.uuid),
                login=user.login,
                password=user.password,
            )

            return JsonResponse(data={"result" : True, "token" : token}, safe=True)
        
        return JsonResponse(data={"result" : False, "error" : "login or email already exists on server"})
    
    return JsonResponse(data={"result" : False, "error" : "method not allowed"})



def api_get_users_chats(request):
    # print(User.objects.all()[1].uuid, User.objects.all()[1].login, User.objects.all()[1].password)
    # uuid : str = "50d8ce93-f20e-4edf-909a-85ee8f82febf"
    # login : str = "test_user"
    # password : str = "12345"
    # print(generate_jwt(uuid=uuid, login=login, password=password))
    print(request.headers)
    data  : dict = request.headers
    token : str  = data.get("Authorization").replace('"', "")
    # print(token)
    token_content = get_token(token=token)
    if not token_content:
        return JsonResponse(data={"result" : False, "result2" : "not valid token"})
    

    uuid = token_content.get("uuid")
    # chat : Chat = Chat.objects.create()
    # chat.users.add(User.objects.get(pk=uuid))
    # User.objects.get(pk=uuid).chats.add(chat)

    try:
        user : User = User.objects.get(pk=uuid)
        user_chats = user.chats.all()
        print(user_chats)
        result : list = []
        for user_chat in user_chats:
            temp : dict = {"uuid" : str(user_chat.uuid), "users" : []}
            for user_ in user_chat.users.all():
                user_dict = {
                    "uuid" : str(user_.uuid),
                    "login" : user_.login,
                    "avatar" : user_.avatar,
                    "status" : user_.is_online,
                    "is_current" : str(user_.uuid) == str(uuid)
                }
                temp["users"].append(user_dict)
            result.append(temp)
        print("========="*20)
        print(result)
        print("========="*20)
        return JsonResponse(data={"result" : True, "data" : result}, safe=False)
    except Exception as e:
        return JsonResponse(data={"result" : False, "error" : f"user not found {e}"})



def api_create_chat(request):
    data : dict = request.headers


    token : str = data.get("Authorization").replace('"', "")
    token_content : dict = get_token(
        token=token
    )

    if not token_content:
        return JsonResponse(data={"result" : False, "error" : "not valid token"})
    
    
    data : dict = json.loads(request.body)

    
    from_user_id : str = token_content.get("uuid")
    users_ids : list = data.get("users_ids") if isinstance(data.get("users_ids"), list) else [data.get("users_ids")]


    current_user : User = User.objects.get(uuid=from_user_id)
    members : list = [User.objects.get(uuid=user) for user in users_ids]
    
    users : list = [current_user, *members]


    print(users)

    chat : Chat = Chat.objects.create()
    chat.users.add(*users)

    
    current_user.chats.add(chat)


    for member in members:
        member.chats.add(chat)



    return JsonResponse(data={"result" : True, "chat_id" : chat.uuid})

    

def api_save_message(request):
    data : dict = request.POST
    
    
    # print(User.objects.all().first())
    token : str = data.get("token")
    token_content : dict | bool = get_token(token=token)

    if not token_content:
        return JsonResponse(data={"result" : False, "error" : "not valid token"})
    


    chat_id : str = data.get("chat_id")
    from_user_id : str = token_content.get("uuid")
    text : str = data.get("text")
    file_name : str = list(request.FILES.keys())[0] if request.FILES else None
    img = request.FILES.get(file_name) if file_name else None

    
    print(img)
    
    if img:
        media : str = handle_upload_file(file=img)





    chat : Chat = Chat.objects.get(uuid=chat_id)

    message : Message = Message()
    message.chat_id = chat
    message.from_user_id = from_user_id
    message.content = text
    if img:
        message.media = media
    else:
        message.media = ""
    message.save()


    message_data : dict = {}
    message_data["uuid"] = message.uuid
    message_data["from_user_id"] = message.from_user_id
    message_data["chat_id"] = message.chat_id.uuid
    message_data["content"] = message.content
    message_data["media"] = message.media
    message_data["timestamp"] = message.timestamp

    chat.messages.add(message)

    
    return JsonResponse(data={"result" : True, "message_data" : message_data})



def api_get_chat_messages(request):
    print(request.headers)
    headers : dict = request.headers

    token : str = headers.get("Authorization") or "."
    token : str = token.replace('"', "")
    token_content : dict = get_token(
        token=token
    )

    if token_content:
        print(request.body)
        data : dict = json.loads(request.body)

        chat_id      : str = data.get("chat_id")
        
        chat : Chat = Chat.objects.get(uuid=chat_id)

        
        messages = chat.messages.all().order_by("timestamp")


        messages_serializer = MessageSerializer(messages, many=True)

        messages_ : list = messages_serializer.data


        return JsonResponse(data={"result" : True, "messages" : messages_}, safe=False)
    
    return JsonResponse(data={"result" : False})



def api_find_users(request):
    try:
        headers : dict = request.headers

        token : str = headers.get("Authorization")
        token : str = token.replace('"', "")
        token_content : dict = get_token(
            token=token
        )

        if token_content:
            data  : dict = json.loads(request.body)

            login : str = data.get("login")

            user_uuid : str = token_content.get("uuid")
            user_getter : User = User.objects.get(uuid=user_uuid)


            users_results : list = []
            users : list = User.objects.all()

            for user in users:
                if not user == user_getter:
                    if not user_getter.chats.filter(users__uuid=user.uuid).exists():
                        if login in user.login:
                            user_result : dict = {
                                "uuid" : user.uuid,
                                "login" : user.login,
                                "avatar" : user.avatar,
                                "is_online" : user.is_online,
                            }
                            users_results.append(user_result)
            

            return JsonResponse(data={"result" : True, "users_results" : users_results})
        return JsonResponse(data={"result" : False, "error" : "not valid token"})
    except Exception as e:
        print(e)
        return JsonResponse(data={"result" : False, "error" : f"error has occurred {e}" + str(e)})



def api_make_user_online(request):
    data : dict = request.POST

    token : str = data.get("token")

    token_content : dict = get_token(
        token=token
    )

    if token_content:
        user_uuid : str = token_content.get("uuid")
        user : User = User.objects.get(uuid=user_uuid)
        user.is_online = True

        return JsonResponse(data={"result" : True, "user_id" : user.uuid})
    
    
    return JsonResponse(data={"result" : False, "error" : "not valid token"})



def api_delete_message(request):
    headers : dict = request.headers

    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)
    

    if token_content:
        data : dict = json.loads(request.body)

        message_uuid : str = data.get("message_id")
        
        message : Message = Message.objects.get(uuid=message_uuid)


        message.delete()


        return JsonResponse(data={"result" : True, "message" : "message delete successfully"})
    
    
    return JsonResponse(data={"result" : False, "message" : "not valid token"})



def api_delete_users_chat(request):
    headers : dict = request.headers

    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)
    

    if token_content:
        data : dict = json.loads(request.body)

        # user_id : str = token_content.get("uuid")
        chat_id : str = data.get("chat_id")
        

        chat : Chat = Chat.objects.get(uuid=chat_id)

        
        chat.delete()


        return JsonResponse(data={"result" : True, "message" : "chat delete successfully"})
    
    
    return JsonResponse(data={"result" : False, "message" : "not valid token"})



def api_get_users_info(request):
    headers : dict = request.headers

    
    token : str = headers.get("Authorization").replace('"', "")

    token_content : dict = get_token(token=token)

    if token_content:
        user_uuid : str = token_content.get("uuid")

        user : User = User.objects.get(pk=user_uuid)

        user_serializer : UserSerializer = UserSerializer(user, many=False)
        user_data : dict = user_serializer.data
        user_data["password"] = "secret"

        return JsonResponse(data={"result" : True, "user_data" : user_data})
    
    return JsonResponse(data={"result" : False, "message" : "not valid token"})


def api_change_profile_avatar(request):
    headers : dict = request.headers

    
    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)

    
    if not token_content:
        return JsonResponse(data={"result" : False, "message" : "not valid token"})
    

    data : dict = request.FILES

    file = data.get("file")


    user_uuid : str = str(token_content.get("uuid"))


    if file:
        filename : str = handle_upload_file(file=file)
        user : User = User.objects.get(uuid=user_uuid)
        user.avatar = filename
        user.save()
    else:
        return JsonResponse(data={"result" : False, "message" : "file not found"})



    return JsonResponse(data={"result" : True, "message" : "saved to files", "filename" : filename})



def api_get_users_chat(request):
    data : dict = request.POST

    
    
    chat_id : str = data.get("chat_id")
    print(chat_id)

    chat : Chat = Chat.objects.get(uuid=chat_id)

    users : list = chat.users.all()

    user_serializer : UserSerializer = UserSerializer(users, many=True)
    users_data : dict = user_serializer.data
    # users_data["password"] = "secret"

    return JsonResponse(data={"result" : True, "users_data" : users_data})



def api_change_users_login(request):
    headers : dict = request.headers

    
    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)

    
    if not token_content:
        return JsonResponse(data={"result" : False, "message" : "not valid token"})
    
    try:
        data : dict = json.loads(request.body)

        user_uuid : str = str(token_content.get("uuid"))
        new_login : str = data.get("new_login")

        user : User = User.objects.get(uuid=user_uuid)

        user.login = new_login
        
        user.save()


    except Exception as e:
        return JsonResponse(data={"result" : False, "message" : f"some error occurred {e}"})



    return JsonResponse(data={"result" : True, "message" : "saved to files"})



def api_get_users_servers(request):
    print(request.headers)
    data  : dict = request.headers
    token : str  = data.get("Authorization").replace('"', "")

    token_content = get_token(token=token)
    if not token_content:
        return JsonResponse(data={"result" : False, "result2" : "not valid token"})
    

    uuid = token_content.get("uuid")

    try:
        user : User = User.objects.get(pk=uuid)
        users_servers = user.servers.all()
        print(users_servers)
        server_serializer : ServerSerializer = ServerSerializer(users_servers, many=True)
        users_servers_serialized : dict = server_serializer.data
        return JsonResponse(data={"result" : True, "data" : users_servers_serialized}, safe=False)
    except Exception as e:
        return JsonResponse(data={"result" : False, "error" : f"user not found {e}"})



def api_create_server(request):
    data : dict = request.headers


    token : str = data.get("Authorization").replace('"', "")
    token_content : dict = get_token(
        token=token
    )

    if not token_content:
        return JsonResponse(data={"result" : False, "error" : "not valid token"})
    
    
    data : dict = json.loads(request.body)
    files = request.FILES

    title : str = data.get("title")
    owner_user_id : str = token_content.get("uuid")
    avatar : str = files.get("file")


    filename : str = ""
    if avatar:
        filename : str = handle_upload_file(file=avatar)


    server : Server = Server.objects.create(
        title=title,
        owner_id=owner_user_id,
        avatar=filename,
    )

    os.mkdir(f"{BASE_DIR.parent.parent.parent}/frontend/public/media/images/servers/{server.uuid}")
    


    print(server.uuid)
    owner_user : User = User.objects.get(uuid=owner_user_id)
    owner_user.servers.add(server)

    print(owner_user.servers.all())

    server.users.add(owner_user)


    return JsonResponse(data={"result" : True, "server_id" : server.uuid})



def api_get_servers_users(request):
    data : dict = request.headers


    token : str = data.get("Authorization").replace('"', "")
    token_content : dict = get_token(
        token=token
    )

    if not token_content:
        return JsonResponse(data={"result" : False, "error" : "not valid token"})
    
    
    data : dict = json.loads(request.body)

    
    user_uuid : str = token_content.get("uuid")
    server_uuid : str = data.get("uuid")

    user : User = User.objects.get(uuid=user_uuid)
    server : Server = Server.objects.get(uuid=server_uuid)

    users : list = server.users.all()
    
    
    user_serializer : UserSerializer = UserSerializer(users, many=True)
    
    users_ : list = user_serializer.data


    return JsonResponse(data={"result" : True, "users" : users_})



def api_create_server_chat(request):
    data : dict = request.headers


    token : str = data.get("Authorization").replace('"', "")
    token_content : dict = get_token(
        token=token
    )

    if not token_content:
        return JsonResponse(data={"result" : False, "error" : "not valid token"})
    
    
    data : dict = json.loads(request.body)

    user_uuid : str = token_content.get("uuid")
    server_uuid : str = data.get("uuid")
    chat_room_title : str = data.get("title")

    user : User = User.objects.get(pk=user_uuid)

    server : Server = Server.objects.get(pk=server_uuid)
    print(str(user.uuid), str(server.owner_id))

    if not str(user.uuid) == server.owner_id:
        return JsonResponse(data={"result" : False, "message" : "you must be server owner"})
    

    server_chat_room : ServerChatRoom = ServerChatRoom.objects.create(title=chat_room_title, server_object=server)
    server.chat_rooms.add(server_chat_room)


    return JsonResponse(data={"result" : True, "server_chat_room_uuid" : server_chat_room.uuid})



def api_get_server_chat_rooms(request):
    data  : dict = request.headers
    token : str  = data.get("Authorization").replace('"', "")

    token_content = get_token(token=token)
    if not token_content:
        return JsonResponse(data={"result" : False, "message" : "not valid token"})
    

    data : dict = json.loads(request.body)


    server_uuid : str = data.get("server_uuid")


    try:
        server : Server = Server.objects.get(uuid=server_uuid)
        server_chat_rooms = server.chat_rooms.all()
        print(server_chat_rooms)
        result : list = []
        for server_chat_room in server_chat_rooms:
            temp : dict = {"uuid" : str(server_chat_room.uuid), "title" : server_chat_room.title}
            result.append(temp)

        return JsonResponse(data={"result" : True, "data" : result}, safe=False)
    except Exception as e:
        return JsonResponse(data={"result" : False, "error" : f"user not found {e}"})



def api_get_users_server_chat(request):
    data : dict = request.POST

    
    
    chat_id : str = data.get("chat_id")
    print(chat_id)

    server_chat_room : ServerChatRoom = ServerChatRoom.objects.get(uuid=chat_id)
    server : Server = server_chat_room.server_object

    users : list = server.users.all()

    user_serializer : UserSerializer = UserSerializer(users, many=True)
    users_data : dict = user_serializer.data
    # users_data["password"] = "secret"

    return JsonResponse(data={"result" : True, "users_data" : users_data})



def api_save_server_chat_message(request):
    data : dict = request.POST
    
    

    token : str = data.get("token")
    token_content : dict | bool = get_token(token=token)

    if not token_content:
        return JsonResponse(data={"result" : False, "error" : "not valid token"})
    


    server_chat_room_id : str = data.get("chat_id")
    server_uuid : str = data.get("server_id")
    from_user_id : str = token_content.get("uuid")
    text : str = data.get("text")
    file_name : str = list(request.FILES.keys())[0] if request.FILES else None
    img = request.FILES.get(file_name) if file_name else None


    server : Server = Server.objects.get(uuid=server_uuid)

    
    print(img)
    
    if img:
        media : str = handle_upload_file_server(file=img, server_id=server_uuid)





    server_chat_room : ServerChatRoom = ServerChatRoom.objects.get(uuid=server_chat_room_id)

    server_message : ServerMessage = ServerMessage()
    server_message.from_user_id = from_user_id
    server_message.content = text
    
    if img:
        server_message.media = media
    else:
        server_message.media = ""
    
    server_message.save()


    message_data : dict = {}
    message_data["uuid"] = server_message.uuid
    message_data["from_user_id"] = server_message.from_user_id
    message_data["content"] = server_message.content
    message_data["media"] = server_message.media
    message_data["timestamp"] = server_message.timestamp

    server_chat_room.messages.add(server_message)

    
    return JsonResponse(data={"result" : True, "message_data" : message_data})



def api_get_server_room_messages(request):
    headers : dict = request.headers

    token : str = headers.get("Authorization") or "."
    token : str = token.replace('"', "")
    token_content : dict = get_token(
        token=token
    )

    if token_content:
        data : dict = json.loads(request.body)

        server_chat_room_id      : str = data.get("chat_id")
        
        server_chat_room : ServerChatRoom = ServerChatRoom.objects.get(uuid=server_chat_room_id)

        
        messages = server_chat_room.messages.all().order_by("timestamp")


        server_message_serializer : ServerMessageSerializer = ServerMessageSerializer(messages, many=True)

        server_messages : dict = server_message_serializer.data


        return JsonResponse(data={"result" : True, "server_messages" : server_messages}, safe=False)
    
    return JsonResponse(data={"result" : False})



def api_delete_server(request):
    headers : dict = request.headers

    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)
    

    if token_content:
        data : dict = json.loads(request.body)

        user_id : str = token_content.get("uuid")
        server_id : str = data.get("server_id")
        

        user : User = User.objects.get(uuid=user_id)
        server : Server = Server.objects.get(uuid=server_id)

        
        if str(user.uuid) == server.owner_id:
            server.delete()
            
            return JsonResponse(data={"result" : True, "message" : "chat delete successfully"})
        
        return JsonResponse(data={"result" : False, "message" : "you must be server owner"})
    
    
    return JsonResponse(data={"result" : False, "message" : "not valid token"})



def api_delete_servers_message(request):
    headers : dict = request.headers

    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)
    

    if token_content:
        data : dict = json.loads(request.body)

        server_message_uuid : str = data.get("server_message_uuid")
        
        server_message : ServerMessage = ServerMessage.objects.get(uuid=server_message_uuid)


        server_message_uuid.delete()


        return JsonResponse(data={"result" : True, "message" : "server message was deleted successfully"})
    
    
    return JsonResponse(data={"result" : False, "message" : "not valid token"})



def api_delete_server_chat_room(request):
    headers : dict = request.headers

    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)
    

    if token_content:
        data : dict = json.loads(request.body)

        user_id : str = token_content.get("uuid")
        server_id : str = data.get("server_id")
        server_chat_room_id : str = data.get("server_chat_room_id")
        

        user : User = User.objects.get(uuid=user_id)
        server : Server = Server.objects.get(uuid=server_id)
        server_chat_room : ServerChatRoom = ServerChatRoom.objects.get(uuid=server_chat_room_id)

        server_chat_room.delete()
            
        return JsonResponse(data={"result" : True, "message" : "chat delete successfully"})
        
    return JsonResponse(data={"result" : False, "message" : "not valid token"})



def api_change_servers_title(request):
    headers : dict = request.headers

    
    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)

    
    if not token_content:
        return JsonResponse(data={"result" : False, "message" : "not valid token"})
    
    try:
        data : dict = json.loads(request.body)

        server_uuid : str = data.get("server_uuid")
        title : str = data.get("title")

        
        server : Server = Server.objects.get(uuid=server_uuid)

        server.title = title
        
        server.save


    except Exception as e:
        return JsonResponse(data={"result" : False, "message" : "failed to change server title"})



    return JsonResponse(data={"result" : True, "message" : "saved to files"})



def api_change_servers_avatar(request):
    headers : dict = request.headers

    
    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)

    
    if not token_content:
        return JsonResponse(data={"result" : False, "message" : "not valid token"})
    

    data : dict = json.loads(request.body)
    files : dict = request.FILES

    file = files.get("file")


    server_uuid : str = str(data.get("uuid"))


    if file:
        filename : str = handle_upload_file(file=file)
        server : Server = Server.objects.get(uuid=server_uuid)
        server.avatar = filename
        server.save()
    else:
        return JsonResponse(data={"result" : False, "message" : "file not found"})



    return JsonResponse(data={"result" : True, "message" : "saved to files", "filename" : filename})

