from tensorflow.keras.preprocessing.image import load_img
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from keras.applications.vgg16 import preprocess_input
import os
import shutil
import random
import numpy as np
import cv2
import sys
import locale

# Set encoding and locale
sys.stdout.reconfigure(encoding='utf-8')
os.environ["PYTHONIOENCODING"] = "utf-8"
locale.setlocale(category=locale.LC_ALL, locale="en_GB.UTF-8")

# Load the model
model = load_model("python/10class_v1.h5")

def generate_image(path):
    # Read and preprocess the image
    image = load_img(path, target_size=(224, 224))
    image = img_to_array(image)
    image = image.reshape((1, image.shape[0], image.shape[1], image.shape[2]))
    image = preprocess_input(image)

    # Predict
    yhat = model.predict(image)
    classes = ["airplane", "ant", "apple", "axe", "banana", "bed", "bench", "bicycle", "book", "bus"]
    pred = np.argmax(yhat)
    obj = classes[pred]
    print(f"Figure is of: {obj}")

    # Select random example image
    n = random.randint(0, 9)
    selected_path = f"python/objects/{obj}/{obj}{n}.jpg"
    print(f"{selected_path}")

if __name__ == "__main__":
    file_path = sys.argv[1]
    generate_image(file_path)
