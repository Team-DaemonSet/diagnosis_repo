FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt ./
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# 애플리케이션 소스 코드 전체 복사
COPY . .

# Flask 애플리케이션을 가리키는 환경 변수 설정
ENV FLASK_APP=server.py

# 포트 노출
EXPOSE 5000

# 애플리케이션 실행
CMD ["flask", "run", "--host=0.0.0.0"]

