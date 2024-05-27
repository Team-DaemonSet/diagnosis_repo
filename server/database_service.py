from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql

app = Flask(__name__)
CORS(app)

# RDS 설정
rds_host = 'dd-db.c7e8iuqi6hn4.ap-northeast-1.rds.amazonaws.com'
rds_user = 'root'
rds_password = 'test1234'
rds_db = 'DaemonSet'

def save_to_database(email, s3_url):
    connection = pymysql.connect(host=rds_host, user=rds_user, password=rds_password, db=rds_db)
    try:
        with connection.cursor() as cursor:
            sql = "INSERT INTO diagnosis (email, image_url) VALUES (%s, %s)"
            cursor.execute(sql, (email, s3_url))
            connection.commit()
    finally:
        connection.close()

@app.route('/save', methods=['POST'])
def save():
    data = request.get_json()
    email = data['email']
    s3_url = data['s3_url']
    save_to_database(email, s3_url)
    return jsonify({"message": "Data saved successfully"}), 201

if __name__ == '__main__':
    app.run(port=5002)
