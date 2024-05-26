from django.db import models
from uuid import uuid4


class User(models.Model):
    uuid = models.UUIDField(default=uuid4, primary_key=True, verbose_name="UUID")
    email = models.CharField(max_length=128, verbose_name="email")
    login = models.CharField(max_length=64, verbose_name="login")
    password = models.CharField(max_length=64, verbose_name="password")
    avatar = models.CharField(max_length=256, verbose_name="avatar")
    is_online = models.BooleanField(default=False, verbose_name="IS ONLINE")
    chats = models.ManyToManyField("chats.Chat", blank=True)
    servers = models.ManyToManyField("server.Server", blank=True)

