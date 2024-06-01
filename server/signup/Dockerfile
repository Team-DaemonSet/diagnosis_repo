FROM python:3.12-slim

COPY . /app
WORKDIR /app
COPY requirements.txt ./
RUN pip install --upgrade pip
RUN apt-get update
RUN apt-get install python3-dev default-libmysqlclient-dev build-essential pkg-config -y
RUN pip install -r requirements.txt

# 애플리케이션 소스 코드 전체 복사
COPY . .

# Flask 애플리케이션을 가리키는 환경 변수 설정
ENV FLASK_APP=signup.py

# 포트 노출
EXPOSE 5011

# 애플리케이션 실행
CMD ["flask", "run", "--host=0.0.0.0", "--port=5011"]