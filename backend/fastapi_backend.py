from fastapi import FastAPI, File, UploadFile
from tensorflow.keras.preprocessing import image
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import tensorflow as tf
from io import BytesIO
from PIL import Image
from typing import List
import base64

app = FastAPI()

# Allow CORS for the frontend (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the saved model
model = tf.keras.models.load_model('C:/Users/goura/Desktop/dental_radiography_model.h5')

# Define the class labels
class_labels = ['cavity', 'fillings', 'impacted tooth', 'implant', 'normal']

# Preprocess image function
def preprocess_image(img: Image.Image):
    img = img.resize((224, 224))
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0
    return img_array

@app.post("/predict/")
async def predict(files: List[UploadFile] = File(...)):
    results = []
    for file in files:
        # Read the uploaded file
        contents = await file.read()
        img = Image.open(BytesIO(contents))
        
        # Preprocess the image
        img_array = preprocess_image(img)
        
        # Make prediction
        predictions = model.predict(img_array)
        
        # Get the predicted class and confidence
        predicted_class = np.argmax(predictions, axis=1)[0]
        confidence_score = float(np.max(predictions) * 100)
        
        # Encode image to base64
        buffered = BytesIO()
        img.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        # Add result to the list
        results.append({
            "filename": file.filename,
            "predicted_class": class_labels[predicted_class],
            "confidence": confidence_score,
            "image_data": img_str
        })
    
    return results