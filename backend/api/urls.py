from django.urls import path
from . import views

urlpatterns = [
    path('upload_image/', views.ImageUploadView.as_view(), name='upload-image'), 
    path('validate_token/', views.ValidateTokenView.as_view(), name='validate_token'),
    path('refresh_token/', views.RefreshTokenView.as_view(), name='refresh_token'),
    path('get_token/', views.GetTokenView.as_view(), name='get_token'),
]