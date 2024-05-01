from django.contrib import admin
from server.models import User, Message, Chat, Server, ServerMessage, ServerChatRoom


admin.site.register(User)
admin.site.register(Message)
admin.site.register(Chat)
admin.site.register(Server)
admin.site.register(ServerMessage)
admin.site.register(ServerChatRoom)