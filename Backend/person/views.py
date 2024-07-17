import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Lambda
from tensorflow.keras.applications.xception import preprocess_input
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import numpy as np
from tensorflow.keras.applications import Xception
from tensorflow.keras.models import Sequential
from tensorflow.keras import layers


from django.shortcuts import render
from .models import Person
from detected_face.models import DetectedFace
from detected_face.views import getAllDetectedFacesinPhoto
from rest_framework.decorators import api_view
from rest_framework.views import Response
from rest_framework import status
from .serializers import PersonSerializer
from django.conf import settings

import jwt
from decouple import AutoConfig
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.views import Response
from user.models import User
from photo.models import Photo
import os
from decouple import AutoConfig

config = AutoConfig()


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

# Create your views here.

@api_view(['POST'])
def addPerson(request, detectd_face_id):
    # the serializer only requires name 
    person_name = request.data['name']
        # initialize image fiels with the detected face image
    detected_face = DetectedFace.objects.filter(id=detectd_face_id).first()
    if not detected_face:
        response = {
            'message': 'Detected face not found',
            "status": status.HTTP_404_NOT_FOUND,
        }
        return Response(response)
    test_image = detected_face.image 

    print("test image", test_image)

   
    
    input_shape = (128, 128, 3)
    encoder = get_encoder(input_shape)

# Create Siamese Network structure if necessary, or load the whole model if saved entirely
    inputs = Input(name='inputs', shape=input_shape, dtype='float32')
    encoded_features = encoder(inputs)
    siamese_model = Model(inputs=inputs, outputs=encoded_features)

# Load the model weights
    siamese_model.load_weights('Backend\models\siamese_model-final.h5')


    def find_matches_by_threshold(test_image_path, folder_path, distance_threshold=0.04):
        test_image_correct_path = os.path.join(settings.MEDIA_ROOT, test_image_path.name)
        test_image = preprocess_image(test_image_correct_path)
        test_embedding = siamese_model.predict(test_image)

    # List to store matches that meet the distance criteria
        matches = []

    # Loop through all images in the folder
        print("folder path", folder_path)
        matching_faces = []
        for image_path in folder_path:
            full_image_path = os.path.join(settings.MEDIA_ROOT, image_path.name)  # Use full_image_path instead of image_path
            candidate_image = preprocess_image(full_image_path)
            candidate_embedding = siamese_model.predict(candidate_image)
            
            distance = np.linalg.norm(test_embedding - candidate_embedding)
            # Check if the distance is within the threshold
            if distance <= distance_threshold:
                matches.append((image_path, distance))
                # find detected face object by image path
                det_face = DetectedFace.objects.filter(image=image_path).first()
                matching_faces.append(det_face)
        print("matches", matches)
        return matches, matching_faces
    
    # get all detected faces from all photos of the user

    token = request.COOKIES.get("jwt")
    if not token:
        raise AuthenticationFailed("Unauthenticated!")
    try:
        payload = jwt.decode(token, config("DJANGO_JWT_SECRET"), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthenticated!")

    user = User.objects.filter(id=payload["id"]).first()
    photos = user.photos.all()
    detected_faces_paths = []

    input_shape = (128, 128, 3)
    encoder = get_encoder(input_shape)

# Create Siamese Network structure if necessary, or load the whole model if saved entirely
    inputs = Input(name='inputs', shape=input_shape, dtype='float32')
    encoded_features = encoder(inputs)
    siamese_model = Model(inputs=inputs, outputs=encoded_features)

# Load the model weights
    siamese_model.load_weights('Backend\models\siamese_model-final.h5')

    # extract only the paths of the detected faces
    for photo in photos:
        detected_faces = photo.detected_faces.all()  # Use .all() to get all related DetectedFace objects
        for detected_face in detected_faces:
            detected_faces_paths.append(detected_face.image)      

    print("detected faces paths", detected_faces_paths)



    distance_threshold = 0.8  # Example threshold, adjust based on your data and needs
    matches, matching_faces = find_matches_by_threshold(test_image, detected_faces_paths, distance_threshold)
    person_image = test_image
    person_detected_faces = matching_faces
    person = Person(name=person_name, image=person_image)
    person.save()
    # add the person to the current user
    

    person.detected_faces.set(person_detected_faces)

    user.persons.add(person)
    user.save()

    serializer = PersonSerializer(person)
    response = {
        'message': 'Person added successfully',
        'result': serializer.data,
        "status": status.HTTP_201_CREATED,

    }
    return Response(response)

@api_view(["GET"])
def getAllPersons(request):
    token = request.COOKIES.get("jwt")
    if not token:
        raise AuthenticationFailed("Unauthenticated!")

    try:
        payload = jwt.decode(token, config("DJANGO_JWT_SECRET"), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthenticated!")

    user = User.objects.filter(id=payload["id"]).first()
    persons = user.persons.all()

    serializer = PersonSerializer(persons, many=True)

    response = serializer.data

    return Response(response)

@api_view(["GET"])
def getAllPersonsPhoto(request, photo_id):
    token = request.COOKIES.get("jwt")
    if not token:
        raise AuthenticationFailed("Unauthenticated!")

    try:
        payload = jwt.decode(token, config("DJANGO_JWT_SECRET"), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthenticated!")

    user = User.objects.filter(id=payload["id"]).first()
    photo = Photo.objects.filter(id = photo_id).first()
    persons = user.persons.all()
    detected_faces_current_photo = photo.detected_faces.all()
   
    persons_current_photo = []
   
    for detected_face in detected_faces_current_photo:
        for person in persons:
            if detected_face in person.detected_faces.all():
                persons_current_photo.append(person)

    serializer = PersonSerializer(persons_current_photo, many=True)

    response = serializer.data
   
    return Response(response)
               
   
   

    
    















    
    




    

