from django.urls import path

from . import views

urlpatterns = [
    path("<int:image_id>", views.addDetectedFace),
    path("all/<int:image_id>", views.getAllDetectedFacesinPhoto),
    path("all", views.getAllDetectedFaces),
    path("delete/<int:id>", views.deleteDetectedFace),
    path("makeperson/<int:id>/<int:person_id>", views.makePerson),
    path("isperson/<int:detected_face_id>", views.isDetectedFacePerson),

]
