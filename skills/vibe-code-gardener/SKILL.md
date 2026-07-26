---
name: vibe-code-gardener
description: "Purger of AI slop, code bloat, context drift, and architectural decay in vibe-coded projects / Pembersih AI slop, kode membengkak, konteks drift, dan pembusukan arsitektur pada proyek vibe coding."
author: "Roedy Rustam"
---

# Vibe Code Gardener & AI Slop Purger

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
In **Vibe Coding**, developers generate code rapidly using natural language without writing every line manually. However, fast iteration inevitably leads to **"Vibe Decay"**—codebase bloat, duplicate helpers, `any` type masking, unused dependencies, oversized 1000-line single-file components, and subtle logic drift.

**`vibe-code-gardener`** is a specialized protocol designed to prune, sanitize, and refactor AI-generated codebases back to production-grade quality without breaking existing vibes or features.

### Core Pillars of Vibe Gardening

#### 1. AI Slop Detection & Purging
- **Duplicate Helper Neutralization**: Scans for redundant functions created across iterations (e.g., `formatDate`, `formatTimestamp`, `dateFormatter`). Merges them into a single utility file.
- **Debug Artifact Cleanup**: Removes leftover `console.log`, `debugger`, `print()`, or temporary test data scattered during vibe debugging sessions.
- **Phantom Dependency Audit**: Identifies npm/pip packages installed for tiny tasks that can easily be written natively.

#### 2. File De-bloating & Modularization
- **500-Line Rule**: Detects monolithic component files spawned during fast prompting.
- **Smart Extraction**: Splits monster files into logical sub-components, custom hooks, and type definitions without breaking imports.

#### 3. Type & Safety Restoration
- **Un-masking `any` & `@ts-nocheck`**: Replaces loose `any` types and suppressed errors with strict, explicit TypeScript interfaces or Python type hints.
- **Contract Verification**: Ensures function signatures match across caller sites, catching broken parameters caused by context window limits.

#### 4. Vibe Drift Guardrail
- **Regression Check**: Verifies that recent prompt iterations did not accidentally delete or overwrite previously working features.
- **State Integrity**: Ensures local UI state hasn't leaked into global state or created unhandled side-effects.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Dalam dunia **Vibe Coding**, developer membuat aplikasi dengan cepat menggunakan bahasa alami tanpa menulis kode baris demi baris secara manual. Namun, iterasi cepat ini selalu memicu **"Vibe Decay" (Pembusukan Vibe)**—kode membengkak, helper ganda, penutupan *type check* dengan `any`/`@ts-nocheck`, paket dependencies hantu, komponen tunggal raksasa 1000+ baris, serta pergeseran logika (*context drift*).

**`vibe-code-gardener`** adalah protokol khusus untuk merapikan, membersihkan, dan merefaktor *codebase* hasil *vibe coding* kembali ke standar kualitas produksi tanpa merusak fitur yang sudah berjalan.

### Pilar Utama Vibe Gardening

#### 1. Deteksi & Pembersihan AI Slop
- **Pembersihan Helper Ganda**: Menemukan fungsi redundan yang dibuat berulang di berbagai iterasi (contoh: `formatDate`, `formatTimestamp`, `dateFormatter`). Memusatkannya ke satu file utility.
- **Pembersihan Artefak Debug**: Menghapus sisa `console.log`, `debugger`, `print()`, atau *mock data* sementara yang tertinggal saat debugging.
- **Audit Dependencies Hantu**: Mendeteksi paket npm/pip yang di-install hanya untuk tugas 3 baris yang sebenarnya bisa ditulis secara *native*.

#### 2. Dekomposisi File Raksasa (File De-bloating)
- **Aturan 500 Baris**: Menemukan file komponen monolitik yang membengkak karena *prompting* cepat.
- **Ekstraksi Cerdas**: Memecah file raksasa menjadi sub-komponen, *custom hooks*, dan tipe data yang rapi tanpa merusak integrasi.

#### 3. Pemulihan Tipe & Keamanan Kode
- **Membuka Masker `any` & `@ts-nocheck`**: Mengganti tipe `any` dan penekanan error dengan *interface* TypeScript yang ketat atau *type hints* Python.
- **Verifikasi Kontrak API**: Memastikan *signature* fungsi cocok di semua lokasi pemanggilan.

#### 4. Guardrail Pergeseran Logika (Vibe Drift)
- **Cek Regresi Fitur**: Memastikan iterasi *prompt* terbaru tidak secara tidak sengaja menghapus atau mengubah fitur yang sebelumnya sudah berfungsi.
- **Integritas State**: Memastikan *state* lokal tidak bocor ke *state* global atau menimbulkan *side-effect* yang tak terduga.

---

### Workflow / Cara Menggunakan
Gunakan skill ini dengan perintah/prompt:
- `"Jalankan vibe-code-gardener untuk membersihkan AI slop di proyek ini"`
- `"Audit vibe decay dan rapikan file yang terlalu besar"`
- `"Sanitize codebase dari redundant code dan any type masking"`
