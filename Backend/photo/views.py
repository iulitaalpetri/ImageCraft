import datetime
import shutil
import jwt
import base64
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
import shutil
import tempfile
from django.conf import settings
from django.http import JsonResponse
from django.conf import settings



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







# ---------------- edit -------------------------
@api_view(["POST"])
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



    # create temporary directory to store the edited states of the image

    temp_dir_path = os.path.join(settings.MEDIA_ROOT, "temp_folders")
    temp_dir = tempfile.mkdtemp(dir=temp_dir_path)  
    
    request.session['temp_dir'] = temp_dir


    
    request.session['photo_id'] = id
    request.session['finalized'] = False
    request.session['dismissed'] = False
    request.current_state = 0
    response = {
        "message": "Edit session started!",
        "status": status.HTTP_200_OK,
    }

    request.session['original_image'] = photo.image.path
    # make a copy of the original image in the temporary directory
    shutil.copy(request.session['original_image'], request.session['temp_dir'])
    print("dupa copiere")
    request.session['original_image'] = request.session['temp_dir'] + "/" + os.path.basename(request.session['original_image'])
    with open(request.session['original_image'], "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read())
        request.session['current_image_base64'] = encoded_string.decode('utf-8')


    request.session['current_image'] = request.session['original_image']
    # save the base64 of the original image do i can use it in the frontend
    # request.session['current_image_base_64'] = 
    request.session['states'] = [request.session['original_image']]
    request.session['current_state'] = 0
    
    return Response(response, status=status.HTTP_200_OK)


@api_view(["POST"])
def dismiss_changes(request):
    token = request.COOKIES.get("jwt")
    if not token:
        raise AuthenticationFailed("Unauthenticated!")

    try:
        payload = jwt.decode(token, config("DJANGO_JWT_SECRET"), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthenticated!")

    user = User.objects.filter(id=payload["id"]).first()
    photo = Photo.objects.filter(id=request.session['photo_id']).first()

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

    request.session['dismissed'] = True
    request.session['finalized'] = True
    # delete the temporary directory
    shutil.rmtree(request.session['temp_dir'])


    response = {
        "message": "Changes dismissed!",
        "status": status.HTTP_200_OK,
    }
    return Response(response, status=status.HTTP_200_OK)


# a get current uri for my edit page to display the current edits after making them
# @api_view(["GET"])
# def get_current_uri(request):
#     response = {
#         "message": "Current uri!",
#         "status": status.HTTP_200_OK,
#         "current_uri": request.session['current_image']
#     }
#     print("uri curent de acummmm")
#     print(response["current_uri"])
    
#     return Response(response, status=status.HTTP_200_OK)

@api_view(["GET"])
def get_current_uri(request):
    # Assuming `current_image` holds the absolute path
    if 'current_image' in request.session:
        media_root = settings.MEDIA_ROOT.replace('\\', '/')  # Ensure consistent path separators
        current_image_path = request.session['current_image'].replace('\\', '/')
        if current_image_path.startswith(media_root):
            relative_path = current_image_path[len(media_root):]
            web_accessible_url = settings.MEDIA_URL + relative_path.lstrip('/')
            response = {
                "message": "Current URI",
                "status": status.HTTP_200_OK,
                "current_uri": request.build_absolute_uri(web_accessible_url)  # Create full URL
            }

            print(response["current_uri"])
        else:
            response = {
                "message": "Image path is not valid",
                "status": status.HTTP_400_BAD_REQUEST,
                "current_uri": None
            }
    else:
        response = {
            "message": "No image in session",
            "status": status.HTTP_404_NOT_FOUND,
            "current_uri": None
        }
    
    return Response(response, status=response["status"])



@api_view(["POST"])
def crop_image(request):
    token = request.COOKIES.get("jwt")
    if not token:
        raise AuthenticationFailed("Unauthenticated!")

    try:
        payload = jwt.decode(token, config("DJANGO_JWT_SECRET"), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthenticated!")

    user = User.objects.filter(id=payload["id"]).first()
    photo = Photo.objects.filter(id=request.session['photo_id']).first()


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

    

    image = Image.open(request.session['current_image'])
    print(image.size)

    x = request.data['x']
    y = request.data['y']
    width = request.data['width']
    height = request.data['height']
    # validate the parameters
    if x < 0 or x >= image.size[0]:
        response = {
            "message": "Invalid x coordinate!",
            "status": status.HTTP_400_BAD_REQUEST,
        }
        return Response(response, status=status.HTTP_400_BAD_REQUEST)
    if y < 0 or y >= image.size[1]:
        response = {
            "message": "Invalid y coordinate!",
            "status": status.HTTP_400_BAD_REQUEST,
        }
        return Response(response, status=status.HTTP_400_BAD_REQUEST)
    
    if width <= 0 or x + width > image.size[0]:
        response = {
            "message": "Invalid width!",
            "status": status.HTTP_400_BAD_REQUEST,
        }
        return Response(response, status=status.HTTP_400_BAD_REQUEST)
    if height <= 0 or y + height > image.size[1]:
        response = {
            "message": "Invalid height!",
            "status": status.HTTP_400_BAD_REQUEST,
        }
        return Response(response, status=status.HTTP_400_BAD_REQUEST)
    

    left = x
    upper = y
    right = x + width
    lower = y + height
    
    cropped_image = image.crop((left, upper, right, lower))

    # save the cropped image in the temporary directory
    request.session['current_state'] += 1
    print(request.session['current_state'])


    cropped_image.save(request.session['temp_dir']  + '/' + str(request.session['current_state']) + ".jpg")
    print(request.session['temp_dir'] + '/'+ str(request.session['current_state']) + ".jpg")
    request.session['current_image'] = request.session['temp_dir'] + '/'+ str(request.session['current_state']) + ".jpg"

    

    request.session['states'].append(request.session['current_image'])
     
    cropped_image.show()




    response = {
        "message": "Image cropped!",
        "status": status.HTTP_200_OK,
        "current_uri": request.session['current_image']
    }
    return Response(response, status=status.HTTP_200_OK)


@api_view(["POST"])
def rotate_image(request):
    angle = request.data['angle']

    image = Image.open(request.session['current_image'])
    rotated_image = image.rotate(angle)
    print("dupa rotire")

    # save the rotated image in the temporary directory
    request.session['current_state'] += 1
    rotated_image.save(request.session['temp_dir'] + '/' + str(request.session['current_state']) + ".jpg")
    request.session['current_image'] = request.session['temp_dir'] + '/' + str(request.session['current_state']) + ".jpg"
    request.session['states'].append(request.session['current_image'])
    rotated_image.show()

    response = {
        "message": "Image rotated!",
        "status": status.HTTP_200_OK,
        "current_uri": request.session['current_image']
    }
    return Response(response, status=status.HTTP_200_OK)


@api_view(["POST"])
def resize_image(request):
    width = request.data['width']
    height = request.data['height']

    image = Image.open(request.session['current_image'])
    resized_image = image.resize((width, height))

    # save the resized image in the temporary directory
    request.session['current_state'] += 1
    resized_image.save(request.session['temp_dir'] + '/' + str(request.session['current_state']) + ".jpg")
    request.session['current_image'] = request.session['temp_dir'] + '/' + str(request.session['current_state']) + ".jpg"
    request.session['states'].append(request.session['current_image'])
    resized_image.show()

    response = {
        "message": "Image resized!",
        "status": status.HTTP_200_OK,
        "current_uri": request.session['current_image']
    }
    return Response(response, status=status.HTTP_200_OK)


@api_view(["POST"])
def flip_image(request):
    if request.data['axis'] == 'horizontal':
        axis = 0
    else:
        axis = 1

    image = Image.open(request.session['current_image'])
    flipped_image = image.transpose(axis)

    # save the flipped image in the temporary directory
    request.session['current_state'] += 1
    flipped_image.save(request.session['temp_dir'] + '/' + str(request.session['current_state']) + ".jpg")
    request.session['current_image'] = request.session['temp_dir'] + '/' + str(request.session['current_state']) + ".jpg"
    request.session['states'].append(request.session['current_image'])
    flipped_image.show()

    response = {
        "message": "Image flipped!",
        "status": status.HTTP_200_OK,
        "current_uri": request.session['current_image']
    }

    return Response(response, status=status.HTTP_200_OK)

@api_view(["POST"])
def brightness_image(request):
    factor = request.data['factor']

    image = Image.open(request.session['current_image'])
    enhancer = ImageEnhance.Brightness(image)
    brightened_image = enhancer.enhance(factor)

    # save the brightened image in the temporary directory
    request.session['current_state'] += 1
    brightened_image.save(request.session['temp_dir'] + '/' + str(request.session['current_state']) + ".jpg")
    request.session['current_image'] = request.session['temp_dir'] + '/' + str(request.session['current_state']) + ".jpg"
    request.session['states'].append(request.session['current_image'])
    brightened_image.show()

    response = {
        "message": "Image brightened!",
        "status": status.HTTP_200_OK,
        "current_uri": request.session['current_image']
    }

    return Response(response, status=status.HTTP_200_OK)

@api_view(["POST"])
def contrast_image(request):
    factor = request.data['factor']

    image = Image.open(request.session['current_image'])
    enhancer = ImageEnhance.Contrast(image)
    contrasted_image = enhancer.enhance(factor)

    # save the contrasted image in the temporary directory
    request.session['current_state'] += 1
    contrasted_image.save(request.session['temp_dir'] + '/' + str(request.session['current_state']) + ".jpg")
    request.session['current_image'] = request.session['temp_dir'] + '/' + str(request.session['current_state']) + ".jpg"
    request.session['states'].append(request.session['current_image'])
    contrasted_image.show()

    response = {
        "message": "Image contrasted!",
        "status": status.HTTP_200_OK,
        "current_uri": request.session['current_image']
    }

    return Response(response, status=status.HTTP_200_OK)    


@api_view(["POST"])
def sharpness_image(request):
    factor = request.data['factor']

    image = Image.open(request.session['current_image'])
    enhancer = ImageEnhance.Sharpness(image)
    sharpened_image = enhancer.enhance(factor)

    # save the sharpened image in the temporary directory
    request.session['current_state'] += 1
    sharpened_image.save(request.session['temp_dir'] + '/' + str(request.session['current_state']) + ".jpg")
    request.session['current_image'] = request.session['temp_dir'] + '/' + str(request.session['current_state']) + ".jpg"
    request.session['states'].append(request.session['current_image'])
    sharpened_image.show()

    response = {
        "message": "Image sharpened!",
        "status": status.HTTP_200_OK,
        "current_uri": request.session['current_image']
    }

    return Response(response, status=status.HTTP_200_OK)

@api_view(["POST"])
def color_image(request):
    #convert to grayscale
    image = Image.open(request.session['current_image'])
    grayscale_image = image.convert('L')

    # save the grayscale image in the temporary directory
    request.session['current_state'] += 1
    grayscale_image.save(request.session['temp_dir'] + '/' + str(request.session['current_state']) + ".jpg")
    request.session['current_image'] = request.session['temp_dir'] + '/' + str(request.session['current_state']) + ".jpg"
    request.session['states'].append(request.session['current_image'])
    grayscale_image.show()

    response = {
        "message": "Image converted to grayscale!",
        "status": status.HTTP_200_OK,
        "current_uri": request.session['current_image']
    }

    return Response(response, status=status.HTTP_200_OK)


@api_view(["POST"])
def save_changes(request):
    token = request.COOKIES.get("jwt")
    if not token:
        raise AuthenticationFailed("Unauthenticated!")

    try:
        payload = jwt.decode(token, config("DJANGO_JWT_SECRET"), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthenticated!")

    user = User.objects.filter(id=payload["id"]).first()
    photo = Photo.objects.filter(id=request.session['photo_id']).first()

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

    # save the final image in the media directory
    final_image_path = os.path.join(settings.MEDIA_ROOT, "images/photos", os.path.basename(request.session['original_image']))
    shutil.copy(request.session['current_image'], final_image_path)
    
    # delete the temporary directory
    shutil.rmtree(request.session['temp_dir'])

    request.session['finalized'] = True

    #show photo with photo.image.path
    


    response = {
        "message": "Changes saved!",
        "status": status.HTTP_200_OK,
    }
    print(response)
    return Response(response, status=status.HTTP_200_OK)


@api_view(["POST"])
def undo_changes(request):
    if request.session['current_state'] == 0:
        response = {
            "message": "No more changes to undo!",
            "status": status.HTTP_400_BAD_REQUEST,
        }
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    request.session['current_state'] -= 1
    request.session['current_image'] = request.session['states'][request.session['current_state']]
    request.session['states'].pop()
    
    response = {
        "message": "Undo successful!",
        "status": status.HTTP_200_OK,
        "current_uri": request.session['current_image']
    }

    return Response(response, status=status.HTTP_200_OK)


    