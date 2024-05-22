# model_serving_service.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import onnxruntime as ort
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# 현재 파일의 디렉토리 경로를 구합니다.
base_dir = os.path.dirname(os.path.abspath(__file__))
# 모델 파일의 상대 경로를 설정합니다.
model_path = os.path.join(base_dir, 'model', 'NIADerma_33cls.onnx')
session = ort.InferenceSession(model_path)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    preprocessed_path = data['preprocessed_path']
    try:
        input_image = np.load(preprocessed_path + '.npy')
        outputs = session.run(None, {'input': input_image})
        return jsonify({"outputs": outputs[0].tolist()}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5003)
