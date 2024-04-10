from django.shortcuts import render
from django.http import JsonResponse
from server.models import User
from server.utils import generate_jwt
import json



def api_auth(request):
    if request.method == "POST":
        data : dict = json.loads(request.body)
        login    : str = data.get("login")
        password : str = data.get("password")

        user_bool : bool = User.objects.filter(login=login, password=password).exists()

        if user_bool:
            user : User = User.objects.get(login=login, password=password)

            token : str = generate_jwt(
                uuid=user.uuid,
                login=user.login,
                password=user.password,
            )

            return JsonResponse(data={"result" : True, "token" : token}, safe=True)
        
        return JsonResponse(data={"result" : False, "error" : "not valid login or password"})
    
    return JsonResponse(data={"result" : False, "error" : "method not allowed"})


def api_reg(request):
    if request.method == "POST":
        data : dict = json.loads(request.body)
        mail     : str = data.get("mail")
        login    : str = data.get("login")
        password : str = data.get("password")

        user_bool = User.objects.filter(login=login) | User.objects.filter(mail=mail)
        user_bool : bool = user_bool.exists()

        if not user_bool:
            user : User = User.objects.create(mail=mail, login=login, password=password)

            token : str = generate_jwt(
                uuid=user.uuid,
                login=user.login,
                password=user.password,
            )

            return JsonResponse(data={"result" : True, "token" : token}, safe=True)
        
        return JsonResponse(data={"result" : False, "error" : "login or mail already exists on server"})
    
    return JsonResponse(data={"result" : False, "error" : "method not allowed"})