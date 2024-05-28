# diagnosis_repo

성욱입니다!

5월 29일 아침 기준 main에 지금까지 코드 push 해놨습니다.

<작업할 거 있으면 각자의 브랜치에 pull 받아서 작업하시고>

1. 로컬에 새로운 폴더 생성
2. visual studio code 로 해당폴더 열기
3. git init
4. git remote add origin https://github.com/Team-DaemonSet/diagnosis_repo.git
5. git checkout -b {본인 branch명}
--> Switched to a new branch '{본인 branch명}' 이라고 뜨는지 확인
6. git pull origin main

<Terminal 2개 더 틀고>

[Terminal 1]
1. cd front
2. npm install    (node_modules 문제가 해결이 안되었음)
3. npm start

[Terminal 2]
1. cd server
2. python app.py


<작업 끝나고 각자 브랜치에 우선적으로 push 한 후에 팀장님한테 알려주시고 merge 작업 하시면 될 것 같습니다.>

[작업 종료]
1. git add .
2. git commit -m "{commit name}"
3. git push origin {본인 branch명}

# 오류
1. fetch first    ==> 웹 깃허브에서 내용을 수정하면 로컬 폴더가 그걸 못 읽어서 생기는 오류 같음
> git fetch

2. ! [rejected]  (non-fast-forward)    --> 이것도 비슷한류의 오류인 것 같음
> git pull origin {본인 branch명}

후에 다시 
git push origin {본인 branch명}
