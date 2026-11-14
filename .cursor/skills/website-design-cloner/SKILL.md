---
name: website-design-cloner
description: "Reverse-engineer website designs, layout structures, and design tokens / Rekayasa balik desain website, struktur layout, dan token desain."
author: "Roedy Rustam"
version: "4.8.0"
---

# Website Design Cloner & Reverse Engineering Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills:
- **`modern-web-guidance`**: Evaluates modern CSS and HTML standards to replace deprecated target patterns during cloning.
- **`design-system-architect`**: Maps reverse-engineered palettes into semantic OKLCH tokens and surface container tiers.
- **`tailwind-expert`**: Translates target layout dimensions into modern Tailwind v4 utilities.
- **`visual-ui-auditor`**: Runs automated 20-point visual audits and screenshot diffing against the target URL.
- **`ui-ux-pro-max`**: Standardizes typography scales, optical tracking, and 60-30-10 color balance.
- **`anti-slop`**: Cleanses cloned components of div-soup wrappers and missing interactive states.
- **`brainstorming`**, **`zero-to-prod-orchestrator`**, **`session-memory-manager`**: Continuous lifecycle orchestration.
- **Cross-Domain Synergy & Subagent Swarm Integration**: `screenshot-to-code-expert`, `multimodal-spatial-video-cloner`, `web-scraper`

### Description
`website-design-cloner` is an advanced enterprise-grade website reverse engineering, modernization, and migration skill. Incorporating the **Adobe Stardust** multi-page pipeline architecture, it enables AI agents to crawl target website URLs, extract the complete consolidated **Brand Surface** (`PRODUCT.md`, `DESIGN.md`, `DESIGN.json`), deconstruct dynamic surfaces, manage an explicit **Inconsistency Register**, and synthesize clean, modular, semantic code (Tailwind CSS v4, React 19, Next.js 15, HTML5/Vanilla CSS) across two distinct execution flows: **Replica (Same-Design Replatform)** and **Redesign / Uplift**.

### Hard Guardrails (Declarative Invariants)
- **Fluid Responsive Container Invariant**: Hardcoding static desktop pixel widths (e.g. `style={{ width: '1280px' }}`, `style={{ width: '1440px' }}`, or fixed desktop dimensions without responsive breakpoints) is strictly prohibited; layouts must use modern Tailwind `max-w-*`, fluid clamp, or container query units.
- **Semantic HTML5 Landmark Invariant**: Cloned page layouts must employ semantic landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`); outputting monolithic nested `<div>` soup without landmark semantics is prohibited.
- **Re-Authoring Invariant (Ban Raw DOM Dumping)**: Recreated components must be re-authored as semantic, clean modern code from lifted tokens; direct copy-pasting of raw minified source DOM trees or dumping unmaintained vendor CSS classes (e.g. `<div class="cms-block-wrap-v2-xyz123"...>`) is strictly prohibited.
- **Explicit Inconsistency Register Invariant**: In same-design replica migrations, zero unsolicited subjective design deviations are permitted; any layout, token, or structural delta against the live source must be formally declared in `cloner/inconsistency-register.json`.
- **Dual-Probe Fidelity Gate Invariant**: Recreated pages must pass both a pixel/layout probe and a structural content/typography role probe (checking `eyebrow`, `heading`, `cta`, `body`) before being marked as migrated; visual-only diffs that ignore content roles are banned.
- **Verbatim Content Accounting Invariant**: Source text copy, alt text, and SEO metadata must be preserved verbatim and counted per page; dropping, silently inventing, or hallucinating marketing copy without a documented migration reason is strictly prohibited.
- **Resumable State Tracking Invariant**: Multi-page operations must maintain progress and per-page disposition in `cloner/state.json` and `cloner/status.jsonl` to ensure idempotent, resumable execution across sessions.
- **60-30-10 OKLCH Design Token Contract**: Cloned color palettes must map into semantic Tailwind CSS v4 `@theme` tokens using perceptual OKLCH color values; uncoordinated raw inline hex codes scattered across cloned components are banned.
- **Interactive 5-State Element Contract**: All cloned interactive elements (buttons, nav links, inputs) must implement all 5 states (`default`, `hover`, `focus-visible`, `active`, `disabled`) with compliant WCAG 2.2 contrast ($\ge 4.5:1$).

### Non-Functional Requirements (NFR Contract)
- **Visual Layout Fidelity**: Structural similarity index (SSIM) $\ge 0.95$ against reference layout across 375px, 768px, and 1440px viewports, with pixel diff $\le 1.5\%$ achieved within max 3 calibration passes.
- **Content Parity Ledger**: 100% verbatim copy preservation (0 dropped headings, 0 broken link targets).
- **Anti-Slop Cleanliness**: Zero placeholder lorem-ipsum or broken dummy links in synthesized production components.

### Trigger Conditions
- Replicating or cloning a website layout, landing page, or web application directly from a target URL.
- Extracting design systems (color palettes, typography scales, container grids, component patterns) from a reference link.
- Re-creating complex UI components (Hero banners, Bento grids, navbar drawers, pricing tables, footers) based on live URLs.
- Auditing and reverse-engineering third-party website layouts for component scaffolding.

---

### 5-Step Enterprise Reverse Engineering & Modernization Methodology

```mermaid
graph TD
    A["Target URL / Multi-Page Seed"] --> B["Phase 1: Multi-Page Extraction & Brand Surface (extract)"]
    B --> C{"Migration Topology Decision"}
    C -->|"Keep Design (Replica)"| D["Phase 2A: Replica Spec & Inconsistency Register"]
    C -->|"Redesign / Modernize"| E["Phase 2B: Direct Target Spec & Brand Direction"]
    D --> F["Phase 3: Clean Archetype Re-Authoring (prototype/replica)"]
    E --> F
    F --> G["Phase 4: Dual-Probe Measured Gate (diff: pixel + structural)"]
    G --> H["Phase 5: Dynamic Surface Triage & Site Rollout (migrate/rollout)"]
```

#### Phase 1: Multi-Page Extraction & Brand Surface Capture (`extract`)
1. **Capped Multi-Page Crawling**: Rather than analyzing an isolated single page, crawl a representative sample (`--cap 5` to `8` pages) covering the Home page plus core Information Architecture (IA) pillars (e.g. catalog, detail page, about, contact, blog template) using Playwright or Firecrawl.
2. **Brand Surface Consolidation**: Aggregate across sampled pages into standard specifications under `cloner/current/`:
   - `PRODUCT.md`: Business value proposition, target audiences, key user flows, and content structure.
   - `DESIGN.md`: Visual voice, typography hierarchy, elevation/shadow scale, border radii, and spatial rhythm.
   - `DESIGN.json`: Machine-readable tokens (OKLCH color palette, font stacks, spacing multipliers, breakpoint steps).
   - `inventory.json`: Discovered pages, slugs, archetype mappings, and content metrics.
3. **Pre-Flight Cookie & Consent Dismissal**: Automatically clear modal overlays, consent dialogs, and sticky floating banners before viewport captures.

#### Phase 2: Topology Selection & The Inconsistency Register
Choose one of two non-overlapping migration flows:

| Dimension | Flow A: Same-Design Migration (Replica) | Flow B: Redesign / Modernization (Direct) |
|---|---|---|
| **Core Intent** | Re-platform website keeping existing visual design near pixel-perfect. | Refresh aesthetic, modernize UX, and eliminate design debt. |
| **Design Source** | Mechanical promotion of the captured Brand Surface spec. | Target spec resolved from user intent in `cloner/direction.md`. |
| **Taste Decisions** | Strictly forbidden. All decisions are measurement-policy calls. | Applied through modern design systems and 60-30-10 OKLCH tokens. |
| **Deviation Control** | Every permitted delta must exist in `cloner/inconsistency-register.json`. | Measured against target redesign acceptance criteria. |
| **Prototyping Step** | Recreates key archetypes as clean semantic code with lifted CSS values. | Renders interactive redesigned prototypes with before/after diffs. |

##### The Inconsistency Register Contract (`cloner/inconsistency-register.json`)
When executing a Replica migration, never "fix" or "improve" design inconsistencies silently. Log all intentional deviations:
```json
{
  "site": "https://example.com",
  "inconsistencies": [
    {
      "id": "INC-01",
      "target": "header > .nav-cta",
      "issue": "Primary CTA uses ungrounded 2018 pill radius with blurry drop shadow",
      "disposition": "align-to-theme",
      "resolution": "Use standard rounded-xl with crisp 1px neutral border",
      "approvedBy": "migration-policy"
    }
  ]
}
```

#### Phase 3: Clean Archetype Re-Authoring (No DOM Copying!)
- **Strict Anti-DOM-Copy Rule**: Never dump raw scraped DOM trees or port 10,000-line vendor CSS files into React components. Raw DOM contains bloated CMS wrappers, stale tracking tags, and brittle class hierarchies.
- **Semantic Re-Authoring**: Re-author clean, modern semantic HTML5 and React 19 / Tailwind v4 components using:
  1. The verbatim extracted text copy from Phase 1.
  2. Tokens lifted directly into Tailwind v4 `@theme`.
  3. Semantic landmark components (`HeaderNav`, `HeroSection`, `FeatureBento`, `PricingSection`, `FooterNav`).

#### Phase 4: Dual-Probe Measured Source-Fidelity Gate (`diff`)
Every generated page archetype must be reconciled against the live reference URL using **two complementary probes**. Running only one gives a false "looks fine":

| Probe | Execution Method | Detects | Blind To |
|---|---|---|---|
| **1. Pixel / Layout Probe** | Render reference & clone at 1440px and 375px via Playwright; compute image diff | Stretched media, dropped max-width wraps, blank renders, background flips, height deltas | "Right text, wrong slot"; missing CTA buttons that blend with background |
| **2. Structural Content & Typography Probe** | Extract ordered semantic inventory classified by **computed style + tag** | Role swaps (`eyebrow` vs `heading`), dropped body text, font-face forks, dropped `aria-label`/`title` | Sub-pixel geometry and layout drift |

- **Target Acceptance Gate**: Pixel diff $\le 1.5\%$ achieved within maximum 3 calibration loops; structural content diff reports **0 missing nodes** across all classified roles (`heading`, `eyebrow`, `cta`, `body`).

#### Phase 5: Dynamic Surface Triage & Site Rollout (`migrate`)
1. **Dynamic Surface Triage**: Detect and classify all interactive components on the site across 4 axes before generation:
   - **Class**: `api` (data fetch), `search` (client or server queries), `form` (lead gen/contact), `modal` (dialogs), `media` (video/audio players), `tag` (analytics).
   - **Disposition**: `re-implement` (native modern component), `embed` (iframe/micro-frontend), `proxy` (backend route), `retire` (obsolete feature).
   - **Reproducibility**: `deterministic` (static mockable) or `dynamic-stateful`.
   - **Status**: `triaged`, `implemented`, `verified`.
2. **Resumable State Machine (`cloner/state.json`)**:
   - Track per-page status (`queued`, `extracted`, `re-authored`, `gated`, `deployed`).
   - Append execution logs to `cloner/status.jsonl` to allow pausing and resuming multi-page overhauls without re-tokenizing completed pages.

#### Phase 2: Design Tokens & CSS Harvester
Harvest computed styles and synthesize them into Tailwind CSS v4 `@theme` tokens:

| Token Category | Extracted Properties | Tailwind CSS v4 Mapping |
|---|---|---|
| **Color System** | Primary, Secondary, Background, Neutral slate, Surface, Borders | `--color-primary`, `--color-background`, `--color-surface` |
| **Typography** | Font Family (Google Fonts link), Headings (`h1`-`h6`), Body, Font Weights | `--font-sans`, `--font-mono`, `--text-4xl`, `--font-bold` |
| **Spacing Scale** | Section Padding (`py-16`/`py-24`), Container Max-Width (`1280px`), Gap scale | `--spacing-16`, `--max-width-7xl`, `gap-6` |
| **Borders & Radii** | Card Border Radius (`16px`), Pill Radius (`9999px`), Border Colors | `--radius-xl`, `--color-border` |
| **Effects** | Backdrop Blur (`backdrop-blur-md`), Glassmorphism, Drop Shadows | `shadow-xl shadow-brand/10`, `backdrop-blur-lg` |

#### Phase 3: Component Hierarchy Breakdown
Deconstruct the target web page into modular, reusable UI components:
- **`HeaderNav`**: Brand logo, navigation menu links, dynamic CTA button, mobile drawer toggle.
- **`HeroSection`**: Eye-catching headline, subheading, action buttons, hero image/video/mockup.
- **`FeatureBento`**: Bento grid containers, icon badges, feature titles, micro-copy.
- **`TestimonialGrid`**: Avatar image, quote text, author metadata, star ratings.
- **`PricingSection`**: Tier cards, billing toggle (Monthly/Annual), highlighted popular badge, feature checklists.
- **`FooterNav`**: Category columns, newsletter subscription form, copyright & social icons.

#### Phase 4: 1:1 Code Synthesis (Tailwind v4 + React 19)
Synthesize clean, accessible, modern code matching the extracted structure.

##### Example: Extracted Tailwind CSS v4 Theme (`tokens.css`)
```css
@import "tailwindcss";

@theme {
  --font-sans: "Outfit", "Inter", system-ui, sans-serif;
  --font-mono: "Fira Code", monospace;

  /* Extracted OKLCH Palette */
  --color-brand-primary: oklch(58% 0.23 255);
  --color-brand-accent:  oklch(68% 0.19 160);
  --color-surface-dark:  oklch(14% 0.02 255);
  --color-surface-card:  oklch(18% 0.03 255 / 80%);

  --radius-card: 1.25rem;
}
```

##### Example: Recreated Hero Component (`HeroSection.tsx`)
```tsx
import React from 'react';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative bg-neutral-50 dark:bg-neutral-950 py-20 md:py-28 px-6">
      <div className="mx-auto max-w-4xl text-center">
        {/* Eyebrow: Crisp typographic landmark with optical tracking */}
        <span className="inline-flex items-center rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 shadow-xs">
          Architecture Verified
        </span>
        
        {/* Title: Punchy authority with tight tracking */}
        <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-[1.1]">
          Precision Web Engineering with Sovereign Aesthetics
        </h1>
        
        {/* Subtitle: High-readability body copy */}
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
          Cleanly engineered, fully accessible UI components extracted with precision tokens and robust visual hierarchy.
        </p>
        
        {/* Actions: Single primary CTA dominance + subtle ghost action */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 px-6 py-3 text-sm font-medium text-white dark:text-neutral-900 shadow-xs transition hover:bg-neutral-800 dark:hover:bg-white active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            Explore System
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-6 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-neutral-400"
          >
            Documentation
          </button>
        </div>
      </div>
    </section>
  );
}
```

##### Material Design 3 (M3) Pattern Recognition (https://m3.material.io/)
When cloning target sites utilizing Material Design 3 (Google products, Flutter web apps, Android dashboards):
- **Detect M3 Surface Containers**: Identify background layering using tonal container levels (`surface-container-low` to `highest`) rather than drop shadows.
- **Identify M3 Primitives**: Map Floating Action Buttons (FAB), Navigation Rails (tablet/desktop), Navigation Bars (mobile), and Tonal/Filled/Outlined buttons directly to canonical M3 component tokens.
- **Extract Dynamic Colors**: Group related primary/container and secondary/container pairs into semantic M3 color roles.


##### NiubiGEO Cosmic Evidence & Conversion Inversion Pattern (https://niubigeo.ai/)
When cloning or extracting design systems from high-converting AI SaaS, developer tools, or diagnostic engines modeled after NiubiGEO:
- **Cosmic Obsidian Theme Tokens**:
  ```css
  @theme {
    --color-bg: #080a0f;              /* Deep Cosmic Obsidian Canvas */
    --color-panel: #11141e;           /* Layer 1 Surface */
    --color-panel-2: #181b29;         /* Layer 2 Surface */
    --color-line: #272b3c;            /* 1px Hairline Border */
    --color-text-main: #f5f4fa;       /* Crisp White with subtle lavender tint */
    --color-text-muted: #979aaf;      /* Muted Slate-Violet */
    --color-accent-purple: #b7a0ff;   /* Electric Lavender (Action & Active State) */
    --color-accent-green: #7ce4b0;    /* Emerald Jade (Verified Evidence Signal) */
    --color-glow-purple: #76508d;     /* Deep Violet Focus Glow */
  }
  ```
- **Conversion Inversion Hero**: Swap passive text+button heroes for an embedded interactive setup widget (`#product-setup`) directly inside the hero. The user enters their product URL/GitHub/app immediately, experiencing zero-friction immediate engagement.
- **Actionable Evidence Bento Grid**: Render 4 empirical proof cards instead of vanity scores:
  1. *Brand Visibility*: Status pulse dot + real percentage across ChatGPT, Claude, Gemini, Perplexity.
  2. *Description Accuracy*: Tag cloud comparing factual entity attributes vs hallucinations.
  3. *Multi-Platform Citations*: Real platform icons (Substack, Telegram, ChatGPT, Claude, Gemini).
  4. *Prioritized Action Checklist*: Actionable triage items with interactive pills.
- **Interactive Step Flow & Proof Velocity**: Horizontal step switcher illustrating the human+AI flywheel, accompanied by authentic GitHub Trending & Tech Daily ranking proof cards.


##### Dribbble-Grade Hero Pattern Recognition & Extraction Rules
When reverse-engineering modern landing pages inspired by Dribbble hero section trends:
1. **Detect Hero Structural Type**:
   - *Split 50/50 with 3D Perspective*: Look for CSS `transform: perspective(...) rotateX(...) rotateY(...)`. Replicate the exact angles and recreate floating chips with directional micro-shadows (`shadow-xl`) and CSS bounce/pulse animations.
   - *Modular Above-the-Fold Bento*: Inspect if the hero viewport is broken into a CSS Grid (`grid-cols-3` or `grid-cols-4`). Extract each card's distinct visual function (Headline cell, interactive sandbox cell, live metric cell).
   - *Centered Kinetic with Fold Peek*: Detect if the primary product mockup cuts through the bottom viewport boundary using negative bottom margins (`-mb-24` to `-mb-40`) with deep directional shadows (`shadow-[0_25px_65px_-15px_rgba(0,0,0,0.8)]`).
   - *Interactive Utility*: Detect if an input form with real validation and tag filters is placed inside the hero fold.
2. **Extract Floating Micro-Affordances**: Never synthesize static dead images when cloning modern heroes. Extract or generate floating chips: live sync status dots (`animate-ping`), transaction settlements, avatar clusters (`flex -space-x-2`), and announcement pills.

#### Phase 5: Visual Verification & Polish
- Ensure color contrast passes WCAG 2.2 AAA standard (4.5:1 ratio).
- Validate full responsiveness on mobile viewports.
- Replace broken image assets with synthesized visual placeholders using `generate_image`.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Muse Wonder High`, `Composer 2.5 Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec website-design-cloner <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_visual_audit`, `vibes_ast_query`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | LCP < 1.8s, INP < 100ms, CLS < 0.05, 1px crisp borders, 3-tier radius (6px/8px/12px), `tabular-nums`, 5-state interactive contract; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan:
- **`modern-web-guidance`**: Mengevaluasi standar CSS dan HTML modern untuk menggantikan pola usang dari situs target.
- **`design-system-architect`**: Memetakan palet hasil rekayasa balik ke dalam token OKLCH semantik dan tingkatan permukaan.
- **`tailwind-expert`**: Menerjemahkan dimensi layout target ke dalam utilitas Tailwind v4 modern.
- **`visual-ui-auditor`**: Menjalankan audit visual 20-poin otomatis dan perbandingan screenshot terhadap URL target.
- **`ui-ux-pro-max`**: Menstandarkan skala tipografi, tracking optik, dan keseimbangan warna 60-30-10.
- **`anti-slop`**: Membersihkan komponen hasil kloning dari pembungkus div-soup dan status interaktif yang hilang.
- **`brainstorming`**, **`zero-to-prod-orchestrator`**, **`session-memory-manager`**: Orkestrasi siklus hidup proyek secara terpadu.
- **Sinergi Lintas Domain & Integrasi Swarm Subagent**: `screenshot-to-code-expert`, `multimodal-spatial-video-cloner`, `web-scraper`

### Deskripsi
`website-design-cloner` adalah skill rekayasa balik (*reverse engineering*), modernisasi, dan migrasi website kelas enterprise. Mengadopsi arsitektur pipeline multi-halaman **Adobe Stardust**, skill ini memungkinkan agen AI merayapi (*crawl*) URL website target, mengekstrak **Brand Surface** terpadu (`PRODUCT.md`, `DESIGN.md`, `DESIGN.json`), mendekonstruksi permukaan dinamis, mengelola **Inconsistency Register** eksplisit, dan menyintesis kode modular semantik (Tailwind CSS v4, React 19, Next.js 15, HTML5/CSS3) melalui dua alur eksekusi tegas: **Replica (Re-platforming Desain Sama)** dan **Redesign / Uplift**.

### Hard Guardrails (Invarian Deklaratif - Bahasa Indonesia)
- **Invarian Kontainer Responsif Dinamis**: Menuliskan lebar desktop tetap dalam piksel secara hardcoded (seperti `style={{ width: '1280px' }}`, `style={{ width: '1440px' }}` tanpa breakpoint responsif) dilarang keras; layout wajib menggunakan `max-w-*` Tailwind, fluid clamp, atau container queries.
- **Invarian Landmark Semantik HTML5**: Tata letak hasil kloning wajib menggunakan elemen semantik (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`); menghasilkan komponen dengan struktur pure `<div>` soup tanpa penanda semantik dilarang.
- **Invarian Re-Authoring (Larangan Salin DOM Mentah)**: Komponen yang dibangun kembali wajib ditulis ulang (*re-authored*) secara semantik dan bersih menggunakan token terangkat; menyalin-tempel pohon DOM mentah yang terminifikasi atau membawa class CSS usang CMS pihak ketiga (misal `<div class="cms-block-wrap-v2-xyz123"...>`) dilarang keras.
- **Invarian Inconsistency Register Eksplisit**: Pada migrasi replika (desain sama), deviasi desain subjektif tanpa izin dilarang keras; setiap perubahan layout, token, atau visual terhadap situs live wajib dicatat secara formal dalam `cloner/inconsistency-register.json`.
- **Invarian Gerbang Fidelitas Dual-Probe**: Halaman yang dibangun kembali wajib lulus uji dual-probe (probe tata letak piksel DAN probe struktural peran tipografi/konten: `eyebrow`, `heading`, `cta`, `body`) sebelum ditandai selesai; diff visual sepihak yang mengabaikan peran konten dilarang.
- **Invarian Akuntansi Preservasi Konten Verbatim**: Teks asli, alt gambar, dan metadata SEO wajib dipreservasi secara verbatim dan dihitung per halaman; membuang, mengarang, atau menghalusinasikan teks copywriting tanpa alasan migrasi tercatat dilarang keras.
- **Invarian Pelacakan Status Multi-Halaman (Resumable)**: Operasi multi-halaman wajib mencatat progres dan disposisi per halaman di `cloner/state.json` dan `cloner/status.jsonl` untuk memastikan eksekusi idempoten yang dapat dijeda dan dilanjutkan antar-sesi.
- **Kontrak Design Token OKLCH 60-30-10**: Palet warna hasil kloning wajib dipetakan ke dalam token `@theme` Tailwind CSS v4 dengan ruang warna perseptual OKLCH; kode hex inline acak yang bertebaran di JSX dilarang.
- **Kontrak Elemen Interaktif 5-Status**: Seluruh elemen kontrol interaktif yang dikloning (tombol, tautan navigasi, input) wajib mengimplementasikan 5 status (`default`, `hover`, `focus-visible`, `active`, `disabled`) dengan kontras WCAG 2.2 yang valid ($\ge 4.5:1$).

### Non-Functional Requirements (Kontrak NFR - Bahasa Indonesia)
- **Fidelitas Tata Letak Visual**: Indeks kesamaan struktural (SSIM) $\ge 0.95$ terhadap referensi desain pada viewport 375px, 768px, dan 1440px, dengan deviasi piksel $\le 1.5\%$ tercapai dalam maksimal 3 iterasi kalibrasi.
- **Buku Besar Paritas Konten**: Preservasi teks verbatim 100% (0 heading terbuang, 0 link tujuan rusak).
- **Kebersihan Anti-Slop**: Nol teks placeholder lorem-ipsum atau tautan dummy yang rusak pada kode komponen produksi yang disintesis.

### Kondisi Pemicu
- Merekapitulasi atau menduplikasi tata letak situs web, landing page, atau aplikasi web dari URL target.
- Mengekstrak design system (skema warna, skala tipografi, grid kontainer, pola komponen) dari tautan referensi.
- Membangun kembali komponen UI kompleks (banner Hero, Bento grid, drawer navigasi, tabel harga, footer) berdasarkan URL langsung.
- Mempelajari struktur visual dan rekayasa balik situs web pihak ketiga untuk template baru.
- Melakukan modernisasi atau replatforming situs web multi-halaman berbasis arsitektur Adobe Stardust.

---

### Metodologi Rekayasa Balik & Modernisasi Enterprise 5-Langkah

```mermaid
graph TD
    A["Target URL / Multi-Halaman"] --> B["Tahap 1: Ekstraksi Multi-Halaman & Brand Surface (extract)"]
    B --> C{"Keputusan Topologi Migrasi"}
    C -->|"Pertahankan Desain (Replica)"| D["Tahap 2A: Spek Replika & Inconsistency Register"]
    C -->|"Desain Ulang (Redesign)"| E["Tahap 2B: Spek Target Desain Baru & Direction"]
    D --> F["Tahap 3: Re-Authoring Arketipe Bersih (prototype/replica)"]
    E --> F
    F --> G["Tahap 4: Gerbang Terukur Dual-Probe (diff: piksel + struktural)"]
    G --> H["Tahap 5: Triase Permukaan Dinamis & Rollout (migrate/rollout)"]
```

1. **Tahap 1: Ekstraksi Multi-Halaman & Brand Surface (`extract`)**:
   - Merayapi sampel representatif (`--cap 5` hingga `8` halaman: Beranda + pilar Arsitektur Informasi utama seperti katalog, detail, kontak, artikel) menggunakan Playwright atau Firecrawl.
   - Mengonsolidasikan Brand Surface ke dalam berkas standar di `cloner/current/`: `PRODUCT.md`, `DESIGN.md`, `DESIGN.json` (token OKLCH, tipografi, spacing, breakpoint), dan `inventory.json`.
   - Mengabaikan modal cookie dan banner persetujuan sebelum pengambilan screenshot viewport.

2. **Tahap 2: Pemilihan Topologi & Inconsistency Register**:
   - **Alur Replika (Same-Design)**: Rekayasa platform ulang dengan mempertahankan tampilan 1:1. Mengubah desain secara sepihak dilarang; setiap penyesuaian wajib dicatat dalam `cloner/inconsistency-register.json`.
   - **Alur Desain Ulang (Redesign / Uplift)**: Mengarahkan intent pengguna ke dalam target desain baru di `cloner/direction.md` dengan palet warna OKLCH modern dan varian visual presales.

3. **Tahap 3: Re-Authoring Arketipe Bersih (Dilarang Copy-Paste DOM)**:
   - Menuliskan ulang komponen semantik React 19 / Tailwind CSS v4 dari awal berdasarkan teks verbatim dan token CSS yang diekstrak. Dilarang menyalin tag DOM mentah yang kotor atau stylesheet vendor CMS lama.

4. **Tahap 4: Gerbang Fidelitas Terukur Dual-Probe (`diff`)**:
   - Memvalidasi arketipe menggunakan dua probe wajib:
     * **Probe 1 (Piksel & Tata Letak)**: Membandingkan screenshot render 1440px & 375px untuk mendeteksi distorsi gambar, hilangnya wrap, dan pergeseran tinggi elemen.
     * **Probe 2 (Struktural Konten & Peran Tipografi)**: Mengklasifikasikan elemen berdasarkan computed style + tag (`heading`, `eyebrow`, `cta`+href, `body`, `placeholder`, `aria-label`, ikon) untuk mencegah teks hilang atau tertukar peran.
   - Ambang kelulusan: Pixel diff $\le 1.5\%$ dalam $\le 3$ kalibrasi, 0 node teks yang hilang.

5. **Tahap 5: Triase Permukaan Dinamis & Rollout Bertahap (`migrate`)**:
   - Mengklasifikasikan fitur interaktif (API, form, search, modal dialog, pemutar media) dalam 4 sumbu: Class, Disposition, Reproducibility, dan Status sebelum sintesis kode.
   - Memelihara state machine multi-halaman di `cloner/state.json` dan `cloner/status.jsonl` agar progres migrasi dapat dipause dan diresume tanpa re-tokenisasi ulang.

---


#### Pola Arsitektur NiubiGEO: Bukti Kosmik & Inversi Konversi (https://niubigeo.ai/)
Ketika merekayasa balik atau menyintesis website AI SaaS, alat developer, atau landing page dengan konversi tinggi berbasis arketipe NiubiGEO:
- **Token Obsidian Kosmik**:
  Latar belakang `#080a0f`, panel berlapis `#11141e` & `#181b29`, garis batas 1px `#272b3c`, serta aksen ganda dinamis: Lavender Elektrik `#b7a0ff` (brand/fokus) dan Jade Zamrud `#7ce4b0` (status bukti valid).
- **Hero Konversi Inversi**: Mengganti hero pasif biasa dengan widget diagnostik interaktif (`#product-setup`) langsung di bawah judul. Pengguna langsung memasukkan URL produk tanpa hambatan login awal.
- **Bento Grid Bukti Tindakan**: 4 kartu pembuktian empiris (Sinyal Visibilitas, Akurasi Deskripsi, Sitasi Lintas Platform, serta Rekomendasi Tindakan Prioritas).
- **Navigator Alur 4 Langkah & Kecepatan Sosial Organik**: Tab navigator horizontal serta kartu bukti peringkat GitHub Trending dan Tech Daily yang menggantikan testimoni klise.


#### Aturan Ekstraksi & Rekayasa Balik Hero Kaliber Dribbble
Ketika merekayasa balik landing page modern berbasis tren hero section Dribbble:
1. **Deteksi Tipe Struktural Hero**:
   - *Split 50/50 dengan Perspektif 3D*: Deteksi properti CSS `transform: perspective(...) rotateX(...) rotateY(...)`. Replikasi sudut kemiringan persis dan sertakan chip mikro melayang dengan animasi floating.
   - *Bento Modular di Lipatan Pertama*: Deteksi apakah lipatan hero dibagi menggunakan CSS Grid. Ekstrak fungsi masing-masing kartu bento (kartu judul, kartu live code sandbox, kartu metrik otoritas).
   - *Teks Kinetik Tengah dengan Intipan Lipatan (Fold Peek)*: Deteksi jika bingkai aplikasi memotong batas bawah viewport menggunakan margin negatif (`-mb-28` hingga `-mb-36`) dengan bayangan jatuh terarah.
   - *Utilitas Interaktif*: Deteksi jika widget input fungsional langsung disematkan pada lipatan hero.
2. **Ekstraksi Elemen Taktil Melayang**: Jangan pernah merekayasa balik hero menjadi gambar mati statis. Wajib ekstrak chip interaksi mikro: titik denyut status (`animate-ping`), bukti transaksi (`tabular-nums`), tumpukan avatar pengguna, dan badge pengumuman pill.

### Matriks Orkestrasi & Handoff Skill

| Skill Terkait | Peran & Integrasi Handoff |
|---|---|
| `web-scraper` | Mengambil HTML mentah, CSS, dan Markdown dari URL via Jina Reader / Firecrawl API. |
| `design-system-architect` | Menyusun token visual hasil ekstraksi ke dalam design system enterprise berbasis OKLCH & Radix/Base UI. |
| `ui-ux-pro-max` | Memberikan acuan BM25 visual style, pasangan font Google Fonts, dan checklist aksesibilitas WCAG 2.2. |
| `senior-frontend` | Mengimplementasikan kode komponen React 19 / Next.js 15 App Router siap produksi. |
| `tailwind-expert` | Mengatur konfigurasi Tailwind CSS v4 `@theme` dan utilitas responsif. |

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Muse Wonder High`, `Composer 2.5 Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec website-design-cloner <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_visual_audit`, `vibes_ast_query`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | LCP < 1.8s, INP < 100ms, CLS < 0.05, border tegas 1px, radius 3-tier (6px/8px/12px), `tabular-nums`, kontrak interaktif 5-state; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
