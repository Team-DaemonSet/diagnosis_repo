# result_interpretation_service.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route('/interpret', methods=['POST'])
def interpret():
    data = request.get_json()
    outputs = np.array(data['outputs'])
    results = interpret_results(outputs)
    return jsonify(results), 200

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

    scores = outputs[0]
    exp_scores = np.exp(scores)
    probs = exp_scores / np.sum(exp_scores) * 100

    # 결과 딕셔너리 생성
    # 상위 두 개의 진단명을 찾기 위한 정렬
    sorted_indices = np.argsort(probs)[::-1]  # 내림차순 정렬
    top1_index = sorted_indices[0]
    top2_index = sorted_indices[1]

    top1_prob = probs[top1_index]
    top2_prob = probs[top2_index]
    top1_diagnosis = diagnosis_names[top1_index + 1]
    top2_diagnosis = diagnosis_names[top2_index + 1]

    # 결과 딕셔너리 생성
    results = {
        "Top 1 Diagnosis": {
            "Name": top1_diagnosis,
            "Probability": f"{top1_prob:.2f}%"
        },
        "Top 2 Diagnosis": {
            "Name": top2_diagnosis,
            "Probability": f"{top2_prob:.2f}%"
        },
        "Others": []
    }

    # 나머지 31개의 진단명을 기타에 저장
    for i in sorted_indices[2:]:
        diagnosis_name = diagnosis_names[i + 1]
        prob = probs[i]
        results["Others"].append({
            "Name": diagnosis_name,
            "Probability": f"{prob:.4f}%"
        })

    return results

if __name__ == '__main__':
    app.run(port=5004)
