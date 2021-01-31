import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
import base64
from io import BytesIO
from PIL import Image

MIDAS = hub.load("https://hub.tensorflow.google.cn/intel/midas/v2/2", tags=['serve'])

def midas_find_depth(image:str) -> str:
    decoded_image = decode_image(image)
    input_image_data = image_to_data_Midas(decoded_image)
    tensor_image = image_to_Midas(input_image_data)
    output_image_data = Midas_to_image(tensor_image, decoded_image)
    encoded_image = encode_image(output_image_data)
    return encoded_image

# Steps:
#   1. Decode image
def decode_image(uri: str) -> np.array:
    """
    Translates image from base64 to numpy array
    """
    data = uri.split(",")[1]
    data = BytesIO(base64.b64decode(data))
    return np.array(Image.open(data))

#   2. Reformat image to data for Midas
def image_to_data_Midas(img_array: np.array) -> tf.Tensor:
    img_resized = tf.image.resize(img_array, [384, 384], method='bicubic', preserve_aspect_ratio=False)
    img_resized = tf.transpose(img_resized, [2, 0, 1]) 
    img_input = img_resized.numpy()
    reshape_img = img_input.reshape(1, 3, 384, 384)
    image_data = tf.convert_to_tensor(reshape_img, dtype=tf.float32)
    return image_data
    
#   3. Pass Image to Midas
def image_to_Midas(img_array: tf.Tensor):
    output = MIDAS.signatures['serving_default'](img_array)    # uses the model
    prediction = output['default'].numpy()
    prediction = prediction.reshape(384, 384)
    return prediction
    

#   4. Reformat data to image
def Midas_to_image(prediction: np.array, orig_img: np.array) -> np.array:
    prediction = tf.image.resize(prediction, [orig_img.shape[1],orig_img.shape[0]], method='bicubic', preserve_aspect_ratio=False)
    depth_min = prediction.min()
    depth_max = prediction.max()
    img_out = (255 * (prediction - depth_min) / (depth_max - depth_min)).astype("uint8")
    return img_out

#   5. Encode and return image
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
