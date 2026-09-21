$ErrorActionPreference = 'SilentlyContinue'

# The command marker is set by start-tabs.cmd.  It lets this script close the
# persistent cmd/Maven/npm process tree, rather than only its listener child.
$ports = 3000, 8080, 8004, 8002, 8001, 8083, 8761
$processes = Get-CimInstance Win32_Process
$byId = @{}
foreach ($process in $processes) {
    $byId[[int]$process.ProcessId] = $process
}

function Get-StackRoot([int] $processId) {
    $current = $byId[$processId]
    $candidate = $null

    while ($null -ne $current) {
        $commandLine = [string]$current.CommandLine
        if ($commandLine -match 'PRESTIGE_STACK=1|mvn(?:\.cmd)?\s|npm\s+run\s+dev') {
            $candidate = [int]$current.ProcessId
        }

        $parentId = [int]$current.ParentProcessId
        if ($parentId -eq 0 -or $parentId -eq [int]$current.ProcessId) {
            break
        }
        $current = $byId[$parentId]
    }

    if ($null -ne $candidate) { return $candidate }
    return $processId
}

$targets = New-Object 'System.Collections.Generic.HashSet[int]'

# Stop all tabs started by this repository, including a tab whose service did
# not reach a listening port because it failed during startup.
foreach ($process in $processes) {
    if ([string]$process.CommandLine -match 'PRESTIGE_STACK=1') {
        [void]$targets.Add([int]$process.ProcessId)
    }
}

# Also clean up stacks started before the marker was introduced.
foreach ($port in $ports) {
    $listeners = Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue |
        Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($listener in $listeners) {
        [void]$targets.Add((Get-StackRoot ([int]$listener)))
    }
}

if ($targets.Count -eq 0) {
    Write-Host 'No local Prestige Banking services are running.'
    exit 0
}

foreach ($processId in $targets) {
    Write-Host "Stopping process tree rooted at PID $processId..."
    & taskkill.exe /PID $processId /T /F | Out-Null
}

Start-Sleep -Milliseconds 500
$remaining = foreach ($port in $ports) {
    Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue
}

if ($remaining) {
    Write-Warning 'Some service ports are still in use. Run stop-all.cmd again after the processes finish shutting down.'
    exit 1
}

Write-Host 'All local Prestige Banking service processes have stopped.'
