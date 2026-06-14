# Changelog / Catatan Perubahan

All notable changes to this project will be documented in this file.
*Semua perubahan penting pada proyek ini akan didokumentasikan dalam berkas ini.*

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
*Format ini didasarkan pada [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), dan proyek ini mematuhi [Semantic Versioning](https://semver.org/spec/v2.0.0.html).*

---

## [1.3.6] - 2026-06-14

### Changed / Diubah
- Cleaned up obsolete metadata fields (`github:`, `risk:`, `source:`, and `date_added:`) from all skill definition files in the repository.
  *(Membersihkan bidang metadata usang (`github:`, `risk:`, `source:`, dan `date_added:`) dari seluruh berkas definisi skill di repositori.)*

## [1.3.5] - 2026-06-14

### Changed / Diubah
- Added header banner image `banner.png` to the top of `README.md`.
  *(Menambahkan gambar banner header `banner.png` di bagian atas `README.md`.)*

## [1.3.4] - 2026-06-14

### Added / Ditambahkan
- Added `scalability-clean-code` skill module outlining clean coding guidelines (SOLID, readability, DRY, KISS) and scalability architecture principles (Clean Architecture, decoupling, caching, database scale).
  *(Menambahkan modul skill `scalability-clean-code` yang menguraikan pedoman kode bersih (SOLID, readability, DRY, KISS) dan prinsip arsitektur skalabilitas (Clean Architecture, decoupling, caching, database scale).)*

## [1.3.3] - 2026-06-14

### Added / Ditambahkan
- Added `tailwind-expert` skill module detailing Tailwind CSS v4 CSS-first configuration, OKLCH theme variables, responsive design rules, state modifiers, custom utilities, bundle optimization, and class merging.
  *(Menambahkan modul skill `tailwind-expert` yang merinci konfigurasi CSS-first Tailwind CSS v4, variabel tema OKLCH, aturan desain responsif, modifikator status, utilitas kustom, optimasi bundle, dan penggabungan kelas.)*

## [1.3.2] - 2026-06-14

### Added / Ditambahkan
- Added `firebase-security-expert` skill module for Firebase security checks, including Firestore/Storage/Realtime Database rules, Service Account safety, GCP API key restrictions, and App Check.
  *(Menambahkan modul skill `firebase-security-expert` untuk pemeriksaan keamanan Firebase, termasuk aturan Firestore/Storage/Realtime Database, keamanan Service Account, pembatasan API key GCP, dan App Check.)*

## [1.3.1] - 2026-06-14

### Added / Ditambahkan
- Added `CONTRIBUTING.md` containing detailed contribution guidelines for fork developers to create and submit new skills.
  *(Menambahkan `CONTRIBUTING.md` yang berisi panduan kontribusi terperinci bagi pengembang fork untuk membuat dan mengirimkan skill baru.)*

### Changed / Diubah
- Synced the metadata version in `plugin.json` to match the project version of `1.3.1`.
  *(Menyelaraskan versi metadata di `plugin.json` agar sesuai dengan versi proyek `1.3.1`.)*

## [1.3.0] - 2026-06-12

### Added / Ditambahkan
- Added `token-saver` skill to enforce concise AI responses and minimal codebase rewrites.
  *(Menambahkan skill `token-saver` untuk memaksakan respons AI yang ringkas dan meminimalkan penulisan ulang kode.)*
- Added `tauri-expert` skill outlining Tauri v2 best practices, IPC communication, and security capabilities.
  *(Menambahkan skill `tauri-expert` yang menguraikan praktik terbaik Tauri v2, komunikasi IPC, dan kemampuan keamanan.)*
- Added `prd-architect` skill serving as a mandatory guardrail to generate and validate Product Requirements Documents (PRD) before generating code for new projects.
  *(Menambahkan skill `prd-architect` yang berfungsi sebagai guardrail wajib untuk membuat dan memvalidasi Product Requirements Document (PRD) sebelum menghasilkan kode untuk proyek baru.)*

### Changed / Diubah
- Standardized all 23 skill metadata (frontmatter) formats across the plugin.
  *(Menstandardisasi semua 23 format metadata (frontmatter) skill di seluruh plugin.)*
- Standardized the trigger header to `## Kondisi Pemicu` in all skills.
  *(Menstandardisasi header pemicu menjadi `## Kondisi Pemicu` di semua skill.)*
- Broadly updated technical relevance in existing skills (bumped to React 19, Next.js 15, Tailwind v4, TanStack Query v5, Bun v1.1+).
  *(Memperbarui relevansi teknis secara luas pada skill yang ada (ditingkatkan ke React 19, Next.js 15, Tailwind v4, TanStack Query v5, Bun v1.1+).)*
- Fixed markdown script paths in `ui-ux-pro-max` and emoji encoding issues in `ui_ux_expert`.
  *(Memperbaiki path skrip markdown di `ui-ux-pro-max` dan masalah pengkodean emoji di `ui_ux_expert`.)*

## [1.2.6] - 2026-05-24

### Added / Ditambahkan
- Created a new `rust-programming-expert` skill module for Rust programming (Rust 2024 / v1.85+).
  *(Membuat modul skill baru `rust-programming-expert` untuk pemrograman Rust (Rust 2024 / v1.85+).)*

## [1.2.5] - 2026-05-24

### Added / Ditambahkan
- Created a new `bun-runtime-expert` skill module for Bun runtime (v1.3+).
  *(Membuat modul skill baru `bun-runtime-expert` untuk runtime Bun (v1.3+).)*

## [1.2.4] - 2026-05-24

### Changed / Diubah
- Updated the `brainstorming` skill with 2026 modern web architecture guidance.
  *(Memperbarui skill `brainstorming` dengan panduan arsitektur web modern 2026.)*

## [1.2.3] - 2026-05-24

### Changed / Diubah
- Updated the `senior-frontend` skill to target React 19 / Next.js 15 / Tailwind CSS v4.
  *(Memperbarui skill `senior-frontend` untuk menargetkan React 19 / Next.js 15 / Tailwind CSS v4.)*

## [1.2.2] - 2026-05-24

### Changed / Diubah
- Comprehensively updated the `senior-fullstack` skill with professional, production-grade architectural guidance and code.
  *(Memperbarui secara komprehensif skill `senior-fullstack` dengan panduan arsitektur dan kode tingkat produksi profesional.)*

## [1.2.1] - 2026-05-24

### Changed / Diubah
- Updated the `saas-mvp-launcher` skill file with state-of-the-art 2026 patterns.
  *(Memperbarui file skill `saas-mvp-launcher` dengan pola mutakhir 2026.)*
