from django.shortcuts import render
from django.http import JsonResponse

from users.models import (
    User,
)
from chats.models import (
    Message,
    Chat,
)
from chats.serializers import (
    MessageSerializer,
)
from users.utils import (
    get_token,
)
from chats.utils import (
    handle_upload_file,
    handle_upload_audio,
)
from chats.speach_recognise import recognise

from discord.settings import BASE_DIR

import json



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
    
    
    token : str = data.get("token")
    token_content : dict | bool = get_token(token=token)

    if not token_content:
        return JsonResponse(data={"result" : False, "error" : "not valid token"})
    


    chat_id : str = data.get("chat_id")
    from_user_id : str = token_content.get("uuid")
    text : str = data.get("text")
    print(request.FILES)
    file_name : str = list(request.FILES.keys())[0] if request.FILES else None
    img = request.FILES.get(file_name) if file_name else None

    
    print(img)

    data_type : str = "text"
    
    if img:
        if not str(img) == "wav":
            media : str = handle_upload_file(file=img)
            data_type : str = "media"
        else:
            media : str = handle_upload_audio(file=img)
            data_type : str = "audio"
            # audio_path : str = f"{BASE_DIR.parent.parent.parent}/frontend/public/{media}"; print(audio_path)
            # data : str = recognise(path=audio_path)
            # print(data)





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
    message_data["has_read"] = message.has_read
    message_data["type"] = data_type

    chat.messages.add(message)

    
    return JsonResponse(data={"result" : True, "message_data" : message_data})



def api_read_message(request):
    headers : dict = request.headers

    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)
    

    if token_content:
        data : dict = json.loads(request.body)

        try:
            message_uuid : str = data.get("message_id")
            message : Message = Message.objects.get(uuid=message_uuid)
        except Exception as e:
            return JsonResponse(data={"result" : False, "message" : "message was not found in database server"})
        

        message.has_read = True
        message.save()
        

        return JsonResponse(data={"result" : True, "message" : "chat delete successfully"})
    
    return JsonResponse(data={"result" : False, "message" : "not valid token"})



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

        chat_id : str = data.get("chat_id")
        count   : int = data.get("count") or 500
        
        chat : Chat = Chat.objects.get(uuid=chat_id)

        temp_messages = chat.messages.all().order_by("-timestamp")
        messages = temp_messages[:count:-1]

        counter : int = len(temp_messages)


        messages_serializer = MessageSerializer(messages, many=True)

        messages_ : list = messages_serializer.data


        return JsonResponse(data={"result" : True, "messages" : messages_, "messages_count" : counter}, safe=False)
    
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



def api_change_chat_message(request):
    headers : dict = request.headers

    
    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)

    
    if not token_content:
        return JsonResponse(data={"result" : False, "message" : "not valid token"})
    
    try:
        data : dict = json.loads(request.body)

        message_uuid : str = data.get("message_uuid")
        new_content : str = data.get("new_content")

        
        message : Message = Message.objects.get(uuid=message_uuid)
        message.content = new_content
        message.save()


    except Exception as e:
        return JsonResponse(data={"result" : False, "message" : "Failed to change chat's message"})



    return JsonResponse(data={"result" : True, "message" : "saved to files"})



def api_delete_users_chat(request):
    headers : dict = request.headers

    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)
    

    if token_content:
        data : dict = json.loads(request.body)

        chat_id : str = data.get("chat_id")
        

        chat : Chat = Chat.objects.get(uuid=chat_id)

        
        chat.delete()


        return JsonResponse(data={"result" : True, "message" : "chat delete successfully"})
    
    
    return JsonResponse(data={"result" : False, "message" : "not valid token"})



def api_recognize_audio(request):
    headers : dict = request.headers

    token : str = headers.get("Authorization").replace('"', "")
    token_content : dict = get_token(token=token)
    

    if token_content:
        data : dict = json.loads(request.body)

        message_uuid : str = data.get("message_id")
        message : Message = Message.objects.get(uuid=message_uuid)

        if not message.content:
            audio_path : str = f"{BASE_DIR.parent.parent.parent}/frontend/public/{message.media}"
            message.content = recognise(path=audio_path)
            message.save()
        

        return JsonResponse(data={"result" : True, "message" : message.content})
    
    return JsonResponse(data={"result" : False, "message" : "not valid token"})

