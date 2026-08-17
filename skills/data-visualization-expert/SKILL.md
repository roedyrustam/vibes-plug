---
name: data-visualization-expert
description: "Expert guide for data visualization, charts, and dashboards using D3.js, Recharts, Chart.js, Nivo, and Tremor / Panduan ahli visualisasi data, chart, dan dashboard menggunakan D3.js, Recharts, Chart.js, Nivo, dan Tremor."
author: "vibes-plug-swarm"
---

# Data Visualization Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **`senior-frontend`**: React component architecture for chart components.
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
        <Line type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2} dot={false} />
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

### Dashboard Layout Patterns
- **KPI Row → Charts → Tables**: Top metrics cards, then charts, then detail tables.
- **Filter Sidebar**: Global date range, category, and dimension filters.
- **Drill-down**: Click chart segment → navigate to detail view.
- **Export**: CSV/PNG/PDF export for all charts.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **`senior-frontend`**: Arsitektur komponen React untuk komponen chart.
- **`data-telemetry-expert`**: Pipeline data analitik yang mengisi visualisasi.
- **`state-management-expert`**: Mengelola state chart, filter, dan navigasi drill-down.

### Deskripsi
Panduan ahli untuk membangun visualisasi data dan dashboard analitik berkualitas produksi. Mencakup D3.js v7, Recharts, Chart.js 4, Nivo, Tremor, dan Apache ECharts. Termasuk chart responsif, update real-time, aksesibilitas, optimasi dataset besar, dan pola layout dashboard.

### Kondisi Pemicu
- Membangun dashboard analitik atau panel admin dengan chart.
- Membuat visualisasi data (line, bar, pie, scatter, heatmap, treemap).
- Mengimplementasikan chart yang update real-time atau feed data langsung.
- Memilih library charting untuk React, Vue, atau vanilla JS.
