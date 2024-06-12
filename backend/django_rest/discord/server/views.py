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
    ServerMember,
    ServerRole,
    Server,
    ServerChatRoom,
    ServerAudioRoom,
    ServerMessage,
    InvitationLink,
    ROLES,
    PERMISSIONS,
)
from server.settings import (
    STRING_PERMISSIONS,
)
from server.serializers import (
    ServerSerializer,
    ServerMessageSerializer,
    ServerRoomSerializer,
    ServerAudioRoomSerializer,
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
    server_member : ServerMember = ServerMember.objects.create(
        login=owner_user.login,
        email=owner_user.email,
        password=owner_user.password,
        avatar=owner_user.avatar,
        user_uuid=str(owner_user.uuid),
        name=owner_user.login,
        role=ROLES.owner,
    )
    server.members.add(server_member)
    print(server_member.role.has_perm(permission=PERMISSIONS.CREATE_CHAT))

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



def api_get_server_members(request):
    data : dict = request.headers


    token : str = data.get("Authorization").replace('"', "")
    token_content : dict = get_token(
        token=token
    )

    if not token_content:
        return JsonResponse(data={"result" : False, "error" : "not valid token"})
    
    
    data : dict = json.loads(request.body)

    
    server_uuid : str = data.get("uuid")

    server : Server = Server.objects.get(uuid=server_uuid)

    server_members = server.members.all()
    
    members : list = []
    for server_member in server_members:
        member : dict = {}
        role : dict = {}
        
        member["uuid"] = server_member.uuid
        member["user_uuid"] = server_member.user_uuid
        member["name"] = server_member.name

        role["uuid"] = server_member.role.uuid
        role["name"] = server_member.role.name
        role["color"] = server_member.role.color
        permissions = server_member.role.permissions.all()
        permissions_ : list = []
        for permission in permissions:
            permission_ : dict = {
                "uuid" : permission.uuid,
                "title" : permission.title,
                "description" : permission.description,
                "is_owner_permission" : permission.is_owner_perm,
            }
            permissions_.append(permission_)
        
        member["permissions"] = permissions_
        member["role"] = role

        member["avatar"] = server_member.avatar

        members.append(member)


    return JsonResponse(data={"result" : True, "users" : members})



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
    is_private : bool = data.get("is_private") == "true"

    user : User = User.objects.get(pk=user_uuid)

    server : Server = Server.objects.get(pk=server_uuid)
    server_member : ServerMember = server.members.filter(user_uuid=user_uuid).first()
    # print(str(user.uuid), str(server.owner_id))

    # if not str(user.uuid) == server.owner_id:
    #     return JsonResponse(data={"result" : False, "message" : "you must be server owner"})

    
    has_create_chat_permission : bool = server_member.role.has_perm(
        permission=PERMISSIONS.CREATE_CHAT,
    )
    has_create_private_chat_permission : bool = server_member.role.has_perm(
        permission=PERMISSIONS.CREATE_PRIVATE_CHAT,
    )
    
    if is_private:
        if not has_create_private_chat_permission:
            return JsonResponse(data={"result" : False, "content" : "user has no permission"})
    
    if not is_private:
        if not has_create_chat_permission:
            return JsonResponse(data={"result" : False, "content" : "user has no permission"})
    

    server_chat_room : ServerChatRoom = ServerChatRoom.objects.create(
        title=chat_room_title,
        server_object=server,
        is_private=is_private,
    )
    server.chat_rooms.add(server_chat_room)

    return JsonResponse(data={"result" : True, "server_chat_room_uuid" : server_chat_room.uuid})



def api_get_server_chat_rooms(request):
    print("get_server_chat_rooms")
    data  : dict = request.headers
    token : str  = data.get("Authorization").replace('"', "")

    token_content = get_token(token=token)
    if not token_content:
        return JsonResponse(data={"result" : False, "message" : "not valid token"})
    
    print("2")


    data : dict = json.loads(request.body)

    user_uuid : str = token_content.get("uuid")
    server_uuid : str = data.get("server_uuid")


    print("3")
    try:
        server : Server = Server.objects.get(uuid=server_uuid)
        print("4")
        server_member : ServerMember = server.members.filter(user_uuid=str(user_uuid)).first()
        print(server_member)
        print(PERMISSIONS.SEE_PRIVATE)
        print(server_member.role.has_perm(PERMISSIONS.SEE_PRIVATE))
        
        if server_member.role.has_perm(PERMISSIONS.SEE_PRIVATE):
            print("5")
            server_chat_rooms = server.chat_rooms.all()
        else:
            print("5")
            server_chat_rooms = server.chat_rooms.filter(is_private=False)
        
        print(server_chat_rooms)
        result : list = []
        for server_chat_room in server_chat_rooms:
            temp : dict = {"uuid" : str(server_chat_room.uuid), "title" : server_chat_room.title, "is_private" : server_chat_room.is_private}
            result.append(temp)
        
        print(result)

        return JsonResponse(data={"result" : True, "data" : result}, safe=False)
    except Exception as e:
        return JsonResponse(data={"result" : False, "error" : f"user not found {e}"})



def api_get_server_chat_room_title(request):
    headers : dict = request.headers


    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(
        token=token,
    )


    if token_content:
        data : dict = json.loads(request.body)

        server_chat_uuid : str = data.get("server_chat_uuid")

        server_chat_room : ServerChatRoom = ServerChatRoom.objects.get(
            uuid=server_chat_uuid,
        )
        server_chat_room_title : str = server_chat_room.title

        return JsonResponse(data={"result" : True, "message" : "found successfully chat", "title" : server_chat_room_title})
    
    return JsonResponse(data={"result" : False, "message" : "token is not valid not really good"})



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



def api_create_server_audio_chat(request):
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
    is_private : bool = data.get("is_private") == "true"

    user : User = User.objects.get(pk=user_uuid)

    server : Server = Server.objects.get(pk=server_uuid)
    server_member : ServerMember = server.members.filter(user_uuid=user_uuid).first()
    # print(str(user.uuid), str(server.owner_id))

    # if not str(user.uuid) == server.owner_id:
    #     return JsonResponse(data={"result" : False, "message" : "you must be server owner"})


    has_create_chat_permission : bool = server_member.role.has_perm(
        permission=PERMISSIONS.CREATE_CHAT,
    )
    has_create_private_chat_permission : bool = server_member.role.has_perm(
        permission=PERMISSIONS.CREATE_PRIVATE_CHAT,
    )
    
    if is_private:
        if not has_create_private_chat_permission:
            return JsonResponse(data={"result" : False, "content" : "user has no permission"})
    
    if not is_private:
        if not has_create_chat_permission:
            return JsonResponse(data={"result" : False, "content" : "user has no permission"})
    

    server_audio_room : ServerAudioRoom = ServerAudioRoom.objects.create(
        title=chat_room_title,
        server_object=server,
        is_private=is_private,
    )
    server.audio_rooms.add(server_audio_room)


    return JsonResponse(data={"result" : True, "server_audio_room_id" : server_audio_room.uuid})



def api_get_server_audio_chat_rooms(request):
    data  : dict = request.headers
    token : str  = data.get("Authorization").replace('"', "")

    token_content = get_token(token=token)
    if not token_content:
        return JsonResponse(data={"result" : False, "message" : "not valid token"})
    
    print("2")


    data : dict = json.loads(request.body)

    user_uuid : str = token_content.get("uuid")
    server_uuid : str = data.get("server_uuid")


    print("3")
    try:
        server : Server = Server.objects.get(uuid=server_uuid)
        print("4")
        server_member : ServerMember = server.members.filter(user_uuid=str(user_uuid)).first()
        print(server_member)
        print(PERMISSIONS.SEE_PRIVATE)
        print(server_member.role.has_perm(PERMISSIONS.SEE_PRIVATE))
        
        if server_member.role.has_perm(PERMISSIONS.SEE_PRIVATE):
            print("5")
            server_audio_rooms = server.audio_rooms.all()
        else:
            print("5")
            server_audio_rooms = server.audio_rooms.filter(is_private=False)
        
        print(server_audio_rooms)
        result : list = []
        for server_audio_room in server_audio_rooms:
            temp : dict = {"uuid" : str(server_audio_room.uuid), "title" : server_audio_room.title, "is_private" : server_audio_room.is_private}
            result.append(temp)
        
        print(result)

        return JsonResponse(data={"result" : True, "data" : result}, safe=False)
    except Exception as e:
        return JsonResponse(data={"result" : False, "error" : f"user not found {e}"})



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
        server_member : ServerMember = server.members.get(user_uuid=str(user.uuid))

        
        if server_member.role.has_perm(permission=PERMISSIONS.DELETE):
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

        user_uuid : str = token_content.get("uuid")

        
        server_message_uuid : str = data.get("server_message_uuid")
        server_id : str = data.get("server_id")
        
        try:
            server : Server = Server.objects.get(uuid=server_id)
            server_member : ServerMember = server.members.get(user_uuid=user_uuid)

            if server_member.role.has_perm(permission=PERMISSIONS.DELETE_MSGS):
                server_message : ServerMessage = ServerMessage.objects.get(uuid=server_message_uuid)


                server_message.delete()


                return JsonResponse(data={"result" : True, "message" : "server message was deleted successfully"})
            
            return JsonResponse(data={"result" : False, "message" : "user has no perms"})
        except Exception as e:
            return JsonResponse(data={"result" : False, "message" : "something not found"})
    
    
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
        server_member : ServerMember = server.members.filter(user_uuid=str(user.uuid)).first()

        
        if server_member.role.has_perm(PERMISSIONS.DELETE_CHAT):
            server_chat_room.delete()
            
            return JsonResponse(data={"result" : True, "message" : "chat delete successfully"})
        
        return JsonResponse(data={"result" : False, "message" : "user has no permissions"})
        
    return JsonResponse(data={"result" : False, "message" : "not valid token"})



def api_delete_server_audio_room(request):
    headers : dict = request.headers

    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)
    

    if token_content:
        data : dict = json.loads(request.body)

        user_id : str = token_content.get("uuid")
        server_id : str = data.get("server_id")
        server_audio_chat_room_id : str = data.get("server_audio_chat_room_id")
        

        user : User = User.objects.get(uuid=user_id)
        server : Server = Server.objects.get(uuid=server_id)
        server_audio_chat_room : ServerAudioRoom = ServerAudioRoom.objects.get(uuid=server_audio_chat_room_id)
        server_member : ServerMember = server.members.filter(user_uuid=str(user.uuid)).first()


        if not server_member.role.has_perm(permission=PERMISSIONS.DELETE_CHAT):
            return JsonResponse(data={"result" : False, "message" : "user has not permissions"})
        
        
        server_audio_chat_room.delete()

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

        user_uuid : str = token_content.get("uuid")
        server_uuid : str = data.get("server_uuid")
        title : str = data.get("title")

        
        server : Server = Server.objects.get(uuid=server_uuid)
        server_member : ServerMember = server.members.get(user_uuid=user_uuid)

        if server_member.role.has_perm(PERMISSIONS.RENAME):
            server.title = title
            
            server.save()

            return JsonResponse(data={"result" : True, "message" : "successfully renamed server", "new_title" : server.title})
        
        return JsonResponse(data={"result" : False, "message" : "user has no permissions(нет прав)"})
    
    except Exception as e:
        return JsonResponse(data={"result" : False, "message" : "failed to change server title"})



def api_change_servers_avatar(request):
    headers : dict = request.headers

    
    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)

    
    if not token_content:
        return JsonResponse(data={"result" : False, "message" : "not valid token"})
    


    files = request.FILES

    owner_user_id : str = token_content.get("uuid")

    server_uuid : str = request.POST.get("title")

    avatar : str = files.get("file")


    filename : str = ""
    server : Server = Server.objects.get(uuid=server_uuid)
    server_member : ServerMember = server.members.get(user_uuid=owner_user_id)

    if not server_member.role.has_perm(permission=PERMISSIONS.REAVTR):
        return JsonResponse({"result" : False, "message" : "user must be server owner to change"})
    
    
    if avatar:
        filename : str = handle_upload_file_server(file=avatar, server_id=server_uuid)
        server.avatar = filename
        server.save()


    return JsonResponse(data={"result" : True, "server_id" : server.uuid})



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
        

        return JsonResponse(data={"result" : True, "message" : message.content})
    
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



def api_insert_moderator(request):
    headers : dict = request.headers

    
    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)

    
    if not token_content:
        return JsonResponse(data={"result" : False, "message" : "not valid token"})
    

    
    try:
        data : dict = json.loads(request.body)

        user_uuid : str = token_content.get("uuid")
        server_uuid : str = data.get("server_uuid")
        new_user_uuid : str = data.get("user_uuid")


        server : Server = Server.objects.get(uuid=server_uuid)
        server_member : ServerMember = server.members.get(user_uuid=user_uuid)
        
        has_perm : bool = server_member.role.has_perm(
            permission=PERMISSIONS.DELETE
        )

        if has_perm:
            moderator : ServerMember = server.members.get(user_uuid=new_user_uuid)
            moderator.role = ROLES.moderator
            moderator.save()

            return JsonResponse(data={"result" : True, "message" : "moderator added successfully"})
        
        return JsonResponse(data={"result" : False, "message" : "user has no permissions to add moderator"})
    except Exception as e:
        return JsonResponse(data={"result" : False, "message" : "failed to change server's message"})



def api_delete_moderator(request):
    headers : dict = request.headers

    
    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)

    
    if not token_content:
        return JsonResponse(data={"result" : False, "message" : "not valid token"})
    

    
    try:
        data : dict = json.loads(request.body)

        user_uuid : str = token_content.get("uuid")
        server_uuid : str = data.get("server_uuid")
        new_user_uuid : str = data.get("user_uuid")


        server : Server = Server.objects.get(uuid=server_uuid)
        server_member : ServerMember = server.members.get(user_uuid=user_uuid)
        
        has_perm : bool = server_member.role.has_perm(
            permission=PERMISSIONS.DELETE
        )

        if has_perm:
            delete_moderator : ServerMember = server.members.get(user_uuid=new_user_uuid)
            delete_moderator.role = ROLES.user
            delete_moderator.save()

            return JsonResponse(data={"result" : True, "message" : "moderator deleted successfully"})
        
        return JsonResponse(data={"result" : False, "message" : "user does not have permissions to delete"})
    except Exception as e:
        return JsonResponse(data={"result" : False, "message" : "failed to change server's message"})



def api_create_role(request):
    headers : dict = request.headers

    
    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)

    
    if not token_content:
        return JsonResponse(data={"result" : False, "message" : "not valid token"})
    
    try:
        data : dict = json.loads(request.body)

        user_uuid : str = token_content.get("uuid")
        server_uuid : str = data.get("server_uuid")
        role_name : str = data.get("role_name")
        role_color : str = data.get("role_color")
        permissions : list = data.get("permissions")

        server : Server = Server.objects.get(uuid=server_uuid)
        server_member : ServerMember = server.members.get(user_uuid=user_uuid)

        if server_member.role.has_perm(permission=PERMISSIONS.CREATE_ROLE):
            server_role : ServerRole = ServerRole.objects.create(
                name=role_name,
                color=role_color,
            )

            for permission in permissions:
                perm = STRING_PERMISSIONS.get(permission)

                if perm:
                    server_role.permissions.add(perm)
            
            
            server.roles.add(server_role)
            return JsonResponse(data={"result" : True, "message" : "role was created", "role_uuid" : server_role.uuid})
        
        return JsonResponse(data={"result" : False, "message" : "user has no permissions"})

    except Exception as e:
        return JsonResponse(data={"result" : False, "message" : "failed to change server's message"})



def api_delete_role(request):
    headers : dict = request.headers

    
    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)

    
    if not token_content:
        return JsonResponse(data={"result" : False, "message" : "not valid token"})
    
    try:
        data : dict = json.loads(request.body)

        user_uuid : str = token_content.get("uuid")
        server_uuid : str = data.get("server_uuid")
        role_uuid : str = data.get("role_uuid")

        server : Server = Server.objects.get(uuid=server_uuid)
        server_member : ServerMember = server.members.get(user_uuid=user_uuid)

        if server_member.role.has_perm(permission=PERMISSIONS.CREATE_ROLE):
            server_role : ServerRole = ServerRole.objects.get(
                uuid=role_uuid,
            )
            members_with_role : list = server.members.filter(role=server_role)

            for member_with_role in members_with_role:
                member_with_role.role = ROLES.user
                member_with_role.save()
            
            server_role.delete()
            

            return JsonResponse(data={"result" : True, "message" : "role was created"})
        
        return JsonResponse(data={"result" : False, "message" : "user has no permissions"})

    except Exception as e:
        return JsonResponse(data={"result" : False, "message" : "failed to change server's message"})



def api_remove_role(request):
    headers : dict = request.headers


    token : str = headers.get("Authorization").replace('"', '')
    token_content : dict = get_token(
        token=token,
    )


    if not token_content:
        return JsonResponse(data={"result" : False, "message" : "token is not valid and not decrypted"})
    

    try:
        data : dict = json.loads(request.body)


        user_uuid : str = token_content.get("uuid")
        server_uuid : str = data.get("server_uuid")
        user_to_remove_uuid : str = data.get("user_to_remove_uuid")

        server : Server = Server.objects.get(uuid=server_uuid)
        server_member : ServerMember = server.members.get(user_uuid=user_uuid)

        has_perm : bool = server_member.role.has_perm(
            permission=PERMISSIONS.CREATE_ROLE,
        )

        if has_perm:
            server_member_to_remove : ServerMember = server.members.get(user_uuid=user_to_remove_uuid)
            server_member_to_remove.role = ROLES.user
            server_member_to_remove.save()

            return JsonResponse(data={"result" : True, "message" : "role removed successfully from user server member"})
        return JsonResponse(data={"result" : False, "message" : "user has no permissions to remove role"})
    except Exception as e:
        print(e)
        return JsonResponse(data={"result" : False, "message" : "could not find requested data by data"})



def api_check_user_permission(request):
    headers : dict = request.headers

    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)

    
    if not token_content:
        return JsonResponse(data={"result" : False, "message" : "not valid token"})
    

    data : dict = json.loads(request.body)

    user_uuid : str = str(token_content.get("uuid"))

    server_uuid : str = data.get("server_uuid")
    permission : str = data.get("permission")

    if not permission in STRING_PERMISSIONS.keys():
        return JsonResponse(data={"result" : False, "message" : "permission not found"})
    
    
    server : Server = Server.objects.get(uuid=server_uuid)
    server_member : ServerMember = server.members.filter(user_uuid=user_uuid).first()

    has_permission : bool = server_member.role.has_perm(
        permission=STRING_PERMISSIONS[permission],
    )

    return JsonResponse(data={"result" : True, "has_permission" : has_permission})



def api_add_user_role(request):
    headers : dict = request.headers
    
    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)

    if token_content:


        data : dict = json.loads(request.body)


        user_uuid : str = token_content.get("uuid")
        server_uuid : str = data.get("server_uuid")
        role_uuid : str = data.get("role_uuid")
        user_uuid_to_add : str = data.get("user_uuid_to_add")

        try:
            server : Server = Server.objects.get(uuid=server_uuid)
            server_member : ServerMember = server.members.get(user_uuid=user_uuid)

            has_permission : bool = server_member.role.has_perm(
                permission=PERMISSIONS.CREATE_ROLE,
            )

            if not has_permission:
                return JsonResponse(data={"result" : True, "message" : "user not permission"})

            role : ServerRole = ServerRole.objects.get(uuid=role_uuid)
            server_member_to_add_role : ServerMember = server.members.get(user_uuid=user_uuid_to_add)
            server_member_to_add_role.role = role
            server_member_to_add_role.save()

            return JsonResponse(data={"result" : True, "message" : "role was added"})
        except Exception as e:
            return JsonResponse(data={"result" : False, "message" : "something not found"})



def api_get_all_permissions(request):
    headers : dict = request.headers

    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)

    
    if not token_content:
        return JsonResponse(data={"result" : False, "message" : "not valid token"})
    

    """
        [
            {
                "key" : "DELETE",
                "title" : "Удалить этот сервер",
                "is_owner" : True,
            },
            {
                "key" : "DELETS_MSGS",
                "title" : "Удалить сообщение чата",
                "is_owner" : False,
            },
        ]
    """
    string_permissions_keys : list = list(STRING_PERMISSIONS.keys())

    permissions : list = []
    for string_permission_key in string_permissions_keys:
        permission : dict = {}

        key : str = string_permission_key
        description : str = STRING_PERMISSIONS[string_permission_key].description
        is_owner : bool = STRING_PERMISSIONS[string_permission_key].is_owner_perm
        permission["key"] = key
        permission["description"] = description
        permission["is_owner"] = is_owner

        permissions.append(permission)


    
    return JsonResponse(data={"result" : True, "permissions" : permissions})



def api_get_servers_roles(request):
    headers : dict = request.headers

    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)

    if token_content:
        data : dict = json.loads(request.body)

        user_uuid : str = token_content.get("uuid")
        server_uuid : str = data.get("server_uuid")

        user : User = User.objects.get(uuid=user_uuid)
        server : Server = Server.objects.get(uuid=server_uuid)
        server_member : ServerMember = server.members.get(user_uuid=str(user.uuid))
        server_roles : list = server.roles.all()
        roles : list = []

        for server_role in server_roles:
            server_role_dict : dict = {
                "uuid" : server_role.uuid,
                "name" : server_role.name,
                "color" : server_role.color,
            }
            permissions = server_role.permissions.all()
            permissions_ : list = []

            for permission in permissions:
                permission_dict : dict = {
                    "uuid" : permission.uuid,
                    "title" : permission.title,
                    "description" : permission.description,
                    "is_owner_permission" : permission.is_owner_perm,
                }
                permissions_.append(permission_dict)
            
            server_role_dict["permissions"] = permissions_
            roles.append(server_role_dict)
        
        return JsonResponse(data={"result" : True, "server_roles" : roles})



def api_get_server_members_role_permissions_is_available(request):
    headers : dict = request.headers

    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)

    if token_content:
        data : dict = json.loads(request.body)

        user_uuid : str = token_content.get("uuid")
        server_uuid : str = data.get("server_uuid")

        user : User = User.objects.get(uuid=user_uuid)
        server : Server = Server.objects.get(uuid=server_uuid)
        server_member : ServerMember = server.members.get(user_uuid=str(user.uuid))

        server_member_permissions = server_member.role.permissions.all()
        string_permissions_keys : list = list(STRING_PERMISSIONS.keys())

        permissions : list = []
        for string_permission_key in string_permissions_keys:
            permission : dict = {}

            key : str = string_permission_key
            is_available : bool = STRING_PERMISSIONS[string_permission_key] in server_member_permissions

            permission["key"] = key
            permission["is_available"] = is_available

            permissions.append(permission)
        
        return JsonResponse(data={"result" : True, "permissions" : permissions})



def api_get_server_members_role(request):
    headers : dict = request.headers


    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)


    if not token_content:
        return JsonResponse(data={"result" : False, "message" : "token is not valid not enough segments"})
    

    data : dict = json.loads(request.body)


    user_uuid : str = token_content.get("uuid")
    server_uuid : str = data.get("server_uuid")


    user : User = User.objects.get(uuid=user_uuid)
    server : Server = Server.objects.get(uuid=server_uuid)
    server_member : ServerMember = server.members.filter(user_uuid=str(user.uuid)).first()

    server_member_role : ServerRole = server_member.role

    server_member_role_dict : dict = {
        "uuid" : server_member_role.uuid,
        "name" : server_member_role.name,
        "color" : server_member_role.color,
    }
    permissions = server_member_role.permissions.all()
    permissions_ : list = []

    for permission in permissions:
        permission_dict : dict = {
            "uuid" : permission.uuid,
            "title" : permission.title,
            "description" : permission.description,
            "is_owner_permission" : permission.is_owner_perm,
        }
        permissions_.append(permission_dict)
    
    server_member_role_dict["permissions"] = permissions_


    return JsonResponse(data={"result" : True, "role" : server_member_role_dict})


