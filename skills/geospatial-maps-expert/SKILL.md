---
name: geospatial-maps-expert
description: "Maps and geospatial data: Mapbox GL JS, Leaflet, and PostGIS / Peta dan data geospasial: Mapbox GL JS, Leaflet, dan PostGIS."
author: "Roedy Rustam"
version: "4.4.2"

---

# Geospatial & Maps Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Expert guide for integrating interactive mapping engines, geospatial vector tiles, and spatial database queries into modern web and mobile applications. Covers MapLibre GL JS (open-source, license-free), Mapbox GL JS v3, Leaflet, Google Maps Platform, deck.gl large-scale visualization, Supercluster client-side marker aggregation, and PostgreSQL/PostGIS spatial query optimization.

### Trigger Conditions
- Embedding interactive vector maps into React, Next.js, or mobile applications.
- Implementing location-based search (*"Find outlets within 5 km"*).
- Managing thousands of map markers with client-side clustering.
- Writing spatial SQL queries using PostGIS (`ST_DWithin`, `ST_MakePoint`, `ST_Distance`).
- Visualizing geospatial GeoJSON datasets, routes, and heatmaps.

### PostGIS Spatial Query Pattern (PostgreSQL)

```sql
-- Enable PostGIS extension and configure geometry table
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS merchant_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  address TEXT,
  geom GEOMETRY(Point, 4326) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crucial: GIST Spatial Index for sub-millisecond radius search
CREATE INDEX IF NOT EXISTS idx_merchant_geom ON merchant_locations USING GIST (geom);

-- Find nearest merchants within 5,000 meters (5 km) of user's coordinates
-- Note: Cast to GEOGRAPHY to calculate true geodesic distance in meters
SELECT 
  id, 
  name, 
  address,
  ST_Y(geom::geometry) AS latitude,
  ST_X(geom::geometry) AS longitude,
  ROUND(ST_Distance(geom::geography, ST_SetSRID(ST_MakePoint(:userLng, :userLat), 4326)::geography)::numeric, 1) AS distance_meters
FROM merchant_locations
WHERE ST_DWithin(geom::geography, ST_SetSRID(ST_MakePoint(:userLng, :userLat), 4326)::geography, 5000)
ORDER BY distance_meters ASC
LIMIT 20;
```

### High-Performance React Map Component (MapLibre GL JS)

```tsx
// src/components/maps/StoreLocatorMap.tsx
'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface StorePoint {
  id: string;
  name: string;
  lng: number;
  lat: number;
}

export function StoreLocatorMap({ stores }: { stores: StorePoint[] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/liberty', // Free open-source vector tiles
      center: [106.8456, -6.2088], // Jakarta default
      zoom: 12,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.on('load', () => {
      // Add GeoJSON source with built-in Supercluster support
      map.addSource('stores', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: stores.map((s) => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [s.lng, s.lat] },
            properties: { id: s.id, name: s.name },
          })),
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      // Cluster circle layer
      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'stores',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#059669',
          'circle-radius': ['step', ['get', 'point_count'], 18, 10, 24, 50, 30],
        },
      });

      // Unclustered point marker
      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'stores',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#2563eb',
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });
    });

    mapRef.current = map;
    return () => map.remove();
  }, [stores]);

  return <div ref={mapContainer} className="h-[500px] w-full rounded-xl border border-slate-200 overflow-hidden" />;
}
```

## Orchestration & Integration
- **`modern-web-guidance`**: Modern Web APIs, canvas performance, and responsive map containers.
- **`design-system-architect`**: Map controls, custom HTML pin markers, popover callouts, and location search inputs.
- **`tailwind-expert`**: Map container overlays, HUD widgets, and sliding panel drawer styling.
- **`ui-ux-pro-max`**: Map viewport ergonomics, smooth fly-to easing, and location pin micro-interactions.
- **`visual-ui-auditor`**: Multimodal vision auditing of rendered map layers, marker contrast, and popups.
- **`anti-slop`**: Anti-slop geospatial craft, zero broken tile rendering and zero unclustered DOM overloads.
- **`database-orm-expert`**: Bridges PostGIS spatial types with Prisma / Drizzle ORM schemas.
- **`senior-frontend`**: Integrates responsive map canvases without blocking main-thread UI interactivity.
- **`performance-web-vitals`**: Lazy-loads vector tile stylesheets and WebGL libraries to maintain optimal LCP and INP.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec geospatial-maps-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan ahli untuk mengintegrasikan mesin peta interaktif, ubin vektor (*vector tiles*), dan kueri database geospasial ke dalam aplikasi web dan mobile modern. Mencakup MapLibre GL JS (bebas lisensi dan *open-source*), Mapbox GL JS v3, Leaflet, Google Maps Platform, visualisasi data berskala besar dengan deck.gl, kluster marker sisi klien dengan Supercluster, serta optimasi kueri spasial PostgreSQL/PostGIS.

### Kondisi Pemicu
- Menambahkan peta vektor interaktif ke dalam komponen React atau Next.js.
- Mengimplementasikan pencarian berbasis radius jarak (*"Cari gerai terdekat dalam radius 5 km"*).
- Menampilkan ribuan titik marker secara efisien menggunakan kluster otomatis.
- Menulis kueri geospasial PostGIS (`ST_DWithin`, `ST_Distance`, `ST_MakePoint`).
- Visualisasi GeoJSON, rute navigasi, dan peta kepadatan (*heatmap*).

### Pola Integrasi Kueri Spasial di Backend (TypeScript + Drizzle/Raw SQL)

```typescript
// Pencarian gerai terdekat menggunakan PostGIS
export async function getNearbyStores(userLat: number, userLng: number, radiusMeters = 5000) {
  const query = `
    SELECT id, name, address,
           ST_Y(geom) as lat, ST_X(geom) as lng,
           ROUND(ST_Distance(geom::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography)::numeric, 1) as distance
    FROM merchant_locations
    WHERE ST_DWithin(geom::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)
    ORDER BY distance ASC
    LIMIT 20;
  `;
  const result = await db.execute(query, [userLng, userLat, radiusMeters]);
  return result.rows;
}
```

### Praktik Terbaik Kinerja Peta
1. **Gunakan Indeks GIST**: Kueri spasial tanpa indeks GIST akan memindai seluruh tabel secara sekuensial. Wajib pasang `CREATE INDEX ... USING GIST (geom)`.
2. **Ubah ke Tipe GEOGRAPHY**: Untuk menghitung jarak nyata di bumi dalam meter/kilometer, lakukan *casting* `geom::geography`.
3. **Kluster di Sisi Klien**: Jangan render ribuan node DOM untuk setiap marker. Gunakan fitur clustering WebGL bawaan MapLibre agar performa rendering tetap 60 FPS.

## Integrasi Orkestrasi
- **`modern-web-guidance`**: API Web Modern, performa kanvas, dan kontainer peta responsif.
- **`design-system-architect`**: Kontrol navigasi peta, marker pin kustom, popover callout, dan input pencarian lokasi.
- **`tailwind-expert`**: Overlay kontainer peta, widget HUD, dan styling panel geser (drawer).
- **`ui-ux-pro-max`**: Ergonomi viewport peta, transisi easing fly-to yang mulus, dan mikro-interaksi pin lokasi.
- **`visual-ui-auditor`**: Audit visual multimodal untuk layer peta, kontras marker, dan popup yang dirender.
- **`anti-slop`**: Rekayasa geospasial anti-slop, nol rendering ubin rusak, dan nol overload DOM marker tanpa kluster.
- **`database-orm-expert`**: Mengelola migrasi tabel dengan tipe data geospasial PostGIS.
- **`senior-frontend`**: Menangani state interaksi klik marker dan jendela pop-up.
- **`performance-web-vitals`**: Menerapkan dynamic import (`next/dynamic` dengan `ssr: false`) agar bundle peta tidak memperlambat pemuatan awal.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec geospatial-maps-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
