<#
.SYNOPSIS
  Populates the sibling resources folder used by BspLightReSlopper.

.DESCRIPTION
  Idempotent. Re-running skips anything already present. Network-touching steps
  (git clone, http download) only run when the corresponding folder is missing.

  Layout produced (next to the repo, not inside it):

    <repo>/..\BspLightReSlopper-resources\
      netradiant-custom-bin\          q3map2.exe + radiant.exe + gamepacks\ (extracted)
      netradiant-custom-src\          git clone Garux/netradiant-custom (read-only ref)
      quake3-src\                     git clone id-Software/Quake-III-Arena (cm_*.c ref)
      jk2-sdk\                        Jedi Outcast SDK with example .map files
      jka-sdk\                        Jedi Academy SDK with example .map files
      jk2-assets\                     symlink/junction to existing JK2 assets dir
      paths.env.ps1                   convenience script: dot-source to set env vars

.PARAMETER ResourcesRoot
  Where to put the sibling folder. Default: <repo-parent>\BspLightReSlopper-resources

.PARAMETER NrcZip
  Path to a netradiant-custom binary zip to extract. Default looks at
  e:\Repos\tom-jk2mv-everything\tools\netradiant\nrc.zip if it exists.

.PARAMETER Jk2Assets
  Path to an extracted JK2 asset directory containing maps\*.bsp and *.pk3.
  Default looks at e:\temp_jk2_0 if it exists.

.PARAMETER SkipNetwork
  If set, skips git clones and http downloads. Useful for offline iteration.
#>

[CmdletBinding()]
param(
    [string] $ResourcesRoot = "",
    [string] $NrcZip        = "",
    [string] $Jk2Assets     = "",
    [switch] $SkipNetwork
)

$ErrorActionPreference = "Stop"
$PSNativeCommandUseErrorActionPreference = $false

function Write-Step($msg) { Write-Host "==> $msg" -ForegroundColor Cyan }
function Write-Skip($msg) { Write-Host "    skip: $msg" -ForegroundColor DarkGray }
function Write-Ok($msg)   { Write-Host "    ok:   $msg" -ForegroundColor Green }
function Write-Warn2($msg){ Write-Host "    warn: $msg" -ForegroundColor Yellow }
function Write-Fail($msg) { Write-Host "    fail: $msg" -ForegroundColor Red }

$repo = Resolve-Path (Join-Path $PSScriptRoot "..")
if (-not $ResourcesRoot) {
    $ResourcesRoot = Join-Path (Split-Path -Parent $repo) "BspLightReSlopper-resources"
}
Write-Step "Resources root: $ResourcesRoot"
if (-not (Test-Path $ResourcesRoot)) {
    New-Item -ItemType Directory -Path $ResourcesRoot | Out-Null
    Write-Ok "created"
} else {
    Write-Skip "already exists"
}

# ---------------------------------------------------------------------------
# 1. netradiant-custom binary (extract nrc.zip)
# ---------------------------------------------------------------------------
$nrcBin = Join-Path $ResourcesRoot "netradiant-custom-bin"
Write-Step "netradiant-custom binary -> $nrcBin"
if (Test-Path (Join-Path $nrcBin "q3map2.exe")) {
    Write-Skip "q3map2.exe already present"
} else {
    if (-not $NrcZip) {
        $candidate = "e:\Repos\tom-jk2mv-everything\tools\netradiant\nrc.zip"
        if (Test-Path $candidate) { $NrcZip = $candidate }
    }
    if (-not (Test-Path $NrcZip)) {
        Write-Fail "no netradiant-custom zip found. Pass -NrcZip <path-to-nrc.zip>."
        Write-Fail "(Garux netradiant-custom releases: https://github.com/Garux/netradiant-custom/releases)"
    } else {
        Write-Host "    extracting $NrcZip"
        if (-not (Test-Path $nrcBin)) { New-Item -ItemType Directory -Path $nrcBin | Out-Null }
        Expand-Archive -Path $NrcZip -DestinationPath $nrcBin -Force
        if (Test-Path (Join-Path $nrcBin "q3map2.exe")) {
            Write-Ok "q3map2.exe extracted"
        } else {
            Write-Fail "q3map2.exe not found after extracting $NrcZip"
        }
    }
}

# ---------------------------------------------------------------------------
# 2. netradiant-custom source (read-only reference)
# ---------------------------------------------------------------------------
$nrcSrc = Join-Path $ResourcesRoot "netradiant-custom-src"
Write-Step "netradiant-custom source -> $nrcSrc"
if (Test-Path (Join-Path $nrcSrc ".git")) {
    Write-Skip "git checkout already present"
} elseif ($SkipNetwork) {
    Write-Skip "-SkipNetwork: not cloning"
} else {
    Write-Host "    git clone https://github.com/Garux/netradiant-custom.git --depth=1"
    git clone --depth=1 "https://github.com/Garux/netradiant-custom.git" $nrcSrc
    if (Test-Path (Join-Path $nrcSrc ".git")) { Write-Ok "cloned" } else { Write-Fail "clone failed" }
}

# ---------------------------------------------------------------------------
# 3. Quake III Arena source (read-only reference for cm_*.c)
# ---------------------------------------------------------------------------
$q3src = Join-Path $ResourcesRoot "quake3-src"
Write-Step "Quake III Arena source -> $q3src"
if (Test-Path (Join-Path $q3src ".git")) {
    Write-Skip "git checkout already present"
} elseif ($SkipNetwork) {
    Write-Skip "-SkipNetwork: not cloning"
} else {
    Write-Host "    git clone https://github.com/id-Software/Quake-III-Arena.git --depth=1"
    git clone --depth=1 "https://github.com/id-Software/Quake-III-Arena.git" $q3src
    if (Test-Path (Join-Path $q3src ".git")) { Write-Ok "cloned" } else { Write-Fail "clone failed" }
}

# ---------------------------------------------------------------------------
# 4 + 5. JK2 / JK2EditingTools / JK2EditingTools2 SDKs
# ---------------------------------------------------------------------------
# The Raven Software JK2 editing tools shipped as InstallShield/Inno-style
# installers (April 2002 + a later v2 release). To keep everything in the
# resources tree (no Program Files writes, no Start Menu entries) we prefer
# 7-Zip extraction (modern 7z handles Inno installers natively); silent
# install with /DIR is the fallback when 7z isn't available.
function Has-MapFiles($dir) {
    if (-not (Test-Path $dir)) { return $false }
    return (Get-ChildItem -Path $dir -Recurse -Filter "*.map" -ErrorAction SilentlyContinue | Select-Object -First 1) -ne $null
}

function Install-JKEditingTool {
    param(
        [Parameter(Mandatory)] [string] $InstallerPath,
        [Parameter(Mandatory)] [string] $DestDir
    )
    if (-not (Test-Path $InstallerPath)) {
        return @{ Installed = $false; Reason = "installer not found: $InstallerPath" }
    }
    if (-not (Test-Path $DestDir)) {
        New-Item -ItemType Directory -Path $DestDir -Force | Out-Null
    }
    if (Has-MapFiles $DestDir) {
        return @{ Installed = $true; Reason = "already populated" }
    }

    # Method 1 (preferred for the Raven JK2 SDK installers): treat the EXE as
    # an EXE-prefixed ZIP. The JK2EditingTools(.2).exe binaries are WinZip
    # self-extractors (PE marker '_winzip_' in their data section), and .NET's
    # ZipFile.OpenRead happily reads the ZIP central directory at the end of
    # the file. No external tooling, no Program Files writes, no Start Menu.
    try {
        Add-Type -AssemblyName System.IO.Compression.FileSystem -ErrorAction SilentlyContinue
        $z = [System.IO.Compression.ZipFile]::OpenRead($InstallerPath)
        try {
            $count = 0
            foreach ($e in $z.Entries) {
                if ([string]::IsNullOrEmpty($e.Name)) { continue } # directory entry
                $rel = $e.FullName -replace '/', '\'
                $dst = Join-Path $DestDir $rel
                $dstDir = Split-Path -Parent $dst
                if ($dstDir -and -not (Test-Path $dstDir)) { New-Item -ItemType Directory -Path $dstDir -Force | Out-Null }
                [System.IO.Compression.ZipFileExtensions]::ExtractToFile($e, $dst, $true)
                $count++
            }
            Write-Host "    method: ZipFile.ExtractToFile -> $count entries"
        } finally { $z.Dispose() }
        if (Has-MapFiles $DestDir) {
            return @{ Installed = $true; Reason = "ZIP-embedded SFX extracted" }
        }
    } catch {
        Write-Host "      ZipFile.OpenRead failed: $($_.Exception.Message)"
    }

    # Method 2: 7z extraction (handles Inno / InstallShield / NSIS too).
    $sz = $null
    $candidates7z = @()
    $cmd = Get-Command "7z.exe" -ErrorAction SilentlyContinue
    if ($cmd) { $candidates7z += $cmd.Source }
    $cmd = Get-Command "7z" -ErrorAction SilentlyContinue
    if ($cmd) { $candidates7z += $cmd.Source }
    $candidates7z += @("C:\Program Files\7-Zip\7z.exe", "C:\Program Files (x86)\7-Zip\7z.exe")
    foreach ($p in $candidates7z) {
        if ($p -and (Test-Path $p)) { $sz = $p; break }
    }
    if ($sz) {
        Write-Host "    method: 7z extraction via $sz"
        & $sz x -y "-o$DestDir" $InstallerPath 2>&1 | Out-Null
        if (Has-MapFiles $DestDir) {
            return @{ Installed = $true; Reason = "7z extracted" }
        }
    }

    # Method 3 (fallback): silent install with /DIR (Inno / NSIS). Last resort
    # because some installers ignore /DIR and silently write to Program Files.
    Write-Host "    method: silent install (Inno/NSIS) - last resort"
    $argSets = @(
        @("/VERYSILENT", "/SUPPRESSMSGBOXES", "/NORESTART", "/NOCANCEL", "/SP-", "/NOICONS", "/DIR=$DestDir"),
        @("/SILENT", "/SUPPRESSMSGBOXES", "/NORESTART", "/DIR=$DestDir"),
        @("/S", "/D=$DestDir"),
        @("-y", "-o$DestDir")
    )
    foreach ($a in $argSets) {
        Write-Host "      try: $($a -join ' ')"
        try {
            Start-Process -FilePath $InstallerPath -ArgumentList $a -Wait -ErrorAction Stop -WindowStyle Hidden | Out-Null
            Start-Sleep -Seconds 1
        } catch { continue }
        if (Has-MapFiles $DestDir) {
            return @{ Installed = $true; Reason = "silent install: $($a[0])" }
        }
    }

    return @{ Installed = $false; Reason = "no extraction method succeeded; manually drop .map files into $DestDir" }
}

function Find-Installer {
    param([string[]] $Candidates)
    foreach ($c in $Candidates) {
        if ($c -and (Test-Path $c)) { return $c }
    }
    return $null
}

# JK2EditingTools (the original April 2002 SDK) -> jk2-sdk/
$jk2sdk = Join-Path $ResourcesRoot "jk2-sdk"
Write-Step "Jedi Outcast SDK (JK2EditingTools.exe) -> $jk2sdk"
if (Has-MapFiles $jk2sdk) {
    Write-Skip "*.map files already present"
} else {
    $jk2Inst = Find-Installer @(
        (Join-Path $ResourcesRoot "JK2EditingTools\JK2EditingTools.exe"),
        (Join-Path $ResourcesRoot "JK2EditingTools.exe"),
        "C:\Users\david\Downloads\JK2EditingTools\JK2EditingTools.exe"
    )
    if ($jk2Inst) {
        $r = Install-JKEditingTool -InstallerPath $jk2Inst -DestDir $jk2sdk
        if ($r.Installed) { Write-Ok "extracted ($($r.Reason))" }
        else { Write-Warn2 "$($r.Reason)" }
    } else {
        Write-Warn2 "JK2EditingTools.exe not found in any standard location"
    }
}

# JK2EditingTools2 (the v2 SDK update, includes more example .map files) -> jka-sdk/
$jkasdk = Join-Path $ResourcesRoot "jka-sdk"
Write-Step "JK2 SDK v2 (JK2EditingTools2.exe) -> $jkasdk"
if (Has-MapFiles $jkasdk) {
    Write-Skip "*.map files already present"
} else {
    $jkaInst = Find-Installer @(
        (Join-Path $ResourcesRoot "JK2EditingTools2\JK2EditingTools2.exe"),
        (Join-Path $ResourcesRoot "JK2EditingTools2.exe"),
        "C:\Users\david\Downloads\JK2EditingTools2\JK2EditingTools2.exe"
    )
    if ($jkaInst) {
        $r = Install-JKEditingTool -InstallerPath $jkaInst -DestDir $jkasdk
        if ($r.Installed) { Write-Ok "extracted ($($r.Reason))" }
        else { Write-Warn2 "$($r.Reason)" }
    } else {
        Write-Warn2 "JK2EditingTools2.exe not found in any standard location"
    }
}

# Index every extracted full-level .map file into a single text file the
# training driver reads. We deliberately exclude /prefabs/ subdirectories;
# those are single-object building blocks (lamps, crates, tie fighters, ...)
# that don't contain their own room geometry and aren't useful to the
# scatter+recompile loop.
$mapsIndex = Join-Path $ResourcesRoot "jk2-sdk-maps.txt"
$allMaps = New-Object System.Collections.Generic.List[string]
$prefabCount = 0
foreach ($d in @($jk2sdk, $jkasdk)) {
    if (Test-Path $d) {
        Get-ChildItem -Path $d -Recurse -Filter "*.map" -ErrorAction SilentlyContinue | ForEach-Object {
            if ($_.FullName -match '\\prefabs\\') {
                $prefabCount++
            } else {
                $allMaps.Add($_.FullName)
            }
        }
    }
}
if ($allMaps.Count -gt 0) {
    Set-Content -Path $mapsIndex -Value $allMaps -Encoding utf8
    Write-Ok "indexed $($allMaps.Count) full-level .map file(s) into $mapsIndex (skipped $prefabCount prefab file(s))"
} else {
    if (Test-Path $mapsIndex) { Remove-Item $mapsIndex }
    Write-Warn2 "no full-level .map files in either SDK; jk2-sdk-maps.txt not written"
}

# ---------------------------------------------------------------------------
# 6. JK2 assets (symlink to an existing extracted dir if available)
# ---------------------------------------------------------------------------
$jk2AssetsDst = Join-Path $ResourcesRoot "jk2-assets"
Write-Step "JK2 assets -> $jk2AssetsDst"
if (-not $Jk2Assets) {
    $candidate = "e:\temp_jk2_0"
    if (Test-Path $candidate) { $Jk2Assets = $candidate }
}
if (Test-Path $jk2AssetsDst) {
    Write-Skip "already present (symlink, junction, or copy)"
} elseif (-not $Jk2Assets -or -not (Test-Path $Jk2Assets)) {
    Write-Warn2 "no JK2 assets dir found. Pass -Jk2Assets <dir-containing-maps-and-pk3s>."
} else {
    Write-Host "    creating junction $jk2AssetsDst -> $Jk2Assets"
    try {
        cmd /c mklink /J "$jk2AssetsDst" "$Jk2Assets" | Out-Null
        if (Test-Path $jk2AssetsDst) { Write-Ok "junction created" } else { throw "mklink reported success but path missing" }
    } catch {
        Write-Warn2 "mklink failed ($($_.Exception.Message)). Falling back to a paths.env entry only; CLI will read assets from $Jk2Assets directly."
    }
}

# ---------------------------------------------------------------------------
# 7. paths.env.ps1 -- dot-source from a shell to set env vars
# ---------------------------------------------------------------------------
$pathsEnv = Join-Path $ResourcesRoot "paths.env.ps1"
Write-Step "paths.env.ps1"
$q3map2  = Join-Path $nrcBin "q3map2.exe"
$assetsResolved = $jk2AssetsDst
if (-not (Test-Path $assetsResolved)) { $assetsResolved = $Jk2Assets }
$content = @"
# auto-generated by scripts/fetch-resources.ps1
# dot-source this file in pwsh to populate env vars used by the BspLightReSlopper tests
# and training scripts.
`$env:BSPLRS_RESOURCES = '$ResourcesRoot'
`$env:BSPLRS_Q3MAP2     = '$q3map2'
`$env:BSPLRS_JK2_ASSETS = '$assetsResolved'
`$env:BSPLRS_JK2_SDK    = '$jk2sdk'
`$env:BSPLRS_JKA_SDK    = '$jkasdk'
`$env:BSPLRS_QUAKE3_SRC = '$q3src'
"@
Set-Content -Path $pathsEnv -Value $content -Encoding utf8
Write-Ok "wrote $pathsEnv"

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
Write-Host ""
Write-Step "summary"
$summary = [ordered]@{
    "BSPLRS_RESOURCES"   = $ResourcesRoot
    "BSPLRS_Q3MAP2"      = $q3map2
    "BSPLRS_JK2_ASSETS"  = $assetsResolved
    "BSPLRS_JK2_SDK"     = $jk2sdk
    "BSPLRS_JKA_SDK"     = $jkasdk
    "BSPLRS_QUAKE3_SRC"  = $q3src
}
foreach ($kv in $summary.GetEnumerator()) {
    $exists = (Test-Path $kv.Value)
    $tag = if ($exists) { "[ok]" } else { "[--]" }
    Write-Host ("  {0,-22} {1} {2}" -f $kv.Key, $tag, $kv.Value)
}
Write-Host ""
Write-Host "to use these in this shell:" -ForegroundColor Cyan
Write-Host "  . '$pathsEnv'" -ForegroundColor Cyan
