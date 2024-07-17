from django.urls import path

from . import views

urlpatterns = [
    path("all", views.getAllPhotos),
    path("add", views.postPhoto),
    path("delete/<int:id>", views.deletePhoto),
    path("startedit/<int:id>", views.start_edit_session),
    path("dismiss", views.dismiss_changes),
    path("crop", views.crop_image),
    path("rotate", views.rotate_image),
    path("resize", views.resize_image),
    path("flip", views.flip_image),
    path("brightness", views.brightness_image),
    path("contrast", views.contrast_image),
    path("sharpness", views.sharpness_image),
    path("color", views.color_image),
    path("denoise", views.denoise_image),
    path("save", views.save_changes),
    path("currenturi", views.get_current_uri),
    path("person/<int:person_id>", views.getAllPhotosWithPerson),
    path("happy", views.get_happy_photos),
    

    path("undo", views.undo_changes),
]
