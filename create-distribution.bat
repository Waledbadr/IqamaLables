@echo off
title Employee Label Printer - Create Distribution Package

echo.
echo ========================================
echo   Employee Label Printer
echo   Distribution Package Creator
echo ========================================
echo.

REM Check if deployment package exists
if not exist "deployment-package" (
    echo ERROR: deployment-package folder not found!
    echo Please ensure the deployment package has been created first.
    echo.
    pause
    exit /b 1
)

echo Creating distribution package...
echo.

REM Get current date for filename
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "datestamp=%YYYY%-%MM%-%DD%"

set "PACKAGE_NAME=Employee-Label-Printer-v1.0.0-%datestamp%"

echo Package name: %PACKAGE_NAME%.zip
echo.

REM Check if PowerShell is available for ZIP creation
powershell -Command "Get-Command Compress-Archive" >nul 2>&1
if %errorlevel% equ 0 (
    echo Using PowerShell to create ZIP package...
    powershell -Command "Compress-Archive -Path 'deployment-package\*' -DestinationPath '%PACKAGE_NAME%.zip' -Force"
    
    if exist "%PACKAGE_NAME%.zip" (
        echo.
        echo ✅ SUCCESS: Distribution package created!
        echo.
        echo 📦 Package: %PACKAGE_NAME%.zip
        for %%A in ("%PACKAGE_NAME%.zip") do echo 📏 Size: %%~zA bytes
        echo 📁 Location: %CD%\%PACKAGE_NAME%.zip
        echo.
        echo This package is ready for distribution and can be:
        echo - Transferred to other computers
        echo - Shared via email or file sharing
        echo - Deployed to multiple systems
        echo.
        echo The recipient just needs to:
        echo 1. Extract the ZIP file
        echo 2. Run the appropriate launcher script
        echo 3. Start using the application!
        echo.
    ) else (
        echo ❌ ERROR: Failed to create ZIP package
        echo.
    )
) else (
    echo PowerShell Compress-Archive not available.
    echo.
    echo Manual ZIP creation required:
    echo 1. Select the entire 'deployment-package' folder
    echo 2. Right-click and choose "Send to" → "Compressed folder"
    echo 3. Rename to: %PACKAGE_NAME%.zip
    echo.
    echo Alternatively, use any ZIP utility like 7-Zip or WinRAR
    echo to compress the 'deployment-package' folder.
    echo.
)

echo ========================================
echo   DISTRIBUTION CHECKLIST
echo ========================================
echo.
echo Before distributing, ensure:
echo ✅ Package has been tested on target system type
echo ✅ Documentation is included and up-to-date
echo ✅ System requirements are clearly communicated
echo ✅ Support contact information is provided
echo.
echo Package contents:
echo - Complete application (app folder)
echo - Server options (Node.js and Python)
echo - Launcher scripts for all platforms
echo - Comprehensive documentation
echo - Verification tools
echo.

pause
