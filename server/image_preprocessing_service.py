# image_preprocessing_service.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np
import os

app = Flask(__name__)
CORS(app)

@app.route('/preprocess', methods=['POST'])
def preprocess_image():
    data = request.get_json()
    file_path = data['file_path']
    try:
        image = Image.open(file_path)
        input_image = preprocess_image(image)
        preprocessed_path = file_path.replace('uploads', 'preprocessed')
        os.makedirs(os.path.dirname(preprocessed_path), exist_ok=True)
        np.save(preprocessed_path, input_image)
        return jsonify({"preprocessed_path": preprocessed_path}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def preprocess_image(image):
    input_image = image.resize((256, 256))
    input_image = np.array(input_image).astype(np.float32) / 255.0
    input_image = np.transpose(input_image, (2, 0, 1))[:3, :, :]
    input_image = np.expand_dims(input_image, axis=0)
    return input_image

if __name__ == '__main__':
    app.run(port=5002)
