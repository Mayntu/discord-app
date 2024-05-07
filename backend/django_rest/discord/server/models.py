from django.db import models
from uuid import uuid4

from users.models import User



class ServerChatRoom(models.Model):
    uuid = models.UUIDField(default=uuid4, primary_key=True, verbose_name="UUID")
    server_object = models.ForeignKey("Server", on_delete=models.CASCADE)
    title = models.CharField(max_length=256, verbose_name="title")
    messages = models.ManyToManyField("ServerMessage", blank=True)


class Server(models.Model):
    uuid = models.UUIDField(default=uuid4, primary_key=True, verbose_name="UUID")
    title = models.CharField(max_length=32, blank=False, verbose_name="title")
    owner_id = models.CharField(max_length=256, blank=False, verbose_name="owner")
    users = models.ManyToManyField(User, blank=True, verbose_name="users")
    chat_rooms = models.ManyToManyField(ServerChatRoom, blank=True, verbose_name="chat_rooms")
    avatar = models.CharField(max_length=256, verbose_name="avatar")


class ServerMessage(models.Model):
    uuid = models.UUIDField(default=uuid4, primary_key=True, verbose_name="UUID")
    from_user_id = models.CharField(max_length=64, verbose_name="from user id")
    content = models.CharField(max_length=2048, blank=False, verbose_name="content")
    media = models.CharField(max_length=512, null=True, blank=True, verbose_name="media")
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name="date time")
