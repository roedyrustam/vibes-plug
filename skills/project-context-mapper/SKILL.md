---
name: project-context-mapper
description: "Gives the agent a photographic memory of massive repositories. Forces the creation and maintenance of a highly compressed CONTEXT_MAP.md to prevent context exhaustion and hallucination."
author: "vibes-plug-swarm"
---

# Project Context Mapper (Memory Optimizer)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills like `brainstorming`, `zero-to-prod-orchestrator`, and `project-context-mapper` to ensure cohesive execution.

### Description
LLMs struggle with repositories containing hundreds of files; they lose track of where things are, leading to hallucinations and excessive tool calls. This skill forces the agent to create, read, and maintain a `CONTEXT_MAP.md`—a highly compressed index of the repository's architecture, dependency graphs, and critical file locations. This acts as the agent's "photographic memory".

### Trigger Conditions
Activate this skill when:
- The agent enters a massive, existing codebase for the first time.
- The user complains that the AI is "editing the wrong file" or "forgetting how the app is structured."
- Context token usage is dangerously high and needs optimization.

### Core Concepts

#### 1. The Context Map Format
The agent should execute a script or traverse the directory to generate a compressed map in `CONTEXT_MAP.md` (or within `.agents/`).
```markdown
# CONTEXT MAP (Do not delete)

## Architecture
- Frontend: Next.js App Router (src/app)
- Backend: Hono RPC (src/server)
- DB: Drizzle (src/db/schema.ts)

## Dependency Graph (Critical Paths)
- `src/app/page.tsx` -> `src/components/ui/Button.tsx`
- `src/server/routes/users.ts` -> `src/db/queries/users.ts`

## State Locations
- Global Auth: `src/store/auth.ts` (Zustand)
```

#### 2. Workflow
1. **On Start:** The agent reads `CONTEXT_MAP.md` instead of blindly listing directories.
2. **On Modification:** When the agent creates a new major component, route, or service, it MUST append that location to the context map.

### Best Practices
- **Keep it Ultra-Compressed:** Do not store full code in the map. Store ONLY file paths, responsibilities (1 sentence), and connections.
- **BM25 Search First:** Before writing to the context map, consider using `grep_search` or semantic search for targeted lookups. The map is for *architectural* understanding, not exact variable finding.

---

### Integration with Other Skills (MANDATORY)
- `session-context-loader` — Integrates deeply to ensure the context map is loaded automatically on every new chat session.
- `token-saver` — The map prevents the agent from reading 10 separate files just to find one function, saving massive amounts of tokens.
- `monorepo-architect` — Essential for mapping out package boundaries in Turborepo/pnpm workspaces.

### Referenced By Orchestrators (MANDATORY)
- `brainstorming` — Add to "Discovery & Audit".
- `zero-to-prod-orchestrator` — Phase 1 (Discovery & Architecture).

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan seperti `brainstorming`, `zero-to-prod-orchestrator`, dan `project-context-mapper` untuk memastikan eksekusi yang kohesif.

### Deskripsi
Kelemahan utama agen AI adalah keterbatasan jendela konteks (*context window*). Skill ini memberi agen "ingatan fotografis" dengan mewajibkannya memelihara file `CONTEXT_MAP.md`—sebuah indeks super padat yang memetakan arsitektur proyek, lokasi file penting, dan graf dependensi.

### Kondisi Pemicu
- Saat agen baru saja dimasukkan ke dalam repositori raksasa yang sudah ada (bukan dari nol).
- Saat agen mulai salah mengedit file atau terlihat kebingungan dengan struktur folder.

### Panduan Singkat
- **Indeks Tersentralisasi:** Buat dan selalu perbarui `CONTEXT_MAP.md`. File ini berisi daftar *path* direktori krusial dan tanggung jawab masing-masing (misal: "Logic pembayaran ada di `src/lib/stripe.ts`").
- **Ultra-Ringkas:** Jangan menaruh baris kode di dalam peta konteks ini. Hanya gunakan format *bullet points* agar konsumsi token saat dibaca sangat rendah.
- **Baca di Awal Sesi:** Di setiap awal percakapan, agen tidak perlu lagi meraba-raba melakukan `ls` berulang kali. Cukup gunakan `view_file` pada `CONTEXT_MAP.md`, dan agen langsung mengerti seluruh topologi proyek.
