from django.urls import path
from chats.views import (
    api_get_users_chats,
    api_save_message,
    api_get_chat_messages,
    api_find_users,
    api_create_chat,
    api_delete_message,
    api_delete_users_chat,
)


urlpatterns : list = [
    path("api/v1/getUsersChats", api_get_users_chats, name="api_get_users_chats"),
    path("api/v1/saveMessage", api_save_message, name="api_save_message"),
    path("api/v1/getChatMessages", api_get_chat_messages, name="api_get_chat_messages"),
    path("api/v1/findUsers", api_find_users, name="api_find_users"),
    path("api/v1/createChat", api_create_chat, name="api_create_chat"),
    path("api/v1/deleteMessage", api_delete_message, name="api_delete_message"),
    path("api/v1/deleteUsersChat", api_delete_users_chat, name="api_delete_users_chat"),
]