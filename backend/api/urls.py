from django.urls import path
from . import views

urlpatterns = [
    path('upload_image/', views.ImageUploadView.as_view(), name='upload-image'),
]