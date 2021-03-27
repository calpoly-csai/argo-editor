import numpy as np
from six import b
import tensorflow as tf
import tensorflow_hub as hub
import urllib
import base64
from io import BytesIO
from PIL import Image
import PIL
import os

source_url = "https://github.com/intel-isl/MiDaS/releases/download/v2_1/model_opt.tflite"
model_filename = "src/models/depth_perception.tflite"

if not "depth_perception.tflite" in os.listdir('src/models'):
    urllib.request.urlretrieve(source_url, model_filename)


def midas_find_depth(b64_image:str) -> str:
    header = b64_image.split(",")[0] + ","
    image = decode_image(b64_image)
    result = predict_depth(image)
    return result.tolist()


def decode_image(uri: str) -> np.array:
    """
    Translates image from base64 string to numpy array.
    """
    data = uri.split(",")[1]
    data = BytesIO(base64.b64decode(data))
    image = Image.open(data).convert("RGB")
    return np.array(image)

def encode_image(img_array: np.array) -> str:
    """
    Encodes image data in a numpy array into a base64 string.
    """
    buffered = BytesIO()
    Image.fromarray(img_array).save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue())
    return img_str.decode()

def predict_depth(image : np.array) -> np.array:
    """
        Runs the Midas model on image data and returns depth at each pixel.
    """
    img_resized = tf.image.resize(image, [256,256], method='bicubic', preserve_aspect_ratio=False)
    img_input = img_resized.numpy()
    mean=[0.485, 0.456, 0.406]
    std=[0.229, 0.224, 0.225]
    img_input = (img_input - mean) / std
    reshape_img = img_input.reshape(1,256,256,3)
    tensor = tf.convert_to_tensor(reshape_img, dtype=tf.float32)

    # load model
    interpreter = tf.lite.Interpreter(model_path=model_filename)
    interpreter.allocate_tensors()
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    input_shape = input_details[0]['shape']

    # inference
    interpreter.set_tensor(input_details[0]['index'], tensor)
    interpreter.invoke()
    output = interpreter.get_tensor(output_details[0]['index'])
    output = output.reshape(256, 256)

    # output file
    depth_min = output.min()
    depth_max = output.max()
    prediction = (255 * (output - depth_min) / (depth_max - depth_min)).astype("uint8")
    prediction = Image.fromarray(prediction).resize((image.shape[1], image.shape[0]), PIL.Image.BICUBIC)
    return np.array(prediction)