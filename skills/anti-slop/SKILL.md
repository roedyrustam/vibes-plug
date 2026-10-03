---
name: anti-slop
description: "Sovereign Anti-AI Slop Directive & Enforcement Engine. Absolute zero-tolerance standard for lazy placeholders, conversational fluff, syntax narration, speculative over-engineering, hallucinated code, and generic UI clichés / Doktrin dan mesin penegakan anti-AI slop mutlak. Standar nol toleransi terhadap placeholder malas, basa-basi, komentar sintaksis, over-engineering, dan klise visual UI."
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
- **Frontend & UI Work**: Component design, page layout, theming, dashboards, and animations.
- **Ideation & Documentation Generation**: Product requirement documents (`PRD.md`), architectural blueprints, API contracts, and database schemas.
- **Legacy Refactoring & Gardening**: Whenever a codebase exhibits "AI smell" (inconsistent formatting, dead utility graveyards, duplicate logic, phantom dependencies).

---

## The 7 Pillars of AI Slop Elimination

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
                                  ┌───────────────┴───────────────┐
                                  │                               │
                           ┌──────▼──────┐                 ┌──────▼──────┐
                           │  PILLAR 6   │                 │  PILLAR 7   │
                           │   PRD/Doc   │                 │ UI & Visual │
                           │  Marketing  │                 │ Sanitation  │
                           └─────────────┘                 └─────────────┘
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

### Pillar 7: UI & Visual Sanitation (Anti-Slop UI)
Interfaces must look authentically crafted by elite product designers, firmly rooted in `DESIGN.md`, rather than statistically hallucinated from generic LLM training data.

#### The 6 Visual Sub-Dimensions:
1. **Color & Palette Sanitation**:
   - 🚫 **Banned**: Generic blue-purple/neon gradients (`#3B82F6` -> `#8B5CF6`), blurred neon radial orbs behind hero headlines, full-page colored glow, forced dark mode without product rationale, and unrestrained palette bloat (>3 core colors).
   - ✅ **Standard**: Derive palette strictly from `DESIGN.md` in OKLCH space. Limit gradients strictly to functional hierarchy markers with written rationale. Single deliberate accent color.
2. **Surface & Depth Discipline**:
   - 🚫 **Banned**: Excessive glassmorphism (`backdrop-blur` on navbar, cards, modals, and sidebar simultaneously; dose cap: 1-2 elements), pill-shape radius fatigue (every primitive `rounded-full`), giant zero-gravity floating shadows (`shadow-2xl`), and ambient outer glow wrapped around cards.
   - ✅ **Standard**: Crisp solid borders (`border-neutral-200 dark:border-neutral-800`), structured 3-tier radius scale (6px/10px/16px), subtle directional elevation (`shadow-sm`/`shadow-md`), and matte card surfaces.
3. **Layout & Rhythm Diversity**:
   - 🚫 **Banned**: The rigid AI landing formula (Hero -> Logo Bar -> 3 Cards -> 3 Steps -> Bento Grid -> Pricing -> Testimonials -> FAQ -> Footer), uniform spacing scales, copy-paste feature cards with identical visual weight, default bento grid mosaics, and fabricated 3-step "How It Works" flows.
   - ✅ **Standard**: Purposeful layout tailored to real user journeys, asymmetric compositions, dedicated full-width spotlights for flagship features, and honest section counts.
4. **Decorative Elements & Typography**:
   - 🚫 **Banned**: Generic AI sparkles (✨, ⚡, 🪄), uniform Lucide icon clones without brand styling, decorative emojis scattered in copy/headings/CTAs (🚀, 🔥, ✅), trailing arrows on every button (`→`), redundant eyebrow badges repeating the H1, fake pulsing status dots (`animate-ping`), and fake terminal windows with traffic-light buttons.
   - ✅ **Standard**: Domain-authentic icons, clean typography hierarchy, real status lights marking verified live telemetry, and authentic product UI screenshots.
5. **Dashboard & Application Shells**:
   - 🚫 **Banned**: Cookie-cutter *sidebar + topbar + 4 stat cards + chart + table* templates, invented KPI numbers (`12,842`) with fake green deltas (`+12%`), charts without an explicit question, generic table columns, filler form data (`John Doe`), and unhelpful empty states (*"No data"* spinner).
   - ✅ **Standard**: Layout built around the **Single Deciding Action** of the screen, verified real data or explicit domain placeholders (`[Active Subscribers]`), and actionable empty states with a direct CTA button.
6. **Motion & Interaction Discipline**:
   - 🚫 **Banned**: Perpetual motion loops (floating cards, endless pulsating badges), stacked entrance animations on scroll (fade-in + slide-up + scale + bounce).
   - ✅ **Standard**: Animation triggered only by user interaction or state transition; elements remain static once mounted; strictly adhere to `prefers-reduced-motion: reduce`.
7. **3D & Spatial Visualization Sanitation (`3Dviz`)**:
   - 🚫 **Banned**: Floating neon orbs masquerading as spatial concepts, generic primitive proxies dressed up with high-resolution textures, accidental seams at skin junctions, colliders that fail to enclose overhangs or wings, and claiming scientific accuracy for unverified numerical visuals.
   - ✅ **Standard**: Rigorous object craft across 3 scales (silhouette, construction, surface), deliberate join continuity, grounded scientific verification (Claim → Model → Visual), fixed-timestep simulation, and adherence to the 16-point 3D visual review prompts (`web-3d-graphics-expert`).

---

## 15-Point Sovereign UI Delivery Checklist

Run this checklist alongside code review before completing any frontend/UI task:
- [ ] **1. Brand Identity Anchor**: Palette derived from `DESIGN.md`, zero generic blue-purple or neon gradients.
- [ ] **2. Single Focal Accent**: Accent color used only for primary conversion moments.
- [ ] **3. Zero Decorative Emoji**: Copy and UI headers completely free of emojis (🚀, ✨, 🔥, ✅).
- [ ] **4. Rhythm Variation**: Section layouts vary dynamically instead of repeating uniform 3-card grids.
- [ ] **5. No Default Bento or Fake Terminals**: Layout free from cliché bento mosaics and fake traffic-light terminal windows.
- [ ] **6. Headline Cleanliness**: Area above H1 free from redundant category pills repeating the headline.
- [ ] **7. Functional Navigation**: Every link and button has a working destination or clear "Coming soon" state.
- [ ] **8. Motion Purpose**: All animations have purpose, zero endless loops, and respect `prefers-reduced-motion`.
- [ ] **9. Glass & Glow Dose Caps**: Frosted glass limited to max 1-2 elements; zero ambient glow on standard cards.
- [ ] **10. Status Dot Honesty**: Status dots reflect real runtime telemetry; zero decorative pulsing loops.
- [ ] **11. Purpose-Driven Dashboards**: Screen structured around the user's core decision, not a cookie-cutter shell.
- [ ] **12. Authentic Metrics**: KPI stats and chart axes wired to real queries or labeled domain placeholders.
- [ ] **13. Clean Input Placeholders**: Forms and tables free from lazy `John Doe` / `Lorem Ipsum` filler.
- [ ] **14. Actionable Empty States**: Empty states state the cause and provide a direct CTA button.
- [ ] **15. Responsive & Accessible**: Passes WCAG 2.2 contrast (4.5:1 text, 3:1 UI) and keyboard-only navigation.

---

## Slop vs. Sovereign Implementation Matrix

### 1. Frontend & UI (React 19 / TypeScript / Tailwind CSS v4)

#### ❌ AI Slop Anti-Pattern (Code & Visual Slop)
```tsx
// Landing page hero component
export function Hero() {
  // TODO: connect with marketing analytics
  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Blurred neon orb slop */}
      <div className="absolute w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-30 animate-pulse" />
      
      {/* Glass card with blue-to-purple gradient and emoji */}
      <div className="relative z-10 backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-full shadow-2xl">
        {/* Redundant eyebrow badge */}
        <span className="px-3 py-1 rounded-full text-xs bg-purple-600/30 text-purple-300">
          ✨ Powered by AI 2.0
        </span>
        
        {/* Decorative emoji in heading */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          🚀 Supercharge Your Workflow With AI
        </h1>
        
        {/* Button with decorative trailing arrow */}
        <button className="mt-4 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg shadow-purple-500/50">
          Get Started Now →
        </button>
      </div>
    </div>
  );
}
```

#### ✅ Sovereign Standard (Clean Code & Authentic Design)
```tsx
import type { ReactNode } from 'react';

interface HeroProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  onCtaClick: () => void;
  previewWidget?: ReactNode;
}

export function Hero({
  headline,
  subheadline,
  ctaText,
  onCtaClick,
  previewWidget,
}: HeroProps) {
  return (
    <section className="relative px-6 py-20 lg:py-32 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <p className="text-xs font-semibold tracking-wider uppercase text-neutral-500">
            Enterprise Invoicing Engine
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
            {headline}
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-xl">
            {subheadline}
          </p>
          <div className="pt-2 flex items-center gap-4">
            <button
              type="button"
              onClick={onCtaClick}
              className="px-5 py-2.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium text-sm transition-colors hover:bg-neutral-800 dark:hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 dark:focus-visible:ring-neutral-50 focus-visible:ring-offset-2"
            >
              {ctaText}
            </button>
          </div>
        </div>
        {previewWidget && (
          <div className="lg:col-span-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            {previewWidget}
          </div>
        )}
      </div>
    </section>
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

# Strict mode: All warnings (syntax comments, console.logs, UI slop) treated as fatal errors
node scripts/check-anti-slop.js --strict

# Auto-fix mode: Automatically purges syntax narration comments safely
node scripts/check-anti-slop.js --fix

# JSON output for CI/CD pipelines & automated quality gates
node scripts/check-anti-slop.js --json
```

---

## Anti-Slop Swarm Gate Protocol

Every subagent spawned by the Swarm Director MUST execute this self-audit before returning work:
1. **Completeness Gate**: Are there any `// TODO`, `// ...`, or stubbed methods? *If yes, resolve before returning.*
2. **Comment Gate**: Did I write any comment that merely narrates code syntax? *If yes, purge it.*
3. **Error Gate**: Are all `catch` blocks handling errors via logger or typed exceptions? *Never swallow errors.*
4. **Console Gate**: Are there any debug `console.log` statements left behind? *Purge or replace with structured logging.*
5. **Conversational Gate**: Is the final report free of sycophantic apologies, preambles, and filler? *Ensure code-first brevity.*
6. **UI & Visual Gate**: For all UI tasks, verify zero generic blue-purple gradients, no bento defaults, no fake metrics, no decorative emojis, and strict compliance with `DESIGN.md` using the 15-point checklist.

---

## Orchestration & Integration
- `zero-to-prod-orchestrator`: Anti-slop quality gates enforced across all 8 phases of application delivery (especially Phase 5 UI and Phase 6 Quality Audit).
- `brainstorming`: Forbids marketing slop and mandates high-density schemas in architecture blueprints.
- `production-ready-hardener`: Mandatory pre-flight anti-slop scan prior to production deployment.
- `design-system-architect`: Enforces OKLCH design tokens and Tailwind CSS v4 `@theme` compliance without arbitrary visual slop.
- `senior-frontend`: Builds React 19 / Next.js 15 App Router interfaces compliant with both code and visual anti-slop rules.
- `ui-ux-pro-max`: Provides BM25 design heuristics and layout pairings free of cookie-cutter templates.
- `web-3d-graphics-expert`: Enforces 3Dviz spatial reasoning, object craft across 3 scales, join continuity, and physical collision envelopes without superficial 3D slop.
- `tailwind-expert`: Configures clean utility classes without inline style bloat.
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
- **Pekerjaan Frontend & UI**: Desain komponen, tata letak halaman, tema, dashboard, dan animasi.
- **Ideasi & Pembuatan Dokumentasi**: Dokumen kebutuhan produk (`PRD.md`), blueprint arsitektur, kontrak API, dan skema database.
- **Refactoring & Code Gardening**: Kapan pun codebase menunjukkan "AI smell" (inkonsistensi gaya, kuburan utilitas mati, duplikasi logika, dependensi hantu).

---

## 7 Pilar Pembasmian AI Slop

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

### Pilar 7: Sanitasi Visual & UI (Anti-Slop UI)
Antarmuka wajib terasa dirancang secara otentik oleh desainer produk elit, berakar kuat pada identitas `DESIGN.md`, bukan tebakan template hafalan LLM.

#### 6 Dimensi Visual Anti-Slop:
1. **Sanitasi Warna & Palet**:
   - 🚫 **Dilarang**: Gradien biru-ungu/neon klise (`#3B82F6` -> `#8B5CF6`), bulatan orbe cahaya radial buram di latar belakang hero, glow berlebih seluruh halaman, pemaksaan mode gelap tanpa kebutuhan domain, dan palet warna berantakan (>3 warna utama).
   - ✅ **Standar**: Ambil palet dari `DESIGN.md` berbasis OKLCH. Batasi gradien hanya untuk fungsi hierarki dengan alasan tertulis. Satu warna aksen terarah.
2. **Disiplin Permukaan & Kedalaman**:
   - 🚫 **Dilarang**: Glassmorphism berlebihan (`backdrop-blur` pada navbar, kartu, modal, dan sidebar serentak; batas: 1-2 elemen), kelelahan bentuk kapsul (semua elemen `rounded-full`), bayangan mengambang tanpa dasar (`shadow-2xl`), dan glow ambient pada kartu biasa.
   - ✅ **Standar**: Border tegas (`border-neutral-200 dark:border-neutral-800`), skala radius 3 tingkat teratur (6px/10px/16px), elevasi halus terarah (`shadow-sm`/`shadow-md`), dan permukaan kartu matte.
3. **Variasi Tata Letak & Ritme**:
   - 🚫 **Dilarang**: Formula monoton landing page AI (Hero -> Logo -> 3 Kartu -> 3 Langkah -> Bento Grid -> Harga -> Testimoni -> FAQ -> Footer), jarak seragam tanpa ritme, kartu fitur salin-tempel berbobot sama, bento grid hafalan, dan alur 3 langkah palsu.
   - ✅ **Standar**: Tata letak berbasis alur perjalanan pengguna riil, komposisi asimetris, perlakuan khusus (*spotlight*) untuk fitur unggulan, dan jumlah seksi yang jujur.
4. **Elemen Dekoratif & Tipografi**:
   - 🚫 **Dilarang**: Ikon kilau AI generik (✨, ⚡, 🪄), kloning ikon tipis Lucide seragam tanpa karakter merek, emoji dekoratif pada teks UI (🚀, 🔥, ✅), panah `→` di setiap tombol, badge kapsul redundan di atas judul H1, titik status berdenyut tanpa telemetri nyata, dan terminal tiruan dengan tombol lampu lalu lintas.
   - ✅ **Standar**: Ikon presisi domain, hierarki tipografi tegas, lampu status riil berbasis telemetri langsung, dan screenshot produk otentik.
5. **Dashboard & Shell Aplikasi**:
   - 🚫 **Dilarang**: Template hafalan *sidebar + topbar + 4 kartu statistik + chart + table*, angka metrik rekaan (`12.842`) dengan delta hijau palsu (`+12%`), grafik tanpa pertanyaan keputusan yang jelas, kolom tabel generik, data tiruan formulir (`John Doe`), dan state kosong tanpa petunjuk aksi.
   - ✅ **Standar**: Tata letak dibangun di sekitar **Satu Keputusan Utama Pengguna**, data riil atau placeholder berlabel eksplisit (`[Jumlah Faktur]`), dan state kosong yang menyediakan tombol CTA langsung.
6. **Disiplin Animasi & Interaksi**:
   - 🚫 **Dilarang**: Animasi loop tanpa henti (kartu mengambang, badge berdenyut terus), penumpukan animasi masuk serentak pada scroll (fade + slide + scale + bounce).
   - ✅ **Standar**: Animasi hanya dipicu oleh interaksi pengguna atau transisi state; elemen diam setelah masuk; wajib patuh pada `prefers-reduced-motion: reduce`.
7. **Sanitasi Grafis 3D & Spasial (`3Dviz`)**:
   - 🚫 **Dilarang**: Bulatan neon mengambang klise, model proksi primitif generik yang disamarkan dengan tekstur resolusi tinggi, robekan sambungan pada persimpangan kulit organik, collider yang tidak mencakup atap/sayap, serta klaim akurasi ilmiah pada visual yang tidak diverifikasi secara numerik.
   - ✅ **Standar**: Keahlian bentuk objek (*object craft*) pada 3 skala (siluet, konstruksi, permukaan), kontinuitas sambungan teratur, verifikasi ilmiah berpijak (Klaim → Model → Visual), integrasi fisika *fixed-timestep*, dan kepatuhan pada 16 poin checklist kualitas grafis 3D (`web-3d-graphics-expert`).

---

## 15 Poin Checklist Mandiri Kesiapan UI

Jalankan checklist ini bersamaan dengan review kode sebelum menyelesaikan tugas frontend/UI:
- [ ] **1. Jangkar Identitas Merek**: Palet warna berakar dari `DESIGN.md`, bebas gradien biru-ungu atau neon generik.
- [ ] **2. Aksen Tunggal Terarah**: Warna aksen hanya digunakan pada momen interaktif utama.
- [ ] **3. Bebas Emoji Dekoratif**: Judul dan teks UI bebas dari emoji dekoratif (🚀, ✨, 🔥, ✅).
- [ ] **4. Variasi Ritme**: Tata letak seksi bervariasi dinamis, bukan pengulangan template kartu 3 kolom kaku.
- [ ] **5. Tanpa Bento Bawaan atau Terminal Palsu**: Bebas dari mosaik bento grid klise dan jendela terminal pura-pura.
- [ ] **6. Kebersihan Area Judul**: Area di atas H1 bersih dari badge kategori yang sekadar mengulang isi judul.
- [ ] **7. Navigasi Berfungsi Nyata**: Setiap menu dan tombol memiliki tujuan aktif atau label "Coming soon" yang jelas.
- [ ] **8. Tujuan Gerakan Jelas**: Seluruh animasi bertujuan jelas, tanpa loop abadi, dan patuh `prefers-reduced-motion`.
- [ ] **9. Batas Dosis Kaca & Glow**: Efek kaca buram dibatasi 1-2 elemen; tanpa pendaran glow pada kartu standar.
- [ ] **10. Kejujuran Titik Status**: Titik status mencerminkan telemetri riil; tanpa denyut dekoratif palsu.
- [ ] **11. Shell Berorientasi Keputusan**: Layar terstruktur di sekitar keputusan utama pengguna, bukan template hafalan.
- [ ] **12. Metrik & Data Otentik**: Angka metrik terhubung ke kueri riil atau placeholder berlabel jujur.
- [ ] **13. Placeholder Bersih**: Formulir dan tabel bebas data fiktif malas (`John Doe` / `Lorem Ipsum`).
- [ ] **14. State Kosong Bertindak**: State kosong menjelaskan penyebab dan menyediakan tombol aksi langsung.
- [ ] **15. Responsif & Aksesibel**: Lolos kontras WCAG 2.2 (4.5:1 teks, 3:1 komponen UI) dan navigasi keyboard penuh.

---

## Protokol Self-Audit Anti-Slop untuk Subagent Swarm

Setiap subagent yang dijalankan oleh Swarm Director WAJIB menjalankan checklist mandiri sebelum mengembalikan hasil:
1. **Gerbang Kelengkapan**: Apakah ada `// TODO`, `// ...`, atau fungsi yang belum diimplementasikan? *Wajib diselesaikan.*
2. **Gerbang Komentar**: Apakah ada komentar yang hanya menarasikan baris kode? *Hapus segera.*
3. **Gerbang Error**: Apakah semua blok `catch` mencatat atau menangani error secara layak? *Dilarang menelan error secara diam-diam.*
4. **Gerbang Console**: Apakah masih ada jejak `console.log` debugging? *Bersihkan atau ganti dengan logger terstruktur.*
5. **Gerbang Percakapan**: Apakah respons bebas dari basa-basi dan permintaan maaf klise? *Sajikan hasil code-first.*
6. **Gerbang UI & Visual**: Untuk seluruh kode UI, pastikan bebas gradien biru-ungu generik, bento default, metrik fiktif, emoji dekoratif, dan patuh pada `DESIGN.md` melalui 15 poin checklist.

---

## Integrasi Orkestrasi
- `zero-to-prod-orchestrator`: Gate kualitas anti-slop ditegakkan di seluruh 8 fase siklus rekayasa perangkat lunak (khususnya Fase 5 UI dan Fase 6 Quality Audit).
- `brainstorming`: Mencegah slop pemasaran dan mewajibkan skema konkret pada fase ideasi.
- `production-ready-hardener`: Audit anti-slop wajib sebelum rilis produksi.
- `design-system-architect`: Menegakkan token desain OKLCH dan konfigurasi tema Tailwind CSS v4 tanpa slop visual sewenang-wenang.
- `senior-frontend`: Membangun antarmuka React 19 / Next.js 15 App Router yang patuh pada aturan anti-slop kode dan visual.
- `ui-ux-pro-max`: Menyediakan heuristik desain BM25 dan panduan tata letak bebas template klise.
- `web-3d-graphics-expert`: Menegakkan penalaran spasial 3Dviz, keahlian bentuk objek pada 3 skala, kontinuitas sambungan, dan akurasi collider fisik tanpa slop 3D.
- `tailwind-expert`: Mengonfigurasi kelas utilitas bersih tanpa penumpukan class inline berlebih.
- `scalability-clean-code`: Mencegah pembengkakan arsitektur dan over-engineering spekulatif.
- `autonomous-tdd-debugger`: Memastikan suite pengujian memiliki asersi nyata tanpa mock tiruan.
- `coderabbit`: Mendeteksi dan memblokir AI slop secara otomatis pada review pull request.
- `prd-architect`: Memastikan dokumen PRD bebas dari kata-kata marketing kosong.