---
name: visual-ui-auditor
description: "Multimodal vision UI audit against crisp borders, accessibility, and 40 anti-slop rules / Audit visual antarmuka UI multimodal berbasis standar WCAG 2.2 dan 40 aturan anti-slop."
author: "Roedy Rustam"
version: "4.8.0"
---

# Visual UI Auditor & Vision Quality Gate (2026 Sovereign Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Executive Directive & The Vision Imperative (2026 Shift)
Text-based code linters (ESLint, Biome, TypeScript) analyze syntax abstractly. They are completely blind to **spatial breathing room, optical balance, perceived elevation, color clashing, and visual degradation**. A React component can be 100% syntactically valid yet visually repulsive, violating brand aesthetics and suffering from lazy AI design tropes.

**The Visual UI Auditor** establishes an autonomous **Multimodal Vision Quality Gate**. By rendering components via Playwright or Headless Chrome, capturing high-DPI screenshots, and passing them to frontier vision models (Gemini 4 Argon/Pro Vision, Claude Sonnet 5.5 Vision, Muse Wonder), the auditor inspects rendered pixels against **Anti-Slop Pillar 7 and the 40 Mandatory Anti-Slop Rules (R-01 to R-40)**, automatically synthesizing self-healing CSS diffs.

### Hard Guardrails (Declarative Invariants)
- **Zero-Tolerance Anti-Slop Visual Ban**: Banned design tropes are strictly rejected: generic purple/blue gradients (`from-blue-600 to-purple-600`), floating blurred neon glow orbs, pill button addiction (`rounded-full` on rectangular buttons), and ungrounded borderless cards.
- **Dual-Probe Comprehensive Reconciliation**: Visual audits comparing an implementation against a design/prototype must execute BOTH pixel/layout probes AND structural role-classified content probes (`heading`, `eyebrow`, `cta`, `body`); visual-only diffs that ignore content roles are strictly prohibited.
- **Evidence-Bound Citation Invariant**: Every audit finding must cite a concrete measurement, screenshot observation, or formal tension id (`T-*`); subjective claims without measurement evidence are banned.
- **Verbatim Copy Preservation Check**: Every audit must verify zero invented, hallucinated, or silently dropped marketing copy against source specs with a strict per-page word count ledger.
- **Crisp 1px Grounded Border Contract**: Every card, container, and input element must declare crisp 1px borders (`border border-neutral-200/80 dark:border-neutral-800`) with three-tier radius (`rounded-lg` for controls, `rounded-xl` for cards, `rounded-2xl` for modals).
- **WCAG 2.2 AA Contrast & Touch Target Floors**: Text elements must satisfy minimum contrast ratios ($\ge 4.5:1$ for normal body text, $\ge 3:1$ for large headings). Interactive controls must enforce a minimum physical touch target of $44 \times 44\text{ px}$ (`min-h-[44px] min-w-[44px]`).
- **Tabular Numerals & Anti-Jitter Invariant**: All dynamic financial values, timestamps, and metric counters must declare `tabular-nums` (`font-variant-numeric: tabular-nums`) to prevent horizontal jitter during rapid re-renders.

### Non-Functional Requirements (NFR Contract)
- **Visual Audit Score Floor**: Components must achieve a composite score $\ge 90/100$ across the 7-domain visual inspection checklist before deployment.
- **Dual-Probe Precision Gate**: Stitched pixel diff $\le 1.5\%$ across 1440px and 375px viewports with 0 missing structural role nodes (`heading`, `eyebrow`, `cta`, `body`).
- **Vision Inference Latency**: Multimodal screenshot inspection and rubric generation must complete within $< 4.0\text{ s}$.

---

### Orchestration & Integration
- **Upstream Orchestrators**: Works under `brainstorming` and `zero-to-prod-orchestrator` (Phase 5/6 - Frontend Assembly & QA Gate).
- **Core Design & Anti-Slop Standards**: `anti-slop` (40 Mandatory Anti-Slop Rules R-01 to R-40, Pillar 7 Sovereign UI Craft), `design-system-architect`, `tailwind-expert`, `modern-css-native-expert`.
- **E2E Testing & Screen Capture**: `e2e-testing-expert`, `browser-automation-expert`, `screenshot-to-code-expert`.
- **A11y & Visual Compliance**: `accessibility-testing-expert`, `ui-ux-pro-max`, `hig`.

---

### Core Architectural Topologies

```
┌────────────────────────────────────────────────────────────────────────┐
│                   MULTIMODAL VISUAL UI AUDIT PIPELINE                  │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Render Target UI Component (Playwright / Headless Browser)          │
│                                  │                                     │
│                                  ▼                                     │
│ 2. High-DPI Screenshot Capture (1080p Desktop & 390p Mobile)           │
│                                  │                                     │
│                                  ▼                                     │
│ 3. Frontier Vision LLM Audit (Gemini 4 Pro / Claude Sonnet 5.5 Vision) │
│    • 40 Mandatory Anti-Slop Rules  • 1px Crisp Borders • Tabular-Nums  │
│    • 7-Domain Visual Inspection    • Ban AI Gradients  • Unsized Media │
│                                  │                                     │
│        ┌─────────────────────────┴─────────────────────────┐           │
│        ▼                                                   ▼           │
│  [Score >= 90: Passed]                               [Violations Found]│
│  Generate Audit Certificate                          Emit Exact Diff   │
│  Proceed to Production                               Patch Tailwind CSS│
│                                                            │           │
│                                                            ▼           │
│                                                  Re-render & Re-verify │
└────────────────────────────────────────────────────────────────────────┘
```

#### The 7-Domain Multimodal Inspection Checklist (Antislop UI Canonical Standard)
1. **Visual & Color Craft**:
   - Crisp 1px grounded borders (`border border-neutral-200/80 dark:border-neutral-800`). No blurry borderless box-shadows.
   - Three-Tier Radius: `rounded-lg` (8px) controls, `rounded-xl` (12px) cards, `rounded-2xl` (16px) modals. `rounded-full` banned on rectangular buttons.
   - Ban generic blue-purple gradients (`from-blue-600 to-purple-600`) and blurred neon glow orbs.
   - No excessive stacked glassmorphism (`backdrop-blur-md` abuse).
2. **Layout & Spatial Rhythm**:
   - Reject repetitive 3-column copy-paste feature grids and bento box abuse without content hierarchy.
   - Enforce breathing room: distinct section spacing (`py-16 md:py-24`) instead of cramped uniform margins.
   - Ground layouts: no fake logo ticker rows with made-up placeholder company names.
3. **Decorative Element Sanitation**:
   - Zero AI sparkles (✨), generic stars, or disconnected 3D floating clay blobs.
   - Remove trailing decorative arrows on standard buttons (`Get Started →`).
   - Strip fake radar status dots (`animate-ping` on static badges without live WebSocket connection).
4. **Structural & Navigation Flow**:
   - Zero dead anchor links (`href="#"`). Use meaningful anchor IDs or interactive button triggers.
   - Mandatory 5-state affordance for all interactive elements (`default`, `hover`, `active`, `focus-visible`, `disabled`).
5. **App & Dashboard Fidelity**:
   - No invented stat cards without business queries (e.g. "+24.5% vs last month" on static data).
   - Require real chart axes, legible domain tooltips, and meaningful tabular data.
6. **Motion & Interaction Elegance**:
   - Ban endless looping pulse or bounce animations on static CTAs (`animate-pulse`, `animate-bounce`).
   - Respect user accessibility preferences with mandatory `motion-reduce:transition-none` / `prefers-reduced-motion`.
7. **Performance & Core Web Vitals (Anti-Slop R-40)**:
   - Mandatory explicit dimensions or aspect ratios on media elements (`aspect-video`, `w-full h-auto`) to guarantee CLS = 0.
   - Mandatory `tabular-nums` on all numbers, currencies, dates, and live statistics to eliminate layout shift during re-renders.
   - WCAG 2.2 AA Contrast Compliance: 4.5:1 text contrast for body, 3:1 for large headings across light/dark themes.

---

### Adobe Stardust Multi-Perspective Audit & Dual-Probe Engine

Integrating the battle-tested **Adobe Stardust** audit methodology, the auditor elevates single-component screenshot linting into an evidence-bound, site-wide modernization scorecard.

#### 1. The Seven-Dimension Evidence-Bound Audit Framework
Every website or component audit evaluates 7 complementary dimensions. Every single finding must cite a concrete measurement, an axe-core check, or an explicit Brand Tension ID (`T-*`):

| Audit Dimension | Measurement / Instrument | Failure Threshold | Actionable Remediation |
|---|---|---|---|
| **1. Design & Brand Tensions** | Visual style audit + inconsistency register | Any uncited layout delta or `T-*` tension | Harmonize into 60-30-10 OKLCH tokens and standard 1px borders |
| **2. Performance & CWV** | Core Web Vitals before & after | LCP > 2.5s, INP > 200ms, CLS > 0.1 | Eager load first hero image (`loading="eager"`), font swap without CLS |
| **3. SEO & Technical** | Canonical, sitemap, robots, redirects | Missing canonicals, redirect hops | Generate canonical URLs, sitemaps, and localize internal paths |
| **4. LLM & AI-Search Visibility** | Server-rendered HTML parser + `llms.txt` | Key facts trapped in client JS bundles | Server-render core product claims, publish `/llms.txt` and JSON-LD schema |
| **5. Accessibility (a11y)** | axe-core + WCAG 2.2 AA rules | Contrast < 4.5:1, touch target < 44px, missing landmark | Declare semantic `<main>`, fix contrast, add accessible labels |
| **6. Content Fidelity** | Per-page verbatim word count ledger | Dropped copy, hallucinated marketing filler | Preserve original copy verbatim; log any approved change in register |
| **7. Platform Delivery** | Modular component inspection | Monolithic 10,000-line stylesheets | Re-author into clean semantic React 19 / Tailwind v4 components |

#### 2. The Complementary Dual-Probe Reconcile Engine (`diff`)
To verify that an implementation matches a target prototype, the auditor runs two complementary probes simultaneously. Running only one gives a false "looks fine":

```
┌────────────────────────────────────────────────────────────────────────┐
│               COMPLEMENTARY DUAL-PROBE RECONCILE ENGINE                │
├──────────────────────────────────┬─────────────────────────────────────┤
│   PROBE 1: PIXEL / LAYOUT DIFF   │  PROBE 2: STRUCTURAL CONTENT DIFF   │
├──────────────────────────────────┼─────────────────────────────────────┤
│ • Stretched/distorted images     │ • Missing / role-swapped headings   │
│ • Dropped max-width wraps        │ • Dropped eyebrows or body copy     │
│ • Blank/failed component renders │ • Missing or redirected CTA buttons │
│ • Surface/ground color flips     │ • Rendered-face font forks          │
│ • Element height/padding drifts  │ • Dropped aria-label / title values │
└──────────────────────────────────┴─────────────────────────────────────┘
```

- **Structural Inventory Classification**: `Probe 2` parses DOM roots by **computed style + tag** into ordered roles: `eyebrow` (tracking-wider uppercase), `heading` (h1-h6 font-bold), `cta` (button/anchor + href), and `body`. If a prototype's eyebrow becomes a body paragraph in the build, the structural probe flags it immediately even if pixels look plausibly similar.

---

### Production Implementation Blueprints

#### Blueprint 1: Multimodal Vision UI Audit Engine (`engine/visual-ui-auditor.ts`)
```typescript
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import fs from 'node:fs/promises';

export const VisualViolationSchema = z.object({
  category: z.enum([
    'PILL_BUTTON_OBSESSION',
    'MISSING_1PX_BORDER',
    'MISSING_TABULAR_NUMS',
    'GENERIC_AI_GRADIENT',
    'CONTRAST_DEFECT',
    'SPATIAL_IMBALANCE',
    'UNSIZED_MEDIA_CLS',
    'FAKE_STATUS_DOT',
    'ENDLESS_LOOP_ANIMATION',
    'DEAD_ANCHOR_ACCESSIBILITY',
  ]),
  description: z.string(),
  elementSelector: z.string(),
  suggestedTailwindFix: z.string(),
  severity: z.enum(['CRITICAL', 'WARNING', 'SUGGESTION']),
});

export const VisualAuditScorecardSchema = z.object({
  overallScore: z.number().min(0).max(100),
  pillar7Compliance: z.boolean(),
  wcagAaPassed: z.boolean(),
  summary: z.string(),
  violations: z.array(VisualViolationSchema),
  correctedCodePatch: z.string().optional(),
});

export type VisualAuditScorecard = z.infer<typeof VisualAuditScorecardSchema>;

export class VisualUiAuditor {
  public static async auditScreenshot(
    screenshotPath: string,
    componentSourceCode?: string
  ): Promise<VisualAuditScorecard> {
    const imageBuffer = await fs.readFile(screenshotPath);
    const base64Image = imageBuffer.toString('base64');

    const auditPrompt = [
      'You are the Master Visual UI Auditor enforcing Anti-Slop Pillar 7 and Rules R-01 to R-40.',
      'Analyze the provided screenshot of the rendered web interface with pixel-level scrutiny across 7 core domains.',
      '',
      'INSPECTION CRITERIA:',
      '1. Crisp 1px Borders: Ensure all cards, containers, and inputs have grounded 1px borders.',
      '2. Pill Button Ban: Flag any rectangular buttons utilizing rounded-full (pill addiction).',
      '3. Tabular Numerals: Ensure all prices, currency values, metrics, and dates use tabular-nums.',
      '4. Ban Generic AI Clichés: Flag purple-blue gradients, blurry neon orbs, or floating 3D clay blobs.',
      '5. Performance & Media: Verify images have aspect-ratio / width-height to prevent CLS (R-40).',
      '6. Motion Cleanliness: Flag endless loop pulse/bounce animations on static elements.',
      '7. Spatial Hierarchy & A11y: Verify clean padding, 5-state affordance, and WCAG 2.2 AA contrast.',
      '',
      componentSourceCode ? `COMPONENT SOURCE CODE:\n${componentSourceCode}` : '',
    ].join('\n');

    // Invariant: If Gemini 4 Pro is unavailable/unprovisioned, gracefully fall back to Gemini 3.8 Flash
    try {
      const result = await generateObject({
        model: google('gemini-4-pro'),
        schema: VisualAuditScorecardSchema,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: auditPrompt },
              {
                type: 'image',
                image: `data:image/png;base64,${base64Image}`,
              },
            ],
          },
        ],
      });

      return result.object;
    } catch (error) {
      console.warn('[VisualUiAuditor] Gemini 4 Pro unavailable. Falling back to Gemini 3.8 Flash:', error);
      const fallbackResult = await generateObject({
        model: google('gemini-3.8-flash'),
        schema: VisualAuditScorecardSchema,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: auditPrompt },
              {
                type: 'image',
                image: `data:image/png;base64,${base64Image}`,
              },
            ],
          },
        ],
      });

      return fallbackResult.object;
    }
  }
}
```

---

#### Blueprint 2: Playwright Automated Visual Audit Test (`tests/visual-audit.spec.ts`)
```typescript
import { test, expect } from '@playwright/test';
import path from 'node:path';
import { VisualUiAuditor } from '../engine/visual-ui-auditor';

test.describe('Automated Visual UI Quality Gate', () => {
  test('audit dashboard against Anti-Slop Pillar 7 standards', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // 1. Capture High-DPI Screenshot
    const screenshotPath = path.resolve('test-results/dashboard-audit.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });

    // 2. Execute Multimodal Vision Audit
    const scorecard = await VisualUiAuditor.auditScreenshot(screenshotPath);

    console.log(`[Visual Audit Score]: ${scorecard.overallScore}/100`);
    if (scorecard.violations.length > 0) {
      console.table(scorecard.violations);
    }

    // 3. Strict Quality Threshold
    expect(scorecard.overallScore).toBeGreaterThanOrEqual(90);
    expect(scorecard.pillar7Compliance).toBe(true);
  });
});
```

---

#### Blueprint 3: Blind Awwwards Jury Evaluation Protocol (`/jury`) & Automated Browser QA CLI
Self-grading is systematically optimistic by **1.5–2.5 points** when an agent knows its own `DESIGN.md` intent. To evaluate a site like an independent Awwwards jury panel, pair the standalone zero-config browser scripts in `skills/visual-ui-auditor/scripts/` with a **Blind Critic Subagent** that receives **ONLY** captured screenshots and telemetry (`report.json`, `summary.json`, `audit.txt`)—never `DESIGN.md` or source code.

##### 1. Standalone Browser QA & Asset Pipeline Commands
```bash
# 1. Multi-route viewport sweep, hover pixel-diff, mobile 4x CPU + slow 4G, keyboard & reduced-motion
node skills/visual-ui-auditor/scripts/shoot.mjs http://localhost:4321 --out .shots --crawl --nav

# 2. Structural DOM, Typography, SEO, Contrast, Perf & A11y Audit
node skills/visual-ui-auditor/scripts/audit.mjs http://localhost:4321 > .shots/audit.txt

# 3. Deterministic 1200x630 Open Graph Card from live hero (--og mode)
node skills/visual-ui-auditor/scripts/og.mjs http://localhost:4321 public/og.png

# 4. Self-host curated variable fonts (.woff2) & generate responsive AVIF/WebP photo sets
node skills/visual-ui-auditor/scripts/font.mjs "Syne:700,800" "Plus Jakarta Sans:400,500" --out public/fonts
node skills/visual-ui-auditor/scripts/photos.mjs "brutalist concrete architecture" --count 6 --out public/images
```

##### 2. Awwwards Weighted Jury Rubric & Empirical Calibration
- **Weighted Overall Formula**:
  $$\text{Overall} = 0.4 \times \text{Design} + 0.3 \times \text{Usability} + 0.2 \times \text{Creativity} + 0.1 \times \text{Content}$$
- **6 Developer Award Criteria** (unweighted average `Dev Avg` for Developer Award eligibility):
  1. **Semantics / SEO**: Valid landmarks (`<header>`, `<main>`, `<footer>`), one `<h1>` per page, decorative split-text marked `aria-hidden="true"` outside headings, complete JSON-LD + OG tags.
  2. **Animations / Transitions**: Single-clock `gsap.ticker` + Lenis, real-progress loader (`loaderMs <= 2600`), idle motion (`idleMotion: true`), seamless page curtain/FLIP transitions.
  3. **Accessibility**: Zero `axe-core` critical/serious violations, `reduced.hiddenText === 0` under `prefers-reduced-motion: reduce`, visible `:focus-visible` outlines (`k-01-focus.png`).
  4. **WPO (Web Performance)**: `CLS < 0.05`, throttled mobile `FCP < 1.8s`, JS `< 300 KB` gz, self-hosted `.woff2 < 300 KB`, zero console/page errors.
  5. **Responsive**: Zero horizontal overflow at `1440x900`, `768x1024`, and `390x844`; mobile re-composed for vertical rhythm (no `auto 1fr auto` mid-page holes).
  6. **Markup / Meta-data**: Clean DOM without `glHidden` opaque WebGL covers (`glHidden.length === 0`), valid `robots.txt` and `sitemap.xml`.
- **Empirical Calibration Offset**: Because the Blind Critic starts at **6.0 / 10** and requires cited screenshot/telemetry evidence for every point above 6, calibrate against live Awwwards jury scores via:
  $$\text{Estimated Live Jury Score} = \text{Critic Overall} + 1.1$$
  - **< 6.5**: Below nomination bar
  - **6.5 – 7.1**: **Honorable Mention (HM)** territory
  - **7.2 – 7.9**: **Site of the Day (SOTD)** contender (Target: Critic raw `>= 7.5`, every category `>= 7.0`, Dev Avg `>= 7.5`)
  - **8.0+**: **Site of the Month (SOTM)** contender

##### 3. Critical `shoot.mjs` Telemetry Signals (`report.json` / `summary.json`)
| Telemetry Field | Pass Requirement | Failure Diagnosis |
| :--- | :--- | :--- |
| `settledMs` & `loaderMs` | `settledMs < 2200`, `loaderMs <= 2600` | Loader cap exceeded or reveal timeline hung above the fold |
| `idleMotion` (`d-00-settled` vs `d-00-after1s`) | `true` (`changedRatio > 0.002`) | Hero is dead/static when user stops scrolling; missing `startIdle()` |
| `hoverDiffs` (`h-NN-rest` vs `h-NN-hover`) | `pct > 0.5%`, `colorOnly: false` on primary targets | `noHoverChange` or lazy bare text-color swap on primary CTA/nav/work card |
| `glHidden` | `[]` (0 elements) | `[data-gl]` figure has opaque CSS `background` covering `#gl` canvas behind it |
| `reduced.hiddenText` | `0` | Elements stuck at `opacity: 0` when `prefers-reduced-motion: reduce` is active |
| `mobile.throttled.blankAt1s` | `false` (`lumaStd > 3`) | Mobile throttled view (4x CPU + slow 4G) renders blank screen at `t = 1.0s` |

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Muse Wonder High`, `Composer 2.5 Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec visual-ui-auditor <audit|eval|verify|generate|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_visual_audit`, `vibes_ast_query`, `vibes_verify_gate`, `vibes_visual_heal` |
| **NFR & Anti-Slop Invariants** | LCP < 1.8s, INP < 100ms, CLS < 0.05, 1px crisp borders, 3-tier radius (6px/8px/12px), `tabular-nums`, 5-state interactive contract; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Direktif Eksekutif & Kebutuhan Audit Visual Multimodal (Pergeseran 2026)
Linter kode berbasis teks (ESLint, Biome, TypeScript) hanya memeriksa sintaksis secara abstrak. Mereka sama sekali buta terhadap **keseimbangan optik, pernapasan tata letak (*spatial breathing room*), elevasi permukaan, dan tabrakan warna**. Sebuah komponen React bisa saja lolos 100% dari galat kompilasi namun secara visual terlihat buruk dan dipenuhi klise AI murahan.

**Visual UI Auditor** menyediakan **Gerbang Kualitas Visual Multimodal** otonom. Dengan merender komponen melalui Playwright, menangkap tangkapan layar beresolusi tinggi, dan memeriksanya menggunakan model vision frontier (Gemini 4 Argon/Pro Vision, Claude Sonnet 5.5 Vision, Muse Wonder), auditor memeriksa setiap piksel terhadap **Pilar 7 Anti-Slop dan 40 Aturan Wajib Anti-Slop (R-01 hingga R-40)** serta menghasilkan rekomendasi perbaikan CSS secara otomatis.

### Hard Guardrails (Invarian Deklaratif - Bahasa Indonesia)
- **Larangan Tanpa Toleransi Visual Slop**: Menolak keras klise desain murahan AI: gradien biru-ungu generik (`from-blue-600 to-purple-600`), bola cahaya neon buram melayang, kecanduan tombol pil (`rounded-full` pada tombol kotak), dan kartu mengambang tanpa border tegas.
- **Rekonsiliasi Komprehensif Dual-Probe**: Audit visual yang membandingkan implementasi terhadap prototipe/desain wajib mengeksekusi KEDUA probe: probe piksel/layout DAN probe struktural peran konten (`heading`, `eyebrow`, `cta`, `body`); diff visual sepihak yang mengabaikan peran konten dilarang keras.
- **Invarian Sitasi Berbasis Bukti**: Setiap temuan audit wajib mencantumkan bukti pengukuran nyata, pengamatan tangkapan layar, atau ID Tegangan Brand formal (`T-*`); klaim subjektif tanpa data pengukuran dilarang.
- **Verifikasi Preservasi Teks Verbatim**: Setiap audit wajib memastikan tidak ada copywriting yang dihilangkan, dikarang, atau dihalusinasikan secara diam-diam terhadap spek sumber.
- **Kontrak Border 1px Tegas & Tiga Tingkat Radius**: Setiap kartu, kontainer, dan elemen input wajib memiliki border 1px tegas (`border border-neutral-200/80 dark:border-neutral-800`) dengan tiga tingkatan radius (`rounded-lg` untuk kontrol, `rounded-xl` untuk kartu, `rounded-2xl` untuk modal).
- **Standar Kontras & Touch Target WCAG 2.2 AA**: Teks wajib memenuhi rasio kontras minimum ($\ge 4.5:1$ untuk teks biasa, $\ge 3:1$ untuk judul besar). Kontrol interaktif wajib memiliki area sentuh fisik minimal $44 \times 44\text{ px}$ (`min-h-[44px] min-w-[44px]`).
- **Angka Tabular & Anti-Gemetar**: Seluruh nilai finansial dinamis, stempel waktu, dan penghitung metrik wajib mendeklarasikan `tabular-nums` (`font-variant-numeric: tabular-nums`) untuk mencegah pergeseran layout horizontal saat rendering cepat.

### Non-Functional Requirements (Kontrak NFR - Bahasa Indonesia)
- **Standar Skor Audit Visual**: Komponen wajib mencapai skor gabungan $\ge 90/100$ pada checklist audit visual 7-domain sebelum rilis produksi.
- **Gerbang Presisi Dual-Probe**: Selisih piksel tersambung (*stitched pixel diff*) $\le 1.5\%$ pada viewport 1440px dan 375px dengan 0 node struktural yang hilang (`heading`, `eyebrow`, `cta`, `body`).
- **Latensi Inferensi Visual**: Inspeksi tangkapan layar multimodal dan generasi rubrik harus selesai dalam $< 4.0\text{ detik}$.

---

### Integrasi Orkestrasi
- **Orkestrator Hulu**: Beroperasi di bawah arahan `brainstorming` dan `zero-to-prod-orchestrator` (Fase 5/6 - Perakitan Frontend & QA).
- **Standar Desain & Anti-Slop**: `anti-slop` (40 Aturan Wajib Anti-Slop R-01 s.d. R-40, Pilar 7 Kerajinan UI Berdaulat), `design-system-architect`, `tailwind-expert`, `modern-css-native-expert`.
- **Pengujian E2E & Tangkapan Layar**: `e2e-testing-expert`, `browser-automation-expert`, `screenshot-to-code-expert`.
- **Aksesibilitas & Kepatuhan Visual**: `accessibility-testing-expert`, `ui-ux-pro-max`, `hig`.

---

### Matriks Audit UI Multimodal 7-Domain (Standar Kanonikal Antislop UI)
1. **Kerajinan Visual & Warna**:
   - Border 1px tegas pada kontainer/kartu (`border border-neutral-200/80 dark:border-neutral-800`). Bayangan tebal mengambang tanpa batas dilarang.
   - Skala radius 3-tingkat: 8px kontrol, 12px kartu, 16px modal. Tombol pil (`rounded-full`) pada tombol aksi standar dilarang keras.
   - Dilarang memakai gradien ungu-biru AI murah (`from-blue-600 to-purple-600`) dan bola neon blur.
   - Hindari tumpukan glassmorphism berlebihan (`backdrop-blur-md`).
2. **Tata Letak & Irama Spasial**:
   - Tolak grid bento yang dipaksakan dan kartu fitur duplikat 3-kolom tanpa hierarki nyata.
   - Jaga ruang bernapas (`py-16 md:py-24`) alih-alih margin sempit yang seragam.
   - Larangan baris logo mitra palsu dengan nama fiktif buatan AI.
3. **Pembersihan Elemen Dekoratif**:
   - Nol emotikon sparkle (✨), bintang generik, atau ilustrasi blob tanah liat 3D yang mengambang tanpa makna.
   - Hapus panah buntut pada tombol standar (`Mulai Sekarang →`).
   - Bersihkan titik radar palsu (`animate-ping` pada lencana statis tanpa koneksi WebSocket aktif).
4. **Alur Navigasi & Struktur**:
   - Nol tautan mati (`href="#"`). Gunakan tautan jangkar nyata atau elemen tombol interaktif.
   - Kontrak 5-state wajib untuk seluruh kontrol interaktif (`default`, `hover`, `active`, `focus-visible`, `disabled`).
5. **Fidelitas Aplikasi & Dashboard**:
   - Hindari kartu statistik dengan metrik fiktif ("+24.5% vs bulan lalu" pada data statis).
   - Pastikan grafik memiliki sumbu yang jelas, tooltip domain yang bermakna, dan data tabular yang nyata.
6. **Keanggunan Gerak & Interaksi**:
   - Larangan animasi loop abadi tanpa henti pada tombol statis (`animate-pulse`, `animate-bounce`).
   - Wajib menghormati preferensi aksesibilitas pengguna via `prefers-reduced-motion`.
7. **Performa & Web Baseline (Anti-Slop R-40)**:
   - Wajib menyertakan dimensi eksplisit atau rasio aspek pada media (`aspect-video`, `w-full h-auto`) untuk mencegah CLS.
   - Wajib menyertakan `tabular-nums` pada angka moneter, harga, persentase, dan tanggal.
   - Kepatuhan kontras WCAG 2.2 AA: minimal 4.5:1 untuk teks dan 3:1 untuk judul besar.

---

### Kerangka Kerja Audit Berbasis Bukti 7-Dimensi & Mesin Dual-Probe Adobe Stardust

Mengintegrasikan metodologi teruji dari **Adobe Stardust**, auditor meningkatkan pengujian screenshot komponen menjadi kartu skor (*scorecard*) modernisasi seluruh situs berbasis bukti empiris.

#### 1. Kerangka Kerja Audit Berbasis Bukti 7-Dimensi
Setiap audit website atau antarmuka mengevaluasi 7 dimensi komplementer. Setiap temuan wajib mencantumkan bukti pengukuran nyata atau ID Tegangan Brand (`T-*`):

| Dimensi Audit | Instrumen & Metode Pengukuran | Ambang Kegagalan | Tindakan Remediasi |
|---|---|---|---|
| **1. Desain & Tegangan Brand** | Audit gaya visual + inconsistency register | Deviasi layout tanpa sitasi atau tegangan `T-*` | Harmonisasi ke token OKLCH 60-30-10 dan border 1px tegas |
| **2. Performa & CWV** | Core Web Vitals sebelum & sesudah | LCP > 2.5s, INP > 200ms, CLS > 0.1 | Muat gambar hero pertama secara eager (`loading="eager"`), font swap |
| **3. SEO & Teknis** | Canonical, sitemap, robots, redirects | Canonical hilang, redirect berulang | Hasilkan canonical URL, sitemap, dan lokalisasi path internal |
| **4. Visibilitas LLM & AI-Search** | Parser HTML server-rendered + `llms.txt` | Fakta penting terperangkap di bundle JS | Render klaim inti di server, publikasikan `/llms.txt` dan skema JSON-LD |
| **5. Aksesibilitas (a11y)** | axe-core + aturan WCAG 2.2 AA | Kontras < 4.5:1, target sentuh < 44px, landmark hilang | Deklarasikan `<main>` semantik, perbaiki kontras, beri label aksesibel |
| **6. Fidelitas Konten** | Buku besar hitungan kata verbatim per halaman | Teks copywriting terbuang atau dihalusinasikan | Preservasi teks asli secara verbatim; catat setiap perubahan di register |
| **7. Pengiriman Platform** | Inspeksi komponen modular | Stylesheet monolitik 10.000 baris | Tulis ulang menjadi komponen React 19 / Tailwind v4 modular |

#### 2. Mesin Rekonsiliasi Dual-Probe Komplementer (`diff`)
Untuk memastikan kode hasil bangun cocok dengan prototipe/desain target, auditor menjalankan dua probe komplementer secara simultan. Menjalankan salah satu saja memberikan hasil keliru "tampak bagus":

```
┌────────────────────────────────────────────────────────────────────────┐
│              MESIN REKONSILIASI DUAL-PROBE KOMPLEMENTER                │
├──────────────────────────────────┬─────────────────────────────────────┤
│    PROBE 1: DIFF PIKSEL / LAYOUT │   PROBE 2: DIFF STRUKTURAL KONTEN   │
├──────────────────────────────────┼─────────────────────────────────────┤
│ • Gambar terdistorsi / melar     │ • Heading hilang / tertukar peran   │
│ • Wrapper max-width terlepas     │ • Eyebrow atau teks paragraf hilang │
│ • Render komponen kosong / gagal │ • Tombol CTA hilang atau salah arah │
│ • Pembalikan warna surface/latar │ • Perbedaan font-face ter-render    │
│ • Pergeseran tinggi atau padding │ • Atribut aria-label / title hilang │
└──────────────────────────────────┴─────────────────────────────────────┘
```

- **Klasifikasi Inventaris Struktural**: `Probe 2` membedah DOM berdasarkan **computed style + tag** menjadi peran terurut: `eyebrow` (tracking-wider kapital), `heading` (h1-h6 font-bold), `cta` (button/anchor + href), dan `body`. Jika eyebrow pada prototipe berubah menjadi paragraf biasa di hasil build, probe struktural akan langsung menandainya sebagai kegagalan meskipun piksel sekilas tampak serupa.

---

### Blueprint Implementasi Produksi

#### Blueprint 1: Mesin Audit UI Multimodal (`engine/visual-ui-auditor.ts`)
```typescript
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import fs from 'node:fs/promises';

export const SkemaPelanggaranVisual = z.object({
  kategori: z.enum([
    'TOMBOL_PIL_BERLEBIHAN',
    'BORDER_1PX_HILANG',
    'ANGKA_TABULAR_HILANG',
    'GRADIEN_AI_KLISE',
    'CACAT_KONTRAS',
    'KETIDAKSEIMBANGAN_SPASIAL',
    'MEDIA_TANPA_UKURAN_CLS',
    'TITIK_STATUS_PALSU',
    'ANIMASI_LOOP_ABADI',
    'TAUTAN_MATI_AKSESIBILITAS',
  ]),
  deskripsi: z.string(),
  selektorElemen: z.string(),
  saranPerbaikanTailwind: z.string(),
  tingkatKeparahan: z.enum(['KRITIS', 'PERINGATAN', 'SARAN']),
});

export const SkemaKartuSkorVisual = z.object({
  skorKeseluruhan: z.number().min(0).max(100),
  kepatuhanPilar7: z.boolean(),
  lolosWcagAa: z.boolean(),
  ringkasan: z.string(),
  pelanggaran: z.array(SkemaPelanggaranVisual),
  patchKodePerbaikan: z.string().optional(),
});

export type KartuSkorVisual = z.infer<typeof SkemaKartuSkorVisual>;

export class VisualUiAuditorId {
  public static async auditScreenshot(
    jalurScreenshot: string,
    kodeSumberKomponen?: string
  ): Promise<KartuSkorVisual> {
    const bufferGambar = await fs.readFile(jalurScreenshot);
    const gambarBase64 = bufferGambar.toString('base64');

    const promptAudit = [
      'Anda adalah Master Visual UI Auditor yang menegakkan Anti-Slop Pilar 7 dan Aturan R-01 hingga R-40.',
      'Analisis screenshot antarmuka web yang diberikan dengan ketelitian piksel tinggi pada 7 domain visual utama.',
      '',
      'KRITERIA PEMERIKSAAN:',
      '1. Border 1px Tegas: Pastikan seluruh kartu dan kontainer memiliki border 1px yang nyata.',
      '2. Larangan Tombol Pil: Tandai tombol persegi panjang yang memakai rounded-full.',
      '3. Angka Tabular: Pastikan harga, kuantitas, dan tanggal menggunakan tabular-nums.',
      '4. Larangan Klise AI: Tandai gradien ungu-biru murah, efek neon blur orb, dan blob 3D tak bermakna.',
      '5. Performa & Media: Pastikan gambar memiliki aspect-ratio/dimensi untuk mencegah CLS (R-40).',
      '6. Animasi Bersih: Larang animasi loop abadi pulse/bounce pada tombol statis.',
      '7. Hierarki Spasial: Periksa keselarasan padding, kontrak 5-state, dan kontras WCAG 2.2 AA.',
      '',
      kodeSumberKomponen ? `KODE SUMBER KOMPONEN:\n${kodeSumberKomponen}` : '',
    ].join('\n');

    // Invarian: Jika Gemini 4 Pro belum tersedia/unprovisioned, alihkan ke Gemini 3.8 Flash secara otomatis
    try {
      const hasil = await generateObject({
        model: google('gemini-4-pro'),
        schema: SkemaKartuSkorVisual,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: promptAudit },
              {
                type: 'image',
                image: `data:image/png;base64,${gambarBase64}`,
              },
            ],
          },
        ],
      });

      return hasil.object;
    } catch (kesalahan) {
      console.warn('[VisualUiAuditorId] Gemini 4 Pro tidak tersedia. Mengalihkan ke Gemini 3.8 Flash:', kesalahan);
      const hasilCadangan = await generateObject({
        model: google('gemini-3.8-flash'),
        schema: SkemaKartuSkorVisual,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: promptAudit },
              {
                type: 'image',
                image: `data:image/png;base64,${gambarBase64}`,
              },
            ],
          },
        ],
      });

      return hasilCadangan.object;
    }
  }
}
```

---

### Panduan Praktik Terbaik

1. **Jadikan Gerbang Kualitas Otomatis**: Integrasikan pengujian tangkapan layar Playwright ke alur CI/CD agar setiap PR yang memuat perubahan visual diverifikasi sebelum rilis.
2. **Prioritaskan Angka Tabular**: Selalu sertakan utilitas `tabular-nums` pada komponen tabel finansial, dashboard transaksi, dan penghitung mundur.
3. **Patuhi Batas Skor Minimum 90**: Tolak kode yang memiliki skor visual < 90 atau melanggar aturan border 1px dan larangan tombol pil.
4. **Pencegahan CLS & Media**: Selalu sediakan rasio aspek (`aspect-video` atau dimensi eksplisit) pada seluruh tag gambar untuk memenuhi aturan R-40.
5. **Protokol Fallback Ketersediaan**: Jika Gemini 4 Pro Vision belum terpasang atau mengalami pembatasan kuota, audit visual dialihkan secara otomatis ke Gemini 3.8 Flash Vision tanpa menghentikan pipeline CI.

---

### Protokol Juri Buta Awwwards (`/jury`) & CLI QA Browser Mandiri
Penilaian mandiri (*self-grading*) oleh agen yang membaca `DESIGN.md` miliknya sendiri terbukti bias optimis sebesar **1.5–2.5 poin**. Untuk mengaudit situs secara objektif setara panel juri Awwwards, jalankan skrip QA mandiri di `skills/visual-ui-auditor/scripts/` lalu serahkan hasilnya ke **Subagen Kritikus Buta (*Blind Critic*)** yang **HANYA** menerima tangkapan layar `.shots/` dan laporan telemetri (`report.json`, `summary.json`, `audit.txt`) tanpa akses ke `DESIGN.md` maupun kode sumber.

1. **Perintah Eksekusi Pipeline QA & Aset Mandiri**:
   - `node skills/visual-ui-auditor/scripts/shoot.mjs http://localhost:4321 --out .shots --crawl --nav`: Tangkapan layar seluruh rute pada viewport desktop (`1440x900`), tablet (`768x1024`), dan mobile (`390x844` dengan throttling CPU 4x + jaringan 4G lambat), uji *pixel-diff* status hover (`h-NN-rest` vs `h-NN-hover`), uji fokus keyboard (`k-01-focus.png`), dan uji `prefers-reduced-motion` (`r-00.png`).
   - `node skills/visual-ui-auditor/scripts/audit.mjs http://localhost:4321 > .shots/audit.txt`: Audit struktural DOM, skala tipografi, kontras WCAG, SEO, serta pelanggaran `axe-core`.
   - `node skills/visual-ui-auditor/scripts/og.mjs http://localhost:4321 public/og.png`: Render kartu Open Graph `1200x630` langsung dari hero halaman aktif (`?og`).
   - `node skills/visual-ui-auditor/scripts/font.mjs` & `photos.mjs`: Unduh font variabel kurasi (`.woff2` self-hosted) dan hasilkan set foto responsif AVIF/WebP (`640w`, `1280w`, `1920w`).
2. **Rumus Bobot Juri Awwwards & Kalibrasi**:
   - **Skor Akhir Tertimbang**: `0.4 * Design + 0.3 * Usability + 0.2 * Creativity + 0.1 * Content` ditambah rata-rata 6 kriteria Developer (*Semantics/SEO, Animations/Transitions, Accessibility, WPO, Responsive, Markup/Meta-data*).
   - **Kalibrasi Empiris**: `Estimasi Skor Juri = Skor Kritikus Buta + 1.1` (Honorable Mention: `6.5–7.1`, Site of the Day / SOTD: `7.2+`). Situs siap rilis wajib mencapai skor mentah Kritikus Buta `>= 7.5` dengan `glHidden: []`, `colorOnly: false` pada target utama, `reduced.hiddenText === 0`, dan `idleMotion: true`.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Muse Wonder High`, `Composer 2.5 Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec visual-ui-auditor <audit|eval|verify|generate|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_visual_audit`, `vibes_ast_query`, `vibes_verify_gate`, `vibes_visual_heal` |
| **Invarian NFR & Anti-Slop** | LCP < 1.8s, INP < 100ms, CLS < 0.05, border tegas 1px, radius 3-tier (6px/8px/12px), `tabular-nums`, kontrak interaktif 5-state; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
