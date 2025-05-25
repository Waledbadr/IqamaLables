@echo off
title Employee Label Printer - Standalone Launcher
color 0A

echo.
echo ===============================================
echo    Employee Label Printer - Standalone
echo ===============================================
echo.
echo Opening the standalone version in your browser...
echo This version requires NO installation!
echo.

REM Try to open with default browser
start "" "standalone-app.html"

if %ERRORLEVEL% EQU 0 (
    echo ✓ Application opened successfully!
    echo.
    echo The Employee Label Printer is now running in your browser.
    echo You can close this window.
    echo.
) else (
    echo ✗ Could not open automatically.
    echo.
    echo Please manually open 'standalone-app.html' in your browser.
    echo.
)

echo Press any key to exit...
pause >nul
