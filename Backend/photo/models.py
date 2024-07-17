from django.db import models

# Create your models here.
class Photo(models.Model):
    image = models.ImageField(upload_to='images/photos/')
    date = models.DateTimeField(auto_now_add=True)
    detected_objects = models.ManyToManyField('detected_object.DetectedObject', blank=True)
    detected_faces = models.ManyToManyField('detected_face.DetectedFace', blank=True)
    cats = models.BooleanField(default=False)
    dogs = models.BooleanField(default=False)

    def get_image_path(self):
        return self.image.path


