import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
import os

# Load the trained model
model = tf.keras.models.load_model('best_model.keras')

# Class mapping
class_labels = {
    0: '1Hundrednote',
    1: '2Hundrednote',
    2: '2Thousandnote',
    3: '5Hundrednote',
    4: 'Fiftynote',
    5: 'Tennote',
    6: 'Twentynote'
}

def predict_image(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0

    predictions = model.predict(img_array)
    class_idx = np.argmax(predictions)
    confidence = np.max(predictions)

    return class_labels[class_idx], confidence

# Example usage
img_path = input("Enter the path of the currency image: ")
if os.path.exists(img_path):
    label, confidence = predict_image(img_path)
    print(f"Predicted denomination: {label} with confidence: {confidence:.2f}")
else:
    print("Image path does not exist!")
