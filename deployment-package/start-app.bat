@echo off
title Employee Label Printer Server

echo.
echo ========================================
echo   Employee Label Printer
echo   Production Server Launcher
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Minimum version required: 14.0.0
    echo.
    echo After installing Node.js, restart this script.
    echo.
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Change to the server directory
cd /d "%~dp0server"

REM Check if server files exist
if not exist "server.js" (
    echo ERROR: Server files not found!
    echo Please ensure server.js exists in the server folder.
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

echo Starting Employee Label Printer Server...
echo.
echo The application will open in your default browser.
echo If it doesn't open automatically, navigate to: http://localhost:3000
echo.
echo To stop the server, close this window or press Ctrl+C
echo.

REM Start the server
node server.js

REM If we get here, the server stopped
echo.
echo Server stopped.
pause
