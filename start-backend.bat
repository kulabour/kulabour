@echo off
echo Starting KULABOUR Backend...
cd backend
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)

echo Building TypeScript...
call npm run build

echo Starting Server...
call npm start
pause
