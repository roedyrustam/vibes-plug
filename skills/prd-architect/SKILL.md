---
name: prd-architect
description: "Updated to cover both pre-code PRD/ERD/Docs generation AND post-code continuous documentation updates / Diperbarui untuk mencakup pembuatan PRD/ERD/Docs pra-kode DAN pembaruan dokumentasi kontinu pasca-kode."
author: "Roedy Rustam"
---

# PRD Architect & Documentation Lifecycle (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects with `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager` to ensure cohesive execution and documentation updates.

### Description
A mandatory lifecycle guardrail covering two distinct phases:
- **Phase 1 (Pre-Code):** Enforces creating a comprehensive Product Requirements Document (PRD), ERD, and general Documentation before generating code. Introduces PRD-as-Code — machine-readable and version-controlled.
- **Phase 2 (Post-Code / Maintenance):** Automatically maintains project documentation after every successful build or feature implementation, updating `CHANGELOG.md`, `BLUEPRINT.md`, `PROGRESS.md`, and Architecture Decision Records (ADRs).

### Trigger Conditions
- **Phase 1:** User requests building a new app/SaaS/feature from scratch; no existing PRD/blueprint; unclear scope.
- **Phase 2:** A feature, bug fix, or refactor is successfully implemented; user asks to "update docs" or "save progress"; a significant architectural decision is made; milestone completion.

### Phase 1: Pre-Code Requirements & Enforcement
**Why PRD Before Code:** Prevents scope creep, aligns AI output, enables traceability, reduces rework, version-controlled.

#### Enforcement Protocol
1. **Detect**: When user requests a new project build.
2. **Pause**: Do NOT generate any code.
3. **Generate Assets**: Automatically create `PRD.md`, `ERD.md`, `DOKUMENTASI.md`, and `ROADMAP.md` (or `PROGRESS.md`).
4. **Review**: Present to user for approval/edits.
5. **Confirm**: Proceed to code generation ONLY after approval.
6. **Reference**: Cite these documents in all subsequent decisions.

#### PRD-as-Code Template (12 Sections)
```markdown
# Product Requirements Document (PRD)
**Project**: [Project Name]
**Version**: 1.0.0
**Status**: Draft | In Review | Approved
**Created**: YYYY-MM-DD
**Last Updated**: YYYY-MM-DD

---
## 1. Executive Summary
[2-3 sentences: What is this product? Who is it for? What problem does it solve?]

## 2. Problem Statement
**Problem**: [Clear description]
**Target Users**: [Specific segments]
**Current Pain Points**: [List]

## 3. Goals & Success Metrics
| Goal | Metric | Target |
|---|---|---|
| [Goal] | [Metric] | [Target] |

## 4. User Personas
### Persona 1: [Name]
- **Role**: [Job title]
- **Goals**: [What they want to achieve]
- **Frustrations**: [What currently doesn't work]
- **Key Behaviors**: [How they'll use this product]

## 5. Feature Requirements
### MVP Features (Must Have — v1.0)
- [ ] **[Feature Name]**: [Description. Acceptance criteria: ...]
### Phase 2 Features (Should Have — v1.x)
- [ ] **[Feature Name]**: [Description]
### Future Features (Nice to Have — v2.0+)
- [ ] **[Feature Name]**: [Description]

## 6. Technical Architecture
### Stack Decision
| Layer | Technology | Rationale |
|---|---|---|
| [Layer] | [Technology] | [Reason] |
### Architecture Decisions (ADRs)
- **ADR-001**: [Decision title] — [Decision made and why]
### Multi-Entry Points (if SaaS)
| Entry Point | Domain | Purpose |
|---|---|---|
| [Entry] | [Domain] | [Purpose] |

## 7. Data Model (High-Level)
users ──belongs_to──> workspaces (via workspace_members)
workspaces ──has_many──> projects

## 8. User Flows
### Primary Flow: [Name]
1. User [action 1]
2. System [response 1]

## 9. Non-Functional Requirements
| Requirement | Target |
|---|---|
| Performance | LCP < 2.5s, INP < 200ms |

## 10. Out of Scope
- [Explicitly excluded item]

## 11. Open Questions
- [ ] [Question that needs decision]

## 12. Approval & Sign-off
| Stakeholder | Role | Status |
|---|---|---|
| [Name] | [Role] | [Status] |
```

### Phase 2: Post-Code Maintenance & Update Protocol

After every successful feature implementation:
1. **CHANGELOG.md**: Add entry under `[Unreleased]` (Keep-a-Changelog standard: Added/Changed/Fixed/Removed/Security).
2. **BLUEPRINT.md**: Update only if architecture, schema, stack, or entry points changed.
3. **PROGRESS.md**: Mark completed tasks `[x]`, update next steps.
4. **ADR**: Create a new ADR (`docs/adr/ADR-NNN-title.md`) if a significant architectural decision was made and update index (`docs/adr/README.md`).

#### Files Maintained Frequency Matrix
| File | Purpose | Update Frequency |
|---|---|---|
| `CHANGELOG.md` | User-facing list of changes | Every PR / feature |
| `BLUEPRINT.md` | Technical architecture overview | Major structural changes |
| `PROGRESS.md` | Development roadmap and status | Each work session |
| `docs/adr/` | Architecture Decision Records | Each key decision |

#### ADR Template
```markdown
# ADR-001: [Title]
**Status**: Accepted | Rejected | Proposed | Deprecated
**Date**: YYYY-MM-DD
**Deciders**: [Team/Individual]
## Context
[What motivated this decision?]
## Decision
[What is being decided?]
## Rationale
[Why this choice?]
## Consequences
**Positive:** / **Negative:**
## Superseded By
[ADR-XXX] (if applicable)
```

### 🎨 Automatic Visual Assets Generation Mandate (CRITICAL)
**MANDATORY**: When building a new application, use `generate_image` to create a custom logo. Use it as:
1. The primary application logo (header/navbar).
2. The website favicon (`favicon.ico`).
3. The Open Graph (OG) image for SEO (`og:image`).

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dengan `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`.

### Deskripsi
Guardrail siklus hidup wajib:
- **Fase 1 (Pra-Kode):** Memaksa pembuatan PRD, ERD, dan Dokumentasi sebelum kode dibuat.
- **Fase 2 (Pasca-Kode):** Memelihara dokumentasi setelah setiap fitur sukses: `CHANGELOG.md`, `BLUEPRINT.md`, `PROGRESS.md`, dan ADR.

### Kondisi Pemicu
- **Fase 1:** Proyek baru dari awal; tidak ada PRD; ruang lingkup tidak jelas.
- **Fase 2:** Fitur berhasil; pengguna meminta "perbarui docs"; keputusan arsitektur signifikan.

### Fase 1: Protokol Penegakan
1. Deteksi permintaan proyek baru → 2. Jeda (JANGAN kode) → 3. Buat `PRD.md`, `ERD.md`, `DOKUMENTASI.md`, `ROADMAP.md` → 4. Tinjau & setujui → 5. Baru mulai kode → 6. Referensi selalu.

### Fase 2: Pemeliharaan Pasca-Kode
1. **CHANGELOG.md**: Tambahkan ke `[Unreleased]` (Added/Changed/Fixed/Removed/Security).
2. **BLUEPRINT.md**: Perbarui jika struktur berubah.
3. **PROGRESS.md**: Tandai `[x]`, perbarui langkah selanjutnya.
4. **ADR**: Buat `docs/adr/ADR-NNN-title.md` untuk keputusan besar.

### 🎨 Mandat Aset Visual Otomatis (KRITIS)
**WAJIB**: Gunakan `generate_image` untuk membuat logo kustom sebagai logo, favicon, dan OG image.
