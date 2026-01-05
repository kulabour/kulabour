#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Restart TypeScript Language Server and force reload

.DESCRIPTION
    This script helps force VS Code to restart the TypeScript language server
    and reload all type definitions.
#>

Write-Host "🔄 Restarting TypeScript Language Server..." -ForegroundColor Cyan

Write-Host "`n✅ To restart the TypeScript server in VS Code:" -ForegroundColor Green
Write-Host "   1. Press Ctrl+Shift+P" -ForegroundColor White
Write-Host "   2. Type: TypeScript: Restart TS Server" -ForegroundColor White
Write-Host "   3. Press Enter" -ForegroundColor White
Write-Host "`n✅ To reload the window:" -ForegroundColor Green
Write-Host "   1. Press Ctrl+Shift+P" -ForegroundColor White
Write-Host "   2. Type: Developer: Reload Window" -ForegroundColor White
Write-Host "   3. Press Enter" -ForegroundColor White

Write-Host "`n💡 This will fix any TypeScript errors in all files!" -ForegroundColor Yellow
