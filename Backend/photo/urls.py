from django.urls import path

from . import views

urlpatterns = [
    path("all", views.getAllPhotos),
    path("add", views.postPhoto),
    path("delete/<int:id>", views.deletePhoto),


]
