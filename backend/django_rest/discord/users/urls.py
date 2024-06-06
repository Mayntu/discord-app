from django.urls import path
from users.views import (
    api_auth,
    api_reg,
    api_get_users_info,
    api_change_profile_avatar,
    api_change_users_login,
    api_make_user_online,
    api_join_server,
    api_dejoin_server,
    api_get_token_info,
)


urlpatterns : list = [
    path("api/v1/authorization", api_auth, name="api_auth"),
    path("api/v1/registration", api_reg, name="api_reg"),
    path("api/v1/getUsersInfo", api_get_users_info, name="api_get_users_info"),
    path("api/v1/changeProfileAvatar", api_change_profile_avatar, name="api_change_profile_avatar"),
    path("api/v1/changeUsersLogin", api_change_users_login, name="api_change_users_login"),
    path("api/v1/makeUserOnline", api_make_user_online, name="api_make_user_online"),
    path("invite/<str:link_data>", api_join_server, name="api_join_server"),
    path("api/v1/dejoinServer", api_dejoin_server, name="api_dejoin_server"),
    path("api/v1/getTokenInfo", api_get_token_info, name="api_get_token_info"),
]