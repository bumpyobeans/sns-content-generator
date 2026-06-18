@echo off
chcp 65001 >nul
cd /d "%~dp0"

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js가 설치되지 않았습니다.
    echo https://nodejs.org 에서 LTS 버전을 설치 후 다시 실행해주세요.
    pause
    exit /b 1
)

if not exist node_modules (
    echo 패키지 설치 중...
    npm install
    if %errorlevel% neq 0 (
        echo npm install 실패
        pause
        exit /b 1
    )
)

echo.
echo  서버 시작 중...
echo  브라우저가 자동으로 열립니다.
echo  서버 종료: 작업 표시줄의 [범표원두 서버] 창을 닫으세요.
echo.

start "범표원두 서버" cmd /k "cd /d "%~dp0" & node server.js"
timeout /t 3 /nobreak >nul
start "" "http://localhost:3333"
