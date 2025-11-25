@echo off
echo ==========================================
echo   Instant Labor - Backend Startup
echo ==========================================
echo.

cd backend

echo [1/3] Checking for node_modules...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
) else (
    echo Dependencies already installed!
)

echo.
echo [2/3] Starting backend server...
echo.
echo Server will run on: http://localhost:5000
echo WebSocket: ws://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.

npm start
