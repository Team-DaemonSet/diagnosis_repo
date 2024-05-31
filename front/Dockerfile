# 단계 1: 빌드 환경 설정.
FROM node:16 as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# 단계 2: 프로덕션 환경 설정
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
# React Router를 사용하는 경우 필요: 모든 요청을 index.html로 리디렉트
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

