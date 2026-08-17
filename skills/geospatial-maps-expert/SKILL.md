---
name: geospatial-maps-expert
description: "Expert guide for maps and geospatial data (Mapbox GL JS, Leaflet, Google Maps, PostGIS) / Panduan ahli peta dan data geospasial (Mapbox GL JS, Leaflet, Google Maps, PostGIS)."
author: "vibes-plug-swarm"
---

# Geospatial & Maps Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **`database-orm-expert`**: PostGIS spatial queries and index optimization.
- **`senior-frontend`**: React map component patterns.
- **`mobile-expo-expert`**: React Native Maps integration.
- **`performance-web-vitals`**: Map rendering performance optimization.

### Description
Expert guide for integrating maps and geospatial data into web and mobile applications. Covers Mapbox GL JS v3, Leaflet, Google Maps Platform, PostGIS spatial queries, GeoJSON data handling, clustering, routing/directions, geocoding, heatmaps, and location-based search.

### Trigger Conditions
- Adding interactive maps to web or mobile applications.
- Implementing geolocation features (GPS tracking, geofencing).
- Building location-based search or store locators.
- Working with PostGIS spatial data or GeoJSON.

---

### Library Selection

| Library | Rendering | 3D | Free Tier | Best For |
|---------|-----------|-----|-----------|----------|
| Mapbox GL JS v3 | WebGL | ✅ | 50K loads/mo | Premium maps, 3D |
| Leaflet | DOM | ❌ | Unlimited (OSM) | Simple, lightweight |
| Google Maps | WebGL | ✅ | $200/mo credit | Business, Street View |
| deck.gl | WebGL | ✅ | Open-source | Large-scale data viz |

```tsx
// React + Mapbox GL JS
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

function StoreLocator({ stores }) {
  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={{ longitude: 106.8456, latitude: -6.2088, zoom: 12 }}
      style={{ width: '100%', height: 500 }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
    >
      <NavigationControl position="top-right" />
      {stores.map((store) => (
        <Marker key={store.id} longitude={store.lng} latitude={store.lat}>
          <div className="marker-pin" />
        </Marker>
      ))}
    </Map>
  );
}
```

## Orchestration & Integration
- `database-orm-expert`, `senior-frontend`, `mobile-expo-expert`

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan ahli mengintegrasikan peta dan data geospasial ke dalam aplikasi web dan mobile. Mencakup Mapbox GL JS, Leaflet, Google Maps Platform, PostGIS, dan GeoJSON.

### Kondisi Pemicu
- Menambahkan peta interaktif ke aplikasi web atau mobile.
- Mengimplementasikan fitur geolokasi (pelacakan GPS, geofencing).
- Membangun pencarian berbasis lokasi atau store locator.
