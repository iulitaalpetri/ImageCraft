from rest_framework import serializers

from .models import User
from rest_framework.exceptions import ValidationError
import jwt




class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    

    # def validate_email(self, value):
    #     # Check if any user already exists with this email
    #     if User.objects.filter(email=value).exists():
    #         raise serializers.ValidationError("A user with that email already exists.")
    #     return value
    
    
                  

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        instance.username = validated_data.get("username", instance.username)
        instance.email = validated_data.get("email", instance.email)
        if password is not None:
            instance.set_password(password)  # criptata
        instance.save()
        return instance
