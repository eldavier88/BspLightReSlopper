
# batch_simple.ps1 - Simple batch test using Start-Process

param(
    [string]$BsplrsExe = "E:\Repos\BspLightReSlopper\publish\bsplrs.exe",
    [string]$Jk2Pk3Dir = "D:\JK2 Best\base",
    [string]$JkaPk3Dir = "D:\JKA\base",
    [string]$OutDir = "E:\Repos\BspLightReSlopper\batch_results"
)

Add-Type -AssemblyName System.IO.Compression.FileSystem
$ErrorActionPreference = "Continue"
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$tmpDir = Join-Path $OutDir "bsp_tmp"
New-Item -ItemType Directory -Force -Path $tmpDir | Out-Null

function Get-BspsInPk3($pk3Path) {
    try {
        $zip = [System.IO.Compression.ZipFile]::OpenRead($pk3Path)
        $bsps = @($zip.Entries | Where-Object { $_.FullName -match "^maps/.+\.bsp$" } | Select-Object -ExpandProperty FullName)
        $zip.Dispose(); $bsps
    } catch { @() }
}

function Extract-BspEntry($pk3Path, $entryName) {
    $zip = [System.IO.Compression.ZipFile]::OpenRead($pk3Path)
    $entry = $zip.Entries | Where-Object { $_.FullName -eq $entryName } | Select-Object -First 1
    if (-not $entry) { $zip.Dispose(); return $null }
    $safeName = $entryName -replace "[/\\]","_"
    $dest = Join-Path $tmpDir $safeName
    $es = $entry.Open()
    $fs = [System.IO.File]::OpenWrite($dest)
    $es.CopyTo($fs); $fs.Dispose(); $es.Dispose(); $zip.Dispose()
    return $dest
}

# Build map list
$allMaps = [System.Collections.Generic.List[object]]::new()
$seen = [System.Collections.Generic.HashSet[string]]::new()
foreach ($g in @(@{G="JK2";D=$Jk2Pk3Dir}, @{G="JKA";D=$JkaPk3Dir})) {
    foreach ($pk3 in (Get-ChildItem $g.D -Filter "assets*.pk3" | Sort-Object Name -Descending)) {
        foreach ($bsp in (Get-BspsInPk3 $pk3.FullName)) {
            if ($seen.Add("$($g.G)::$bsp")) {
                $allMaps.Add([PSCustomObject]@{Game=$g.G;Pk3=$pk3.FullName;Entry=$bsp})
            }
        }
    }
}
Write-Host "Maps: $($allMaps.Count)"

$results = [System.Collections.Generic.List[object]]::new()
$idx = 0
foreach ($m in $allMaps) {
    $idx++
    $safe = "$($m.Game)_$($m.Entry -replace '[/\\]','_' -replace '\.bsp','')"
    Write-Host "[$idx/$($allMaps.Count)] $($m.Game) $($m.Entry)" -NoNewline
    
    $bsp = Extract-BspEntry $m.Pk3 $m.Entry
    if (-not $bsp) { Write-Host " EXTRACT_FAIL" -ForegroundColor Red; continue }
    
    $ent = Join-Path $OutDir "$safe.ent"
    $log = Join-Path $OutDir "$safe.stdout"
    $err = Join-Path $OutDir "$safe.stderr"
    
    $p = Start-Process -FilePath $BsplrsExe `
        -ArgumentList "estimate","--bsp","$bsp","-o","$ent" `
        -RedirectStandardOutput $log -RedirectStandardError $err `
        -NoNewWindow -PassThru -Wait
    
    $exit = $p.ExitCode
    $nLights = if (Test-Path $ent) { (Select-String -Path $ent -Pattern '"classname" "light"').Count } else { 0 }
    $errTail = if (Test-Path $err) { (Get-Content $err -Tail 3) -join " | " } else { "" }
    $status = if ($exit -eq 0) {"OK"} else {"FAIL($exit)"}
    
    $color = if ($exit -eq 0) {"Green"} else {"Red"}
    Write-Host " $status lights=$nLights" -ForegroundColor $color
    if ($exit -ne 0) { Write-Host "  -> $errTail" -ForegroundColor Red }
    
    $results.Add([PSCustomObject]@{Game=$m.Game;Map=$m.Entry;Status=$status;Lights=$nLights;Error=$errTail})
    Remove-Item $bsp -ErrorAction SilentlyContinue
}

# Summary
$fail = $results | Where-Object { $_.Status -ne "OK" }
$results | Export-Csv (Join-Path $OutDir "summary.csv") -NoTypeInformation
Write-Host ""
Write-Host "DONE. OK=$((($results|Where-Object{$_.Status -eq 'OK'}).Count))  FAIL=$(($fail).Count)"
if ($fail.Count -gt 0) {
    Write-Host "FAILURES:"
    $fail | ForEach-Object { Write-Host "  $($_.Game) $($_.Map): $($_.Error)" }
}
