@echo off
setlocal EnableExtensions

set "ROOT=%~dp0.."
for %%I in ("%ROOT%") do set "ROOT=%%~fI"
set "WINDOW=prestige-services"
if not defined KAFKA_BOOTSTRAP_SERVERS set "KAFKA_BOOTSTRAP_SERVERS=localhost:9092"

where wt >nul 2>nul
if errorlevel 1 (
    echo Windows Terminal was not found on PATH. Install it, then run this script again.
    exit /b 1
)

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

if not defined GROQ_API_KEY (
    echo GROQ_API_KEY is not set.
    echo In a new Command Prompt, run: setx GROQ_API_KEY "your-groq-api-key"
    echo Then open a fresh terminal and run start-tabs.cmd again.
    exit /b 1
)

echo Starting Prestige Banking services in Windows Terminal tabs...
echo Waiting for Kafka at %KAFKA_BOOTSTRAP_SERVERS%...
call :wait_tcp "Kafka" "%KAFKA_BOOTSTRAP_SERVERS%" || exit /b 1

call :start_first_tab "Eureka Server" "%ROOT%\backend\prestige-eureka-server"
call :wait_http "Eureka Server" "http://localhost:8761/" || exit /b 1

call :start_tab "Authentication Service" "%ROOT%\backend\prestige-authentication-service"
call :wait_http "Authentication Service" "http://localhost:8083/.well-known/jwks.json" || exit /b 1

call :start_tab "Customer Service" "%ROOT%\backend\customer-service"
call :start_tab "Transfer Service" "%ROOT%\backend\transferservice" "-Dspring-boot.run.profiles=jwt"
call :start_tab "Notification Service" "%ROOT%\backend\notification-service"
call :start_tab "Public Info Service" "%ROOT%\backend\public-info"
call :start_tab "API Gateway" "%ROOT%\backend\prestige-api-gateway"
wt -w "%WINDOW%" new-tab --title "Prestige Frontend" -d "%ROOT%\frontend" cmd /k "set PRESTIGE_STACK=1&&npm run dev -- --host 0.0.0.0 --port 3000 --strictPort"

call :wait_http "Customer Service" "http://localhost:8001/actuator/health" || exit /b 1
call :wait_http "Transfer Service" "http://localhost:8002/actuator/health" || exit /b 1
call :wait_http "Notification Service" "http://localhost:8005/actuator/health" || exit /b 1
call :wait_http "Public Info Service" "http://localhost:8004/actuator/health" || exit /b 1

call :start_tab "Chatbot Service" "%ROOT%\backend\chatbot-service"
call :wait_http "Chatbot Service" "http://localhost:8085/actuator/health" || exit /b 1

call :start_tab "API Gateway" "%ROOT%\backend\prestige-api-gateway"
call :wait_http "API Gateway" "http://localhost:8080/.well-known/jwks.json" || exit /b 1
call :wait_http "Frontend" "http://localhost:3000/" || exit /b 1

echo.
echo All services are running in the Prestige Services terminal window.
echo Gateway:  http://localhost:8080
echo Frontend: http://localhost:3000
echo Eureka:   http://localhost:8761
echo Kafka:    %KAFKA_BOOTSTRAP_SERVERS%
exit /b 0

:start_first_tab
start "Prestige Services" wt -w "%WINDOW%" --title "%~1" -d "%~2" cmd /k "set PRESTIGE_STACK=1&&mvn -q clean spring-boot:run %~3"
exit /b 0

:start_tab
wt -w "%WINDOW%" new-tab --title "%~1" -d "%~2" cmd /k "set PRESTIGE_STACK=1&&mvn -q clean spring-boot:run %~3"
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
echo %SERVICE% did not become ready. Check its Windows Terminal tab for errors.
exit /b 1

:wait_tcp
set "SERVICE=%~1"
set "ENDPOINT=%~2"
for /f "tokens=1,2 delims=:" %%A in ("%ENDPOINT%") do (
    set "KAFKA_HOST=%%A"
    set "KAFKA_PORT=%%B"
)
if not defined KAFKA_PORT (
    echo %SERVICE% endpoint must be HOST:PORT, received %ENDPOINT%.
    exit /b 1
)
for /L %%I in (1,1,90) do (
    powershell -NoProfile -Command "$client = New-Object Net.Sockets.TcpClient; try { $client.Connect('%KAFKA_HOST%', [int]%KAFKA_PORT%); exit 0 } catch { exit 1 } finally { $client.Dispose() }" >nul 2>nul && (
        echo %SERVICE% is ready.
        exit /b 0
    )
    timeout /t 2 /nobreak >nul
)
echo %SERVICE% was not reachable at %ENDPOINT%. Start Kafka first, then run this script again.
exit /b 1
