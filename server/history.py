from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import boto3

app = Flask(__name__)
CORS(app)

# RDS 설정
rds_host = 'dd-db.c7e8iuqi6hn4.ap-northeast-1.rds.amazonaws.com'
rds_user = 'root'
rds_password = 'test1234'
rds_db = 'DaemonSet'

s3_client = boto3.client(
    's3',
    aws_access_key_id='AKIA47CR2RIJTJZY367M',
    aws_secret_access_key='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',
    region_name='ap-northeast-1'
)

def get_user_records(email):
    connection = pymysql.connect(host=rds_host, user=rds_user, password=rds_password, db=rds_db)
    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            sql = "SELECT * FROM diagnosis WHERE email = %s"
            cursor.execute(sql, (email,))
            result = cursor.fetchall()
            return result
    finally:
        connection.close()

@app.route('/records', methods=['GET'])
def records():
    email = request.args.get('email')
    if not email:
        return jsonify({"error": "Email is required"}), 400
    records = get_user_records(email)
    
    # URL을 만들기 위한 코드 추가
    for record in records:
        record['image_url'] = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': 'uploadimage-bucket', 'Key': record['image_url']},
            ExpiresIn=3600
        )
    
    return jsonify(records), 200

if __name__ == '__main__':
    app.run(port=5007)
