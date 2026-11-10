---
name: data-visualization-expert
description: "Data visualization dashboards using D3.js, Recharts, and Tremor / Visualisasi data, grafik, dan dashboard dengan D3.js dan Recharts."
author: "Roedy Rustam"
version: "4.7.0"

---

# Data Visualization Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **`ui-ux-pro-max`**: Design system charts domain guidance, color role palettes, and accessible legend contrast.
- **`design-system-architect`**: Establishes OKLCH semantic tokens (`--color-surface-card`, `--color-border`) and tabular numerals (`tabular-nums`).
- **`anti-slop`**: Enforces authentic verified metric data (R-17), zero-hallucinated statistics, and clean 1px card borders.
- **`senior-frontend`**: React component architecture for chart components and SSR hydration.
- **`web-3d-graphics-expert`**: 3D spatial data visualization, WebGPU/Three.js scientific models, anatomical explainers, and 3Dviz spatial reasoning.
- **`data-telemetry-expert`**: Analytics data pipelines feeding visualizations.
- **`state-management-expert`**: Managing chart state, filters, and drill-down navigation.
- **`performance-web-vitals`**: Optimizing chart rendering performance with large datasets.
- **`sse-websocket-streaming-expert`**: Real-time data feeds for live dashboards.
- **Cross-Domain Synergy & Subagent Swarm Integration**: `olap-columnar-analytics-expert`, `data-pipeline-etl-expert`

### Description
Expert guide for building production-quality data visualizations and analytics dashboards. Covers D3.js v7 (low-level SVG/Canvas), Recharts (React-native charts), Chart.js 4 (lightweight canvas), Nivo (D3-powered React components), Tremor (dashboard components), and Apache ECharts. Includes responsive charts, real-time updates, accessibility, large dataset optimization, and dashboard layout patterns.

### Trigger Conditions
- Building analytics dashboards or admin panels with charts.
- Creating data visualizations (line, bar, pie, scatter, heatmap, treemap).
- Implementing real-time updating charts or live data feeds.
- Choosing a charting library for React, Vue, or vanilla JS.
- Optimizing chart performance with large datasets (10K+ data points).

---

### Library Selection Guide

| Library | Framework | Rendering | Customization | Learning Curve | Best For |
|---------|-----------|-----------|---------------|----------------|----------|
| D3.js v7 | Agnostic | SVG/Canvas | ★★★★★ | High | Custom visualizations |
| Recharts | React | SVG | ★★★★ | Low | Standard React charts |
| Nivo | React | SVG/Canvas | ★★★★★ | Medium | Beautiful, animated charts |
| Tremor | React | SVG (Recharts) | ★★★ | Very Low | Dashboards, KPI cards |
| Chart.js 4 | Agnostic | Canvas | ★★★ | Low | Lightweight, simple charts |
| ECharts | Agnostic | Canvas/SVG | ★★★★★ | Medium | Complex, interactive, large data |

**Recommendation:** Use **Tremor** for rapid dashboard prototyping. Use **Recharts** for standard React charts. Use **D3.js** only for highly custom visualizations.

### Core Patterns

#### 1. Recharts (React Standard)

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function RevenueChart({ data }: { data: { date: string; revenue: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="date" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
        <Tooltip
          contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: 8 }}
          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
        />
        <Line type="monotone" dataKey="revenue" stroke="#0284c7" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

#### 2. Tremor Dashboard Components

```tsx
import { Card, Metric, Text, AreaChart, BarList, Grid } from '@tremor/react';

function AnalyticsDashboard({ metrics, chartData, topPages }) {
  return (
    <Grid numItemsMd={2} numItemsLg={3} className="gap-6">
      <Card>
        <Text>Total Revenue</Text>
        <Metric>$845,230</Metric>
      </Card>
      <Card>
        <Text>Revenue Over Time</Text>
        <AreaChart
          data={chartData}
          index="month"
          categories={['Revenue', 'Expenses']}
          colors={['violet', 'rose']}
          valueFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
        />
      </Card>
      <Card>
        <Text>Top Pages</Text>
        <BarList data={topPages} className="mt-4" />
      </Card>
    </Grid>
  );
}
```

#### 3. Real-Time Chart Updates

```tsx
import { useEffect, useState } from 'react';

function LiveMetricsChart() {
  const [data, setData] = useState<{ time: string; value: number }[]>([]);

  useEffect(() => {
    const es = new EventSource('/api/metrics/stream');
    es.onmessage = (event) => {
      const point = JSON.parse(event.data);
      setData((prev) => [...prev.slice(-60), point]); // Keep last 60 points
    };
    return () => es.close();
  }, []);

  return <LineChart data={data} /* ... */ />;
}
```

#### 4. Large Dataset Optimization
- Use **Canvas** rendering (ECharts, Chart.js) for >5K data points.
- Implement **data aggregation** on the server (downsample to 500-1000 points for display).
- Use **windowed rendering** — only render visible data points.
- Apply **debounced zoom/pan** to prevent excessive re-renders.

#### 5. 3D Spatial Visualization & Scientific Grounded Truth
For volumetric, anatomical, geospatial, or scientific datasets, escalate to `web-3d-graphics-expert`:
- **Grounded Truth Protocol**: Verify the chain: **Scientific Claim → Mathematical Model → Rendered Result**. An aesthetic 3D mesh does not certify a scientific claim.
- **Explicit Units & Scale**: Never leave scale ambiguous; render interactive 3D scale bars or known spatial benchmarks.
- **Truthful Controls**: Sliders and toggle states must alter physical parameters in the model, not just trigger decorative visual noise.

#### 6. Interactive Isometric Technical Explainers & Machine Anatomy (The Anatomy Protocol)
When explaining technical concepts, systems, protocols, or algorithms (e.g. rate limiters, cache eviction, concurrency locks, GPU pipelines, or distributed sync), reject generic flowchart boxes and arrows. Enforce the **Physical Isometric Anatomy Protocol** ("The Object Is The Explanation"): invent a physical, tangible, highly crafted mechanical instrument whose physical operation *is* the computational concept.

##### The Concept-to-Object Mapping Matrix
| Technical Concept | Physical Mechanical Metaphor | Working Parts & Motion |
|---|---|---|
| **Token-Bucket Rate Limiter** | Brass-and-Glass Fluid Test Rig | Float valve reservoir, calibrated needle valve orifice, spring plunger |
| **Cache Key / Memoization** | Pin-Tumbler Mechanical Lock | Cylinder plug rotates only when every tumbler pin aligns with hash teeth |
| **Shared GPU Context Multiplexer** | Gantry Plotter with Traveling Toolhead | Single motorized print head visiting multiple ink wells along dual rails |
| **Separable Convolution Filter** | Dual-Axis Orthogonal Comb Stamping Rig | Bed-of-nails stamp array pairing with two directional sliding comb blades |
| **Reactive Sync / Event Ledger** | Multi-Cam Mechanical Engine Shaft | Profiled eccentric cams actuating spring rocker arms and contact points |

##### 5 Craft Commandments for Isometric Anatomy Figures
1. **Solids, Not Wireframes (Four-Tone Shading)**:
   - Use standard 30° elevation isometric projection (azimuth 45° default, 35–60° for elongated bodies).
   - Solid opaque parts painted back-to-front, bottom-to-top (strict painter's order).
   - Four-tone lighting: `lo` (undersides, feet, dark recesses), `mid` (vertical structural posts, side panels), `hi` (top horizontal faces, front bezels), and exactly ONE `lit` focal accent (white in dark theme, pure black in light theme) highlighting the moving needle, contact pin, or active valve.
2. **The 40+ Parts Rule**:
   - Every figure must feature at least 40 physical, purposeful parts divided into 5 groups: **Base** (bedplate, leveling feet, corner cap screws, engraved label plate, etched tick ruler), **Structure** (linear rails, upright columns, collar stops, tie rods), **Mechanism** (carriage, bushings, coil springs, rack-and-pinion, dial gauge), **Controls** (knurled knob, thumb screws, toggle lever), and **Subject** (the lit, moving core).
3. **The "Lines Resolve" Invariant**:
   - Every stroke, seam, ruler tick, and wire must terminate on another line, an outline, or a terminal solder/screw dot. Floating leader lines and unanchored text labels are strictly banned.
4. **The Framed Card Contract**:
   - Enclose the instrument within an elevated card: `Fig n` (top left, monospace), short Title (top right, bold), Interaction Hint (bottom left, muted), and Live Readout with tabular numerals (`tabular-nums`) tracking the numerical state (bottom right).
5. **Calm Eased Motion & Hybrid WebGL Layers**:
   - Parts move via damped harmonic oscillator springs or exponential follow; idle tour loops when untouched; respect `prefers-reduced-motion`.
   - Complex phenomena that vector strokes cannot cleanly express (flowing fluid, fire, exhaust, caustics, lamp glow) use an integrated WebGL canvas sandwiched between a Back SVG and Front SVG in the exact same isometric world-space camera.

```tsx
import React, { useState, useEffect, useRef } from 'react';

// Precision isometric projection helper in world space coordinates
function projectIso(x: number, y: number, z: number, originX = 260, originY = 220) {
  const rad = Math.PI / 6; // 30-degree isometric tilt
  const screenX = originX + (x - y) * Math.cos(rad);
  const screenY = originY + (x + y) * Math.sin(rad) - z;
  return { x: screenX, y: screenY };
}

export function IsometricTokenBucketRig() {
  const [tokens, setTokens] = useState(65);
  const [dripRate, setDripRate] = useState(12);
  const [needleAngle, setNeedleAngle] = useState(65);
  const requestRef = useRef<number>(0);

  // Smoothly damp the analog needle towards the target fill level
  useEffect(() => {
    let current = needleAngle;
    const animate = () => {
      current += (tokens - current) * 0.12;
      setNeedleAngle(current);
      if (Math.abs(tokens - current) > 0.1) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [tokens]);

  // Projected coordinates for the 4-tier isometric chassis
  const b1 = projectIso(-90, -50, 0);
  const b2 = projectIso(90, -50, 0);
  const b3 = projectIso(90, 50, 0);
  const b4 = projectIso(-90, 50, 0);

  // Plunger height directly driven by bucket token capacity
  const plungerZ = 30 + (needleAngle / 100) * 55;
  const pTop = projectIso(0, 0, plungerZ + 20);
  const pBase = projectIso(0, 0, plungerZ);

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-[#090c15] border border-white/10 p-5 shadow-2xl text-slate-200 select-none">
      {/* Framed Card Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <span className="font-mono text-xs tracking-wider text-cyan-400 font-bold uppercase">FIG 01 // INSTRUMENT</span>
        <h4 className="text-sm font-semibold text-white">Token Bucket Physical Rate Limiter</h4>
      </div>

      {/* Isometric SVG Instrument Bench */}
      <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-slate-950 to-[#07090e] rounded-xl border border-white/5 overflow-hidden flex items-center justify-center">
        <svg viewBox="0 0 520 380" className="w-full h-full">
          {/* Base Plate Shadow */}
          <polygon
            points={`${b1.x},${b1.y + 12} ${b2.x},${b2.y + 12} ${b3.x},${b3.y + 12} ${b4.x},${b4.y + 12}`}
            fill="rgba(0,0,0,0.6)"
            filter="blur(6px)"
          />

          {/* Heavy Machined Base Plate (Four-Tone Solid Shading) */}
          <polygon points={`${b1.x},${b1.y + 8} ${b2.x},${b2.y + 8} ${b2.x},${b2.y} ${b1.x},${b1.y}`} fill="#0f172a" />
          <polygon points={`${b2.x},${b2.y + 8} ${b3.x},${b3.y + 8} ${b3.x},${b3.y} ${b2.x},${b2.y}`} fill="#1e293b" />
          <polygon points={`${b1.x},${b1.y} ${b2.x},${b2.y} ${b3.x},${b3.y} ${b4.x},${b4.y}`} fill="#334155" />

          {/* Precision Ruler Ticks along the front edge */}
          {[-70, -50, -30, -10, 10, 30, 50, 70].map((tx, idx) => {
            const p1 = projectIso(tx, 50, 0);
            const p2 = projectIso(tx, 46, 0);
            return <line key={idx} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#64748b" strokeWidth="1" />;
          })}

          {/* Upright Guide Rail Columns */}
          {[-60, 60].map((cx, idx) => {
            const basePos = projectIso(cx, 0, 0);
            const topPos = projectIso(cx, 0, 120);
            return (
              <g key={idx}>
                <line x1={basePos.x} y1={basePos.y} x2={topPos.x} y2={topPos.y} stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                <circle cx={basePos.x} cy={basePos.y} r="3" fill="#475569" />
                <circle cx={topPos.x} cy={topPos.y} r="3.5" fill="#cbd5e1" />
              </g>
            );
          })}

          {/* Glass Cylinder Reservoir Body */}
          <g>
            {/* Cylinder Back Wall and Liquid Volume */}
            <rect x="225" y={300 - (needleAngle * 1.1)} width="70" height={needleAngle * 1.1} rx="4" fill="rgba(6,182,212,0.22)" />
            <line x1="225" y1="180" x2="225" y2="300" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 2" />
            <line x1="295" y1="180" x2="295" y2="300" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 2" />
          </g>

          {/* Moving Spring Plunger (Lit Focal Assembly) */}
          <line x1={pTop.x} y1={pTop.y} x2={pBase.x} y2={pBase.y} stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
          <polygon
            points={`${pBase.x - 18},${pBase.y - 4} ${pBase.x + 18},${pBase.y - 4} ${pBase.x + 18},${pBase.y + 4} ${pBase.x - 18},${pBase.y + 4}`}
            fill="#38bdf8"
          />

          {/* Analog Dial Gauge with Moving Indicator Needle */}
          <g transform="translate(140, 170)">
            <circle cx="0" cy="0" r="28" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="24" fill="#020617" stroke="#334155" strokeWidth="1" />
            {/* Dial Calibration Marks */}
            {[-120, -60, 0, 60, 120].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <line
                  key={deg}
                  x1={Math.cos(rad) * 16}
                  y1={Math.sin(rad) * 16}
                  x2={Math.cos(rad) * 22}
                  y2={Math.sin(rad) * 22}
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                />
              );
            })}
            {/* Indicator Needle pivoting from center */}
            <line
              x1="0"
              y1="0"
              x2={Math.cos(((needleAngle * 2.4 - 120) * Math.PI) / 180) * 20}
              y2={Math.sin(((needleAngle * 2.4 - 120) * Math.PI) / 180) * 20}
              stroke="#06b6d4"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="0" cy="0" r="3" fill="#ffffff" />
          </g>
        </svg>

        {/* Tactical Corner Legend */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 font-mono text-[10px] text-slate-400 bg-slate-900/80 p-2 rounded border border-white/5">
          <div>SCALE: 1:1 ISO [30°]</div>
          <div>STATUS: COMPLIANT</div>
          <div>FLOW: UNIFORM</div>
        </div>
      </div>

      {/* Card Controls & Live Numerical Readouts */}
      <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <label htmlFor="token-slider" className="text-slate-400">BURST CAPACITY:</label>
          <input
            id="token-slider"
            type="range"
            min="5"
            max="100"
            value={tokens}
            onChange={(e) => setTokens(Number(e.target.value))}
            className="w-28 accent-cyan-400 cursor-pointer"
          />
        </div>

        {/* Live Readout Contract tracking the physical model */}
        <div className="flex items-center gap-4 tabular-nums">
          <span className="text-slate-400">TOKENS: <strong className="text-white">{tokens}</strong></span>
          <span className="text-slate-400">PRESSURE: <strong className="text-cyan-400">{(needleAngle * 0.42).toFixed(1)} PSI</strong></span>
          <span className="text-slate-400">LEAK: <strong className="text-emerald-400">{dripRate} req/s</strong></span>
        </div>
      </div>
    </div>
  );
}
```

### Dashboard Layout Patterns
- **KPI Row → Charts → Tables**: Top metrics cards, then charts, then detail tables.
- **Filter Sidebar**: Global date range, category, and dimension filters.
- **Drill-down**: Click chart segment → navigate to detail view.
- **Export**: CSV/PNG/PDF export for all charts.

### Hard Guardrails (Declarative Invariants)
1. **Mandatory Tabular Numerals on Numerical Displays**:
   - All chart tooltips, axis tick labels, KPI counters, and live readouts MUST apply `tabular-nums` font formatting to prevent layout shift and jitter during real-time data streaming.
2. **Fluid Responsive Scaling Without Fixed Pixel Overflows**:
   - Chart wrappers MUST utilize fluid layout containers (`ResponsiveContainer width="100%"` or SVG `viewBox`) with aspect-ratio preservation. Hardcoded fixed pixel widths (`width={1200}`) causing mobile overflow are strictly prohibited.
3. **Canvas / WebGL Engine Fallback for Large Datasets**:
   - Datasets exceeding 5,000 data points MUST NOT render individual SVG DOM nodes. Rendering pipelines MUST downsample via algorithms (e.g. LTTB) or switch to Canvas/WebGL (ECharts, Chart.js, Three.js) to guarantee 60fps responsiveness.
4. **Accessible ARIA Descriptions & Data Table Fallbacks**:
   - Visual charts MUST include descriptive `aria-label` tags and offer an accessible textual summary or hidden data table fallback compliant with WCAG 2.2 AA standards.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Muse Wonder High`, `Composer 2.5 Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec data-visualization-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_visual_audit`, `vibes_ast_query`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | LCP < 1.8s, INP < 100ms, CLS < 0.05, 1px crisp borders, 3-tier radius (6px/8px/12px), `tabular-nums`, 5-state interactive contract; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **`ui-ux-pro-max`**: Pedoman domain visualisasi data sistem desain, palet warna berorientasi peran, dan kontras legenda aksesibel.
- **`design-system-architect`**: Menetapkan token semantik OKLCH (`--color-surface-card`, `--color-border`) dan angka tabular (`tabular-nums`).
- **`anti-slop`**: Menegakkan keaslian data metrik terverifikasi (R-17), nol halusinasi statistik, dan border kartu 1px yang tajam.
- **`senior-frontend`**: Arsitektur komponen React untuk komponen chart dan layout dashboard responsif.
- **`web-3d-graphics-expert`**: Visualisasi data spasial 3D, model ilmiah WebGPU/Three.js, explainer anatomi, dan penalaran spasial 3Dviz.
- **`data-telemetry-expert`**: Pipeline data analitik yang mengisi visualisasi real-time.
- **`state-management-expert`**: Mengelola state filter global, parameter rentang tanggal, dan navigasi drill-down.
- **`performance-web-vitals`**: Optimasi komputasi grafis untuk dataset besar (>10.000 titik data).
- **`sse-websocket-streaming-expert`**: Feed data real-time untuk dashboard telemetri langsung.
- **Sinergi Lintas Domain & Integrasi Swarm Subagent**: `olap-columnar-analytics-expert`, `data-pipeline-etl-expert`

### Deskripsi
Panduan ahli untuk membangun visualisasi data dan dashboard analitik berkualitas produksi. Mencakup D3.js v7 (manipulasi SVG/Canvas tingkat rendah), Recharts (grafik native React), Chart.js 4 (canvas ringan), Nivo (komponen animasi berbasis D3), Tremor (kartu KPI dan visualisasi analitik SaaS), dan Apache ECharts. Menyediakan panduan chart responsif, pembaruan real-time, aksesibilitas WCAG, optimasi dataset besar, dan pola tata letak dashboard.

### Kondisi Pemicu
- Membangun dashboard analitik, admin panel, atau portal metrik finansial.
- Membuat visualisasi data kompleks (garis tren, batang, scatter plot, heatmap, treemap).
- Mengimplementasikan chart yang diperbarui secara langsung via WebSocket atau SSE.
- Mengoptimalkan performa visualisasi saat menangani lebih dari 10.000 titik data.

---

### Panduan Pemilihan Library Visualisasi

| Library | Lingkungan | Mesin Render | Kustomisasi | Tingkat Kesulitan | Kasus Penggunaan Terbaik |
|---|---|---|---|---|---|
| **D3.js v7** | Agnostik | SVG/Canvas | ★★★★★ | Tinggi | Visualisasi ilmiah & kustom tingkat lanjut |
| **Recharts** | React | SVG | ★★★★ | Rendah | Grafik standar web app dan SaaS |
| **Nivo** | React | SVG/Canvas | ★★★★★ | Sedang | Grafik artistik dengan animasi interaktif |
| **Tremor** | React | SVG (Recharts) | ★★★ | Sangat Rendah | Dashboard MVP cepat, kartu KPI modern |
| **Chart.js 4** | Agnostik | Canvas | ★★★ | Rendah | Grafik sederhana dan efisien |
| **ECharts** | Agnostik | Canvas/SVG | ★★★★★ | Sedang | Grafik kompleks skala masif & data finansial |

---

### Pola Kunci Implementasi (TypeScript/React)

#### 1. Recharts Standar Dashboard Produksi
```tsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  tanggal: string;
  pendapatan: number;
}

export function GrafikPendapatan({ data }: { data: DataPoint[] }) {
  return (
    <div className="w-full h-80 bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Tren Pendapatan Bulanan</h3>
        <span className="text-xs text-slate-500 tabular-nums">Performa 30 Hari</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis dataKey="tanggal" stroke="#64748b" tick={{ fontSize: 12 }} />
          <YAxis
            stroke="#64748b"
            tick={{ fontSize: 12 }}
            tickFormatter={(val: number) => `Rp ${(val / 1000000).toFixed(0)}jt`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#1e293b',
              borderRadius: '6px',
              color: '#f8fafc',
            }}
            formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Pendapatan']}
          />
          <Line
            type="monotone"
            dataKey="pendapatan"
            stroke="#0284c7"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, stroke: '#0284c7', strokeWidth: 2, fill: '#0f172a' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

#### 2. Update Data Real-Time via Server-Sent Events (SSE)
```tsx
import { useEffect, useState } from 'react';

export function GrafikMetrikRealtime() {
  const [dataPoints, setDataPoints] = useState<{ waktu: string; nilai: number }[]>([]);

  useEffect(() => {
    const eventSource = new EventSource('/api/metrik/stream');

    eventSource.onmessage = (event) => {
      const dataBaru = JSON.parse(event.data);
      setDataPoints((riwayat) => {
        // Pertahankan maksimal 60 titik data terakhir untuk efisiensi render
        const buffer = [...riwayat, dataBaru];
        return buffer.length > 60 ? buffer.slice(buffer.length - 60) : buffer;
      });
    };

    eventSource.onerror = (err) => {
      console.error('Koneksi stream metrik terputus:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="p-4 border border-slate-200 dark:border-slate-800 rounded">
      <div className="text-xs text-emerald-600 font-semibold mb-2 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Telemetry
      </div>
      {/* Komponen LineChart mengonsumsi dataPoints */}
    </div>
  );
}
```

#### 3. Optimasi Dataset Skala Masif (>10.000 Titik Data)
1. **Pilih Canvas atau WebGL**: Hindari SVG untuk dataset >5.000 elemen guna mencegah kelebihan DOM node. Gunakan Chart.js (Canvas) atau Apache ECharts.
2. **Server-Side Downsampling**: Lakukan reduksi titik data di server menggunakan algoritma Largest-Triangle-Three-Buckets (LTTB) sebelum dikirim ke browser.
3. **Windowed / Virtualized Range**: Hanya gambar data yang berada dalam rentang zoom yang aktif saat ini.

#### 4. Visualisasi Spasial 3D & Grounded Truth
Untuk dataset ilmiah, geospasial, atau volumetrik, delegasikan ke `web-3d-graphics-expert`:
- **Rantai Validasi Ilmiah**: Wajib mematuhi rantai: **Klaim Ilmiah → Model Matematika → Hasil Render**. Jangan tampilkan visualisasi acak tanpa data acuan numerik.
- **Skala dan Unit Eksplisit**: Sertakan skala interaktif dan satuan metrik yang jelas pada canvas.

#### 5. Penjelasan Teknis Isometrik Interaktif & Anatomi Mesin Fisik (Protokol Anatomi)
Saat menjelaskan konsep komputasi abstrak, logika sistem, protokol jaringan, atau algoritma (seperti *rate limiter*, *cache eviction*, *concurrency lock*, *GPU pipeline*, atau sinkronisasi terdistribusi), tinggalkan diagram kotak-kotak dan panah klise. Terapkan **Protokol Anatomi Isometrik Fisik** (*"The Object Is The Explanation"*): rancang instrumen mekanis nyata berpresisi tinggi yang cara kerja fisiknya mencerminkan langsung konsep komputasi yang dijelaskan.

##### Matriks Pemetaan Konsep ke Objek Mekanis Fisik
| Konsep Teknis | Metafora Mesin Mekanis Fisik | Komponen Nyata & Pergerakan |
|---|---|---|
| **Token-Bucket Rate Limiter** | Rig Uji Fluida Kaca & Kuningan | Tangki pelampung, katup jarum kalibrasi presisi, plunger pegas linier |
| **Kunci Cache / Memoization** | Gembok Mekanis Pin-Tumbler | Silinder hanya berputar saat seluruh pin sejajar dengan gerigi hash |
| **Multiplexer GPU Shared Context** | Plotter Gantry dengan Toolhead Bergerak | Satu print-head bermotor mengunjungi 16 sumur tinta di sepanjang rel ganda |
| **Filter Konvolusi Terpisahkan (Separable Blur)** | Rig Stamping Sisir Ortoganal Sumbu Ganda | Matriks jarum bed-of-nails dipadukan dengan dua bilah sisir bergeser silang |
| **Event Ledger / Reactive Sync** | Poros Cam Mesin Multiselinder | Cam eksentrik menggerakkan rocker arm pegas dan sakelar kontak mikro |

##### 5 Kaidah Utama Figur Anatomi Isometrik
1. **Bagian Solid, Bukan Wireframe (Shading Empat Nada)**:
   - Gunakan proyeksi isometrik elevasi 30° (azimuth 45° default, 35–60° untuk objek memanjang).
   - Seluruh komponen solid tanpa garis putus-putus transparan, digambar berurutan dari belakang ke depan (*painter's order*).
   - Shading empat nada: `lo` (bagian bawah, kaki, rongga gelap), `mid` (tiang struktur vertikal, panel samping), `hi` (permukaan horizontal atas, bingkai depan), dan tepat SATU aksen fokus `lit` (putih pada tema gelap, hitam pekat pada tema terang) yang menyorot jarum bergerak atau pin aktif.
2. **Kaidah Minimal 40+ Komponen Nyata**:
   - Setiap figur wajib memiliki minimal 40 komponen fisik terstruktur dalam 5 kelompok: **Alas / Base** (pelat dasar berat, kaki sekrup berulir, sekrup sudut, pelat label grafir, strip penggaris ukur), **Struktur** (tiang pemandu linier, batang rangka, cincin penahan), **Mekanisme** (kereta geser, bushing perunggu, pegas koil, dial gauge), **Kontrol** (kenop berulir knurled, sekrup jari, tuas sakelar), dan **Subjek Utama** (komponen bergerak yang disorot).
3. **Invarian "Lines Resolve"**:
   - Setiap goresan garis, alur, pembagi penggaris, dan kawat kabel wajib berakhir pada garis lain, tepi benda, atau titik terminal sekrup. Dilarang menggambar garis panah mengambang di udara tanpa tumpuan.
4. **Kontrak Kartu Berbingkai (Framed Card)**:
   - Letakkan instrumen dalam kartu terangkat: `Fig n` (kiri atas, font mono), Judul singkat (kanan atas, tebal), Petunjuk interaksi (kiri bawah, redup), dan Tampilan Bacaan Langsung (*Live Readout*) dengan angka tabular (`tabular-nums`) yang mencerminkan model numerik asli secara real-time (kanan bawah).
5. **Gerakan Pegas Halus & Layer WebGL Hibrida**:
   - Pergerakan menggunakan fisika pegas teredam (*damped harmonic oscillator*) atau *exponential follow*; sertakan tur diam (*idle tour*) otomatis saat tidak disentuh kursor, serta nonaktifkan animasi saat pengguna mengaktifkan `prefers-reduced-motion`.
   - Fenomena dinamis yang tidak dapat digambar rapi dengan vektor (aliran cairan, api, uap, pendaran lampu) menggunakan canvas WebGL yang disisipkan di antara Back SVG dan Front SVG dalam kamera isometrik *world-space* yang persis sama.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Muse Wonder High`, `Composer 2.5 Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec data-visualization-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_visual_audit`, `vibes_ast_query`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | LCP < 1.8s, INP < 100ms, CLS < 0.05, border tegas 1px, radius 3-tier (6px/8px/12px), `tabular-nums`, kontrak interaktif 5-state; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
