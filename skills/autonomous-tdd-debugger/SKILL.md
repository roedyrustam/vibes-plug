---
name: autonomous-tdd-debugger
description: "Autonomous TDD test runner, stack trace analysis, and code self-heal / Runner tes TDD otonom, analisis stack trace, dan self-healing kode."
author: "Roedy Rustam"
version: "4.4.4"

---

# Autonomous TDD Debugger & Self-Healing Agent

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Test Frameworks & E2E**: `e2e-testing-expert`, `property-mutation-testing-expert`, `accessibility-testing-expert`
- **Quality Gates & Anti-Slop**: `anti-slop`, `ai-code-review-autonomous`, `zero-tech-debt-auditor`
- **Formal Verification & Contracts**: `formal-spec-z3-verifier`, `spec-driven-development-expert`
- **Error Resilience & Healing**: `error-resilience-expert`, `self-healing-cloud-orchestrator`, `living-codebase-ast-graph`
- **Lifecycle & Governance**: `zero-to-prod-orchestrator`, `session-memory-manager`

### Description
Transforms the AI agent from a passive code generator into an active, autonomous Test-Driven Development (TDD) engineer. When invoked, the agent is mandated to execute tests, parse terminal stack traces, analyze failing assertions, and autonomously modify code in an iterative self-healing loop until all tests pass (exit code 0)—without prompting the user to manually run commands or debug errors.

### Trigger Conditions
- User asks to fix failing tests or debug runtime errors without providing full error logs.
- Directives such as *"Write the feature and ensure all tests pass"*, *"Fix this bug autonomously"*, or *"Refactor and verify"*.
- Phase 6 (Automated Testing & Quality Gate) execution in `zero-to-prod-orchestrator`.
- Post-migration regression validation in `legacy-code-translator`.

### Autonomous Self-Healing Loop (5-Step Protocol)

```
┌────────────────────────────────────────────────────────┐
│ 1. EXECUTE TEST RUNNER                                 │
│    Run `vitest run`, `cargo test`, `pytest`, or `go test`│
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 2. PARSE STACK TRACE & FILTER NOISE                   │
│    Extract failing file, line number, expected vs actual│
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 3. AST BLAST-RADIUS CHECK                              │
│    Locate caller functions; isolate logic from tests   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 4. APPLY PRECISION PATCH                               │
│    Fix production implementation; NEVER mock fakes     │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 5. RE-RUN & VERIFY (Max 5 Iterations)                  │
│    Exit Code 0? ──► [YES] Complete & Report Artifact   │
│                 └──► [NO]  Loop back to Step 2         │
└────────────────────────────────────────────────────────┘
```

### Self-Healing Script Example (TypeScript / Vitest)

```typescript
// scripts/tdd-runner.mjs
import { execSync } from 'node:child_process';
import path from 'node:path';

export function runTDDLoop(testPattern = '', maxAttempts = 5): boolean {
  console.log(`[TDD-Debugger] Starting autonomous test cycle (Limit: ${maxAttempts} attempts)...`);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`\n--- Attempt ${attempt} of ${maxAttempts} ---`);
    try {
      const output = execSync(`npx vitest run ${testPattern} --reporter=verbose`, {
        encoding: 'utf8',
        stdio: 'pipe',
      });
      console.log('✅ All tests passed successfully!');
      return true;
    } catch (err: any) {
      const stdout = err.stdout?.toString() || '';
      const stderr = err.stderr?.toString() || '';
      const combined = stdout + '\n' + stderr;

      // Extract failing test location
      const frameMatch = combined.match(/(?:FAIL|Error:)\s+(.*?):(\d+):(\d+)/) ||
                         combined.match(/at\s+(.*?):(\d+):(\d+)/);

      if (frameMatch) {
        const [, file, line] = frameMatch;
        console.warn(`[TDD-Debugger] Failure detected at ${path.basename(file)}:${line}`);
      } else {
        console.warn('[TDD-Debugger] Test failure detected. Analyzing raw output...');
      }

      if (attempt === maxAttempts) {
        console.error('❌ Reached maximum self-healing attempts. Circuit breaker tripped.');
        return false;
      }
    }
  }
  return false;
}
```

### Non-Negotiable Agent Constraints
1. **Zero-Human Intervention**: NEVER ask the user *"Please run this and tell me the error"*. You possess `run_command`—execute it directly in the terminal, read stdout/stderr, and iterate until green.
2. **Respect Test Integrity (Anti-Slop Pillar 2)**:
   - Do NOT comment out or skip failing tests (`test.skip`) to fake a passing suite.
   - Do NOT replace failing assertions with trivial tautologies (`expect(true).toBe(true)`).
   - Fix the production source code first. Only modify test files if the test specification itself is demonstrably obsolete or contradictory.
3. **Circuit Breaker**: Capped at 5 self-healing iterations. If an issue remains unresolved after 5 cycles, pause to re-verify fundamental architectural assumptions.

---

#### Stack Trace Frame Parser & Fault Localizer (TypeScript)
```typescript
export interface StackFrameLocation {
  filePath: string;
  lineNumber: number;
  columnNumber: number;
  functionName: string;
}

export function parseTopFailingFrame(stackTrace: string): StackFrameLocation | null {
  const frameRegex = /ats+(?:([^s(]+)s+()?([^s():]+:d+:d+))?/;
  const match = stackTrace.match(frameRegex);
  if (!match) {
    return null;
  }
  const fnName = match[1] ?? 'anonymous';
  const parts = match[2].split(':');
  const col = Number(parts.pop());
  const line = Number(parts.pop());
  const filePath = parts.join(':');
  return { filePath, lineNumber: line, columnNumber: col, functionName: fnName };
}
```

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Availability Fallback** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec autonomous-tdd-debugger <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **NFR & Anti-Slop Invariants** | Zero OWASP Top 10 vectors, 0 hardcoded secrets, >= 90% branch coverage on domain logic, 0 Anti-Slop violations; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Framework Pengujian & E2E**: `e2e-testing-expert`, `property-mutation-testing-expert`, `accessibility-testing-expert`
- **Gerbang Kualitas & Anti-Slop**: `anti-slop`, `ai-code-review-autonomous`, `zero-tech-debt-auditor`
- **Verifikasi Formal & Kontrak**: `formal-spec-z3-verifier`, `spec-driven-development-expert`
- **Ketahanan Error & Pemulihan**: `error-resilience-expert`, `self-healing-cloud-orchestrator`, `living-codebase-ast-graph`
- **Siklus Hidup & Tata Kelola**: `zero-to-prod-orchestrator`, `session-memory-manager`

### Deskripsi
Mengubah agen AI dari sekadar pembuat kode pasif menjadi insinyur *Test-Driven Development* (TDD) yang aktif dan mandiri. Saat diaktifkan, agen diwajibkan menjalankan pengujian otomatis, mem-parsing *stack trace* di terminal, menganalisis kegagalan asersi, dan memodifikasi kode secara otonom dalam siklus perbaikan (*self-healing loop*) berulang hingga seluruh pengujian lulus (*exit code 0*)—tanpa meminta pengguna untuk melakukan pengujian manual.

### Kondisi Pemicu
- Pengguna meminta untuk memperbaiki *test* yang gagal atau mencari *bug* tanpa menyertakan log error lengkap.
- Instruksi seperti *"Tulis fitur ini dan pastikan semua test lulus"*, *"Debug kode ini secara mandiri"*, atau *"Refaktor dan buktikan dengan test"*.
- Eksekusi Fase 6 (Pengujian Otomatis & Gerbang Kualitas) pada `zero-to-prod-orchestrator`.
- Verifikasi regresi setelah migrasi kode warisan pada `legacy-code-translator`.

### Siklus Mandiri 5 Langkah

```
1. JALANKAN TEST RUNNER (via run_command)
   npx vitest run, cargo test, pytest, atau go test
        │
        ▼
2. FILTER STACK TRACE & NOISE TERMINAL
   Ekstrak file yang gagal, nomor baris, nilai aktual vs ekspektasi
        │
        ▼
3. ANALISIS RADIUS DAMPAK (AST CHECK)
   Cari fungsi implementasi terkait; pisahkan logika dari file test
        │
        ▼
4. TERAPKAN PERBAIKAN PRESISI
   Perbaiki implementasi di kode produksi; DILARANG membuat mock palsu
        │
        ▼
5. VERIFIKASI ULANG (Maksimal 5 Iterasi)
   Exit code 0? ──► [YA] Selesai & Laporkan ke pengguna
                └──► [TIDAK] Ulangi ke Langkah 2
```

### Panduan Ketat Tindakan Agen
1. **Dilarang Meminta Bantuan User (Zero-Human Intervention)**: Jangan pernah berkata *"Tolong jalankan perintah ini dan beritahu saya error-nya"*. Anda memiliki tool `run_command` untuk menjalankannya sendiri, membaca output terminal, dan memperbaikinya.
2. **Kepatuhan Anti-Slop (Pilar 2)**:
   - Dilarang keras menonaktifkan test gagal (`test.skip`) demi memalsukan exit code 0.
   - Dilarang mengubah asersi menjadi bernilai selalu benar (`expect(true).toBe(true)`).
   - Selalu perbaiki kode implementasi produksi terlebih dahulu.
3. **Circuit Breaker 5 Siklus**: Jika kode belum berhasil diperbaiki setelah 5 kali iterasi, hentikan loop dan evaluasi ulang arsitektur logika dasar agar tidak menghabiskan konteks.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec autonomous-tdd-debugger <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **Invarian NFR & Anti-Slop** | Nol celah OWASP Top 10, 0 kredensial hardcoded, cakupan pengujian >= 90% pada logika domain, 0 pelanggaran Anti-Slop; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
