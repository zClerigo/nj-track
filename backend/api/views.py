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
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import os
import requests
from dotenv import load_dotenv
from pathlib import Path


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class ImageUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        try:
            uploaded_file = request.FILES["image"]
            image = Image.open(uploaded_file).convert("RGB")
            img_np = np.array(image)
            model = torch.hub.load("ultralytics/yolov5", "yolov5s")
            results = model(img_np)

            counts = {
                "person": (results.pred[0][:, -1] == 0).sum().item(),
                "chair": (results.pred[0][:, -1] == 56).sum().item(),
                "people_sitting": 0,
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
                cv2.putText(
                    img_np,
                    label,
                    (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    color,
                    2,
                )

            for p_idx, (px1, py1, px2, py2) in enumerate(person_boxes):
                for c_idx, (cx1, cy1, cx2, cy2) in enumerate(chair_boxes):
                    if self.check_overlap((px1, py1, px2, py2), (cx1, cy1, cx2, cy2)):
                        counts["people_sitting"] += 1
                        occupied_chairs.append(c_idx)
                        break

            img_pil = Image.fromarray(img_np)
            buffer = io.BytesIO()
            img_pil.save(buffer, format="JPEG")
            processed_image_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

            return Response(
                {
                    "image": processed_image_base64,
                    "counts": counts,
                    "occupied_chairs": occupied_chairs,
                },
                status=200,
            )

        except Exception as e:
            print(f"Error processing the image: {e}")
            return Response({"error": "Failed to process image"}, status=500)

    @staticmethod
    def check_overlap(box1, box2):
        x1 = max(box1[0], box2[0])
        y1 = max(box1[1], box2[1])
        x2 = min(box1[2], box2[2])
        y2 = min(box1[3], box2[3])

        return x1 < x2 and y1 < y2


# Load environment variables
ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(ENV_PATH)

TOKEN = str(os.getenv("NJ_TRANSIT_TOKEN"))

REFRESH_PAYLOAD = {
    "username": os.getenv("NJ_TRANSIT_USER"),
    "password": os.getenv("NJ_TRANSIT_PWD"),
}

HEADERS = {
    "accept": "text/plain",
}


def refresh_token():
    """
    Gets New NJ TRANSIT TOKEN, updates it to the .env file and returns the new token.
    """
    global TOKEN
    try:
        response = requests.post(
            "https://testraildata.njtransit.com/api/TrainData/getToken",
            data=REFRESH_PAYLOAD,
            headers=HEADERS,
        )
        print(response.text)
        response.raise_for_status()
        data = response.json()
        new_token = data.get("UserToken", False)
        if new_token:
            # Update the .env file with the new token
            update_env_file(new_token)
            TOKEN = new_token
            return new_token
        else:
            errorMsg = data.get("errorMessage", "Failed to get new token")
            raise Exception(errorMsg)
    except requests.RequestException as e:
        print(f"Error refreshing token: {e}")
        raise Exception("Failed to refresh token")


def update_env_file(new_token):
    """
    Updates the NJ_TRANSIT_TOKEN in the .env file.
    """
    try:
        # Read the existing .env file
        with open(ENV_PATH, "r") as file:
            lines = file.readlines()

        # Update the token in the .env file
        with open(ENV_PATH, "w") as file:
            for line in lines:
                if line.startswith("NJ_TRANSIT_TOKEN"):
                    file.write(f'NJ_TRANSIT_TOKEN = "{new_token}"\n')
                else:
                    file.write(line)

        # Reload the environment variables
        load_dotenv(ENV_PATH)
        print("Token successfully updated in .env file")

    except Exception as e:
        print(f"Error updating .env file: {e}")
        raise Exception("Failed to update .env file")


class GetTrainDataView(APIView):
    """
    API endpoint to get the train data from the NJ Transit API.
    """

    def get(self, request, *args, **kwargs):
        global TOKEN
        try:
            train_data = self.getTrainData(TOKEN, request) 
            if train_data.get("errorMessage", False) == "Invalid token.":
                TOKEN = refresh_token() 
            train_data = self.getTrainData(TOKEN, request)     
            if train_data.get("errorMessage", False) == "Invalid train_id." or train_data.get("TRAIN_ID", False) ==  None:  
                return Response(
                    {"error": "Invalid Train ID"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if not TOKEN:
                raise Exception("Failed to get new token.")
            else:
                return Response(train_data, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error getting train data: {e}")
            return Response(
                {"error": "Failed to get train data"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @staticmethod
    def getTrainData(token, request):
        """
        Sends post request to getTrainStopList endpoint and returns formatted response
        """
        try: 
            train_id = request.query_params.get(
                "train_id"
            )  # Extract train_id from the request   
            train_id = str(train_id)  # Convert train_id to string  
            response = requests.post(
                "https://testraildata.njtransit.com/api/TrainData/getTrainStopList",
                data={"token": token, "train": train_id},
                headers=HEADERS,
            ) 
            if response.status_code == 204:
                data = {"errorMessage": "Invalid train_id."}
                return data
            data = response.json()
            return data
        except Exception as e:
            raise Exception(f"Failed to get train data: {e}")
