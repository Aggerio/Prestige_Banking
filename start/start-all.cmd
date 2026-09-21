@echo off
setlocal EnableExtensions

set "ROOT=%~dp0.."
for %%I in ("%ROOT%") do set "ROOT=%%~fI"

where mvn >nul 2>nul
if errorlevel 1 (
    echo Maven was not found on PATH. Install Maven or add it to PATH, then run this script again.
    exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
    echo npm was not found on PATH. Install Node.js, then run this script again.
    exit /b 1
)

echo Starting Prestige Banking services in separate windows...

call :start_service "Eureka Server" "%ROOT%\backend\prestige-eureka-server"
call :wait_http "Eureka Server" "http://localhost:8761/" || exit /b 1

call :start_service "Authentication Service" "%ROOT%\backend\prestige-authentication-service"
call :wait_http "Authentication Service" "http://localhost:8083/.well-known/jwks.json" || exit /b 1

call :start_service "Customer Service" "%ROOT%\backend\customer-service"
call :start_service "Transfer Service" "%ROOT%\backend\transferservice"
call :start_service "Public Info Service" "%ROOT%\backend\public-info"

call :wait_http "Customer Service" "http://localhost:8001/actuator/health" || exit /b 1
call :wait_http "Transfer Service" "http://localhost:8002/actuator/health" || exit /b 1
call :wait_http "Public Info Service" "http://localhost:8004/actuator/health" || exit /b 1

call :start_service "API Gateway" "%ROOT%\backend\prestige-api-gateway"
call :wait_http "API Gateway" "http://localhost:8080/.well-known/jwks.json" || exit /b 1

start "Prestige Frontend" /D "%ROOT%\frontend" cmd /k "npm run dev -- --host 0.0.0.0"
call :wait_http "Frontend" "http://localhost:5173/" || exit /b 1

echo.
echo All services are running.
echo Gateway:  http://localhost:8080
echo Frontend: http://localhost:5173
echo Eureka:   http://localhost:8761
echo.
echo Run start\test-all.cmd to execute the end-to-end smoke test.
exit /b 0

:start_service
start "%~1" /D "%~2" cmd /k "mvn -q spring-boot:run"
exit /b 0

:wait_http
set "SERVICE=%~1"
set "URL=%~2"
echo Waiting for %SERVICE%...
for /L %%I in (1,1,90) do (
    curl.exe --silent --fail "%URL%" >nul 2>nul && (
        echo %SERVICE% is ready.
        exit /b 0
    )
    timeout /t 2 /nobreak >nul
)
echo %SERVICE% did not become ready. Check its service window for errors.
exit /b 1
