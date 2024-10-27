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
            model = torch.hub.load('ultralytics/yolov5', 'yolov5s')
            results = model(img_np)

            counts = {
                'person': (results.pred[0][:, -1] == 0).sum().item(),
                'chair': (results.pred[0][:, -1] == 56).sum().item(),
                'people_sitting': 0
            }
            person_boxes = []
            chair_boxes = []
            occupied_chairs = []

            for *xyxy, conf, cls in results.pred[0]:
                x1, y1, x2, y2 = map(int, xyxy)
                if cls == 0:
                    person_boxes.append((x1, y1, x2, y2))
                elif cls == 56:
                    chair_boxes.append((x1, y1, x2, y2))

                color = (255, 0, 0) if cls == 0 else (0, 255, 0)
                label = f"{'Person' if cls == 0 else 'Chair'}: {conf:.2f}"
                cv2.rectangle(img_np, (x1, y1), (x2, y2), color, 2)
                cv2.putText(img_np, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

            for p_idx, (px1, py1, px2, py2) in enumerate(person_boxes):
                for c_idx, (cx1, cy1, cx2, cy2) in enumerate(chair_boxes):
                    if self.check_overlap((px1, py1, px2, py2), (cx1, cy1, cx2, cy2)):
                        counts['people_sitting'] += 1
                        occupied_chairs.append(c_idx)
                        break

            img_pil = Image.fromarray(img_np)
            buffer = io.BytesIO()
            img_pil.save(buffer, format="JPEG")
            processed_image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

            return Response({'image': processed_image_base64, 'counts': counts, 'occupied_chairs': occupied_chairs}, status=200)

        except Exception as e:
            print(f"Error processing the image: {e}")
            return Response({'error': 'Failed to process image'}, status=500)

    @staticmethod
    def check_overlap(box1, box2):
        x1 = max(box1[0], box2[0])
        y1 = max(box1[1], box2[1])
        x2 = min(box1[2], box2[2])
        y2 = min(box1[3], box2[3])
        
        return x1 < x2 and y1 < y2