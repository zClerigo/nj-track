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

MODEL_PATH = os.path.join(settings.BASE_DIR, 'api', 'yolo_weights', 'last.pt')

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    


class ImageUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        try:
            # Load and convert the uploaded image
            uploaded_file = request.FILES['image']
            image = Image.open(uploaded_file).convert('RGB')
            
            # Convert PIL image to a format that Roboflow can read
            buffer = io.BytesIO()
            image.save(buffer, format="JPEG")
            buffer.seek(0)

            # Save to a temporary file
            temp_filename = "temp_image.jpg"
            with open(temp_filename, "wb") as temp_file:
                temp_file.write(buffer.getvalue())
            
            # Initialize Roboflow and make prediction
            rf = Roboflow(api_key="aUpxYiUWmS1AFzvc32po")
            project = rf.workspace().project("hair-8c4kd")
            model = project.version(1).model
            prediction = model.predict(temp_filename, hosted=False).json()

            # Clean up temporary file
            os.remove(temp_filename)
            
            # Extract prediction data
            predictions = prediction.get('predictions', [])
            if not predictions:
                return Response({'error': 'No predictions found'}, status=500)

            # Identify the class with the highest confidence
            classes_data = predictions[0].get('predictions', {})
            if not classes_data:
                return Response({'error': 'No class data found in predictions'}, status=500)
            
            top_class = max(classes_data.items(), key=lambda item: item[1]['confidence'])
            class_name, class_info = top_class[0], top_class[1]
            confidence = class_info['confidence']

            # Annotate the image with the top prediction
            draw = ImageDraw.Draw(image)
            annotation_text = f"{class_name.capitalize()} ({confidence * 100:.2f}%)"
            font = ImageFont.load_default()  # You can load a custom font if available

            # Define position and draw text
            text_position = (10, 10)
            text_color = (255, 0, 0)
            draw.text(text_position, annotation_text, fill=text_color, font=font)
            
            buffer = io.BytesIO()
            image.save(buffer, format="JPEG")
            annotated_image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

            return Response({'image': annotated_image_base64, 'prediction': {'class': class_name, 'confidence': confidence}}, status=200)

        except Exception as e:
            print(f"Error processing the image: {e}")
            return Response({'error': 'Failed to process image'}, status=500)
        
# class ImageUploadView(APIView):
#     parser_classes = (MultiPartParser, FormParser)

#     def post(self, request, *args, **kwargs):
#         try:
#             uploaded_file = request.FILES['image']
            
#             image = Image.open(uploaded_file).convert('RGB')
            
#             img_np = np.array(image)
            
#             model = torch.hub.load('ultralytics/yolov5', 'custom', path=MODEL_PATH, force_reload=True)
            
#             results = model(img_np)
            
#             results.render()
            
#             processed_image = np.squeeze(results.render())
#             img_pil = Image.fromarray(processed_image.astype('uint8'))
            
#             buffer = io.BytesIO()
#             img_pil.save(buffer, format="JPEG")
#             processed_image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

#             return Response({'image': processed_image_base64}, status=200)

#         except Exception as e:
#             print(f"Error processing the image: {e}")
#             return Response({'error': 'Failed to process image'}, status=500)