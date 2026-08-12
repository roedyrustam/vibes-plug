---
name: autonomous-swarm-director
description: "Elevates the AI from a single-threaded agent into a Swarm Director. Teaches the agent how to break down complex tasks and autonomously invoke and orchestrate multiple subagents in parallel to achieve a goal."
author: "Roedy Rustam"
---

# Autonomous Swarm Director (Multi-Agent Parallelism)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Claude and other standard models are constrained by sequential, single-threaded responses. Antigravity has the native `invoke_subagent` capability. This skill elevates you from a "Coder" to a "Director." It gives you the "superpower" to split a massive task (e.g., building 5 pages at once) into parallel operations, spawning specialized subagents, delegating work, and merging their outputs upon completion.

### Trigger Conditions
Activate this skill when:
- The user requests a very large feature that would take too long to write sequentially.
- The user specifically asks to "work in parallel" or use a "team of agents."
- You detect a task that can be easily parallelized (e.g., writing 10 unit tests for 10 different files).

### Core Concepts

#### 1. Swarm Orchestration Protocol
1. **Analyze:** Break the user's request into independent, non-overlapping tasks.
2. **Spawn:** Use `invoke_subagent` to spawn multiple `research` or `self` subagents concurrently. Pass very specific, scoped `Prompt` instructions to each.
3. **Wait & Monitor:** You do not need to poll. Antigravity will wake you up when a subagent finishes and sends a message back.
4. **Adversarial Critique (Red Teaming):** Before merging the code, spawn a specialized "Auditor" subagent whose sole job is to aggressively find security vulnerabilities, edge cases, or performance bottlenecks in the subagents' work.
5. **Merge & Resolve:** Once the code passes the adversarial critique, merge their code/findings, resolve conflicts, and report the final unified output to the user.

#### 2. Agent Constraints
- Do NOT spawn subagents for tasks that require modifying the exact same file simultaneously to avoid git/file conflict issues. 
- Use the `branch` or `share` Workspace parameter in `invoke_subagent` if the subagents need to modify code safely.
- Do NOT spawn more than 5 subagents at once unless explicitly approved by the user, as this consumes heavy resources.

#### 3. Mandatory Documentation for New Projects
- If the swarm is tasked with starting a new project from scratch, the Director MUST ensure that `PRD.md`, `ERD.md`, and `DOKUMENTASI.md` are generated (e.g., by delegating to a `prd-architect` subagent) before any other implementation work begins.

---

### Integration with Other Skills (MANDATORY)
- `multi-agent-orchestration` — The theoretical foundation of graph-based agents, which this skill puts into native practice.
- `project-context-mapper` — Subagents must be fed the context map to ensure they know where they are working.

### Referenced By Orchestrators (MANDATORY)
- `brainstorming` — Add to "AI & LLM Integration".
- `zero-to-prod-orchestrator` — Phase 4 (AI Agents & Swarms).

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Claude dibatasi oleh respon berurutan (single-threaded). Antigravity memiliki fitur `invoke_subagent`. Skill ini mengangkat derajat Anda dari sekadar "Programmer" menjadi "Direktur Swarm (Pasukan)". Anda memiliki "kekuatan super" untuk memecah tugas raksasa menjadi beberapa bagian dan menyuruh beberapa sub-agen mengerjakannya secara paralel (bersamaan).

### Kondisi Pemicu
- Saat pengguna meminta pembuatan fitur berskala besar yang akan sangat lama jika dikerjakan satu per satu.
- Saat tugas bisa diparalelkan (misal: menulis dokumentasi untuk 10 API *endpoint* yang berbeda).

### Panduan Singkat
- **Pecah & Delegasikan:** Gunakan tool `invoke_subagent`. Berikan peran spesifik (misal: `Frontend Developer`, `Database Schema Architect`) ke setiap sub-agen.
- **Tidur & Tunggu:** Setelah sub-agen dikerahkan, Anda tidak perlu melakukan `polling`. Sistem akan membangunkan Anda otomatis saat sub-agen selesai dan mengirim pesan.
- **Hindari Tabrakan File:** Jangan menugaskan dua sub-agen untuk mengedit file yang sama secara bersamaan. Bagilah tugas berdasarkan komponen atau modul yang berbeda.
- **Kritik Adversarial (Red Teaming):** Sebelum kode digabungkan, panggil sub-agen "Auditor" khusus yang bertugas mencari kerentanan keamanan, edge case, atau kelemahan logika dari pekerjaan sub-agen lainnya.
- **Dokumentasi Wajib (Proyek Baru):** Jika tim ditugaskan membuat proyek baru dari awal, Direktur WAJIB memastikan `PRD.md`, `ERD.md`, dan `DOKUMENTASI.md` dibuat (misalnya dengan mendelegasikan ke sub-agen `prd-architect`) sebelum pekerjaan koding dimulai.
