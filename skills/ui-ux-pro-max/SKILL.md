---
name: ui-ux-pro-max
description: "Comprehensive UI/UX design guide and BM25 search engine for 11 stacks / Panduan desain UI/UX komprehensif dan mesin pencari BM25 11 stack."
author: "Roedy Rustam"
version: "4.7.0"
---

# UI/UX Pro Max - Design Intelligence System

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills:
- **`modern-web-guidance`**: Run focused queries for 2026 web UI patterns, accessibility standards, and native platform features.
- **`design-system-architect`**: Establishes OKLCH token scales, surface container tiers (L0-L4), and Base UI / Radix primitives.
- **`modern-css-native-expert`**: Implements pure CSS anchor positioning, `@starting-style`, and top-layer modal transitions.
- **`tailwind-expert`**: Binds visual hierarchy recipes, 60-30-10 color layering, and optical tracking in Tailwind v4.
- **`visual-ui-auditor`**: Conducts 20-point visual audits, multimodal screenshot inspections, and Playwright tests.
- **`anti-slop`**: Enforces strict Pillar 7 visual sanitation, eliminating AI clichés, pill buttons, and fake states.
- **`hig`**, **`brainstorming`**, **`zero-to-prod-orchestrator`**, **`session-memory-manager`**: Continuous lifecycle alignment.
- **Cross-Domain Synergy & Subagent Swarm Integration**: `screenshot-to-code-expert`, `website-design-cloner`, `multimodal-spatial-video-cloner`, `rich-text-editor-expert`, `ephemeral-generative-ui-architect`

### Description
UI/UX Pro Max is a comprehensive design intelligence engine equipped with an offline BM25 search index covering color palettes, typography, responsive patterns, icon sets, chart recommendations, UX guidelines, **Material Design 3 (M3)**, and stack-specific best practices across **11 technology stacks**.

### Trigger Conditions
Reference these guidelines or run the CLI search engine when:
- Designing new UI components, landing pages, or dashboards.
- Choosing color schemes, font pairings, and design tokens.
- Learning, reverse-engineering, or cloning website design templates & components directly from a target URL (Combine with `website-design-cloner`).
- Generating a complete design system recommendation for a project.
- Auditing code for UX, accessibility (a11y), or performance issues.
- Needing stack-specific code patterns (React, Next.js, Vue, Nuxt, Svelte, Tailwind, SwiftUI, React Native, Flutter, Shadcn).

---

### Python BM25 Search CLI Integration

The skill includes a fast Python search engine in `scripts/search.py` that queries 12 domain CSV datasets and 11 tech-stack CSV datasets.

#### 1. Generate Complete Design System Recommendation
Run this before starting design/coding to get an aggregated design system spec:
```bash
python scripts/search.py "<project/topic query>" --design-system -p "Project Name" -f markdown
```
*Example:* `python scripts/search.py "SaaS analytics dashboard" --design-system -p "MetricsApp" -f markdown`

#### 2. Domain-Specific Search
Search specific design domains:
```bash
python scripts/search.py "<query>" --domain <domain> --max-results 3
```
- **Available Domains (`--domain`)**:
  - `style`: Visual design styles (Minimalism, Glassmorphism, Dark Mode, Aurora, Brutalism, Bento Grid, Spatial UI, WebGL 3D elements, etc.)
  - `prompt`: Copy-paste ready AI prompts & CSS implementation checklists
  - `color`: Hex color palettes tailored by product type (Primary, Secondary, CTA, Background, Text)
  - `chart`: Chart type recommendations, library suggestions, accessibility & color guidance
  - `landing`: High-converting landing page layouts, section orders & CTA placement
  - `product`: Product-type specific design system blueprints (SaaS, E-commerce, Fintech, Crypto, AI-Native Chat Interfaces, etc.)
  - `ux`: UX anti-patterns, usability best practices, severity, and good/bad code examples
  - `typography`: Google font pairings, heading/body recommendations, mood keywords & CSS imports
  - `icons`: Icon usage guidance, SVG libraries (Lucide, Heroicons), and code imports
  - `react`: React & Next.js performance optimizations, re-render fixes & dynamic imports
  - `web`: Web interface guidelines (ARIA, focus traps, virtual list, form inputs)
  - `m3`: Material Design 3 specific design tokens, color roles, elevation, and component specs
  - `preset-monday`: Monday.com spacious SaaS aesthetic (Vibrant Blue `#0073ea`, Clean White `#FFFFFF` + Light Grays `#F9F9F9`/`#F5F6F8`, Dark Footer `#111111`, Figtree/Inter fonts, 12-16px card radius, 80-120px vertical spacing)
  - `preset-niubigeo`: NiubiGEO Cosmic Evidence & Interactive Utility archetype (Deep Obsidian `#080a0f`, layered navy slate `#11141e`/`#181b29`, hairline borders `#272b3c`, Electric Lavender `#b7a0ff` + Emerald Jade `#7ce4b0` dual accents, crisp `#f5f4fa` text, hero conversion inversion with embedded `#product-setup` diagnostic widget, actionable evidence bento grid, 4-step flow navigator, organic velocity social proof)

*Example:* `python scripts/search.py "fintech dark theme" --domain color`

#### 3. Stack-Specific Guidelines Search
Search guidelines tailored to your exact tech stack:
```bash
python scripts/search.py "<query>" --stack <stack> --max-results 3
```
- **Supported Stacks (`--stack`)**:
  - `html-tailwind` | `react` | `nextjs` | `vue` | `nuxtjs` | `nuxt-ui` | `svelte` | `swiftui` | `react-native` | `flutter` | `shadcn`

*Example:* `python scripts/search.py "virtualized list performance" --stack react`

---

### Quick Reference for Professional Rules

#### 1. Accessibility (WCAG 2.2) - CRITICAL
- **Color Contrast**: Minimum 4.5:1 ratio for normal text, 3:1 for large text/UI components.
- **Focus States**: Visible focus rings (`focus-visible:ring-2 focus-visible:ring-offset-2`) during keyboard navigation.
- **Alt Text & ARIA**: Descriptive alt text for imagery; proper `aria-expanded`, `aria-controls`, and semantic HTML tags.

#### 2. Touch & Interaction - CRITICAL
- **Touch Target Size**: Minimum 44x44px for mobile devices.
- **Loading & State**: Disable buttons during async requests to prevent duplicate submissions; show subtle spinners or skeleton loaders.
- **Cursor Pointer**: Always add `cursor-pointer` to clickable/interactive elements.

#### 3. Performance & Animation - HIGH / MEDIUM
- **Image & Assets**: Use WebP/AVIF formats, `srcset`, explicit `width`/`height` attributes, and `loading="lazy"`.
- **Micro-interactions**: Keep transition durations between 150ms–300ms (`ease-in-out`) for fast and responsive UI feel.
- **Reduced Motion**: Respect `prefers-reduced-motion: reduce`.

#### 4. Light/Dark Mode Contrast
- **Light Mode**: High-contrast text (e.g. Slate-900 `#0F172A`); avoid pale grays for primary text. Ensure borders (`border-slate-200`) remain visible.
- **Dark Mode**: High contrast foreground elements over dark slate/gray backgrounds; avoid pure black `#000000` text containers unless requested.

#### 5. Sovereign Visual Hierarchy & Elegant Aesthetic Architecture
Visual hierarchy guides the user's perception through deliberate scale, contrast, spacing, depth, and rhythm (Linear/Apple/Stripe-caliber design):

- **Modular Typographic Rhythm & Optical Tracking**:
  - **Eyebrow / Overline**: `text-[11px] font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400` — sets immediate context with deliberate breathing room.
  - **Hero / Display Title**: `text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-[1.1]` — tight optical tracking creates punchy authority.
  - **Section / H2**: `text-xl md:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100` — anchored section landmark.
  - **Subheading / Body**: `text-sm md:text-base font-normal leading-relaxed text-neutral-600 dark:text-neutral-300` — comfortable reading flow.
  - **Tabular Figures Contract**: Mandatory `tabular-nums` (`font-variant-numeric: tabular-nums`) on all metrics, counters, currency values, dates, and data tables to prevent horizontal layout jiggle.

- **The 60-30-10 Color Rule & Single Primary CTA Dominance**:
  - **60% Neutral Base**: Main canvas/background (`bg-neutral-50 dark:bg-neutral-950`).
  - **30% Structural Surface**: Cards, sidebars, headers, table shells (`bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800`).
  - **10% Intentional Accent**: Reserved exclusively for key conversion moments (Primary CTA, active navigation marker, key KPI badge).
  - **Single Focal Point Rule**: Maximum ONE primary button per viewport. Secondary actions must use outline/subtle treatments; tertiary actions use ghost/text-only variants.
  - **3-Tier Semantic Text Contrast**: Primary text (`text-neutral-900 dark:text-neutral-50` >= 7:1 contrast), secondary text (`text-neutral-600 dark:text-neutral-400` >= 4.5:1), tertiary/metadata (`text-neutral-400 dark:text-neutral-500`).

- **Gestalt Proximity & Spatial Breathing Room**:
  - **Label-Input Tightness**: Place form labels tightly to their fields (`gap-1.5` / 6px).
  - **Internal vs External Gaps**: Card internal padding (`p-5` or `p-6`) must exceed element gaps (`gap-3` or `gap-4`).
  - **Section Cadence**: Separate major blocks with generous whitespace (`py-16 md:py-24` or `gap-8 md:gap-12`). Whitespace is an active structural design asset.

- **Surface Layering, Tactile Depth & Crisp 1px Borders**:
  - **Physical Elevation Tiers**:
    - *Canvas (L0)*: App background (`bg-neutral-50/50 dark:bg-neutral-950`).
    - *Card (L1)*: Content container (`bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs`).
    - *Raised (L2)*: Dropdown menu, popover, hover card (`shadow-md border border-neutral-200 dark:border-neutral-700`).
    - *Overlay (L3)*: Modal dialog with backdrop (`shadow-xl`).
    - *Floating (L4)*: Toast alert, persistent dock (`shadow-2xl`).
  - **Sanitation**: Ban blurry muddy 30px black shadows and ungrounded glowing neon orbs. Enforce crisp 1px borders paired with directional micro-shadows.

- **Scanability & Layout Flow Patterns**:
  - **F-Pattern**: Apply to dense data views, dashboards, and feeds (strong left-anchor for headings, metrics, and row labels).
  - **Z-Pattern**: Apply to marketing hero sections and conversion landing pages (Logo -> Secondary CTA -> Value Prop -> Primary CTA).
  - **Progressive Chunking**: Break large datasets into clear card modules with distinct header, metric, and footer zones.
  - **Material Design 3 (M3) Integration**: Support Adaptive Window Size Classes (Compact <600dp, Medium 600–839dp, Expanded ≥840dp) and tonal elevation tiers (`surface-container-lowest` to `surface-container-highest`).

#### 6. Anti-Generic Website Architecture: Floating Island Capsule Navigation & Rich Flyout Mega Menus
Standard template websites default to generic, full-width, edge-to-edge glued rectangular navigation bars that look dated and monotonous. For premium, non-generic (Linear/Apple/Stripe-caliber) websites, mandate the **Floating Island Glass Capsule** and **Rich Card Flyout** architectural pattern:

- **Floating Pill / Capsule Style Navigation**:
  - **Detached Island Elevation**: The navigation bar floats gracefully above the background rather than being glued to the ceiling of the viewport (`fixed top-4 md:top-6 inset-x-0 mx-auto w-[calc(100%-2rem)] max-w-5xl z-50`).
  - **Capsule Geometry**: Fully rounded ends resembling a tactile hardware capsule (`rounded-full px-4 md:px-6 py-2.5 md:py-3`).
  - **Translucent Dark Glassmorphism**: High-grade dark translucent surface with fine backdrop blur (`bg-neutral-950/75 dark:bg-neutral-950/80 backdrop-blur-xl saturate-180`).
  - **Crisp Perimeter & Inner Bevel**: 1px subtle boundary border (`border border-white/10 dark:border-white/12`) paired with an inner top highlight stroke (`shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)]`). As the page scrolls, underlying content blurs softly behind the capsule without breaking readability.

- **Flyout / Mega Menu Dropdown (Rich Floating Card Architecture)**:
  - **Centered Island Geometry**: When navigation items (e.g. *Skills*, *Solutions*, *Features*) are hovered or clicked, the dropdown appears as an elevated floating card centered directly beneath the capsule bar (`left-1/2 -translate-x-1/2 mt-3.5 w-[680px] max-w-[calc(100vw-2rem)] rounded-2xl p-5 md:p-6`). Never skew or arbitrarily pin the mega menu to one edge where it awkwardly collides with brand emblems.
  - **High-Density Solid Backing & Zero Bleed-Through**: The card must use deep, near-opaque backing (`bg-[#090c15] / bg-neutral-950/98 backdrop-blur-2xl border border-white/12 shadow-[0_25px_65px_-12px_rgba(0,0,0,0.95),0_0_35px_rgba(6,182,212,0.1)]`) to ensure bright badges, text, and graphics from the page behind it never bleed through or reduce legibility.
  - **Zero Plain-Text Lists**: Never render bare vertical lists of unadorned text links.
  - **Structured Submenu Grids**: Group items into logical category columns with uppercase overline eyebrows.
  - **Rich Card Affordances**: Each item must feature:
    1. A subtle icon container (`w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform`).
    2. A crisp, bold title (`text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors`).
    3. A concise 1-sentence value description (`text-xs text-neutral-400 line-clamp-1`).
  - **Accessibility Contract**: Full keyboard navigation support (`aria-expanded`, `aria-haspopup="true"`, `role="menu"`), focus rings, and instant closure on `Escape` key.

#### 7. Linear-Style Isometric Anatomy Instruments & Physical Explainer Cards
When explaining core system mechanics, architecture, or algorithmic state on landing pages and documentation sites, avoid banal flowchart diagrams (generic boxes with arrows). Deploy the **Anatomy Explainer Card Standard**:
- **Tactile Physical Rig**: Frame the concept as a high-density mechanical machine: machined bedplate, knurled thumb knobs, linear rails, spring-loaded carriages, bronze bushings, and calibrated dial gauges.
- **Framed Instrument Card**: Encapsulate within an elevated card: `Fig n` (top-left, uppercase monospace), Feature Title (top-right, bold), User Interaction Hint (bottom-left, muted), and real-time Live Readout (`tabular-nums`, tracking dynamic values at bottom-right).
- **Four-Tone Surface Shading**: Strict lighting hierarchy: `lo` (shadowed underside), `mid` (vertical structural frame), `hi` (top faces), and exactly one `lit` accent (white/cyan moving needle or active probe).
- **Lines Resolve Invariant**: Every tick, ruler mark, and wire terminates flush onto another solid edge or screw terminal; zero floating arrows.

---

#### 8. Anti-Monotony Website Architecture: 6 Distinct Archetypal Modes (Zero Boring Web Standard)
A widespread failure mode of AI-generated websites is aesthetic monotony: defaulting to an identical centered hero on dark slate (`bg-slate-900`), blurry purple/cyan glowing neon gradients, 3 generic feature cards, and placeholder testimonials.

To permanently eradicate monotonous outputs, agents MUST classify every new web project into one of **6 intentional design archetypes** or present them to the user:

```
                     ┌───────────────────────────────────────────────────────────┐
                     │          ANTI-MONOTONY ARCHITECTURAL TAXONOMY             │
                     └─────────────────────────────┬─────────────────────────────┘
                                                   │
        ┌───────────────────┬──────────────────────┼─────────────────────┬───────────────────┐
        ▼                   ▼                      ▼                     ▼                   ▼
┌───────────────┐   ┌───────────────┐      ┌───────────────┐     ┌───────────────┐   ┌───────────────┐
│    MODE A     │   │    MODE B     │      │    MODE C     │     │    MODE D     │   │    MODE E     │
│   NiubiGEO    │   │  Monday.com   │      │    Linear     │     │ Apple Spatial │   │  High-Density │
│Cosmic Evidence│   │ Spacious SaaS │      │Precision Mono │     │  Glass Luster │   │Fintech/Termina│
└───────────────┘   └───────────────┘      └───────────────┘     └───────────────┘   └───────────────┘
```

##### Mode A: NiubiGEO Cosmic Evidence & Interactive Utility (The NiubiGEO Archetype)
- **Essence & Personality**: High-intellect developer/AI SaaS, actionable empirical proof over vanity scores, instant interactive conversion utility embedded right on the fold.
- **Design Tokens**:
  ```css
  @theme {
    --color-bg: #080a0f;           /* Deep Cosmic Obsidian */
    --color-panel: #11141e;        /* Layer 1 Surface */
    --color-panel-2: #181b29;      /* Layer 2 Surface */
    --color-line: #272b3c;         /* Hairline 1px Divider */
    --color-text-main: #f5f4fa;    /* Crisp Off-White */
    --color-text-muted: #979aaf;   /* Muted Violet-Slate */
    --color-accent-purple: #b7a0ff;/* Electric Lavender (Brand/Active) */
    --color-accent-green: #7ce4b0; /* Emerald Jade (Evidence/Verification) */
    --font-sans: "Inter", "Noto Sans SC", system-ui, sans-serif;
  }
  ```
- **Core Structural Pillars**:
  1. **Conversion Inversion Hero**: Never render an empty hero with just text and a passive "Sign Up" button. Embed a functioning diagnostic or interactive utility input widget (`#product-setup`) immediately below the hero copy. Users test their URL, repo, or domain with zero signup friction.
  2. **Actionable Evidence Bento Grid**: 4 modular cards:
     - *Brand Visibility Signal*: Status pulse dot, detection rate percentage across frontier LLMs.
     - *Description Accuracy*: Tag cloud validating accurate entity descriptions vs AI hallucinations.
     - *Competitors & Multi-Platform Citations*: Real platform emblems (ChatGPT, Claude, Gemini, Perplexity, Substack, Telegram).
     - *Prioritized Action Checklist*: Actionable triage items with interactive status badges.
  3. **Interactive Step Navigator**: Horizontal tabbed flow showing the mechanical journey from audience discovery to continuous distribution.
  4. **Organic Social Velocity Bento Grid**: Authoritative validation cards: real GitHub trending badges, Tech Daily leaderboard rankings, long-form technical article deep dives, and live human network counts.
  5. **Micro-Interactions**: Hover arrow nudges (`lucide-arrow-right` shifts +4px on hover), pulsing radar signal rings (`recognition-pulse`), hairline 1px border glows (`#76508d`).

##### Mode B: Monday.com Spacious SaaS & Warm Editorial
- **Essence**: Welcoming, highly organized, human enterprise productivity.
- **Tokens**: Vibrant Blue (`#0073ea`), Crisp White (`#ffffff`), Soft Fog Containers (`#f9f9f9`/`#f5f6f8`), Deep Obsidian Footer (`#111111`).
- **Layout**: Expansive 80px–120px vertical section spacing, soft 12px–16px card radiuses, Figtree typography, color-coded status chips.

##### Mode C: Linear Precision Monochromatic Dark
- **Essence**: Mechanical speed, craft-first keyboard workflows, zero fluff.
- **Tokens**: Pure Zinc/Graphite (`#09090b`), Crisp Monochromatic Grays (`#ffffff`/`#a1a1aa`), Razor 1px borders (`#27272a`).
- **Layout**: Floating island capsule navbar, tactile isometric machine anatomy explainer cards, monospace `tabular-nums`, subtle radial spotlight hovers.

##### Mode D: Apple Spatial Glass & Ambient Luster
- **Essence**: Premium hardware-software harmony, spatial immersion, tactile depth.
- **Tokens**: Multi-layered frosted glass (`backdrop-blur-2xl bg-white/70 dark:bg-black/60`), specular inner edge highlight (`shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]`), large fluid rounded-3xl cards.
- **Layout**: Cinematic typography scale, spring physics motion, soft ambient background luster.

##### Mode E: High-Density Fintech / Bloomberg Intelligence Terminal
- **Essence**: Institutional trustworthiness, real-time data transparency, quantitative precision.
- **Tokens**: Deep Matte Charcoal (`#121212`), Terminal Amber (`#f59e0b`), Signal Mint Green (`#10b981`), Slate Border (`#1f2937`).
- **Layout**: Real-time ticker streams, double-entry ledger cards, dense data tables with zero layout shifts (`tabular-nums`), interactive sparkline charts.

##### Mode F: Neo-Brutalist High-Impact Editorial
- **Essence**: High-voltage developer counter-culture, high memorability, unapologetic contrast.
- **Tokens**: Pure Black (`#000000`), Stark White (`#ffffff`), High-saturation accents (Cyber Yellow `#facc15`, Electric Orange `#fb923c`).
- **Layout**: 2px–3px solid black outlines, hard offset drop shadows (`4px 4px 0px #000`), bold display sans-serif (800 weight), asymmetric grid blocks.

---

#### 9. Dribbble-Grade Hero Section Architecture: 7 Expressive Archetypes (Anti-Monotony Hero Standard)
The most common point of visual fatigue in AI-generated websites is the hero section. AI assistants perpetually default to one monotonous composition: *Centered text + 2 generic buttons + static centered rectangle placeholder below*.

To ensure every web project features a captivating, memorable, and high-converting first impression, agents MUST choose and implement one of **7 Dribbble-Grade Hero Section Archetypes**:

```
                     ┌───────────────────────────────────────────────────────────┐
                     │          7 DRIBBLE-GRADE HERO SECTION ARCHETYPES          │
                     └─────────────────────────────┬─────────────────────────────┘
                                                   │
     ┌──────────────────────┬──────────────────────┼──────────────────────┬──────────────────────┐
     ▼                      ▼                      ▼                      ▼                      ▼
┌───────────────┐   ┌───────────────┐      ┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│  ARCHETYPE 1  │   │  ARCHETYPE 2  │      │  ARCHETYPE 3  │      │  ARCHETYPE 4  │      │  ARCHETYPE 5  │
│ Split-Screen  │   │Kinetic Center │      │ Modular Above │      │  Interactive  │      │   Editorial   │
│3D Perspective │   │   Fold Peek   │      │   Fold Bento  │      │Utility Hero UI│      │ Neo-Brutalist │
└───────────────┘   └───────────────┘      └───────────────┘      └───────────────┘      └───────────────┘
```

##### 1. Archetype 1: Asymmetric 50/50 Split-Screen with 3D Perspective Tilt & Floating Live Chips
- **Best For**: B2B SaaS, FinTech, Productivity Platforms, Mobile App Showcases.
- **Visual Composition**:
  - **Left Column**: Announcement pill badge (`⭐ Loved by 10,000+ Teams`), punchy bold display title (`text-4xl lg:text-6xl font-bold tracking-tight`), concise value description, dual-action group (Primary high-contrast button + secondary video trigger with Play icon), and an overlapping customer avatar cluster (`flex -space-x-2`).
  - **Right Column**: A high-fidelity software card or mobile viewport tilted in 3D perspective space (`style={{ transform: 'perspective(1200px) rotateY(-8deg) rotateX(6deg)' }}`). Layered over this card are **2-3 floating micro-interaction chips** that subtly float up/down via CSS keyframes (`animate-bounce` or custom `floating-slow`):
    - *Chip A (Top Right)*: Live Status / Activity Pulse (`● Live Sync 99.8%` with glowing green dot).
    - *Chip B (Bottom Left)*: Financial or Execution Toast (`✓ Instant Payout $2,450.00 Settled`).
    - *Chip C (Center Float)*: Metric Sparkline or Growth Badge (`↑ +34.2% MRR`).

##### 2. Archetype 2: Centered Kinetic Display Typography with Overlapping Fold Peek
- **Best For**: Developer Tools, AI Platforms, Creative Tech, High-End SaaS.
- **Visual Composition**:
  - Centered hero layout featuring massive kinetic display typography (`text-5xl sm:text-7xl font-extrabold tracking-tight`) with a high-contrast text clip gradient on key punch words.
  - Centered compact description and single primary CTA flanked by subtle text badge ("No credit card required · Free 14-day trial").
  - **The Fold Peek Invariant**: Beneath the actions sits an oversized browser window frame or full dashboard preview elevated with deep directional drop shadow (`shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)]`). Crucially, this frame is placed so that **40% of its height cuts through the bottom viewport fold**, creating an irresistible visual curiosity gap that compels users to scroll down.

##### 3. Archetype 3: Modular Above-the-Fold Bento Hero
- **Best For**: Multi-faceted AI Studios, Modern Indie Products, Data Platforms.
- **Visual Composition**:
  - Instead of standard text followed by images, the entire hero viewport is partitioned into an **asymmetric 4-card or 5-card Bento Grid**:
    - **Card 1 (Col-span 2, Row-span 2)**: Primary value proposition, punchy headline, and conversion CTA button.
    - **Card 2 (Col-span 1, Row-span 2)**: Interactive live feature sandbox or dynamic code preview with syntax highlighting.
    - **Card 3 (Col-span 1, Row-span 1)**: High-authority proof metric with animated `tabular-nums` counter (`150,000+ Active Nodes`).
    - **Card 4 (Col-span 1, Row-span 1)**: Interactive toggle, sound wave visualizer, or customer rating cluster.

##### 4. Archetype 4: Interactive Utility / Conversion Inversion Hero (NiubiGEO Standard)
- **Best For**: SEO/GEO tools, Security Auditing, Performance Checkers, Prompt Generators.
- **Visual Composition**:
  - An embedded functional tool sits directly in the hero fold (`#product-setup`). Instead of asking users to register, they immediately type their URL, paste code, or enter a prompt into a rich input bar, triggering an instant interactive evaluation with live engine status tags.

##### 5. Archetype 5: Editorial Magazine & Neo-Brutalist Asymmetric Split
- **Best For**: Architecture studios, luxury brands, creative agencies, cultural tech.
- **Visual Composition**:
  - Stark stark monochrome (`#000000` / `#ffffff`) or warm stone canvas (`#fdfbf7`).
  - Structured geometric dividing lines (`border-b border-neutral-300 dark:border-neutral-800`).
  - Oversized serif display or condensed grotesque font (80px+).
  - Split metadata column flanking the thesis statement: `Client`, `Year`, `Discipline`, and `Status: Open for Q2`.

##### 6. Archetype 6: Cinematic Full-Bleed Spatial 3D & Ambient Glow Canvas
- **Best For**: Web3, Spatial Computing, Next-Gen Hardware, Gaming, Immersive Media.
- **Visual Composition**:
  - Full-viewport interactive WebGL, Three.js, or Spline 3D canvas reacting fluidly to cursor coordinates.
  - Floating Island Glass Capsule Navbar at the ceiling.
  - Floating bottom glass dock or minimal frosted translucent cards (`backdrop-blur-2xl bg-black/40 border border-white/10`) that present value props without obscuring the 3D scene.

##### 7. Archetype 7: Command-Bar / Terminal Keyboard-First Hero (Linear & Raycast Standard)
- **Best For**: Developer CLI utilities, infrastructure software, power-user desktop apps.
- **Visual Composition**:
  - Dark obsidian background with razor-sharp 1px grid borders.
  - Centered interactive mock command bar (`<kbd>⌘K</kbd> to search actions...`) with simulated auto-typing or interactive keyboard event listeners.
  - Real-time tab switchers between languages (TypeScript, Python, Rust, Go) showing copyable one-line install commands (`npx vibes init`).

---

### Sovereign UI/UX Anti-Slop Directive (6 Design Pillars)

The UI/UX tier of vibes-plug strictly eliminates generic AI visual slop and incomplete user experiences:

1. **Ban on Generic "AI Gradient" Aesthetic**:
   - 🔴 **Forbidden**: Defaulting to the cliché dark-slate backdrop with purple/cyan glowing neon gradients (`bg-slate-900 from-purple-500 to-indigo-600`), indiscriminate glassmorphic cards with faint `border-white/10`, and floating glowing dots with zero brand context.
   - ✅ **Standard**: Purpose-driven brand aesthetic. Deliberately choose and enforce a coherent design philosophy matching the domain: Swiss International Typography, Clean Scandinavian Editorial, High-Density Data Monochrome, Precision Industrial, or Warm Handcrafted Minimal.

2. **Mandatory 5-State Component Rule (Zero Happy-Path Bias)**:
   - 🔴 **Forbidden**: Generating only the static happy-path layout while omitting edge-case states.
   - ✅ **Standard**: Every interactive view or data component must explicitly support all 5 core states:
     - **Ideal State**: Clean, structured layout with realistic domain content.
     - **Loading State**: Content-shaped pulsing skeleton layout matching exact element geometry (no layout shifts or jarring full-screen spinners).
     - **Empty State**: Contextual vector icon/illustration, concise explanatory copy, and a primary action button to create the first record.
     - **Error State**: Inline accessible alert with actionable retry trigger and clear explanation (RFC 9457 friendly).
     - **Interactive / Disabled State**: Clear hover, active, keyboard `focus-visible:ring-2`, and `aria-disabled="true"` with tooltip explanation.

3. **Semantic & Accessible DOM (Zero Div-Soup Slop)**:
   - 🔴 **Forbidden**: Using `<div onClick={...}>` instead of `<button>`, omitting `<label>` tags on inputs, or icon-only buttons without accessible names.
   - ✅ **Standard**: Semantic HTML5 (`<button type="button">`, `<nav>`, `<main>`, `<dialog>`), explicit `<label htmlFor="...">`, `aria-label` or `<span className="sr-only">` on icon buttons, and visible keyboard navigation focus rings (`focus-visible:ring-2 focus-visible:ring-offset-2`).

4. **Fluid Responsiveness & Mobile Insets**:
   - 🔴 **Forbidden**: Hardcoded fixed pixel widths (`w-[480px]`) causing horizontal scrolling on 360px mobile viewports; applying `overflow-x: hidden` on `<body>` to hide layout clipping bugs.
   - ✅ **Standard**: Fluid layout constraints (`max-w-md w-full`), CSS Grid with `minmax()`, dynamic viewport units (`dvh` over `vh`), and safe-area padding (`pb-safe`).

5. **Intentional Micro-Motion & Reduced Motion**:
   - 🔴 **Forbidden**: Jarring 0ms instant state snaps, sluggish 800ms+ animations that delay task completion, and hover effects that trigger layout shifts.
   - ✅ **Standard**: Snappy 150ms–250ms transitions with `ease-out`, zero layout shifts on hover, and strict respect for `@media (prefers-reduced-motion: reduce)`.

6. **Domain-Authentic Content (No Lorem Ipsum Slop)**:
   - 🔴 **Forbidden**: Filling UI mockups with "Lorem ipsum dolor sit amet", "John Doe", "Jane Doe", or dummy placeholder avatars.
   - ✅ **Standard**: Use realistic, contextual domain content matching the business use-case (real currency, realistic timestamps, localized names, authentic domain terms).

---

### Section 10: Awwwards Site-of-the-Day (SOTD) Creative Direction & Concept Engine

When building flagship marketing sites, studios, portfolios, product launches, or interactive stories, a visual style alone is never enough. Apply the **Concept-First SOTD Engine**:

#### 1. The 5-Territory Concept Method & Portability Test
A **concept** is a rule system borrowed from a real-world domain—not an aesthetic adjective ("brutalist", "minimalist"). Mine the subject across 5 territories:
1. **Territory 1 — Name, Etymology & Identity**: Literal origin or structural meaning of the brand name.
2. **Territory 2 — Material of the Profession**: Physical artifacts of the craft (e.g., architect -> Mylar sheets, scale bars, section cuts, North arrows; sound studio -> patch cables, VU meters, tape reels; printer -> registration marks, Pantone chips).
3. **Territory 3 — Place & Culture**: Local vernacular signage, municipal forms, transit boards, or regional grids.
4. **Territory 4 — Process Metaphor**: Frame the scroll journey as the craft's transformation process (e.g., *raw ore -> assay -> cut -> set*).
5. **Territory 5 — Formal System**: Rule-bound structures (periodic tables, train timetables, index card catalogs, museum floor plans).

**Mandatory Concept Validation Gates**:
- **The 4-Decision Test**: Your chosen metaphor must dictate at least 4 of 5 decisions: **(1) Grid/Layout**, **(2) Motion Verb** (*snap, peel, dial, stamp, pan, develop, tune*), **(3) Typographic Voice**, **(4) Signature Interaction**, and **(5) Copy Register & Section Labels**.
- **The Swap (Portability) Test**: Score portability from `1` (impossible to swap to another industry without breaking) to `5` (fits any company). **Reject any concept scoring > 2.**
- **The Genericness Test**: Ask: *"If I gave a similar prompt to a generic model, would it land on this metaphor, palette, or font pair?"* If yes, discard and pick the second idea.

#### 2. The 7 SOTD Art Direction Archetypes & Role-Named Palette
Commit to one archetype (or a deliberate hybrid of two) in `DESIGN.md`:
1. **Swiss Index**: Exposed `1px` hairlines (`--line`), tabular index numbers (`01 / 08`), strict 12-column grid, warm paper (`#F4F1EA`) + carbon ink (`#111111`) + signal vermilion (`#E03C1F`).
2. **Gallery Dark**: Near-black obsidian (`#0B0B0C`), bone ink (`#ECE8E1`), 70%+ media viewport dominance, whisper-quiet chrome.
3. **Field Color**: Saturated mid-tone ground (cobalt `#1B38D0`, ochre `#D89B1C`, celadon `#8FA98F`, or signal red), bold black or cream ink, zero timid neutral gray.
4. **Editorial Modern**: High-contrast serif display + grotesque body + mono metadata, magazine drop caps, `4.2em` first-line `text-indent`, asymmetric pull quotes.
5. **Tech Precise**: Dark graphite (`#090A0D`), `1px` technical spec borders, live interactive isometric/shader diagram, monospace telemetry readouts.
6. **Warm Analog**: Uncoated cotton paper (`#F2ECE1`), espresso ink (`#1C1917`), tactile film grain (`0.03` opacity), physical print registration marks.
7. **Experimental**: Spatial canvas, 3D/WebGL stage, or non-linear draggable index with a persistent escape hatch (`Index` / `List view` toggle).

**Role-Named CSS Custom Properties & Global Dark-Section Ink Switch**:
```css
:root {
  --ground:  #F3EFEA;
  --ink:     #111110;
  --muted:   #6E6A63;
  --line:    rgba(17, 17, 16, 0.12);
  --accent:  #D9381E;
  --curtain: #111110;

  /* Fluid 12-Column Grid & Optical Display Type Scale */
  --cols: 12;
  --gutter: clamp(1rem, 1.6vw, 1.75rem);
  --pad: clamp(1.25rem, 3.5vw, 3.5rem);
  --t-mega: clamp(3.75rem, 1rem + 13.5vw, 15.5rem);
  --t-h1:   clamp(2.5rem, 1rem + 6.5vw, 7rem);
  --t-h2:   clamp(1.75rem, 0.8rem + 3.2vw, 3.75rem);
  --t-body: clamp(1rem, 0.92rem + 0.35vw, 1.2rem);
  --t-mono: 0.75rem;
}

/* Single global switch when scroll enters a dark section — updates Four-Corner Frame & nav automatically */
html.is-dark {
  --ground: #0D0D0C;
  --ink:    #F3EFEA;
  --muted:  #8A857D;
  --line:   rgba(243, 239, 234, 0.12);
}

.display-mega {
  font-size: var(--t-mega);
  line-height: 0.86;
  letter-spacing: -0.045em;
  margin-left: -0.06em; /* Optical left-edge alignment for capital glyphs */
  font-kerning: normal;
}

/* Descender clearance for overflow-clipped split-text lines (prevents clipping g, j, p, q, y) */
.split-line {
  overflow: hidden;
  padding-bottom: 0.08em;
  margin-bottom: -0.08em;
}
```

#### 3. Curated Free Font Library (Self-Hosted via `font.mjs`)
Ban reflex AI fonts (*Fraunces*, *Instrument Serif*, *Playfair Display*, *Space Grotesk* on dark purple). Self-host `.woff2` via `node skills/visual-ui-auditor/scripts/font.mjs`:
- **Fontshare (`--from fontshare`)**:
  - *Neo-Grotesque & Sans*: `switzer`, `general-sans`, `satoshi`, `supreme`, `synonym`, `plus-jakarta-sans`
  - *Expressive Display*: `clash-display`, `cabinet-grotesk`, `panchang`, `tanker`, `khand`, `array`
  - *Editorial Serif*: `melodrama`, `zodiak`, `gambetta`, `erode`, `sentient`, `boska`, `gambarino`
  - *Monospace*: `azeret-mono`, `jet-brains-mono`
- **Google Fonts**:
  - *Workhorse Sans*: `Inter Tight`, `Instrument Sans`, `Schibsted Grotesk`, `Host Grotesk`, `Hanken Grotesk`, `Mona Sans`, `Geist`, `Familjen Grotesk`
  - *Display*: `Bricolage Grotesque`, `Big Shoulders Display`, `Anton`, `Unbounded`, `Syne`, `Funnel Display`, `Archivo`
  - *Editorial Serif*: `Newsreader`, `Gloock`, `Young Serif`, `Bodoni Moda`, `Libre Caslon Display`, `Hedvig Letters Serif`, `Italiana`
  - *Technical Mono*: `Martian Mono`, `Fragment Mono`, `IBM Plex Mono`

#### 4. The 10 Section Layout Families (Maximum Once Per Page) & 390px Re-Composition
Never repeat the same section layout back-to-back. Compose pages from 5–7 distinct families:
1. **Poster Hero** (Full-viewport `--t-mega` bleed + 1 focal artwork + Four-Corner Frame).
2. **Index List** (Obys-style numbered horizontal rows with `1px` `--line` hairlines, tabular metadata, and floating cursor/row preview).
3. **Asymmetric Pair** (Cols `1..7` large slow-parallax plate vs. Cols `9..12` bottom-aligned smaller plate + caption).
4. **Gallery Wall** (Scattered multi-aspect plates on a 12-col grid with deliberate empty columns).
5. **Horizontal Filmstrip** (Desktop ScrollTrigger pin with live `01 / 06` counter; converts to native `overflow-x: auto; scroll-snap-type: x mandatory` on `<= 900px`).
6. **Sticky Narrative** (4-col pinned thesis/index on left + 7-col scrolling evidence plates on right).
7. **Editorial Statement** (Full-width typographic manifesto with `text-indent: 4.2em` and inline pill thumbnails).
8. **Data / Spec Sheet** (Exposed `1px` hairline grid with oversize `--t-h1` `tabular-nums` figures and technical units).
9. **Full-Bleed Media Break** (`100vw x 90vh` edge-to-edge plate or interactive shader with zero text clutter).
10. **Footer as Finale** (Full-viewport curtain reveal with giant `--t-mega` CTA, live local clock, colophon, and magnetic trigger).

**Mobile 390px Re-Composition Rules**:
- Never squish a 12-column desktop layout into 390px. Switch to a dedicated 4-column grid at `@media (max-width: 900px)`.
- Replace `grid-template-rows: auto 1fr auto` on mobile heroes with `auto` rows and explicit `gap` so no 300px empty hole appears mid-viewport.
- Fold the Four-Corner Frame (`tl`, `tr`, `bl`, `br`) into top-left brand + top-right menu trigger (`min-height: 44px`).

---

### UI/UX Design Pre-Delivery Checklist
- [ ] **Visual Hierarchy**: Clear typographic scale (H1 -> H2 -> Body -> Eyebrow) with optical tracking (`tracking-tight` on large headings, `tracking-wider` on uppercase eyebrows).
- [ ] **Single Focal CTA**: Only 1 primary conversion action per viewport; secondary actions use subtle/outline variants.
- [ ] **Tabular Numerals**: `tabular-nums` applied to all metrics, currency, timestamps, and table numbers.
- [ ] **Gestalt Proximity**: Related items grouped tightly (`gap-1.5`), unrelated sections separated with generous breathing room (`py-16`/`gap-8`).
- [ ] **Surface & Border Layering**: Crisp 1px borders (`border-neutral-200/80 dark:border-neutral-800`) paired with subtle micro-shadows (`shadow-xs`/`shadow-sm`); zero muddy 30px shadows or floating neon orbs.
- [ ] **Visual Quality**: No emojis used as UI icons (use SVG icons from Lucide/Heroicons). Hover states do not cause layout shifts.
- [ ] **Interaction**: `cursor-pointer` applied to all interactive elements. Smooth 150–300ms transitions with `active:scale-[0.98]`.
- [ ] **Contrast**: Text contrast ratio >= 4.5:1 in light mode (>= 7:1 for headings). Visible borders in both light and dark modes.
- [ ] **Layout & Responsive**: Tested across 375px, 768px, 1024px, 1440px breakpoints. No unintentional horizontal scrolling on mobile.
- [ ] **Accessibility**: All images have meaningful `alt` text. Form inputs have explicitly connected `<label>` elements or `aria-label`.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Muse Wonder High`, `Composer 2.5 Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec ui-ux-pro-max <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_visual_audit`, `vibes_ast_query`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | LCP < 1.8s, INP < 100ms, CLS < 0.05, 1px crisp borders, 3-tier radius (6px/8px/12px), `tabular-nums`, 5-state interactive contract; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan:
- **`modern-web-guidance`**: Menjalankan kueri fokus untuk pola UI web 2026, standar aksesibilitas, dan fitur platform browser native.
- **`design-system-architect`**: Menetapkan skala token OKLCH, tingkatan kontainer permukaan (L0-L4), serta primitif Base UI / Radix.
- **`modern-css-native-expert`**: Mengimplementasikan pemosisi jangkar CSS native, `@starting-style`, dan transisi modal top-layer.
- **`tailwind-expert`**: Mengikat resep hierarki visual, pewarnaan 60-30-10, dan tracking optik di Tailwind v4.
- **`visual-ui-auditor`**: Melakukan audit visual 20-poin, inspeksi screenshot vision multimodal, dan pengujian Playwright.
- **`anti-slop`**: Menegakkan sanitasi visual Pilar 7 yang ketat, melenyapkan klise AI, pill-button, dan status palsu.
- **`hig`**, **`brainstorming`**, **`zero-to-prod-orchestrator`**, **`session-memory-manager`**: Sinkronisasi berkelanjutan di seluruh siklus hidup proyek.
- **Sinergi Lintas Domain & Integrasi Swarm Subagent**: `screenshot-to-code-expert`, `website-design-cloner`, `multimodal-spatial-video-cloner`, `rich-text-editor-expert`, `ephemeral-generative-ui-architect`

### Deskripsi
UI/UX Pro Max adalah mesin kecerdasan desain komprehensif yang dilengkapi indeks pencarian BM25 offline. Mencakup palet warna, tipografi, pola tata letak responsif, rekomendasi ikon, grafik visualisasi data, pedoman UX, **Material Design 3 (M3)**, serta praktik terbaik untuk **11 tumpukan teknologi (technology stacks)**.

### Kondisi Pemicu
Gunakan pedoman ini atau jalankan mesin pencari CLI ketika:
- Mendesain komponen UI baru, landing page, atau dashboard.
- Memilih skema warna, pasangan font, dan token desain.
- Mempelajari, merekayasa balik, atau mengkloning template & komponen desain web langsung dari URL target (Kombinasikan dengan `website-design-cloner`).
- Menghasilkan rekomendasi sistem desain (design system) lengkap untuk proyek.
- Mengaudit kode untuk masalah UX, aksesibilitas (a11y), atau kinerja.
- Membutuhkan pola kode spesifik stack (React, Next.js, Vue, Nuxt, Svelte, Tailwind, SwiftUI, React Native, Flutter, Shadcn).

---

### Integrasi CLI Pencarian Python BM25

Skill ini dilengkapi mesin pencari Python cepat di `scripts/search.py` yang dapat mengueri 12 dataset CSV domain dan 11 dataset CSV tech-stack.

#### 1. Generasi Rekomendasi Sistem Desain Lengkap
Jalankan ini sebelum memulai desain/coding untuk mendapatkan spesifikasi sistem desain terintegrasi:
```bash
python scripts/search.py "<kueri proyek/topik>" --design-system -p "Nama Proyek" -f markdown
```
*Contoh:* `python scripts/search.py "SaaS analytics dashboard" --design-system -p "MetricsApp" -f markdown`

#### 2. Pencarian Berdasarkan Domain
Cari domain desain tertentu:
```bash
python scripts/search.py "<kueri>" --domain <domain> --max-results 3
```
- **Domain yang Tersedia (`--domain`)**:
  - `style`: Gaya desain visual (Minimalism, Glassmorphism, Dark Mode, Aurora, Brutalism, Bento Grid, Spatial UI, elemen WebGL 3D, dll.)
  - `prompt`: Prompt AI siap pakai & checklist implementasi CSS
  - `color`: Palet warna Hex sesuai jenis produk (Utama, Sekunder, CTA, Background, Teks)
  - `chart`: Rekomendasi jenis grafik, pustaka grafik, panduan kontras & aksesibilitas
  - `landing`: Tata letak landing page konversi tinggi, urutan seksi & penempatan CTA
  - `product`: Cetak biru sistem desain spesifik jenis produk (SaaS, E-commerce, Fintech, Crypto, Antarmuka Chat AI-Native, dll.)
  - `ux`: Anti-pattern UX, praktik terbaik kegunaan, tingkat keparahan, serta contoh kode baik/buruk
  - `typography`: Pasangan font Google Fonts, rekomendasi font judul/isi, mood & CSS import
  - `icons`: Panduan penggunaan ikon, pustaka SVG (Lucide, Heroicons), & import kode
  - `react`: Optimasi performa React & Next.js, perbaikan re-render & dynamic import
  - `web`: Pedoman antarmuka web (ARIA, focus trap, virtual list, input form)
  - `m3`: Token desain spesifik Material Design 3, peran warna, elevasi, dan spesifikasi komponen
  - `preset-monday`: Estetika SaaS lapang ala Monday.com (Biru Cerah `#0073ea`, Putih Bersih `#FFFFFF` + Abu-abu Terang `#F9F9F9`/`#F5F6F8`, Footer Gelap `#111111`, font Figtree/Inter, radius kartu 12-16px, jarak seksi vertikal 80-120px)
  - `preset-niubigeo`: Arketipe Utilitas Interaktif & Bukti Kosmik ala NiubiGEO (Obsidian Kosmik Gelap `#080a0f`, panel navy berlapis `#11141e`/`#181b29`, garis batas 1px `#272b3c`, aksen ganda Lavender Elektrik `#b7a0ff` + Jade Zamrud `#7ce4b0`, teks putih tajam `#f5f4fa`, konversi hero inversi dengan widget diagnostik `#product-setup`, bento bukti aksi, navigator alur 4 langkah, bukti sosial organik)

*Contoh:* `python scripts/search.py "fintech dark theme" --domain color`

#### 3. Pencarian Pedoman Spesifik Tech Stack
Cari pedoman yang disesuaikan persis dengan tech stack proyek:
```bash
python scripts/search.py "<kueri>" --stack <stack> --max-results 3
```
- **Tech Stack yang Didukung (`--stack`)**:
  - `html-tailwind` | `react` | `nextjs` | `vue` | `nuxtjs` | `nuxt-ui` | `svelte` | `swiftui` | `react-native` | `flutter` | `shadcn`

*Contoh:* `python scripts/search.py "virtualized list performance" --stack react`

---

### Acuan Cepat Aturan Profesional

#### 1. Aksesibilitas (WCAG 2.2) - KRITIS
- **Kontras Warna**: Rasio kontras minimal 4.5:1 untuk teks normal, 3:1 untuk teks besar/komponen UI.
- **Focus States**: Tampilkan cincin fokus yang jelas (`focus-visible:ring-2 focus-visible:ring-offset-2`) saat menggunakan navigasi keyboard.
- **Alt Text & ARIA**: Sediakan alt text deskriptif pada gambar; gunakan atribut `aria-expanded`, `aria-controls`, serta elemen HTML semantik.

#### 2. Sentuhan & Interaksi - KRITIS
- **Touch Target Size**: Ukuran area sentuh minimal 44x44px untuk perangkat mobile.
- **Loading & State**: Nonaktifkan tombol selama operasi asinkron agar tidak terjadi submit ganda; tampilkan spinner halus atau skeleton loader.
- **Cursor Pointer**: Wajib menambahkan `cursor-pointer` pada elemen interaktif yang dapat diklik.

#### 3. Performa & Animasi - TINGGI / MENENGAH
- **Aset Gambar**: Gunakan format WebP/AVIF, atribut `srcset`, dimensi `width`/`height` eksplisit, serta `loading="lazy"`.
- **Mikro-interaksi**: Durasi transisi antara 150ms–300ms (`ease-in-out`) agar antarmuka terasa cepat dan responsif.
- **Reduced Motion**: Hormati preferensi `prefers-reduced-motion: reduce`.

#### 4. Kontras Mode Terang & Gelap
- **Mode Terang**: Teks gelap kontras tinggi (misal Slate-900 `#0F172A`); hindari teks abu-abu pudar. Pastikan batas/border (`border-slate-200`) tetap terlihat.
- **Mode Gelap**: Kontras tinggi antara elemen latar depan dengan latar belakang gelap; hindari kontainer teks serba hitam pekat `#000000` kecuali diminta khusus.

#### 5. Hierarki Visual & Arsitektur Estetika Elegan Berdaulat
Hierarki visual memandu persepsi pengguna secara intuitif dan elegan melalui skala ukuran, kontras warna, jarak spasial, kedalaman elevasi, dan irama membaca (standar kaliber Apple/Linear/Stripe):

- **Irama Tipografi Modular & Tracking Optik**:
  - **Eyebrow / Overline**: `text-[11px] font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400` — menetapkan konteks kategori secara presisi dengan jarak antarhuruf yang lega.
  - **Judul Utama / Display H1**: `text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-[1.1]` — tracking rapat memberikan ketegasan visual tanpa memakan ruang vertikal berlebih.
  - **Subjudul Seksi / H2**: `text-xl md:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100` — jangkar struktural seksi.
  - **Teks Tubuh / Body**: `text-sm md:text-base font-normal leading-relaxed text-neutral-600 dark:text-neutral-300` — alur membaca yang nyaman dan tidak melelahkan mata.
  - **Angka Tabular Wajib**: Terapkan `tabular-nums` (`font-variant-numeric: tabular-nums`) pada semua metrik angka, harga/mata uang, stempel waktu, dan tabel data agar angka sejajar vertikal dan tidak bergoyang saat nilai berubah.

- **Aturan Warna 60-30-10 & Dominasi Single Primary CTA**:
  - **60% Basis Netral**: Kanvas utama latar belakang (`bg-neutral-50 dark:bg-neutral-950`).
  - **30% Permukaan Struktural**: Kartu, panel, sidebar, header (`bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800`).
  - **10% Aksen Fokal Intensional**: Dikhususkan HANYA untuk titik konversi utama (Primary CTA, status aktif, lencana KPI kritis).
  - **Aturan Titik Fokus Tunggal**: Maksimal SATU tombol utama per viewport. Tombol aksi lain wajib menggunakan varian outline/subtle atau ghost/text-only agar pengguna tidak mengalami kelelahan kognitif (*choice paralysis*).
  - **3 Tingkat Kontras Teks Semantik**: Teks utama (`text-neutral-900 dark:text-neutral-50` rasio >= 7:1), teks sekunder (`text-neutral-600 dark:text-neutral-400` rasio >= 4.5:1), teks tersier/metadata (`text-neutral-400 dark:text-neutral-500`).

- **Hukum Kedekatan Gestalt (Proximity) & Ruang Bernapas (Whitespace)**:
  - **Kerapatan Label & Input**: Label form harus sangat dekat dengan field inputnya (`gap-1.5` / 6px).
  - **Hierarki Padding Internal vs Margin Luar**: Padding internal card (`p-5` atau `p-6`) harus lebih besar daripada jarak antar-elemen di dalamnya (`gap-3` atau `gap-4`).
  - **Irama Antar-Seksi**: Pisahkan blok utama halaman dengan ruang kosong yang lega (`py-16 md:py-24` atau `gap-8 md:gap-12`). Ruang kosong (*negative space*) adalah elemen desain aktif bernilai tinggi yang menciptakan kesan premium dan tenang.

- **Pelapisan Permukaan (Surface Layering), Kedalaman Taktil & Border 1px Presisi**:
  - **Tingkatan Elevasi Fisik**:
    - *Kanvas (L0)*: Latar belakang dasar aplikasi (`bg-neutral-50/50 dark:bg-neutral-950`).
    - *Kartu Konten (L1)*: Kontainer data (`bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs`).
    - *Terangkat (L2)*: Menu dropdown, popover, hover state (`shadow-md border border-neutral-200 dark:border-neutral-700`).
    - *Overlay (L3)*: Dialog modal dengan backdrop halus (`shadow-xl`).
    - *Mengambang (L4)*: Toast notifikasi, floating action dock (`shadow-2xl`).
  - **Sanitasi Elevasi**: Larang bayangan hitam buram 30px yang kotor serta lingkaran neon mengambang tanpa dasar fisik. Terapkan garis border tajam 1px yang dipadukan dengan micro-shadows halus terarah.

- **Pola Pemindaian Mata (Scanability) & Alur Tata Letak**:
  - **Pola F (F-Pattern)**: Terapkan pada tampilan padat data, dashboard, dan daftar tabel (orientasi kuat di sisi kiri untuk judul, metrik, dan baris data).
  - **Pola Z (Z-Pattern)**: Terapkan pada landing page promosi dan alur onboarding (Logo kiri atas -> Navigasi kanan -> Pesan Nilai Utama -> Tombol CTA).
  - **Chunking Progresif**: Pecah kumpulan informasi kompleks menjadi modul-modul kartu terstruktur dengan header, metrik, dan footer yang jelas.
  - **Integrasi Material Design 3 (M3)**: Mendukung Kelas Ukuran Jendela Adaptif (Compact <600dp, Medium 600–839dp, Expanded ≥840dp) serta tingkatan elevasi tonal (`surface-container-lowest` hingga `surface-container-highest`).

#### 6. Arsitektur Website Anti-Pasaran: Navigasi Kapsul Mengambang (Floating Island) & Mega Menu Flyout Mewah
Website berbasis template generik umumnya menggunakan bilah navigasi persegi panjang yang menempel penuh pada batas atas layar (*full-width edge-to-edge*), menghasilkan kesan pasaran dan kaku. Untuk website berkelas tinggi (standar Apple/Linear/Stripe), wajib terapkan standar **Floating Island Glass Capsule Header** dan **Flyout Card Mega Menu**:

- **Gaya Navigasi Kapsul Mengambang (Floating Pill / Capsule Style)**:
  - **Bilah Melayang Terpisah (Detached Island)**: Bilah navigasi melayang anggun di atas latar belakang, tidak menempel penuh ke batas atas layar (`fixed top-4 md:top-6 inset-x-0 mx-auto w-[calc(100%-2rem)] max-w-5xl z-50`).
  - **Sudut Sangat Membulat (Capsule Geometry)**: Ujung membulat penuh menyerupai kapsul perangkat keras modern (`rounded-full px-4 md:px-6 py-2.5 md:py-3`).
  - **Tema Gelap Translusen / Glassmorphism**: Latar belakang gelap dengan tingkat transparansi halus dan blur mendalam (`bg-neutral-950/75 dark:bg-neutral-950/80 backdrop-blur-xl saturate-180`) sehingga elemen halaman di belakangnya tetap samar terlihat saat digulir.
  - **Border Presisi 1px & Pantulan Atas**: Batas 1px tegas (`border border-white/10 dark:border-white/12`) dipadukan dengan bayangan elevasi directional serta highlight stroke halus di sisi atas (`shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)]`).

- **Dropdown Menu Flyout / Mega Menu (Kartu Mengambang Berisi Sub-Menu Terstruktur)**:
  - **Geometri Kapsul Terpusat (Centered Island Geometry)**: Saat item navigasi (seperti *Skills*, *Fitur*, *Solusi*) diklik atau di-hover, panel menu yang muncul berbentuk kartu melayang berposisi tepat di tengah di bawah bilah kapsul (`left-1/2 -translate-x-1/2 mt-3.5 w-[680px] max-w-[calc(100vw-2rem)] rounded-2xl p-5 md:p-6`). Dilarang memiringkan mega menu secara canggung ke salah satu sisi sehingga bertabrakan dengan logo merek.
  - **Latar Belakang Gelap Padat Anti Bocor (Zero Bleed-Through)**: Gunakan lapisan gelap dengan densitas tinggi (`bg-[#090c15] / bg-neutral-950/98 backdrop-blur-2xl border border-white/12 shadow-[0_25px_65px_-12px_rgba(0,0,0,0.95),0_0_35px_rgba(6,182,212,0.1)]`) guna menjamin teks, lencana, atau grafis halaman di belakang kartu tidak tembus pandang atau merusak kontras baca.
  - **Bebas Daftar Teks Polos**: Dilarang hanya menampilkan daftar link teks vertikal biasa tanpa konteks visual.
  - **Kisi Sub-Menu Terstruktur**: Kelompokkan item ke dalam kolom-kolom kategori yang dilengkapi judul overline (eyebrow).
  - **Tiga Unsur Wajib Setiap Sub-Menu**:
    1. Wadah ikon visual halus (`w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform`).
    2. Judul tebal dan tegas (`text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors`).
    3. Deskripsi singkat 1 kalimat yang menjelaskan nilai manfaat fitur (`text-xs text-neutral-400 line-clamp-1`).
  - **Kontrak Aksesibilitas**: Navigasi keyboard penuh (`aria-expanded`, `aria-haspopup="true"`, `role="menu"`), cincin fokus yang jelas, serta penutupan otomatis saat menekan tombol `Escape`.

#### 7. Instrumen Anatomi Isometrik Gaya Linear & Kartu Penjelasan Fisik
Saat menjelaskan mekanisme komputasi inti, arsitektur data, atau alur algoritma pada landing page dan dokumentasi, hindari diagram flowchart generik (kotak membosankan berpanah). Terapkan **Standar Kartu Penjelasan Anatomi**:
- **Rig Mekanis Fisik Taktil**: Wujudkan konsep sebagai instrumen mesin berdensitas tinggi: pelat dasar bermesin, kenop berulir knurled, rel linier, kereta dorong berpegas, bushing perunggu, dan dial gauge terkalibrasi.
- **Kartu Instrumen Berbingkai (Framed Card)**: Bungkus dalam kartu berelevasi: `Fig n` (kiri atas, font monospace kapital), Judul Fitur (kanan atas, tebal), Petunjuk Interaksi Pengguna (kiri bawah, redup), dan Tampilan Bacaan Langsung (*Live Readout*) real-time (`tabular-nums` di kanan bawah).
- **Shading Permukaan Empat Nada**: Hierarki pencahayaan tegas: `lo` (bayangan bawah), `mid` (kerangka struktur vertikal), `hi` (permukaan atas), dan tepat satu aksen `lit` (jarum bergerak putih/sian atau probe aktif).
- **Invarian Lines Resolve**: Setiap garis pembagi penggaris, goresan alur, dan kawat berakhir rapat pada tepi solid atau sekrup terminal; bebas panah melayang tanpa tujuan.

---

#### 8. Engine Anti-Monoton Web: 6 Mode Arsitektur Desain Berbeda (Standar Nol Web Monoton)
Penyakit umum situs web buatan AI adalah monotoni visual: setiap kali membuat website baru, AI selalu menghasilkan pola klise yang sama persis (hero teks di tengah dengan latar belakang dark-slate `bg-slate-900`, gradien neon ungu-biru yang buram, 3 kartu fitur generik, dan testimoni dummy palsu).

Untuk memberantas hasil web yang membosankan dan monoton, agen WAJIB mengklasifikasikan setiap proyek web baru ke dalam salah satu dari **6 arketipe desain yang disengaja** atau menawarkan opsinya kepada pengguna:

```
                     ┌───────────────────────────────────────────────────────────┐
                     │          TAKSONOMI ARSITEKTUR ANTI-MONOTON                │
                     └─────────────────────────────┬─────────────────────────────┘
                                                   │
        ┌───────────────────┬──────────────────────┼─────────────────────┬───────────────────┐
        ▼                   ▼                      ▼                     ▼                   ▼
┌───────────────┐   ┌───────────────┐      ┌───────────────┐     ┌───────────────┐   ┌───────────────┐
│    MODE A     │   │    MODE B     │      │    MODE C     │     │    MODE D     │   │    MODE E     │
│   NiubiGEO    │   │  Monday.com   │      │    Linear     │     │ Apple Spatial │   │  Densitas Fin │
│Bukti Kosmik AI│   │ SaaS Lapang   │      │Presisi Monokrom│    │ Kaca Spekular │   │Terminal Data  │
└───────────────┘   └───────────────┘      └───────────────┘     └───────────────┘   └───────────────┘
```

##### Mode A: NiubiGEO Cosmic Evidence & Interactive Utility (Arketipe NiubiGEO)
- **Esensi & Kepribadian**: SaaS AI/Developer berbobot intelektual tinggi, bukti empiris nyata daripada skor hiasan, serta utilitas diagnostik interaktif instan langsung di lipatan layar pertama (*above the fold*).
- **Token Desain Tailwind v4**:
  ```css
  @theme {
    --color-bg: #080a0f;           /* Obsidian Kosmik Gelap */
    --color-panel: #11141e;        /* Permukaan Lapis 1 */
    --color-panel-2: #181b29;      /* Permukaan Lapis 2 */
    --color-line: #272b3c;         /* Garis Batas 1px Tajam */
    --color-text-main: #f5f4fa;    /* Putih Tajam dengan Sentuhan Lavender */
    --color-text-muted: #979aaf;   /* Abu-abu Violet Muted */
    --color-accent-purple: #b7a0ff;/* Lavender Elektrik (Aksen Brand & Fokus) */
    --color-accent-green: #7ce4b0; /* Jade Zamrud (Sinyal Bukti & Status Terverifikasi) */
    --font-sans: "Inter", "Noto Sans SC", system-ui, sans-serif;
  }
  ```
- **Pilar Struktur Utama**:
  1. **Hero Konversi Inversi (Conversion Inversion Hero)**: Jangan pernah membuat hero kosong yang pasif hanya dengan tombol "Sign Up". Tanamkan widget utilitas diagnostik interaktif fungsional (`#product-setup`) langsung di bawah judul hero. Pengguna memasukkan URL, repositori, atau domain mereka seketika tanpa hambatan registrasi.
  2. **Bento Grid Bukti Tindakan (Actionable Evidence Bento)**: 4 kartu modular:
     - *Sinyal Visibilitas Merek*: Titik denyut status, persentase kemunculan pada model LLM frontier.
     - *Akurasi Deskripsi*: Matriks penandaan entitas untuk memverifikasi deskripsi akurat vs halusinasi AI.
     - *Kompetitor & Sitasi Lintas Platform*: Emblem platform nyata (ChatGPT, Claude, Gemini, Perplexity, Substack, Telegram).
     - *Daftar Prioritas Perbaikan*: Item tindakan prioritas dengan lencana status interaktif.
  3. **Navigator Langkah Interaktif**: Alur tab horizontal yang mengilustrasikan mekanisme gabungan manusia nyata dan pengujian AI.
  4. **Bento Grid Kecepatan Sosial Organik**: Kartu pembuktian otoritatif: badge trending GitHub, ranking harian developer, kutipan artikel analisis mendalam, dan statistik jaringan manusia aktif.
  5. **Mikro-Interaksi Taktil**: Sentakan panah saat hover (`lucide-arrow-right` bergeser +4px), cincin radar berdenyut (`recognition-pulse`), kilauan garis batas 1px (`#76508d`).

##### Mode B: Monday.com SaaS Lapang & Editorial Hangat
- **Esensi**: Ramah, sangat terorganisir, alur kerja kolaboratif yang lega dan memanusiakan pengguna.
- **Token**: Biru Cerah (`#0073ea`), Putih Bersih (`#ffffff`), Kontainer Abu Lembut (`#f9f9f9`/`#f5f6f8`), Footer Hitam Pekat (`#111111`).
- **Tata Letak**: Jarak vertikal seksi 80px–120px yang lapang, radius kartu 12px–16px, tipografi Figtree, tag status berwarna-warni.

##### Mode C: Linear Presisi Monokromatik Gelap
- **Esensi**: Kecepatan mekanis, alat developer berorientasi keyboard, nol distraksi visual.
- **Token**: Seng/Grafit Murni (`#09090b`), Abu-abu Monokrom Bersih (`#ffffff`/`#a1a1aa`), Garis batas silet 1px (`#27272a`).
- **Tata Letak**: Navbar kapsul pulau melayang, kartu instrumen rig mesin isometrik taktil, angka tabular (`tabular-nums`), spotlight radial saat hover kursor.

##### Mode D: Apple Spatial Glass & Kemilau Ambien
- **Esensi**: Harmoni perangkat keras & lunak premium, kedalaman spasial, keanggunan sensori.
- **Token**: Kaca buram berlapis (`backdrop-blur-2xl bg-white/70 dark:bg-black/60`), pantulan tepi spekular (`shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]`), geometri kartu bulat besar `rounded-3xl`.
- **Tata Letak**: Skala tipografi sinematik, gerakan pegas fisika (*spring physics*), kilauan halus ambien di latar belakang.

##### Mode E: Densitas Tinggi Fintech / Terminal Intelijen Bloomberg
- **Esensi**: Kepercayaan institusional, transparansi data real-time, ketelitian kuantitatif.
- **Tokens**: Arang Gelap Doff (`#121212`), Amber Peringatan (`#f59e0b`), Hijau Mint Status Aktif (`#10b981`), Border Slate (`#1f2937`).
- **Tata Letak**: Aliran ticker harga real-time, kartu rekonsiliasi buku besar ganda, tabel data padat tanpa layout shift (`tabular-nums`), grafik sparkline interaktif.

##### Mode F: Neo-Brutalis Editorial Berdampak Tinggi
- **Esensi**: Budaya tanding developer, daya ingat tinggi, kontras tanpa kompromi.
- **Token**: Hitam Pekat (`#000000`), Putih Salju (`#ffffff`), Aksen saturasi penuh (Kuning Siber `#facc15`, Oranye Menyala `#fb923c`).
- **Tata Letak**: Garis tepi hitam pekat tebal 2px–3px, bayangan jatuh kaku berjarak (`4px 4px 0px #000`), font sans-serif tebal (weight 800), tata letak grid asimetris.

---

#### 9. Arsitektur Hero Section Kaliber Dribbble: 7 Arketipe Ekspresif (Standar Hero Anti-Monoton)
Titik paling rawan terjadinya kebosanan visual pada website buatan AI adalah bagian hero section. Asisten AI selalu mengulang-ulang komposisi monoton: *Teks judul di tengah + 2 tombol biasa + placeholder gambar statis di bawahnya*.

Agar setiap proyek web baru memiliki kesan pertama yang memukau, variatif, dan berkonversi tinggi, agen WAJIB memilih dan mengimplementasikan salah satu dari **7 Arketipe Hero Section Kaliber Dribbble**:

```
                     ┌───────────────────────────────────────────────────────────┐
                     │          7 ARKETIPE HERO SECTION KALIBER DRIBBLE          │
                     └─────────────────────────────┬─────────────────────────────┘
                                                   │
     ┌──────────────────────┬──────────────────────┼──────────────────────┬──────────────────────┐
     ▼                      ▼                      ▼                      ▼                      ▼
┌───────────────┐   ┌───────────────┐      ┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│  ARKETIPE 1   │   │  ARKETIPE 2   │      │  ARKETIPE 3   │      │  ARKETIPE 4   │      │  ARKETIPE 5   │
│ Split-Screen  │   │Teks Kinetik & │      │ Bento Modular │      │  Utilitas UI  │      │   Editorial   │
│3D Perspektif  │   │Intipan Lipatan│      │   Full Fold   │      │Interaktif Hero│      │ Neo-Brutalis  │
└───────────────┘   └───────────────┘      └───────────────┘      └───────────────┘      └───────────────┘
```

##### 1. Arketipe 1: Split-Screen Asimetris 50/50 dengan Kemiringan 3D Perspektif & Chip Melayang
- **Sangat Cocok Untuk**: SaaS B2B, FinTech, Alat Produktivitas, dan Aplikasi Mobile.
- **Komposisi Visual**:
  - **Kolom Kiri**: Badge pengumuman pill (`⭐ Dipercaya 10,000+ Tim`), judul display tebal tegas (`text-4xl lg:text-6xl font-bold tracking-tight`), deskripsi ringkas, grup 2 tombol aksi (CTA Utama kontras tinggi + tombol Demo dengan ikon Play), serta tumpukan avatar pengguna (`flex -space-x-2`).
  - **Kolom Kanan**: Kartu antarmuka dashboard atau frame mobile yang dimiringkan dalam ruang 3D perspektif (`transform: perspective(1200px) rotateY(-8deg) rotateX(6deg)`). Di atas kartu ini disematkan **2-3 chip status mikro melayang** dengan animasi CSS halus:
    - *Chip A (Kanan Atas)*: Status Sinyal Denyut (`● Sinkronisasi Aktif 99.8%` dengan titik hijau berkedip).
    - *Chip B (Kiri Bawah)*: Notifikasi Transaksi Nyata (`✓ Pembayaran Rp 35.000.000 Berhasil`).
    - *Chip C (Tengah)*: Lencana Pertumbuhan (`↑ +34.2% Efisiensi Tim`).

##### 2. Arketipe 2: Tipografi Kinetik Tengah dengan Intipan Lipatan Layar (Fold Peek)
- **Sangat Cocok Untuk**: Alat Developer, Platform AI, Agensi Kreatif, SaaS Premium.
- **Komposisi Visual**:
  - Judul kinetik raksasa di tengah (`text-5xl sm:text-7xl font-extrabold tracking-tight`) dengan aksen gradien teks pada kata kunci penting.
  - Di bawah tombol CTA utama, bingkai antarmuka dashboard diletakkan tepat memotong garis lipatan layar pertama: **40% tinggi kartu menembus lipatan layar (*fold peek*)** dengan bayangan jatuh dalam (`shadow-2xl`), memicu rasa penasaran alami pengguna (*curiosity gap*) untuk menggulir ke bawah.

##### 3. Arketipe 3: Bento Grid Modular Lipatan Pertama (Above-the-Fold Bento Hero)
- **Sangat Cocok Untuk**: Startup AI Modern, Produk Indie Berdensitas Tinggi, Studio Desain.
- **Komposisi Visual**:
  - Alih-alih tata letak teks biasa, seluruh area hero dipartisi menjadi **Bento Grid Asimetris 4-5 kartu**:
    - **Kartu 1 (Span 2x2)**: Proposisi nilai utama, judul tajam, dan tombol konversi primer.
    - **Kartu 2 (Span 1x2)**: Sandbox fitur interaktif atau preview kode langsung dengan syntax highlighting.
    - **Card 3 (Span 1x1)**: Metrik pembuktian otoritas dengan angka tabular berdenyut (`tabular-nums`).
    - **Card 4 (Span 1x1)**: Pengalih interaktif (*toggle*), visualizer audio, atau rating pengguna.

##### 4. Arketipe 4: Utilitas Interaktif & Hero Inversi Konversi (Standar NiubiGEO)
- **Sangat Cocok Untuk**: Alat SEO/GEO, Pemeriksa Keamanan, Analisis Domain, Generator Prompt AI.
- **Komposisi Visual**:
  - Alat fungsional langsung ditanamkan pada hero fold (`#product-setup`). Pengguna mengetik URL, menempelkan kode, atau mengetik prompt seketika tanpa hambatan formulir pendaftaran.

##### 5. Arketipe 5: Editorial Majalah & Pembagi Neo-Brutalis Asimetris
- **Sangat Cocok Untuk**: Studio arsitektur, e-commerce mewah, agensi desain, brand budaya.
- **Komposisi Visual**:
  - Kanvas monokrom kontras tinggi (`#000000` / `#ffffff`) atau warna batu hangat (`#fdfbf7`).
  - Garis batas geometris pembagi yang tegas (`border-b`, `border-r`).
  - Font serif display atau sans-serif grotesque ekstra padat (80px+).
  - Kolom metadata terpisah: `Klien`, `Tahun`, `Disiplin`, dan `Status Ketersediaan Proyek`.

##### 6. Arketipe 6: 3D Spasial Sinematik & Kanvas Kemilau Ambien Penuh
- **Sangat Cocok Untuk**: Web3, Komputasi Spasial, Hardware Generasi Baru, Media Imersif.
- **Komposisi Visual**:
  - Kanvas 3D WebGL / Three.js / Spline interaktif layar penuh yang merespons kursor mouse.
  - Navbar kapsul kaca pulau melayang di atas, serta kartu teks mengambang minimalis dengan efek kaca buram (`backdrop-blur-2xl`) yang tidak menghalangi objek 3D.

##### 7. Arketipe 7: Terminal & Palet Perintah Ramah Keyboard (Standar Linear & Raycast)
- **Sangat Cocok Untuk**: Alat CLI developer, SaaS infrastruktur cloud, aplikasi produktivitas cepat.
- **Komposisi Visual**:
  - Latar obsidian gelap pekat dengan garis grid tipis 1px.
  - Mockup palet perintah interaktif di tengah (`<kbd>⌘K</kbd> untuk mencari perintah...`) dengan simulasi ketikan otomatis atau navigasi keyboard nyata.
  - Tab pengalih bahasa pemrograman (TypeScript, Python, Rust, Go) dengan perintah instalasi satu baris siap salin (`npx vibes init`).

---

### Direktif Anti-Slop UI/UX Berdaulat (6 Pilar Desain)

Tingkat UI/UX vibes-plug melarang keras slop visual AI generik dan pengalaman pengguna separuh jadi:

1. **Larangan Estetika "Gradien AI" Generik**:
   - 🔴 **Dilarang**: Menggunakan *default* klise latar belakang dark-slate dengan gradien neon ungu/sian menyala (`bg-slate-900 from-purple-500 to-indigo-600`), kartu *glassmorphic* berlebihan dengan `border-white/10`, serta titik-titik neon mengambang tanpa konteks merek.
   - ✅ **Standar**: Estetika berbasis tujuan merek. Terapkan filosofi desain yang disengaja sesuai domain produk: Tipografi Internasional Swiss, Editorial Skandinavia Bersih, Monokrom Data Densitas Tinggi, Presisi Industrial, atau Desain Minimalis Hangat.

2. **Aturan Wajib 5 Status Komponen (Nol Bias Happy-Path)**:
   - 🔴 **Dilarang**: Hanya menghasilkan tata letak statis saat kondisi data ideal dan melupakan status di dunia nyata.
   - ✅ **Standar**: Setiap tampilan interaktif atau komponen data WAJIB mendukung 5 status inti:
     - **Status Ideal**: Tata letak rapi, terstruktur, dengan konten domain realistis.
     - **Status Loading**: Skeleton loader berdenyut halus dengan geometri persis sesuai elemen (tanpa pergeseran layout / CLS, tanpa spinner layar penuh yang mengganggu).
     - **Status Kosong (Empty State)**: Ikon/ilustrasi kontekstual, teks penjelasan ringkas dan ramah, serta tombol CTA utama untuk membuat data pertama.
     - **Status Error**: Banner/kartu error inline yang aksesibel disertai pesan jelas dan tombol coba lagi (*retry*).
     - **Status Interaktif / Nonaktif (Disabled)**: Status hover, active, cincin fokus keyboard `focus-visible:ring-2`, serta atribut `aria-disabled="true"` dengan penjelasan tooltip.

3. **DOM Semantik & Aksesibel (Nol Slop Div-Soup)**:
   - 🔴 **Dilarang**: Menggunakan `<div onClick={...}>` menggantikan tombol asli, menghilangkan tag `<label>` pada input, atau tombol ikon tanpa nama aksesibel.
   - ✅ **Standar**: Gunakan elemen HTML5 semantik (`<button type="button">`, `<nav>`, `<main>`, `<dialog>`), `<label htmlFor="...">` eksplisit, `aria-label` atau `<span className="sr-only">` pada tombol ikon, dan cincin fokus navigasi keyboard yang jelas (`focus-visible:ring-2 focus-visible:ring-offset-2`).

4. **Responsif Fluid & Inset Layar Mobile**:
   - 🔴 **Dilarang**: Menetapkan lebar piksel statis (`w-[480px]`) yang merusak tampilan mobile 360px; menggunakan trik `overflow-x: hidden` pada `<body>` untuk menyembunyikan bug layout bocor.
   - ✅ **Standar**: Batasan layout fleksibel (`max-w-md w-full`), CSS Grid dengan `minmax()`, unit viewport dinamis (`dvh`), dan padding area aman mobile (`pb-safe`).

5. **Mikro-Gerakan Disengaja & Reduced Motion**:
   - 🔴 **Dilarang**: Transisi kaku 0ms, animasi lambat >800ms yang memperlambat interaksi, dan efek hover yang memicu pergeseran tata letak (layout shift).
   - ✅ **Standar**: Transisi responsif 150ms–250ms dengan `ease-out`, tanpa layout shift saat hover, serta kepatuhan mutlak pada `@media (prefers-reduced-motion: reduce)`.

6. **Konten Domain Autentik (Nol Slop Lorem Ipsum)**:
   - 🔴 **Dilarang**: Memenuhi antarmuka pengguna dengan "Lorem ipsum dolor sit amet", "John Doe", "Jane Doe", atau avatar tiruan kosong.
   - ✅ **Standar**: Gunakan konten realistis sesuai domain bisnis produk (mata uang nyata, stempel waktu realistis, nama lokal, istilah bisnis autentik).

---

### Bagian 10: Pengarahan Kreatif & Mesin Konsep Standar Awwwards (Site of the Day)
Saat merancang situs flagship, studio kreatif, peluncuran produk, atau cerita interaktif, terapkan **Mesin Konsep Awwwards**:
1. **Metode Konsep 5-Teritori & Uji Portabilitas**:
   - Gali konsep dari 5 teritori: **(1) Etimologi & Identitas Nama**, **(2) Material Profesi Fisik** (misal: arsitek -> kertas kalkir Mylar, skala batang, potongan penampang), **(3) Tempat & Budaya Lokal**, **(4) Metafora Proses Transformasi**, atau **(5) Sistem Formal** (katalog indeks, jadwal kereta, tabel periodik).
   - **Uji 4-Keputusan & Uji Tukar (Portabilitas <= 2/5)**: Konsep wajib menentukan tata letak grid, kata kerja gerak (*motion verb*), suara tipografi, interaksi khas, dan label seksi. Jika konsep dapat dipindahkan ke industri lain tanpa rusak, buang dan ganti.
2. **7 Arketipe Art Direction & Palet Berbasis Peran (`ground`, `ink`, `muted`, `line`, `accent`, `curtain`)**:
   - Pilih dari *Swiss Index*, *Gallery Dark*, *Field Color*, *Editorial Modern*, *Tech Precise*, *Warm Analog*, atau *Experimental*. Gunakan satu sakelar global `html.is-dark` saat latar berganti gelap di tengah halaman.
3. **Pustaka Font Gratis Kurasi (`font.mjs`) & Tipografi Display Optik**:
   - Unduh mandiri `.woff2` dari Fontshare (`clash-display`, `cabinet-grotesk`, `satoshi`, `switzer`, `zodiak`, `melodrama`, `gambetta`) atau Google Fonts (`Syne`, `Bricolage Grotesque`, `Instrument Sans`, `Schibsted Grotesk`, `Newsreader`, `Martian Mono`). Hindari font klise AI (*Fraunces*, *Instrument Serif*, *Playfair*).
   - Terapkan `margin-left: -0.06em` untuk perataan tepi optik huruf besar dan `.split-line { padding-bottom: 0.08em; margin-bottom: -0.08em }` agar huruf berekor bawah (`g, j, p, q, y`) tidak terpotong.
4. **10 Keluarga Layout Seksi (Maksimal 1x per Halaman) & Re-Komposisi Mobile 390px**:
   - Kombinasikan 5–7 keluarga seksi (*Poster, Index List, Asymmetric Pair, Gallery Wall, Filmstrip, Sticky Narrative, Statement, Data/Facts, Full-Bleed Media, Footer Finale*). Pada layar `<= 900px`, ubah *horizontal pin* menjadi `overflow-x: auto; scroll-snap-type: x mandatory` native dan hindari baris `1fr` yang menyisakan lubang kosong di tengah layar.

---

### Checklist Desain UI/UX Sebelum Delivery
- [ ] **Hierarki Visual**: Skala tipografi terstruktur jelas (H1 -> H2 -> Body -> Eyebrow) dengan tracking optik (`tracking-tight` pada judul besar, `tracking-wider` pada eyebrow huruf besar).
- [ ] **Single Focal CTA**: Hanya 1 aksi konversi utama per viewport; tombol aksi lain menggunakan varian subtle atau outline.
- [ ] **Angka Tabular**: `tabular-nums` diterapkan pada semua metrik data, mata uang, tanggal/waktu, dan tabel.
- [ ] **Kedekatan Gestalt (Proximity)**: Elemen terkait terkelompok rapat (`gap-1.5`), seksi yang berbeda dipisahkan ruang bernapas yang lega (`py-16`/`gap-8`).
- [ ] **Pelapisan Permukaan & Border 1px**: Border 1px tajam (`border-neutral-200/80 dark:border-neutral-800`) dipadukan dengan micro-shadows halus (`shadow-xs`/`shadow-sm`); bebas dari bayangan hitam buram 30px atau neon orbs.
- [ ] **Kualitas Visual**: Tidak menggunakan emoji sebagai ikon UI (gunakan ikon SVG seperti Lucide/Heroicons). Efek hover tidak menggeser tata letak.
- [ ] **Interaksi**: `cursor-pointer` diterapkan pada semua elemen interaktif. Transisi halus 150–300ms dengan respons `active:scale-[0.98]`.
- [ ] **Kontras**: Rasio kontras teks minimal 4.5:1 pada mode terang (>= 7:1 untuk judul utama). Border terlihat jelas di kedua mode (terang & gelap).
- [ ] **Tata Letak & Responsif**: Diuji pada breakpoint 375px, 768px, 1024px, 1440px. Tidak ada scroll horizontal tak disengaja pada perangkat mobile.
- [ ] **Aksesibilitas**: Semua gambar memiliki `alt` text yang bermakna. Form input memiliki `<label>` terhubung eksplisit atau `aria-label`.

---
### 🎨 Automatic Visual Assets Generation Mandate (CRITICAL)
**MANDATORY**: Whenever you are building a new application, scaffolding a project, or finalizing the initial UI/UX, you MUST automatically use the `generate_image` tool to create a custom logo that perfectly matches the application's core concept and aesthetic. 
This generated image MUST be explicitly used as:
1. The primary application logo (e.g., in the header/navbar).
2. The website favicon (`favicon.ico` or equivalent).
3. The Open Graph (OG) image for SEO metadata (`og:image`).

Do not use placeholders for these assets. Generate and integrate them automatically.

### Hard Guardrails (Declarative Invariants)
1. **The Law of the Single Focal Primary Action**:
   - Every viewport MUST feature at most ONE prominent Primary CTA button. All secondary and tertiary actions MUST render as outline, tonal, or subtle ghost styles to eliminate choice paralysis.
2. **Tabular Numerals on Numerical Displays (`tabular-nums`)**:
   - All financial amounts, metric counters, timestamps, latency gauges, and live statistics MUST declare `tabular-nums` (or CSS `font-variant-numeric: tabular-nums`) to prevent layout shifts during reactive updates.
3. **Mandatory 5-State Interactive Styling & Keyboard Accessibility**:
   - Every interactive element (`<button>`, `<a>`, `<input>`) MUST declare 5 explicit visual states: `default`, `hover`, `focus-visible` (with high-contrast `ring-2 ring-offset-2`), `active`, and `disabled`.
4. **Physical Surface Elevation & 1px Crisp Borders**:
   - Container cards and surfaces MUST combine 1px crisp borders (`border-neutral-200/80 dark:border-neutral-800`) with directional micro-shadows (`shadow-xs`/`shadow-sm`). Never use generic 30px blurry black glows or unanchored floating neon orbs.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Muse Wonder High`, `Composer 2.5 Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec ui-ux-pro-max <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_visual_audit`, `vibes_ast_query`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | LCP < 1.8s, INP < 100ms, CLS < 0.05, border tegas 1px, radius 3-tier (6px/8px/12px), `tabular-nums`, kontrak interaktif 5-state; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
