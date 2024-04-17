from django.shortcuts import render
from django.http import JsonResponse
from server.models import User, Message, Chat
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
        data_ : dict = {}
        for user_chat in user_chats:
            for user_ in user_chat.users.all():
                data_[str(user_chat.uuid)] = {
                    "uuid" : user_.uuid,
                    "login" : user_.login,
                    "avatar" : user_.avatar,
                    "status" : user_.is_online,
                }
        return JsonResponse(data={"result" : True, "data" : data_})
    except Exception as e:
        return JsonResponse(data={"result" : False, "error" : f"user not found {e}"})



def api_create_chat(request):
    data : dict = request.POST


    token : str = data.get("token")
    from_user_id : str = data.get("from_user_id")
    users_ids : list = data.get("users_ids")

    owner : User = User.objects.get(uuid=from_user_id)
    members : list = [User.objects.get(uuid=user) for user in users_ids]
    
    users : list = [*owner, *members]

    chat : Chat = Chat.objects.create(users=users)



    return JsonResponse(data={"result" : True, "chat_id" : chat.id})

    

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
    img : str = data.get("media")


    print("chat id: " + chat_id, "from user id: " + from_user_id, "text: " + text, "media: " + img)

    chat : Chat = Chat.objects.get(uuid=chat_id)

    message : Message = Message()
    message.chat_id = chat
    message.from_user_id = from_user_id
    message.content = text
    message.media = img
    message.save()


    chat.messages.add(message)

    
    return JsonResponse(data={"result" : True})