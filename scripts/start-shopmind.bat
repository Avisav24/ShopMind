@echo off
echo Starting ShopMind Application...
echo.
echo This script will start both backend and frontend servers.
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
)

echo Node.js is installed.
echo.

REM Navigate to project root
cd /d %~dp0

REM Check if the current directory is correct
if not exist package.json (
    echo Error: Cannot find package.json in current directory.
    echo Please run this script from the project root.
    exit /b 1
)

echo Starting backend server...
echo.

REM Start backend server in a new window
start cmd /k "title SmartCart Backend && echo Starting SmartCart backend server... && npm install && node simple-server.js"

echo Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo.
echo Starting frontend server...
echo.

REM Navigate to frontend directory
cd frontend

REM Check if the frontend directory is correct
if not exist package.json (
    echo Error: Cannot find frontend package.json.
    echo Please check directory structure.
    exit /b 1
)

REM Start frontend server in a new window
start cmd /k "title SmartCart Frontend && echo Starting SmartCart frontend... && npm install && npm start"

echo.
echo Both servers are starting...
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Please wait a moment for both servers to fully start.
echo.
echo Press any key to exit this window (servers will continue running)...

pause >nul
