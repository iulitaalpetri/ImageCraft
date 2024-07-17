from rest_framework import serializers
from .models import DetectedObject

class DetectedObjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetectedObject
        fields = '__all__'

