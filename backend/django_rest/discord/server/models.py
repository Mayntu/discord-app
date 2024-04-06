from django.db import models
from uuid import uuid4



class User(models.Model):
    uuid = models.UUIDField(default=uuid4, primary_key=True, verbose_name="UUID")
    mail = models.CharField(max_length=128, verbose_name="email")
    login = models.CharField(max_length=64, verbose_name="login")
    password = models.CharField(max_length=64, verbose_name="password")
    avatar = models.CharField(max_length=256, verbose_name="avatar")
    chats = models.ManyToManyField("Chat")


class Message(models.Model):
    uuid = models.UUIDField(default=uuid4, primary_key=True, verbose_name="UUID")
    from_user_id = models.CharField(max_length=64, verbose_name="from user id")
    to_user_id = models.CharField(max_length=64, verbose_name="to user id")
    content = models.CharField(max_length=2048, blank=False, verbose_name="content")
    media = models.CharField(max_length=512, verbose_name="media")
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name="date time")


class Chat(models.Model):
    uuid = models.UUIDField(default=uuid4, primary_key=True, verbose_name="UUID")
    users = models.ManyToManyField(User)
    messages = models.ManyToManyField(Message)