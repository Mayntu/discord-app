from rest_framework import serializers
from server.models import Server, ServerMessage, ServerChatRoom, ServerAudioRoom


class ServerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Server
        fields = ("uuid", "title", "owner_id", "chat_rooms", 'avatar')



class ServerMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServerMessage
        fields = ("uuid", "from_user_id", "content", "media", "timestamp")



class ServerRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServerChatRoom
        fields = ("uuid", "title", "messages")


class ServerAudioRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServerAudioRoom
        fields = ("uuid", "title")
