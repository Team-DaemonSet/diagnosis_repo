import boto3
from flask import Flask, request, jsonify
import os
import datetime

app = Flask(__name__)

# S3 클라이언트 설정
s3_client = boto3.client(
    's3',
    aws_access_key_id='your-access-key-id',
    aws_secret_access_key='your-secret-access-key',
    region_name='your-region'
)

BUCKET_NAME = 'uploadimage-bucket'

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    file_name = file.filename
    file_path = os.path.join('/tmp', file_name)
    file.save(file_path)
    
    try:
        # S3 버킷에 파일 업로드
        s3_client.upload_file(file_path, BUCKET_NAME, file_name)
        s3_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{file_name}"
        
        # 데이터베이스에 저장
        diagnosis_id = save_to_database(file_name, s3_url)
        
        # 전처리 서비스로 요청
        response = requests.post(
            'http://localhost:5002/preprocess',
            json={'diagnosis_id': diagnosis_id, 's3_url': s3_url}
        )
        
        if response.status_code == 200:
            diagnosis_result = response.json()
            return jsonify(diagnosis_result), 200
        else:
            return jsonify({"error": "Failed to process and diagnose image"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def save_to_database(file_name, s3_url):
    # 데이터베이스 저장 로직 추가
    # 예를 들어, SQLite를 사용할 경우:
    import sqlite3
    conn = sqlite3.connect('diagnosis.db')
    c = conn.cursor()
    diagnosis_id = generate_diagnosis_id()
    email = request.form['email']
    diagnosis_date = datetime.datetime.now()
    c.execute("INSERT INTO diagnosis (diagnosis_id, email, diagnosis_date, image_url) VALUES (?, ?, ?, ?)",
              (diagnosis_id, email, diagnosis_date, s3_url))
    conn.commit()
    conn.close()
    return diagnosis_id

def generate_diagnosis_id():
    # 고유한 진단 ID 생성 로직
    return str(uuid.uuid4())

if __name__ == '__main__':
    app.run(port=5001)
