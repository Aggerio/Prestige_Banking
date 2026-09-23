@echo off
setlocal EnableExtensions

rem Direct health test suite. Gateway and auth intentionally expect HTTP 401.
set "RESULT_FILE=%TEMP%\prestige-health-result.txt"
set "ERROR_FILE=%TEMP%\prestige-health-error.txt"
set /a TOTAL=0, PASSED=0, FAILED=0

echo === Prestige direct health test suite ===
call :check "Customer service :8001" "200" "http://localhost:8001/actuator/health"
call :check "Transfer service :8002" "200" "http://localhost:8002/actuator/health"
call :check "Public-info service :8004" "200" "http://localhost:8004/actuator/health"
call :check "Notification service :8005" "200" "http://localhost:8005/actuator/health"
call :check "Chatbot service :8085" "200" "http://localhost:8085/actuator/health"
call :check "Eureka server :8761" "200" "http://localhost:8761/actuator/health"
call :check "API gateway :8080" "401" "http://localhost:8080/actuator/health"
call :check "Authentication service :8083" "401" "http://localhost:8083/actuator/health"

echo.
echo === Test summary ===
echo Total: %TOTAL%  Passed: %PASSED%  Failed: %FAILED%
if not "%FAILED%"=="0" (echo RESULT: FAIL& endlocal& exit /b 1)
echo RESULT: PASS
endlocal& exit /b 0

:check
curl.exe -sS --max-time 5 -o NUL -w "%%{http_code}" "%~3" > "%RESULT_FILE%" 2> "%ERROR_FILE%"
set /a TOTAL+=1
set "HTTP_CODE="
if exist "%RESULT_FILE%" set /p HTTP_CODE=<"%RESULT_FILE%"
if not "%HTTP_CODE%"=="%~2" goto :check_fail
set /a PASSED+=1
echo [PASS] %~1 ^(HTTP %HTTP_CODE%^)
exit /b 0

:check_fail
set /a FAILED+=1
echo [FAIL] %~1 ^(expected HTTP %~2, got %HTTP_CODE%^)
if exist "%ERROR_FILE%" type "%ERROR_FILE%"
exit /b 0
