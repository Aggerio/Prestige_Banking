@echo off
setlocal EnableExtensions

echo Stopping the local Prestige Banking stack...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0stop-all.ps1"
exit /b %ERRORLEVEL%
