from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import onnxruntime
from PIL import Image
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# 현재 파일의 디렉토리 경로를 구합니다.
base_dir = os.path.dirname(os.path.abspath(__file__))

# 모델 파일의 상대 경로를 설정합니다.
model_path = os.path.join(base_dir, 'model', 'NIADerma_4cls.onnx')
session = onnxruntime.InferenceSession(model_path)

# ONNX 모델 로드
session = onnxruntime.InferenceSession(model_path)

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        image = Image.open(file.stream)
        input_image = preprocess_image(image)
        
        # 모델 실행 및 결과 계산
        outputs = session.run(None, {'input': input_image})
        results = interpret_results(outputs)

        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def preprocess_image(image):
    input_image = image.resize((256, 256))
    input_image = np.array(input_image).astype(np.float32) / 255.0
    input_image = np.transpose(input_image, (2, 0, 1))[:3, :, :]
    input_image = np.expand_dims(input_image, axis=0)
    return input_image

def interpret_results(outputs):
    # 클래스별 진단명 설정
    diagnosis_names = {
        1: "정상",
        2: "건선",
        3: "아토피",
        4: "여드름"
    }

    scores = np.array(outputs[0][0])
    exp_scores = np.exp(scores)
    probs = exp_scores / np.sum(exp_scores) * 100

    # 결과 딕셔너리 생성
    results = {f"Class {i}": f"{prob:.4f}%" for i, prob in enumerate(probs, start=1)}

    # 가장 높은 확률 찾기
    max_index = np.argmax(probs)
    max_probability = probs[max_index]
    max_diagnosis = diagnosis_names[max_index + 1]  # 클래스 인덱스에 맞게 진단명 매핑

    # 최종 진단명과 확률 추가
    results['Diagnosis'] = f"{max_probability:.2f}% 확률로 '{max_diagnosis}'입니다"

    return results

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')