#!/usr/bin/env bash
# ==============================================================================
# Vibes-Plug Universal One-Line Installer (Linux / macOS / WSL)
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/roedyrustam/vibes-plug/main/install.sh | bash
# ==============================================================================

set -euo pipefail

BOLD="\033[1m"
GREEN="\033[32m"
CYAN="\033[36m"
YELLOW="\033[33m"
RED="\033[31m"
RESET="\033[0m"

echo -e "${BOLD}${CYAN}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║    🚀 Vibes-Plug Universal Installer (2026 Edition)      ║"
echo "║    176 Specialized Skills & Sovereign Multi-Agent Swarm  ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${RESET}"

# 1. Detect Runtime (Node.js >= 20.x or Bun >= 1.2)
RUNTIME=""
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node -v | sed 's/v//')
    NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)
    if [ "$NODE_MAJOR" -ge 20 ]; then
        RUNTIME="node"
        echo -e "${GREEN}✓ Detected Node.js v${NODE_VERSION}${RESET}"
    else
        echo -e "${YELLOW}! Detected Node.js v${NODE_VERSION} (Recommended: v20.x or v22.x+ LTS)${RESET}"
        RUNTIME="node"
    fi
elif command -v bun >/dev/null 2>&1; then
    BUN_VERSION=$(bun -v)
    RUNTIME="bun"
    echo -e "${GREEN}✓ Detected Bun v${BUN_VERSION}${RESET}"
else
    echo -e "${RED}✗ Error: Neither Node.js (>=20.x) nor Bun was found.${RESET}"
    echo "Please install Node.js from https://nodejs.org or Bun from https://bun.sh"
    exit 1
fi

# 2. Determine Target Directory
TARGET_DIR="${HOME}/.gemini/config/plugins/vibes-plug"
echo -e "${CYAN}📁 Target destination: ${TARGET_DIR}${RESET}"

# 3. Clone or Update Repository
if [ -d "${TARGET_DIR}/.git" ]; then
    echo -e "${YELLOW}↻ Existing installation found. Pulling latest updates...${RESET}"
    git -C "${TARGET_DIR}" pull --quiet origin main || git -C "${TARGET_DIR}" pull --quiet
else
    echo -e "${GREEN}⬇ Cloning repository from GitHub...${RESET}"
    mkdir -p "$(dirname "${TARGET_DIR}")"
    git clone --depth 1 https://github.com/roedyrustam/vibes-plug.git "${TARGET_DIR}"
fi

# 4. Synchronize Multi-Platform Configurations
echo -e "\n${CYAN}⚙ Synchronizing cross-IDE agent rules & MCP bridges...${RESET}"
(cd "${TARGET_DIR}" && $RUNTIME scripts/install.js --all)

# 5. Setup Global 'vibes' CLI Command Symlink
BIN_DIR="${HOME}/.local/bin"
mkdir -p "${BIN_DIR}"
CLI_LINK="${BIN_DIR}/vibes"

rm -f "${CLI_LINK}"
ln -sf "${TARGET_DIR}/bin/vibes.mjs" "${CLI_LINK}"
chmod +x "${TARGET_DIR}/bin/vibes.mjs" "${CLI_LINK}"

echo -e "\n${GREEN}✓ Created CLI link at ${CLI_LINK}${RESET}"

# Verify PATH
if [[ ":$PATH:" != *":${BIN_DIR}:"* ]]; then
    echo -e "${YELLOW}ℹ Tip: Add ${BIN_DIR} to your PATH in ~/.bashrc or ~/.zshrc:${RESET}"
    echo "  export PATH=\"\$HOME/.local/bin:\$PATH\""
fi

echo -e "\n${BOLD}${GREEN}✨ Vibes-Plug successfully installed!${RESET}"
echo -e "⚡ Run ${BOLD}vibes help${RESET} or ${BOLD}vibes studio${RESET} to launch the Studio Cockpit."
echo -e "🌐 Primary Trigger active across Antigravity, Claude Code, Cursor, Codex, and Windsurf.\n"
