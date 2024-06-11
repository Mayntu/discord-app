from typing import Any
from django.db import models
from uuid import uuid4
from threading import Thread
from time import sleep

import json



class ServerRole(models.Model):
    uuid = models.UUIDField(default=uuid4, primary_key=True, verbose_name="UUID")
    name = models.CharField(max_length=17, verbose_name="name")
    color = models.CharField(max_length=32, verbose_name="color")
    permissions = models.ManyToManyField("Permission", verbose_name="permissions")


    def has_perm(self, permission : "Permission") -> bool:
        return permission in self.permissions.all()



# class Role:
#     title : str
#     permissions : list
#     color : str
class COMMON_ROLE_NAMES:
    owner : str = "owner"
    moderator : str = "moderator"
    user : str = "user"




# class Permission:
#     def __init__(self, title : str, description : str = None, owner_perm : bool = False) -> None:
#         self.title = title
#         self.description = description
#         self.owner_perm = owner_perm



class Permission(models.Model):
    uuid = models.UUIDField(default=uuid4, primary_key=True, verbose_name="UUID")
    title = models.CharField(max_length=64, verbose_name="permission title")
    description = models.CharField(max_length=1024, default="", verbose_name="description")
    is_owner_perm = models.BooleanField(default=False, verbose_name="is owner permission")



class Permissions:
    def __init__(self) -> None:
        self.DELETE : Permission = Permission.objects.get_or_create(title="delete server", is_owner_perm=True)[0]
        self.DELETE.description = "Удалить этот сервер"
        self.DELETE.save()
        self.RENAME : Permission = Permission.objects.get_or_create(title="rename server", is_owner_perm=True)[0]
        self.RENAME.description = "Переименовать этот сервер"
        self.RENAME.save()
        self.REAVTR : Permission = Permission.objects.get_or_create(title="reavatar server", is_owner_perm=True)[0]
        self.REAVTR.description = "Изменить аватарку сервера"
        self.REAVTR.save()

        self.CREATE_CHAT : Permission = Permission.objects.get_or_create(title="create server chat")[0]
        self.CREATE_CHAT.description = "Создать чат на сервере"
        self.CREATE_CHAT.save()
        self.DELETE_CHAT : Permission = Permission.objects.get_or_create(title="delete server chat")[0]
        self.DELETE_CHAT.description = "Удалить чат на сервере"
        self.DELETE_CHAT.save()
        self.INVITE_USER : Permission = Permission.objects.get_or_create(title="invite server user")[0]
        self.INVITE_USER.description = "Получить ссылку приглашения"
        self.INVITE_USER.save()
        self.DELETE_USER : Permission = Permission.objects.get_or_create(title="delete server user")[0]
        self.DELETE_USER.description = "Удалять пользователей сервера"
        self.DELETE_USER.save()
        self.SEE_PRIVATE : Permission = Permission.objects.get_or_create(title="view private chats")[0]
        self.SEE_PRIVATE.description = "Просматривать частные чаты"
        self.SEE_PRIVATE.save()
        self.DELETE_MSGS : Permission = Permission.objects.get_or_create(title="delete any message")[0]
        self.DELETE_MSGS.description = "Удалять разные сообщения"
        self.DELETE_MSGS.save()
        self.CREATE_ROLE : Permission = Permission.objects.get_or_create(title="create custom role")[0]
        self.CREATE_ROLE.description = "Создавать кастомные роли"
        self.CREATE_ROLE.save()
        self.CREATE_PRIVATE_CHAT : Permission = Permission.objects.get_or_create(title="create server private chat")[0]
        self.CREATE_PRIVATE_CHAT.description = "Создавать частные чаты"
        self.CREATE_PRIVATE_CHAT.save()


    def all(self) -> list:
        permissions : list = [
            self.DELETE,
            self.RENAME,
            self.REAVTR,
            
            self.CREATE_CHAT,
            self.DELETE_CHAT,
            self.INVITE_USER,
            self.DELETE_USER,
            self.SEE_PRIVATE,
            self.DELETE_MSGS,
            self.CREATE_ROLE,
            self.CREATE_PRIVATE_CHAT,
        ]
        return permissions
    

    def moderator(self) -> list:
        permissions : list = [
            self.CREATE_CHAT,
            self.DELETE_CHAT,
            self.INVITE_USER,
            self.DELETE_USER,
            self.SEE_PRIVATE,
            self.DELETE_MSGS,
            self.CREATE_ROLE,
            self.CREATE_PRIVATE_CHAT,
        ]
        return permissions



# class Permissions:
#     DELETE : Permission = Permission(title="delete server", owner_perm=True)
#     RENAME : Permission = Permission(title="rename server", owner_perm=True)
#     REAVTR : Permission = Permission(title="reavatar server", owner_perm=True)

#     CREATE_CHAT : Permission = Permission(title="create server chat")
#     DELETE_CHAT : Permission = Permission(title="delete server chat")
#     INVITE_USER : Permission = Permission(title="invite server user")
#     DELETE_USER : Permission = Permission(title="delete server user")
#     SEE_PRIVATE : Permission = Permission(title="view private chats")
#     DELETE_MSGS : Permission = Permission(title="delete any message")
#     CREATE_ROLE : Permission = Permission(title="create custom role")
#     CREATE_PRIVATE_CHAT : Permission = Permission(title="create server private chat")


#     def all(self) -> list:
#         permissions : list = [
#             self.DELETE,
#             self.RENAME,
#             self.REAVTR,
            
#             self.CREATE_CHAT,
#             self.DELETE_CHAT,
#             self.INVITE_USER,
#             self.DELETE_USER,
#             self.SEE_PRIVATE,
#             self.DELETE_MSGS,
#             self.CREATE_ROLE,
#             self.CREATE_PRIVATE_CHAT,
#         ]
#         return permissions
    

#     def moderator(self) -> list:
#         permissions : list = [
#             self.CREATE_CHAT,
#             self.DELETE_CHAT,
#             self.INVITE_USER,
#             self.DELETE_USER,
#             self.SEE_PRIVATE,
#             self.DELETE_MSGS,
#             self.CREATE_ROLE,
#             self.CREATE_PRIVATE_CHAT,
#         ]
#         return permissions


PERMISSIONS : Permissions = Permissions()

STRING_PERMISSIONS : dict = {
    "DELETE" : PERMISSIONS.DELETE,
    "RENAME" : PERMISSIONS.RENAME,
    "REAVTR" : PERMISSIONS.REAVTR,

    "CREATE_CHAT" : PERMISSIONS.CREATE_CHAT,
    "DELETE_CHAT" : PERMISSIONS.DELETE_CHAT,
    "INVITE_USER" : PERMISSIONS.INVITE_USER,
    "DELETE_USER" : PERMISSIONS.DELETE_USER,
    "SEE_PRIVATE" : PERMISSIONS.SEE_PRIVATE,
    "DELETE_MSGS" : PERMISSIONS.DELETE_MSGS,
    "CREATE_ROLE" : PERMISSIONS.CREATE_ROLE,
    "CREATE_PRIVATE_CHAT" : PERMISSIONS.CREATE_PRIVATE_CHAT,
}

def init_permissions() -> None:
    sleep(0.1)
    global PERMISSIONS
    PERMISSIONS = Permissions()


thread_init_permissions : Thread = Thread(target=init_permissions)



def create_default_roles() -> None:
    sleep(0.2)
    try:
        owner_role : ServerRole = ServerRole.objects.get(
            name=COMMON_ROLE_NAMES.owner,
        )
    except:
        owner_role : ServerRole = ServerRole.objects.create(
            name=COMMON_ROLE_NAMES.owner,
            color="red"
        )
        permissions : list = PERMISSIONS.all()
        for permission in permissions:
            owner_role.permissions.add(permission)
    try:
        moderator_role : ServerRole = ServerRole.objects.get(
            name=COMMON_ROLE_NAMES.moderator,
        )
    except:
        moderator_role : ServerRole = ServerRole.objects.create(
            name=COMMON_ROLE_NAMES.moderator,
            color="blue"
        )
        permissions : list = PERMISSIONS.moderator()
        for permission in permissions:
            moderator_role.permissions.add(permission)

    try:
        user_role : ServerRole = ServerRole.objects.get(
            name=COMMON_ROLE_NAMES.user,
        )
    except:
        user_role : ServerRole = ServerRole.objects.create(
            name=COMMON_ROLE_NAMES.user,
            color="default"
        )
        permissions : list = []
        for permission in permissions:
            user_role.permissions.add(permission)


thread : Thread = Thread(target=create_default_roles)
# def delete_roles() -> None:
#     sleep(0.07)
#     server_roles = ServerRole.objects.all().delete()


# delete_roles_thread : Thread = Thread(target=delete_roles)
# delete_roles_thread.start()


class Roles:
    def __init__(self) -> None:
        self.owner : ServerRole = ServerRole.objects.get(name=COMMON_ROLE_NAMES.owner)
        # print(owner.permissions)
        self.moderator : ServerRole = ServerRole.objects.get(name=COMMON_ROLE_NAMES.moderator)
        self.user : ServerRole = ServerRole.objects.get(name=COMMON_ROLE_NAMES.user)

ROLES : Roles = Roles()


def init_roles() -> None:
    sleep(0.15)
    global ROLES
    ROLES = Roles()


thread_init_roles : Thread = Thread(target=init_roles)



thread_init_permissions.start()
thread_init_roles.start()
thread.start()
