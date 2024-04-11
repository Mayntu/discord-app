from django.shortcuts import render
from django.http import JsonResponse
from server.models import User
from server.utils import generate_jwt, get_token
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

            return JsonResponse(data={"result" : True, "token" : token}, safe=True)
        
        return JsonResponse(data={"result" : False, "error" : "login or email already exists on server"})
    
    return JsonResponse(data={"result" : False, "error" : "method not allowed"})



def api_get_users_chats(request):
    print(request.headers)
    data  : dict = request.headers
    token : str  = data.get("Authorization").replace('"', "")
    # print(token)
    token_content = get_token(token=token)
    if not token_content:
        return JsonResponse(data={"result" : False, "result2" : "not valid token"})
    

    uuid = token_content.get("uuid")

    try:
        user : User = User.objects.get(pk=uuid)
        user_chats = user.chats.all()
        print(user_chats)
        data_ : dict = {}
        for user_chat in user_chats:
            for user_ in user_chat.users.all():
                data_[user_chat.uuid] = {
                    "uuid" : user_.uuid,
                    "login" : user_.login,
                    "avatar" : user_.avatar,
                    "status" : user_.is_online,
                }
        return JsonResponse(data={"result" : True, "data" : data_})
    except Exception as e:
        return JsonResponse(data={"result" : False, "error" : f"user not found {e}"})