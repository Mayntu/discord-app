from rest_framework import serializers
from chats.models import Message, Chat


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ("uuid", "from_user_id", "chat_id", "content", "media", "has_read", "timestamp")



class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = ("uuid", "users", "messages")

