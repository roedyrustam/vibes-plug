# ==============================================================================
# Vibes-Plug Universal One-Line Installer (Windows PowerShell)
# Usage:
#   irm https://raw.githubusercontent.com/roedyrustam/vibes-plug/main/install.ps1 | iex
# ==============================================================================

$ErrorActionPreference = 'Stop'

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║    🚀 Vibes-Plug Universal Installer (2026 Edition)      ║" -ForegroundColor Cyan
Write-Host "║    176 Specialized Skills & Sovereign Multi-Agent Swarm  ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# 1. Detect Runtime (Node.js >= 20.x or Bun >= 1.2)
$runtime = $null
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVer = (node -v).TrimStart('v')
    $major = [int]($nodeVer.Split('.')[0])
    if ($major -ge 20) {
        $runtime = 'node'
        Write-Host "✓ Detected Node.js v$nodeVer" -ForegroundColor Green
    } else {
        Write-Host "! Detected Node.js v$nodeVer (Recommended: v20.x or v22.x+ LTS)" -ForegroundColor Yellow
        $runtime = 'node'
    }
} elseif (Get-Command bun -ErrorAction SilentlyContinue) {
    $bunVer = (bun -v)
    $runtime = 'bun'
    Write-Host "✓ Detected Bun v$bunVer" -ForegroundColor Green
} else {
    Write-Host "✗ Error: Neither Node.js (>=20.x) nor Bun was found in PATH." -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org or Bun from https://bun.sh"
    exit 1
}

# 2. Determine Destination
$targetDir = Join-Path $env:USERPROFILE ".gemini\config\plugins\vibes-plug"
Write-Host "📁 Target destination: $targetDir" -ForegroundColor Cyan

# 3. Clone or Update
if (Test-Path (Join-Path $targetDir ".git")) {
    Write-Host "↻ Existing installation found. Pulling latest updates..." -ForegroundColor Yellow
    git -C $targetDir pull --quiet origin main
} else {
    Write-Host "⬇ Cloning repository from GitHub..." -ForegroundColor Green
    $parent = Split-Path $targetDir -Parent
    if (!(Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
    git clone --depth 1 https://github.com/roedyrustam/vibes-plug.git $targetDir
}

# 4. Synchronize Multi-Platform Configurations
Write-Host ""
Write-Host "⚙ Synchronizing cross-IDE agent rules & MCP bridges..." -ForegroundColor Cyan
Push-Location $targetDir
try {
    & $runtime scripts/install.js --all
} finally {
    Pop-Location
}

# 5. Setup Windows vibes.cmd wrapper in User AppData or local bin
$binDir = Join-Path $env:LOCALAPPDATA "Microsoft\WindowsApps"
$cmdWrapper = Join-Path $binDir "vibes.cmd"
$cliTarget = Join-Path $targetDir "bin\vibes.mjs"

$cmdContent = "@echo off`r`nnode `"$cliTarget`" %*`r`n"
try {
    [System.IO.File]::WriteAllText($cmdWrapper, $cmdContent)
    Write-Host "✓ Created CLI wrapper at $cmdWrapper" -ForegroundColor Green
} catch {
    Write-Host "! Could not write to WindowsApps; adding direct path recommendation." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✨ Vibes-Plug successfully installed!" -ForegroundColor Green
Write-Host "⚡ Run 'vibes help' or 'vibes studio' to launch the Studio Cockpit." -ForegroundColor White
Write-Host "🌐 Primary Trigger active across Antigravity, Claude Code, Cursor, Codex, and Windsurf." -ForegroundColor Cyan
Write-Host ""
