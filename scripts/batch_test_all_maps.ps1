
# batch_test_all_maps.ps1
# Runs bsplrs estimate --bsp on all JK2 + JKA maps and collects pass/fail/crash reports

param(
    [string]$BslprsExe = "dotnet",
    [string]$BsplrsArgs = "run --project E:\Repos\BspLightReSlopper\src\BspLightReSlopper\BspLightReSlopper.csproj -c Release --",
    [string]$Jk2Assets = "D:\JK2 Best\base",
    [string]$JkaAssets = "D:\JKA\base",
    [string]$OutDir = "E:\Repos\BspLightReSlopper\batch_results",
    [int]$TimeoutSec = 120
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
            $destPath = Join-Path $outFolder ($entry.FullName -replace "/","_")
            $stream = $entry.Open()
            $fs = [System.IO.File]::OpenWrite($destPath)
            $stream.CopyTo($fs)
            $fs.Dispose(); $stream.Dispose()
            $zip.Dispose()
            return $destPath
        }
        $zip.Dispose()
        return $null
    } catch { return $null }
}

# Collect all maps: prefer highest-numbered pk3 wins (assets5 > assets2 > assets0)
$jk2Pk3s = Get-ChildItem $Jk2Assets -Filter "assets*.pk3" | Sort-Object Name -Descending
$jkaPk3s = Get-ChildItem $JkaAssets -Filter "assets*.pk3" | Sort-Object Name -Descending

$allMaps = @{}

foreach ($pk3 in $jk2Pk3s) {
    foreach ($bsp in (Get-BspsInPk3 $pk3.FullName)) {
        $key = "JK2::$bsp"
        if (-not $allMaps.ContainsKey($key)) {
            $allMaps[$key] = @{ Game="JK2"; Pk3=$pk3.FullName; Entry=$bsp }
        }
    }
}

foreach ($pk3 in $jkaPk3s) {
    foreach ($bsp in (Get-BspsInPk3 $pk3.FullName)) {
        $key = "JKA::$bsp"
        if (-not $allMaps.ContainsKey($key)) {
            $allMaps[$key] = @{ Game="JKA"; Pk3=$pk3.FullName; Entry=$bsp }
        }
    }
}

Write-Host "Total maps to test: $($allMaps.Count)"

$tmpDir = Join-Path $OutDir "extracted_bsps"
New-Item -ItemType Directory -Force -Path $tmpDir | Out-Null

$results = @()
$i = 0
foreach ($key in ($allMaps.Keys | Sort-Object)) {
    $i++
    $info = $allMaps[$key]
    $bspEntry = $info.Entry
    $safeName = ($bspEntry -replace "[/\\]","_" -replace "\.bsp$","")
    
    Write-Host "[$i/$($allMaps.Count)] $($info.Game): $bspEntry" -NoNewline

    # Extract BSP
    $bspPath = Extract-Bsp $info.Pk3 $bspEntry $tmpDir
    if (-not $bspPath) {
        Write-Host " [EXTRACT FAIL]" -ForegroundColor Red
        $results += [PSCustomObject]@{ Game=$info.Game; Map=$bspEntry; Status="EXTRACT_FAIL"; Lights=0; Error="Could not extract" }
        continue
    }

    # Run estimator
    $outEnt = Join-Path $OutDir "$safeName.ent"
    $logPath = Join-Path $OutDir "$safeName.log"
    
    $argList = "estimate --bsp `"$bspPath`" -o `"$outEnt`" --log `"$logPath`""
    
    try {
        $proc = Start-Process -FilePath $BslprsExe -ArgumentList "$BsplrsArgs $argList" `
            -Wait -PassThru -NoNewWindow -RedirectStandardOutput "$logPath.stdout" -RedirectStandardError "$logPath.stderr" `
            -TimeoutSec $TimeoutSec 2>$null
        $exitCode = $proc.ExitCode
    } catch {
        $exitCode = -999
    }
    
    $lightCount = 0
    if (Test-Path $outEnt) {
        $lightCount = (Select-String -Path $outEnt -Pattern '"classname" "light"' -Quiet) ? 
            (Select-String -Path $outEnt -Pattern '"classname" "light"').Count : 0
        $lightCount = (Get-Content $outEnt | Select-String '"classname" "light"').Count
    }
    
    $stderr = if (Test-Path "$logPath.stderr") { (Get-Content "$logPath.stderr" -Raw) } else { "" }
    $status = if ($exitCode -eq 0) { "OK" } elseif ($exitCode -eq -999) { "TIMEOUT" } else { "FAIL" }
    
    $errMsg = ""
    if ($status -ne "OK") {
        $errMsg = ($stderr | Select-String "error|exception|unhandled" | Select-Object -First 3) -join "; "
        if (-not $errMsg -and (Test-Path "$logPath.stdout")) {
            $errMsg = (Get-Content "$logPath.stdout" | Select-String "error|exception|warn" | Select-Object -Last 5) -join "; "
        }
    }
    
    $color = if ($status -eq "OK") { "Green" } elseif ($status -eq "TIMEOUT") { "Yellow" } else { "Red" }
    Write-Host " [$status] lights=$lightCount" -ForegroundColor $color
    
    $results += [PSCustomObject]@{ Game=$info.Game; Map=$bspEntry; Status=$status; ExitCode=$exitCode; Lights=$lightCount; Error=$errMsg }
    
    # Remove extracted bsp to save space
    Remove-Item $bspPath -ErrorAction SilentlyContinue
}

# Summary report
$csvPath = Join-Path $OutDir "results_summary.csv"
$results | Export-Csv -Path $csvPath -NoTypeInformation

Write-Host ""
Write-Host "=== SUMMARY ==="
Write-Host "Total: $($results.Count)"
Write-Host "OK: $(($results | Where-Object Status -eq 'OK').Count)" -ForegroundColor Green
Write-Host "FAIL: $(($results | Where-Object Status -eq 'FAIL').Count)" -ForegroundColor Red
Write-Host "TIMEOUT: $(($results | Where-Object Status -eq 'TIMEOUT').Count)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Failures:"
$results | Where-Object { $_.Status -ne "OK" } | ForEach-Object {
    Write-Host "  $($_.Game) $($_.Map): $($_.Status) - $($_.Error)"
}

Write-Host ""
Write-Host "Results written to: $csvPath"
