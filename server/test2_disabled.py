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
model_path = os.path.join(base_dir, 'model', 'NIADerma_33cls.onnx')
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
        1: "정상", 2: "건선", 3: "광선 각화증",
        4: "기저 세포암", 5: "남성형 탈모", 6: "두드러기",
        7: "멜라닌 세포모반", 8: "모낭염", 9: "백반증",
        10: "백선", 11: "비립종", 12: "사마귀",
        13: "습진(아토피 피부염)", 14: "악성 흑색종", 15: "어루러기",
        16: "여드름", 17: "원형 탈모", 18: "장미색 비강진",
        19: "접촉 피부염", 20: "주사", 21: "쥐젖",
        22: "지루 각화증", 23: "지루 피부염",
        24: "특발 물방울 모양 멜라닌 저하증",
        25: "편평 세포암", 26: "피부낭종", 27: "피부섬유종",
        28: "피지샘 증식증", 29: "한관종", 30: "헤르페스 감염",
        31: "혈관종", 32: "흉터", 33: "흑색점"
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