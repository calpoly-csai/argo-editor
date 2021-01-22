import numpy as np
import tensorflow_hub as hub
import base64
from io import BytesIO
from PIL import Image
import tensorflow as tf

ST_Model = hub.load('https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2')

def apply_style_transfer(content_uri:str, style_uri:str) -> str:
    """
    Applies the style transfer effect to provided images.

    Returns base64 image representation.
    """
    content_image = decode_image(content_uri)
    content_image = process_image(content_image)
    style_image = decode_image(style_uri)
    style_image = process_image(style_image)
    
    style_image = tf.image.resize(style_image, (256, 256))
    results = ST_Model(tf.constant(content_image), tf.constant(style_image))
    return encode_image(results[0][0])


def decode_image(uri: str) -> np.array:
    """
    Translates image from base64 to numpy array
    """
    data = uri.split(",")[1]
    data = BytesIO(base64.b64decode(data))
    return np.array(Image.open(data))

def encode_image(img_array: np.array) -> str:
    """
        Encodes image data for transfer to frontend.
    """
    img_array = (img_array.numpy() * 255).astype("uint8")
    image = Image.fromarray(img_array)
    data = BytesIO()
    image.save(data, "JPEG")
    data.seek(0)
    return base64.b64encode(data.read()).decode()



def process_image(image_data:np.array) -> np.array:
    """
    Prepares np array image for style transfer model
    """
    return image_data.astype(np.float32)[np.newaxis,...] / 255
