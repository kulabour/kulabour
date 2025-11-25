@echo off
echo ==========================================
echo   Instant Labor - Mobile App Startup
echo ==========================================
echo.

cd mobile-app

echo [1/3] Checking for node_modules...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
) else (
    echo Dependencies already installed!
)

echo.
echo [2/3] Starting Expo development server...
echo.
echo Once started, you can:
echo   - Press 'a' for Android emulator
echo   - Press 'i' for iOS simulator
echo   - Press 'w' for web browser
echo   - Scan QR code with Expo Go app
echo.

npx expo start
