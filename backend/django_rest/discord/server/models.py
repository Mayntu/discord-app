from django.db import models
from uuid import uuid4

from users.models import User
from server.settings import ServerRole, PERMISSIONS, ROLES

"""
    Функционал на сервере:

    Owner:
        1. Удалять сервер.
        2. Переименовывать сервер.
        3. Изменять аватарку сервера.
    
    Owner / Moderator
        1. Создавать обычные каналы.
        2. Создавать приватные каналы (текст, аудио).
        3. Удалять каналы.
        4. Приглашать пользователей, удалять пользователей.
        5. Просматривать все каналы и приватные и обычные.
        6. Удалять сообщения.
        7. Создавать роли.
"""

class ServerAudioRoom(models.Model):
    uuid = models.UUIDField(default=uuid4, primary_key=True, verbose_name="UUID")
    server_object = models.ForeignKey("Server", on_delete=models.CASCADE)
    title = models.CharField(max_length=256, verbose_name="title")
    is_private = models.BooleanField(default=False, verbose_name="is private?")



class ServerChatRoom(models.Model):
    uuid = models.UUIDField(default=uuid4, primary_key=True, verbose_name="UUID")
    server_object = models.ForeignKey("Server", on_delete=models.CASCADE)
    title = models.CharField(max_length=256, verbose_name="title")
    is_private = models.BooleanField(default=False, verbose_name="private?")
    messages = models.ManyToManyField("ServerMessage", blank=True)


class ServerMember(User):
    user_uuid = models.CharField(max_length=32, null=True, verbose_name="APP USER UUID")
    name = models.CharField(max_length=64, verbose_name="name")
    role = models.ForeignKey(ServerRole, default=ROLES.user.uuid, on_delete=models.PROTECT, verbose_name="role")
    
class Server(models.Model):
    uuid = models.UUIDField(default=uuid4, primary_key=True, verbose_name="UUID")
    title = models.CharField(max_length=32, blank=False, verbose_name="title")
    owner_id = models.CharField(max_length=256, blank=False, verbose_name="owner")
    users = models.ManyToManyField(User, blank=True, verbose_name="users", related_name="users")
    members = models.ManyToManyField(ServerMember, blank=True, verbose_name="members", related_name="members")
    moderators = models.ManyToManyField(User, blank=True, verbose_name="moderators", related_name="moderators")
    roles = models.ManyToManyField(ServerRole, blank=True, verbose_name="roles", related_name="roles")
    chat_rooms = models.ManyToManyField(ServerChatRoom, blank=True, verbose_name="chat_rooms")
    audio_rooms = models.ManyToManyField(ServerAudioRoom, blank=True, verbose_name="audio_rooms")
    avatar = models.CharField(max_length=256, verbose_name="avatar")


class ServerMessage(models.Model):
    uuid = models.UUIDField(default=uuid4, primary_key=True, verbose_name="UUID")
    from_user_id = models.CharField(max_length=64, verbose_name="from user id")
    content = models.CharField(max_length=2048, blank=False, verbose_name="content")
    media = models.CharField(max_length=512, null=True, blank=True, verbose_name="media")
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name="date time")


class InvitationLink(models.Model):
    uuid = models.UUIDField(default=uuid4, primary_key=True, verbose_name="UUID_")
    data = models.CharField(max_length=64, verbose_name="invitation_link_data")
    server_uuid = models.CharField(max_length=64, verbose_name="server_uuid")
