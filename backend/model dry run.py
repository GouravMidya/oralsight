# -*- coding: utf-8 -*-
"""
Created on Thu Sep 26 19:41:30 2024

@author: goura
"""
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np

# Load the saved model
model = tf.keras.models.load_model('C:/Users/goura/Desktop/dental_radiography_model.h5')

# Function to preprocess the image
def preprocess_image(img_path):
    img = image.load_img(img_path, target_size=(224, 224))  # Resize to match model input size
    img_array = image.img_to_array(img)                     # Convert to array
    img_array = np.expand_dims(img_array, axis=0)           # Expand dimensions to fit batch format
    img_array = img_array / 255.0                           # Normalize the image to match training process
    return img_array

# Function to make prediction and get the confidence scores
def predict_image(model, img_path, class_labels):
    img_array = preprocess_image(img_path)
    predictions = model.predict(img_array)  # Get the prediction probabilities
    
    # Get the predicted class and confidence score
    predicted_class = np.argmax(predictions, axis=1)
    confidence_score = np.max(predictions) * 100  # Convert to percentage

    # Output the predicted class and confidence
    print(f"Predicted Class: {class_labels[predicted_class[0]]}")
    print(f"Confidence Score: {confidence_score:.2f}%")

# Define the class labels (replace with your actual class labels)
class_labels = ['cavity', 'fillings', 'impacted tooth', 'implant', 'normal']

# Predict an image (replace 'path_to_your_image' with the actual image path)
predict_image(model, 'C:/Users/goura/Desktop/filling_teeth.png', class_labels)

