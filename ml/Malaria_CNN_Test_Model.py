from keras.models import load_model
import numpy as np
import os
from keras.preprocessing import image
from keras.applications.vgg19 import preprocess_input

def predict(model, image_path):

    image_size = (96, 96)
    """Use VGG19 to label image"""
    img = image.load_img(image_path, target_size=image_size)
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    prediction = model.predict(x).round()
    if prediction == 0:
        return 'Infected'
    else:
        return 'Uninfected'

