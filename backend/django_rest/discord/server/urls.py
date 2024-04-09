from django.urls import path
from server.views import api_auth, api_reg


urlpatterns : list = [
    path("/api/v1/authorization/", api_auth, name="api_auth"),
    path("/api/v1/registration/", api_reg, name="api_reg"),
]