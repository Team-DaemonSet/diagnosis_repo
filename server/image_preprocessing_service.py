import boto3
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np
import os
from io import BytesIO

app = Flask(__name__)
CORS(app)

s3_client = boto3.client(
    's3',
    aws_access_key_id='AKIA47CR2RIJTJZY367M',
    aws_secret_access_key='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',
    region_name='ap-northeast-1'
)

UPLOAD_BUCKET = 'uploadimage-bucket'

@app.route('/preprocess', methods=['POST'])
def preprocess_image():
    data = request.get_json()
    print("Received data:", data)  # 로그에 데이터 출력
    if not data:
        return jsonify({"error": "No data provided"}), 400
    if 'file_path' not in data:
        return jsonify({"error": "file_path is required"}), 400
    
    file_path = data['file_path']
    try:
        # S3 버킷과 키를 추출
        bucket_name = UPLOAD_BUCKET
        object_key = file_path.split(f"https://{bucket_name}.s3.amazonaws.com/")[1]

        # S3에서 이미지 다운로드
        s3_response = s3_client.get_object(Bucket=bucket_name, Key=object_key)
        image_data = s3_response['Body'].read()
        image = Image.open(BytesIO(image_data))
        
        input_image = preprocess_image_data(image)

        # /tmp 디렉토리가 존재하는지 확인하고 생성
        if not os.path.exists('/tmp'):
            os.makedirs('/tmp')
        
        preprocessed_path = f"/tmp/{os.path.basename(file_path)}.npy"
        np.save(preprocessed_path, input_image)
        
        return jsonify({"preprocessed_path": preprocessed_path}), 200
    except Exception as e:
        print("Error during processing:", str(e))  # 로그에 에러 출력
        return jsonify({"error": str(e)}), 500

def preprocess_image_data(image):
    input_image = image.resize((256, 256))
    input_image = np.array(input_image).astype(np.float32) / 255.0
    input_image = np.transpose(input_image, (2, 0, 1))[:3, :, :]
    input_image = np.expand_dims(input_image, axis=0)
    return input_image

if __name__ == '__main__':
    app.run(port=5003)