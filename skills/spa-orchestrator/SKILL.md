---
name: spa-orchestrator
description: "Orchestrates Single-Page Application (SPA) architecture, integrating frontend state management with API-driven backends / Mengorkestrasi arsitektur Single-Page Application (SPA), mengintegrasikan state management frontend dengan backend berbasis API."
author: "Antigravity"
---

# Single-Page Application (SPA) Orchestrator

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
This skill provides a structured approach for building and orchestrating a Single-Page Application (SPA) architecture. It acts as a master coordinator, connecting SPA frontend principles (client-side routing, complex state management, and component-driven UI) with decoupled, API-driven backend services (using skills like `senior-frontend`, `tanstack-query-expert`, and backend experts).

### Core SPA Principles
1. **Decoupled Architecture**: Strictly separate the frontend application from the backend API. The frontend is a standalone static application (or SSR application) that communicates with the backend exclusively through APIs (REST, GraphQL, or tRPC).
2. **Client-Side Routing**: Use client-side routers (e.g., React Router, Vue Router, Next.js App Router) to navigate between views instantly without reloading the browser window.
3. **Component-Driven UI**: 
   - Build the UI using modular, reusable components.
   - Maintain a clear separation between Presentational (dumb) components and Container (smart) components.
4. **State Management**: Manage complex UI states efficiently. Differentiate between:
   - *Server State*: Data fetched from the API (use `tanstack-query-expert` for caching, invalidation, and optimistic updates).
   - *Client State*: UI-specific state like modals, dark mode, or forms (use Context, Zustand, or simple useState).
5. **API Authentication**: Use token-based authentication (JWT, OAuth) or secure HTTP-only cookies designed for API consumption. Ensure the frontend gracefully handles token expiration and refresh flows.

### Orchestration Guidelines
When designing or building an SPA, orchestrate the following skills contextually:
- **With `senior-frontend` / `ui-ux-pro-max`**: Build a highly interactive, fluid user interface using modern frameworks (React/Next.js/Vue) and Tailwind CSS. Ensure micro-animations and transitions feel native.
- **With `tanstack-query-expert`**: Offload all API data fetching, caching, and synchronization to TanStack Query. Avoid manual `useEffect` fetches for server state.
- **With `js-backend-expert` or `go-programming-expert`**: Design robust, stateless backend APIs that serve JSON data efficiently. Ensure CORS and rate-limiting are properly configured.
- **With `seo` / `seo-geo`**: Address inherent SPA SEO challenges. If SEO is critical, orchestrate a shift towards Server-Side Rendering (SSR) or Static Site Generation (SSG) using frameworks like Next.js, ensuring meta tags and schema data are populated on the server.

### Trigger Conditions
- Active when the user requests to build a web application using the Single-Page Application (SPA) approach, React, Vue, or headless architecture.
- Active when refactoring a legacy application into a decoupled frontend-backend architecture.
- Active when the user needs help organizing complex client-side state and API integrations.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Skill ini memberikan pendekatan terstruktur untuk membangun dan mengorkestrasi arsitektur Single-Page Application (SPA). Skill ini bertindak sebagai koordinator utama yang menghubungkan prinsip-prinsip frontend SPA (routing sisi klien, manajemen state yang kompleks, dan UI berbasis komponen) dengan layanan backend terpisah yang digerakkan oleh API (menggunakan skill seperti `senior-frontend`, `tanstack-query-expert`, dan ahli backend).

### Prinsip Inti SPA
1. **Arsitektur Terpisah (Decoupled)**: Pisahkan secara ketat aplikasi frontend dari API backend. Frontend adalah aplikasi statis mandiri (atau aplikasi SSR) yang berkomunikasi dengan backend secara eksklusif melalui API (REST, GraphQL, atau tRPC).
2. **Routing Sisi Klien (Client-Side Routing)**: Gunakan router sisi klien (seperti React Router, Vue Router, Next.js App Router) untuk menavigasi antar tampilan secara instan tanpa memuat ulang (reload) jendela browser.
3. **UI Berbasis Komponen**:
   - Bangun antarmuka menggunakan komponen modular yang dapat digunakan kembali.
   - Jaga pemisahan yang jelas antara komponen Presentational (dumb) dan komponen Container (smart).
4. **Manajemen State**: Kelola state UI yang kompleks secara efisien. Bedakan antara:
   - *Server State*: Data yang diambil dari API (gunakan `tanstack-query-expert` untuk caching, invalidasi, dan optimistic updates).
   - *Client State*: State khusus UI seperti modal, mode gelap, atau form (gunakan Context, Zustand, atau useState sederhana).
5. **Autentikasi API**: Gunakan autentikasi berbasis token (JWT, OAuth) atau cookie HTTP-only aman yang dirancang untuk konsumsi API. Pastikan frontend menangani kedaluwarsa token dan alur pembaruan (refresh) dengan lancar.

### Panduan Orkestrasi
Saat merancang atau membangun SPA, orkestrasikan skill berikut secara kontekstual:
- **Dengan `senior-frontend` / `ui-ux-pro-max`**: Bangun antarmuka pengguna yang sangat interaktif dan mulus menggunakan framework modern (React/Next.js/Vue) dan Tailwind CSS. Pastikan interaksi mikro dan transisi terasa seperti aplikasi native.
- **Dengan `tanstack-query-expert`**: Serahkan semua proses pengambilan data API, caching, dan sinkronisasi ke TanStack Query. Hindari pengambilan data manual dengan `useEffect` untuk state server.
- **Dengan `js-backend-expert` atau `go-programming-expert`**: Rancang API backend yang kokoh dan stateless untuk menyajikan data JSON secara efisien. Pastikan CORS dan rate-limiting dikonfigurasi dengan benar.
- **Dengan `seo` / `seo-geo`**: Atasi tantangan SEO yang melekat pada SPA. Jika SEO sangat penting, orkestrasikan pergeseran menuju Server-Side Rendering (SSR) atau Static Site Generation (SSG) menggunakan framework seperti Next.js, untuk memastikan tag meta dan data skema terisi di server.

### Kondisi Pemicu
- Aktif ketika pengguna meminta untuk membangun aplikasi web menggunakan pendekatan Single-Page Application (SPA), React, Vue, atau arsitektur headless.
- Aktif ketika melakukan refaktor aplikasi lama menjadi arsitektur frontend-backend yang terpisah.
- Aktif ketika pengguna membutuhkan bantuan dalam mengatur state sisi klien yang kompleks dan integrasi API.
