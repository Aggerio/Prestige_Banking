@echo off
setlocal EnableExtensions

echo Stopping the local stack by its service ports...
for %%P in (3000 8080 8004 8002 8001 8083 8761) do call :stop_port %%P
echo Stop requests sent. The Windows Terminal tabs remain open for their logs.
exit /b 0

:stop_port
set "PORT=%~1"
for /f %%I in ('powershell -NoProfile -Command "Get-NetTCPConnection -State Listen -LocalPort %PORT% -ErrorAction SilentlyContinue ^| Select-Object -ExpandProperty OwningProcess -Unique"') do (
    echo Stopping the process on port %PORT%...
    taskkill /PID %%I /T /F >nul 2>nul
)
exit /b 0
