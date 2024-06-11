from django.shortcuts import render
from django.http import JsonResponse, HttpResponseRedirect

from users.models import (
    User,
)
from users.serializers import (
    UserSerializer,
)
from server.models import (
    Server,
    ServerMember,
    InvitationLink,
)
from server.settings import (
    ROLES,
)

from users.utils import (
    generate_jwt,
    get_token,
)
from chats.utils import (
    handle_upload_file
)

import json



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
            
            print(token)

            return JsonResponse(data={"result" : True, "token" : token}, safe=True)
        
        return JsonResponse(data={"result" : False, "error" : "login or email already exists on server"})
    
    return JsonResponse(data={"result" : False, "error" : "method not allowed"})



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



def api_join_server(request, link_data : str):
    headers : dict = request.headers
    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)

    if not token_content:
        return JsonResponse(data={"result" : False, "message" : "not valid token"})



    try:
        invitation_link : InvitationLink = InvitationLink.objects.get(data="invite/" + str(link_data))
    except Exception as e:
        print(e)
        return JsonResponse(data={"result" : False, "message" : "not valid link"})
    
    server_uuid : str = invitation_link.server_uuid

    try:
        server : Server = Server.objects.get(uuid=server_uuid)
        
        user_uuid : str = token_content.get("uuid")

        user : User = User.objects.get(uuid=user_uuid)
        
        server.users.add(user)

        user.servers.add(server)

        server_member : ServerMember = ServerMember.objects.create(
            login=user.login,
            email=user.email,
            password=user.password,
            avatar=user.avatar,
            user_uuid=str(user.uuid),
            name=user.login,
            role=ROLES.user,
        )
        server.members.add(server_member)

        return JsonResponse(data={"result" : True, "message" : "successfully joined server", "server_id" : server_uuid})
    except Exception as e:
        print(e)
        return JsonResponse(data={"result" : False, "message" : "server not exists"})



def api_dejoin_server(request):
    headers : dict = request.headers
    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)

    if not token_content:
        return JsonResponse(data={"result" : False, "message" : "not valid token"})



    data : dict = json.loads(request.body)
    
    server_uuid : str = data.get("server_uuid")

    try:
        server : Server = Server.objects.get(uuid=server_uuid)
        
        user_uuid : str = token_content.get("uuid")

        user : User = User.objects.get(uuid=user_uuid)
        server_member : ServerMember = server.members.get(user_uuid=user_uuid)
        server.members.remove(server_member)
        server_member.delete()
        
        server.users.remove(user)

        user.servers.remove(server)

        return JsonResponse(data={"result" : True, "message" : "successfully joined server", "server_id" : server_uuid})
    except Exception as e:
        print(e)
        return JsonResponse(data={"result" : False, "message" : "server not exists"})



def api_get_token_info(request):
    data : dict = request.POST

    token : str = data.get("token")
    token_content : dict = get_token(token=token)
    return JsonResponse(data={"token_content" : token_content})
