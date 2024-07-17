from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

class User(AbstractUser):
    email = models.EmailField(max_length=100, unique=True)
    username = models.CharField(max_length=100, unique=True)
    photos = models.ManyToManyField('photo.Photo', blank=True, related_name='user_photos')
    persons = models.ManyToManyField('person.Person', blank=True, related_name='user_persons')


    groups = models.ManyToManyField(Group, related_name='user_set_groups', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='user_set_permissions', blank=True)

    REQUIRED_FIELDS = ['email']
