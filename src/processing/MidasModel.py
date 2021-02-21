import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
import urllib
# from cv2 import cv2
import base64
from io import BytesIO
from PIL import Image
import os

source_url = "https://github.com/intel-isl/MiDaS/releases/download/v2_1/model_opt.tflite"
model_filename = "src/models/depth_perception.tflite"

if not "depth_perception.tflite" in os.listdir('src/models'):
    urllib.request.urlretrieve(source_url, model_filename)

# below can be put into a function if most of the model loading process takes place above
interpreter = tf.lite.Interpreter(model_path=model_filename)


def midas_find_depth(image:str) -> str:
    test_notebook()
    return 
    print("Decoding image...")
    decoded_image = decode_image(image)
    initial_shape = decoded_image.shape
    print("Image to data Midas...")
    input_image_data = image_to_data_Midas(decoded_image)
    print("Image to Midas...")
    tensor_image = image_to_Midas(input_image_data)
    print(tensor_image)
    print("Midas to image...")
    output_image_data = Midas_to_image(tensor_image, initial_shape)
    print("Encode image...")
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
    img_resized = tf.image.resize(img_array, [256,256], method='bicubic', preserve_aspect_ratio=False)
    img_input = img_resized.numpy()
    mean=[0.485, 0.456, 0.406]
    std=[0.229, 0.224, 0.225]
    img_input = (img_input - mean) / std
    reshape_img = img_input.reshape(1,256,256,3)
    tensor = tf.convert_to_tensor(reshape_img, dtype=tf.float32)
    return tensor
    
#   3. Pass Image to Midas
def image_to_Midas(img_array: tf.Tensor):
    interpreter.allocate_tensors()
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    input_shape = input_details[0]['shape'] # not used
    interpreter.set_tensor(input_details[0]['index'], img_array)
    interpreter.invoke()
    output = interpreter.get_tensor(output_details[0]['index'])
    output = output.reshape(256, 256)
    return output
    

#   4. Reformat data to image
def Midas_to_image(prediction: tf.Tensor, target_shape: tuple) -> np.array:
    print("In Midas to Image")
    print(prediction.numpy()[1 : 7]) 
    resized_image = tf.image.resize(prediction, target_shape)
    # prediction = cv2.resize(prediction, target_shape, interpolation=cv2.INTER_CUBIC)
    print(" Write image to: output.png")
    depth_min = resized_image.min()
    depth_max = resized_image.max()
    img_out = ((resized_image - depth_min) / (depth_max - depth_min)).astype("uint8")
    tf.io.encode_jpeg("output.png", 255 * img_out)
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

def test_notebook():
    #print("Opening test input")
    f = open("./test.jpg", "rb")
    #print("Opened test input")
    url, filename = ("https://github.com/intel-isl/MiDaS/releases/download/v2_1/model_opt.tflite", "model_opt.tflite")
    urllib.request.urlretrieve(url, filename)
    nparr = np.fromstring(f.read(), np.uint8)
    f.close()
    img = cv2.imdecode(nparr, flags=1) 
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB) / 255.0

    img_resized = tf.image.resize(img, [256,256], method='bicubic', preserve_aspect_ratio=False)
    #img_resized = tf.transpose(img_resized, [2, 0, 1])
    img_input = img_resized.numpy()
    mean=[0.485, 0.456, 0.406]
    std=[0.229, 0.224, 0.225]
    img_input = (img_input - mean) / std
    reshape_img = img_input.reshape(1,256,256,3)
    tensor = tf.convert_to_tensor(reshape_img, dtype=tf.float32)

    #print("Loading model...")
    # load model
    interpreter = tf.lite.Interpreter(model_path="model_opt.tflite")
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
    prediction = cv2.resize(output, (img.shape[1], img.shape[0]), interpolation=cv2.INTER_CUBIC)
    print(" Write image to: output.png")
    depth_min = prediction.min()
    depth_max = prediction.max()
    img_out = (255 * (prediction - depth_min) / (depth_max - depth_min)).astype("uint8")

    cv2.imwrite("output.png", img_out)
