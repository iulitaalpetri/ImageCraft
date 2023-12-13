from rest_framework import serializers

from .models import EditedPhoto

class EditedPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EditedPhoto
        fields = '__all__'

    