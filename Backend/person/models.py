from django.db import models

# Create your models here.

class Person(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='images/persons/')
    detected_faces = models.ManyToManyField('detected_face.DetectedFace', blank=True)

    

    


