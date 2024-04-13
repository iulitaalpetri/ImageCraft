import datetime
import shutil
import jwt
from decouple import AutoConfig
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.views import Response
from user.models import User
from PIL import Image
import tempfile
from django.http import JsonResponse
import os
from django.core.files import File
from PIL import ImageEnhance


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

# edit a photo and apply multiple edits according to the request, but the requests don t come at once, I want to apply and edit, view the changes ,then another, then another
# ------------------------------------------------------- edit photo -------------------------------------------------------
# start an edit session
def start_edit_session(request, id):

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
            "message": "You are not allowed to edit this photo!",
            "status": status.HTTP_401_UNAUTHORIZED,
        }
        return Response(response, status=status.HTTP_401_UNAUTHORIZED)
    
    temp_dir = tempfile.mkdtemp() 
    # print the path of the temp dir
    print(temp_dir)

    original_image_path = photo.image.path

    print(original_image_path)
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


def apply_edits(current_image_path, edit_type, edit_params):



    with Image.open(current_image_path) as img:
        width, height = img.size

        if edit_type == "crop":
            # Ensure crop parameters are within the image dimensions
            left = max(0, min(edit_params['left'], width))
            upper = max(0, min(edit_params['top'], height))
            right = max(left, min(edit_params['right'], width))
            lower = max(upper, min(edit_params['bottom'], height))

            # Validate that we have a positive area for the crop rectangle
            if right <= left or lower <= upper:
                return None  # Indicate invalid crop parameters

            crop_tuple = (left, upper, right, lower)
            edited_image = img.crop(crop_tuple)
        elif edit_type == "rotate":
            angle = edit_params['angle']
            edited_image = img.rotate(angle)
        elif edit_type == "resize":
            new_width = edit_params['width']
            new_height = edit_params['height']
            edited_image = img.resize((new_width, new_height))
        elif edit_type == "flip":
            if edit_params['direction'] == 'horizontal':
                edited_image = img.transpose(Image.FLIP_LEFT_RIGHT)
            elif edit_params['direction'] == 'vertical':
                edited_image = img.transpose(Image.FLIP_TOP_BOTTOM)
        elif edit_type == "brightness":
            enhancer = ImageEnhance.Brightness(img)
            factor = edit_params['factor']  # Should be a float; 1.0 means no change
            edited_image = enhancer.enhance(factor)

    


    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
    #print the path of the temp file
    edited_image.show()
    edited_image.save(temp_file.name, format="JPEG")

    return temp_file.name



@api_view(["POST"])
def save_changes(request, photo_id):

    edit_type = request.data["edit_type"]
    edit_params = request.data["edit_params"]

    if ('edit_session' not in request.session) or (request.session['edit_session']['original_image_path'] != Photo.objects.get(id=photo_id).image.path): # daca inca nu s a inceput o sesiune sau daca id ul pozei este diferit, voi incepe o sesiune noua        
        start_edit_session(request, photo_id)
    
    current_image_path  = request.session['edit_session']['current_image_path']
    new_image_path = apply_edits(current_image_path, edit_type, edit_params)
    add_state(request, new_image_path)

    return JsonResponse({"message": f"Image successfully edited with {edit_type}.", "new_image_path": new_image_path})


@api_view(["PATCH"])
def finalize_edits(request, photo_id):
    session_data = request.session.get('edit_session', None)
    if session_data is None:
        return JsonResponse({"message": "No edits have been made."}, status=400)

    final_image_path = session_data['current_image_path']  # Ensure this is the updated path
    print(final_image_path, "current image path in finalize edits ----- dsv-dasfAJFBJAJDA-FSDFDJBSHVFEBJKEDHWJBFHDWJBHVU")

    try:
        photo = Photo.objects.get(id=photo_id)
    except Photo.DoesNotExist:
        return Response({"error": "Photo not found"}, status=404)

    # Save the final edited image
    with open(final_image_path, 'rb') as img:
        photo.image.save(os.path.basename(final_image_path), File(img), save=True)

    # Cleanup logic here...

    return JsonResponse({"message": "Photo updated with final edits."})

# @api_view(["PATCH"])
# def finalize_edits(request, photo_id):
#     session_data = request.session.get('edit_session', None)
#     if session_data is None:
#         return JsonResponse({"message": "No edits have been made."}, status=400)

#     try:
#         photo = Photo.objects.get(id=photo_id)
#     except Photo.DoesNotExist:
#         return Response({"error": "Photo not found"}, status=404)

#     final_image_path = session_data['current_image_path']

#     with open(final_image_path, 'rb') as img:
#                 photo.image.save(os.path.basename(final_image_path), File(img), save=True)

#     temp_dir = session_data.get('temp_dir')
#     if temp_dir and os.path.isdir(temp_dir):
#         shutil.rmtree(temp_dir)  

#     del request.session['edit_session']
#     request.session.modified = True  


    
#     return JsonResponse({"message": "Photo updated with final edits."})


# ------------------ undo edit -------------------
def undo_edit(request):
    session_data = request.session.get('edit_session', None)
    if session_data is None or session_data['current_state'] == 0:# daca nu e sesiune sau nu s au fct editari
        return False, None


    session_data = request.session.get('edit_session', None)

    session_data['current_state'] -= 1
    current_image_path = session_data['states'][session_data['current_state']]
    current_image = Image.open(current_image_path)
    print(current_image_path, "current image path in unod ----- dsv-dasfAJFBJAJDA-FSDFDJBSHVFEBJKEDHWJBFHDWJBHVU")
    current_image.show()
    request.session['edit_session'] = session_data
    request.session.modified = True  
    request.session.save()

    
    return True, current_image_path



@api_view(["POST"])
def undo_changes(request):
    success, current_image_path = undo_edit(request)
    if not success:
        return JsonResponse({"message": "No more edits to undo."}, status=400)

    
    return JsonResponse({"message": "Undo successful.", "current_image_path": current_image_path})






    
