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

### Pillar 7: UI & Visual Sanitation (Sovereign Professional UI Craft 2026)
Interfaces must look authentically crafted by elite product design engineers (Linear, Stripe, Apple, Vercel caliber), firmly anchored in `DESIGN.md`, rather than statistically hallucinated from generic LLM training patterns.

#### The 4 Proven Design Archetypes (Stop Defaulting to Generic AI Mush)
Every screen and component must deliberately anchor itself in one coherent design archetype:
1. **Archetype A: High-Precision Developer Tooling & Pro Software** (Linear, Raycast, Vercel, Supabase):
   - Crisp 1px solid borders (`border-neutral-200 dark:border-neutral-800/80`), structured 6-8px micro-radii (`rounded-md` / `rounded-lg`), deep matte charcoal/zinc surfaces (`bg-neutral-950` / `bg-neutral-900`), monospace micro-badges (`font-mono text-xs`), tactile keyboard shortcuts (`<kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded border bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700">⌘K</kbd>`), high information density, and subtle active press feedback (`active:scale-[0.99]`).
2. **Archetype B: Refined SaaS & FinTech** (Stripe, Ramp, Mercury, Brex):
   - Pristine typography contrast (bold geometric display headers paired with clean neutral body), tabular numerals on all amounts (`tabular-nums`), subdued semantic badges with 10% opacity fills (`bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20`), generous whitespace structured on a strict 4px/8px rhythm, and authentic transaction/ledger data models.
3. **Archetype C: Human Interface & Modern Editorial** (Apple HIG, Notion, Arc, Craft):
   - Warm neutral palettes (zinc/stone/slate), soft contrast, tactile button feedback (`active:scale-[0.98] transition-transform duration-75`), generous line-height (`leading-relaxed`), spacious padding, natural breathing room, and clean SVG iconography with consistent 1.5px/2px stroke weight.
4. **Archetype D: High-Density Analytics & Operations** (Datadog, Grafana, Cloudflare):
   - Ultra-efficient padding (`px-3 py-1.5`), high-contrast sparklines, multi-level breadcrumbs, split panes, explicit filter toolbars, color-blind accessible charts, and zero decorative fluff.

---

#### The 8 Sovereign Visual Disciplines:
1. **Color & Palette Sanitation**:
   - 🚫 **Banned**: Generic blue-purple/neon gradients (`#3B82F6` -> `#8B5CF6`), blurred neon radial orbs behind hero headlines, full-page colored glow, forced dark mode without product rationale, and unrestrained palette bloat (>3 core colors).
   - ✅ **Standard**: Derive palette strictly from `DESIGN.md` in OKLCH space. Limit gradients strictly to functional hierarchy markers with written rationale. Exactly ONE deliberate primary accent color for conversion moments.
2. **Micro-Geometry & The Radius Law**:
   - 🚫 **Banned**: Indiscriminate pill-shape fatigue (`rounded-full` on standard rectangular buttons, search inputs, rectangular cards, and modals).
   - ✅ **Standard**: Structured 3-tier radius scale:
     - Interactive primitives (buttons, inputs, dropdown triggers): `rounded-md` (6px) or `rounded-lg` (8px).
     - Containers (cards, popovers, sheet panels): `rounded-xl` (12px) or `rounded-2xl` (16px).
     - `rounded-full` reserved EXCLUSIVELY for circular avatars, toggle switches, and true status chips.
3. **Surface Tonal Tiers & Physical Depth**:
   - 🚫 **Banned**: Indiscriminate glassmorphism (`backdrop-blur` on navbar, cards, modals, and sidebar simultaneously; dose cap: 1 element max), floating zero-gravity drop shadows (`shadow-2xl shadow-indigo-500/50`), and ambient outer glow wrapped around flat cards.
   - ✅ **Standard**: Crisp solid borders (`border-neutral-200 dark:border-neutral-800`), structured tonal elevation (Level 0 Canvas -> Level 1 Card with `shadow-xs` -> Level 2 Dropdown with `shadow-md` -> Level 3 Modal with `shadow-xl`), and matte card surfaces.
4. **Typography Hierarchy & Tabular Alignment**:
   - 🚫 **Banned**: Default unstyled font weights, low-contrast washed out text (`text-neutral-400` on white backgrounds), unscaled headings competing for attention, and jumping column numbers during live updates.
   - ✅ **Standard**: Display headlines with `tracking-tight font-semibold text-neutral-950 dark:text-neutral-50`; eyebrows with `text-[11px] font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400`; ALL numbers, currency values, timestamps, and table metrics MUST use `tabular-nums` (`font-variant-numeric: tabular-nums`).
5. **The Mandatory 5 Interactive States Contract**:
   - 🚫 **Banned**: Generating only happy-path static elements with missing hover, active, or focus indicators; clickable `<div>` wrappers lacking button roles.
   - ✅ **Standard**: Every interactive primitive (button, input, row, card, tab) MUST explicitly declare:
     - **Default**: Pristine accessible styling.
     - **Hover**: Subtle background or border shift (`hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors`).
     - **Active/Pressed**: Tactile physical feedback (`active:scale-[0.98] transition-transform duration-75`).
     - **Focus-Visible**: Crisp 2px ring with 2px offset (`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 dark:focus-visible:ring-neutral-300 focus-visible:ring-offset-2`).
     - **Disabled/Loading**: `disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed` + geometry-matching skeleton loaders.
6. **Authentic Data, Forms & Layout Honesty**:
   - 🚫 **Banned**: Rigid AI landing formulas (Hero with glowing orb -> 3 cards -> 3 steps -> Bento Grid -> Pricing -> FAQ), cookie-cutter dashboards (*sidebar + topbar + 4 stat cards + chart + table*), fake metric numbers (`12,842 (+12%)`), inputs using placeholders as labels, and unhelpful empty states (*"No data"* spinner).
   - ✅ **Standard**: Purposeful layouts tailored to real user journeys; forms with explicit `<label htmlFor="...">`, helper text, and accessible validation states (`aria-invalid`); empty states with a contextual vector icon, clear 1-sentence explanation, and an actionable primary CTA button.
7. **Motion, Micro-Interactions & Reduced Motion**:
   - 🚫 **Banned**: Perpetual motion loops (floating cards, endless pulsating badges `animate-ping`), stacked entrance animations on scroll (fade-in + slide-up + scale + bounce).
   - ✅ **Standard**: Snappy 150ms–250ms transitions with `ease-out`; animations triggered solely by user interaction or state transitions; strictly adhere to `prefers-reduced-motion: reduce` (`motion-reduce:transition-none`).
8. **3D & Spatial Visualization Sanitation (`3Dviz`)**:
   - 🚫 **Banned**: Floating neon orbs masquerading as spatial concepts, generic primitive proxies dressed up with high-resolution textures, accidental seams at skin junctions, colliders that fail to enclose overhangs or wings, and claiming scientific accuracy for unverified numerical visuals.
   - ✅ **Standard**: Rigorous object craft across 3 scales (silhouette, construction, surface), deliberate join continuity, grounded scientific verification (Claim → Model → Visual), fixed-timestep simulation, and adherence to the 16-point 3D visual review prompts (`web-3d-graphics-expert`).

---

## 20-Point Sovereign UI Delivery Checklist

Run this checklist alongside code review before completing any frontend/UI task:
- [ ] **1. Design Archetype Anchor**: Screen deliberately executes a clear archetype (DevTools, Refined SaaS, Human Editorial, or High-Density Analytics); zero generic AI mishmash.
- [ ] **2. Brand Identity Anchor**: Palette derived strictly from `DESIGN.md` in OKLCH; zero cliché blue-purple/neon gradients (`#3B82F6` -> `#8B5CF6`).
- [ ] **3. Single Focal Accent**: Single deliberate accent color reserved for primary conversion moments.
- [ ] **4. Micro-Geometry & Radius Discipline**: Strict 3-tier radius scale (6-8px small, 12-16px container); zero `rounded-full` on rectangular buttons, search inputs, or cards.
- [ ] **5. Surface Elevation & Borders**: Crisp 1px solid borders (`border-neutral-200 dark:border-neutral-800`) with subtle directional elevation (`shadow-xs`/`shadow-sm`); zero zero-gravity `shadow-2xl`.
- [ ] **6. Glassmorphism Cap**: Frosted glass (`backdrop-blur`) strictly capped at maximum 1 element (e.g. sticky header navbar only).
- [ ] **7. Zero Neon Glow Orbs**: Hero and background sections completely free of blurred neon radial orbs (`blur-3xl`).
- [ ] **8. Zero Decorative Emojis**: Copy, headings, and buttons 100% free of emojis (🚀, ✨, 🔥, ✅); use crisp SVG icons from Lucide/Heroicons with consistent stroke weight.
- [ ] **9. Typography Hierarchy & Contrast**: Display headings use `tracking-tight font-semibold`; eyebrows use `text-[11px] font-semibold tracking-wider uppercase text-neutral-500`; text contrast passes WCAG 2.2 AA (>= 4.5:1).
- [ ] **10. Tabular Numerals**: All numbers, currency values, metrics, and table columns use `tabular-nums` (`font-variant-numeric: tabular-nums`).
- [ ] **11. Mandatory 5 States**: Every interactive element defines default, hover, active (`active:scale-[0.98]`), focus-visible (`focus-visible:ring-2`), and disabled/loading states.
- [ ] **12. Semantic HTML & Button Roles**: Zero `<div onClick={...}>` without button roles; interactive primitives use semantic `<button type="button">`, `<a href="...">`, or `<input>`.
- [ ] **13. Icon Button Accessibility**: Every icon-only button includes `<span className="sr-only">` or explicit `aria-label`.
- [ ] **14. Form Label & Validation Discipline**: Every input has a visible connected `<label htmlFor="...">`, helper text, and accessible error message (`aria-invalid="true"`).
- [ ] **15. Layout Rhythm & Anti-Bento**: Layout tailored to actual user workflows; free from default formulaic bento grids and copy-paste 3-card sequences.
- [ ] **16. Authentic Domain Metrics**: KPI stats, charts, and table rows use realistic contextual domain data; zero fake numbers (`12,842 (+12%)`) or filler `John Doe`.
- [ ] **17. Actionable Empty States**: Empty views provide a contextual icon, clear 1-sentence reason, and an immediate primary CTA button.
- [ ] **18. Geometry-Matching Skeletons**: Loading states use content-shaped pulsing skeletons matching exact component dimensions; zero layout shifts or generic full-page spinners.
- [ ] **19. Status Telemetry Honesty**: Status lights represent verified live telemetry; zero decorative pulsing loops (`animate-ping`).
- [ ] **20. Responsive & Touch Standards**: Fluid layout with zero mobile clipping (`w-full max-w-...`, `dvh` units); interactive targets meet minimum 44x44px touch area (`min-h-[44px]`).

---

## Slop vs. Sovereign Implementation Matrix

### 1. Frontend & UI (React 19 / TypeScript / Tailwind CSS v4)

#### Component A: Hero Section

##### ❌ AI Slop Anti-Pattern (Amateurish, Cliché AI Look)
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
        
        {/* Button with decorative trailing arrow and pill addiction */}
        <button className="mt-4 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg shadow-purple-500/50">
          Get Started Now →
        </button>
      </div>
    </div>
  );
}
```

##### ✅ Sovereign Standard (High-Precision Engineering / Linear & Stripe Caliber)
```tsx
import type { ReactNode } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface HeroProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  onCtaClick: () => void;
  secondaryCtaText?: string;
  onSecondaryCtaClick?: () => void;
  previewWidget?: ReactNode;
}

export function Hero({
  headline,
  subheadline,
  ctaText,
  onCtaClick,
  secondaryCtaText = 'Documentation',
  onSecondaryCtaClick,
  previewWidget,
}: HeroProps) {
  return (
    <section className="relative px-6 py-20 lg:py-28 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-7 space-y-6">
          {/* High-precision micro eyebrow */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 text-[11px] font-semibold tracking-wider uppercase text-neutral-600 dark:text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Autonomous FinTech Infrastructure</span>
          </div>

          {/* Crisp, high-contrast typography */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 leading-[1.1]">
            {headline}
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed">
            {subheadline}
          </p>

          {/* 5-State Action Buttons: Structured radius, tactile active states, visible focus rings */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onCtaClick}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-medium text-sm transition-all duration-150 hover:bg-neutral-800 dark:hover:bg-neutral-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 dark:focus-visible:ring-neutral-200 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none shadow-xs"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onSecondaryCtaClick && (
              <button
                type="button"
                onClick={onSecondaryCtaClick}
                className="px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-transparent text-neutral-800 dark:text-neutral-200 font-medium text-sm transition-all duration-150 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 dark:focus-visible:ring-neutral-200 focus-visible:ring-offset-2"
              >
                {secondaryCtaText}
              </button>
            )}
          </div>
        </div>

        {/* Surface-1 Matte Container with Crisp Solid Border */}
        {previewWidget && (
          <div className="lg:col-span-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 p-6 shadow-sm dark:shadow-none">
            {previewWidget}
          </div>
        )}
      </div>
    </section>
  );
}
```

---

#### Component B: Interactive Tabular Metric Card & Action Row

##### ❌ AI Slop Anti-Pattern
```tsx
// Metric card with pill buttons and random numbers
export function MetricCard() {
  return (
    <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-purple-500/20 p-6 shadow-2xl">
      <p className="text-purple-300 text-sm">Total Revenue 🚀</p>
      <h3 className="text-3xl font-bold text-white mt-1">$45,231.89</h3>
      <span className="text-xs text-green-400 font-medium">+12.4% vs last month</span>
      <div className="mt-4" onClick={() => alert('clicked')}>
        <span className="px-4 py-2 rounded-full bg-purple-600 text-white text-xs">View Report →</span>
      </div>
    </div>
  );
}
```

##### ✅ Sovereign Standard (Authentic Metric Card with Tabular Precision & 5 States)
```tsx
import { TrendingUp, ArrowUpRight } from 'lucide-react';

interface MetricCardProps {
  label: string;
  amount: string;
  deltaPercent: number;
  periodLabel: string;
  onViewDetails: () => void;
  isLoading?: boolean;
}

export function MetricCard({
  label,
  amount,
  deltaPercent,
  periodLabel,
  onViewDetails,
  isLoading = false,
}: MetricCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs animate-pulse space-y-4">
        <div className="h-3 w-28 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="h-8 w-44 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-800 rounded" />
      </div>
    );
  }

  const isPositive = deltaPercent >= 0;

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs transition-colors hover:border-neutral-300 dark:hover:border-neutral-700">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          {label}
        </span>
        <button
          type="button"
          onClick={onViewDetails}
          className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 dark:focus-visible:ring-neutral-200"
          aria-label={`View details for ${label}`}
        >
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Tabular numerals ensure figures never twitch during real-time updates */}
      <div className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 tabular-nums font-mono">
        {amount}
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs">
        <span
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-medium tabular-nums ${
            isPositive
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
          }`}
        >
          <TrendingUp className="w-3 h-3" />
          <span>{isPositive ? `+${deltaPercent.toFixed(1)}%` : `${deltaPercent.toFixed(1)}%`}</span>
        </span>
        <span className="text-neutral-500 dark:text-neutral-400">{periodLabel}</span>
      </div>
    </div>
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

### Pilar 7: Sanitasi Visual & UI (Standar Desain Antarmuka Profesional Berdaulat 2026)
Antarmuka wajib terasa dirancang secara otentik oleh insinyur desainer produk elit (kaliber Linear, Stripe, Apple, Vercel), berakar kuat pada identitas `DESIGN.md`, bukan tebakan template hafalan LLM.

#### 4 Arketipe Desain Teruji (Hentikan Kebiasaan Desain Klise AI)
Setiap layar dan komponen wajib secara sadar memilih dan berpegang teguh pada satu arketipe desain yang koheren:
1. **Arketipe A: Tooling Developer & Software Pro Berpresisi Tinggi** (Linear, Raycast, Vercel, Supabase):
   - Border solid 1px tegas (`border-neutral-200 dark:border-neutral-800/80`), skala radius mikro 6-8px (`rounded-md` / `rounded-lg`), kanvas matte warna arang/zinc gelap (`bg-neutral-950` / `bg-neutral-900`), badge mikro monospace (`font-mono text-xs`), indikator tombol pintas keyboard taktil (`<kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded border bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700">⌘K</kbd>`), densitas informasi tinggi, dan umpan balik klik halus (`active:scale-[0.99]`).
2. **Arketipe B: SaaS & FinTech Berkelas Dunia** (Stripe, Ramp, Mercury, Brex):
   - Kontras tipografi anggun (judul geometris tegas dipadukan dengan teks body netral yang bersih), angka tabular di setiap nominal harga (`tabular-nums`), badge status semantik halus dengan latar belakang opasitas 10% (`bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20`), ruang kosong (whitespace) lapang dengan ritme vertikal ketat kelipatan 4px/8px, dan model data transaksi/buku besar yang otentik.
3. **Arketipe C: Human Interface & Editorial Modern** (Apple HIG, Notion, Arc, Craft):
   - Palet netral hangat (zinc/stone/slate), kontras lembut yang nyaman di mata, respons klik tombol taktil (`active:scale-[0.98] transition-transform duration-75`), line-height lega (`leading-relaxed`), padding lapang, ruang bernapas alami, dan ikonografi SVG bersih dengan ketebalan garis konsisten 1.5px/2px.
4. **Arketipe D: Analitik & Operasional Berdensitas Tinggi** (Datadog, Grafana, Cloudflare):
   - Padding ultra-efisien (`px-3 py-1.5`), sparkline beresolusi tinggi, breadcrumbs bertingkat, split-pane multi-kolom, bilah alat filter eksplisit, grafik ramah buta warna, dan bebas dari hiasan tak berguna.

---

#### 8 Disiplin Visual Berdaulat:
1. **Sanitasi Warna & Palet**:
   - 🚫 **Dilarang**: Gradien biru-ungu/neon klise (`#3B82F6` -> `#8B5CF6`), bulatan orbe cahaya radial buram di latar belakang hero, glow berlebih seluruh halaman, pemaksaan mode gelap tanpa kebutuhan domain, dan palet warna berantakan (>3 warna utama).
   - ✅ **Standar**: Ambil palet dari `DESIGN.md` berbasis ruang warna OKLCH. Batasi gradien hanya untuk penanda hierarki fungsional dengan alasan tertulis. Tepat SATU warna aksen terarah untuk momen konversi utama.
2. **Mikro-Geometri & Hukum Radius**:
   - 🚫 **Dilarang**: Kelelahan bentuk kapsul/pil (`rounded-full` pada tombol kotak biasa, input pencarian, kartu persegi panjang, dan modal).
   - ✅ **Standar**: Skala radius 3 tingkat terstruktur:
     - Elemen interaktif primitif (tombol, input, pemicu dropdown): `rounded-md` (6px) atau `rounded-lg` (8px).
     - Wadah penampung (kartu, popover, panel sheet): `rounded-xl` (12px) atau `rounded-2xl` (16px).
     - `rounded-full` HANYA untuk avatar melingkar, saklar toggle, dan chip status murni.
3. **Hirarki Tonal Permukaan & Kedalaman Fisik**:
   - 🚫 **Dilarang**: Efek kaca buram (glassmorphism) bertumpuk (`backdrop-blur` pada navbar, kartu, modal, dan sidebar sekaligus; batas: maks 1 elemen), bayangan mengambang tanpa dasar (`shadow-2xl shadow-indigo-500/50`), dan ambient outer glow pada kartu datar biasa.
   - ✅ **Standar**: Border solid tegas 1px (`border-neutral-200 dark:border-neutral-800`), elevasi tonal terstruktur (Level 0 Kanvas -> Level 1 Kartu dengan `shadow-xs` -> Level 2 Dropdown dengan `shadow-md` -> Level 3 Modal dengan `shadow-xl`), dan permukaan kartu matte.
4. **Hierarki Tipografi & Presisi Tabular**:
   - 🚫 **Dilarang**: Ketebalan font standar tanpa rasa, teks pudar kontras rendah (`text-neutral-400` pada latar putih), judul tanpa skala yang berebut perhatian, dan angka kolom tabel yang bergeser/meloncat saat data diperbarui.
   - ✅ **Standar**: Judul display menggunakan `tracking-tight font-semibold text-neutral-950 dark:text-neutral-50`; label mikro menggunakan `text-[11px] font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400`; SEMUA angka, nominal uang, timestamp, dan kolom tabel WAJIB menyertakan `tabular-nums` (`font-variant-numeric: tabular-nums`).
5. **Kontrak Wajib 5 Status Interaktif**:
   - 🚫 **Dilarang**: Menghasilkan elemen statis hanya pada skenario ideal (happy-path) tanpa status hover, active, atau indikator fokus; membungkus elemen interaktif dengan `<div onClick>` tanpa peran tombol.
   - ✅ **Standar**: Setiap elemen interaktif primitif (tombol, input, baris tabel, kartu, tab) WAJIB mendeklarasikan secara eksplisit:
     - **Default**: Tampilan bersih dan aksesibel.
     - **Hover**: Perubahan latar belakang atau border halus (`hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors`).
     - **Active/Pressed**: Umpan balik fisik taktil (`active:scale-[0.98] transition-transform duration-75`).
     - **Focus-Visible**: Cincin fokus tegas 2px dengan offset 2px (`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 dark:focus-visible:ring-neutral-300 focus-visible:ring-offset-2`).
     - **Disabled/Loading**: `disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed` + kerangka pemuatan (skeleton) yang cocok dengan bentuk geometri elemen.
6. **Kejujuran Data, Formulir & Ritme Layout**:
   - 🚫 **Dilarang**: Rumus kaku landing page AI (Hero orb glowing -> 3 kartu -> 3 langkah -> Bento Grid -> Harga -> FAQ), dashboard template hafalan (*sidebar + topbar + 4 kartu statistik + chart + table*), metrik fiktif (`12.842 (+12%)`), input yang menggunakan placeholder sebagai pengganti label, dan state kosong tanpa guna (*"No data"* spinner).
   - ✅ **Standar**: Tata letak dibuat khusus mengikuti alur pengguna riil; formulir memiliki `<label htmlFor="...">` yang terhubung, teks pembantu, dan status validasi yang dapat diakses pembaca layar (`aria-invalid`); state kosong menampilkan ikon vektor kontekstual, penjelasan jujur 1 kalimat, dan tombol CTA aksi utama.
7. **Disiplin Gerakan, Mikro-Interaksi & Reduksi Gerakan**:
   - 🚫 **Dilarang**: Animasi perulangan tanpa henti (kartu melayang abadi, badge berdenyut terus `animate-ping`), penumpukan animasi masuk serentak pada scroll (fade-in + slide-up + scale + bounce).
   - ✅ **Standar**: Transisi responsif dan cepat antara 150ms–250ms dengan kurva `ease-out`; animasi hanya dipicu oleh interaksi pengguna atau pergantian status; wajib mematuhi preferensi sistem `prefers-reduced-motion: reduce` (`motion-reduce:transition-none`).
8. **Sanitasi Grafis 3D & Spasial (`3Dviz`)**:
   - 🚫 **Dilarang**: Bulatan neon mengambang klise, model proksi primitif generik yang disamarkan dengan tekstur resolusi tinggi, robekan sambungan pada persimpangan kulit organik, collider yang tidak mencakup atap/sayap, serta klaim akurasi ilmiah pada visual yang tidak diverifikasi secara numerik.
   - ✅ **Standar**: Keahlian bentuk objek (*object craft*) pada 3 skala (siluet, konstruksi, permukaan), kontinuitas sambungan teratur, verifikasi ilmiah berpijak (Klaim → Model → Visual), integrasi fisika *fixed-timestep*, dan kepatuhan pada 16 poin checklist kualitas grafis 3D (`web-3d-graphics-expert`).

---

## 20 Poin Checklist Mandiri Kesiapan UI

Jalankan checklist ini bersamaan dengan review kode sebelum menyelesaikan tugas frontend/UI:
- [ ] **1. Jangkar Arketipe Desain**: Layar secara sadar menjalankan salah satu arketipe (DevTools, Refined SaaS, Human Editorial, atau Analitik Densitas Tinggi); bebas dari adonan AI generik.
- [ ] **2. Jangkar Identitas Merek**: Palet warna berakar dari `DESIGN.md` berbasis OKLCH, bebas gradien biru-ungu atau neon generik (`#3B82F6` -> `#8B5CF6`).
- [ ] **3. Aksen Tunggal Terarah**: Tepat satu warna aksen yang hanya digunakan pada momen interaktif/konversi utama.
- [ ] **4. Disiplin Mikro-Geometri & Radius**: Skala radius 3 tingkat teratur (6-8px kecil, 12-16px wadah); bebas dari `rounded-full` pada tombol kotak, input pencarian, atau kartu.
- [ ] **5. Elevasi Permukaan & Border**: Border solid 1px tegas (`border-neutral-200 dark:border-neutral-800`) dengan elevasi terarah halus (`shadow-xs`/`shadow-sm`); bebas bayangan mengambang `shadow-2xl`.
- [ ] **6. Batas Dosis Kaca (Glassmorphism)**: Efek kaca buram (`backdrop-blur`) dibatasi secara ketat maksimal 1 elemen (misalnya hanya navbar sticky).
- [ ] **7. Bebas Orbe Cahaya Neon**: Seksi hero dan latar belakang 100% bebas dari bulatan radial glow neon buram (`blur-3xl`).
- [ ] **8. Bebas Emoji Dekoratif**: Teks judul, tombol, dan salinan UI 100% bebas dari emoji (🚀, ✨, 🔥, ✅); gunakan ikon SVG presisi dari Lucide/Heroicons dengan ketebalan garis seragam.
- [ ] **9. Hierarki Tipografi & Kontras**: Judul display menggunakan `tracking-tight font-semibold`; label mikro menggunakan `text-[11px] font-semibold tracking-wider uppercase text-neutral-500`; kontras teks lolos WCAG 2.2 AA (>= 4.5:1).
- [ ] **10. Angka Tabular (Tabular Numerals)**: Semua nominal harga, statistik metrik, counter, dan kolom tabel menyertakan `tabular-nums` (`font-variant-numeric: tabular-nums`).
- [ ] **11. Wajib 5 Status Interaktif**: Setiap elemen interaktif mendefinisikan status default, hover, active (`active:scale-[0.98]`), focus-visible (`focus-visible:ring-2`), dan disabled/loading.
- [ ] **12. HTML Semantik & Peran Tombol**: Bebas dari `<div onClick={...}>` tanpa role button; elemen interaktif memakai `<button type="button">`, `<a href="...">`, atau `<input>`.
- [ ] **13. Aksesibilitas Tombol Ikon**: Setiap tombol hanya-ikon wajib menyertakan `<span className="sr-only">` atau `aria-label` eksplisit.
- [ ] **14. Disiplin Label & Validasi Form**: Setiap input memiliki `<label htmlFor="...">` yang terlihat, teks bantuan, dan pesan kesalahan yang aksesibel (`aria-invalid="true"`).
- [ ] **15. Ritme Tata Letak & Anti-Bento**: Tata letak disesuaikan dengan alur kebutuhan pengguna riil, bukan bento grid bawaan atau template 3 kartu salin-tempel.
- [ ] **16. Metrik & Data Otentik**: Angka KPI, grafik, dan baris tabel menggunakan data domain kontekstual yang realistis; bebas angka fiktif klise (`12.842 (+12%)`) atau data isi `John Doe`.
- [ ] **17. State Kosong Bertindak**: Tampilan kosong menyajikan ikon kontekstual, alasan 1 kalimat yang jelas, dan tombol CTA tindakan langsung.
- [ ] **18. Skeleton Sesuai Geometri**: Status pemuatan menggunakan skeleton berkedip yang sesuai persis dengan geometri komponen; bebas layout shift atau spinner satu layar penuh.
- [ ] **19. Kejujuran Telemetri Status**: Lampu status mencerminkan telemetri langsung yang terverifikasi; bebas denyut dekoratif pura-pura (`animate-ping`).
- [ ] **20. Standar Responsif & Sentuhan**: Layout fleksibel tanpa pemotongan layar ponsel (`w-full max-w-...`, satuan `dvh`); target sentuhan interaktif memenuhi standar minimum 44x44px (`min-h-[44px]`).

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