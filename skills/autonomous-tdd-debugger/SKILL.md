---
name: autonomous-tdd-debugger
description: "Empowers the agent to autonomously run tests, read terminal stack traces, and self-heal code until tests pass. Transforms the agent from a passive coder to an active CI pipeline debugger."
author: "Roedy Rustam"
---

# Autonomous TDD Debugger & Self-Healing Agent

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
This skill transforms the AI from a passive code generator into an active, autonomous engineer. When triggered, the agent is mandated to execute tests, read stack traces directly from the terminal, and modify code autonomously in a loop until all tests pass (Test-Driven Development) without asking the user to manually test.

### Trigger Conditions
Activate this skill when the user asks to:
- Fix failing tests or bugs without providing the error log.
- "Write the code and ensure it works."
- "Debug this completely autonomously."

### Core Concepts

#### 1. The Autonomous Loop
1. **Write/Modify Code:** The agent modifies the application files.
2. **Execute:** The agent uses `run_command` (e.g., `npm run test`, `cargo test`, `pytest`).
3. **Analyze:** The agent reads the stdout/stderr from the background task.
4. **Heal:** If it fails, the agent parses the stack trace, identifies the line number, applies a fix, and goes back to Step 2.
5. **Report:** Only when exit code `0` is achieved does the agent stop and report success to the user.

#### 2. Agent Constraints
- Do NOT ask the user "Please run this and tell me the error." You have the tools to run it yourself.
- Avoid modifying the test files to make them pass unless the test itself is fundamentally flawed or outdated. Fix the implementation first.
- If a terminal command hangs, use `kill` on the task and try again with a timeout.

---

### Integration with Other Skills (MANDATORY)
- `e2e-testing-expert` — Provides the exact testing frameworks (Vitest, Playwright) that this agent will execute.
- `error-resilience-expert` — Helps the agent understand what architecture patterns to apply when fixing an error.
- `project-context-mapper` — Allows the agent to find where the failing component is located in large codebases.

### Referenced By Orchestrators (MANDATORY)
- `brainstorming` — Add to "Testing & Security".
- `zero-to-prod-orchestrator` — Phase 6 (Automated Testing).

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Memberdayakan agen AI untuk menjalankan *test*, membaca *stack trace* di terminal, dan menyembuhkan (self-heal) kode secara mandiri hingga sukses. Mengubah agen dari sekadar penulis kode pasif menjadi *debugger* aktif.

### Kondisi Pemicu
- Pengguna meminta untuk memperbaiki *bug* tetapi tidak memberikan *log error*.
- Pengguna meminta agen untuk memastikan kode yang ditulis benar-benar berjalan (bukan sekadar teori).

### Panduan Singkat
- **Jangan Meminta Bantuan User:** Jangan pernah berkata "Tolong jalankan kode ini dan berikan saya error-nya." Anda memiliki alat `run_command` untuk menjalankannya sendiri.
- **Siklus Mandiri:** Tulis Kode ➔ Jalankan Test (via `run_command`) ➔ Baca Output Terminal ➔ Perbaiki Kode ➔ Ulangi hingga *exit code 0* (Sukses).
- **Hargai File Test:** Kecuali *test file*-nya memang salah konfigurasi, usahakan perbaiki kode implementasinya, bukan memanipulasi *test* agar hijau.
