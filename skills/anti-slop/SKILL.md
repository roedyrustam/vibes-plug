---
name: anti-slop
description: "Comprehensive Anti-AI Slop enforcement guide. Eliminates conversational pleasantries, placeholder code, truncated implementations, hallucinated packages, speculative over-engineering, and decorative comments / Panduan penegakan anti-AI slop komprehensif. Menghapus basa-basi AI, placeholder code, implementasi terpotong, paket halusinasi, dan komentar dekoratif."
author: "Roedy Rustam"
---

# Anti-Slop Protocol & Quality Gate (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
The absolute zero-tolerance standard against AI slop in code generation, conversational interaction, architectural design, and documentation. AI slop manifests as lazy code truncation, filler pleasantries, speculative over-engineering, decorative comments narrating syntax, and vague buzzword-bloated documents. This skill enforces rigorous, deterministic anti-slop rules across the entire engineering lifecycle.

### Trigger Conditions
- Any code generation or modification task.
- Automated code reviews, PR audits, and pre-commit checks.
- Codebase exhibiting "AI smell" — placeholder comments, unnecessary abstraction layers, duplicate guards, or syntax narration.
- When configuring AI coding assistants to operate in strict, token-efficient, production-grade mode.

---

## The 5 Pillars of AI Slop Elimination

```
                      ┌───────────────────────────────────────┐
                      │        THE ANTI-SLOP STANDARD         │
                      │    Zero Tolerance Engineering (2026)  │
                      └──────────────────┬────────────────────┘
                                         │
    ┌────────────────┬───────────────────┼───────────────────┬────────────────┐
    ▼                ▼                   ▼                   ▼                ▼
[Pillar 1]       [Pillar 2]          [Pillar 3]          [Pillar 4]       [Pillar 5]
Conversational   Placeholder /       Speculative         Decorative       Buzzword &
Sycophancy Slop  Truncation Slop     Over-Engineering    Comment Slop     Artifact Slop
- No pleasantries- No // TODO        - No fake factories - No syntax logs - No empty PRDs
- Direct & terse - Full runnable code- Trust types       - Explain "why"  - Concrete specs
```

---

### Pillar 1: Conversational & Sycophancy Slop

AI models frequently default to conversational filler that wastes context tokens, slows down developer velocity, and adds zero technical value.

#### 🔴 The Slop Patterns (Strictly Forbidden):
- **Sycophantic Preambles**: *"Certainly! I'd be more than happy to help you with that problem!"*, *"That is an excellent architectural question!"*
- **Prompt Echoing / Restatement**: Repeating the user's prompt verbatim before starting the work.
- **Apology Loops**: *"I deeply apologize for the previous confusion, let me try again..."*
- **Trailing Motivational Fluff**: *"In conclusion, this solution creates a robust, cutting-edge foundation for your revolutionary application. I hope this helps! Feel free to ask if you have any questions!"*

#### ✅ The Anti-Slop Standard:
- **Imperative & Direct**: Begin immediately with the solution, code diff, or architectural answer.
- **Code-First Communication**: When code is requested, present the code or diff first, followed by concise technical rationale if necessary.
- **Zero Filler**: No apologies, no cheerleading, no conversational framing.

---

### Pillar 2: Placeholder & Truncation Slop ("Lazy LLM" Syndrome)

The most destructive form of AI slop is incomplete code containing placeholders, which forces the human developer to manually finish or debug broken snippets.

#### 🔴 The Slop Patterns (Strictly Forbidden):
```typescript
// 🔴 SLOP 1: The Truncation Placeholder
export function processOrder(order: Order) {
  validateOrder(order);
  // ... rest of the implementation remains the same ...
  // TODO: Add database persistence here
  return { status: 'success' };
}

// 🔴 SLOP 2: Mock Arrays Masquerading as Production Features
export async function getTeamMembers(orgId: string): Promise<User[]> {
  // Mock data for now — replace with real DB query later
  return [
    { id: '1', name: 'Alice', role: 'Admin' },
    { id: '2', name: 'Bob', role: 'Member' },
  ];
}

// 🔴 SLOP 3: Stubbed Error Handlers
catch (error) {
  // Handle error here
  console.log(error);
}
```

#### ✅ The Anti-Slop Standard:
Every code output must be **100% complete, functional, and production-ready**:
```typescript
// ✅ CLEAN: Fully implemented with real ORM query, transactions, and error propagation
import { db } from '@/lib/db';
import { orders, orderItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function processOrder(order: Order): Promise<ProcessOrderResult> {
  validateOrder(order);

  return await db.transaction(async (tx) => {
    const [created] = await tx.insert(orders).values({
      userId: order.userId,
      totalAmount: order.totalAmount,
      status: 'confirmed',
      createdAt: new Date(),
    }).returning();

    await tx.insert(orderItems).values(
      order.items.map((item) => ({
        orderId: created.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }))
    );

    return { orderId: created.id, status: 'confirmed' };
  });
}
```

---

### Pillar 3: Speculative & Decorative Over-Engineering Slop

AI models frequently invent unnecessary abstractions, creating 4 interfaces, 2 abstract classes, and a factory pattern for a utility that only has one single implementation.

#### 🔴 The Slop Patterns (Strictly Forbidden):
- Creating `IUserServiceFactoryProvider` for a standard Supabase query.
- Defensive validation overload: triple-checking `if (id !== undefined && id !== null && typeof id === 'string' && id.length > 0)` when TypeScript strict mode and Zod already guarantee type safety.
- Hallucinated npm packages or obsolete APIs from earlier major versions.

#### ✅ The Anti-Slop Standard:
- **YAGNI (You Aren't Gonna Need It)**: Write the simplest direct implementation that solves the current requirement.
- **Trust The Types**: Leverage TypeScript 5.8+ strict types and Zod schemas instead of cluttering runtime code with redundant defensive assertions.

---

### Pillar 4: Obvious & Decorative Comment Slop

AI models love to narrate the obvious syntax of code rather than documenting architectural decisions, edge-case constraints, or non-obvious business rules.

#### 🔴 The Slop Patterns (Strictly Forbidden):
```typescript
// 🔴 SLOP: Narrating syntax line-by-line
// Import React from react
import React from 'react';

// Create a state variable for count initialized to 0
const [count, setCount] = useState<number>(0);

// Function to handle increment
const handleIncrement = () => {
  // Increment count by 1
  setCount(count + 1);
};

// Return the button component
return <button onClick={handleIncrement}>Increment</button>;
```

#### ✅ The Anti-Slop Standard:
Comments should **only explain WHY, never WHAT**:
```typescript
// ✅ CLEAN: Code is self-explanatory; comment only explains the subtle timing quirk
const [count, setCount] = useState<number>(0);

const handleIncrement = () => {
  // Functional update prevents stale closure when triggered rapidly in batch events
  setCount((prev) => prev + 1);
};

return <button onClick={handleIncrement}>Increment</button>;
```

---

### Pillar 5: Buzzword & Artifact Slop

Documentation generated by AI often contains hundreds of words of synthetic marketing jargon ("seamless integration", "cutting-edge paradigm", "robust synergy") with zero technical density.

#### 🔴 The Slop Patterns:
- PRDs filled with generic goals: *"Build a cutting-edge, scalable AI-powered platform to empower users worldwide."*
- API specs missing request/response schemas, status codes, and error models.
- Empty template sections left untouched.

#### ✅ The Anti-Slop Standard:
- **High Technical Density**: Every document must contain explicit entity schemas, concrete HTTP route tables, exact database column types, and verifiable NFR latency budgets.

---

## Anti-Slop Automated Detection Heuristics (RegEx)

Use these regex patterns in your linting pipelines, pre-commit hooks, or `grep_search` to catch AI slop before it enters source control:

| Slop Category | Detection RegEx Pattern | Target |
| :--- | :--- | :--- |
| **Lazy Truncation** | `(?i)(rest of the code|implementation goes here|logic here|todo:?\s*implement)` | Source code |
| **Placeholder Dots** | `\/\/\s*\.\.\.\s*(code|implementation|rest)` | Source code |
| **Mock Remnants** | `(?i)(mock data for now|hardcoded for testing|stub implementation)` | Production code |
| **Conversational Slop** | `(?i)^(certainly!|sure,|as an ai language model|in conclusion,)` | Agent responses / Markdown |
| **Syntax Narration** | `(?i)\/\/\s*(import\s+\w+|return\s+\w+|increment\s+\w+|set\s+state)` | Source code |
| **Buzzword Density** | `(?i)\b(seamlessly integrated|cutting-edge paradigm|game-changer|delve into)\b` | Documentation |

---

## Automated Anti-Slop Audit Script (`scripts/check-anti-slop.js`)

Run this script in CI to enforce the Zero-Slop Standard across your repository:

```javascript
#!/usr/bin/env node
// scripts/check-anti-slop.js - Zero Tolerance AI Slop Linter
const fs = require('fs');
const path = require('path');

const SLOP_PATTERNS = [
  { name: 'Lazy Truncation', regex: /\/\/\s*\.\.\.\s*(rest|code|implement)/i },
  { name: 'Unfinished TODO Stub', regex: /\/\/\s*TODO:\s*(implement|add logic|fill in)/i },
  { name: 'Mock Data in Prod', regex: /\/\/\s*mock data for now/i },
  { name: 'Syntax Narration', regex: /\/\/\s*(increment\s+\w+|return\s+(the\s+)?\w+|import\s+\w+\s+from)/i },
];

const IGNORE_DIRS = ['node_modules', '.git', '.next', 'dist', 'build'];

let hasSlop = false;

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (IGNORE_DIRS.includes(file)) continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (/\.(ts|tsx|js|jsx|py|go|rs)$/.test(file)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        SLOP_PATTERNS.forEach(({ name, regex }) => {
          if (regex.test(line)) {
            console.error(`🚨 [AI SLOP DETECTED] ${fullPath}:${index + 1} (${name}) -> ${line.trim()}`);
            hasSlop = true;
          }
        });
      });
    }
  }
}

scanDir(process.cwd());

if (hasSlop) {
  console.error('\n❌ Repository failed Anti-Slop Audit. Remove all placeholder stubs and syntax narration.');
  process.exit(1);
} else {
  console.log('✅ Anti-Slop Audit Passed: Zero AI Slop detected.');
}
```

---

## Orchestration & Integration

- **`vibe-code-gardener`**: Detects and purges existing dead code, bloated components, and duplicate guards in legacy projects.
- **`token-saver`**: Minimizes context consumption and forces concise, direct response styles.
- **`scalability-clean-code`**: Enforces SOLID, DRY, and clean architecture boundaries against speculative over-engineering.
- **`autonomous-tdd-debugger`**: Validates that all implemented code passes real execution tests without stubbing.
- **`zero-to-prod-orchestrator`**: Incorporates anti-slop checks at Phase 1, Phase 2, Phase 5, and Phase 6.
- **`production-ready-hardener`**: Gates pre-deployment audit with zero-placeholder enforcement.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Standar ketat nol-toleransi terhadap AI slop pada pembuatan kode sumber, interaksi percakapan, desain arsitektur, dan dokumentasi. AI slop muncul dalam bentuk kode terpotong dengan placeholder malas, basa-basi percakapan, *over-engineering* spekulatif, komentar dekoratif yang hanya menarasikan sintaksis, serta dokumen penuh istilah klise (*buzzwords*). Skill ini menegakkan standar anti-slop deterministik di seluruh siklus hidup pengembangan.

### Kondisi Pemicu
- Setiap tugas pembuatan atau modifikasi kode sumber.
- Audit review kode otomatis, validasi PR, dan verifikasi pre-commit git.
- Codebase menunjukkan tanda "AI smell" — komentar placeholder, layer abstraksi berlebihan, validasi berlapis ganda yang sia-sia, atau komentar sintaksis.
- Konfigurasi asisten AI agar beroperasi dalam mode hemat token, ringkas, dan berstandar produksi.

---

### 5 Pilar Utama Pembasmian AI Slop

1. **Pilar 1: Eliminasi Basa-Basi & Sycophancy Percakapan**
   - **Dilarang**: *"Tentu saja! Saya akan dengan senang hati membantu Anda!"*, mengulang pertanyaan pengguna sebelum bekerja, dan kesimpulan panjang penuh pujian.
   - **Standar**: Langsung pada solusi teknis, kode-terlebih-dahulu (*code-first*), tanpa pengantar basa-basi.

2. **Pilar 2: Larangan Keras Kode Terpotong / Placeholder ("Lazy LLM")**
   - **Dilarang**: `// TODO: implementasi nanti`, `// ... sisa kode tidak berubah ...`, atau mengembalikan array data tiruan (*mock*) saat implementasi produksi diminta.
   - **Standar**: Setiap potongan kode yang dihasilkan **WAJIB 100% lengkap, dapat dijalankan, dan siap produksi**. Tidak ada bagian yang diabaikan.

3. **Pilar 3: Anti Over-Engineering Spekulatif**
   - **Dilarang**: Membuat factory pattern atau 5 layer abstraksi untuk satu fungsi sederhana yang tidak akan pernah bercabang. Validasi ganda berlebihan saat tipe data sudah dijamin oleh TypeScript dan Zod.
   - **Standar**: Terapkan prinsip YAGNI (You Aren't Gonna Need It). Percayai sistem tipe.

4. **Pilar 4: Eliminasi Komentar Dekoratif Sintaksis**
   - **Dilarang**: Mengomentari apa yang sudah jelas tertulis pada sintaksis (contoh: `// import React`, `// tambah count dengan 1`, `// kembalikan hasil user`).
   - **Standar**: Komentar hanya boleh menjelaskan **MENGAPA (alasan bisnis, pertimbangan arsitektur, batasan non-obvious)**, bukan **APA** yang dilakukan sintaksis.

5. **Pilar 5: Eliminasi Slop Dokumen & Buzzword Kosong**
   - **Dilarang**: PRD atau dokumen arsitektur yang penuh istilah umum tanpa spesifikasi teknis (seperti "solusi sinergis revolusioner").
   - **Standar**: Densitas teknis tinggi dengan skema tabel database konkret, route API eksplisit, dan metrik NFR yang terukur.

---

## Integrasi Orkestrasi

- **`vibe-code-gardener`**: Membersihkan kode mati dan komponen membengkak pada proyek yang terlanjur terkotori vibe-coding.
- **`token-saver`**: Mengoptimalkan anggaran token dan memaksa gaya interaksi ringkas.
- **`scalability-clean-code`**: Menjaga prinsip SOLID dan Clean Architecture agar terhindar dari abstraksi spekulatif.
- **`autonomous-tdd-debugger`**: Memastikan setiap fitur memiliki test nyata yang lolos tanpa fungsi palsu (*stubs*).
- **`zero-to-prod-orchestrator`**: Mengintegrasikan gerbang anti-slop pada Fase 1, 2, 5, dan 6.
- **`production-ready-hardener`**: Mengunci rilis produksi dengan audit nol-placeholder.
