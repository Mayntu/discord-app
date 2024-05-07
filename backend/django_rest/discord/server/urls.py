from django.urls import path
from server.views import (
    api_get_users_chat,
    api_get_users_servers,
    api_create_server,
    api_get_servers_users,
    api_create_server_chat,
    api_get_server_chat_rooms,
    api_get_users_server_chat,
    api_save_server_chat_message,
    api_get_server_room_messages,
    api_delete_server,
    api_delete_servers_message,
    api_delete_server_chat_room,
    api_change_servers_title,
    api_change_servers_avatar,
    api_save_audio_message,
)


urlpatterns : list = [
    path("api/v1/getUsersChat", api_get_users_chat, name="api_get_users_chat"),
    path("api/v1/getUsersServers", api_get_users_servers, name="api_get_users_servers"),
    path("api/v1/createServer", api_create_server, name="api_create_server"),
    path("api/v1/getServersUsers", api_get_servers_users, name="api_get_servers_users"),
    path("api/v1/createServerChat", api_create_server_chat, name="api_create_server_chat"),
    path("api/v1/getServerChatRooms", api_get_server_chat_rooms, name="api_get_server_chat_rooms"),
    path("api/v1/getUsersServerChat", api_get_users_server_chat, name="api_get_users_server_chat"),
    path("api/v1/serverChatMessageSave", api_save_server_chat_message, name="api_save_server_chat_message"),
    path("api/v1/getServerChatRoomMessages", api_get_server_room_messages, name="api_get_server_room_messages"),
    path("api/v1/deleteServer", api_delete_server, name="api_delete_server"),
    path("api/v1/deleteServersMessage", api_delete_servers_message, name="api_delete_servers_message"),
    path("api/v1/deleteServerChatRoom", api_delete_server_chat_room, name="api_delete_server_chat_room"),
    path("api/v1/changeServersTitle", api_change_servers_title, name="api_change_servers_title"),
    path("api/v1/changeServersAvatar", api_change_servers_avatar, name="api_change_servers_avatar"),
    path("api/v1/saveAudioMessage", api_save_audio_message, name="api_save_audio_message"),
]
