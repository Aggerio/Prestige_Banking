@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "GATEWAY=http://localhost:8080"
set "EUREKA=http://localhost:8761"
set "FRONTEND=http://localhost:3000"
set /a PASSED=0
set /a FAILED=0

call :expect "Eureka dashboard" GET "%EUREKA%/" "200"
call :expect "Frontend" GET "%FRONTEND%/" "200"
call :expect "Gateway to auth JWKS" GET "%GATEWAY%/.well-known/jwks.json" "200"
call :expect "Gateway to public information" GET "%GATEWAY%/api/v1/public/home" "200 404"
call :expect "Customer API requires JWT" GET "%GATEWAY%/api/v1/customers/me" "401"
call :expect "Transfer API requires JWT" GET "%GATEWAY%/api/v1/transfers/TEST-REFERENCE" "401"
call :check_eureka

echo.
echo Smoke-test summary: !PASSED! passed, !FAILED! failed.
if !FAILED! GTR 0 exit /b 1
exit /b 0

:expect
set "NAME=%~1"
set "METHOD=%~2"
set "URL=%~3"
set "EXPECTED=%~4"
set "BODY=%TEMP%\prestige-response-%RANDOM%.txt"
set "STATUS_FILE=%BODY%.status"

curl.exe --silent --show-error --output "%BODY%" --write-out "%%{http_code}" --request %METHOD% "%URL%" > "%STATUS_FILE%"

set "STATUS="
set /p STATUS=<"%STATUS_FILE%"
set "MATCH="
for %%S in (%EXPECTED%) do if "!STATUS!"=="%%S" set "MATCH=1"

if defined MATCH (
    echo PASS  %NAME% ^(!STATUS!^)
    set /a PASSED+=1
) else (
    set "RESPONSE="
    set /p RESPONSE=<"%BODY%"
    echo FAIL  %NAME%: expected [%EXPECTED%], received !STATUS!. !RESPONSE!
    set /a FAILED+=1
)

del "%BODY%" "%STATUS_FILE%" >nul 2>nul
exit /b 0

:check_eureka
set "REGISTRY=%TEMP%\prestige-eureka-%RANDOM%.json"
curl.exe --silent --show-error --header "Accept: application/json" "%EUREKA%/eureka/apps" > "%REGISTRY%"
for %%S in (API-GATEWAY AUTHENTICATION-SERVICE CUSTOMER-SERVICE TRANSFER-SERVICE PUBLIC-INFO-SERVICE) do (
    findstr /I /C:"%%S" "%REGISTRY%" >nul
    if errorlevel 1 (
        echo FAIL  Eureka registration missing: %%S
        set /a FAILED+=1
    ) else (
        echo PASS  Eureka registration: %%S
        set /a PASSED+=1
    )
)
del "%REGISTRY%" >nul 2>nul
exit /b 0
