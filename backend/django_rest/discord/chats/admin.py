from django.contrib import admin
from chats.models import Message, Chat


admin.site.register(Message)
admin.site.register(Chat)