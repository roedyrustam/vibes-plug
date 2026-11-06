---
name: senior-frontend
description: "Senior frontend: React 19, Next.js 15, TypeScript, and Tailwind v4 / Frontend tingkat lanjut: React 19, Next.js 15, dan Tailwind v4."
author: "Roedy Rustam"
version: "4.7.0"

---

# Senior Frontend Specialist (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Production-grade frontend development patterns, performance optimization, and modern ecosystem integrations for React 19 / Next.js 15 applications with Tailwind CSS v4 and TypeScript. Covers React 19 Compiler, Partial Prerendering (PPR), View Transitions API, and SPA/MPA hybrid strategies with automated self-healing testing loops.

### Orchestration & Integration
- `modern-web-guidance`: For HTML5/CSS standards, modern browser APIs, and accessibility guidelines.
- `design-system-architect`: For building robust UI components (Radix, Base UI, shadcn) and design tokens.
- `modern-css-native-expert`: For native CSS anchor positioning, View Transitions, container queries, and `@starting-style`.
- `tailwind-expert`: For styling and custom @theme configurations.
- `ui-ux-pro-max`: For UI/UX design intelligence, color harmonies, and 11-stack layout patterns.
- `visual-ui-auditor`: For multimodal vision inspection of rendered interfaces and layout fidelity.
- `svg-animation-motion-expert`: For advanced animations, GSAP timelines, and motion physics.
- `nextjs-app-router-expert`: For RSC, caching, and Next.js routing patterns.
- `state-management-expert`: For client-side state (Zustand, Jotai).
- `tanstack-query-expert`: For advanced data fetching and server state caching.
- `spa-orchestrator`: For Single-Page Application architectures.
- `mpa-orchestrator`: For Multi-Page Application architectures.
- `angular-expert` & `solidjs-expert`: For cross-framework enterprise Signals and fine-grained reactivity architectures.
- `autonomous-tdd-debugger`: For automated unit/component test execution and stack-trace self-healing.
- `anti-slop`: For enforcing complete, stub-free component implementations and zero syntax narration comments.
- **Cross-Domain Synergy & Subagent Swarm Integration**: `vue-frontend-expert`, `svelte-sveltekit-expert`, `astro-framework-expert`, `htmx-hypermedia-expert`, `micro-frontend-architect`, `fullstack-expert`, `rich-text-editor-expert`, `ephemeral-generative-ui-architect`

### Trigger Conditions
- Scaffold a new React or Next.js 15 project with TypeScript and Tailwind CSS v4.
- Generate new components, custom hooks, or Server Actions.
- Analyze and optimize bundle sizes and Core Web Vitals.
- Implement advanced React 19 patterns (`useActionState`, `useOptimistic`, `use()`).
- Build SPAs — coordinate with `spa-orchestrator`.
- Ensure accessibility compliance (WCAG 2.2) and testing.

### Technical Guidelines & Best Practices

#### 1. Next.js 15: Server vs Client Components
Use **Server Components** by default for performance and SEO. Use `'use client'` strictly for:
- State (`useState`, `useEffect`), event handlers (`onClick`), browser APIs.
- Interactive UI needing client hydration.

*Next.js 15.2+ Requirements:*
- Await `Promise`-based `params` and `searchParams` before accessing properties.
- Use **Partial Prerendering (PPR)** natively. Wrap dynamic sections in `<Suspense>`.

#### 2. React 19 Compiler & Hooks
Do not use `useMemo`, `useCallback`, or `React.memo` unless explicitly required; rely on the React 19 compiler.

**Mandatory Hooks:**
- **`useActionState`**: Manage form state, pending indicators, and action results with Server Actions.
- **`useOptimistic`**: Update UI instantly before server confirmation.
- **`useFormStatus`**: Read form submission state in child components.
- **`use(promise)`**: Unwrap promises or context inside render with Suspense.

#### 3. View Transitions API
Implement native View Transitions API for smooth page transitions. Use Next.js 15 `<Link viewTransition>` natively.

#### 4. Tailwind CSS v4
Use CSS-first configuration. Define custom tokens with `@theme` and register plugins with `@plugin` in the main CSS file. Never create `tailwind.config.js`.

#### 5. Accessibility (WCAG 2.2) & Self-Healing Testing
- Enforce semantic HTML (`<button>`, `<nav>`, `<main>`, `<article>`).
- Enforce full keyboard navigability and valid `aria-*` labels.
- Run typecheck (`tsc --noEmit`) to verify zero compiler diagnostics.
- Write unit tests using **Vitest** and **React Testing Library**.
- When tests fail, activate `autonomous-tdd-debugger` to self-heal until 100% passing.

#### 6. Architecture Integration
- **SPA (`spa-orchestrator`)**: Use **TanStack Router** for type-safe client routing and **TanStack Query v5** for server state. Never use bare `useEffect` for data fetching.
- **MPA (`mpa-orchestrator`)**: Use **Alpine.js** or **HTMX** for micro-interactions. Apply Progressive Enhancement.

#### 7. Animations & Motion
For web animations, scroll-driven timelines, GSAP choreographies, and Framer Motion spring physics, delegate directly to `svg-animation-motion-expert`.


#### 8. Material Design 3 (M3) Web Integration (https://m3.material.io/)
In modern React 19 / Next.js 15 apps, incorporate Google's official Material Web Components (`@material/web`) or token-mapped headless primitives:
- **Material Web Components**: Use Lit-based web components (`@material/web/button/filled-button.js`, `@material/web/textfield/outlined-text-field.js`) with React 19 native custom element support.
- **Dynamic CSS Variable Theming**: Map tokens dynamically at the root.

#### 9. Sovereign Visual Hierarchy & Scanability Engineering
Every React 19 / Next.js 15 view must demonstrate Linear/Apple-caliber visual hierarchy:
- **Typographic Cadence**: Eyebrows (`text-[11px] font-semibold tracking-wider uppercase text-neutral-500`) -> Hero Titles (`text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-[1.1]`) -> Section Headings (`text-xl md:text-2xl font-semibold tracking-tight`) -> Body (`text-sm md:text-base text-neutral-600 leading-relaxed`).
- **Tabular Figures**: Always wrap metrics, currency, and counters in `tabular-nums`.
- **Single Focal CTA**: Exactly one high-contrast primary button per screen view; secondary actions use subtle/outline treatments.
- **Gestalt Proximity**: Related controls sit within `gap-1.5` (6px); distinct groups sit at `space-y-4` (16px); section boundaries use generous whitespace (`py-16 md:py-24`).
- **Crisp 1px Surface Layering**: Pair `border border-neutral-200/80 dark:border-neutral-800` with subtle directional `shadow-xs` instead of blurry 30px drop-shadows.

```tsx
// Example: Production Component with Sovereign Visual Hierarchy
import { ArrowRight } from 'lucide-react';

interface MetricBannerProps {
  category: string;
  title: string;
  metricValue: string;
  metricLabel: string;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
}

export function MetricBanner({
  category,
  title,
  metricValue,
  metricLabel,
  onPrimaryAction,
  onSecondaryAction,
}: MetricBannerProps) {
  return (
    <section className="bg-neutral-50/50 dark:bg-neutral-950 py-12 px-6">
      <div className="mx-auto max-w-5xl rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 shadow-xs">
        {/* Eyebrow: Context landmark with optical tracking */}
        <span className="text-[11px] font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
          {category}
        </span>

        {/* Title: Punchy authority with tight tracking */}
        <h1 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          {title}
        </h1>

        {/* Metric block with tabular numerals to eliminate horizontal jitter */}
        <div className="mt-6 flex items-baseline gap-3">
          <span className="text-4xl font-extrabold tracking-tight tabular-nums text-neutral-900 dark:text-neutral-50">
            {metricValue}
          </span>
          <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {metricLabel}
          </span>
        </div>

        {/* Actions: Single primary CTA dominance + subtle ghost action */}
        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={onPrimaryAction}
            className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 px-4 py-2 text-sm font-medium text-white dark:text-neutral-900 transition hover:bg-neutral-800 dark:hover:bg-white active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            Deploy Pipeline
            <ArrowRight className="h-4 w-4" />
          </button>

          {onSecondaryAction && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 transition hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-neutral-400"
            >
              View Documentation
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
```

#### 10. Non-Generic Website Navigation: Floating Island Capsule Header & Mega Menu Flyouts
Modern production websites must avoid generic edge-to-edge glued navbar templates. Implement the **Floating Island Capsule Header** with rich **Flyout Card Mega Menus**:

```tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Layers, Cpu, ShieldCheck, Zap, ChevronDown, Menu, X } from 'lucide-react';

interface SubMenuItem {
  title: string;
  description: string;
  href: string;
  icon: typeof Layers;
}

const SKILL_CATEGORIES: { category: string; items: SubMenuItem[] }[] = [
  {
    category: 'Architecture & Swarm',
    items: [
      { title: 'Zero-to-Prod Orchestrator', description: '8-phase autonomous software lifecycle pipeline', href: '/skills/orchestrator', icon: Layers },
      { title: 'Frontier AI & MCP Engine', description: 'Model Context Protocol v1.x with dynamic routing', href: '/skills/mcp', icon: Cpu }
    ]
  },
  {
    category: 'Security & Quality Gate',
    items: [
      { title: 'Sovereign Anti-Slop', description: 'Zero-placeholder code & Linear-caliber UI craft', href: '/skills/anti-slop', icon: ShieldCheck },
      { title: 'Micro-TDD Compiler', description: 'Sub-15ms in-memory contract verification hot-loop', href: '/skills/tdd', icon: Zap }
    ]
  }
];

export function FloatingIslandCapsuleHeader() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenDropdown(null);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="fixed top-4 md:top-6 inset-x-0 mx-auto w-[calc(100%-2rem)] max-w-5xl z-50" ref={navRef}>
      {/* Floating Pill Capsule Bar */}
      <nav 
        aria-label="Main Navigation"
        className="flex items-center justify-between rounded-full px-4 md:px-6 py-2.5 md:py-3 bg-neutral-950/80 backdrop-blur-xl saturate-180 border border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)]"
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 text-white font-bold tracking-tight text-sm md:text-base">
          <span className="w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs">VP</span>
          <span>Vibes<span className="text-cyan-400">Plug</span></span>
        </Link>

        {/* Desktop Nav Links & Flyout Triggers */}
        <div className="hidden md:flex items-center gap-1">
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'skills' ? null : 'skills')}
              aria-expanded={openDropdown === 'skills'}
              aria-haspopup="true"
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              Skills
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'skills' ? 'rotate-180' : ''}`} />
            </button>

            {/* Flyout Mega Menu Dropdown (Rich Floating Card) */}
            {openDropdown === 'skills' && (
              <div 
                role="menu"
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3.5 w-[640px] max-w-[calc(100vw-2rem)] rounded-2xl p-5 bg-[#090c15] border border-white/12 shadow-[0_25px_65px_-12px_rgba(0,0,0,0.95),0_0_35px_rgba(6,182,212,0.1)] animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="grid grid-cols-2 gap-4">
                  {SKILL_CATEGORIES.map((cat) => (
                    <div key={cat.category} className="space-y-2">
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-neutral-500">{cat.category}</span>
                      <div className="space-y-1">
                        {cat.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.title}
                              href={item.href}
                              role="menuitem"
                              onClick={() => setOpenDropdown(null)}
                              className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors"
                            >
                              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-white group-hover:text-cyan-400 transition-colors">{item.title}</p>
                                <p className="text-[11px] text-neutral-400 line-clamp-1">{item.description}</p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="#benchmarks" className="px-3.5 py-1.5 rounded-full text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/5 transition-colors">
            Benchmarks
          </Link>
          <Link href="#architecture" className="px-3.5 py-1.5 rounded-full text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/5 transition-colors">
            Architecture
          </Link>
        </div>

        {/* CTA & Mobile Trigger */}
        <div className="flex items-center gap-2">
          <Link
            href="/docs"
            className="cursor-pointer inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-semibold text-neutral-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-sm"
          >
            Get Started
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="md:hidden p-1.5 rounded-full text-neutral-300 hover:text-white hover:bg-white/5"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>
    </header>
  );
}
```

---

#### React 19 Optimistic Mutation & Server Action Form Hook (TypeScript)
```tsx
'use client';

import { useActionState, useOptimistic } from 'react';

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
}

export function OptimisticTaskList({
  initialTasks,
  toggleTaskAction
}: {
  initialTasks: TaskItem[];
  toggleTaskAction: (prevState: { error?: string }, formData: FormData) => Promise<{ error?: string }>;
}) {
  const [state, formAction, isPending] = useActionState(toggleTaskAction, {});
  const [optimisticTasks, addOptimisticToggle] = useOptimistic(
    initialTasks,
    (currentTasks, toggledId: string) =>
      currentTasks.map((t) => (t.id === toggledId ? { ...t, completed: !t.completed } : t))
  );

  return (
    <form
      action={(formData) => {
        const id = String(formData.get('taskId') ?? '');
        addOptimisticToggle(id);
        formAction(formData);
      }}
      className="space-y-2"
    >
      {state.error && <p className="text-xs font-medium text-red-600">{state.error}</p>}
      {optimisticTasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between rounded-lg border border-neutral-200/80 dark:border-neutral-800 px-3 py-2"
        >
          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{task.title}</span>
          <button
            type="submit"
            name="taskId"
            value={task.id}
            disabled={isPending}
            className="cursor-pointer rounded-md border border-neutral-300 dark:border-neutral-700 px-2.5 py-1 text-xs font-medium tabular-nums transition hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-neutral-900 disabled:opacity-50"
          >
            {task.completed ? 'Done' : 'Mark Done'}
          </button>
        </div>
      ))}
    </form>
  );
}
```

#### React 19 `use()` Promise Streaming & View Transition Switcher (TSX)
```tsx
'use client';

import { use, startTransition, useState } from 'react';

export interface TelemetryPoint {
  readonly id: string;
  readonly region: string;
  readonly latencyP99Ms: number;
  readonly status: 'healthy' | 'degraded';
}

export function StreamingTelemetryPanel({
  telemetryPromise
}: {
  telemetryPromise: Promise<readonly TelemetryPoint[]>;
}) {
  const rows = use(telemetryPromise);
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');

  const filtered = selectedRegion === 'ALL'
    ? rows
    : rows.filter((r) => r.region === selectedRegion);

  function handleSelectRegion(region: string) {
    startTransition(() => {
      setSelectedRegion(region);
    });
  }

  return (
    <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
      <div className="mb-3 flex items-center gap-2">
        {['ALL', 'ap-southeast-1', 'us-east-1', 'eu-central-1'].map((region) => (
          <button
            key={region}
            type="button"
            onClick={() => handleSelectRegion(region)}
            className="cursor-pointer rounded-lg border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 text-xs font-medium transition hover:bg-neutral-100 dark:hover:bg-neutral-900 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-neutral-900"
          >
            {region}
          </button>
        ))}
      </div>
      <div className="divide-y divide-neutral-200/70 dark:divide-neutral-800">
        {filtered.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-2.5 text-sm">
            <span className="font-mono text-xs text-neutral-700 dark:text-neutral-300">{item.region}</span>
            <span className="font-mono text-xs font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">
              {item.latencyP99Ms} ms
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### Sovereign Enterprise Data Table with Tabular Numerals & Keyboard Navigation (TSX)
```tsx
'use client';

import { useState, type KeyboardEvent } from 'react';

export interface LedgerRow {
  readonly id: string;
  readonly invoiceNo: string;
  readonly amountMinor: number;
  readonly currency: string;
  readonly settled: boolean;
}

export function SovereignLedgerTable({ rows }: { readonly rows: readonly LedgerRow[] }) {
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  function handleKeyDown(e: KeyboardEvent<HTMLTableSectionElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => Math.min(rows.length - 1, prev + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => Math.max(0, prev - 1));
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 text-xs font-medium uppercase tracking-wider text-neutral-500">
            <th className="px-4 py-3">Invoice</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Amount</th>
          </tr>
        </thead>
        <tbody onKeyDown={handleKeyDown} tabIndex={0} className="divide-y divide-neutral-200/60 dark:divide-neutral-800/70 focus:outline-none">
          {rows.map((row, idx) => (
            <tr
              key={row.id}
              aria-selected={idx === focusedIndex}
              onClick={() => setFocusedIndex(idx)}
              className="cursor-pointer transition hover:bg-neutral-50 dark:hover:bg-neutral-900/60 aria-selected:bg-neutral-100/80 dark:aria-selected:bg-neutral-900"
            >
              <td className="px-4 py-3 font-mono text-xs font-medium text-neutral-900 dark:text-neutral-100">{row.invoiceNo}</td>
              <td className="px-4 py-3 text-xs text-neutral-600 dark:text-neutral-400">{row.settled ? 'Settled' : 'Pending'}</td>
              <td className="px-4 py-3 text-right font-mono text-xs font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">
                {row.currency} {(row.amountMinor / 100).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```


#### 11. NiubiGEO Mode: Cosmic Evidence & Interactive Utility Web Architecture (Anti-Monotony Blueprint)
Whenever building AI SaaS, developer tools, diagnostic platforms, or conversion landing pages where standard templates feel repetitive and monotonous, deploy the **NiubiGEO Cosmic Evidence Architecture**:

##### 1. Tailwind v4 Theme Tokens (`theme.css`)
```css
@import "tailwindcss";

@theme {
  --color-canvas: #080a0f;              /* Deep Cosmic Obsidian */
  --color-surface-l1: #11141e;          /* Layer 1 Surface */
  --color-surface-l2: #181b29;          /* Layer 2 Elevated Surface */
  --color-border-hairline: #272b3c;     /* Crisp 1px Boundary */
  --color-text-primary: #f5f4fa;        /* Crisp Off-White */
  --color-text-secondary: #979aaf;      /* Muted Slate-Violet */
  --color-accent-brand: #b7a0ff;        /* Electric Lavender */
  --color-accent-evidence: #7ce4b0;     /* Emerald Jade (Signals & Verified) */
  --color-focus-glow: #76508d;          /* Deep Violet Glow */
  --font-sans: "Inter", "Noto Sans SC", system-ui, sans-serif;
}
```

##### 2. Reusable Component: Conversion Hero with Embedded Interactive Setup
```tsx
import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles, Search } from 'lucide-react';

export function ConversionHeroWithSetup({ onAnalyze }: { onAnalyze?: (url: string) => void }) {
  const [url, setUrl] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setIsPending(true);
    onAnalyze?.(url);
  };

  return (
    <section className="relative overflow-hidden bg-[#080a0f] pt-24 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6">
      {/* Background subtle radial glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#b7a0ff]/8 blur-[120px] rounded-full" 
      />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Eyebrow: Uppercase monospace tracking */}
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#b7a0ff] font-mono">
          AI VISIBILITY · REAL-WORLD EXECUTION
        </p>

        {/* Title: Punchy optical tracking */}
        <h1 className="mt-4 text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#f5f4fa] leading-[1.15]">
          See How AI Evaluates You, <br className="hidden sm:inline" />
          <span className="text-[#b7a0ff]">Then Decide How to Improve.</span>
        </h1>

        {/* Lead Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base text-[#979aaf] leading-relaxed">
          Input your website, App, or GitHub address. Instantly verify how ChatGPT, Claude, Gemini, and Perplexity understand, describe, and cite your product.
        </p>

        {/* Action Button Row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#product-setup"
            className="group inline-flex items-center gap-2 rounded-lg bg-[#b7a0ff] px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#080a0f] transition hover:bg-[#c9b7ff] active:scale-[0.98] shadow-sm"
          >
            Start Immediate Test
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="/report-sample"
            className="inline-flex items-center gap-2 rounded-lg border border-[#272b3c] bg-[#11141e]/80 px-5 py-2.5 text-xs sm:text-sm font-medium text-[#f5f4fa] transition hover:border-[#b7a0ff]/40 hover:bg-[#181b29] active:scale-[0.98]"
          >
            View Sample Report
          </a>
          <a
            href="/docs"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-medium text-[#979aaf] hover:text-[#f5f4fa] transition"
          >
            Learn Mechanics
            <ArrowRight className="h-3.5 w-3.5 opacity-60" />
          </a>
        </div>

        {/* Conversion Inversion: Interactive Setup Card Embedded on Fold */}
        <div id="product-setup" className="mt-12 text-left">
          <div className="rounded-2xl border border-[#272b3c] bg-[#11141e] p-5 sm:p-7 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#272b3c]">
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-[#f5f4fa]">Let AI Test Your Product</h3>
                <p className="text-xs text-[#979aaf] mt-0.5">Enter product website, domain, or repository address</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#7ce4b0]/10 border border-[#7ce4b0]/20 px-2.5 py-1 text-[11px] font-medium text-[#7ce4b0]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7ce4b0] animate-pulse" />
                Live Engines Ready
              </span>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#979aaf]" />
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://yourproduct.com"
                    className="w-full rounded-lg border border-[#272b3c] bg-[#181b29] pl-10 pr-4 py-3 text-xs sm:text-sm text-[#f5f4fa] placeholder-[#979aaf]/60 focus:border-[#b7a0ff] focus:outline-none focus:ring-1 focus:ring-[#b7a0ff]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isPending}
                  className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg bg-[#b7a0ff] px-6 py-3 text-xs sm:text-sm font-semibold text-[#080a0f] hover:bg-[#c9b7ff] active:scale-[0.98] transition disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                  {isPending ? 'Diagnosing...' : 'Analyze Now'}
                </button>
              </div>

              {/* Engine Checklist Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-[#979aaf]">
                <span>Evaluating against:</span>
                {['ChatGPT Search', 'Claude 3.7', 'Gemini 2.5', 'Perplexity Pro'].map((engine) => (
                  <span key={engine} className="rounded-md border border-[#272b3c] bg-[#181b29] px-2 py-0.5 font-mono text-[10px] text-[#f5f4fa]/80">
                    {engine}
                  </span>
                ))}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
```

##### 3. Reusable Component: Actionable Evidence Bento Grid
```tsx
import React from 'react';
import { ShieldCheck, Tag, Globe2, ListTodo, ArrowUpRight } from 'lucide-react';

export function ActionableEvidenceBento() {
  return (
    <section className="bg-[#080a0f] py-16 md:py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#7ce4b0] font-mono">
            ACTIONABLE EVIDENCE · ZERO VANITY
          </p>
          <h2 className="mt-3 text-2xl sm:text-4xl font-bold tracking-tight text-[#f5f4fa]">
            Reports Are Not a Score, But a Set of Actionable Proof.
          </h2>
        </div>

        {/* 4-Card Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {/* Card 1: Brand Visibility */}
          <div className="rounded-2xl border border-[#272b3c] bg-[#11141e] p-6 hover:border-[#b7a0ff]/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-[#979aaf] tracking-wider">Metric 01</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-[#7ce4b0] font-mono">
                <span className="h-2 w-2 rounded-full bg-[#7ce4b0] animate-ping" />
                Active Mention
              </span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#f5f4fa]">Brand Presence & Visibility</h3>
            <p className="mt-1 text-xs text-[#979aaf]">
              Measures whether LLMs spontaneously cite your solution when users query domain questions.
            </p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-[#f5f4fa] tabular-nums">78.4%</span>
              <span className="text-xs text-[#7ce4b0] font-medium">+14.2% vs competitors</span>
            </div>
          </div>

          {/* Card 2: Description Accuracy */}
          <div className="rounded-2xl border border-[#272b3c] bg-[#11141e] p-6 hover:border-[#b7a0ff]/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-[#979aaf] tracking-wider">Metric 02</span>
              <Tag className="h-4 w-4 text-[#b7a0ff]" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#f5f4fa]">Entity Description Accuracy</h3>
            <p className="mt-1 text-xs text-[#979aaf]">
              Verifies if AI hallucinations misrepresent your core features, pricing, or tech stack.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-md bg-[#7ce4b0]/15 border border-[#7ce4b0]/30 px-2.5 py-1 text-xs font-medium text-[#7ce4b0]">
                ✓ Open-Source Verified
              </span>
              <span className="rounded-md bg-[#7ce4b0]/15 border border-[#7ce4b0]/30 px-2.5 py-1 text-xs font-medium text-[#7ce4b0]">
                ✓ Self-Hosted Support
              </span>
              <span className="rounded-md bg-[#b7a0ff]/15 border border-[#b7a0ff]/30 px-2.5 py-1 text-xs font-medium text-[#b7a0ff]">
                i18n Multi-Lingual
              </span>
            </div>
          </div>

          {/* Card 3: Multi-Platform Citations */}
          <div className="rounded-2xl border border-[#272b3c] bg-[#11141e] p-6 hover:border-[#b7a0ff]/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-[#979aaf] tracking-wider">Metric 03</span>
              <Globe2 className="h-4 w-4 text-[#b7a0ff]" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#f5f4fa]">Citations & Competitor Benchmarks</h3>
            <p className="mt-1 text-xs text-[#979aaf]">
              Track exact URLs and community discussions where AI discovers your product credentials.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-[#272b3c] bg-[#181b29] p-2.5">
                <span className="text-[#979aaf]">Top Source</span>
                <p className="font-semibold text-[#f5f4fa] truncate mt-0.5">GitHub Trending / Repo</p>
              </div>
              <div className="rounded-lg border border-[#272b3c] bg-[#181b29] p-2.5">
                <span className="text-[#979aaf]">Secondary</span>
                <p className="font-semibold text-[#f5f4fa] truncate mt-0.5">Substack & X Threads</p>
              </div>
            </div>
          </div>

          {/* Card 4: Prioritized Action Checklist */}
          <div className="rounded-2xl border border-[#272b3c] bg-[#11141e] p-6 hover:border-[#b7a0ff]/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-[#979aaf] tracking-wider">Action Plan</span>
              <ListTodo className="h-4 w-4 text-[#7ce4b0]" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#f5f4fa]">Prioritized Improvement Triage</h3>
            <p className="mt-1 text-xs text-[#979aaf]">
              Concrete technical modifications that yield direct increases in search agent citations.
            </p>
            <ul className="mt-4 space-y-2 text-xs">
              <li className="flex items-center justify-between rounded-lg border border-[#272b3c] bg-[#181b29] px-3 py-2">
                <span className="text-[#f5f4fa]">Deploy `llms.txt` and schema.org markup</span>
                <span className="rounded bg-[#7ce4b0]/20 px-2 py-0.5 text-[10px] font-semibold text-[#7ce4b0]">High Impact</span>
              </li>
              <li className="flex items-center justify-between rounded-lg border border-[#272b3c] bg-[#181b29] px-3 py-2">
                <span className="text-[#f5f4fa]">Publish benchmark comparison table</span>
                <span className="rounded bg-[#b7a0ff]/20 px-2 py-0.5 text-[10px] font-semibold text-[#b7a0ff]">Priority</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Muse Wonder High`, `Composer 2.5 Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec senior-frontend <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_visual_audit`, `vibes_ast_query`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | LCP < 1.8s, INP < 100ms, CLS < 0.05, 1px crisp borders, 3-tier radius (6px/8px/12px), `tabular-nums`, 5-state interactive contract; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Pola pengembangan frontend tingkat produksi, optimasi performa, dan integrasi ekosistem modern untuk aplikasi React 19 / Next.js 15 dengan Tailwind CSS v4 dan TypeScript. Mencakup React 19 Compiler, Partial Prerendering (PPR), View Transitions API, dan strategi hybrid SPA/MPA dengan loop pengujian perbaikan mandiri (self-healing).

### Integrasi Orkestrasi
- `modern-web-guidance`: Untuk standar HTML5/CSS, API browser modern, dan pedoman aksesibilitas.
- `design-system-architect`: Untuk membangun komponen UI yang kuat (Radix, Base UI, shadcn) dan design token.
- `modern-css-native-expert`: Untuk CSS anchor positioning native, View Transitions, container queries, dan `@starting-style`.
- `tailwind-expert`: Untuk styling dan konfigurasi @theme kustom.
- `ui-ux-pro-max`: Untuk kecerdasan desain UI/UX, harmoni warna, dan pola layout lintas 11 stack.
- `visual-ui-auditor`: Untuk inspeksi vision multimodal terhadap antarmuka yang dirender dan fidelitas tata letak.
- `svg-animation-motion-expert`: Untuk animasi web, timeline GSAP, dan fisika spring.
- `nextjs-app-router-expert`: Untuk RSC, caching, dan pola routing Next.js.
- `state-management-expert`: Untuk state client-side (Zustand, Jotai).
- `tanstack-query-expert`: Untuk fetching data lanjutan dan caching server state.
- `spa-orchestrator`: Untuk arsitektur Single-Page Application.
- `mpa-orchestrator`: Untuk arsitektur Multi-Page Application.
- `autonomous-tdd-debugger`: Untuk eksekusi pengujian otomatis dan perbaikan mandiri berdasarkan stack trace terminal.
- `anti-slop`: Untuk penegakan implementasi komponen lengkap tanpa stub dan tanpa komentar narasi sintaksis.
- **Sinergi Lintas Domain & Integrasi Swarm Subagent**: `vue-frontend-expert`, `svelte-sveltekit-expert`, `solidjs-expert`, `angular-expert`, `astro-framework-expert`, `htmx-hypermedia-expert`, `micro-frontend-architect`, `fullstack-expert`, `rich-text-editor-expert`, `ephemeral-generative-ui-architect`

### Kondisi Pemicu
- Buat proyek React atau Next.js 15 baru dengan TypeScript dan Tailwind CSS v4.
- Buat komponen baru, custom hooks, atau Server Actions.
- Analisis dan optimalkan ukuran bundle dan Core Web Vitals.
- Terapkan pola React 19 lanjutan (`useActionState`, `useOptimistic`, `use()`).
- Bangun SPA — koordinasikan dengan `spa-orchestrator`.
- Pastikan kepatuhan aksesibilitas (WCAG 2.2) dan pengujian.

### Panduan Teknis & Praktik Terbaik

#### 1. Next.js 15: Server vs Client Components
Gunakan **Server Components** secara default. Gunakan `'use client'` hanya untuk:
- State (`useState`, `useEffect`), event handler, API browser.
- UI interaktif yang membutuhkan hidrasi klien.

*Persyaratan Next.js 15.2+:*
- Wajib `await` pada `params` dan `searchParams` yang kini bertipe `Promise`.
- Gunakan **Partial Prerendering (PPR)** secara native. Bungkus bagian dinamis dengan `<Suspense>`.

#### 2. React 19 Compiler & Hook Baru
Jangan gunakan `useMemo`, `useCallback`, atau `React.memo` kecuali sangat diperlukan; andalkan compiler React 19.

**Hook Wajib:**
- **`useActionState`**: Kelola state form, indikator loading, dan hasil action dengan Server Actions.
- **`useOptimistic`**: Perbarui UI secara instan sebelum server mengonfirmasi.
- **`useFormStatus`**: Baca status form di dalam komponen anak.
- **`use(promise)`**: Buka promise atau context langsung di dalam render dengan Suspense.

#### 3. View Transitions API
Terapkan View Transitions API bawaan browser untuk transisi halaman. Gunakan `<Link viewTransition>` pada Next.js 15.

#### 4. Tailwind CSS v4
Gunakan konfigurasi CSS-first. Definisikan token kustom dengan `@theme` dan plugin dengan `@plugin` di file CSS utama (lihat `tailwind-expert`). Jangan pernah membuat file `tailwind.config.js`.

#### 5. Aksesibilitas (WCAG 2.2) & Pengujian Self-Healing
- Wajib gunakan HTML semantik (`<button>`, `<nav>`, `<main>`).
- Wajib pastikan navigasi keyboard dengan label `aria-*` yang valid.
- Jalankan pemeriksaan tipe (`tsc --noEmit`) untuk memastikan nol eror diagnostik.
- Tulis pengujian unit dengan **Vitest** dan **React Testing Library**.
- Jika pengujian gagal, aktifkan `autonomous-tdd-debugger` untuk memulihkan kode hingga 100% lolos.

#### 6. Integrasi Arsitektur
- **SPA (`spa-orchestrator`)**: Gunakan **TanStack Router** untuk routing klien dan **TanStack Query v5** untuk server state. Jangan gunakan `useEffect` murni untuk fetching data.
- **MPA (`mpa-orchestrator`)**: Gunakan **Alpine.js** atau **HTMX** untuk interaksi mikro. Terapkan Progressive Enhancement.

#### 7. Animasi & Motion
Untuk animasi web, timeline scroll-driven, koreografi GSAP, dan fisika spring Framer Motion, delegasikan langsung ke `svg-animation-motion-expert`.

#### 8. Integrasi Web Material Design 3 (M3) (https://m3.material.io/)
Pada aplikasi React 19 / Next.js 15 modern, terapkan komponen web resmi Google (`@material/web`) atau primitif headless yang dipetakan ke token M3:
- **Komponen Material Web**: Manfaatkan komponen berbasis Lit (`@material/web`) yang didukung secara native oleh React 19 tanpa wrapper tambahan.
- **Theming Variabel CSS Dinamis**: Terapkan token M3 (`--md-sys-color-primary`, `--md-sys-color-surface-container`) pada elemen root untuk menjamin paritas kontras WCAG di seluruh komponen antarmuka.

#### 9. Rekayasa Hierarki Visual & Kemampuan Pindai
Setiap tampilan React 19 / Next.js 15 wajib memancarkan hierarki visual kaliber Stripe/Linear:
- **Irama Tipografi**: Eyebrow (`text-[11px] font-semibold tracking-wider uppercase text-neutral-500`) -> Judul Utama (`text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-[1.1]`) -> Subjudul (`text-xl md:text-2xl font-semibold tracking-tight`) -> Body (`text-sm md:text-base text-neutral-600 leading-relaxed`).
- **Angka Tabular Wajib**: Selalu terapkan `tabular-nums` pada metrik, saldo mata uang, dan pencacah data.
- **Dominasi Single Primary CTA**: Maksimal satu tombol utama kontras tinggi per layar; aksi sekunder menggunakan gaya subtle/outline.
- **Kedekatan Gestalt (Proximity)**: Kontrol dan label terhubung duduk berjarak rapat `gap-1.5` (6px); batas antar-seksi menggunakan ruang kosong yang lega (`py-16 md:py-24`).
- **Pelapisan Permukaan 1px Tajam**: Padukan border tajam `border border-neutral-200/80 dark:border-neutral-800` dengan micro-shadow terarah `shadow-xs` alih-alih bayangan hitam buram 30px.

#### 10. Navigasi Website Anti-Pasaran: Kapsul Mengambang (Floating Island) & Flyout Mega Menu
Website produksi modern dilarang menggunakan template navbar kotak generik yang menempel penuh ke batas atas. Wajib implementasikan arsitektur **Floating Island Capsule Header** dengan **Flyout Card Mega Menu**:
- **Bilah Kapsul Melayang**: Melayang di atas kanvas latar belakang (`fixed top-4 md:top-6 inset-x-0 mx-auto w-[calc(100%-2rem)] max-w-5xl z-50 rounded-full px-4 md:px-6 py-2.5 md:py-3`).
- **Tema Glassmorphism Translusen Gelap**: Padukan latar belakang gelap dengan blur optik halus (`bg-neutral-950/80 backdrop-blur-xl saturate-180 border border-white/10`) sehingga konten di bawahnya tetap terlihat samar elegan saat digulir.
- **Flyout Card Bertingkat**: Saat menu *Skills* atau *Produk* diaktifkan, tampilkan kartu melayang terpisah (`rounded-2xl p-5 bg-[#0a0d14]/95 backdrop-blur-2xl border border-white/10 shadow-2xl`) yang menyajikan sub-menu dalam kisi terstruktur: wadah ikon visual, judul tegas, dan deskripsi nilai manfaat 1 kalimat (bebas link teks polos yang membosankan).


#### 11. Mode NiubiGEO: Arsitektur Web Bukti Kosmik & Utilitas Interaktif (Blueprint Anti-Monoton)
Saat membangun AI SaaS, alat developer, atau landing page berkonversi tinggi di mana template standar terasa membosankan dan monoton, terapkan **Arsitektur Bukti Kosmik NiubiGEO**:

- **Token Obsidian Kosmik**: Latar belakang `#080a0f`, permukaan berlapis `#11141e` & `#181b29`, garis batas 1px `#272b3c`, serta aksen ganda dinamis: Lavender Elektrik `#b7a0ff` (tombol aksi & fokus) dan Jade Zamrud `#7ce4b0` (status sinyal & bukti valid).
- **Hero Konversi Inversi**: Menanamkan widget input diagnostik fungsional (`#product-setup`) tepat di lipatan hero pertama (*above the fold*). Pengguna langsung memasukkan URL tanpa formulir pendaftaran yang kaku.
- **Bento Grid Bukti Tindakan**: 4 kartu modular pembuktian empiris yang menggantikan angka metrik kosong: Sinyal Visibilitas Merek (`tabular-nums`), Akurasi Deskripsi Entitas, Sitasi Lintas Platform (ChatGPT, Claude, Gemini, Perplexity), serta Daftar Tindakan Prioritas.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Muse Wonder High`, `Composer 2.5 Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec senior-frontend <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_visual_audit`, `vibes_ast_query`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | LCP < 1.8s, INP < 100ms, CLS < 0.05, border tegas 1px, radius 3-tier (6px/8px/12px), `tabular-nums`, kontrak interaktif 5-state; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
