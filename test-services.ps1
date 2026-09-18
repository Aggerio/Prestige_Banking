[CmdletBinding()]
param(
    [string]$GatewayUrl = 'http://localhost:8080',
    [string]$EurekaUrl = 'http://localhost:8761',
    [string]$FrontendUrl = 'http://localhost:5173',
    [int]$StartupTimeoutSeconds = 300
)

$ErrorActionPreference = 'Stop'
$deadline = (Get-Date).AddSeconds($StartupTimeoutSeconds)
$passed = 0
$failed = 0

function Invoke-HttpCheck {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = 'GET',
        [string]$Body,
        [int[]]$ExpectedStatus = @(200)
    )

    $temporaryResponse = New-TemporaryFile
    try {
        $arguments = @('--silent', '--show-error', '--output', $temporaryResponse.FullName,
            '--write-out', '%{http_code}', '--request', $Method)
        if ($null -ne $Body) {
            $arguments += @('--header', 'Content-Type: application/json', '--data', $Body)
        }
        $arguments += $Url
        $statusText = (& curl.exe @arguments).Trim()
        $status = [int]$statusText
        if ($ExpectedStatus -contains $status) {
            Write-Host "PASS  $Name ($status)" -ForegroundColor Green
            $script:passed++
            return
        }

        $response = Get-Content -Raw $temporaryResponse.FullName -ErrorAction SilentlyContinue
        Write-Host "FAIL  ${Name}: expected $($ExpectedStatus -join ', '), received $status. $response" -ForegroundColor Red
        $script:failed++
    } catch {
        Write-Host "FAIL  ${Name}: $($_.Exception.Message)" -ForegroundColor Red
        $script:failed++
    } finally {
        Remove-Item -LiteralPath $temporaryResponse.FullName -Force -ErrorAction SilentlyContinue
    }
}

Write-Host 'Waiting for Eureka...' -ForegroundColor Cyan
while ((Get-Date) -lt $deadline) {
    try {
        $status = (& curl.exe --silent --output NUL --write-out '%{http_code}' "$EurekaUrl/").Trim()
        if ($status -eq '200') { break }
    } catch { }
    Start-Sleep -Seconds 5
}

if ((Get-Date) -ge $deadline) {
    throw "Eureka did not become available within $StartupTimeoutSeconds seconds. Run 'docker compose logs --follow' to inspect startup failures."
}

Invoke-HttpCheck -Name 'Eureka dashboard' -Url "$EurekaUrl/"
Invoke-HttpCheck -Name 'Frontend' -Url "$FrontendUrl/"
Invoke-HttpCheck -Name 'Gateway routes auth JWKS' -Url "$GatewayUrl/.well-known/jwks.json"
Invoke-HttpCheck -Name 'Gateway routes public information' -Url "$GatewayUrl/api/v1/public/home" -ExpectedStatus @(200, 404)
Invoke-HttpCheck -Name 'Gateway routes public chatbot' -Url "$GatewayUrl/api/v1/chat/public" -Method 'POST' -Body '{"message":"What information is public?"}'
Invoke-HttpCheck -Name 'Customer API requires JWT' -Url "$GatewayUrl/api/v1/customers/me" -ExpectedStatus @(401)
Invoke-HttpCheck -Name 'Transfer API requires JWT' -Url "$GatewayUrl/api/v1/transfers/TEST-REFERENCE" -ExpectedStatus @(401)
Invoke-HttpCheck -Name 'Protected chatbot requires JWT' -Url "$GatewayUrl/api/v1/chat" -Method 'POST' -Body '{"message":"Show my account details"}' -ExpectedStatus @(401)

try {
    $applications = & curl.exe --silent --show-error --header 'Accept: application/json' "$EurekaUrl/eureka/apps"
    $requiredServices = @(
        'API-GATEWAY', 'AUTHENTICATION-SERVICE', 'CUSTOMER-SERVICE',
        'TRANSFER-SERVICE', 'PUBLIC-INFO-SERVICE', 'CHATBOT-SERVICE'
    )
    foreach ($service in $requiredServices) {
        if ($applications -match [regex]::Escape($service)) {
            Write-Host "PASS  Eureka registration: $service" -ForegroundColor Green
            $passed++
        } else {
            Write-Host "FAIL  Eureka registration missing: $service" -ForegroundColor Red
            $failed++
        }
    }
} catch {
    Write-Host "FAIL  Eureka registry query: $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

Write-Host "`nSmoke-test summary: $passed passed, $failed failed."
if ($failed -gt 0) { exit 1 }
