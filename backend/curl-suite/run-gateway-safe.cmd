@echo off
setlocal EnableExtensions
set "AUTH_URL=http://localhost:8083"
set "COOKIE_JAR=%TEMP%\prestige-curl-cookies.txt"
set "AUTH_RESPONSE=%TEMP%\prestige-auth-response.json"
set "TOKEN_FILE=%TEMP%\prestige-access-token.txt"
set "LOGIN_STATUS_FILE=%TEMP%\prestige-login-status.txt"

rem Keep login in CMD: curl's Windows argument parsing preserves the JSON payload here.
curl.exe -sS -c "%COOKIE_JAR%" -o "%AUTH_RESPONSE%" -w "%%{http_code}" -X POST "%AUTH_URL%/api/v1/auth/login" -H "Content-Type: application/json" --data "{\"customerId\":103,\"password\":\"NewLogin@1234\"}" > "%LOGIN_STATUS_FILE%"
set "PRESTIGE_LOGIN_STATUS="
set /p PRESTIGE_LOGIN_STATUS=<"%LOGIN_STATUS_FILE%"
powershell -NoProfile -Command "try { (ConvertFrom-Json (Get-Content -Raw '%AUTH_RESPONSE%')).accessToken } catch { '' }" > "%TOKEN_FILE%"
set "PRESTIGE_TOKEN="
set /p PRESTIGE_TOKEN=<"%TOKEN_FILE%"

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-gateway-safe.ps1"
set "RESULT=%ERRORLEVEL%"
endlocal & exit /b %RESULT%
