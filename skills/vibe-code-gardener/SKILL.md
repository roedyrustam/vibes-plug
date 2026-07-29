---
name: vibe-code-gardener
description: "Purger of AI slop, code bloat, context drift, and architectural decay in vibe-coded projects / Pembersih AI slop, kode membengkak, konteks drift, dan pembusukan arsitektur pada proyek vibe coding."
author: "Roedy Rustam"
---

# Vibe Code Gardener (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Detects and purges AI-generated code quality issues — AI slop, code bloat, context drift, duplicated logic, dead code, misaligned patterns, and architectural decay in projects that have been heavily vibe-coded.

### Trigger Conditions
- Codebase has grown out of control after many AI-assisted coding sessions.
- Duplication, inconsistent patterns, or unexplained abstractions detected.
- Features are getting harder to add or understand.
- Tests are brittle or missing entirely.
- The codebase has "AI smell" — overly verbose comments, unnecessary defensive code, duplicate utilities.

### AI Slop Detection Heuristics (2026)

These are the most common AI-generated code quality issues to look for:

#### 1. The "Just In Case" Over-Engineering
AI models often add features or abstractions "for extensibility" that are never needed:
```typescript
// 🔴 AI SLOP: Factory pattern for something that will never change
const createUserRepository = (type: 'postgres' | 'mysql' | 'sqlite') => {
  if (type === 'postgres') return new PostgresUserRepo();
  // ...never switches in practice
};

// ✅ CLEAN: Just use the implementation
const userRepo = new PostgresUserRepo();
```

#### 2. The "Belt and Suspenders" Duplicate Guards
AI adds null checks and validations at every layer unnecessarily:
```typescript
// 🔴 AI SLOP: Triple-validated (already validated by Zod + DB schema + here)
if (!user || !user.id || user.id === undefined || user.id === null || typeof user.id !== 'string') { ... }

// ✅ CLEAN: Trust your types
if (!user.id) { ... }
```

#### 3. The "Graveyard of Dead Utilities"
AI-generated helper files with functions that are defined but never used:
- Search for exported functions with 0 usages: `grep -r "export function" --include="*.ts" | while read...`
- Remove entire files of dead utilities.

#### 4. Context Drift — Style Inconsistency
Different sessions produce different coding styles in the same codebase:
- Some files use `async/await`, others use `.then()` chains.
- Some use `const` arrow functions, others use `function` declarations.
- Mixed naming: `userId`, `user_id`, `UserID` in the same project.
- **Fix**: Run a style unification pass with Prettier + ESLint rules.

#### 5. Comment Pollution
AI loves to narrate obvious code:
```typescript
// 🔴 AI SLOP: Stating the obvious
// Get the user from the database
const user = await db.user.findUnique({ where: { id } });
// Return the user
return user;

// ✅ CLEAN: No comment needed — code is self-explanatory
const user = await db.user.findUnique({ where: { id } });
return user;
```

#### 6. The Bloated Component
AI tends to put too much in one component across sessions:
- Component renders conditionally across 5+ different states.
- Component has 10+ props.
- Component imports from 20+ different modules.
- **Fix**: Apply Single Responsibility — split into sub-components.

#### 7. Dependency Creep
Each AI session may install new packages for tasks already solvable with existing deps:
```bash
# Audit dependencies — find packages doing the same thing
npx depcheck  # Unused dependencies
npx bundle-phobia-cli # Bundle size of each dep
```

### Gardening Protocol

#### Phase 1: Discovery (Read Only)
1. Map the full file tree.
2. Identify largest files (likely bloated).
3. Find duplicated logic with semantic search.
4. Find unused exports and dead code.
5. Identify inconsistent patterns across files.

#### Phase 2: Triage
Categorize issues:
- **Critical**: Bugs, security holes, data loss risks.
- **High**: Duplicate business logic that will diverge.
- **Medium**: Code smells that slow development.
- **Low**: Style inconsistencies, over-verbose comments.

#### Phase 3: Systematic Refactoring
Work file by file, smallest changes first:
1. Remove dead code and unused imports.
2. Extract duplicated logic into shared utilities.
3. Simplify over-engineered abstractions.
4. Standardize naming conventions.
5. Add missing tests for business-critical paths.

#### Phase 4: Prevention
- Add ESLint rules to catch common AI slop patterns.
- Add `depcheck` to CI to catch unused dependencies.
- Add architecture tests (e.g., `arch-unit`) to enforce layer boundaries.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Mendeteksi dan membersihkan masalah kualitas kode yang dihasilkan AI — AI slop, kode yang membengkak, context drift, logika yang terduplikasi, kode mati, pola yang tidak konsisten, dan pembusukan arsitektur pada proyek yang banyak menggunakan vibe coding.

### Kondisi Pemicu
- Codebase telah tumbuh tidak terkendali setelah banyak sesi coding berbantuan AI.
- Duplikasi, pola tidak konsisten, atau abstraksi yang tidak dapat dijelaskan terdeteksi.
- Fitur semakin sulit ditambahkan atau dipahami.
- Test rapuh atau tidak ada sama sekali.
- Codebase memiliki "AI smell" — komentar yang terlalu verbose, kode defensif yang tidak perlu, utilitas yang diduplikasi.

### Heuristik Deteksi AI Slop (2026)

#### 1. Over-Engineering "Untuk Jaga-Jaga"
Model AI sering menambahkan fitur atau abstraksi "untuk ekstensibilitas" yang tidak pernah dibutuhkan. Hapus factory pattern, strategy pattern, atau abstraksi lain yang tidak memiliki lebih dari satu implementasi.

#### 2. "Belt and Suspenders" — Validasi Ganda Berlebihan
AI menambahkan null check dan validasi di setiap layer yang sebenarnya sudah divalidasi oleh Zod, TypeScript, atau skema DB. Percayai tipe Anda.

#### 3. "Kuburan Utilitas Mati"
File helper yang dihasilkan AI dengan fungsi yang tidak pernah digunakan. Cari dan hapus ekspor dengan 0 penggunaan.

#### 4. Context Drift — Inkonsistensi Gaya
Sesi yang berbeda menghasilkan gaya koding yang berbeda: sebagian menggunakan `async/await`, yang lain menggunakan `.then()`; penamaan campuran `userId`, `user_id`, `UserID`. Perbaiki dengan satu pass Prettier + aturan ESLint.

#### 5. Polusi Komentar
AI suka mengomentari kode yang sudah jelas sendiri. Hapus komentar yang hanya mengulang apa yang sudah tertulis dalam kode.

#### 6. Komponen yang Membengkak
Komponen dengan terlalu banyak kondisi rendering, prop, atau impor. Terapkan Single Responsibility — pecah menjadi sub-komponen.

#### 7. Creep Dependensi
Setiap sesi AI mungkin menginstal paket baru untuk tugas yang sudah bisa diselesaikan dengan dependensi yang ada. Audit dengan `depcheck` dan `bundle-phobia-cli`.

### Protokol Berkebun

#### Fase 1: Penemuan (Hanya Baca)
Peta pohon file lengkap, identifikasi file terbesar, temukan logika yang terduplikasi, temukan ekspor yang tidak digunakan.

#### Fase 2: Triase
Kategorikan masalah: Kritis, Tinggi, Sedang, Rendah.

#### Fase 3: Refactoring Sistematis
Kerja file per file, perubahan terkecil dulu: hapus kode mati, ekstrak logika duplikat, sederhanakan abstraksi berlebih, standarisasi penamaan, tambahkan test yang hilang.

#### Fase 4: Pencegahan
Tambahkan aturan ESLint, `depcheck` di CI, dan architecture test untuk menjaga codebase tetap bersih.
