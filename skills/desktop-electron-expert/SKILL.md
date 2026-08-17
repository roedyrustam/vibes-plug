---
name: desktop-electron-expert
description: "Expert guide for Electron 33+ desktop application development — Electron Forge, context isolation, IPC security, native menus, auto-updates, and multi-window management / Panduan ahli pengembangan desktop Electron 33+."
author: "vibes-plug-swarm"
---

# Desktop Electron Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **`tauri-expert`**: Comparing Electron vs. Tauri architectures for desktop targets.
- **`senior-frontend`**: React/Vue frontend architecture inside Electron renderers.
- **`ci-cd-devops-architect`**: Multi-platform desktop packaging (Windows MSI/EXE, macOS DMG, Linux AppImage).
- **`error-resilience-expert`**: Crash reporting and main/renderer crash recovery.

### Description
Production guide for engineering secure, high-performance cross-platform desktop applications using Electron 33+. Covers secure IPC communication via `contextBridge`, mandatory Context Isolation and Sandbox modes, native system integrations (tray, notifications, menus, global shortcuts), auto-updates with `electron-updater`, and build automation with Electron Forge / electron-builder.

### Trigger Conditions
- Building desktop apps with web technologies using Electron.
- Hardening Electron security (Context Isolation, Preload scripts, CSP, nodeIntegration: false).
- Implementing typed IPC communication between Main and Renderer processes.
- Setting up auto-update workflows and multi-OS code signing.

---

### Core Security & Architecture Patterns

#### 1. Secure Main Process (`main.ts`)
```typescript
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,       // MANDATORY for security
      nodeIntegration: false,        // NEVER enable in renderer
      sandbox: true,                 // Enable OS-level sandbox
      webSecurity: true,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  // Typed IPC Handlers
  ipcMain.handle('app:get-version', () => app.getVersion());
  ipcMain.handle('file:read-config', async (_event, configName: string) => {
    // Validate arguments safely
    return { name: configName, loaded: true };
  });
});
```

#### 2. Type-Safe Preload Script (`preload.ts`)
```typescript
import { contextBridge, ipcRenderer } from 'electron';

export interface ElectronAPI {
  getVersion: () => Promise<string>;
  readConfig: (name: string) => Promise<any>;
}

const api: ElectronAPI = {
  getVersion: () => ipcRenderer.invoke('app:get-version'),
  readConfig: (name: string) => ipcRenderer.invoke('file:read-config', name),
};

contextBridge.exposeInMainWorld('electronAPI', api);
```

#### 3. Renderer Consumer (`renderer.tsx`)
```tsx
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

import React, { useEffect, useState } from 'react';

export function AppInfo() {
  const [version, setVersion] = useState<string>('');

  useEffect(() => {
    window.electronAPI.getVersion().then(setVersion);
  }, []);

  return <div>App Version: {version}</div>;
}
```

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **`tauri-expert`**: Pemilihan dan perbandingan antara Electron dan Tauri untuk aplikasi desktop.
- **`senior-frontend`**: Integrasi framework frontend (React/Vue) di dalam renderer Electron.
- **`ci-cd-devops-architect`**: Otomasi build installer cross-platform (.exe, .dmg, .AppImage).

### Deskripsi
Panduan produksi untuk membangun aplikasi desktop cross-platform yang aman dan efisien menggunakan Electron 33+. Mengutamakan keamanan IPC dengan Context Isolation, isolasi proses renderer, integrasi sistem natif (system tray, menu, notifikasi), dan alur auto-update otomatis.

### Kondisi Pemicu
- Membangun aplikasi desktop menggunakan teknologi web berbasis Electron.
- Memperketat keamanan Electron (Context Isolation, Sandbox, sanitasi IPC).
- Mengonfigurasi auto-updater dan packaging multi-OS.
