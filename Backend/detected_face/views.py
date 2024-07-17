import datetime

import jwt
from decouple import AutoConfig
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.views import Response
from user.models import User

from .models import DetectedFace
from .serializers import DetectedFaceSerializer

config = AutoConfig()

@api_view(['POST'])
def addDetectedFace(request, image_id):
    token = request.COOKIES.get("jwt")
    if not token:
        raise AuthenticationFailed("Unauthenticated!")

    try:
        payload = jwt.decode(token, config("DJANGO_JWT_SECRET"), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthenticated!")

    
    user = User.objects.filter(id=payload['id']).first()

    image = user.photos.filter(id=image_id).first()

    if not image:
        response = {
            'message': 'Image not found',
            "status": status.HTTP_404_NOT_FOUND,
        }
        return Response(response)
    
    serializer = DetectedFaceSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    user.photos.filter(id=image_id).update(detected_faces=serializer.data['id'])
    return Response(serializer.data, status=status.HTTP_201_CREATED)

    
@api_view(['GET'])
def getAllDetectedFacesinPhoto(request, image_id):
    token = request.COOKIES.get("jwt")
    if not token:
        raise AuthenticationFailed("Unauthenticated!")

    try:
        payload = jwt.decode(token, config("DJANGO_JWT_SECRET"), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthenticated!")

    
    user = User.objects.filter(id=payload['id']).first()

    image = user.photos.filter(id=image_id).first()

    if not image:
        response = {
            'message': 'Image not found',
            "status": status.HTTP_404_NOT_FOUND,
        }
        return Response(response)
    
    detected_faces = image.detected_faces.all()
    serializer = DetectedFaceSerializer(detected_faces, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def getAllDetectedFaces(request):
    token = request.COOKIES.get("jwt")
    if not token:
        raise AuthenticationFailed("Unauthenticated!")

    try:
        payload = jwt.decode(token, config("DJANGO_JWT_SECRET"), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthenticated!")

    
    user = User.objects.filter(id=payload['id']).first()

    # get the detected facesfrom each photo of the user
    detected_faces = []
    for photo in user.photos.all():
        detected_faces += photo.detected_faces.all()
    
    serializer = DetectedFaceSerializer(detected_faces, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def deleteDetectedFace(request, id):
    token = request.COOKIES.get("jwt")
    if not token:
        raise AuthenticationFailed("Unauthenticated!")

    try:
        payload = jwt.decode(token, config("DJANGO_JWT_SECRET"), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthenticated!")

    
    user = User.objects.filter(id=payload['id']).first()

    detected_face = user.detected_faces.filter(id=id).first()

    if not detected_face:
        response = {
            'message': 'Detected face not found',
            "status": status.HTTP_404_NOT_FOUND,
        }
        return Response(response)
    
    detected_face.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def makePerson(request, id, person_id):
    token = request.COOKIES.get("jwt")
    if not token:
        raise AuthenticationFailed("Unauthenticated!")

    try:
        payload = jwt.decode(token, config("DJANGO_JWT_SECRET"), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthenticated!")

    
    user = User.objects.filter(id=payload['id']).first()

    detected_face = user.detected_faces.filter(id=id).first()

    if not detected_face:
        response = {
            'message': 'Detected face not found',
            "status": status.HTTP_404_NOT_FOUND,
        }
        return Response(response)
    
    person = user.persons.filter(id=person_id).first()

    if not person:
        response = {
            'message': 'Person not found',
            "status": status.HTTP_404_NOT_FOUND,
        }
        return Response(response)
    
    serialize = DetectedFaceSerializer(detected_face)
    serialize.is_valid(raise_exception=True)
    serialize.save()
    person.detected_faces.add(detected_face)
    return Response(status=status.HTTP_200_OK)


@api_view(["GET"])
def isDetectedFacePerson(request, detected_face_id):
    token = request.COOKIES.get("jwt")
    if not token:
        raise AuthenticationFailed("Unauthenticated!")

    try:
        payload = jwt.decode(token, config("DJANGO_JWT_SECRET"), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthenticated!")

    
    user = User.objects.filter(id=payload['id']).first()
    detected_face = DetectedFace.objects.filter(id = detected_face_id).first()
    persons = user.persons.all()
    response = False
    for person in persons:

        if detected_face in person.detected_faces.all():

            response = person.name
    
    return Response(response)


