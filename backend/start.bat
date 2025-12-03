@echo off
echo Stopping all Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Starting Paralel Life Backend...
cd /d "%~dp0"
node index.js
