import boto3
from flask import Flask, request, jsonify
from flask_cors import CORS
import onnxruntime as ort
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

# 현재 파일의 디렉토리 경로를 구합니다.
base_dir = os.path.dirname(os.path.abspath(__file__))
# 모델 파일의 상대 경로를 설정합니다.
model_path = os.path.join(base_dir, 'model', 'NIADerma_33cls.onnx')
print(f"모델 경로: {model_path}")

try:
    session = ort.InferenceSession(model_path)
    print("모델 로드 성공")
except Exception as e:
    print(f"모델 로드 실패: {str(e)}")


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
        outputs = session.run(None, {'input': input_image})

        return jsonify({"outputs": outputs[0].tolist()}), 200
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