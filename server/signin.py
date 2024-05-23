from flask import Flask, render_template, request, jsonify, url_for, session
# JWT 확장 라이브러리 임포트하기
from flask_jwt_extended import JWTManager
from flask_mysqldb import MySQL
import MySQLdb.cursors
import re
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

############# Database #################
app.secret_key = 'TeamDaemonSet'
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'test123'
app.config['MYSQL_DB'] = 'login'
mysql = MySQL(app)

#로그인
@app.route('/signin', methods=['GET', 'POST'])
def signin():
    data = request.get_json()  # Expect JSON data
    email = data.get('email')
    password = data.get('password')
    cursor=mysql.connection.cursor(MySQLdb.cursors.DictCursor)

    cursor.execute('SELECT * FROM member WHERE email=%s AND password=%s', (email,password,))
    user = cursor.fetchone()

    if user:
        session['loggedin'] =True # 로그인 상태를 True로 변경            
        session['email'] = user['email'] # 세션에 account 값을 저장            
        session['password'] =user['password'] # 세션에 password 값을 저장
        return jsonify({"msg": "!! Login Success !!", "username": user['username']})

    else:
        return jsonify({"msg": "Incorrect email or password"}), 401

if __name__ == '__main__':
    app.run(port=5012)
