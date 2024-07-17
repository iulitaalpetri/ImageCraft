from django.urls import path

from . import views

urlpatterns = [
    path("add/<int:detectd_face_id>", views.addPerson),
    path("all", views.getAllPersons),
    path("get/<int:photo_id>", views.getAllPersonsPhoto),
    
    

]
