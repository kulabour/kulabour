# Start specific services in new tabs
$commands = @(
    @{ Name = "Backend"; Path = "backend-nest"; Command = "npm run start:dev" },
    @{ Name = "Admin Web"; Path = "admin-web"; Command = "npm run dev" },
    @{ Name = "Mobile App"; Path = "mobile-app"; Command = "npx expo start --clear" }
)

foreach ($cmd in $commands) {
    Write-Host "Starting $($cmd.Name)..." -ForegroundColor Green
    Start-Process wt -ArgumentList "-w", "0", "nt", "-d", "$PWD\$($cmd.Path)", "powershell", "-NoExit", "-Command", "Write-Host 'Starting $($cmd.Name)...' -ForegroundColor Cyan; $($cmd.Command)"
}

Write-Host "All services starting in separate tabs!" -ForegroundColor Yellow
