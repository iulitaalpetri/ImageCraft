import datetime

import jwt
from decouple import AutoConfig
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.views import Response
from user.models import User
from PIL import Image
import tempfile


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

# edit a photo and apply multiple edits according to the request, but the requests don t come at once, I want to apply and edit, then another, then another
# ------------------------------------------------------- edit photo -------------------------------------------------------
# start an edit session
def start_edit_session(request, id):
    
    temp_dir = tempfile.mkdtemp()
    photo = Photo.objects.filter(id=id).first()

    original_image_path = photo.image.path
    request.session['edit_session'] = {
        'original_image_path': original_image_path,
        'current_image_path': original_image_path,  
        'temp_dir': temp_dir,
        'states': [original_image_path],
        'current_state': 0, 
    }

def add_state(request, new_image_path):
    session_data = request.session['edit_session']
    session_data['states'] = session_data['states'][:session_data['current_state'] + 1] 
    session_data['states'].append(new_image_path)
    session_data['current_state'] += 1
    session_data['current_image_path'] = new_image_path
    request.session['edit_session'] = session_data


def apply_edits(current_image, edit_type, edit_params):
    with Image.open(current_image) as img:
        if edit_type == "crop":
            edited_image = img.crop(edit_params)
        elif edit_type == "rotate":
            edited_image = img.rotate(edit_params)

    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
    edited_image.save(temp_file, format="JPEG")
    return temp_file.name


@api_view(["POST"])
def save_changes(request):
    photo_id = request.data.get("photo_id")
    edit_type = request.data.get("edit_type")
    edit_




