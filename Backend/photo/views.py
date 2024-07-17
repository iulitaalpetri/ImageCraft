import datetime
import shutil
import jwt
import numpy as np
from tensorflow.keras.preprocessing.image import load_img, img_to_array, save_img
from tensorflow.keras.models import load_model
import tensorflow as tf
import base64
from decouple import AutoConfig
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.views import Response
from user.models import User

from detected_face.models import DetectedFace
from person.models import Person
from detected_face.views import addDetectedFace
from PIL import Image, ExifTags
import tempfile
from django.http import JsonResponse
import os
from django.core.files import File
from PIL import ImageEnhance
from django.http import JsonResponse
from django.conf import settings
import torch
import torchvision.transforms as transforms





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
    for photo in serializer.data:
        if photo['image'] is not None:
            img_path = photo['image']
            media_root = settings.MEDIA_ROOT.replace('\\', '/')
            image_path = img_path.replace('\\', '/')
            if image_path.startswith(media_root):
                relative_path = image_path[len(media_root):]
                web_accessible_url = settings.MEDIA_URL + relative_path.lstrip('/')
                photo['image'] = request.build_absolute_uri(web_accessible_url) 
    return Response(serializer.data)



# --- for detecting cat and dogs ---
import torch
from torchvision.models.detection import FasterRCNN
from torchvision.models.detection.faster_rcnn import FastRCNNPredictor
from torchvision.models.detection.backbone_utils import resnet_fpn_backbone
from torchvision.transforms import functional as F
from PIL import Image

import torch.nn as nn

def apply_nms(original_prediction, iou_thresh=0.3, score_thresh=0.85):
    # Filter boxes and scores based on the confidence score threshold
    scores = original_prediction['scores']
    high_conf_mask = scores > score_thresh
    high_conf_boxes = original_prediction['boxes'][high_conf_mask]
    high_conf_scores = scores[high_conf_mask]


    # Apply NMS to the high confidence boxes and scores
    keep_boxes = torch.ops.torchvision.nms(high_conf_boxes, high_conf_scores, iou_thresh)
    
    # Retrieve final predictions using indices returned by NMS
    final_prediction = {
        'boxes': high_conf_boxes[keep_boxes],
        'labels': original_prediction['labels'][high_conf_mask][keep_boxes],
        'scores': high_conf_scores[keep_boxes]
    }

    print("Final prediction after NMS:", final_prediction)
    return final_prediction

def apply_dog_nms(original_prediction, iou_thresh=0.3, score_thresh=0.96):
    # Filter boxes and scores based on the confidence score threshold
    scores = original_prediction['scores']
    high_conf_mask = scores > score_thresh
    high_conf_boxes = original_prediction['boxes'][high_conf_mask]
    high_conf_scores = scores[high_conf_mask]

    print("Filtered scores:", high_conf_scores)

    # Apply NMS to the high confidence boxes and scores
    keep_boxes = torch.ops.torchvision.nms(high_conf_boxes, high_conf_scores, iou_thresh)
    
    # Retrieve final predictions using indices returned by NMS
    final_prediction = {
        'boxes': high_conf_boxes[keep_boxes],
        'labels': original_prediction['labels'][high_conf_mask][keep_boxes],
        'scores': high_conf_scores[keep_boxes]
    }

    print("Final prediction after NMS:", final_prediction)
    return final_prediction

def create_custom_model(num_classes, freeze_layers=True):
    # Load a pre-trained ResNet-50 FPN backbone
    backbone = resnet_fpn_backbone('resnet50', pretrained=True)

    if freeze_layers:
        # Freeze the specified layers
        for name, parameter in backbone.named_parameters():
            if 'layer3' not in name and 'layer4' not in name:
                parameter.requires_grad = False

    # Initialize the Faster R-CNN model with the custom backbone
    model = FasterRCNN(backbone, num_classes=num_classes)

    # Replace the pre-trained head with a new one
    in_features = model.roi_heads.box_predictor.cls_score.in_features
    model.roi_heads.box_predictor = FastRCNNPredictor(in_features, num_classes)

    # Add custom layers to the model to enhance feature extraction
    additional_layers = nn.Sequential(
        nn.Linear(in_features, 1024),
        nn.ReLU(),
        nn.Dropout(0.5),
        nn.Linear(1024, 512),
        nn.ReLU(),
        nn.Dropout(0.5)
    )
    model.roi_heads.additional_layers = additional_layers

    return model

def test_image(img_path):    
    device = torch.device('cpu')  # Explicitly creating and using the CPU device
    model = create_custom_model(3)  # Assuming 3 includes the background class
    model.load_state_dict(torch.load(r'Backend\models\cat_ep_5.pth', map_location=device))
    model.to(device)
    model.eval()
    
    image = Image.open(img_path).convert("RGB")
    image = F.to_tensor(image).unsqueeze(0).to(device)  
    
    with torch.no_grad():
        prediction = model(image)[0]  
    prediction_nms = apply_dog_nms(prediction)

    detected = [False, False]
    for label in prediction_nms['labels']:
        if label == 1:
            detected[0] = True  
        elif label == 2:
            detected[1] = True  

    return detected


# -------------------------


#--------------- detecting faces ----------------
def test_human_image(img_path):  
    device = torch.device('cpu')  # Explicitly creating and using the CPU device
  
    model = create_custom_model(2)
    model.load_state_dict(torch.load(r'Backend\models\face_det_ep_5.pth', map_location=device))
    model.to(device)

    model.eval()
    
    image = Image.open(img_path).convert("RGB")
    image = F.to_tensor(image).unsqueeze(0)  
    with torch.no_grad():
        prediction = model(image)[0]  
    prediction_nms = apply_nms(prediction)

    return prediction_nms
# -------------------------


# --- for face recognition -----
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Lambda
from tensorflow.keras.applications.xception import preprocess_input
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import numpy as np
from tensorflow.keras.applications import Xception
from tensorflow.keras.models import Sequential
from tensorflow.keras import layers

def get_encoder(input_shape):
  
    pretrained_model = Xception(
        input_shape=input_shape,
        weights='imagenet',
        include_top=False,
        pooling='avg',
    )
    
    for layer in pretrained_model.layers[:-27]:
        layer.trainable = False

    encode_model = Sequential([
        pretrained_model,
        layers.Flatten(),
        layers.Dense(512, activation='relu'),
        layers.BatchNormalization(),
        layers.Dense(256, activation="relu"),
        layers.Lambda(lambda x: tf.math.l2_normalize(x, axis=1))
    ], name="Encode_Model")
    
    return encode_model


def preprocess_image(image_path, target_size=(128, 128)):
    image = load_img(image_path, target_size=target_size)
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0)
    image = preprocess_input(image)  # Adjust according to your model's preprocessing needs
    return image

def find_matches_by_threshold(det_face, persons, distance_threshold = 0.04):
    test_image_path = det_face.image
    input_shape = (128, 128, 3)
    encoder = get_encoder(input_shape)

# Create Siamese Network structure if necessary, or load the whole model if saved entirely
    inputs = Input(name='inputs', shape=input_shape, dtype='float32')
    encoded_features = encoder(inputs)
    siamese_model = Model(inputs=inputs, outputs=encoded_features)

# Load the model weights
    siamese_model.load_weights('Backend\models\siamese_model-final2.h5')
    test_image_correct_path = os.path.join(settings.MEDIA_ROOT, test_image_path.name)
    test_image = preprocess_image(test_image_correct_path)
    test_embedding = siamese_model.predict(test_image)

    matches = []
    print("persons", persons)
    for person in persons:
        medie = 0
        print("person", person)
        for detected_face in person.detected_faces.all():
            print("detected_face", detected_face)
            full_image_path = os.path.join(settings.MEDIA_ROOT, detected_face.image.name)
            candidate_image = preprocess_image(full_image_path)
            candidate_embedding = siamese_model.predict(candidate_image)
            distance = np.linalg.norm(test_embedding - candidate_embedding)
            medie += distance
            
        medie = medie / len(person.detected_faces.all())
        print("medie", medie)
        if medie <= distance_threshold:
            matches.append(person)
            # update the person object with the detected face
            print("detected face to be added", det_face)
            print("person to be added to", person)
            person.detected_faces.add(det_face)
            person.save()
    return matches



#-------- for detectinf the emotions of the faces ------
from keras.models import Sequential
from keras.layers import Dense, Conv2D, BatchNormalization, Activation, MaxPooling2D, Dropout, Flatten
from tensorflow.keras.optimizers import Adam
from keras.preprocessing.image import load_img, img_to_array
import numpy as np

# Define the model architecture manually
model = Sequential([
    Conv2D(64, (3, 3), padding='same', input_shape=(48, 48, 1)),
    BatchNormalization(),
    Activation('relu'),
    MaxPooling2D(pool_size=(2, 2)),
    Dropout(0.25),

    Conv2D(128, (5, 5), padding='same'),
    BatchNormalization(),
    Activation('relu'),
    MaxPooling2D(pool_size=(2, 2)),
    Dropout(0.25),

    Conv2D(512, (3, 3), padding='same'),
    BatchNormalization(),
    Activation('relu'),
    MaxPooling2D(pool_size=(2, 2)),
    Dropout(0.25),

    Conv2D(512, (3, 3), padding='same'),
    BatchNormalization(),
    Activation('relu'),
    MaxPooling2D(pool_size=(2, 2)),
    Dropout(0.25),

    Flatten(),
    Dense(256),
    BatchNormalization(),
    Activation('relu'),
    Dropout(0.25),

    Dense(512),
    BatchNormalization(),
    Activation('relu'),
    Dropout(0.25),

    Dense(7, activation='softmax')
])

# Load the weights directly (assuming you have the path to the weights file)
model.load_weights(r"Backend\models\results\model_weights.h5")

# Compile the model
model.compile(optimizer=Adam(learning_rate=0.0001), loss='categorical_crossentropy', metrics=['accuracy'])


# Funcția de preprocesare a imaginii
def preprocess_image_emotion(image_path, target_size=(48, 48)):
    img = load_img(image_path, target_size=target_size, color_mode="grayscale")
    img_array = img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Adaugă o dimensiune pentru batch
    return img_array





from django.core.files.base import ContentFile
import io

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
    

    # detect cats and dogs
    detected = test_image(request.data["image"])
    cats = detected[0]
    dogs = detected[1]
    print(cats, dogs)

    



    

    photo_data = {
        "image": request.data["image"],
        "date": None,  # This will be automatically set to the current date and time   
        "cats": cats,
        "dogs": dogs
    }

    photo = Photo.objects.create(**photo_data)
    
    image_id = photo.id


# detect face
    detected_faces = test_human_image(request.data["image"])
    boxes = detected_faces['boxes']
    final_detected_faces = []
    with Image.open(request.data["image"]) as img:
        index = 1
        for box in boxes:
            if isinstance(box, torch.Tensor):
                box = box.tolist()
            left, top, right, bottom = box
            # apply a 5 pixel padding to the bounding box
            left = max(0, left - 12)
            top = max(0, top - 12)
            right = min(img.width, right + 12)
            bottom = min(img.height, bottom + 12 )

            cropped_img = img.crop((left, top, right, bottom))
            buffer = io.BytesIO()
            cropped_img.save(buffer, format="JPEG")
            content_file = ContentFile(buffer.getvalue(), name=f"detected_face_{image_id}_{index}.jpg")

 
            detected_face = DetectedFace(
                image=content_file,
                emotion= "emotion"
            )
            detected_face.save()
            image_path = f"media\images\detectedFaces\detected_face_{image_id}_{index}.jpg"
            processed_image = preprocess_image_emotion(image_path)

            # Predicția
            predictions = model.predict(processed_image)
            predicted_class = np.argmax(predictions, axis=1)


            predicted_class_index = np.argmax(predictions, axis=1)[0]  # Extract the first element to get the index

            classes = {0: "angry", 1: "disgust", 2: "fear", 3: "happy", 4: "neutral", 5: "sad", 6: "surprise"}

            print("Clasa prezisă:", classes[predicted_class_index])
            emotion = classes[predicted_class_index]

            detected_face.emotion = emotion


            final_detected_faces.append(detected_face)
            detected_face.save()
            photo.detected_faces.add(detected_face)
            
            index += 1
# face recognition

    
    # get the user s persons
    user_persons = user.persons.all()

    for det_face in final_detected_faces:
        matches = find_matches_by_threshold(det_face, user_persons)
        print("matches", matches)


    

        



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
    # get the detected faces of the photo
    detected_faces = photo.detected_faces.all()
    persons = user.persons.all()

    for person in persons:
        for detected_face in detected_faces:
            if detected_face in person.detected_faces.all():
                person.detected_faces.remove(detected_face)
                person.save()

    for person in persons:
        if person.detected_faces.count() == 0:
            person.delete()

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
    request.session['total_states'] = 0
    
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




@api_view(["GET"])
def get_current_uri(request):
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


def rotate_image_based_on_exif(image):
    try:
        # Cautăm tag-ul pentru orientare în EXIF
        for orientation in ExifTags.TAGS.keys():
            if ExifTags.TAGS[orientation] == 'Orientation':
                break

        # Extragem EXIF
        exif = dict(image._getexif().items())

        # Rotim imaginea pe baza orientării
        if exif[orientation] == 3:
            image = image.rotate(180, expand=True)
        elif exif[orientation] == 6:
            image = image.rotate(270, expand=True)
        elif exif[orientation] == 8:
            image = image.rotate(90, expand=True)
    except (AttributeError, KeyError, IndexError):
        # Cazuri în care nu există EXIF sau nu avem informații de orientare
        pass

    return image


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
    image = rotate_image_based_on_exif(image)


    left = int(request.data['left'])
    upper = int(request.data['upper'])
    right = int(request.data['right'])
    bottom = int(request.data['bottom'])

    image_width, image_height = image.size

    crop_left = left
    crop_upper = upper
    crop_right = image_width - right
    crop_lower = image_height - bottom


    if crop_left < 0 or crop_left >= crop_right:
        return Response({"message": "Invalid left/right coordinates!"}, status=status.HTTP_400_BAD_REQUEST)
    if crop_upper < 0 or crop_upper >= crop_lower:
        return Response({"message": "Invalid upper/bottom coordinates!"}, status=status.HTTP_400_BAD_REQUEST)
    if crop_right > image_width or crop_right <= crop_left:
        return Response({"message": "Invalid right coordinate exceeds image width!"}, status=status.HTTP_400_BAD_REQUEST)
    if crop_lower > image_height or crop_lower <= crop_upper:
        return Response({"message": "Invalid bottom coordinate exceeds image height!"}, status=status.HTTP_400_BAD_REQUEST)
    
    
    # Efectuăm crop-ul pe imagine
    cropped_image = image.crop((crop_left, crop_upper, crop_right, crop_lower))

    # save the cropped image in the temporary directory
    request.session['current_state'] += 1
    request.session['total_states'] += 1
    print(request.session['current_state'])


    cropped_image.save(request.session['temp_dir']  + '/' + str(request.session['total_states']) + ".jpg")
    print(request.session['temp_dir'] + '/'+ str(request.session['total_states']) + ".jpg")
    request.session['current_image'] = request.session['temp_dir'] + '/'+ str(request.session['total_states']) + ".jpg"

    

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
    rotated_image = image.rotate(angle, expand=True)
    print("dupa rotire")

    # save the rotated image in the temporary directory
    request.session['current_state'] += 1
    request.session['total_states'] += 1
    rotated_image.save(request.session['temp_dir'] + '/' + str(request.session['total_states']) + ".jpg")
    request.session['current_image'] = request.session['temp_dir'] + '/' + str(request.session['total_states']) + ".jpg"
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
    request.session['total_states'] += 1
    resized_image.save(request.session['temp_dir'] + '/' + str(request.session['total_states']) + ".jpg")
    request.session['current_image'] = request.session['temp_dir'] + '/' + str(request.session['total_states']) + ".jpg"
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
    request.session['total_states'] += 1
    flipped_image.save(request.session['temp_dir'] + '/' + str(request.session['total_states']) + ".jpg")
    request.session['current_image'] = request.session['temp_dir'] + '/' + str(request.session['total_states']) + ".jpg"
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
    request.session['total_states'] += 1
    brightened_image.save(request.session['temp_dir'] + '/' + str(request.session['total_states']) + ".jpg")
    request.session['current_image'] = request.session['temp_dir'] + '/' + str(request.session['total_states']) + ".jpg"
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
    request.session['total_states'] += 1
    contrasted_image.save(request.session['temp_dir'] + '/' + str(request.session['total_states']) + ".jpg")
    request.session['current_image'] = request.session['temp_dir'] + '/' + str(request.session['total_states']) + ".jpg"
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
    sharpened_image = enhancer.enhance(8)

    # save the sharpened image in the temporary directory
    request.session['current_state'] += 1
    request.session['total_states'] += 1
    sharpened_image.save(request.session['temp_dir'] + '/' + str(request.session['total_states']) + ".jpg")
    request.session['current_image'] = request.session['temp_dir'] + '/' + str(request.session['total_states']) + ".jpg"
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
    request.session['total_states'] += 1
    grayscale_image.save(request.session['temp_dir'] + '/' + str(request.session['total_states']) + ".jpg")
    request.session['current_image'] = request.session['temp_dir'] + '/' + str(request.session['total_states']) + ".jpg"
    request.session['states'].append(request.session['current_image'])
    grayscale_image.show()

    response = {
        "message": "Image converted to grayscale!",
        "status": status.HTTP_200_OK,
        "current_uri": request.session['current_image']
    }

    return Response(response, status=status.HTTP_200_OK)





@api_view(["POST"])
def denoise_image(request):
    # Load the original image to get its dimensions
    original_image = load_img(request.session['current_image'])
    original_size = original_image.size  # This returns (width, height)

    # Load and preprocess the image for the model
    img = load_img(request.session['current_image'], target_size=(384, 384))
    img_array = img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Load the pre-trained model
    model = load_model('Backend/models/denoise_model.h5')

    # Predict the denoised image
    denoised_img_array = model.predict(img_array)[0]
    denoised_img_array = np.clip(denoised_img_array, 0, 1)

    # Resize the denoised image back to the original dimensions
    denoised_img = tf.image.resize(denoised_img_array, (original_image.size[1], original_image.size[0]))


    denoised_img_array_resized = np.clip(denoised_img.numpy(), 0, 1)  # Convert to numpy and clip any potential rounding discrepancies

    # denoised_img_array_resized = tf.image.resize(denoised_img_array, original_size).numpy()
    request.session['current_state'] += 1
    request.session['total_states'] += 1

    # Save the denoised image
    output_path = f"{request.session['temp_dir']}/{request.session['total_states']}.jpg"
    save_img(output_path, denoised_img_array_resized * 255)  

    # Update session details
    request.session['current_image'] = output_path
    request.session['states'].append(output_path)

    # Construct response
    response = {
        "message": "Image denoised!",
        "status": status.HTTP_200_OK,
        "current_uri": request.session['current_image']
    }

    return JsonResponse(response, status=status.HTTP_200_OK)






# ------------------ edits ----------------


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
    photo.image = final_image_path
    photo.save()
    
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
    print(request.session['states'])
    request.session['current_state'] -= 1
    request.session['current_image'] = request.session['states'][request.session['current_state']]
    request.session['states'].pop()
    print("dupa pop")
    print(request.session['states'])
    # show the current image
    image = Image.open(request.session['current_image'])
    image.show()

    response = {
        "message": "Undo successful!",
        "status": status.HTTP_200_OK,
        "current_uri": request.session['current_image']
    }

    return Response(response, status=status.HTTP_200_OK)

@api_view(["GET"])
def getAllPhotosWithPerson(request, person_id):
    token = request.COOKIES.get("jwt")
    if not token:
        raise AuthenticationFailed("Unauthenticated!")

    try:
        payload = jwt.decode(token, config("DJANGO_JWT_SECRET"), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthenticated!")

    user = User.objects.filter(id=payload["id"]).first()
    person = Person.objects.filter(id=person_id).first()
    detected_faces = person.detected_faces.all()
    photos = user.photos.all()
    final_photos = []

    for detected_face in detected_faces:
        for photo in photos:
            if detected_face in photo.detected_faces.all():
                final_photos.append(photo)

    serializer = PhotoSerializer(final_photos, many = True)

    response = serializer.data
    print("poze cu persone", response)

    return Response(response)


@api_view(["GET"])
def get_happy_photos(request):
    token = request.COOKIES.get("jwt")
    if not token:
        raise AuthenticationFailed("Unauthenticated!")

    try:
        payload = jwt.decode(token, config("DJANGO_JWT_SECRET"), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthenticated!")

    user = User.objects.filter(id=payload["id"]).first()
    photos = user.photos.all()
    happy_photos = []

    for photo in photos:
        for detected_face in photo.detected_faces.all():
            if detected_face.emotion == "happy":
                happy_photos.append(photo)


    happy_photos = list(set(happy_photos))
    serializer = PhotoSerializer(happy_photos, many=True)
    response = serializer.data

    return Response(response)


    