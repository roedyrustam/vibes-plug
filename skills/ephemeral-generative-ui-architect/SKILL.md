---
name: ephemeral-generative-ui-architect
description: "Master guide for Ephemeral Generative UI, real-time dynamic component streaming (React 19 RSC & Vercel AI SDK v4+), multi-widget layout orchestration, bidirectional action loops, sandboxed error boundaries, and affective adaptive interfaces / Panduan ahli arsitektur Generative UI efemeral, streaming komponen real-time (React 19 RSC & Vercel AI SDK v4+), orkestrasi layout multi-widget, loop aksi dua arah, dan antarmuka adaptif afektif."
author: "Roedy Rustam"
version: "4.4.2"
---

# Ephemeral Generative UI Architect (2026 Sovereign Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Executive Directive & Ephemeral UI Paradigm (2026 Shift)
Traditional web applications render pre-compiled, static templates. Even modern AI chatbots largely output passive markdown text or static charts. In the Gemini 4 (fallback: Gemini 3.8 Flash) / Claude 5.5 (fallback: Claude Opus 4.6) / Muse Wonder era, this architecture is obsolete for high-agency coding and autonomous workflows.

**Ephemeral Generative UI** is an architectural paradigm where interfaces are:
1. **Synthesized on-the-fly**: Generated dynamically based on the exact query context, underlying data topology, and user cognitive state.
2. **Streaming & Progressive**: Emitting immediate optimistic skeletons within milliseconds of the first tool token, progressively streaming numerical metrics, and hydrating into interactive widgets.
3. **Transient by Default**: Existing within the active conversation stream. Once a decision is finalized or the conversation context shifts, the widget collapses into an ultra-compact audit badge or archives into session checkpoints (`session-memory-manager`).
4. **Bidirectional & Actionable**: User interactions inside the generated widget (e.g., date selection, slider tweaks, form submissions) dispatch typed actions directly back into the LLM reasoning loop without page reloads.

### Orchestration & Integration
- **Upstream AI Models & Transports**: `ai-llm-integration-expert`, `frontier-ai-models-expert`, `gemini-agent-booster`, `vercel-ai-sdk-expert`.
- **Frontend Presentation & Layout**: `senior-frontend`, `nextjs-app-router-expert`, `design-system-architect`, `tailwind-expert`, `modern-css-native-expert`.
- **Sovereign Quality & Anti-Slop**: `anti-slop`, `visual-ui-auditor`, `ui-ux-pro-max`, `structured-output-contracts`.
- **Emotional & Cognitive Adaptation**: `affective-computing-emotion-ai`, `voice-ai-realtime-agent`.
- **Lifecycle & Security**: `prompt-injection-firewall`, `session-memory-manager`, `zero-to-prod-orchestrator`.

---

### Core Architectural Topologies (The 5 Pillars)

```
┌────────────────────────────────────────────────────────────────────────┐
│                   TOPOLOGY FLOW: EPHEMERAL GENERATIVE UI              │
├────────────────────────────────────────────────────────────────────────┤
│ 1. LLM Tool Call ──► 2. Optimistic Skeleton (<WidgetSkeleton />)       │
│                      │                                                 │
│                      ▼                                                 │
│ 3. Progressive StreamableValue ──► 4. Fully Hydrated Interactive RSC   │
│                                    │                                   │
│                                    ▼                                   │
│ 5. User Interaction (Click/Slider) ──► 6. Typed Server Action Feedback │
│                                    │                                   │
│                                    ▼                                   │
│                                7. Next LLM Reasoning Turn (No Reload)  │
└────────────────────────────────────────────────────────────────────────┘
```

#### 1. Progressive Server-Streamed RSC (`createStreamableUI` + React 19)
The server intercepts LLM tool invocations and immediately yields an optimistic skeleton to the client. As data resolves in parallel, streamable values pipe live numbers into the client, resolving to the full interactive component.

#### 2. Client-Side Tool Invocation Dispatcher (`useChat` + `toolInvocations`)
For high-scale, edge-rendered applications, LLM tool calls emit structured JSON payloads over the standard data stream (`createDataStreamResponse`). The client router dynamically resolves the component from a typed component registry with graceful degradation.

#### 3. Dynamic Multi-Slot Layout Orchestration (AI Layout Engine)
Rather than streaming isolated cards, the LLM emits a `LayoutManifest` (e.g., `split-master`, `masonry-grid`, `dashboard-3col`) and streams multiple widgets concurrently into declared layout slots (`headerSlot`, `primarySlot`, `secondarySlot`, `actionSlot`).

#### 4. Closed-Loop Bidirectional Action Feedback
Ephemeral components are not read-only. Clicking an option, sliding a value, or toggling a tab triggers a typed React 19 Server Action. This action updates the conversation state and re-invokes the agent pipeline with the user's explicit parameters.

#### 5. Affective & Cognitive Adaptation
Coordinates with `affective-computing-emotion-ai`. If the user's `AffectVector` indicates high cognitive load or frustration, the component engine automatically scales down visual clutter:
- Switches from multi-tab dashboards to focused single-metric decision cards.
- Increases typography scale and button hit-targets.
- Suppresses animated transitions in favor of crisp, instant layout updates.

---

### Sovereign Visual Hierarchy & Anti-Slop Enforcement
All ephemeral components must strictly comply with **Anti-Slop Pillar 7**:
1. **Container Grounding**: Enforce Level 1 Surface containers with crisp 1px borders:
   `bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl shadow-xs overflow-hidden`.
2. **Three-Tier Radius Contract**:
   - `rounded-lg` (8px) for buttons, inputs, pills, and badges.
   - `rounded-xl` (12px) for card surfaces and widget panels.
   - `rounded-2xl` (16px) for root generative modals and sheets.
3. **Typographic Rhythm**:
   - Category Eyebrow: `text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400`.
   - Primary Heading: `text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100`.
   - Data Values & Metrics: `font-mono text-xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 tabular-nums`.
   - Body & Supporting Context: `text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed`.
4. **Mandatory 5-State Interactive Contract**:
   - Every interactive element within a generated widget MUST handle: `idle`, `hover`, `active`, `focus-visible`, and `disabled`/`loading`.
5. **Accessibility & Screen Reader Contracts**:
   - Wrap dynamic streaming slots with `role="region"` and `aria-live="polite"`.
   - Add `aria-busy="true"` while props are streaming; flip to `false` upon hydration completion.
6. **Anti-Slop Prohibitions**:
   - Zero generic purple-blue gradients (`bg-gradient-to-r from-purple-500 to-blue-500` is strictly banned).
   - Zero blurred floating neon orbs behind cards.
   - Zero pill buttons on rectangular card layouts (`rounded-full` is restricted to avatar rings and status indicator chips).

---

### Production Implementation Blueprints

#### Blueprint 1: Progressive Server-Streamed RSC Dashboard (`app/actions/stream-dashboard.tsx`)
```tsx
'use server';

import { createStreamableUI, createStreamableValue } from 'ai/rsc';
import { google } from '@ai-sdk/google';
import { streamUI } from 'ai/rsc';
import { z } from 'zod';
import React from 'react';

interface MetricPayload {
  label: string;
  value: number;
  change: number;
  currency: string;
}

export async function streamFinancialAnalysis(ticker: string) {
  const ui = createStreamableUI(
    <div className="w-full p-4 border border-neutral-200/80 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 shadow-xs animate-pulse">
      <div className="h-4 w-28 bg-neutral-200 dark:bg-neutral-800 rounded-md mb-3" />
      <div className="h-8 w-44 bg-neutral-200 dark:bg-neutral-800 rounded-md mb-4" />
      <div className="h-24 w-full bg-neutral-100 dark:bg-neutral-800/50 rounded-lg" />
    </div>
  );

  const metricStream = createStreamableValue<MetricPayload>({
    label: ticker.toUpperCase(),
    value: 0,
    change: 0,
    currency: 'USD',
  });

  (async () => {
    try {
      // Simulate sub-millisecond data retrieval
      metricStream.update({ label: ticker.toUpperCase(), value: 142.50, change: 1.25, currency: 'USD' });
      await new Promise(resolve => setTimeout(resolve, 300));

      metricStream.update({ label: ticker.toUpperCase(), value: 144.80, change: 2.85, currency: 'USD' });
      await new Promise(resolve => setTimeout(resolve, 400));

      metricStream.done({ label: ticker.toUpperCase(), value: 145.20, change: 3.12, currency: 'USD' });

      ui.done(
        <div className="w-full border border-neutral-200/80 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Market Telemetry
              </span>
              <h3 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                {ticker.toUpperCase()} Equity Overview
              </h3>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50">
              Live Feed
            </span>
          </div>

          <div className="p-4 grid grid-cols-2 gap-4">
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-lg border border-neutral-200/60 dark:border-neutral-800">
              <span className="text-xs text-neutral-500 dark:text-neutral-400 block mb-1">Spot Price</span>
              <div className="text-xl font-bold font-mono tracking-tight text-neutral-900 dark:text-neutral-50 tabular-nums">
                $145.20
              </div>
            </div>
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-lg border border-neutral-200/60 dark:border-neutral-800">
              <span className="text-xs text-neutral-500 dark:text-neutral-400 block mb-1">24h Alpha</span>
              <div className="text-xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
                +3.12%
              </div>
            </div>
          </div>

          <div className="px-4 py-3 bg-neutral-50/50 dark:bg-neutral-800/20 border-t border-neutral-100 dark:border-neutral-800/60 flex justify-end">
            <button
              type="button"
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-2xs hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors focus:outline-hidden focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
            >
              Export Metrics
            </button>
          </div>
        </div>
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Telemetry streaming failed';
      ui.done(
        <div className="p-4 border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl text-rose-700 dark:text-rose-400 text-xs">
          <strong>Telemetry Error:</strong> {message}
        </div>
      );
    }
  })();

  return { ui: ui.value, metrics: metricStream.value };
}
```

---

#### Blueprint 2: Client-Side Tool Invocation Registry & Component Dispatcher (`components/ephemeral/tool-registry.tsx`)
```tsx
'use client';

import React from 'react';
import { WidgetErrorBoundary } from './widget-error-boundary';

interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  state: 'call' | 'result';
  result?: unknown;
}

interface RegistryProps {
  invocation: ToolInvocation;
  onActionSubmit?: (actionName: string, payload: Record<string, unknown>) => Promise<void>;
}

// 1. Shimmering Skeleton for Pending Tool Execution
function ToolExecutionSkeleton({ toolName }: { toolName: string }) {
  return (
    <div
      role="region"
      aria-live="polite"
      aria-busy="true"
      className="w-full my-3 p-4 border border-neutral-200/80 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 shadow-xs"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-neutral-400 animate-ping" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Synthesizing Interface: {toolName}
        </span>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-3/4 bg-neutral-100 dark:bg-neutral-800 rounded-md animate-pulse" />
        <div className="h-10 w-full bg-neutral-100 dark:bg-neutral-800 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}

// 2. Concrete Interactive Tool: Seat Picker Widget
function FlightSeatPickerWidget({
  data,
  onSelectSeat,
}: {
  data: { flightNumber: string; route: string; availableSeats: string[]; basePrice: number };
  onSelectSeat?: (seat: string) => void;
}) {
  const [selected, setSelected] = React.useState<string | null>(null);

  const handleConfirm = () => {
    if (selected && onSelectSeat) {
      onSelectSeat(selected);
    }
  };

  return (
    <div className="w-full my-3 border border-neutral-200/80 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 shadow-xs overflow-hidden">
      <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Interactive Selector
          </span>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Flight {data.flightNumber} ({data.route})
          </h4>
        </div>
        <span className="text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 tabular-nums">
          From ${data.basePrice}
        </span>
      </div>

      <div className="p-4">
        <span className="text-xs text-neutral-500 dark:text-neutral-400 block mb-2">Select Preferred Seat:</span>
        <div className="grid grid-cols-4 gap-2">
          {data.availableSeats.map((seat) => (
            <button
              key={seat}
              type="button"
              onClick={() => setSelected(seat)}
              className={`py-2 px-3 text-xs font-mono font-medium rounded-lg border transition-all ${
                selected === seat
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-transparent shadow-xs'
                  : 'bg-neutral-50 dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
              }`}
            >
              {seat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 bg-neutral-50/50 dark:bg-neutral-800/20 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          Selected: <strong className="font-mono text-neutral-900 dark:text-neutral-100">{selected || 'None'}</strong>
        </span>
        <button
          type="button"
          disabled={!selected}
          onClick={handleConfirm}
          className="px-3.5 py-1.5 text-xs font-medium text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-2xs"
        >
          Confirm Seat Choice
        </button>
      </div>
    </div>
  );
}

// 3. Central Dispatcher
export function ToolRegistryDispatcher({ invocation, onActionSubmit }: RegistryProps) {
  if (invocation.state === 'call') {
    return <ToolExecutionSkeleton toolName={invocation.toolName} />;
  }

  return (
    <WidgetErrorBoundary toolName={invocation.toolName}>
      {invocation.toolName === 'pickFlightSeat' && (
        <FlightSeatPickerWidget
          data={invocation.result as { flightNumber: string; route: string; availableSeats: string[]; basePrice: number }}
          onSelectSeat={(seat) => onActionSubmit?.('confirmSeat', { seat, flightNumber: (invocation.args as { flightNumber?: string }).flightNumber })}
        />
      )}
    </WidgetErrorBoundary>
  );
}
```

---

#### Blueprint 3: Self-Healing Error Boundary Sandbox (`components/ephemeral/widget-error-boundary.tsx`)
```tsx
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  toolName: string;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class WidgetErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[Ephemeral-UI] Failed rendering widget '${this.props.toolName}':`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="my-3 p-4 border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 rounded-xl"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Widget Rendering Fallback
            </span>
            <span className="text-[11px] font-mono text-amber-600/80 dark:text-amber-400/80">
              {this.props.toolName}
            </span>
          </div>
          <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed mb-3">
            The AI-synthesized interface encountered a runtime schema mismatch: {this.state.errorMessage}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, errorMessage: '' })}
              className="px-2.5 py-1 text-xs font-medium bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 rounded-md hover:bg-amber-200 dark:hover:bg-amber-800/60 transition-colors"
            >
              Retry Render
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

#### Blueprint 4: Multi-Slot Adaptive Grid Container (`components/ephemeral/multi-widget-grid.tsx`)
```tsx
'use client';

import React from 'react';

export type LayoutArchetype = 'single-card' | 'split-master' | 'dashboard-3col' | 'timeline-feed';

interface MultiWidgetGridProps {
  archetype: LayoutArchetype;
  headerSlot?: React.ReactNode;
  primarySlot: React.ReactNode;
  secondarySlot?: React.ReactNode;
  actionSlot?: React.ReactNode;
}

export function MultiWidgetGrid({
  archetype,
  headerSlot,
  primarySlot,
  secondarySlot,
  actionSlot,
}: MultiWidgetGridProps) {
  return (
    <section className="w-full my-4 flex flex-col gap-3">
      {headerSlot && <div className="w-full">{headerSlot}</div>}

      {archetype === 'single-card' && (
        <div className="w-full">{primarySlot}</div>
      )}

      {archetype === 'split-master' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 w-full">
          <div className="md:col-span-7">{primarySlot}</div>
          <div className="md:col-span-5">{secondarySlot}</div>
        </div>
      )}

      {archetype === 'dashboard-3col' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
          <div className="col-span-1">{primarySlot}</div>
          <div className="col-span-1">{secondarySlot}</div>
          <div className="col-span-1">{actionSlot}</div>
        </div>
      )}

      {archetype === 'timeline-feed' && (
        <div className="w-full space-y-3 border-l-2 border-neutral-200 dark:border-neutral-800 pl-4">
          {primarySlot}
          {secondarySlot}
        </div>
      )}

      {actionSlot && archetype !== 'dashboard-3col' && (
        <div className="w-full pt-2 flex justify-end">{actionSlot}</div>
      )}
    </section>
  );
}
```

---

### Latency Budget & Production Hardening
- **TTFS (Time to First Skeleton)**: Under **100ms**. The moment an LLM generates a tool call opening token, stream the corresponding placeholder skeleton immediately.
- **Hydration Target**: Under **450ms** from stream completion to interactive readiness.
- **Input Sanitization**: All props supplied by the LLM MUST be strictly validated via Zod schemas before passing to client components to prevent indirect prompt injection (`prompt-injection-firewall`).
- **Memory Hygiene**: Ephemeral components must clean up active polling subscriptions or event listeners when removed from the DOM.
- **Model Availability Fallback**: If streaming structured UI manifests via Gemini 4 or Claude Opus 5.5, maintain seamless failover to Gemini 3.8 Flash and Claude Opus 4.6 to safeguard <100ms TTFS.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Direktif Eksekutif & Paradigma UI Efemeral (Pergeseran 2026)
Aplikasi web konvensional merender template statis yang telah dikompilasi sebelumnya. Bahkan chatbot AI modern sebagian besar masih menghasilkan teks markdown pasif atau diagram statis. Di era Gemini 4 (fallback: Gemini 3.8 Flash) / Claude 5.5 (fallback: Claude Opus 4.6) / Muse Wonder, arsitektur ini sudah usang untuk kebutuhan coding tingkat lanjut dan alur kerja agen otonom.

**Generative UI Efemeral** adalah paradigma arsitektur di mana antarmuka:
1. **Disintesis Secara Instan (On-the-fly)**: Dihasilkan secara dinamis berdasarkan konteks kueri pengguna, topologi data yang mendasari, dan beban kognitif pengguna.
2. **Streaming & Progresif**: Mengeluarkan kerangka pemuatan (*skeleton*) optimistik dalam hitungan milidetik dari token alat pertama, melakukan streaming metrik angka secara bertahap, dan menghidrasi komponen interaktif.
3. **Fana (Transient) Secara Bawaan**: Hidup di dalam aliran percakapan aktif. Begitu keputusan diambil atau konteks berpindah, widget menyusut menjadi lencana audit ringkas atau diarsipkan ke checkpoint sesi (`session-memory-manager`).
4. **Dua Arah & Dapat Dioperasikan (Bidirectional)**: Interaksi pengguna di dalam widget (memilih tanggal, menggeser slider harga, mengisi formulir) mengirimkan aksi bertipe kembali ke loop penalaran LLM tanpa *refresh* halaman.

### Integrasi Orkestrasi
- **Model AI Hulu & Protokol Transport**: `ai-llm-integration-expert`, `frontier-ai-models-expert`, `gemini-agent-booster`, `vercel-ai-sdk-expert`.
- **Presentasi Frontend & Tata Letak**: `senior-frontend`, `nextjs-app-router-expert`, `design-system-architect`, `tailwind-expert`, `modern-css-native-expert`.
- **Standar Kualitas & Anti-Slop**: `anti-slop`, `visual-ui-auditor`, `ui-ux-pro-max`, `structured-output-contracts`.
- **Adaptasi Emosional & Kognitif**: `affective-computing-emotion-ai`, `voice-ai-realtime-agent`.
- **Siklus Hidup & Keamanan**: `prompt-injection-firewall`, `session-memory-manager`, `zero-to-prod-orchestrator`.

---

### 5 Topologi Arsitektur UI Efemeral

```
┌────────────────────────────────────────────────────────────────────────┐
│               ALUR TOPOLOGI: GENERATIVE UI EFEMERAL 2026               │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Pemanggilan Alat LLM ──► 2. Skeleton Optimis (<WidgetSkeleton />)   │
│                             │                                          │
│                             ▼                                          │
│ 3. StreamableValue Progresif ──► 4. RSC Interaktif Terhidrasi Penuh    │
│                                  │                                     │
│                                  ▼                                     │
│ 5. Interaksi User (Klik/Slider) ──► 6. Umpan Balik Server Action       │
│                                  │                                     │
│                                  ▼                                     │
│                              7. Giliran Penalaran LLM Berikutnya       │
└────────────────────────────────────────────────────────────────────────┘
```

#### 1. Streaming RSC Progresif Server-Side (`createStreamableUI` + React 19)
Server mencegat eksekusi alat LLM dan langsung memancarkan skeleton optimistik ke klien. Selama data diselesaikan secara paralel, nilai streamable memompa angka secara langsung, dan berakhir pada komponen interaktif yang utuh.

#### 2. Dispatcher Pemanggilan Alat Sisi Klien (`useChat` + `toolInvocations`)
Untuk aplikasi berskala tinggi pada edge node, pemanggilan alat LLM memancarkan payload JSON terstruktur melalui data stream standar (`createDataStreamResponse`). Router klien menyelesaikan komponen dari registri bertipe secara dinamis.

#### 3. Orkestrasi Tata Letak Multi-Slot Dinamis (Mesin Layout AI)
Alih-alih men-streaming satu kartu terisolasi, LLM memancarkan manifes tata letak (`LayoutManifest`: *split-master*, *masonry-grid*, *dashboard-3col*) dan men-streaming beberapa widget secara bersamaan ke slot yang ditentukan (`headerSlot`, `primarySlot`, `secondarySlot`, `actionSlot`).

#### 4. Loop Aksi Umpan Balik Tertutup (Closed-Loop Feedback)
Komponen efemeral tidak bersifat *read-only*. Mengklik opsi atau menggeser nilai memicu Server Action React 19 bertipe yang memperbarui state percakapan dan memicu kembali pipeline agen tanpa kehilangan konteks aliran.

#### 5. Adaptasi Afektif & Kognitif
Terkoneksi dengan `affective-computing-emotion-ai`. Jika `AffectVector` pengguna mendeteksi kebingungan atau stres tinggi, mesin antarmuka menyederhanakan kepadatan visual:
- Beralih dari multi-tab kompleks ke kartu fokus keputusan metrik tunggal.
- Memperbesar ukuran teks dan target sentuh tombol.
- Menonaktifkan animasi transisi agar tata letak tampil instan dan jernih.

---

### Kontrak Hierarki Visual Anti-Slop pada UI Efemeral
Seluruh komponen efemeral wajib mematuhi **Pilar 7 Anti-Slop**:
1. **Pembatasan Kontainer Permukaan**: Bungkus widget dalam wadah Level 1 dengan border 1px yang tegas:
   `bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl shadow-xs overflow-hidden`.
2. **Skala Radius 3-Tingkat**:
   - `rounded-lg` (8px) untuk tombol, input, dan badge.
   - `rounded-xl` (12px) untuk permukaan kartu dan panel widget.
   - `rounded-2xl` (16px) untuk wadah modal dan sheet generatif utama.
3. **Irama Tipografi Baku**:
   - Eyebrow Kategori: `text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400`.
   - Judul Utama: `text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100`.
   - Nilai Metrik & Saldo: `font-mono text-xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 tabular-nums`.
   - Teks Pendukung: `text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed`.
4. **Kontrak 5-State Interaktif Wajib**:
   - Setiap elemen interaktif wajib menangani: `idle`, `hover`, `active`, `focus-visible`, dan `disabled`/`loading`.
5. **Aksesibilitas & Pembaca Layar**:
   - Bungkus slot streaming dengan atribut `role="region"` dan `aria-live="polite"`.
   - Gunakan `aria-busy="true"` selama fase streaming, dan ubah ke `false` setelah hidrasi selesai.
6. **Larangan Slop Visual**:
   - Dilarang keras menggunakan gradien ungu-biru generik AI.
   - Dilarang menampilkan orb neon blur di belakang kartu.
   - Dilarang memakai tombol pil (`rounded-full`) pada tata letak kartu persegi panjang standar.

---

### Verifikasi, Latensi & Keamanan
- **TTFS (Waktu ke Skeleton Pertama)**: Maksimal **100ms** sejak token pembuka pemanggilan alat dipancarkan.
- **Target Hidrasi**: Maksimal **450ms** sejak aliran stream tuntas hingga komponen siap berinteraksi.
- **Sanitasi Input**: Seluruh argumen dari LLM WAJIB divalidasi dengan skema Zod sebelum diteruskan ke komponen klien guna menangkal injeksi prompt tidak langsung (`prompt-injection-firewall`).
- **Kebersihan Memori**: Komponen efemeral wajib membersihkan *event listener* atau langganan aktif saat dicopot dari DOM.
- **Fallback Ketersediaan Model**: Jika men-streaming manifes UI terstruktur melalui Gemini 4 atau Claude Opus 5.5, alihkan secara otomatis ke Gemini 3.8 Flash dan Claude Opus 4.6 untuk mempertahankan TTFS <100ms.
