---
name: visual-ui-auditor
description: "Master guide for multimodal vision UI auditing (Gemini 4 Argon/Pro Vision, Claude Sonnet 5.5 Vision, GPT-5.6 Sol Vision, Muse Wonder) against Anti-Slop Pillar 7, 1px crisp borders, 3-tier radius scales, tabular numerals, and WCAG 2.2 AA / Panduan utama audit visual UI berbasis vision multimodal."
author: "Roedy Rustam"
version: "4.4.2"
---

# Visual UI Auditor & Vision Quality Gate (2026 Sovereign Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Executive Directive & The Vision Imperative (2026 Shift)
Text-based code linters (ESLint, Biome, TypeScript) analyze syntax abstractly. They are completely blind to **spatial breathing room, optical balance, perceived elevation, color clashing, and visual degradation**. A React component can be 100% syntactically valid yet visually repulsive, violating brand aesthetics and suffering from lazy AI design tropes.

**The Visual UI Auditor** establishes an autonomous **Multimodal Vision Quality Gate**. By rendering components via Playwright or Headless Chrome, capturing high-DPI screenshots, and passing them to frontier vision models (Gemini 4 Argon/Pro Vision, Claude Sonnet 5.5 Vision, Muse Wonder), the auditor inspects rendered pixels against **Anti-Slop Pillar 7** and automatically synthesizes self-healing CSS diffs.

---

### Orchestration & Integration
- **Upstream Orchestrators**: Works under `brainstorming` and `zero-to-prod-orchestrator` (Phase 5/6 - Frontend Assembly & QA Gate).
- **Core Design & Anti-Slop Standards**: `anti-slop` (Pillar 7 Sovereign UI Craft), `design-system-architect`, `tailwind-expert`, `modern-css-native-expert`.
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
│    • Pillar 7 Visual Checklist  • 1px Crisp Borders  • Tabular-Nums    │
│    • 3-Tier Radius Compliance   • Ban Generic Slop Gradients / Orbs    │
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

#### The 6 Non-Negotiable Visual Laws (Anti-Slop Pillar 7)
1. **1px Crisp Borders**: Elevated surfaces (dialogs, cards, dropdowns) must use crisp 1px borders (`border border-neutral-200/80 dark:border-neutral-800`). Heavy blurry box-shadows without borders are banned.
2. **Three-Tier Radius Contract**:
   - `rounded-lg` (8px) for buttons, inputs, badges.
   - `rounded-xl` (12px) for cards, dialog surfaces.
   - `rounded-2xl` (16px) for root modals, sheets.
   - `rounded-full` is strictly prohibited on standard rectangular buttons.
3. **Tabular Numerals (`tabular-nums`)**: Every monetary balance, price, counter, timestamp, and percentage MUST include `tabular-nums` to eliminate character jitter during live re-renders.
4. **Anti-Generic Gradients**: Purple-to-blue AI gradients (`from-purple-500 to-blue-500`) and glowing neon blur orbs are strictly prohibited.
5. **Mandatory 5-State Affordance**: Buttons and inputs must provide distinct visual styling for: `default`, `hover`, `active`, `focus-visible`, and `disabled`/`loading`.
6. **WCAG 2.2 AA Contrast Compliance**: Minimum 4.5:1 text contrast for body text and 3:1 for large headings across both Light and Dark themes.

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
      'You are the Master Visual UI Auditor enforcing Anti-Slop Pillar 7.',
      'Analyze the provided screenshot of the rendered web interface with pixel-level scrutiny.',
      '',
      'INSPECTION CRITERIA:',
      '1. Crisp 1px Borders: Ensure all cards, containers, and inputs have grounded 1px borders.',
      '2. Pill Button Ban: Flag any rectangular buttons utilizing rounded-full (pill addiction).',
      '3. Tabular Numerals: Ensure all prices, currency values, metrics, and dates use tabular-nums.',
      '4. Ban Generic AI Clichés: Flag any purple-blue gradients or blurry neon orbs.',
      '5. Spatial Hierarchy: Verify clean padding, balanced typography scales, and WCAG 2.2 AA contrast.',
      '',
      componentSourceCode ? `COMPONENT SOURCE CODE:\n${componentSourceCode}` : '',
    ].join('\n');

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

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Direktif Eksekutif & Kebutuhan Audit Visual Multimodal (Pergeseran 2026)
Linter kode berbasis teks (ESLint, Biome, TypeScript) hanya memeriksa sintaksis secara abstrak. Mereka sama sekali buta terhadap **keseimbangan optik, pernapasan tata letak (*spatial breathing room*), elevasi permukaan, dan tabrakan warna**. Sebuah komponen React bisa saja lolos 100% dari galat kompilasi namun secara visual terlihat buruk dan dipenuhi klise AI murahan.

**Visual UI Auditor** menyediakan **Gerbang Kualitas Visual Multimodal** otonom. Dengan merender komponen melalui Playwright, menangkap tangkapan layar beresolusi tinggi, dan memeriksanya menggunakan model vision frontier (Gemini 4 Argon/Pro Vision, Claude Sonnet 5.5 Vision, Muse Wonder), auditor memeriksa setiap piksel terhadap **Pilar 7 Anti-Slop** serta menghasilkan rekomendasi perbaikan CSS secara otomatis.

---

### Integrasi Orkestrasi
- **Orkestrator Hulu**: Beroperasi di bawah arahan `brainstorming` dan `zero-to-prod-orchestrator` (Fase 5/6 - Perakitan Frontend & QA).
- **Standar Desain & Anti-Slop**: `anti-slop` (Pilar 7 Kerajinan UI Berdaulat), `design-system-architect`, `tailwind-expert`, `modern-css-native-expert`.
- **Pengujian E2E & Tangkapan Layar**: `e2e-testing-expert`, `browser-automation-expert`, `screenshot-to-code-expert`.
- **Aksesibilitas & Kepatuhan Visual**: `accessibility-testing-expert`, `ui-ux-pro-max`, `hig`.

---

### 6 Aturan Mutlak Visual (Pilar 7 Anti-Slop)
1. **Border 1px Tegas**: Seluruh kartu, kontainer, dan input wajib memiliki border 1px yang tegas (`border border-neutral-200/80 dark:border-neutral-800`). Bayangan kabur tebal tanpa border dilarang keras.
2. **Skala Radius 3-Tingkat**: `rounded-lg` (8px) untuk tombol/input, `rounded-xl` (12px) untuk kartu, dan `rounded-2xl` (16px) untuk modal utama. Dilarang memakai tombol pil (`rounded-full`) pada tombol aksi standar.
3. **Angka Tabular Wajib (`tabular-nums`)**: Seluruh nilai moneter, harga, saldo, kuantitas, dan tanggal wajib menerapkan `tabular-nums` untuk mencegah pergeseran teks saat data diperbarui.
4. **Larangan Gradien Klise AI**: Gradien ungu-ke-biru AI dan orb neon blur di belakang kartu dilarang keras.
5. **Kontrak 5-State Interaktif Wajib**: Elemen tombol dan kontrol wajib menyediakan visual untuk state: `default`, `hover`, `active`, `focus-visible`, dan `disabled`/`loading`.
6. **Kepatuhan Kontras WCAG 2.2 AA**: Rasio kontras teks minimal 4.5:1 untuk teks biasa dan 3:1 untuk judul besar pada mode terang maupun gelap.

---

### Topologi Arsitektur Audit Visual

```
┌────────────────────────────────────────────────────────────────────────┐
│               ALUR PIPA AUDIT UI VISUAL MULTIMODAL                     │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Render Komponen UI Target (Playwright / Headless Browser)           │
│                                  │                                     │
│                                  ▼                                     │
│ 2. Tangkap Screenshot High-DPI (1080p Desktop & 390p Mobile)           │
│                                  │                                     │
│                                  ▼                                     │
│ 3. Audit Model Vision Frontier (Gemini 4 Argon/Pro / Claude Sonnet)    │
│    • Ceklis Visual Pilar 7      • Border 1px Tegas    • Tabular-Nums   │
│    • Skala Radius 3-Tingkat     • Larangan Gradien AI Klise & Neon Orb │
│                                  │                                     │
│        ┌─────────────────────────┴─────────────────────────┐           │
│        ▼                                                   ▼           │
│  [Skor >= 90: Lolos Audit]                           [Pelanggaran Ada] │
│  Terbitkan Sertifikat Audit                          Hasilkan Patch CSS│
│  Lanjutkan ke Produksi                               Terapkan Tailwind │
│                                                            │           │
│                                                            ▼           │
│                                                   Render Ulang & Uji   │
└────────────────────────────────────────────────────────────────────────┘
```

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
      'Anda adalah Master Visual UI Auditor yang menegakkan Anti-Slop Pilar 7.',
      'Analisis screenshot antarmuka web yang diberikan dengan ketelitian piksel tinggi.',
      '',
      'KRITERIA PEMERIKSAAN:',
      '1. Border 1px Tegas: Pastikan seluruh kartu dan kontainer memiliki border 1px yang nyata.',
      '2. Larangan Tombol Pil: Tandai tombol persegi panjang yang memakai rounded-full.',
      '3. Angka Tabular: Pastikan harga, kuantitas, dan tanggal menggunakan tabular-nums.',
      '4. Larangan Klise AI: Tandai gradien ungu-biru murah dan efek neon blur orb.',
      '5. Hierarki Spasial: Periksa keselarasan padding, tipografi, dan kontras WCAG 2.2 AA.',
      '',
      kodeSumberKomponen ? `KODE SUMBER KOMPONEN:\n${kodeSumberKomponen}` : '',
    ].join('\n');

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
  }
}
```

---

### Panduan Praktik Terbaik

1. **Jadikan Gerbang Kualitas Otomatis**: Integrasikan pengujian tangkapan layar Playwright ke alur CI/CD agar setiap PR yang memuat perubahan visual diverifikasi sebelum rilis.
2. **Prioritaskan Angka Tabular**: Selalu sertakan utilitas `tabular-nums` pada komponen tabel finansial, dashboard transaksi, dan penghitung mundur.
3. **Patuhi Batas Skor Minimum 90**: Tolak kode yang memiliki skor visual < 90 atau melanggar aturan border 1px dan larangan tombol pil.

