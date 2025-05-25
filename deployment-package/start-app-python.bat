@echo off
title Employee Label Printer Server (Python)

echo.
echo ========================================
echo   Employee Label Printer
echo   Python Server Launcher
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo.
    echo Please install Python from: https://www.python.org/downloads/
    echo Minimum version required: 3.6.0
    echo.
    echo Make sure to check "Add Python to PATH" during installation.
    echo.
    pause
    exit /b 1
)

echo Python version:
python --version
echo.

REM Change to the server directory
cd /d "%~dp0server"

REM Check if server files exist
if not exist "python-server.py" (
    echo ERROR: Python server file not found!
    echo Please ensure python-server.py exists in the server folder.
    echo.
    pause
    exit /b 1
)

REM Check if app directory exists
if not exist "..\app" (
    echo ERROR: Application files not found!
    echo Please ensure the app folder exists.
    echo.
    pause
    exit /b 1
)

echo Starting Employee Label Printer Server (Python)...
echo.
echo The application will open in your default browser.
echo If it doesn't open automatically, navigate to: http://localhost:3000
echo.
echo To stop the server, close this window or press Ctrl+C
echo.

REM Start the Python server
python python-server.py

REM If we get here, the server stopped
echo.
echo Server stopped.
pause
