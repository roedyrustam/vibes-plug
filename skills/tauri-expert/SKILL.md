---
name: tauri-expert
description: "Expert skill for Tauri (v2) development, covering Rust backend, IPC, security (capabilities/plugins), and frontend integration."
author: "Roedy Rustam"
---

# Tauri Expert

## Deskripsi
Skill ini memberikan panduan praktik terbaik (best practices) untuk membangun aplikasi desktop dan mobile lintas platform menggunakan Tauri (terutama Tauri v2). Skill ini mencakup integrasi frontend dengan backend Rust, Inter-Process Communication (IPC), manajemen state, serta keamanan.

## Instruksi & Best Practices Tauri

1. **Arsitektur & IPC (Inter-Process Communication)**
   - Gunakan `tauri::command` untuk mendefinisikan fungsi Rust yang bisa dipanggil dari frontend.
   - Panggil fungsi Rust dari frontend menggunakan `@tauri-apps/api/core` (`invoke`).
   - Jangan gunakan polling jika tidak perlu; manfaatkan sistem *event* Tauri (`emit` dari Rust, `listen` di frontend) untuk pembaruan *real-time* atau asinkron dari backend.
   - Usahakan operasi berat dan pemrosesan file dilakukan di sisi Rust (backend), sedangkan frontend hanya fokus pada UI.

2. **Manajemen State (Rust Backend)**
   - Gunakan `tauri::State` untuk menyimpan dan mengelola state global di backend Rust.
   - Gunakan `std::sync::Mutex` atau `tokio::sync::Mutex` (jika asinkron) untuk state yang bisa berubah (mutable state).
   - Selalu *manage* state tersebut pada saat setup aplikasi: `tauri::Builder::default().manage(MyState::default())`.

3. **Keamanan (Security & Capabilities)**
   - Terapkan isolasi konteks secara ketat.
   - Di Tauri v2, gunakan sistem **Capabilities** untuk membatasi akses API per jendela/plugin.
   - Jangan pernah mengekspos API filesystem, shell, atau jaringan yang berbahaya secara global. Hanya beri akses (`allowlist`) ke path atau perintah (commands) yang spesifik dan dibutuhkan.

4. **Kinerja & Asinkronisitas**
   - Gunakan `async fn` pada `tauri::command` untuk I/O yang berat agar tidak memblokir *main thread*. Jika menggunakan `std::fs`, pertimbangkan untuk menggunakan `tokio::fs`.
   - Gunakan `serde` (`Serialize`, `Deserialize`) secara efisien untuk mengirim struktur data kompleks antara Rust dan frontend.

5. **Pengelolaan Plugin (Tauri v2)**
   - Gunakan ekosistem plugin Tauri (seperti `tauri-plugin-fs`, `tauri-plugin-store`, `tauri-plugin-dialog`) alih-alih membuat modul I/O sendiri jika sudah tersedia.
   - Selalu inisialisasi plugin di file `main.rs` atau `lib.rs`: `app.plugin(tauri_plugin_dialog::init())`.

6. **Cross-Platform & Build**
   - Hindari *hardcode* path sistem operasi (seperti `C:\` atau `/home/`). Gunakan `app_handle.path()` resolver untuk direktori AppData, Cache, dll.
   - Pastikan dependencies di `Cargo.toml` mendukung *cross-compilation* (Windows, macOS, Linux, iOS, Android).

## Kondisi Pemicu
Aktif saat:
- Membangun, men-debug, atau melakukan *refactoring* pada aplikasi Tauri.
- Menulis sistem IPC antara frontend (React/Svelte/Vue) dan backend Rust.
- Mengonfigurasi keamanan (`tauri.conf.json`, capabilities, permission).
