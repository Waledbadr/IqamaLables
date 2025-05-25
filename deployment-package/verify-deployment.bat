@echo off
title Employee Label Printer - Deployment Verification

echo.
echo ========================================
echo   Employee Label Printer
echo   Deployment Verification Tool
echo ========================================
echo.

set "ERRORS=0"
set "WARNINGS=0"

echo Checking deployment package integrity...
echo.

REM Check if we're in the right directory
if not exist "app" (
    echo [ERROR] app folder not found!
    echo Please run this script from the deployment-package directory.
    set /a ERRORS+=1
    goto :summary
)

if not exist "server" (
    echo [ERROR] server folder not found!
    set /a ERRORS+=1
    goto :summary
)

echo [OK] Basic folder structure exists
echo.

REM Check application files
echo Checking application files...
if not exist "app\index.html" (
    echo [ERROR] app\index.html not found!
    set /a ERRORS+=1
) else (
    echo [OK] app\index.html exists
)

if not exist "app\assets" (
    echo [ERROR] app\assets folder not found!
    set /a ERRORS+=1
) else (
    echo [OK] app\assets folder exists
)

REM Count files in assets
for /f %%i in ('dir /b "app\assets\*.js" 2^>nul ^| find /c /v ""') do set JS_COUNT=%%i
for /f %%i in ('dir /b "app\assets\*.css" 2^>nul ^| find /c /v ""') do set CSS_COUNT=%%i

if %JS_COUNT% LSS 1 (
    echo [WARNING] No JavaScript files found in app\assets
    set /a WARNINGS+=1
) else (
    echo [OK] Found %JS_COUNT% JavaScript file(s)
)

if %CSS_COUNT% LSS 1 (
    echo [WARNING] No CSS files found in app\assets
    set /a WARNINGS+=1
) else (
    echo [OK] Found %CSS_COUNT% CSS file(s)
)

echo.

REM Check server files
echo Checking server files...
if not exist "server\server.js" (
    echo [ERROR] server\server.js not found!
    set /a ERRORS+=1
) else (
    echo [OK] server\server.js exists
)

if not exist "server\python-server.py" (
    echo [ERROR] server\python-server.py not found!
    set /a ERRORS+=1
) else (
    echo [OK] server\python-server.py exists
)

if not exist "server\package.json" (
    echo [WARNING] server\package.json not found!
    set /a WARNINGS+=1
) else (
    echo [OK] server\package.json exists
)

echo.

REM Check launcher scripts
echo Checking launcher scripts...
if not exist "start-app.bat" (
    echo [ERROR] start-app.bat not found!
    set /a ERRORS+=1
) else (
    echo [OK] start-app.bat exists
)

if not exist "start-app.sh" (
    echo [WARNING] start-app.sh not found!
    set /a WARNINGS+=1
) else (
    echo [OK] start-app.sh exists
)

if not exist "start-app-python.bat" (
    echo [WARNING] start-app-python.bat not found!
    set /a WARNINGS+=1
) else (
    echo [OK] start-app-python.bat exists
)

echo.

REM Check documentation
echo Checking documentation...
if not exist "README.md" (
    echo [WARNING] README.md not found!
    set /a WARNINGS+=1
) else (
    echo [OK] README.md exists
)

if not exist "INSTALLATION.md" (
    echo [WARNING] INSTALLATION.md not found!
    set /a WARNINGS+=1
) else (
    echo [OK] INSTALLATION.md exists
)

if not exist "DIRECT-ACCESS.html" (
    echo [WARNING] DIRECT-ACCESS.html not found!
    set /a WARNINGS+=1
) else (
    echo [OK] DIRECT-ACCESS.html exists
)

echo.

REM Check runtime availability
echo Checking runtime availability...

node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Node.js is available
    node --version
) else (
    echo [WARNING] Node.js not found - Python server will be needed
    set /a WARNINGS+=1
)

python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Python is available
    python --version
) else (
    echo [WARNING] Python not found - Node.js server will be needed
    set /a WARNINGS+=1
)

echo.

REM Check file sizes (basic integrity check)
echo Checking file integrity...

for %%f in ("app\index.html") do (
    if %%~zf LSS 1000 (
        echo [WARNING] app\index.html seems too small (%%~zf bytes)
        set /a WARNINGS+=1
    ) else (
        echo [OK] app\index.html size looks good (%%~zf bytes)
    )
)

echo.

:summary
echo ========================================
echo   VERIFICATION SUMMARY
echo ========================================
echo.

if %ERRORS% EQU 0 (
    echo ✅ DEPLOYMENT STATUS: READY
    echo.
    echo The deployment package appears to be complete and ready for use.
) else (
    echo ❌ DEPLOYMENT STATUS: ISSUES FOUND
    echo.
    echo Found %ERRORS% error(s) that must be fixed before deployment.
)

if %WARNINGS% GTR 0 (
    echo.
    echo ⚠️  Found %WARNINGS% warning(s) - deployment may work but some features might be limited.
)

echo.
echo NEXT STEPS:
if %ERRORS% EQU 0 (
    echo 1. Test the application by running start-app.bat
    echo 2. Verify all features work correctly
    echo 3. Package is ready for distribution
) else (
    echo 1. Fix the errors listed above
    echo 2. Re-run this verification script
    echo 3. Test the application before distribution
)

echo.
echo For detailed deployment instructions, see:
echo - README.md (user guide)
echo - INSTALLATION.md (installation steps)
echo - DEPLOYMENT-CHECKLIST.md (complete checklist)
echo.

pause
