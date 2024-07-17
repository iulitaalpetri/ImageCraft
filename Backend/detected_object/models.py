from django.db import models

# Create your models here.

class DetectedObject(models.Model):
    name = models.CharField(max_length=100)
    