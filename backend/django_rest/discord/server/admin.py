from django.contrib import admin
from server.models import Server, ServerMessage, ServerChatRoom


admin.site.register(Server)
admin.site.register(ServerMessage)
admin.site.register(ServerChatRoom)