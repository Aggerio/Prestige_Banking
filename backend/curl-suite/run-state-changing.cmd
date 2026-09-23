@echo off
setlocal EnableExtensions

rem Intentionally NOT part of the safe suite: these calls persist changes.
rem First set TOKEN to a freshly issued token for customer 103, then explicitly set RUN_MUTATIONS=YES.
if /I not "%RUN_MUTATIONS%"=="YES" (
  echo Refusing to mutate data. Run: set RUN_MUTATIONS=YES
  exit /b 2
)
if not defined TOKEN (
  echo Set TOKEN to a freshly issued customer-103 JWT first.
  exit /b 2
)

set "BASE_URL=http://localhost:8080"
set "AUTH_URL=http://localhost:8083"
set "SOURCE_ACCOUNT=PBS1000003"
set "DESTINATION_ACCOUNT=PBS1000004"
set "DESTINATION_IFSC=PBS0001004"

rem Transfer: changes balances and creates ledger/notification data. Use a unique idempotency key every run.
curl.exe -sS -i -X POST "%BASE_URL%/api/v1/transfers" -H "Authorization: Bearer %TOKEN%" -H "Idempotency-Key: CURL-ROHAN-20260923-001" -H "Content-Type: application/json" --data "{\"sourceAccountNumber\":\"%SOURCE_ACCOUNT%\",\"destinationAccountNumber\":\"%DESTINATION_ACCOUNT%\",\"destinationAccountHolderName\":\"Ananya Iyer\",\"destinationIfscCode\":\"%DESTINATION_IFSC%\",\"amount\":1.00,\"transactionPassword\":\"RohanTxnPassword\"}"

rem Replace 1 with a notification ID returned by GET /api/v1/notifications.
curl.exe -sS -i -X PATCH "%BASE_URL%/api/v1/notifications/1/read" -H "Authorization: Bearer %TOKEN%"

rem These change authentication data; replace placeholder values before executing.
curl.exe -sS -i -X PUT "%AUTH_URL%/api/v1/auth/passwords/login" -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" --data "{\"currentPassword\":\"NewLogin@1234\",\"newPassword\":\"REPLACE_ME\",\"confirmPassword\":\"REPLACE_ME\"}"
curl.exe -sS -i -X PUT "%AUTH_URL%/api/v1/auth/passwords/transaction" -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" --data "{\"accountNumber\":\"%SOURCE_ACCOUNT%\",\"currentPassword\":\"RohanTxnPassword\",\"newPassword\":\"REPLACE_ME\",\"confirmPassword\":\"REPLACE_ME\"}"

rem Logout revokes the refresh session represented by the supplied cookie jar, if any.
curl.exe -sS -i -X POST "%AUTH_URL%/api/v1/auth/logout" -H "Authorization: Bearer %TOKEN%"

endlocal
