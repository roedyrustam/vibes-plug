---
name: auto-doc-updater
description: "Automatically documents every feature change or bug fix successfully built into CHANGELOG.md and BLUEPRINT.md / Otomatis mendokumentasikan setiap perubahan fitur atau perbaikan bug yang berhasil di-build ke CHANGELOG.md dan BLUEPRINT.md."
author: "Roedy Rustam"
---

# Auto Documentation Updater (2026 — ADR Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Automatically maintains project documentation after every successful build or feature implementation. Updates `CHANGELOG.md`, `BLUEPRINT.md`, and introduces **Architecture Decision Records (ADRs)** — immutable records of key architectural decisions made throughout the project lifecycle.

### Trigger Conditions
- A feature, bug fix, or refactor has been successfully implemented and verified.
- The user asks to "update docs", "document this", or "save progress".
- After completing a phase in `zero-to-prod-orchestrator`.
- A significant architectural decision was made (DB choice, auth flow, API design).

### Files Maintained

| File | Purpose | Update Frequency |
|---|---|---|
| `CHANGELOG.md` | User-facing list of changes | Every PR / feature |
| `BLUEPRINT.md` | Technical architecture overview | Major structural changes |
| `PROGRESS.md` | Development roadmap and status | Each work session |
| `docs/adr/` | Architecture Decision Records | Each key decision |

### CHANGELOG.md Format (Keep-a-Changelog Standard)
```markdown
# Changelog
All notable changes to this project will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]
### Added
- New feature or capability

## [1.2.0] — 2026-07-29
### Added
- Super Admin dashboard on `admin.domain.com` with tenant management
- Polar.sh billing integration as alternative to Stripe
- `spa-orchestrator` skill for SPA architecture decisions

### Changed
- Upgraded React to 19.x with new Compiler (removes need for useMemo/useCallback)
- Migrated from `tailwind.config.js` to CSS-first `@theme` configuration (Tailwind v4)

### Fixed
- N+1 query issue in workspace members list endpoint
- Memory leak in WebSocket connection cleanup

### Security
- Upgraded Supabase client to Auth v3 with PKCE flow (replaces implicit flow)
- Service role key moved out of client-side code

## [1.1.0] — 2026-06-15
### Added
...
```

### BLUEPRINT.md Structure
```markdown
# [Project Name] — Technical Blueprint

## Architecture Overview
[High-level diagram or description]

## Tech Stack
| Layer | Technology | Version |
|---|---|---|
| Frontend | Next.js | 15.x |
| Backend | Hono | latest |
| Database | PostgreSQL + Drizzle | — |
| Auth | Supabase Auth | v3 |

## Entry Points
| URL | Purpose |
|---|---|
| `domain.com` | Marketing/Landing |
| `app.domain.com` | SaaS App |
| `admin.domain.com` | Super Admin |

## Database Schema (Summary)
[Key tables and relationships]

## API Endpoints (Summary)
[Key routes and their purposes]

## Environment Variables Required
[List of all required env vars]
```

### Architecture Decision Records (ADRs)

ADRs are **immutable records** of significant architectural decisions. Once created, they are never deleted — only superseded by a new ADR. This creates a historical audit trail of *why* the system is built the way it is.

#### ADR Template (`docs/adr/ADR-NNN-title.md`)
```markdown
# ADR-001: Use Supabase for Authentication and Database

**Status**: Accepted
**Date**: 2026-07-29
**Deciders**: [Team/Individual]

## Context
[What is the situation that motivated this decision? What forces are at play?]

We need a database + authentication solution for our SaaS MVP that can be
delivered quickly without managing infrastructure.

## Decision
We will use Supabase as our primary backend-as-a-service, providing:
- PostgreSQL database with Row Level Security (RLS)
- Auth v3 with PKCE flow (OAuth, magic links, MFA)
- Realtime subscriptions
- Storage for user-uploaded files

## Rationale
- Faster time-to-market than self-hosted Postgres + separate auth service
- Built-in RLS for multi-tenant isolation without custom middleware
- Open-source — can self-host later if needed
- Strong TypeScript SDK with auto-generated types

## Consequences
**Positive:**
- No auth infrastructure to manage
- RLS enforced at DB level — defense in depth

**Negative:**
- Vendor dependency — migration would require significant refactor
- RLS requires careful testing to avoid data leakage bugs

## Superseded By
[ADR-XXX: Migrated to self-hosted Supabase] (if applicable)
```

#### ADR Index (`docs/adr/README.md`)
```markdown
# Architecture Decision Records

| # | Title | Status | Date |
|---|---|---|---|
| [ADR-001](./ADR-001-supabase-auth.md) | Use Supabase for Auth + DB | ✅ Accepted | 2026-07-29 |
| [ADR-002](./ADR-002-polar-billing.md) | Use Polar.sh for billing | ✅ Accepted | 2026-07-29 |
| [ADR-003](./ADR-003-rls-isolation.md) | Shared Schema + RLS for multi-tenancy | ✅ Accepted | 2026-08-01 |
| [ADR-004](./ADR-004-ssr-vs-spa.md) | Next.js SSR for main app, SPA for admin | 🔄 Proposed | 2026-08-05 |
```

### Update Protocol
After every successful feature implementation:
1. **CHANGELOG.md**: Add entry under `[Unreleased]` with correct category (Added/Changed/Fixed/Security).
2. **BLUEPRINT.md**: Update only if schema, stack, or entry points changed.
3. **PROGRESS.md**: Mark completed tasks `[x]`, update next steps.
4. **ADR**: Create a new ADR if a significant architectural decision was made (DB choice, auth flow, billing provider, deployment strategy, isolation strategy).

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Secara otomatis memelihara dokumentasi proyek setelah setiap build atau implementasi fitur yang berhasil. Memperbarui `CHANGELOG.md`, `BLUEPRINT.md`, dan memperkenalkan **Architecture Decision Records (ADR)** — catatan permanen dari keputusan arsitektur kunci yang dibuat sepanjang siklus hidup proyek.

### Kondisi Pemicu
- Sebuah fitur, perbaikan bug, atau refactor berhasil diimplementasikan dan diverifikasi.
- Pengguna meminta "perbarui docs", "dokumentasikan ini", atau "simpan progres".
- Setelah menyelesaikan fase dalam `zero-to-prod-orchestrator`.
- Keputusan arsitektur signifikan dibuat (pilihan DB, alur auth, desain API).

### File yang Dipelihara

| File | Tujuan | Frekuensi Pembaruan |
|---|---|---|
| `CHANGELOG.md` | Daftar perubahan untuk pengguna | Setiap PR / fitur |
| `BLUEPRINT.md` | Gambaran arsitektur teknis | Perubahan struktural besar |
| `PROGRESS.md` | Roadmap dan status pengembangan | Setiap sesi kerja |
| `docs/adr/` | Architecture Decision Records | Setiap keputusan kunci |

### Format CHANGELOG.md (Standar Keep-a-Changelog)
Gunakan kategori: `Added`, `Changed`, `Fixed`, `Removed`, `Security`. Simpan versi yang belum dirilis di bagian `[Unreleased]` dan turunkan ke versi bernama saat rilis.

### Struktur BLUEPRINT.md
Ringkasan arsitektur teknis termasuk: stack teknologi dengan versi, entry points (URL), skema database (ringkasan), endpoint API kunci, dan variabel lingkungan yang diperlukan.

### Architecture Decision Records (ADR)

ADR adalah **catatan permanen** dari keputusan arsitektur yang signifikan. Setelah dibuat, tidak pernah dihapus — hanya digantikan oleh ADR baru. Ini menciptakan jejak audit historis tentang *mengapa* sistem dibangun seperti yang ada.

Setiap ADR mencakup: Konteks (situasi yang memotivasi keputusan), Keputusan (apa yang diputuskan), Rasional (mengapa), Konsekuensi (positif dan negatif), dan Digantikan Oleh (jika berlaku).

Kelola ADR dengan indeks di `docs/adr/README.md` yang mencantumkan semua ADR dengan status (Diterima, Ditolak, Diusulkan, Usang).

### Protokol Pembaruan
Setelah setiap implementasi fitur yang berhasil:
1. **CHANGELOG.md**: Tambahkan entri di `[Unreleased]` dengan kategori yang benar.
2. **BLUEPRINT.md**: Perbarui hanya jika skema, stack, atau entry points berubah.
3. **PROGRESS.md**: Tandai tugas selesai `[x]`, perbarui langkah selanjutnya.
4. **ADR**: Buat ADR baru jika keputusan arsitektur signifikan dibuat.
