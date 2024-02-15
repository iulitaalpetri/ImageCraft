from django.urls import path

from . import views

urlpatterns = [
    path("all", views.getAllPhotos),
    path("add", views.postPhoto),
    path("delete/<int:id>", views.deletePhoto),
    path("edit/<int:photo_id>", views.save_changes),
    path("save/<int:photo_id>", views.finalize_edits),
    path("undo", views.undo_changes),
]
