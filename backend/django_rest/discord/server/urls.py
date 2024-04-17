from django.urls import path
from server.views import api_auth, api_reg,api_get_users_chats, api_save_message


urlpatterns : list = [
    path("api/v1/authorization", api_auth, name="api_auth"),
    path("api/v1/registration", api_reg, name="api_reg"),
    path("api/v1/getUsersChats", api_get_users_chats, name="api_get_users_chats"),
    path("api/v1/saveMessage", api_save_message, name="api_save_message")
]