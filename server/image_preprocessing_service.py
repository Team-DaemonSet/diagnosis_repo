import boto3
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np
import os
import requests
from io import BytesIO

app = Flask(__name__)
CORS(app)

s3_client = boto3.client(
    's3',
    aws_access_key_id='AKIA47CR2RIJTJZY367M',
    aws_secret_access_key='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',
    region_name='ap-northeast-1'
)

@app.route('/preprocess', methods=['POST'])
def preprocess_image():
    data = request.get_json()
    print("Received data:", data)  # 로그에 데이터 출력
    if 'file_path' not in data:
        return jsonify({"error": "file_path is required"}), 400
    
    file_path = data['file_path']
    try:
        response = requests.get(file_path)
        image = Image.open(BytesIO(response.content))
        input_image = preprocess_image_data(image)
        
        preprocessed_path = f"/tmp/{os.path.basename(file_path)}.npy"
        np.save(preprocessed_path, input_image)
        
        return jsonify({"preprocessed_path": preprocessed_path}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def preprocess_image_data(image):
    input_image = image.resize((256, 256))
    input_image = np.array(input_image).astype(np.float32) / 255.0
    input_image = np.transpose(input_image, (2, 0, 1))[:3, :, :]
    input_image = np.expand_dims(input_image, axis=0)
    return input_image

if __name__ == '__main__':
    app.run(port=5003)
