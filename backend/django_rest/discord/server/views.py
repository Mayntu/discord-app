from django.shortcuts import render
from django.http import JsonResponse

from discord.settings import BASE_DIR

from users.models import (
    User,
)
from users.serializers import (
    UserSerializer,
)
from chats.models import (
    Chat,
)
from server.models import (
    Server,
    ServerChatRoom,
    ServerMessage,
    InvitationLink,
)
from server.serializers import (
    ServerSerializer,
    ServerMessageSerializer,
    ServerRoomSerializer,
)
from users.utils import (
    get_token,
)
from chats.utils import (
    handle_upload_file,
    handle_upload_audio,
)
from chats.speach_recognise import recognise
from server.utils import (
    handle_upload_file_server,
    generate_link,
    handle_upload_audio_server,
)


import json
import os



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
    
    
    # data : dict = json.loads(request.body)
    files = request.FILES

    title : str = request.POST.get("title")
    owner_user_id : str = token_content.get("uuid")
    avatar : str = files.get("file")


    # print(data)
    filename : str = ""
    server : Server = Server.objects.create(
        title=title,
        owner_id=owner_user_id,
        avatar=filename,
    )
    server_uuid = server.uuid

    os.mkdir(f"{BASE_DIR.parent.parent.parent}/frontend/public/media/images/servers/{server_uuid}")
    os.mkdir(f"{BASE_DIR.parent.parent.parent}/frontend/public/media/audios/servers/{server_uuid}")


    if avatar:
        filename : str = handle_upload_file_server(file=avatar, server_id=server_uuid)
        server.avatar = filename
        server.save()

    


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
    print(server_uuid)


    data_type : str = "text"
        
    print(img)
    
    if img:
        if not str(img) == "mp3":
            media : str = handle_upload_file_server(file=img, server_id=server_uuid)
            data_type : str = "media"
        else:
            media : str = handle_upload_audio_server(file=img, server_id=server_uuid)
            data_type : str = "audio"
            # audio_path : str = f"{BASE_DIR.parent.parent.parent}/frontend/public/{media}"; print(audio_path)
            # data : str = recognise(path=audio_path)
            # print(data)





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
    message_data["type"] = data_type

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

        server_chat_room_id : str = data.get("chat_id")
        count : int = int(data.get("count")) or 500
        
        server_chat_room : ServerChatRoom = ServerChatRoom.objects.get(uuid=server_chat_room_id)

        temp_messages = server_chat_room.messages.all().order_by("-timestamp")
        messages = temp_messages[:count:-1]
        counter : int = len(temp_messages)

        # for message in messages:
        #     message.has_read = True


        server_message_serializer : ServerMessageSerializer = ServerMessageSerializer(messages, many=True)

        server_messages : dict = server_message_serializer.data


        return JsonResponse(data={"result" : True, "server_messages" : server_messages, "messages_count" : counter}, safe=False)
    
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


        server_message.delete()


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
        
        server.save()


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



def api_change_server_message(request):
    headers : dict = request.headers

    
    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)

    
    if not token_content:
        return JsonResponse(data={"result" : False, "message" : "not valid token"})
    
    try:
        data : dict = json.loads(request.body)

        message_uuid : str = data.get("message_uuid")
        new_content : str = data.get("new_content")

        
        server_message : ServerMessage = ServerMessage.objects.get(uuid=message_uuid)
        server_message.content = new_content
        server_message.save()


    except Exception as e:
        return JsonResponse(data={"result" : False, "message" : "failed to change server's message"})



    return JsonResponse(data={"result" : True, "message" : "saved to files"})



def api_get_invitation_link(request):
    data : dict = json.loads(request.body)

    server_uuid : str = data.get("server_uuid")
    link : str = generate_link(server_uuid=server_uuid)

    invitation_link : InvitationLink = InvitationLink()
    invitation_link.data = link
    invitation_link.server_uuid = server_uuid
    invitation_link.save()
    print(invitation_link)
    print(link)
    print(InvitationLink.objects.get(data=invitation_link.data))

    return JsonResponse(data={"result" : True, "link" : invitation_link.data})



def api_save_audio_message(request):
    data = request.FILES
    audio_name : str = handle_upload_audio(file=data["audio"])
    print(audio_name)
    return JsonResponse(data={"result" : True, "message" : "saved"})



def api_recognize_audio_server(request):
    headers : dict = request.headers

    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)
    

    if token_content:
        data : dict = json.loads(request.body)

        message_uuid : str = data.get("message_id")
        message : ServerMessage = ServerMessage.objects.get(uuid=message_uuid)

        if not message.content:
            message.content = recognise(path=open(file=message.media, mode="rb"))
            message.save()
        

        return JsonResponse(data={"result" : True, "message" : "chat delete successfully"})
    
    return JsonResponse(data={"result" : False, "message" : "not valid token"})



def api_check_user(request):
    headers : dict = request.headers

    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)

    if token_content:
        data : dict = json.loads(request.body)

        user_uuid : str = token_content.get("uuid")

        server_uuid : str = data.get("server_uuid")

        server : Server = Server.objects.get(uuid=server_uuid)

        return JsonResponse({"result" : True, "is_owner" : user_uuid == server.owner_id})
    
    return JsonResponse({"result" : False, "message" : "not valid token"})
    

