from rest_framework import serializers

from users.models import User



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('uuid', 'email', 'login', 'password', 'avatar', 'is_online')
