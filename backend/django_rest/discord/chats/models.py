from django.db import models
from uuid import uuid4

from users.models import User


class Message(models.Model):
    uuid = models.UUIDField(default=uuid4, primary_key=True, verbose_name="UUID")
    from_user_id = models.CharField(max_length=64, verbose_name="from user id")
    chat_id = models.ForeignKey("Chat", on_delete=models.CASCADE)
    content = models.CharField(max_length=2048, blank=False, verbose_name="content")
    media = models.CharField(max_length=512, null=True, blank=True, verbose_name="media")
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name="date time")
    has_read : models.BooleanField = models.BooleanField(default=False, verbose_name="has read")


class Chat(models.Model):
    uuid = models.UUIDField(default=uuid4, primary_key=True, verbose_name="UUID")
    users = models.ManyToManyField(User)
    messages = models.ManyToManyField(Message, blank=True)

