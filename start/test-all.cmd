@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "GATEWAY=http://localhost:8080"
set "EUREKA=http://localhost:8761"
set "FRONTEND=http://localhost:3000"
set "TEST_CUSTOMER_ID=101"
set "TEST_LOGIN_PASSWORD=Aarav Sharma"
set "TEST_TRANSACTION_PASSWORD=AaravTxnPassword"
set "TEST_SOURCE_ACCOUNT=PBS1000001"
set "TEST_DESTINATION_ACCOUNT=PBS1000002"
set "TEST_DESTINATION_NAME=Diya Patel"
set "TEST_DESTINATION_IFSC=PBS0001002"
set "TEST_TRANSFER_AMOUNT=100.00"
set /a PASSED=0
set /a FAILED=0

call :expect "Eureka dashboard" GET "%EUREKA%/" "200"
call :expect "Frontend" GET "%FRONTEND%/bankdash/" "200"
call :expect "Gateway to auth JWKS" GET "%GATEWAY%/.well-known/jwks.json" "200"
call :expect "Public home" GET "%GATEWAY%/api/v1/public/home" "200"
call :expect "Public about-us" GET "%GATEWAY%/api/v1/public/about-us" "200"
call :expect "Public contact-us" GET "%GATEWAY%/api/v1/public/contact-us" "200"
call :expect "Public investors" GET "%GATEWAY%/api/v1/public/investors" "200"
call :expect "Public offers" GET "%GATEWAY%/api/v1/public/offers" "200"
call :expect "Customer API requires JWT" GET "%GATEWAY%/api/v1/customers/me" "401"
call :expect "Account API requires JWT" GET "%GATEWAY%/api/v1/accounts/me" "401"
call :expect "Transfer API requires JWT" GET "%GATEWAY%/api/v1/transfers/TEST-REFERENCE" "401"
call :authenticated_suite
call :check_eureka

echo.
echo Smoke-test summary: !PASSED! passed, !FAILED! failed.
if !FAILED! GTR 0 exit /b 1
exit /b 0

:authenticated_suite
set "ACCESS_TOKEN="
set "LOGIN_BODY=%TEMP%\prestige-login-%RANDOM%.json"
set "LOGIN_RESPONSE=%TEMP%\prestige-login-response-%RANDOM%.json"
set "LOGIN_STATUS=%LOGIN_RESPONSE%.status"

powershell -NoProfile -Command "$payload = @{ customerId = [long]%TEST_CUSTOMER_ID%; password = '%TEST_LOGIN_PASSWORD%' } ^| ConvertTo-Json -Compress; [System.IO.File]::WriteAllText('%LOGIN_BODY%', $payload)"
curl.exe --silent --show-error --output "%LOGIN_RESPONSE%" --write-out "%%{http_code}" --request POST --header "Content-Type: application/json" --data-binary "@%LOGIN_BODY%" "%GATEWAY%/api/v1/auth/login" > "%LOGIN_STATUS%"

set "LOGIN_CODE="
set /p LOGIN_CODE=<"%LOGIN_STATUS%"
if "%LOGIN_CODE%"=="200" (
    for /f "usebackq delims=" %%T in (`powershell -NoProfile -Command "try { $response = Get-Content -Raw '%LOGIN_RESPONSE%' ^| ConvertFrom-Json; if ($response.tokenType -eq 'Bearer' -and -not [string]::IsNullOrWhiteSpace($response.accessToken)) { [Console]::Write($response.accessToken) } } catch { exit 1 }"`) do set "ACCESS_TOKEN=%%T"
)

del "%LOGIN_BODY%" "%LOGIN_RESPONSE%" "%LOGIN_STATUS%" >nul 2>nul

if not defined ACCESS_TOKEN (
    echo FAIL  Authenticated API suite: login did not return an access token.
    set /a FAILED+=1
    exit /b 0
)

call :expect_authenticated "Customer API accepts JWT" GET "%GATEWAY%/api/v1/customers/me" "200"
call :expect_authenticated "Account API accepts JWT" GET "%GATEWAY%/api/v1/accounts/me" "200"
call :expect_authenticated "Account transaction activity" GET "%GATEWAY%/api/v1/accounts/%TEST_SOURCE_ACCOUNT%/transactions" "200"
call :expect_authenticated "Unknown transfer returns not found" GET "%GATEWAY%/api/v1/transfers/SMOKE-TEST-NOT-FOUND" "404"
call :expect_authenticated_json "Transfer request validation" POST "%GATEWAY%/api/v1/transfers" "400" "{}"
call :real_transfer
set "ACCESS_TOKEN="
exit /b 0

:real_transfer
set "TRANSFER_BODY=%TEMP%\prestige-transfer-%RANDOM%.json"
set "TRANSFER_RESPONSE=%TEMP%\prestige-transfer-response-%RANDOM%.json"
set "TRANSFER_STATUS=%TRANSFER_RESPONSE%.status"
set "IDEMPOTENCY_KEY=smoke-%RANDOM%-%RANDOM%"
set "TRANSFER_REFERENCE="

powershell -NoProfile -Command "$payload = @{ sourceAccountNumber = '%TEST_SOURCE_ACCOUNT%'; destinationAccountNumber = '%TEST_DESTINATION_ACCOUNT%'; destinationAccountHolderName = '%TEST_DESTINATION_NAME%'; destinationIfscCode = '%TEST_DESTINATION_IFSC%'; amount = [decimal]'%TEST_TRANSFER_AMOUNT%'; transactionPassword = '%TEST_TRANSACTION_PASSWORD%' } ^| ConvertTo-Json -Compress; [System.IO.File]::WriteAllText('%TRANSFER_BODY%', $payload)"
curl.exe --silent --show-error --output "%TRANSFER_RESPONSE%" --write-out "%%{http_code}" --request POST --header "Authorization: Bearer !ACCESS_TOKEN!" --header "Idempotency-Key: %IDEMPOTENCY_KEY%" --header "Content-Type: application/json" --data-binary "@%TRANSFER_BODY%" "%GATEWAY%/api/v1/transfers" > "%TRANSFER_STATUS%"

set "STATUS="
set /p STATUS=<"%TRANSFER_STATUS%"
if "%STATUS%"=="201" (
    for /f "usebackq delims=" %%T in (`powershell -NoProfile -Command "try { $response = Get-Content -Raw '%TRANSFER_RESPONSE%' ^| ConvertFrom-Json; if (-not [string]::IsNullOrWhiteSpace($response.referenceNumber)) { [Console]::Write($response.referenceNumber) } } catch { exit 1 }"`) do set "TRANSFER_REFERENCE=%%T"
)

if not defined TRANSFER_REFERENCE (
    echo FAIL  Create real transfer: expected [201], received %STATUS%.
    set /a FAILED+=1
    del "%TRANSFER_BODY%" "%TRANSFER_RESPONSE%" "%TRANSFER_STATUS%" >nul 2>nul
    exit /b 0
)
echo PASS  Create real transfer ^(201^)
set /a PASSED+=1

curl.exe --silent --show-error --output "%TRANSFER_RESPONSE%" --write-out "%%{http_code}" --request POST --header "Authorization: Bearer !ACCESS_TOKEN!" --header "Idempotency-Key: %IDEMPOTENCY_KEY%" --header "Content-Type: application/json" --data-binary "@%TRANSFER_BODY%" "%GATEWAY%/api/v1/transfers" > "%TRANSFER_STATUS%"
set "STATUS="
set /p STATUS=<"%TRANSFER_STATUS%"
if "%STATUS%"=="200" (
    echo PASS  Replay real transfer ^(200^)
    set /a PASSED+=1
) else (
    echo FAIL  Replay real transfer: expected [200], received %STATUS%.
    set /a FAILED+=1
)

call :expect_authenticated "Created transfer lookup" GET "%GATEWAY%/api/v1/transfers/%TRANSFER_REFERENCE%" "200"
call :expect_authenticated "Updated account transaction activity" GET "%GATEWAY%/api/v1/accounts/%TEST_SOURCE_ACCOUNT%/transactions" "200"
del "%TRANSFER_BODY%" "%TRANSFER_RESPONSE%" "%TRANSFER_STATUS%" >nul 2>nul
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

:expect_authenticated_json
set "NAME=%~1"
set "METHOD=%~2"
set "URL=%~3"
set "EXPECTED=%~4"
set "REQUEST_BODY=%~5"
set "BODY=%TEMP%\prestige-response-%RANDOM%.txt"
set "STATUS_FILE=%BODY%.status"

curl.exe --silent --show-error --output "%BODY%" --write-out "%%{http_code}" --request %METHOD% --header "Authorization: Bearer !ACCESS_TOKEN!" --header "Content-Type: application/json" --data "%REQUEST_BODY%" "%URL%" > "%STATUS_FILE%"

set "STATUS="
set /p STATUS=<"%STATUS_FILE%"
set "MATCH="
for %%S in (%EXPECTED%) do if "!STATUS!"=="%%S" set "MATCH=1"

if defined MATCH (
    echo PASS  %NAME% ^(!STATUS!^)
    set /a PASSED+=1
) else (
    echo FAIL  %NAME%: expected [%EXPECTED%], received !STATUS!.
    set /a FAILED+=1
)

del "%BODY%" "%STATUS_FILE%" >nul 2>nul
exit /b 0

:expect_authenticated
set "NAME=%~1"
set "METHOD=%~2"
set "URL=%~3"
set "EXPECTED=%~4"
set "BODY=%TEMP%\prestige-response-%RANDOM%.txt"
set "STATUS_FILE=%BODY%.status"

curl.exe --silent --show-error --output "%BODY%" --write-out "%%{http_code}" --request %METHOD% --header "Authorization: Bearer !ACCESS_TOKEN!" "%URL%" > "%STATUS_FILE%"

set "STATUS="
set /p STATUS=<"%STATUS_FILE%"
set "MATCH="
for %%S in (%EXPECTED%) do if "!STATUS!"=="%%S" set "MATCH=1"

if defined MATCH (
    echo PASS  %NAME% ^(!STATUS!^)
    set /a PASSED+=1
) else (
    echo FAIL  %NAME%: expected [%EXPECTED%], received !STATUS!.
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
