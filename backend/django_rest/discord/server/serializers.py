from rest_framework import serializers
from server.models import User, Message, Chat

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('uuid', 'email', 'login','password', 'avatar', 'is_online')



class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ("uuid", "from_user_id", "chat_id", "content", "media", "timestamp")



# class ChatSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Chat
#         fields = ("uuid", "users", "messages")