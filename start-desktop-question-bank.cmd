@echo off
cd /d "%~dp0"

if not exist "package.json" (
  echo package.json was not found.
  echo Please make sure this file is in the project root folder.
  pause
  exit /b 1
)

if not exist "node_modules\electron" (
  echo Electron is not installed. Installing dependencies now...
  call npm.cmd install
  if errorlevel 1 (
    echo.
    echo npm install failed.
    pause
    exit /b 1
  )
)

call npm.cmd start

if errorlevel 1 (
  echo.
  echo Failed to start the desktop app.
  pause
  exit /b 1
)
