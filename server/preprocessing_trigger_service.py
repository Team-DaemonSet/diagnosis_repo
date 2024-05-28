import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

PREPROCESSING_SERVICE_URL = 'http://localhost:5003/preprocess'
DATABASE_SERVICE_URL = 'http://localhost:5002/save'

@app.route('/trigger', methods=['POST'])
def trigger():
    data = request.get_json()
    email = data['email']
    s3_url = data['s3_url']
    
    # 전처리 서비스 호출
    response = requests.post(PREPROCESSING_SERVICE_URL, json={"s3_url": s3_url})
    if response.status_code == 200:
        preprocessed_path = response.json()['preprocessed_path']
        
        # 데이터베이스 서비스 호출
        db_response = requests.post(DATABASE_SERVICE_URL, json={"email": email, "s3_url": s3_url})
        if db_response.status_code == 201:
            return jsonify({"message": "Triggered and saved successfully"}), 201
        else:
            return jsonify({"error": "Failed to save to database"}), 500
    else:
        return jsonify({"error": "Failed to preprocess image"}), 500

if __name__ == '__main__':
    app.run(port=5004)