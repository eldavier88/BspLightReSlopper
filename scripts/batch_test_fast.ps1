
# batch_test_fast.ps1 - Uses published binary directly for fast batch testing

param(
    [string]$BsplrsExe = "E:\Repos\BspLightReSlopper\publish\bsplrs.exe",
    [string]$Jk2Assets = "D:\JK2 Best\base",
    [string]$JkaAssets = "D:\JKA\base",
    [string]$OutDir = "E:\Repos\BspLightReSlopper\batch_results",
    [int]$TimeoutSec = 60
)

Add-Type -AssemblyName System.IO.Compression.FileSystem
$ErrorActionPreference = "Continue"
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

function Get-BspsInPk3($pk3Path) {
    try {
        $zip = [System.IO.Compression.ZipFile]::OpenRead($pk3Path)
        $bsps = $zip.Entries | Where-Object { $_.FullName -like "maps/*.bsp" -or $_.FullName -like "maps/mp/*.bsp" } | Select-Object -ExpandProperty FullName
        $zip.Dispose()
        $bsps
    } catch { @() }
}

function Extract-Bsp($pk3Path, $bspEntry, $outFolder) {
    try {
        $zip = [System.IO.Compression.ZipFile]::OpenRead($pk3Path)
        $entry = $zip.Entries | Where-Object { $_.FullName -eq $bspEntry } | Select-Object -First 1
        if ($entry) {
            $safeName = $bspEntry -replace "[/\\]","_"
            $destPath = Join-Path $outFolder $safeName
            $stream = $entry.Open()
            $fs = [System.IO.File]::OpenWrite($destPath)
            $stream.CopyTo($fs)
            $fs.Dispose(); $stream.Dispose()
        }
        $zip.Dispose()
        return $destPath
    } catch { return $null }
}

# Collect all maps
$allMaps = [System.Collections.Generic.List[object]]::new()
$seen = [System.Collections.Generic.HashSet[string]]::new()

foreach ($dir in @(@{Game="JK2";Assets=$Jk2Assets}, @{Game="JKA";Assets=$JkaAssets})) {
    $pk3s = Get-ChildItem $dir.Assets -Filter "assets*.pk3" | Sort-Object Name -Descending
    foreach ($pk3 in $pk3s) {
        foreach ($bsp in (Get-BspsInPk3 $pk3.FullName)) {
            $key = "$($dir.Game)::$bsp"
            if ($seen.Add($key)) {
                $allMaps.Add([PSCustomObject]@{ Game=$dir.Game; Pk3=$pk3.FullName; Entry=$bsp })
            }
        }
    }
}

Write-Host "Total maps to test: $($allMaps.Count)"

$tmpDir = Join-Path $OutDir "extracted_bsps"
New-Item -ItemType Directory -Force -Path $tmpDir | Out-Null

$results = [System.Collections.Generic.List[object]]::new()
$i = 0
foreach ($info in $allMaps) {
    $i++
    $safeName = "$($info.Game)_$($info.Entry -replace '[/\\]','_' -replace '\.bsp$','')"
    
    Write-Host "[$i/$($allMaps.Count)] $($info.Game): $($info.Entry)" -NoNewline

    $bspPath = Extract-Bsp $info.Pk3 $info.Entry $tmpDir
    if (-not $bspPath -or -not (Test-Path $bspPath)) {
        Write-Host " [EXTRACT FAIL]" -ForegroundColor Red
        $results.Add([PSCustomObject]@{ Game=$info.Game; Map=$info.Entry; Status="EXTRACT_FAIL"; Lights=0; Error="Extract failed" })
        continue
    }

    $outEnt = Join-Path $OutDir "$safeName.ent"
    $logOut = Join-Path $OutDir "$safeName.log"
    $logErr = Join-Path $OutDir "$safeName.err"

    $psi = [System.Diagnostics.ProcessStartInfo]::new()
    $psi.FileName = $BsplrsExe
    $psi.Arguments = "estimate --bsp `"$bspPath`" -o `"$outEnt`""
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.UseShellExecute = $false
    $psi.CreateNoWindow = $true
    
    $proc = [System.Diagnostics.Process]::new()
    $proc.StartInfo = $psi
    
    $stdout = [System.Text.StringBuilder]::new()
    $stderr = [System.Text.StringBuilder]::new()
    $proc.OutputDataReceived += { param($s,$e); if ($e.Data) { [void]$stdout.AppendLine($e.Data) } }
    $proc.ErrorDataReceived  += { param($s,$e); if ($e.Data) { [void]$stderr.AppendLine($e.Data) } }
    
    $proc.Start() | Out-Null
    $proc.BeginOutputReadLine()
    $proc.BeginErrorReadLine()
    
    $timedOut = $false
    if (-not $proc.WaitForExit($TimeoutSec * 1000)) {
        $proc.Kill()
        $timedOut = $true
    }
    
    $exitCode = if ($timedOut) { -1 } else { $proc.ExitCode }
    
    [System.IO.File]::WriteAllText($logOut, $stdout.ToString())
    [System.IO.File]::WriteAllText($logErr, $stderr.ToString())

    $lightCount = 0
    if (Test-Path $outEnt) {
        $lightCount = (Get-Content $outEnt | Select-String '"classname" "light"').Count
    }
    
    $status = if ($timedOut) { "TIMEOUT" } elseif ($exitCode -eq 0) { "OK" } else { "FAIL" }
    $errSnip = ""
    if ($status -ne "OK") {
        $allOut = $stdout.ToString() + $stderr.ToString()
        $errSnip = ($allOut -split "`n" | Where-Object { $_ -match "error|exception|unhandled|crash" } | Select-Object -Last 3) -join " | "
        if (-not $errSnip) {
            $errSnip = ($allOut -split "`n" | Select-Object -Last 5) -join " | "
        }
    }
    
    $color = if ($status -eq "OK") { "Green" } elseif ($status -eq "TIMEOUT") { "Yellow" } else { "Red" }
    Write-Host " [$status] lights=$lightCount" -ForegroundColor $color
    
    $results.Add([PSCustomObject]@{ Game=$info.Game; Map=$info.Entry; Status=$status; ExitCode=$exitCode; Lights=$lightCount; Error=$errSnip.Substring(0, [Math]::Min(300, $errSnip.Length)) })

    Remove-Item $bspPath -ErrorAction SilentlyContinue
}

$csvPath = Join-Path $OutDir "results_summary.csv"
$results | Export-Csv -Path $csvPath -NoTypeInformation

Write-Host ""
Write-Host "=== SUMMARY ==="
$ok = ($results | Where-Object Status -eq 'OK').Count
$fail = ($results | Where-Object Status -eq 'FAIL').Count
$timeout = ($results | Where-Object Status -eq 'TIMEOUT').Count
Write-Host "Total: $($results.Count)  OK: $ok  FAIL: $fail  TIMEOUT: $timeout"

Write-Host ""
if ($fail + $timeout -gt 0) {
    Write-Host "=== FAILURES ==="
    $results | Where-Object { $_.Status -ne "OK" } | ForEach-Object {
        Write-Host "  [$($_.Game)] $($_.Map): $($_.Status)"
        if ($_.Error) { Write-Host "    Error: $($_.Error)" }
    }
}
Write-Host "CSV: $csvPath"
