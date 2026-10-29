@echo off
title SkillVault Launcher
echo ========================================
echo    Starting SkillVault Backend & Frontend
echo ========================================

:: Check directory structure
if exist "backend" (
    set "BACKEND_DIR=backend"
    set "FRONTEND_DIR=frontend"
) else if exist "SkillVault-main\backend" (
    set "BACKEND_DIR=SkillVault-main\backend"
    set "FRONTEND_DIR=SkillVault-main\frontend"
) else (
    echo Error: Could not locate backend and frontend folders.
    pause
    exit /b 1
)

echo Starting Backend on http://localhost:5000...
start "SkillVault Backend" cmd /k "cd /d "%~dp0%BACKEND_DIR%" && npm run dev"

echo Starting Frontend...
start "SkillVault Frontend" cmd /k "cd /d "%~dp0%FRONTEND_DIR%" && npm run dev"

echo.
echo Both servers are launching in separate windows!
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173 (or next free port)
echo.
pause
