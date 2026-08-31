REM Random Joke Generator - Quick Start Script for Windows
@echo off
echo 🎉 Random Joke Generator - Quick Start
echo ======================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.
    echo.
    echo Alternatively, you can:
    echo 1. Use Node.js: npx http-server
    echo 2. Use PHP: php -S localhost:8000
    echo 3. Upload to GitHub Pages for free hosting
    pause
    exit /b 1
)

echo ✅ Starting local server with Python...
echo 🌐 Opening http://localhost:8000 in your browser
echo.
echo Press Ctrl+C to stop the server
echo.

REM Open browser
start http://localhost:8000

REM Start Python HTTP server
python -m http.server 8000
