---
name: visual-ui-auditor
description: "Expert guide for multimodal vision UI auditing (Gemini 4 Pro / Flash Vision, Claude 3.7 / 5.1 Sonnet, GPT-5 Vision) against Anti-Slop Pillar 7, 1px crisp borders, 3-tier radius scales, tabular numerals, and WCAG 2.2 AA / Panduan ahli audit visual UI berbasis vision multimodal."
author: "Roedy Rustam"
version: "4.2.2"
---

# visual-ui-auditor — vibes-plug Skill

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with `screenshot-to-code-expert`, `ui-ux-pro-max`, `design-system-architect`, `senior-frontend`, `tailwind-expert`, `anti-slop`, and `zero-to-prod-orchestrator` to audit visual user interfaces against the strict Anti-Slop Directive Pillar 7.

### Description
Production guide for automated visual quality auditing using multimodal vision frontier models (Gemini 4 Pro/Flash Vision, Claude 3.7/5.1 Sonnet Vision, GPT-5 Vision). Text-based linters cannot evaluate spatial weight, surface elevation, visual hierarchy, or contrast degradation under dynamic lighting. This skill combines static AST heuristics with multimodal vision rubrics to evaluate screenshots and UI source code against the 6 core visual laws: 1px crisp borders, 3-tier radius scale (rejection of pill-button addiction), tabular numerals for numerical data, eradication of generic neon radial glow orbs, and 5-state interactive contracts.

### Trigger Conditions
Activate this skill when:
- Reviewing UI components, web pages, or application screenshots prior to user release.
- Converting Figma designs or wireframes into code (`screenshot-to-code-expert`).
- Auditing frontend code for AI slop visual clichés (e.g. `bg-gradient-to-r from-blue-500 to-purple-600` or `rounded-full` rectangular action buttons).
- Enforcing WCAG 2.2 Level AA accessibility color contrast and focus ring visibility.

---

### Visual Audit Rubric & Implementation

```
SCREENSHOT OR UI CODE
          │
          ▼
┌───────────────────────────────┐
│ STATIC REGEX / AST SCANNER    │  Detects pill buttons, generic gradients, missing tabular-nums
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│ MULTIMODAL VISION SAMPLING    │  Gemini / Claude / GPT Vision evaluation
└──────────────┬────────────────┘
               │
               ▼
      STRUCTURED SCORECARD
  (Score 0-100, Verdict, Pixel Fixes)
```

#### 1. The 6 Visual Quality Rules

1. **Pill-Button Addiction Check**: Standard rectangular action buttons must use structured radius (`rounded-md` 6px or `rounded-lg` 8px). `rounded-full` is strictly prohibited on non-circular/non-badge elements.
2. **1px Crisp Borders**: Elevated surfaces (dialogs, cards, popovers) must use crisp 1px borders (`border border-border/50` or `rgba(255,255,255,0.08)`) to ground geometry rather than heavy floating drop-shadows.
3. **Anti-Generic Gradients**: Generic AI blue-to-purple gradients (`from-blue-500 to-purple-600`) and blurred neon radial backdrops are banned in favor of curated brand palettes.
4. **Tabular Numerals (`tabular-nums`)**: Monetary sums and data table counts must specify font tabular figures to prevent horizontal character shifting during live updates.
5. **5-State Interactive Affordance**: Buttons and controls must provide clear visual states for default, hover, focus-visible ring, active (pressed), and disabled.
6. **Anti-Decorative Emojis**: Prohibits rocket (`🚀`), sparkles (`✨`), and fire (`🔥`) clutter in enterprise titles and badges.

#### 2. Visual Auditor Execution (CLI & MCP)

```bash
# Audit a code snippet or component directly:
vibes visual-audit '<button className="rounded-lg border border-border/50 px-4 py-2 hover:bg-muted font-medium tabular-nums">Pay Rp 150.000</button>'

# Audit a screenshot image file:
vibes visual-audit assets/dashboard-screenshot.png
```

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill `screenshot-to-code-expert`, `ui-ux-pro-max`, `design-system-architect`, `senior-frontend`, `tailwind-expert`, `anti-slop`, dan `zero-to-prod-orchestrator` untuk mengaudit antarmuka visual terhadap penegakan Anti-Slop Directive Pilar 7.

### Deskripsi
Panduan produksi untuk audit kualitas visual otomatis menggunakan model frontier vision multimodal (Gemini 4 Pro/Flash Vision, Claude 3.7/5.1 Vision, GPT-5 Vision). Linter berbasis teks tidak dapat menilai bobot spasial, elevasi permukaan, maupun kontras warna dinamis. Skill ini menggabungkan heuristik kode statis dengan rubrik vision multimodal untuk memeriksa screenshot dan kode sumber UI terhadap 6 hukum visual utama: border 1px presisi, skala 3-tier radius, angka tabular, pembersihan gradien klise AI, dan kontrak interaktif 5-state.

### Kondisi Pemicu
- Meninjau tampilan komponen UI atau screenshot aplikasi sebelum rilis produksi.
- Mengonversi desain atau mockup visual ke dalam kode modern.
- Menghapus elemen klise visual AI generik (gradien biru-ungu, tombol *pill* bulat berlebih, drop-shadow mengambang).
- Menegakkan kepatuhan aksesibilitas WCAG 2.2 AA.
