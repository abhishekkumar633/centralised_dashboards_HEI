Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Starting SkillVault Backend & Frontend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$backendPath = if (Test-Path "backend") { "backend" } elseif (Test-Path "SkillVault-main\backend") { "SkillVault-main\backend" } else { $null }
$frontendPath = if (Test-Path "frontend") { "frontend" } elseif (Test-Path "SkillVault-main\frontend") { "SkillVault-main\frontend" } else { $null }

if (-not $backendPath -or -not $frontendPath) {
    Write-Error "Could not find backend and frontend directories."
    exit 1
}

Write-Host "Starting Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendPath'; npm run dev"

Write-Host "Starting Frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendPath'; npm run dev"

Write-Host "`nBoth services are starting in separate windows!" -ForegroundColor Yellow
Write-Host "Backend:  http://localhost:5000"
Write-Host "Frontend: http://localhost:5173 (or next free port)"
