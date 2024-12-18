from django.urls import path
from server.views import (
    api_get_users_chat,
    api_get_users_servers,
    api_create_server,
    api_get_servers_users,
    api_get_server_members,
    api_create_server_chat,
    api_get_server_chat_rooms,
    api_get_server_chat_room_title,
    api_get_users_server_chat,
    api_create_server_audio_chat,
    api_get_server_audio_chat_rooms,
    api_save_server_chat_message,
    api_get_server_room_messages,
    api_delete_server,
    api_delete_servers_message,
    api_delete_server_chat_room,
    api_delete_server_audio_room,
    api_change_servers_title,
    api_change_servers_avatar,
    api_change_server_message,
    api_get_invitation_link,
    api_save_audio_message,
    api_recognize_audio_server,
    api_check_user,
    api_insert_moderator,
    api_delete_moderator,
    api_create_role,
    api_delete_role,
    api_remove_role,
    api_check_user_permission,
    api_add_user_role,
    api_get_all_permissions,
    api_get_servers_roles,
    api_get_server_members_role_permissions_is_available,
    api_get_server_members_role,
)


urlpatterns : list = [
    path("api/v1/getUsersChat", api_get_users_chat, name="api_get_users_chat"),
    path("api/v1/getUsersServers", api_get_users_servers, name="api_get_users_servers"),
    path("api/v1/createServer", api_create_server, name="api_create_server"),
    path("api/v1/getServersUsers", api_get_servers_users, name="api_get_servers_users"),
    path("api/v1/getServersMembers", api_get_server_members, name="api_get_server_members"),
    path("api/v1/createServerChat", api_create_server_chat, name="api_create_server_chat"),
    path("api/v1/getServerChatRooms", api_get_server_chat_rooms, name="api_get_server_chat_rooms"),
    path("api/v1/getServerChatRoomTitle", api_get_server_chat_room_title, name="api_get_server_chat_room_title"),
    path("api/v1/getUsersServerChat", api_get_users_server_chat, name="api_get_users_server_chat"),
    path("api/v1/createServerAudioChatRoom", api_create_server_audio_chat, name="api_create_server_audio_chat"),
    path("api/v1/getServerAudioChatRooms", api_get_server_audio_chat_rooms, name="api_get_server_audio_chat_rooms"),
    path("api/v1/serverChatMessageSave", api_save_server_chat_message, name="api_save_server_chat_message"),
    path("api/v1/getServerChatRoomMessages", api_get_server_room_messages, name="api_get_server_room_messages"),
    path("api/v1/deleteServer", api_delete_server, name="api_delete_server"),
    path("api/v1/deleteServersMessage", api_delete_servers_message, name="api_delete_servers_message"),
    path("api/v1/deleteServerChatRoom", api_delete_server_chat_room, name="api_delete_server_chat_room"),
    path("api/v1/deleteServerAudioRoom", api_delete_server_audio_room, name="api_delete_server_audio_room"),
    path("api/v1/changeServersTitle", api_change_servers_title, name="api_change_servers_title"),
    path("api/v1/changeServersAvatar", api_change_servers_avatar, name="api_change_servers_avatar"),
    path("api/v1/changeServerMessage", api_change_server_message, name="api_change_server_message"),
    path("api/v1/getInvitationLink", api_get_invitation_link, name="api_get_invitation_link"),
    path("api/v1/saveAudioMessage", api_save_audio_message, name="api_save_audio_message"),
    path("api/v1/recognizeAudioServer", api_recognize_audio_server, name="api_recognize_audio_server"),
    path("api/v1/checkServerUser", api_check_user, name="api_check_user"),
    path("api/v1/insertModerator", api_insert_moderator, name="api_insert_moderator"),
    path("api/v1/deleteModerator", api_delete_moderator, name="api_delete_moderator"),
    path("api/v1/createRole", api_create_role, name="api_create_role"),
    path("api/v1/deleteRole", api_delete_role, name="api_delete_role"),
    path("api/v1/removeRole", api_remove_role, name="api_remove_role"),
    path("api/v1/checkUserPermission", api_check_user_permission, name="api_check_user_permission"),
    path("api/v1/addUserRole", api_add_user_role, name="api_add_user_role"),
    path("api/v1/getAllPermissions", api_get_all_permissions, name="api_get_all_permissions"),
    path("api/v1/getServersRoles", api_get_servers_roles, name="api_get_servers_roles"),
    path("api/v1/getServerMembersRolePermissionsIsAvailable", api_get_server_members_role_permissions_is_available, name="api_get_server_members_role_permissions_is_available"),
    path("api/v1/getServerMembersRole", api_get_server_members_role, name="api_get_server_members_role"),
]
