from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.files.uploadedfile import InMemoryUploadedFile
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
import cv2
from rest_framework import status
import os
import torch
import matplotlib.pyplot as plt
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import io
import base64
from django.conf import settings
from roboflow import Roboflow
import requests

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
            
class ImageUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        try:
            uploaded_file = request.FILES['image']
            
            image = Image.open(uploaded_file).convert('RGB')
            img_np = np.array(image)
            
            # Load the YOLOv5 model
            model = torch.hub.load('ultralytics/yolov5', 'yolov5s')

            # Run inference
            results = model(img_np)

            # Extract counts from results
            counts = {
                'person': (results.pred[0][:, -1] == 0).sum().item(),  # Assuming class 0 is 'person'
                'chair': (results.pred[0][:, -1] == 56).sum().item(),  # Assuming class 56 is 'chair'
            }

            results.render()  # Render the results
            processed_image = np.squeeze(results.render())
            img_pil = Image.fromarray(processed_image.astype('uint8'))
            
            buffer = io.BytesIO()
            img_pil.save(buffer, format="JPEG")
            processed_image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

            # Return the processed image and counts in the response
            return Response({'image': processed_image_base64, 'counts': counts}, status=200)

        except Exception as e:
            print(f"Error processing the image: {e}")
            return Response({'error': 'Failed to process image'}, status=500)
