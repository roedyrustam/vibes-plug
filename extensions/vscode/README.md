# VibesPlug Pro: VSCode & Cursor Companion Extension

Turn Visual Studio Code, Cursor IDE, or Windsurf into an autonomous 160-agent software development studio.

*Mengubah VSCode, Cursor IDE, atau Windsurf menjadi studio pengembangan perangkat lunak 160-agen otonom.*

---

## ⚡ Features / Fitur Utama

- **Status Bar Indicator**: Live status displaying `$(zap) VibesPlug: 171 Skills Active`.
- **1-Click Studio Cockpit**: Open the visual web dashboard and Visual DAG Canvas directly from your status bar or Command Palette.
- **Project Scaffolding Wizard**: Launch `vibes wizard` in the integrated terminal to scaffold projects and select custom AI skill bundles.
- **Sovereign Anti-Slop Guard**: Run the complete 294-file Anti-Slop audit and test suite with one keystroke.
- **Active Document Critic**: Right-click any active file to trigger `vibes critic` and inspect Anti-Slop Pillar compliance.
- **Token Economics & FinOps**: View real-time prompt cache savings (KV-Cache 75–90% off) directly in your editor.

---

## 🚀 Installation & Local Packaging / Pemasangan & Pengemasan

### Option A: Local Packaging via `@vscode/vsce`
You can package the extension into a `.vsix` bundle and install it in VSCode, Cursor, or Windsurf:

```bash
# 1. Install vsce globally (if not installed)
npm install -g @vscode/vsce

# 2. Package the extension
cd extensions/vscode
vsce package

# 3. Install in VSCode / Cursor
code --install-extension vibes-plug-companion-4.3.0.vsix
# or in Cursor:
cursor --install-extension vibes-plug-companion-4.3.0.vsix
```

### Option B: Local Development / Debugging
1. Open this directory in VSCode / Cursor.
2. Press `F5` to launch an Extension Development Host window.
3. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and type `VibesPlug:` to run any command.

---

## ⚙️ Configuration Settings

| Setting | Default | Description |
| :--- | :--- | :--- |
| `vibes.studioPort` | `3888` | Port for local Vibes Studio Cockpit web dashboard. |
| `vibes.antiSlopStrictMode` | `true` | Treat all Anti-Slop warnings as fatal errors in CI/local runs. |
| `vibes.defaultReasoningProfile` | `"balanced"` | Default thinking budget profile (`speed`, `balanced`, `deep`, `exhaustive`). |
