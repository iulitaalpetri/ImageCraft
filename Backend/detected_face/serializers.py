from rest_framework import serializers

from .models import DetectedFace

class DetectedFaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetectedFace
        fields = '__all__'