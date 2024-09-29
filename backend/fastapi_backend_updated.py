# -*- coding: utf-8 -*-
"""
Created on Sun Sep 29 10:24:43 2024

@author: gourav
"""

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import tensorflow as tf
from PIL import Image
from io import BytesIO
from typing import List
import base64
import os
import cv2
# Ultralytics, SAM, and Supervision imports
from ultralytics import YOLO
import supervision as sv
from segment_anything import sam_model_registry, SamPredictor

app = FastAPI()

# Allow CORS for the frontend (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the YOLO model
print("Loading Yolo model")
yolo_model = YOLO('C:/Users/goura/Documents/oralsight/models/best.pt')  # Update path to YOLO model

# Load the SAM model and its predictor
print("Loading SAM model")
sam_checkpoint = "C:/Users/goura/Documents/oralsight/models/sam_vit_h.pth"  # Update with your SAM checkpoint path
sam = sam_model_registry["vit_h"](checkpoint=sam_checkpoint)
predictor = SamPredictor(sam)

# Load the classification model
print("Loading Classfication model")
classification_model = tf.keras.models.load_model('C:/Users/goura/Documents/oralsight/models/dental_radiography_model.h5')

# Class labels for the classification model
class_labels = ['cavity', 'fillings', 'impacted tooth', 'implant', 'normal']

# Function to preprocess the image for classification
def preprocess_image_for_model(img):
    img = cv2.resize(img, (224, 224))  # Resize to match model input size
    img_array = np.expand_dims(img, axis=0)  # Expand dimensions to fit batch format
    img_array = img_array / 255.0  # Normalize the image
    return img_array

# Helper function to convert image to base64 string
def image_to_base64(img):
    _, buffer = cv2.imencode('.png', img)
    img_base64 = base64.b64encode(buffer).decode()
    return img_base64

# Main API endpoint
@app.post("/predict/")
async def predict(files: List[UploadFile] = File(...)):
    print("Request received")
    results = []

    for file in files:
        # Read the uploaded file
        contents = await file.read()
        img = Image.open(BytesIO(contents)).convert("RGB")
        image_np = np.array(img)
        
        print(f"Processing file: {file.filename}")
        print(f"Image shape: {image_np.shape}")

        # Perform inference with YOLO
        yolo_results = yolo_model(source=image_np, conf=0.25)[0]  # Pass numpy array instead of BytesIO
        detections = sv.Detections.from_ultralytics(yolo_results)
        
        print(f"YOLO detections completed successfully")

        # Set the image for SAM predictor (in RGB format)
        predictor.set_image(image_np)

        # Iterate over each detected bounding box
        annotations = []
        for idx, (x1, y1, x2, y2) in enumerate(detections.xyxy):  # YOLO bounding box format (x1, y1, x2, y2)

            # Convert bounding box to a format SAM expects
            bbox = [x1, y1, x2, y2]
            input_box = np.array(bbox)

            # Perform segmentation using SAM
            masks, scores, logits = predictor.predict(
                point_coords=None,
                point_labels=None,
                box=input_box[None, :],  # SAM expects a batch of boxes
                multimask_output=False  # We are using a single mask
            )

            # Extract the first mask (since we requested a single mask)
            mask = masks[0]

            # Use the mask to segment the tooth from the original image
            segmented_tooth = cv2.bitwise_and(image_np, image_np, mask=mask.astype(np.uint8))

            # Crop the image to the bounding box (removing extra background)
            cropped_tooth = segmented_tooth[int(y1):int(y2), int(x1):int(x2)]

            # Preprocess the cropped tooth for the classification model
            preprocessed_tooth = preprocess_image_for_model(cropped_tooth)

            # Run the classification model on the preprocessed image
            predictions = classification_model.predict(preprocessed_tooth)

            # Get the predicted class and confidence score
            predicted_class = int(np.argmax(predictions, axis=1)[0])
            confidence_score = float(np.max(predictions) * 100)  # Convert to percentage

            # Store the bounding box, mask, and class label for the frontend to use as annotations
            annotations.append({
                "bbox": [float(x1), float(y1), float(x2), float(y2)],
                "mask": image_to_base64(mask.astype(np.uint8) * 255),  # Convert mask to base64
                "predicted_class": class_labels[predicted_class],
                "confidence": confidence_score
            })

        # Encode original image as base64 for frontend
        img_base64 = image_to_base64(image_np)

        # Add result to the list
        results.append({
            "filename": file.filename,
            "image_data": img_base64,
            "annotations": annotations
        })

    return results

