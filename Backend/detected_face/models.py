from django.db import models

# Create your models here.
class DetectedFace(models.Model):
    image = models.ImageField(upload_to='images/detected_faces/')
    emotion = models.CharField(max_length=100)
