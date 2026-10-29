---
name: hig
description: "Human Interface Guidelines (HIG): Hierarchy, Harmony, Consistency, Apple HIG 2026 & Material 3 / Panduan Desain Human Interface: Hierarki, Harmoni, Konsistensi, Apple HIG 2026 & Material 3."
author: "Roedy Rustam"
version: "4.4.5"
---

# Human Interface Guidelines (HIG) Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills:
- **`modern-web-guidance`**: Enforces standardized accessible navigation, native form controls, and input paradigms.
- **`apple-ecosystem-expert`**: Direct iOS 18+, iPadOS 18+, macOS 15 Sequoia, Dynamic Island, and Safari WebKit implementation.
- **`visual-ui-auditor`**: Audits rendered visual hierarchies against HIG principles, optical letter-spacing, and 1px borders.
- **`design-system-architect`**: Implements Apple continuous squircle scales, surface materials, and semantic typography tokens.
- **`tailwind-expert`**: Maps HIG optical letter-spacing, dynamic type scales, and safe areas to Tailwind v4 utilities.
- **`ui-ux-pro-max`**: Design intelligence across F/Z reading patterns, 60-30-10 color distribution, and touch target rules.
- **`anti-slop`**: Eliminates fake avatars, generic blue-purple gradients, and non-semantic button div-soups.
- **`brainstorming`**, **`zero-to-prod-orchestrator`**, **`session-memory-manager`**: Continuous lifecycle orchestration.

### Description
Authoritative, deep engineering and design reference for **Apple's Human Interface Guidelines (HIG)** (`https://developer.apple.com/design/human-interface-guidelines`) across iOS 18+, iPadOS 18+, macOS 15 Sequoia, visionOS 2+, watchOS 11+, and tvOS 18+. Covers the core triad (Hierarchy, Harmony, Consistency), Apple's 3 Design Themes (Clarity, Deference, Depth), the 6 Foundational Design Principles, Semantic Color & Dark Mode elevation, Materials & Liquid Glass, SF Typography & Dynamic Type, Navigation & Modality, SF Symbols 6, and a cross-platform synthesis with Google Material Design 3 (M3).

### Trigger Conditions
- Reviewing or critiquing a UI design for Apple HIG or Material 3 violations.
- Making architectural decisions about typography scale, semantic color usage, or layout hierarchy.
- Designing cross-platform applications (iOS, iPadOS, macOS, visionOS, Android, web) preserving native platform conventions.
- Implementing Dynamic Island presentations, Live Activities, or floating glass toolbars.
- Evaluating whether a UI feels "premium native" or "generic amateur".
- Enforcing touch target minimums (44×44pt on iOS, 60×60pt on visionOS, 28×28pt on macOS).

---

### The 3 Core Apple HIG Design Themes

Apple's design language is rooted in three overarching themes that inform every interaction:

#### 1. Clarity (Kejelasan)
- **Legibility**: Text is legible at every size with appropriate optical leading and tracking.
- **Lucid Icons**: Icons and symbols are precise, recognizable, and visually balanced.
- **Purposeful Adornments**: Enhancements and decorations are subtle and strictly functional.
- **Function-Driven**: Negative space, typography, color, and controls subtly emphasize content and convey state.

#### 2. Deference (Penghormatan pada Konten)
- **Content is Paramount**: The interface never competes with user content. Fluid motion and crisp visual architecture help people understand and interact with content seamlessly.
- **Airy & Light Canvas**: Content fills the screen edge-to-edge. Translucency and subtle blur hint at additional context without obscuring content.
- **Minimal Bezels & Heavy Shadows**: Eliminate intrusive borders, harsh drop shadows, and gaudy gradients.

#### 3. Depth (Kedalaman Visual & Spasial)
- **Visual Layers**: Layered surfaces and realistic physical motion impart vitality, delight, and hierarchy.
- **Tactile & Spatial Cues**: Touch, pointer hover, and spatial convergence establish an intuitive physical model.
- **Materials with Context**: Translucency, vibrancy, and specular glass materials convey location within the navigational hierarchy.

---

### The 6 Foundational Design Principles

1. **Aesthetic Integrity**: Visual appearance and behavior integrate seamlessly with function. Productivity tools prioritize clean, unobtrusive controls so users stay focused on tasks; creative and media tools invite immersive exploration.
2. **Consistency**: Adherence to system standards, familiar icons, standard typography styles, and predictable component behaviors. Users transfer existing platform knowledge effortlessly.
3. **Direct Manipulation**: Directly interacting with onscreen content (pinching to zoom, dragging lists, rotating items, or eye gaze + pinch in visionOS) rather than manipulating separate disjointed controls.
4. **Feedback**: Immediate, subtle acknowledgement of user input through micro-animations, system sound, and sensory haptics (impact, notification, selection).
5. **Metaphors**: Leveraging familiar real-world physical concepts (sheets, cards, pages, desktop windows, spatial audio anchors) to make digital behavior intuitive.
6. **User Control**: The user — never the system or automated AI — maintains ultimate authority. Keep choices reversible, provide clear cancellation paths, and prevent unexpected destructive surprises.

---

### Foundations: Color, Materials, Typography & Layout

#### 1. Semantic System Colors & Dark Mode Elevation
Apple HIG relies on semantic color tokens that dynamically adapt between Light Mode and Dark Mode:

```css
/* Apple HIG Semantic System Color Tokens */
:root {
  /* System Text Labels */
  --apple-label-primary: rgba(0, 0, 0, 1.0);           /* #000000 */
  --apple-label-secondary: rgba(60, 60, 67, 0.6);       /* 60% opacity */
  --apple-label-tertiary: rgba(60, 60, 67, 0.3);        /* 30% opacity */
  --apple-label-quaternary: rgba(60, 60, 67, 0.18);     /* 18% opacity */

  /* System Backgrounds (Standard) */
  --apple-bg-primary: #FFFFFF;
  --apple-bg-secondary: #F2F2F7;
  --apple-bg-tertiary: #FFFFFF;

  /* System Backgrounds (Grouped) */
  --apple-grouped-bg-primary: #F2F2F7;
  --apple-grouped-bg-secondary: #FFFFFF;
  --apple-grouped-bg-tertiary: #F2F2F7;

  /* System Fills */
  --apple-fill-primary: rgba(120, 120, 128, 0.2);
  --apple-fill-secondary: rgba(120, 120, 128, 0.16);
  --apple-fill-tertiary: rgba(118, 118, 128, 0.12);
  --apple-fill-quaternary: rgba(116, 116, 128, 0.08);

  /* Separators */
  --apple-separator: rgba(60, 60, 67, 0.29);
  --apple-separator-opaque: #C6C6C8;

  /* System Tints */
  --apple-system-blue: #007AFF;
  --apple-system-green: #34C759;
  --apple-system-indigo: #5856D6;
  --apple-system-orange: #FF9500;
  --apple-system-pink: #FF2D55;
  --apple-system-purple: #AF52DE;
  --apple-system-red: #FF3B30;
  --apple-system-teal: #5AC8FA;
  --apple-system-yellow: #FFCC00;
}

@media (prefers-color-scheme: dark) {
  :root {
    /* System Text Labels (Dark Mode) */
    --apple-label-primary: rgba(255, 255, 255, 1.0);     /* #FFFFFF */
    --apple-label-secondary: rgba(235, 235, 245, 0.6);   /* 60% opacity */
    --apple-label-tertiary: rgba(235, 235, 245, 0.3);    /* 30% opacity */
    --apple-label-quaternary: rgba(235, 235, 245, 0.18); /* 18% opacity */

    /* Elevation-Based Backgrounds: higher Z-axis = lighter surface */
    --apple-bg-primary: #000000;                         /* Base canvas */
    --apple-bg-secondary: #1C1C1E;                       /* Elevated cards/panels */
    --apple-bg-tertiary: #2C2C2E;                        /* Modals and popovers */

    /* Grouped Backgrounds (Dark Mode) */
    --apple-grouped-bg-primary: #000000;
    --apple-grouped-bg-secondary: #1C1C1E;
    --apple-grouped-bg-tertiary: #2C2C2E;

    /* System Fills (Dark Mode) */
    --apple-fill-primary: rgba(120, 120, 128, 0.36);
    --apple-fill-secondary: rgba(120, 120, 128, 0.32);
    --apple-fill-tertiary: rgba(118, 118, 128, 0.24);
    --apple-fill-quaternary: rgba(116, 116, 128, 0.18);

    /* Separators (Dark Mode) */
    --apple-separator: rgba(84, 84, 88, 0.6);
    --apple-separator-opaque: #38383A;

    /* System Tints (Vibrant Dark Mode variants) */
    --apple-system-blue: #0A84FF;
    --apple-system-green: #30D158;
    --apple-system-indigo: #5E5CE6;
    --apple-system-orange: #FF9F0A;
    --apple-system-pink: #FF375F;
    --apple-system-purple: #BF5AF2;
    --apple-system-red: #FF453A;
    --apple-system-teal: #64D2FF;
    --apple-system-yellow: #FFD60A;
  }
}
```

#### 2. Materials, Translucency & Liquid Glass
Apple interfaces achieve depth via dynamic materials rather than opaque solid fills:
- **Ultra Thin Material**: Ambient overlays, subtle toolbar blurs.
- **Thin Material**: Inactive sheet backdrops, search containers.
- **Regular Material**: Default sheets, floating tab bars, segmented cards.
- **Thick Material**: Control center pods, high-contrast modal backdrops.
- **Ultra Thick Material**: Elevated navigation bars with heavy background content.

```css
/* Apple Liquid Glass / Materials CSS Emulation */
.apple-material-regular {
  background-color: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@media (prefers-color-scheme: dark) {
  .apple-material-regular {
    background-color: rgba(30, 30, 30, 0.75);
    backdrop-filter: blur(20px) saturate(190%);
    -webkit-backdrop-filter: blur(20px) saturate(190%);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}
```

#### 3. San Francisco Typography & Apple Dynamic Type Scale
Apple's SF font family utilizes optical sizing: **SF Pro Text** for sizes `< 20pt` (looser tracking, higher x-height) and **SF Pro Display** for sizes `≥ 20pt` (tighter tracking, refined proportions).

| Style | Size (pt) | Leading (pt) | Weight | Tracking (em) | Usage Context |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Large Title** | 34pt | 41pt | Regular / Bold | -0.025em | Collapsible header titles on top views |
| **Title 1** | 28pt | 34pt | Regular / Bold | -0.022em | Section titles, prominent modal headers |
| **Title 2** | 22pt | 28pt | Regular / Bold | -0.018em | Card and group headers |
| **Title 3** | 20pt | 25pt | Regular / Semibold | -0.015em | Sub-group headers |
| **Headline** | 17pt | 22pt | Semibold | -0.012em | Emphasized body text, list cell titles |
| **Body** | 17pt | 22pt | Regular | -0.010em | Standard reading content |
| **Callout** | 16pt | 21pt | Regular | -0.008em | Callout panels, auxiliary instructions |
| **Subheadline** | 15pt | 20pt | Regular | -0.005em | Subtitles, metadata lines |
| **Footnote** | 13pt | 18pt | Regular | 0.000em | Disclaimers, timestamps |
| **Caption 1** | 12pt | 16pt | Regular | +0.005em | Input helper text, badge labels |
| **Caption 2** | 11pt | 13pt | Regular / Medium | +0.010em | Tab bar icon labels, tiny metadata |

> [!IMPORTANT]
> **Tabular Numerals Invariant**: Always enforce `font-variant-numeric: tabular-nums` (SwiftUI `.monospacedDigit()`) on timers, stock prices, counters, table columns, and financial metrics to prevent horizontal layout jank.

#### 4. Touch Targets & Continuous Superellipse Corners
- **Touch Target Invariant**:
  - **iOS / iPadOS**: Minimum **44×44pt** tappable target area (even if visual bounds are smaller, pad the hitbox).
  - **visionOS**: Minimum **60×60pt** interaction area with 44pt visual bounds.
  - **macOS**: Minimum **28×28pt** pointer target (20pt micro-targets in dense toolbars).
  - **watchOS**: Minimum **38×38pt** touch target, typically spanning full row width.
- **Continuous Squircle (Superellipse)**:
  Apple corners use a continuous curvature formula ($n \approx 4$ superellipse) rather than simple circular arcs:
  ```css
  /* Apple Continuous Squircle Approximation */
  .apple-card {
    border-radius: 18px;
    corner-shape: squircle; /* Modern CSS standard */
    border: 1px solid var(--apple-separator);
  }
  ```

---

### Navigation Patterns & Component Architecture

#### 1. Navigation Architecture
- **Hierarchical Navigation (`NavigationStack`)**:
  - Single-column drill-down stack.
  - Top navigation bar with back button automatically populated with the previous screen title.
  - Mandatory edge-swipe-from-left gesture to navigate backward.
- **Flat / Peer Navigation (`TabView`)**:
  - 3 to 5 persistent tabs at the bottom of the viewport.
  - Automatically adapts to a floating glass capsule in iOS 18/visionOS, or morphs into a collapsible sidebar on iPadOS 18 and macOS.
- **Split View Navigation (`NavigationSplitView`)**:
  - 2-column (Sidebar + Detail) or 3-column (Sidebar + Content List + Detail).
  - Supports collapsible sidebars with standard system toggle (`sidebar.leading` icon).

#### 2. Modality & Detents
- **Sheets (`.sheet`)**:
  - Non-destructive, context-preserving presentations.
  - Standard detents: `.medium` (half-sheet for quick filters/actions) and `.large` (full sheet).
  - Include an accessible grabber handle and support swipe-down dismissal.
- **Full Screen Covers (`.fullScreenCover`)**:
  - Reserved exclusively for modal flows that require explicit completion or cancellation (e.g., document scanner, camera capture, checkout flow).
- **Confirmation Dialogs / Action Sheets**:
  - Contextual action menus anchored to the trigger point.
  - Destructive options highlighted in system red with mandatory secondary confirmation.
  - Cancel option prominently isolated at the bottom.

#### 3. Dynamic Island Presentation Hierarchy (iOS 18+)
Dynamic Island adapts fluidly across 4 distinct presentation states:
1. **Compact Presentation**:
   - `Leading`: App icon or entity badge (24×24pt).
   - `Trailing`: Real-time metric or animated status indicator (e.g. remaining minutes, waveform).
2. **Minimal Presentation**:
   - Displayed when multiple Live Activities are running concurrently.
   - Detached circular pill adjacent to the primary pill.
3. **Expanded Presentation**:
   - Triggered upon long-press.
   - Four structured regions: `leading`, `trailing`, `center`, and `bottom` action zone.
4. **Lock Screen & StandBy Presentation**:
   - Renders as a rich, glanceable notification banner with high-contrast text.

#### 4. Button Hierarchy & System Roles
Apple defines 4 visual prominence tiers:
- **Filled (`.borderedProminent`)**: Single primary CTA per view (`bg-apple-system-blue text-white`).
- **Tinted (`.bordered`)**: Medium-emphasis secondary action with tinted background and label.
- **Gray (`.bordered` neutral)**: Subdued utility actions, filters, and chips.
- **Plain (`.borderless`)**: Tertiary links, inline table actions, and toolbar icons.
- **Destructive Role**: Red text or filled red background for irreversible operations.

#### 5. SF Symbols 6
Over 6,000 vector symbols with 9 weights and 3 scales:
- **Rendering Modes**:
  - `Monochrome`: Single uniform color tint.
  - `Hierarchical`: Opacity layering with varying luminance levels of one tint.
  - `Palette`: Explicit multi-color assignment per symbol layer.
  - `Multicolor`: Apple-curated semantic colors (e.g. yellow star, red heart, green battery).
- **SF Symbol Animations**:
  - `Bounce`, `Scale`, `Pulse`, `Variable Color`, `Replace`, `Breathe`, `Disappear`.

---

### Platform-Specific Paradigms

| Platform | Primary Input | Ergonomic Sweet Spot | Signature HIG Paradigm |
| :--- | :--- | :--- | :--- |
| **iOS 18+** | Direct Touch & Gestures | Bottom 40% thumb zone | Dynamic Island, Home indicator safe area, Liquid Glass bars, Haptic feedback |
| **iPadOS 18+** | Touch + Trackpad + Apple Pencil | Center canvas + floating sidebar | Cursor morphing to button bounds, Apple Pencil Pro squeeze/barrel roll, Stage Manager |
| **macOS 15** | Keyboard & Precision Pointer | Top-left menu bar + center viewport | Persistent system menu bar, multi-window tiling, Control Center, settings panes |
| **visionOS 2+** | Eye Gaze + Pinch Gesture | Center field-of-view (±30° cone) | Ornaments floating outside window frame, glass material, Dynamic Metric Measurement |
| **watchOS 11** | Quick Glances + Digital Crown | Instant 2-second glance | Pure black `#000000` canvas to merge with OLED bezel, Smart Stack, Double Tap gesture |
| **tvOS 18** | Siri Remote (10-foot UI) | Center screen from 3m distance | Focus Engine with parallax card tilt, oversized typography, high-contrast states |

---

### Apple HIG vs Google Material Design 3 (M3)

| Dimension | Apple Human Interface Guidelines (HIG) | Google Material Design 3 (M3) |
| :--- | :--- | :--- |
| **Core Philosophy** | Content-First, Deference, Clarity, Depth | Expressive, Adaptive, Personalization (Material You) |
| **Elevation & Depth** | Translucent Materials, Liquid Glass, Z-axis surface lightening | Algorithmic Surface Container Tonal Tiers (Lowest to Highest) |
| **Color System** | Semantic System Color pairs (Light / Dark) + System Tints | Perceptual HCT (Hue, Chroma, Tone) dynamic algorithmic palettes |
| **Typography** | SF Pro (Display & Text optical sizing) + New York | Roboto & Roboto Flex (Variable axes: weight, width, optical size) |
| **Iconography** | SF Symbols 6 (Hierarchical, Palette, Variable animations) | Material Symbols (Variable axes: Weight, Fill, Grade, Optical Size) |
| **Minimum Touch Target** | 44×44pt (iOS) / 60×60pt (visionOS) / 28×28pt (macOS) | 48×48dp recommended (24×24dp physical floor) |
| **Corner Curvature** | Continuous Squircle / Superellipse ($n \approx 4$) | Explicit geometric radius scale (0, 4, 8, 12, 16, 28, 9999px) |
| **Primary Navigation** | Bottom Tab Bar (iOS) / Morphing Sidebar (iPadOS) | Navigation Bar (Bottom 80dp) / Navigation Rail (Side 80dp) |

---

### Apple HIG 20-Point Compliance Checklist

- [ ] 1. **Single Primary CTA Law**: Exactly one filled primary button per screen. Secondary actions use tinted, gray, or plain styles.
- [ ] 2. **Touch Target Dimensions**: Every tappable control has a minimum hit target of `44×44pt` on iOS/iPadOS and `28×28pt` on macOS.
- [ ] 3. **Dynamic Type Compliance**: Text elements respect system text scale adjustments without truncating or overlapping.
- [ ] 4. **Tabular Numerals**: All metrics, financial amounts, counters, and timers enforce `font-variant-numeric: tabular-nums`.
- [ ] 5. **Safe Area Inset Protection**: Top headers and bottom bars integrate `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
- [ ] 6. **Dark Mode Surface Elevation**: Higher Z-axis surfaces become lighter in Dark Mode (`#000000` -> `#1C1C1E` -> `#2C2C2E`).
- [ ] 7. **Contrast Ratio Compliance**: Body text satisfies WCAG AA (≥ 4.5:1); large titles and interactive controls satisfy ≥ 3.0:1.
- [ ] 8. **Differentiate Without Color**: States, errors, and badges do not rely solely on color; include an icon or textual label.
- [ ] 9. **Interactive Spring Curves**: Animations use interruptible physics-based springs (`response: 0.35s`, `dampingRatio: 0.82`).
- [ ] 10. **Reduce Motion Alternative**: Interfaces respect `prefers-reduced-motion` by replacing spatial slides with subtle opacity cross-fades.
- [ ] 11. **Liquid Glass & Materials**: Translucent floating bars use `backdrop-filter: blur(20px) saturate(180%)` to preserve underlying context.
- [ ] 12. **Continuous Corner Radius**: Cards, sheets, and buttons use superellipse/squircle corner curves.
- [ ] 13. **Hierarchical Navigation Gestures**: Interactive left-edge swipe gesture is never blocked or hijacked.
- [ ] 14. **Sheet Detents & Grabber**: Bottom sheets provide `.medium` and `.large` detents with an accessible grabber handle.
- [ ] 15. **Sensory Haptic Feedback**: Critical actions trigger appropriate haptic patterns (impact for taps, notification for outcomes).
- [ ] 16. **Dynamic Island Ergonomics**: Live Activities supply compact leading/trailing, minimal, and expanded layouts.
- [ ] 17. **iPadOS Pointer Adaptation**: Interactive controls react to pointer hover with subtle background highlight or magnetic snap.
- [ ] 18. **SF Symbols Integration**: Icons utilize SF Symbols with consistent weight, scale, and semantic rendering modes.
- [ ] 19. **Destructive Action Safety**: Irreversible actions are styled in system red and require secondary confirmation dialogs.
- [ ] 20. **Zero-Slop UI Craft**: Zero generic purple-cyan AI gradients, zero unstyled pill buttons, and complete 5-state interactive contracts.

---

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Muse Wonder High`, `Composer 2.5 Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec hig <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_visual_audit`, `vibes_ast_query`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | Minimum 44×44pt touch targets, 1px crisp borders, continuous squircle radii, `tabular-nums`, 5-state interactive contract; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan:
- **`modern-web-guidance`**: Menegakkan paradigma navigasi aksesibel terstandarisasi, kontrol form native, dan input web modern.
- **`apple-ecosystem-expert`**: Implementasi langsung standar iOS 18+, iPadOS 18+, macOS 15 Sequoia, Dynamic Island, dan Safari WebKit.
- **`visual-ui-auditor`**: Mengaudit hierarki visual hasil render terhadap prinsip HIG, letter-spacing optik, dan border 1px.
- **`design-system-architect`**: Mengimplementasikan skala squircle kontinu Apple, material permukaan, dan token tipografi semantik.
- **`tailwind-expert`**: Memetakan tracking huruf optik HIG, skala Dynamic Type, dan safe area ke utilitas Tailwind v4.
- **`ui-ux-pro-max`**: Kecerdasan desain lintas pola baca F/Z, distribusi warna 60-30-10, dan aturan target sentuh.
- **`anti-slop`**: Melenyapkan avatar palsu, gradien generik ungu-sian, dan tombol div-soup non-semantik.
- **`brainstorming`**, **`zero-to-prod-orchestrator`**, **`session-memory-manager`**: Orkestrasi siklus hidup proyek secara terpadu.

### Deskripsi
Panduan rekayasa dan desain otoritatif mendalam untuk **Apple Human Interface Guidelines (HIG)** (`https://developer.apple.com/design/human-interface-guidelines`) di seluruh platform iOS 18+, iPadOS 18+, macOS 15 Sequoia, visionOS 2+, watchOS 11+, dan tvOS 18+. Mencakup triad inti (Hierarchy, Harmony, Consistency), 3 Tema Desain Apple (Clarity, Deference, Depth), 6 Prinsip Desain Fondasional, Warna Semantik & Elevasi Dark Mode, Material & Liquid Glass, Tipografi SF & Dynamic Type, Navigasi & Modalitas, SF Symbols 6, serta sintesis perbandingan dengan Google Material Design 3 (M3).

### Kondisi Pemicu
- Meninjau atau mengkritik desain antarmuka terhadap standar Apple HIG atau Material 3.
- Mengambil keputusan arsitektural tentang skala tipografi, penggunaan warna semantik, atau hierarki tata letak.
- Merancang aplikasi lintas platform (iOS, iPadOS, macOS, visionOS, Android, web) yang mempertahankan konvensi native.
- Mengimplementasikan presentasi Dynamic Island, Live Activities, atau toolbar floating glass.
- Mengevaluasi apakah antarmuka terasa "premium native" atau "amatir generik".
- Menegakkan batas minimum target sentuh (44×44pt di iOS, 60×60pt di visionOS, 28×28pt di macOS).

---

### 3 Tema Desain Inti Apple HIG

Bahasa desain Apple berakar pada tiga tema utama yang melandasi setiap interaksi:

#### 1. Kejelasan (Clarity)
- **Keterbacaan Prima**: Teks terbaca jelas di semua ukuran dengan leading dan tracking optik yang proporsional.
- **Ikon yang Terang**: Ikon dan simbol visual dirancang presisi, lugas, dan seimbang.
- **Dekorasi yang Fungsional**: Ornamen dan aksen visual bersifat halus dan murni melayani fungsionalitas.
- **Didorong oleh Konten**: Ruang negatif, warna, font, dan kontrol menonjolkan konten penting dan mengomunikasikan status interaksi.

#### 2. Penghormatan pada Konten (Deference)
- **Konten adalah yang Utama**: Antarmuka tidak pernah bersaing dengan konten pengguna. Gerakan fluida dan arsitektur visual yang jernih membantu pengguna memahami dan berinteraksi tanpa distraksi.
- **Kanvas Luas & Bersih**: Konten mengisi layar dari tepi ke tepi. Efek translusensi dan blur memberikan petunjuk konteks tanpa menutupi konten.
- **Menghilangkan Bezel & Shadow Tebal**: Singkirkan border tebal kaku, drop shadow hitam pekat, dan gradien mencolok.

#### 3. Kedalaman Visual & Spasial (Depth)
- **Lapisan Visual yang Hidup**: Lapisan bertingkat dan fisika gerakan yang realistis menghadirkan vitalitas dan kepuasan interaksi.
- **Petunjuk Sentuhan & Spasial**: Sentuhan, hover pointer, dan konvergensi spasial membentuk model fisik yang intuitif.
- **Material Berkonteks**: Efek kaca translusen dan vibransi mencerminkan posisi pengguna dalam hierarki navigasi.

---

### 6 Prinsip Desain Fondasional Apple

1. **Integritas Estetika (Aesthetic Integrity)**: Tampilan visual dan perilaku menyatu selaras dengan fungsi aplikasi. Aplikasi produktivitas mengutamakan kontrol subtil agar pengguna fokus bekerja; aplikasi media dan game menghadirkan pengalaman grafis yang imersif.
2. **Konsistensi (Consistency)**: Kepatuhan pada standar sistem, ikon familiar, gaya teks terstandarisasi, dan perilaku komponen yang dapat diprediksi. Pengguna memanfaatkan pengalaman platform yang sudah mereka miliki.
3. **Manipulasi Langsung (Direct Manipulation)**: Berinteraksi langsung dengan objek di layar (mencubit untuk zoom, menyeret list, memutar gambar, atau gaze + pinch di visionOS) alih-alih melalui kontrol terpisah.
4. **Umpan Balik (Feedback)**: Konfirmasi instan atas aksi pengguna melalui mikro-animasi visual, suara sistem, dan haptik sensorik (impact, notifikasi, seleksi).
5. **Metafora (Metaphors)**: Memanfaatkan konsep fisik dunia nyata (lembar sheet, kartu bertumpuk, halaman buku, audio spasial, jendela desktop) agar interaksi digital terasa alami.
6. **Kendali Pengguna (User Control)**: Pengguna — bukan sistem atau AI otomatis — memegang kendali mutlak. Pastikan keputusan dapat dibatalkan (undo/cancel), dan cegah kejutan aksi destruktif tanpa konfirmasi.

---

### Fondasi: Warna Semantik, Material, Tipografi & Tata Letak

#### 1. Warna Semantik & Elevasi Dark Mode
Apple HIG menerapkan token warna semantik yang secara dinamis beradaptasi antara Mode Terang dan Mode Gelap:
- **Tingkatan Teks (Label)**:
  - `label`: Hitam pekat di Mode Terang, Putih 100% di Mode Gelap.
  - `secondaryLabel`: Opasitas 60% untuk subjudul dan informasi pendukung.
  - `tertiaryLabel`: Opasitas 30% untuk placeholder dan teks pembantu.
  - `quaternaryLabel`: Opasitas 18% untuk watermark dan pemisah dekoratif.
- **Elevasi Sumbu-Z Mode Gelap**:
  Pada Mode Gelap, semakin tinggi elevasi elemen di sumbu Z, semakin terang warna latar belakangnya (L0 Kanvas: `#000000` -> L1 Kartu: `#1C1C1E` -> L2 Popover/Modal: `#2C2C2E` -> L3 Floating: `#3A3A3C`). Hal ini menciptakan kedalaman alami tanpa bayangan hitam pekat.

#### 2. Material & Liquid Glass
Antarmuka Apple modern membangun kedalaman melalui material tembus pandang dinamis:
- **Ultra Thin & Thin Material**: Overlay navigasi dan bilah pencarian halus.
- **Regular Material**: Kontainer default sheet modal, floating tab bar, dan segmented card.
- **Thick & Ultra Thick Material**: Kontrol elevasi tinggi dan widget dengan latar belakang kontras tinggi.
- **Formula CSS Liquid Glass**: `backdrop-filter: blur(20px) saturate(180%)` dengan border translusen 1px (`rgba(255, 255, 255, 0.2)`).

#### 3. Tipografi San Francisco & Skala Dynamic Type Apple
Keluarga font SF menggunakan ukuran optik: **SF Pro Text** untuk ukuran `< 20pt` (tracking lebih renggang, x-height lebih tinggi) dan **SF Pro Display** untuk ukuran `≥ 20pt` (tracking lebih rapat, proporsi elegan).

- **Large Title**: 34pt / Leading 41pt (Judul besar yang menciut saat di-scroll).
- **Title 1**: 28pt / Leading 34pt.
- **Title 2**: 22pt / Leading 28pt.
- **Title 3**: 20pt / Leading 25pt.
- **Headline**: 17pt / Leading 22pt (Semibold, penekanan teks tubuh).
- **Body**: 17pt / Leading 22pt (Regular, teks konten utama).
- **Callout**: 16pt / Leading 21pt.
- **Subheadline**: 15pt / Leading 20pt.
- **Footnote**: 13pt / Leading 18pt.
- **Caption 1 & 2**: 12pt / 11pt.
- **Invarian Angka Tabular**: Wajib menggunakan `font-variant-numeric: tabular-nums` (SwiftUI `.monospacedDigit()`) pada seluruh nilai metrik, timer, kurs, dan harga agar angka tidak berguncang secara horizontal.

#### 4. Target Sentuh & Kelengkungan Sudut Squircle
- **Batas Minimum Target Sentuh**:
  - **iOS & iPadOS**: Minimal **44×44pt** (meskipun ukuran visual tombol lebih kecil, area tap wajib diperluas).
  - **visionOS**: Minimal **60×60pt** area interaksi dengan bounds visual 44pt.
  - **macOS**: Minimal **28×28pt** target kursor mouse (20pt untuk toolbar mikro).
  - **watchOS**: Minimal **38×38pt** area sentuh selebar baris.
- **Squircle Kontinu (Superellipse)**:
  Apple tidak menggunakan busur lingkaran standar, melainkan kurva superellipse kontinu ($n \approx 4$) yang menghindari patahan visual di titik pertemuan garis lurus dan busur (`corner-shape: squircle` / SwiftUI `.clipShape(.rect(cornerRadius: 18, style: .continuous))`).

---

### Pola Navigasi & Arsitektur Komponen

#### 1. Arsitektur Navigasi
- **Navigasi Hierarkis (`NavigationStack`)**:
  - Tumpukan drill-down satu kolom.
  - Bilah navigasi atas otomatis memuat tombol kembali dengan judul layar sebelumnya.
  - Gestur geser dari tepi kiri (edge swipe) wajib berfungsi mulus tanpa interupsi.
- **Navigasi Sejajar / Peer (`TabView`)**:
  - 3 hingga 5 tab utama di bagian bawah layar.
  - Berubah menjadi kapsul kaca melayang di iOS 18/visionOS, atau bertransformasi menjadi sidebar di iPadOS 18 dan macOS.
- **Split View (`NavigationSplitView`)**:
  - 2 kolom (Sidebar + Detail) atau 3 kolom (Sidebar + Daftar Konten + Detail).
  - Mendukung sidebar yang dapat disembunyikan/ditampilkan dengan ikon sistem standar.

#### 2. Modalitas & Detents
- **Sheet Modal (`.sheet`)**:
  - Presentasi kontekstual yang mempertahankan latar belakang.
  - Detents standar: `.medium` (setengah layar) dan `.large` (layar penuh).
  - Dilengkapi indikator grabber yang jelas dan dapat ditutup dengan gestur tarik ke bawah.
- **Full Screen Cover (`.fullScreenCover`)**:
  - Dikhususkan untuk alur yang memerlukan penyelesaian atau pembatalan eksplisit (misal: scanner dokumen, kamera, checkout pembayaran).
- **Dialog Konfirmasi (Action Sheet)**:
  - Menu aksi kontekstual yang muncul dari bawah atau titik tap.
  - Aksi destruktif diwarnai merah dengan konfirmasi kedua wajib.

#### 3. Presentasi Dynamic Island (iOS 18+)
Dynamic Island beradaptasi dalam 4 status presentasi:
1. **Compact**: Sisi kiri (Leading) memuat ikon entitas, sisi kanan (Trailing) memuat metrik real-time.
2. **Minimal**: Tampil saat beberapa Live Activities berjalan bersamaan (lingkaran terpisah di samping pil utama).
3. **Expanded**: Terbuka saat ditekan lama, membagi area menjadi leading, trailing, center, dan aksi bawah.
4. **Lock Screen & StandBy**: Menampilkan banner kartu kontras tinggi di layar kunci.

#### 4. Sistem Tombol & Peran Sistem
- **Filled (`.borderedProminent`)**: Tepat SATU tombol utama per layar (`bg-apple-system-blue text-white`).
- **Tinted (`.bordered`)**: Tombol aksi sekunder dengan latar belakang berona lembut dan teks berwarna aksen.
- **Gray (`.bordered` neutral)**: Tombol utilitas netral untuk filter atau aksi pendukung.
- **Plain (`.borderless`)**: Tombol teks murni atau ikon di dalam tabel dan toolbar.
- **Peran Destruktif**: Berwarna merah sistem (`--apple-system-red`) untuk operasi penghapusan permanen.

#### 5. SF Symbols 6
Lebih dari 6.000 simbol vektor dengan 9 bobot dan 3 skala:
- **Mode Render**: `Monochrome`, `Hierarchical` (gradasi opasitas satu warna), `Palette` (warna berbeda per layer), dan `Multicolor` (warna semantik bawaan sistem).
- **Animasi Simbol**: `Bounce`, `Scale`, `Pulse`, `Variable Color`, `Replace`, `Breathe`, `Disappear`.

---

### Sintesis Komparatif: Apple HIG vs Google Material Design 3 (M3)

| Dimensi | Apple Human Interface Guidelines (HIG) | Google Material Design 3 (M3) |
| :--- | :--- | :--- |
| **Filosofi Inti** | Content-First, Deference, Kejelasan, Kedalaman | Ekspresif, Adaptif, Personalisasi Dinamis (Material You) |
| **Elevasi & Kedalaman** | Material Translusen, Liquid Glass, Pencerahan Sumbu-Z Dark Mode | Tingkatan Tonal Surface Container Berbasis Algoritma |
| **Sistem Warna** | Pasangan Warna Semantik (Light/Dark) + Tint Sistem | Ruang Perseptual HCT (Hue, Chroma, Tone) dari Warna Seed |
| **Tipografi** | SF Pro (Ukuran optik Text & Display) + New York | Roboto & Roboto Flex (Sumbu variabel: weight, width, optical size) |
| **Ikonografi** | SF Symbols 6 (Hierarkis, Palet, Animasi Variabel) | Material Symbols (Sumbu variabel: Weight, Fill, Grade, Opsz) |
| **Target Sentuh Minimal** | 44×44pt (iOS) / 60×60pt (visionOS) / 28×28pt (macOS) | Disarankan 48×48dp (Batas fisik minimal 24×24dp) |
| **Kelengkungan Sudut** | Continuous Squircle / Superellipse ($n \approx 4$) | Skala Radius Geometris Eksplisit (0, 4, 8, 12, 16, 28, 9999px) |
| **Navigasi Utama** | Bottom Tab Bar (iOS) / Morphing Sidebar (iPadOS) | Navigation Bar (Bawah 80dp) / Navigation Rail (Sisi 80dp) |

---

### 20 Checklist Audit Kepatuhan Apple HIG

- [ ] 1. **Hukum Single Primary CTA**: Tepat satu tombol primer filled per layar. Aksi sekunder menggunakan tinted, gray, atau plain.
- [ ] 2. **Dimensi Target Sentuh**: Seluruh elemen interaktif memiliki area sentuh minimal `44×44pt` di iOS/iPadOS dan `28×28pt` di macOS.
- [ ] 3. **Kepatuhan Dynamic Type**: Elemen teks merespons perubahan ukuran font sistem tanpa terpotong atau tumpang tindih.
- [ ] 4. **Angka Tabular**: Seluruh metrik, harga, counter, dan timer menerapkan `font-variant-numeric: tabular-nums`.
- [ ] 5. **Proteksi Safe Area Inset**: Header atas dan navigasi bawah memperhitungkan `env(safe-area-inset-top)` dan `env(safe-area-inset-bottom)`.
- [ ] 6. **Elevasi Permukaan Dark Mode**: Permukaan sumbu Z yang lebih tinggi menjadi lebih terang pada Mode Gelap (`#000000` -> `#1C1C1E` -> `#2C2C2E`).
- [ ] 7. **Kontras Teks WCAG AA**: Teks tubuh memenuhi rasio kontras ≥ 4.5:1; judul besar dan kontrol interaktif ≥ 3.0:1.
- [ ] 8. **Diferensiasi Tanpa Warna Tunggal**: Status, peringatan, dan badge menyertakan ikon atau label teks, tidak semata-mata mengandalkan warna.
- [ ] 9. **Kurva Pegas Interaktif**: Animasi menggunakan fisika pegas interaktif yang dapat diinterupsi (`response: 0.35s`, `dampingRatio: 0.82`).
- [ ] 10. **Alternatif Reduce Motion**: Mengakomodasi preferensi `prefers-reduced-motion` dengan mengganti slide spasial menjadi transisi fade halus.
- [ ] 11. **Liquid Glass & Translusensi**: Bilah navigasi melayang menerapkan `backdrop-filter: blur(20px) saturate(180%)`.
- [ ] 12. **Sudut Squircle Kontinu**: Kartu, dialog, dan tombol menerapkan kelengkungan superellipse kontinu tanpa sudut patah.
- [ ] 13. **Gestur Navigasi Hierarkis**: Gestur geser dari tepi kiri untuk kembali (swipe back) tidak pernah diblokir atau diinterupsi.
- [ ] 14. **Detent Sheet & Grabber**: Sheet modal bawah menyediakan detent `.medium` dan `.large` dengan pegangan grabber yang jelas.
- [ ] 15. **Umpan Balik Haptik Sensorik**: Aksi penting memicu haptik yang sesuai (impact saat tap tombol, notifikasi sukses/gagal).
- [ ] 16. **Ergonomi Dynamic Island**: Live Activities menyediakan tata letak compact leading/trailing, minimal, dan expanded.
- [ ] 17. **Adaptasi Pointer iPadOS**: Kontrol interaktif bereaksi terhadap hover kursor dengan sorotan background atau efek magnetik.
- [ ] 18. **Integrasi SF Symbols**: Ikon menggunakan SF Symbols dengan bobot, skala, dan mode rendering semantik yang konsisten.
- [ ] 19. **Keamanan Aksi Destruktif**: Operasi penghapusan permanen berwarna merah sistem dan mewajibkan dialog konfirmasi sekunder.
- [ ] 20. **Standar Kerapian Anti-Slop**: Nol gradien ungu-sian AI klise, nol tombol pill tanpa style, dan kontrak interaktif 5-state lengkap.

---

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Muse Wonder High`, `Composer 2.5 Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec hig <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_visual_audit`, `vibes_ast_query`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Target sentuh minimal 44×44pt, border tegas 1px, radius squircle kontinu, `tabular-nums`, kontrak interaktif 5-state; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
