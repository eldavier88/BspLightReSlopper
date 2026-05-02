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
# 4. JK2 SDK (example .map files for Phase B)
# ---------------------------------------------------------------------------
$jk2sdk = Join-Path $ResourcesRoot "jk2-sdk"
Write-Step "Jedi Outcast SDK -> $jk2sdk"
$jk2sdkUrls = @(
    "https://jkhub.org/files/file/3552-jedi-outcast-sdk/"
    "https://jkhub.org/files/file/3551-jk2-sdk/"
)
function Has-MapFiles($dir) {
    if (-not (Test-Path $dir)) { return $false }
    return (Get-ChildItem -Path $dir -Recurse -Filter "*.map" -ErrorAction SilentlyContinue | Select-Object -First 1) -ne $null
}
if (Has-MapFiles $jk2sdk) {
    Write-Skip "*.map files already present"
} elseif ($SkipNetwork) {
    Write-Skip "-SkipNetwork: not downloading"
} else {
    Write-Warn2 "automated download of the Raven JK2 SDK is unreliable; mirrors below typically need a browser."
    foreach ($u in $jk2sdkUrls) { Write-Host "      $u" }
    Write-Warn2 "if you have the SDK zip, drop it next to this folder and re-extract manually,"
    Write-Warn2 "or place the .map files into $jk2sdk\maps\."
    if (-not (Test-Path $jk2sdk)) { New-Item -ItemType Directory -Path $jk2sdk | Out-Null }
}

# ---------------------------------------------------------------------------
# 5. JKA SDK (example .map files for Phase B)
# ---------------------------------------------------------------------------
$jkasdk = Join-Path $ResourcesRoot "jka-sdk"
Write-Step "Jedi Academy SDK -> $jkasdk"
$jkasdkUrls = @(
    "https://jkhub.org/files/file/2118-jedi-academy-sdk/"
)
if (Has-MapFiles $jkasdk) {
    Write-Skip "*.map files already present"
} elseif ($SkipNetwork) {
    Write-Skip "-SkipNetwork: not downloading"
} else {
    Write-Warn2 "automated download of the Raven JKA SDK is unreliable; mirrors below typically need a browser."
    foreach ($u in $jkasdkUrls) { Write-Host "      $u" }
    Write-Warn2 "if you have the SDK zip, drop it next to this folder and re-extract manually,"
    Write-Warn2 "or place the .map files into $jkasdk\maps\."
    if (-not (Test-Path $jkasdk)) { New-Item -ItemType Directory -Path $jkasdk | Out-Null }
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
