from django.urls import path
from . import views

urlpatterns = [
    path('upload_image/', views.ImageUploadView.as_view(), name='upload-image'), 
    path("get_train_data/", views.GetTrainDataView.as_view(), name="get_train_data"),
]