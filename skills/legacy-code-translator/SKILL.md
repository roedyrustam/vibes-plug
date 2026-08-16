---
name: legacy-code-translator
description: "Methodological guide for the AI Agent to safely and systematically translate, refactor, and modernize giant legacy codebases (PHP, Python 2, old React) into modern stacks."
author: "vibes-plug-swarm"
---

# Legacy Code Translator (Refactoring Engine)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills like `brainstorming`, `zero-to-prod-orchestrator`, and `project-context-mapper` to ensure cohesive execution.

### Description
A rigid methodology for the AI agent to reverse-engineer and translate legacy codebases into modern architectures without losing business logic. This gives the agent the "superpower" to handle massive enterprise migrations safely, avoiding the common hallucination trap of rewriting everything at once.

### Trigger Conditions
Activate this skill when the user says:
- "Migrate this old PHP codebase to Next.js."
- "Translate this Python script to Rust."
- "Refactor this giant React class component into hooks."

### Core Concepts

#### 1. The 4-Step Migration Protocol
The agent MUST follow this exact sequence:
1. **Understand (AST Map):** Map out the legacy code's inputs, outputs, and side effects. Document this in an artifact (`migration_plan.md`).
2. **Isolate Logic:** Separate the core business rules from the legacy framework bindings (e.g., separate the tax calculation logic from the WordPress hook).
3. **Translate:** Write the modernized code in the new language/framework.
4. **Verify (Shadow Testing):** Compare the output of the new code against the old code using identical inputs.

#### 2. Agent Constraints
- **NEVER overwrite the legacy file directly.** Always create the new file side-by-side (e.g., `User.legacy.php` and `user.service.ts`).
- **NEVER attempt to translate a 2000-line file in one shot.** Break it down by functions or modules to prevent context window exhaustion and token truncation.
- **Preserve quirks:** Sometimes legacy bugs are actually relied-upon business logic. Document suspicious logic before fixing it.

---

### Integration with Other Skills (MANDATORY)
- `prd-architect` — To document the extracted business rules before writing modern code.
- `project-context-mapper` — To understand how the legacy files intertwine before pulling them apart.
- `autonomous-tdd-debugger` — To write tests against the old code, ensuring the new code passes the exact same tests.

### Referenced By Orchestrators (MANDATORY)
- `brainstorming` — Add to "Architecture & Scale".
- `zero-to-prod-orchestrator` — Phase 2 (Foundation / Refactoring).

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan seperti `brainstorming`, `zero-to-prod-orchestrator`, dan `project-context-mapper` untuk memastikan eksekusi yang kohesif.

### Deskripsi
Panduan metodologis ketat bagi Agen AI untuk membongkar, menerjemahkan, dan memodernisasi *codebase* warisan (legacy) berskala raksasa (seperti PHP 5 atau React lawas) ke arsitektur modern tanpa kehilangan atau merusak *business logic* yang ada.

### Kondisi Pemicu
- Saat diminta memigrasikan sistem lama ke framework baru.
- Saat harus menerjemahkan kode antar bahasa pemrograman (misal: Python ke Rust, atau PHP ke Go).

### Panduan Singkat
- **Jangan Langsung Timpa:** Jangan pernah menulis ulang kode lama di file yang sama. Buat file baru bersisian (`old_logic.js` -> `new_logic.ts`), lalu perlahan pindahkan impornya.
- **Pecah Skala Raksasa:** LLM akan berhalusinasi jika diminta menerjemahkan 2000 baris kode sekaligus. Pecah tugas tersebut menjadi level fungsi (function-by-function).
- **Pemetaan Input/Output:** Sebelum menulis kode baru, agen wajib mendaftar semua *input* (argumen, variabel global, request DB) dan *output* (return, modifikasi state, update DB) dari fungsi lama ke dalam dokumen artefak.
