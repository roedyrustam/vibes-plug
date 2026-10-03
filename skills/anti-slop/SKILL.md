---
name: anti-slop
description: "Sovereign Anti-AI Slop Directive & Enforcement Engine. Absolute zero-tolerance standard for lazy placeholders, conversational fluff, syntax narration, speculative over-engineering, and hallucinated code / Doktrin dan mesin penegakan anti-AI slop mutlak. Standar nol toleransi terhadap placeholder malas, basa-basi, komentar sintaksis, dan over-engineering."
author: "Roedy Rustam"
version: "4.2.0"
---

# Sovereign Anti-AI Slop & Code Gardening Protocol (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Executive Directive & Trigger Conditions
The **Sovereign Anti-Slop Directive** is the uncompromising zero-tolerance standard governing all AI agent actions across the vibes-plug swarm. AI slop degrades developer trust, burns context tokens, bloats codebases, and introduces catastrophic production defects.

**Universal Trigger Conditions:**
- **Every Code Generation / Modification**: Every function, component, or file created or modified by any agent.
- **Automated Quality Gates & PR Audits**: Code reviews (`coderabbit`), TDD loops (`autonomous-tdd-debugger`), and production release hardening (`production-ready-hardener`).
- **Ideation & Documentation Generation**: Product requirement documents (`PRD.md`), architectural blueprints, API contracts, and database schemas.
- **Legacy Refactoring & Gardening**: Whenever a codebase exhibits "AI smell" (inconsistent formatting, dead utility graveyards, duplicate logic, phantom dependencies).

---

## The 6 Pillars of AI Slop Elimination

```
                           ┌──────────────────────────────────────────────┐
                           │   SOVEREIGN ZERO-TOLERANCE ANTI-SLOP CORE    │
                           └──────────────────────┬───────────────────────┘
                                                  │
       ┌──────────────────┬───────────────────────┼───────────────────────┬──────────────────┐
       │                  │                       │                       │                  │
┌──────▼──────┐    ┌──────▼──────┐         ┌──────▼──────┐         ┌──────▼──────┐    ┌──────▼──────┐
│  PILLAR 1   │    │  PILLAR 2   │         │  PILLAR 3   │         │  PILLAR 4   │    │  PILLAR 5   │
│Conversational│   │ Placeholders│         │ Over-Engin- │         │ Syntax Nar- │    │ Ghost & AI  │
│& Sycophancy │    │& Lazy Stubs │         │ eering/YAGNI│         │   ration    │    │ Smells/Logs │
└─────────────┘    └─────────────┘         └─────────────┘         └─────────────┘    └─────────────┘
                                                  │
                                           ┌──────▼──────┐
                                           │  PILLAR 6   │
                                           │   PRD/Doc   │
                                           │  Marketing  │
                                           └─────────────┘
```

### Pillar 1: Conversational & Sycophancy Slop
Eliminate robotic pleasantries, apologies, prompt echoing, and synthetic cheerleading. Communication must be imperative, direct, and code-first.
- **🔴 Forbidden**:
  - Conversational preambles: *"Certainly! I'd be happy to write that component for you."*
  - Prompt mirroring: *"You asked me to create a Next.js 15 route handler with Prisma..."*
  - Synthetic apologies: *"I apologize for that oversight! Let me fix it immediately."*
  - Trailing fluff: *"I hope this helps! Feel free to ask if you have any questions or need further tweaks!"*
- **✅ Sovereign Standard**:
  - Code-first delivery. State the action in 1 imperative sentence, provide the complete code, and summarize architectural decisions concisely.

### Pillar 2: Placeholder & Lazy Truncation Slop ("Lazy LLM")
Never deliver partial or pseudo-code disguised as real implementations.
- **🔴 Forbidden**:
  - Truncated comments: `// ... rest of code unchanged ...` or `// ... existing imports ...`.
  - Lazy stubs: `// TODO: implement later` or `throw new Error("Not implemented")`.
  - Half-implemented branches: `switch (action) { case 'ADD': ... default: break; }` when 5 actions were specified.
  - Fake mock data in production logic: `const users = [{ id: 1, name: 'John Doe' }]; // mock data for now`.
- **✅ Sovereign Standard**:
  - 100% complete, fully implemented, working code on the first attempt. If a file is modified, output all required contiguous lines with precision.

### Pillar 3: Speculative & Over-Engineering Slop (Hyper-YAGNI)
Never construct speculative abstraction layers for hypothetical future requirements.
- **🔴 Forbidden**:
  - Creating `IUserServiceFactoryStrategyProvider` when a single concrete function handles the task.
  - Wrapping every function in 4 layers of unnecessary DTOs, mappers, and custom wrapper objects.
  - Defensive overkill: 5 levels of optional chaining (`user?.profile?.settings?.theme?.color`) when TypeScript strict mode and Zod validation already guarantee the shape.
- **✅ Sovereign Standard**:
  - Strict YAGNI (You Aren't Gonna Need It). Write the most direct, maintainable, readable implementation. Trust schema contracts and static types.

### Pillar 4: Syntax-Narration & Obvious Comments
Comments must never rephrase what the code syntax already says.
- **🔴 Forbidden**:
  - `// Increment count by 1` before `count += 1;`
  - `// Return the user object` before `return user;`
  - `// Import react dependencies` before `import React from 'react';`
  - Commented-out zombie code left behind: `// const oldData = fetchLegacy();`
- **✅ Sovereign Standard**:
  - Comments explain **WHY** (domain invariants, upstream vendor bugs, race condition guards, performance workarounds), never **WHAT**. Dead code is deleted permanently; version control tracks history.

### Pillar 5: Ghost Hallucinations & AI Smells
Prevent synthetic errors caused by statistical guessing.
- **🔴 Forbidden**:
  - Inventing npm/PyPI packages or calling fabricated library methods that do not exist.
  - Silent error suppression: `try { ... } catch (e) {}` (empty catch blocks that hide bugs).
  - Leaving debugging debris: `console.log(...)`, `debugger;`, or `print(...)` in production files.
  - Hardcoded fake secrets: `const SECRET = "placeholder_secret_123"`.
- **✅ Sovereign Standard**:
  - Import only verified packages and methods matching the project's exact dependencies.
  - Handle errors explicitly via structured loggers (`Pino`, `Sentry`) and typed domain errors (RFC 9457). Zero-tolerance for empty catch blocks.

### Pillar 6: PRD & Documentation Marketing Slop
Documentation must be technical, high-density, and actionable—not marketing hype.
- **🔴 Forbidden**:
  - Buzzword bingo: *"This cutting-edge solution provides seamless, robust synergy for enhanced user delight."*
  - Vague requirements: *"System should be fast and responsive."*
- **✅ Sovereign Standard**:
  - High technical density: Concrete PostgreSQL DDL schemas, exact REST/RPC JSON contracts with HTTP status codes, explicit state machine transition tables, and measurable NFR latency budgets (e.g., *p95 < 45ms at 5,000 req/sec*).

---

## Slop vs. Sovereign Implementation Matrix

### 1. Frontend & UI (React 19 / TypeScript)

#### ❌ AI Slop Anti-Pattern
```tsx
// Component for user list
export function UserList() {
  // Mock data for now
  const users = [{ id: '1', name: 'Alice' }];
  
  // TODO: connect with backend API later
  return (
    <div>
      {/* Loop through users */}
      {users.map(u => (
        <div key={u.id}>{u.name}</div>
      ))}
    </div>
  );
}
```

#### ✅ Sovereign Standard
```tsx
import { use } from 'react';
import type { User } from '@/types/user';

interface UserListProps {
  usersPromise: Promise<User[]>;
}

export function UserList({ usersPromise }: UserListProps) {
  const users = use(usersPromise);

  if (users.length === 0) {
    return <p className="text-sm text-neutral-500">No users found.</p>;
  }

  return (
    <ul className="divide-y divide-neutral-200">
      {users.map((user) => (
        <li key={user.id} className="py-2 text-sm font-medium text-neutral-900">
          {user.name}
        </li>
      ))}
    </ul>
  );
}
```

---

### 2. Backend & API (Node.js / Bun / Fastify / Hono)

#### ❌ AI Slop Anti-Pattern
```typescript
app.post('/api/orders', async (req, res) => {
  try {
    // ... implement order logic here ...
    res.json({ success: true });
  } catch (e) {
    // silently catch error
  }
});
```

#### ✅ Sovereign Standard
```typescript
import { z } from 'zod';
import { db } from '@/lib/db';
import { orders } from '@/lib/schema';
import { logger } from '@/lib/logger';

const createOrderSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  paymentToken: z.string().min(1),
});

app.post('/api/orders', async (request, reply) => {
  const result = createOrderSchema.safeParse(request.body);
  if (!result.success) {
    return reply.status(400).send({
      type: 'https://api.example.com/errors/validation',
      title: 'Invalid order payload',
      status: 400,
      errors: result.error.flatten().fieldErrors,
    });
  }

  try {
    const [order] = await db.insert(orders).values(result.data).returning();
    return reply.status(201).send({ data: order });
  } catch (error) {
    logger.error({ err: error, body: result.data }, 'Order creation failed');
    return reply.status(500).send({
      type: 'https://api.example.com/errors/internal',
      title: 'Failed to process order',
      status: 500,
    });
  }
});
```

---

## Automated Anti-Slop Scanner Tooling

The ecosystem includes the sovereign CLI scanner in `scripts/check-anti-slop.js` (and ESM `check-anti-slop.mjs`).

### CLI Usage & Flags
```bash
# Standard repository audit
node scripts/check-anti-slop.js

# Strict mode: All warnings (syntax comments, console.logs) treated as fatal errors
node scripts/check-anti-slop.js --strict

# Auto-fix mode: Automatically purges syntax narration comments safely
node scripts/check-anti-slop.js --fix

# JSON output for CI/CD pipelines & automated quality gates
node scripts/check-anti-slop.js --json
```

### CI/CD Integration (GitHub Actions / GitLab CI)
```yaml
- name: Sovereign Anti-Slop Audit
  run: node scripts/check-anti-slop.js --strict
```

---

## Anti-Slop Swarm Gate Protocol

Every subagent spawned by the Swarm Director MUST execute this self-audit before returning work:
1. **Completeness Gate**: Are there any `// TODO`, `// ...`, or stubbed methods? *If yes, resolve before returning.*
2. **Comment Gate**: Did I write any comment that merely narrates code syntax? *If yes, purge it.*
3. **Error Gate**: Are all `catch` blocks handling errors via logger or typed exceptions? *Never swallow errors.*
4. **Console Gate**: Are there any debug `console.log` statements left behind? *Purge or replace with structured logging.*
5. **Conversational Gate**: Is the final report free of sycophantic apologies, preambles, and filler? *Ensure code-first brevity.*

---

## Orchestration & Integration
- `zero-to-prod-orchestrator`: Anti-slop quality gates enforced across all 8 phases of application delivery.
- `brainstorming`: Forbids marketing slop and mandates high-density schemas in architecture blueprints.
- `production-ready-hardener`: Mandatory pre-flight anti-slop scan prior to production deployment.
- `scalability-clean-code`: Pairs with Clean Architecture & SOLID to prevent over-engineering bloat.
- `autonomous-tdd-debugger`: Ensures tests contain real assertions without placeholder mocks or skipped suites.
- `coderabbit`: Automatically flags and blocks AI slop during pull request reviews.
- `prd-architect`: Generates data-dense specifications with concrete DDL and zero fluff.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Amanat Eksekutif & Kondisi Pemicu
**Doktrin Anti-Slop Berdaulat** adalah standar nol-toleransi yang mengatur seluruh aksi agen AI di ekosistem vibes-plug. AI slop menurunkan kepercayaan developer, memboroskan token context window, membengkakkan codebase, dan memicu bug fatal di produksi.

**Kondisi Pemicu Universal:**
- **Setiap Pembuatan / Modifikasi Kode**: Setiap fungsi, komponen, atau file yang dibuat atau diubah oleh agen AI.
- **Quality Gate Otomatis & Review PR**: Review kode (`coderabbit`), siklus perbaikan TDD (`autonomous-tdd-debugger`), dan pengerasan rilis produksi (`production-ready-hardener`).
- **Ideasi & Pembuatan Dokumentasi**: Dokumen kebutuhan produk (`PRD.md`), blueprint arsitektur, kontrak API, dan skema database.
- **Refactoring & Code Gardening**: Kapan pun codebase menunjukkan "AI smell" (inkonsistensi gaya, kuburan utilitas mati, duplikasi logika, dependensi hantu).

---

## 6 Pilar Pembasmian AI Slop

### Pilar 1: Eliminasi Basa-Basi Percakapan & Sycophancy
Hilangkan basa-basi robotik, permintaan maaf sintetis, pengulangan instruksi pengguna, dan motivasi kosong.
- **🔴 Dilarang**:
  - Basa-basi pengantar: *"Tentu! Saya dengan senang hati membuatkan komponen tersebut untuk Anda."*
  - Mengulang prompt: *"Anda meminta saya membuat route handler Next.js 15 dengan Prisma..."*
  - Permintaan maaf sintetis: *"Mohon maaf atas kekeliruan tersebut! Biarkan saya perbaiki segera."*
  - Penutup bertele-tele: *"Semoga membantu! Jangan ragu bertanya jika ada pertanyaan lain!"*
- **✅ Standar Berdaulat**:
  - Komunikasi *code-first*. Jelaskan tindakan dalam 1 kalimat imperatif, sajikan kode 100% lengkap, dan ringkas keputusan arsitektur secara padat.

### Pilar 2: Larangan Placeholder & Pemotongan Kode Malas ("Lazy LLM")
Dilarang keras menyajikan kode separuh jadi atau pseudo-code.
- **🔴 Dilarang**:
  - Kode terpotong: `// ... rest of code unchanged ...` atau `// ... existing imports ...`.
  - Placeholder malas: `// TODO: implement later` atau `throw new Error("Not implemented")`.
  - Percabangan setengah jadi saat spesifikasi meminta implementasi penuh.
  - Data palsu di logika produksi: `const users = [{ id: 1, name: 'Budi' }]; // mock data for now`.
- **✅ Standar Berdaulat**:
  - Wajib 100% lengkap, berfungsi nyata, dan siap produksi pada percobaan pertama. Jika mengedit file, hasilkan seluruh baris yang diperlukan tanpa kompromi.

### Pilar 3: Anti Over-Engineering Spekulatif (Hyper-YAGNI)
Jangan pernah membangun layer abstraksi berlebihan untuk kebutuhan spekulatif di masa depan.
- **🔴 Dilarang**:
  - Membuat *factory pattern* atau layer provider berbelit-belit untuk satu fungsi sederhana.
  - Membungkus fungsi ke dalam 4 layer DTO dan mapper tanpa kebutuhan transformasi nyata.
  - Validasi berlebihan: Melakukan pengecekan `?.` 5 tingkat ketika TypeScript strict dan Zod sudah menjamin bentuk datanya.
- **✅ Standar Berdaulat**:
  - Terapkan YAGNI secara mutlak. Tulis kode yang paling langsung, mudah dibaca, dan mudah dirawat. Percayai sistem tipe statis dan kontrak skema.

### Pilar 4: Eliminasi Komentar Sintaksis & Narasi Terang-Terangan
Komentar tidak boleh sekadar mengulang apa yang sudah jelas terbaca dari sintaks kode.
- **🔴 Dilarang**:
  - `// Tambah count dengan 1` sebelum `count += 1;`
  - `// Kembalikan objek user` sebelum `return user;`
  - `// Import dependensi react` sebelum `import React from 'react';`
  - Meninggalkan bangkai kode: `// const oldWay = fetchOld();`
- **✅ Standar Berdaulat**:
  - Komentar HANYA menjelaskan **MENGAPA** (alasan bisnis, penanganan bug upstream library, pencegahan race condition), BUKAN **APA**. Kode mati langsung dihapus; git history mencatat riwayatnya.

### Pilar 5: Pembasmian Halusinasi Hantu & AI Smells
Cegah error yang ditimbulkan dari tebakan probabilitas model AI.
- **🔴 Dilarang**:
  - Mengarang nama package atau memanggil method library yang tidak ada.
  - Menelan error secara diam-diam: `try { ... } catch (e) {}` (blok catch kosong yang menyembunyikan bug).
  - Meninggalkan sampah debugging: `console.log(...)`, `debugger;`, atau `print(...)` di file produksi.
  - Hardcode kredensial palsu: `const SECRET = "placeholder_secret_123"`.
- **✅ Standar Berdaulat**:
  - Gunakan hanya dependensi dan method yang terverifikasi sesuai versi proyek.
  - Tangani error secara eksplisit via logger terstruktur (`Pino`, `Sentry`) dan domain error terstandar (RFC 9457). Blok catch kosong dilarang mutlak.

### Pilar 6: Eliminasi Slop Dokumen & Bahasa Pemasaran
Dokumentasi teknis harus memiliki densitas teknis tinggi, bukan jargon promosi.
- **🔴 Dilarang**:
  - Kalimat klise pemasaran: *"Solusi mutakhir yang memberikan sinergi tanpa cela untuk pengalaman pengguna terbaik."*
  - Kebutuhan kabur: *"Sistem harus cepat dan responsif."*
- **✅ Standar Berdaulat**:
  - Densitas teknis tinggi: Skema DDL PostgreSQL konkret, kontrak JSON REST/RPC eksplisit dengan HTTP status code, tabel transisi state machine, dan target NFR terukur (*p95 < 45ms pada 5.000 req/dtk*).

---

## Protokol Self-Audit Anti-Slop untuk Subagent Swarm

Setiap subagent yang dijalankan oleh Swarm Director WAJIB menjalankan checklist mandiri sebelum mengembalikan hasil:
1. **Gerbang Kelengkapan**: Apakah ada `// TODO`, `// ...`, atau fungsi yang belum diimplementasikan? *Wajib diselesaikan.*
2. **Gerbang Komentar**: Apakah ada komentar yang hanya menarasikan baris kode? *Hapus segera.*
3. **Gerbang Error**: Apakah semua blok `catch` mencatat atau menangani error secara layak? *Dilarang menelan error secara diam-diam.*
4. **Gerbang Console**: Apakah masih ada jejak `console.log` debugging? *Bersihkan atau ganti dengan logger terstruktur.*
5. **Gerbang Percakapan**: Apakah respons bebas dari basa-basi dan permintaan maaf klise? *Sajikan hasil code-first.*

---

## Integrasi Orkestrasi
- `zero-to-prod-orchestrator`: Gate kualitas anti-slop ditegakkan di seluruh 8 fase siklus rekayasa perangkat lunak.
- `brainstorming`: Mencegah slop pemasaran dan mewajibkan skema konkret pada fase ideasi.
- `production-ready-hardener`: Audit anti-slop wajib sebelum rilis produksi.
- `scalability-clean-code`: Mencegah pembengkakan arsitektur dan over-engineering spekulatif.
- `autonomous-tdd-debugger`: Memastikan suite pengujian memiliki asersi nyata tanpa mock tiruan.
- `coderabbit`: Mendeteksi dan memblokir AI slop secara otomatis pada review pull request.
- `prd-architect`: Memastikan dokumen PRD bebas dari kata-kata marketing kosong.