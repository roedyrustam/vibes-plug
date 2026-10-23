---
name: tauri-expert
description: "Expert guide for Tauri 2.x / 2.12+ cross-platform desktop and mobile development: Rust 1.90+ MSRV, IPC Channel streaming, on_permission_request handlers, App-Bound domains, and Capabilities security / Panduan ahli pengembangan desktop dan mobile Tauri 2.x / 2.12+."
author: "Roedy Rustam"
version: "4.4.2"

---

# Tauri Expert (Tauri 2.12+ Desktop & Mobile Architecture)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills:
- `rust-programming-expert` — Writing memory-safe, asynchronous Rust commands, Tokio tasks, and state backends.
- `senior-frontend` — Building lightweight React 19 / Vite UI frontends for Tauri.
- `design-system-architect` — Desktop UI design systems, custom window titlebars, and native OS theming.
- `ui-ux-pro-max` — Desktop window ergonomics, system tray menus, and native keyboard shortcuts.
- `visual-ui-auditor` — Multimodal vision auditing of rendered desktop window frames and dialogs.
- `anti-slop` — Anti-slop desktop UI craft, zero fake browser window frames and zero placeholder commands.
- `production-ready-hardener` — Auditing binary sizes, code signing, and release pipeline hardening.
- `desktop-electron-expert` & `browser-extension-mv3-pro` — Migrating legacy Electron apps to Tauri v2 and bridging native desktop binaries with Manifest V3 browser companion extensions.

### Description
Production-grade guidance for building cross-platform desktop (Windows 10/11, macOS, Linux) and mobile (iOS 16+, Android 10+) applications using **Tauri 2.x (specifically v2.12+)**. Covers Rust 1.90+ MSRV requirements, **`tauri::ipc::Channel<T>`** for ordered bidirectional streaming, **`on_permission_request`** programmatic security gates, **App-Bound Domain navigation limiting**, portable application directory overrides (`appDirectoriesOverride`), Rust-side `convert_file_src`, and the fine-grained **Capabilities & Permissions** system.

### Instructions & Best Practices

#### 1. Architecture & Streaming IPC (`tauri::ipc::Channel`)
- Use `#[tauri::command]` for discrete request-response commands.
- For streaming long-running jobs (AI token generation, file download progress, database indexing), use **`tauri::ipc::Channel<T>`** passed as a command argument:
  - Channels deliver messages strictly in order directly to the caller.
  - Keeps the global event bus (`emit` / `listen`) uncluttered and avoids global memory leaks.
- For raw binary streams without JSON serialization overhead, send `tauri::ipc::InvokeResponseBody::Raw(Vec<u8>)`.

#### 2. Native Webview Security Gates (Tauri 2.12+)
- **Permission Request Handler (`on_permission_request`)**: Intercept native webview permission requests (Camera, Microphone, Geolocation, Notifications) in Rust using `WebviewWindowBuilder::on_permission_request` or `WebviewBuilder::on_permission_request`. Evaluate app state before granting or denying.
- **App-Bound Domains**: Lock webview navigation strictly to trusted external domains using `limit_navigations_to_app_bound_domains` in Rust or `limitNavigationsToAppBoundDomains` in `tauri.conf.json`.
- **Context Isolation & Capabilities**: Never expose unrestricted system APIs. Define least-privilege capability files in `src-tauri/capabilities/*.json`.

#### 3. State Management & Concurrency
- Store global application state in the Rust backend using `tauri::State<T>`.
- Use `tokio::sync::Mutex` or `std::sync::RwLock` for mutable state.
- Initialize managed state during application setup: `tauri::Builder::default().manage(AppState::new())`.

#### 4. Portable Application Support (`appDirectoriesOverride`)
- In Tauri 2.12+, configure `app > appDirectoriesOverride` in `tauri.conf.json` or mutate `Context::config_mut` at runtime to direct app data, configs, and cache relative to the executable (`$EXE_DIR`). This enables portable zero-installer distribution.
- Use `app_handle.path()` resolver APIs instead of hardcoded paths across platforms.

#### 5. Plugin Ecosystem & Native Integration
- Rely on official Tauri plugins (`@tauri-apps/plugin-fs`, `@tauri-apps/plugin-store`, `@tauri-apps/plugin-dialog`, `@tauri-apps/plugin-notification`).
- For app exit, use the core-level `exit` from `@tauri-apps/api/app` backed by permission `core:app:allow-exit` without requiring third-party process plugins.

### Trigger Conditions
Activate this skill when:
- Building, debugging, or refactoring desktop or mobile applications with Tauri v2.
- Implementing streaming IPC pipelines with `tauri::ipc::Channel`.
- Configuring webview permissions, App-Bound domains, or capabilities (`src-tauri/capabilities/`).
- Setting up portable application directories or cross-platform builds.

---

### Implementation Examples

#### 1. Rust Backend Command & Streaming Handler (`src-tauri/src/lib.rs`)
```rust
use serde::{Deserialize, Serialize};
use tauri::{
    ipc::Channel,
    Manager, WebviewUrl, WebviewWindowBuilder,
};

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProgressPayload {
    pub step: u32,
    pub total: u32,
    pub message: String,
}

#[derive(Serialize, Deserialize)]
pub struct MetricsPayload {
    pub cpu_usage: f32,
    pub memory_used_mb: u64,
}

#[tauri::command]
pub async fn fetch_system_metrics() -> Result<MetricsPayload, String> {
    Ok(MetricsPayload {
        cpu_usage: 12.4,
        memory_used_mb: 2048,
    })
}

// Tauri v2.12+ Streaming IPC Channel pattern
#[tauri::command]
pub async fn start_streaming_task(
    task_name: String,
    on_progress: Channel<ProgressPayload>,
) -> Result<String, String> {
    let total_steps = 5;
    for step in 1..=total_steps {
        tokio::time::sleep(tokio::time::Duration::from_millis(150)).await;
        let payload = ProgressPayload {
            step,
            total: total_steps,
            message: format!("Processing {} (step {}/{})", task_name, step, total_steps),
        };
        on_progress.send(payload).map_err(|err| err.to_string())?;
    }
    Ok(format!("Task '{}' completed successfully", task_name))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // Tauri 2.12+ Window creation with Permission Request Handler
            let main_window = WebviewWindowBuilder::new(
                app,
                "main",
                WebviewUrl::App("index.html".into()),
            )
            .title("Sovereign Tauri Desktop")
            .inner_size(1024.0, 768.0)
            .on_permission_request(|_webview, request| {
                println!("Webview requested permission: {:?}", request.permission());
                tauri::webview::PermissionState::Granted
            })
            .build()?;

            #[cfg(debug_assertions)]
            main_window.open_devtools();

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            fetch_system_metrics,
            start_streaming_task
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

#### 2. Frontend TypeScript Invocation with Channel (`src/lib/streaming.ts`)
```typescript
import { Channel, invoke } from '@tauri-apps/api/core';

export interface ProgressPayload {
  step: number;
  total: number;
  message: string;
}

export interface MetricsPayload {
  cpu_usage: number;
  memory_used_mb: number;
}

export async function getSystemMetrics(): Promise<MetricsPayload> {
  return await invoke<MetricsPayload>('fetch_system_metrics');
}

// Tauri v2.12+ Typed Channel streaming consumption
export async function runStreamingTask(
  taskName: string,
  onProgressUpdate: (progress: ProgressPayload) => void
): Promise<string> {
  const channel = new Channel<ProgressPayload>();

  channel.onmessage = (payload) => {
    onProgressUpdate(payload);
  };

  return await invoke<string>('start_streaming_task', {
    taskName,
    onProgress: channel,
  });
}
```

#### 3. Tauri v2 Granular Capability Definition (`src-tauri/capabilities/default.json`)
```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "Default capability envelope for main application window",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "core:app:allow-exit",
    "core:window:allow-set-title",
    "core:window:allow-set-fullscreen"
  ]
}
```

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan:
- `rust-programming-expert` — Penulisan perintah Rust asinkron yang aman memori, task Tokio, dan backend state.
- `senior-frontend` — Pembuatan frontend UI React 19 / Vite yang ringan untuk Tauri.
- `design-system-architect` — Sistem desain UI desktop, titlebar jendela kustom, dan theming OS native.
- `ui-ux-pro-max` — Ergonomi antarmuka desktop, menu system tray, dan pintasan keyboard native.
- `visual-ui-auditor` — Audit visual multimodal untuk bingkai jendela desktop dan dialog yang dirender.
- `anti-slop` — Penegakan UI desktop anti-slop, nol bingkai browser palsu, dan nol perintah placeholder.
- `production-ready-hardener` — Audit ukuran biner, code signing, dan pipeline rilis siap produksi.

### Deskripsi
Panduan produksi untuk membangun aplikasi desktop (Windows 10/11, macOS, Linux) dan mobile (iOS 16+, Android 10+) berperforma tinggi menggunakan **Tauri 2.x (terutama v2.12+)**. Mencakup standar MSRV Rust 1.90+, **`tauri::ipc::Channel<T>`** untuk streaming bidirectional terurut, **`on_permission_request`** untuk gerbang keamanan native, pembatasan navigasi **App-Bound Domains**, override direktori aplikasi portabel (`appDirectoriesOverride`), konversi file lokal di sisi Rust via `convert_file_src`, serta sistem **Capabilities & Permissions**.

### Instruksi & Praktik Terbaik

#### 1. Arsitektur & Streaming IPC (`tauri::ipc::Channel`)
- Gunakan `#[tauri::command]` untuk pola permintaan-respons standar (*request-response*).
- Untuk tugas jangka panjang yang membutuhkan streaming progres (seperti unduhan file, inferensi AI token per token, atau indeks database), gunakan **`tauri::ipc::Channel<T>`** yang dilewatkan sebagai parameter command:
  - Channel menjamin urutan pesan langsung ke pemanggil spesifik.
  - Menghindari penumpukan listener pada event bus global (`emit` / `listen`) yang rawan kebocoran memori.
- Untuk streaming data biner mentah tanpa overhead serialisasi JSON, gunakan `tauri::ipc::InvokeResponseBody::Raw(Vec<u8>)`.

#### 2. Gerbang Keamanan Webview Native (Tauri 2.12+)
- **Permission Request Handler (`on_permission_request`)**: Tangani permintaan izin webview native (Kamera, Mikrofon, Lokasi, Notifikasi) langsung di Rust menggunakan `WebviewWindowBuilder::on_permission_request`. Evaluasi status aplikasi sebelum memberikan izin (`Granted`) atau menolak (`Denied`).
- **App-Bound Domains**: Kunci navigasi webview agar hanya mengakses domain tepercaya melalui `limit_navigations_to_app_bound_domains` di Rust atau `limitNavigationsToAppBoundDomains` di `tauri.conf.json`.
- **Isolasi Konteks & Capabilities**: Jangan pernah mengekspos API sistem tanpa batas. Tentukan kapabilitas berbasis hak istimewa terkecil (*least-privilege*) di `src-tauri/capabilities/*.json`.

#### 3. Manajemen State & Konkurensi
- Simpan state global aplikasi di backend Rust menggunakan `tauri::State<T>`.
- Gunakan `tokio::sync::Mutex` atau `std::sync::RwLock` untuk state yang dapat berubah (*mutable state*).
- Daftarkan state saat inisialisasi aplikasi: `tauri::Builder::default().manage(AppState::new())`.

#### 4. Aplikasi Portabel & Override Direktori (`appDirectoriesOverride`)
- Pada Tauri 2.12+, gunakan konfigurasi `app > appDirectoriesOverride` di `tauri.conf.json` atau ubah `Context::config_mut` saat runtime agar data aplikasi, konfigurasi, dan cache disimpan relatif terhadap direktori biner eksekusi (`$EXE_DIR`). Pola ini memungkinkan distribusi aplikasi portabel tanpa installer.
- Gunakan resolver `app_handle.path()` alih-alih jalur sistem operasi yang ditulis statis (*hardcoded*).

#### 5. Ekosistem Plugin & Integrasi Native
- Manfaatkan plugin resmi Tauri (`@tauri-apps/plugin-fs`, `@tauri-apps/plugin-store`, `@tauri-apps/plugin-dialog`, `@tauri-apps/plugin-notification`).
- Untuk keluar dari aplikasi, gunakan fungsi bawaan `exit` dari `@tauri-apps/api/app` yang didukung oleh izin `core:app:allow-exit` tanpa perlu plugin pihak ketiga.

### Kondisi Pemicu
Aktif saat:
- Membangun, men-debug, atau merefaktor aplikasi desktop atau mobile dengan Tauri v2.
- Mengimplementasikan pipeline streaming IPC dengan `tauri::ipc::Channel`.
- Mengonfigurasi perizinan webview, App-Bound domains, atau file kapabilitas (`src-tauri/capabilities/`).
- Menyiapkan direktori aplikasi portabel atau kompilasi lintas platform.

---

### Contoh Implementasi

#### 1. Definisi Command & Streaming Handler Rust (`src-tauri/src/lib.rs`)
```rust
use serde::{Deserialize, Serialize};
use tauri::{
    ipc::Channel,
    Manager, WebviewUrl, WebviewWindowBuilder,
};

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProgressPayload {
    pub step: u32,
    pub total: u32,
    pub message: String,
}

#[derive(Serialize, Deserialize)]
pub struct MetricsPayload {
    pub cpu_usage: f32,
    pub memory_used_mb: u64,
}

#[tauri::command]
pub async fn fetch_system_metrics() -> Result<MetricsPayload, String> {
    Ok(MetricsPayload {
        cpu_usage: 12.4,
        memory_used_mb: 2048,
    })
}

// Pola Streaming IPC Channel Tauri v2.12+
#[tauri::command]
pub async fn start_streaming_task(
    task_name: String,
    on_progress: Channel<ProgressPayload>,
) -> Result<String, String> {
    let total_steps = 5;
    for step in 1..=total_steps {
        tokio::time::sleep(tokio::time::Duration::from_millis(150)).await;
        let payload = ProgressPayload {
            step,
            total: total_steps,
            message: format!("Memproses {} (tahap {}/{})", task_name, step, total_steps),
        };
        on_progress.send(payload).map_err(|err| err.to_string())?;
    }
    Ok(format!("Tugas '{}' selesai dengan sukses", task_name))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // Inisialisasi jendela Tauri 2.12+ dengan Permission Request Handler
            let main_window = WebviewWindowBuilder::new(
                app,
                "main",
                WebviewUrl::App("index.html".into()),
            )
            .title("Sovereign Tauri Desktop")
            .inner_size(1024.0, 768.0)
            .on_permission_request(|_webview, request| {
                println!("Izin webview diminta: {:?}", request.permission());
                tauri::webview::PermissionState::Granted
            })
            .build()?;

            #[cfg(debug_assertions)]
            main_window.open_devtools();

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            fetch_system_metrics,
            start_streaming_task
        ])
        .run(tauri::generate_context!())
        .expect("terjadi kesalahan saat menjalankan aplikasi tauri");
}
```

#### 2. Pemanggilan Frontend TypeScript dengan Channel (`src/lib/streaming.ts`)
```typescript
import { Channel, invoke } from '@tauri-apps/api/core';

export interface ProgressPayload {
  step: number;
  total: number;
  message: string;
}

export interface MetricsPayload {
  cpu_usage: number;
  memory_used_mb: number;
}

export async function getSystemMetrics(): Promise<MetricsPayload> {
  return await invoke<MetricsPayload>('fetch_system_metrics');
}

// Konsumsi streaming Channel terketik pada Tauri v2.12+
export async function runStreamingTask(
  taskName: string,
  onProgressUpdate: (progress: ProgressPayload) => void
): Promise<string> {
  const channel = new Channel<ProgressPayload>();

  channel.onmessage = (payload) => {
    onProgressUpdate(payload);
  };

  return await invoke<string>('start_streaming_task', {
    taskName,
    onProgress: channel,
  });
}
```

#### 3. Definisi Kapabilitas Rinci Tauri v2 (`src-tauri/capabilities/default.json`)
```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "Ambang kapabilitas default untuk jendela aplikasi utama",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "core:app:allow-exit",
    "core:window:allow-set-title",
    "core:window:allow-set-fullscreen"
  ]
}
```