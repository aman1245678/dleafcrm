@echo off
TITLE DleafTech CRM - Full Stack Launcher
color 0A

echo =====================================================================
echo           DLEAFTECH ENTERPRISE CRM - LOCAL LAUNCHER
echo      Tested and Optimized for Windows, macOS and Linux
echo =====================================================================
echo.

echo [1/4] Checking Node.js installation...
node -v
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not found in your PATH!
    echo Please download and install Node.js from https://nodejs.org/
    pause
    exit /b
)

echo.
echo [2/4] Checking and installing Backend dependencies...
cd backend
if not exist node_modules (
    echo Installing backend packages...
    call npm install --ignore-scripts --legacy-peer-deps
) else (
    echo Backend packages already installed.
)
cd ..

echo.
echo [3/4] Checking and installing Frontend dependencies...
cd frontend
if not exist node_modules (
    echo Installing frontend packages...
    call npm install --legacy-peer-deps
) else (
    echo Frontend packages already installed.
)
cd ..

echo.
echo =====================================================================
echo [4/4] Starting both Backend and Frontend servers!
echo.
echo * Backend API:   http://localhost:5000/api/health
echo * Frontend UI:   http://localhost:3000
echo =====================================================================
echo.

start "DleafTech CRM - Backend (Port 5000)" cmd /k "cd backend && npm run dev"
timeout /t 2 >nul
start "DleafTech CRM - Frontend (Port 3000)" cmd /k "cd frontend && npm run dev"

echo CRM is launching in separate command windows.
echo You can now open http://localhost:3000 in your browser!
echo.
pause
