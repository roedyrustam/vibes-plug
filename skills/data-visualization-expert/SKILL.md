---
name: data-visualization-expert
description: "Data visualization dashboards using D3.js, Recharts, and Tremor / Visualisasi data, grafik, dan dashboard dengan D3.js dan Recharts."
author: "Roedy Rustam"
version: "4.4.4"

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

### Dashboard Layout Patterns
- **KPI Row → Charts → Tables**: Top metrics cards, then charts, then detail tables.
- **Filter Sidebar**: Global date range, category, and dimension filters.
- **Drill-down**: Click chart segment → navigate to detail view.
- **Export**: CSV/PNG/PDF export for all charts.

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

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Muse Wonder High`, `Composer 2.5 Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec data-visualization-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_visual_audit`, `vibes_ast_query`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | LCP < 1.8s, INP < 100ms, CLS < 0.05, border tegas 1px, radius 3-tier (6px/8px/12px), `tabular-nums`, kontrak interaktif 5-state; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
