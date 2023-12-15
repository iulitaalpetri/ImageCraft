import datetime

import jwt
from decouple import AutoConfig
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.views import Response
from user.models import User
from edited_photo.models import EditedPhoto

from .models import Photo
from .serializers import PhotoSerializer

config = AutoConfig()

@api_view(["GET"])
def getAllPhotos(request):
    token = request.COOKIES.get("jwt")
    if not token:
        raise AuthenticationFailed("Unauthenticated!")
    try:
        payload = jwt.decode(token, config("DJANGO_JWT_SECRET"), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthenticated!")

    user = User.objects.filter(id=payload["id"]).first()
    photos = user.photos.all()
    serializer = PhotoSerializer(photos, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def postPhoto(request):
    token = request.COOKIES.get("jwt")
    if not token:
        raise AuthenticationFailed("Unauthenticated!")
    try:
        payload = jwt.decode(token, config("DJANGO_JWT_SECRET"), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthenticated!")


    user = User.objects.filter(id=payload["id"]).first()

    # Set the default values for the Photo model
    photo_data = {
        "image": request.data["image"],
        "date": None,  # This will be automatically set to the current date and time
        "edited": False,
    }

    photo = Photo.objects.create(**photo_data)
    user.photos.add(photo)
    user.save()

    serializer = PhotoSerializer(photo)
    return Response(serializer.data)



    
@api_view(["POST"])
def deletePhoto(request, id):
    token = request.COOKIES.get("jwt")
    if not token:
        raise AuthenticationFailed("Unauthenticated!")

    try:
        payload = jwt.decode(token, config("DJANGO_JWT_SECRET"), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthenticated!")

    user = User.objects.filter(id=payload["id"]).first()
    photo = Photo.objects.filter(id=id).first()

    if not photo:
        response = {
            "message": "Photo does not exist!",
            "status": status.HTTP_404_NOT_FOUND,
        }
        return Response(response, status=status.HTTP_404_NOT_FOUND)
    if photo not in user.photos.all():
        response = {
            "message": "You are not allowed to delete this photo!",
            "status": status.HTTP_401_UNAUTHORIZED,
        }
        return Response(response, status=status.HTTP_401_UNAUTHORIZED)
    
    
    photo.delete()
    response = {
        "message": "Photo successfully deleted!",
        "status": status.HTTP_200_OK,
    }
    return Response(response, status=status.HTTP_200_OK)