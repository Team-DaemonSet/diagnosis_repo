from flask import Flask, request, jsonify, session
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_mysqldb import MySQL
import MySQLdb.cursors
from flask_cors import CORS
import datetime

from random import random
from time import sleep
from prometheus_flask_exporter import PrometheusMetrics

app = Flask(__name__)
CORS(app)

############# Database #################
app.secret_key = 'TeamDaemonSet'
app.config['MYSQL_HOST'] = 'dd-db.c7e8iuqi6hn4.ap-northeast-1.rds.amazonaws.com'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'test1234'
app.config['MYSQL_DB'] = 'DaemonSet'
app.config['JWT_SECRET_KEY'] = 'TeamDaemonSet'  
mysql = MySQL(app)
jwt = JWTManager(app)

#메트릭
metrics = PrometheusMetrics(app)

# 로그인
@app.route('/signin', methods=['POST'])
@metrics.histogram('requests_by_status_and_path', 'Request latencies by status and path', labels={'status': lambda r: r.status_code, 'path': lambda: request.path})
@metrics.gauge('in_progress', 'Long running requests in progress')
def signin():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

    cursor.execute('SELECT * FROM member WHERE email=%s AND password=%s', (email, password,))
    user = cursor.fetchone()

    if user:
        session['loggedin'] = True  # 로그인 상태를 True로 변경
        session['email'] = user['email']  # 세션에 email 값을 저장
        session['username'] = user['username']  # 세션에 username 값을 저장

        # JWT 토큰 발급(1시간)
        access_token = create_access_token(identity={'email': user['email'], 'username': user['username']}, expires_delta=datetime.timedelta(hours=1))
        print(f"Access Token: {access_token}")  # Debug print
        return jsonify({"msg": "!! Login Success !!", "username": user['username'], "access_token": access_token})
    else:
        return jsonify({"msg": "Incorrect email or password!!"}), 401

# 보호된 경로 예시
@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

# 로그아웃 (Flask doesn't need to handle JWT logout specifically)
@app.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    session.clear()
    return jsonify({"msg": "Logged out successfully"}), 200

if __name__ == '__main__':
    app.run(port=5012)