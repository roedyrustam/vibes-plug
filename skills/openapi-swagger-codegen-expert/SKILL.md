---
name: openapi-swagger-codegen-expert
description: "OpenAPI 3.1 spec authoring, Swagger UI, automatic client/server code generation (openapi-typescript, Orval, Kiota), contract testing / Penulisan spesifikasi OpenAPI 3.1, Swagger UI, pembuatan kode klien/server otomatis, dan pengujian kontrak."
author: vibes-plug-swarm
---

# OpenAPI & Swagger Codegen Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Dedicated expert guide for API contract-first development using OpenAPI 3.1, Swagger UI, and automated code generation. Covers generating strictly typed API clients (using `openapi-typescript`, `Orval`, or Microsoft `Kiota`), scaffolding server stubs, and implementing contract testing to ensure backend APIs always match their documentation.

### Trigger Conditions
- Setting up API documentation (Swagger UI, Redoc, Scalar).
- Generating API client code for frontend/mobile apps.
- Authoring OpenAPI 3.x specifications (`openapi.yaml` or JSON).
- Implementing contract testing (e.g., using Dredd or Prism).
- Migrating from manual fetch wrappers to auto-generated typed API clients.

### Best Practices & Workflow

1. **Contract-First Approach**: Always write or define the OpenAPI specification before writing any backend code. This serves as the single source of truth for both frontend and backend teams.
2. **Strict Type Generation**:
   - Use `openapi-typescript` for generating raw TS definitions.
   - Use `Orval` for generating React Query (TanStack Query) hooks directly from the OpenAPI spec.
   - Use Microsoft `Kiota` for multi-language SDK generation.
3. **Automated Validation**: Integrate API schema validation in the CI/CD pipeline using tools like `Spectral` to enforce API design standards.
4. **Mocking**: Use tools like `Prism` to spin up mock servers from the OpenAPI spec, allowing frontend teams to start development immediately.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan ahli khusus untuk pengembangan API dengan pendekatan *contract-first* menggunakan OpenAPI 3.1, Swagger UI, dan otomatisasi pembuatan kode (codegen). Mencakup pembuatan klien API yang *strictly typed* (menggunakan `openapi-typescript`, `Orval`, atau Microsoft `Kiota`), *scaffolding* untuk server, dan implementasi *contract testing* untuk memastikan backend selalu sesuai dengan dokumentasinya.

### Kondisi Pemicu
- Mengatur dokumentasi API (Swagger UI, Redoc, Scalar).
- Men-generate kode klien API untuk aplikasi frontend/mobile.
- Menulis spesifikasi OpenAPI 3.x (`openapi.yaml` atau JSON).
- Mengimplementasikan *contract testing* (misalnya menggunakan Dredd atau Prism).
- Migrasi dari wrapper `fetch` manual ke klien API yang otomatis ter-generate dan *typed*.

### Panduan Implementasi

1. **Pendekatan Contract-First**: Selalu tulis/definisikan spesifikasi OpenAPI sebelum menulis kode backend. Ini menjadi sumber kebenaran tunggal (*single source of truth*) untuk tim frontend dan backend.
2. **Pembuatan Tipe yang Ketat (Strict Type Generation)**:
   - Gunakan `openapi-typescript` untuk menghasilkan definisi TypeScript murni.
   - Gunakan `Orval` untuk men-generate React Query (TanStack Query) hooks secara otomatis dari spek OpenAPI.
   - Gunakan Microsoft `Kiota` untuk pembuatan SDK multi-bahasa.
3. **Validasi Otomatis**: Integrasikan validasi skema API di pipeline CI/CD menggunakan tool seperti `Spectral` untuk memastikan standar desain API terpenuhi.
4. **Mocking**: Gunakan tool seperti `Prism` untuk menjalankan mock server dari spesifikasi OpenAPI, memungkinkan tim frontend memulai pengembangan tanpa harus menunggu backend selesai.

## Orchestration & Integration
- Connects to `api-design-expert` for the core design rules.
- Connects to `ci-cd-devops-architect` to implement CI/CD validation.
- Connects to `senior-frontend` / `tanstack-query-expert` to consume the generated clients.
