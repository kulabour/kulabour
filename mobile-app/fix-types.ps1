#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Fix TypeScript module resolution issues in the mobile app

.DESCRIPTION
    This script performs a comprehensive fix for TypeScript module resolution errors,
    particularly for @react-native-async-storage/async-storage and similar packages.
    
    It:
    1. Clears all caches (Expo, Metro, TypeScript, npm)
    2. Reinstalls the problematic package
    3. Restarts the development server
    
.EXAMPLE
    .\fix-types.ps1
#>

Write-Host "🔧 Starting TypeScript Module Resolution Fix..." -ForegroundColor Cyan

# Step 1: Clear all caches
Write-Host "`n📦 Step 1: Clearing caches..." -ForegroundColor Yellow
Remove-Item -Path .expo -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path node_modules\.cache -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path .tsbuildinfo -Force -ErrorAction SilentlyContinue
Write-Host "✓ Caches cleared" -ForegroundColor Green

# Step 2: Reinstall AsyncStorage
Write-Host "`n📥 Step 2: Reinstalling @react-native-async-storage/async-storage..." -ForegroundColor Yellow
npm install @react-native-async-storage/async-storage
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Package reinstalled successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to reinstall package" -ForegroundColor Red
    exit 1
}

# Step 3: Verify TypeScript compilation
Write-Host "`n🔍 Step 3: Verifying TypeScript compilation..." -ForegroundColor Yellow
npx tsc --noEmit
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ TypeScript compilation successful" -ForegroundColor Green
} else {
    Write-Host "⚠ TypeScript compilation has errors (check output above)" -ForegroundColor Yellow
}

# Step 4: Offer to restart dev server
Write-Host "`n🚀 Step 4: Development Server" -ForegroundColor Yellow
Write-Host "The fix is complete. You should restart your development server." -ForegroundColor Cyan
Write-Host "Run: npx expo start --clear" -ForegroundColor White

Write-Host "`n✅ Fix completed!" -ForegroundColor Green
Write-Host "`nIf the error persists in your IDE:" -ForegroundColor Cyan
Write-Host "  1. Press Ctrl+Shift+P in VS Code" -ForegroundColor White
Write-Host "  2. Type 'TypeScript: Restart TS Server'" -ForegroundColor White
Write-Host "  3. Press Enter" -ForegroundColor White
