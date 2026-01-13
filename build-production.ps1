# KULABOUR Voice Assistant - Production Build Script (Windows PowerShell)

Write-Host "🚀 Building KULABOUR Voice Assistant for Production" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Build Backend
Write-Host "`n📦 Building Backend..." -ForegroundColor Yellow
Set-Location backend-nest
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend build successful" -ForegroundColor Green
}
else {
    Write-Host "❌ Backend build failed" -ForegroundColor Red
    exit 1
}

# 2. Verify TypeScript
Write-Host "`n🔍 Verifying TypeScript..." -ForegroundColor Yellow
npx tsc --noEmit

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ TypeScript verification passed" -ForegroundColor Green
}
else {
    Write-Host "❌ TypeScript errors found" -ForegroundColor Red
    exit 1
}

# 3. Mobile App Build Info
Write-Host "`n📱 Mobile App Build" -ForegroundColor Yellow
Set-Location ..\mobile-app

Write-Host "`n📋 Build Options:" -ForegroundColor Cyan
Write-Host "1. Development APK: npx expo run:android"
Write-Host "2. Production APK: npx eas build --platform android --profile production"
Write-Host "3. Test on device: npx expo start --tunnel"

Write-Host "`n✅ Backend build complete!" -ForegroundColor Green
Write-Host "`n📄 Next steps:" -ForegroundColor Cyan
Write-Host "1. Mobile: npx expo run:android (for local APK)"
Write-Host "2. Backend: npm run start:prod"
Write-Host "3. Test: Follow testing_checklist.md"
Write-Host "4. Deploy: Follow deployment_guide.md"
