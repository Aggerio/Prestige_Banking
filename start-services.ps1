[CmdletBinding()]
param(
    [switch]$Foreground
)

$ErrorActionPreference = 'Stop'

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw 'Docker Desktop is required. Install it, start it, then run this script again.'
}

docker compose version | Out-Null

$composeArgs = @('compose', 'up', '--build', '--remove-orphans')
if (-not $Foreground) {
    $composeArgs += '--detach'
}

& docker @composeArgs
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

if (-not $Foreground) {
    Write-Host 'Prestige Banking is starting.'
    Write-Host 'Gateway: http://localhost:8080'
    Write-Host 'Frontend: http://localhost:5173'
    Write-Host 'Eureka: http://localhost:8761'
    Write-Host 'Logs: docker compose logs --follow'
}

