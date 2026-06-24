---
name: fullstack-expert
description: "Expert-level fullstack development guide covering multi-language (TypeScript, Python, Go, Rust), multi-framework (Next.js, FastAPI, Gin, Axum), API design, microservices, DevOps, and system design / Panduan fullstack tingkat ahli mencakup multi-bahasa (TypeScript, Python, Go, Rust), multi-framework (Next.js, FastAPI, Gin, Axum), desain API, microservices, DevOps, dan system design."
author: "Roedy Rustam"
---

# Fullstack Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
A comprehensive, expert-level fullstack development skill that goes beyond a single tech stack. Covers end-to-end system architecture, multi-language backend design, advanced API patterns, microservices orchestration, infrastructure-as-code, observability, and production-grade deployment strategies.

### Core Capabilities
- **System Architecture Designer**: Designs scalable distributed systems with proper domain decomposition, service boundaries, and communication patterns (sync/async).
- **Multi-Language Backend Expert**: Writes production-grade backend services in TypeScript (Node.js/Bun), Python (FastAPI/Django), Go (Gin/Echo), and Rust (Axum/Actix-web).
- **API Design Specialist**: Designs RESTful, GraphQL, gRPC, and WebSocket APIs following industry best practices (OpenAPI 3.1, schema-first design, versioning strategies).
- **Database Architect**: Selects and optimizes database engines (PostgreSQL, MySQL, MongoDB, Redis, DynamoDB) based on access patterns, consistency requirements, and scale needs.
- **DevOps & Infrastructure Expert**: Implements CI/CD pipelines, Docker/Kubernetes deployments, IaC (Terraform/Pulumi), and cloud-native architectures (AWS/GCP/Azure).
- **Observability Engineer**: Sets up structured logging, distributed tracing (OpenTelemetry), metrics (Prometheus/Grafana), and alerting for production systems.

### Modern Tech Stack (2026)

#### Frontend
- **Frameworks**: React 19, Next.js 15 (App Router), Nuxt 4, SvelteKit 2, Astro 5
- **Styling**: Tailwind CSS v4, CSS Modules, vanilla-extract
- **State**: TanStack Query v5, Zustand, Jotai, Pinia
- **Build Tools**: Vite 6, Turbopack, Bun

#### Backend
- **TypeScript/JavaScript**: Node.js 22 (LTS), Bun 1.x, Express 5, Fastify 5, Hono, tRPC
- **Python**: Python 3.12+, FastAPI 0.115+, Django 5.x, SQLAlchemy 2.x, Pydantic v2
- **Go**: Go 1.23+, Gin, Echo, GORM, sqlc
- **Rust**: Rust 2024, Axum 0.8+, Actix-web 4, SQLx, SeaORM

#### Database & Storage
- **Relational**: PostgreSQL 16+, MySQL 8.4, SQLite (Turso/LibSQL)
- **Document**: MongoDB 7, Firestore
- **Key-Value/Cache**: Redis 7, Valkey, DragonflyDB
- **Vector**: pgvector, Pinecone, Qdrant
- **Object Storage**: S3, R2 (Cloudflare), GCS

#### Infrastructure & DevOps
- **Containers**: Docker, Podman, Kubernetes (K8s), Helm
- **IaC**: Terraform, Pulumi, SST (Serverless Stack)
- **CI/CD**: GitHub Actions, GitLab CI, Dagger
- **Cloud**: AWS, GCP, Azure, Vercel, Cloudflare Workers, Fly.io
- **Monitoring**: OpenTelemetry, Prometheus, Grafana, Sentry, Datadog

#### Communication & Messaging
- **Sync**: REST, GraphQL, gRPC, tRPC
- **Async**: Apache Kafka, RabbitMQ, NATS, Redis Streams, BullMQ
- **Real-time**: WebSocket, Server-Sent Events (SSE), Socket.IO

### Expert Best Practices

#### Architecture & Design
- Apply **Domain-Driven Design (DDD)** for complex business domains — identify bounded contexts, aggregates, and domain events.
- Use **CQRS** (Command Query Responsibility Segregation) when read and write patterns diverge significantly.
- Design for **eventual consistency** in distributed systems; use the Saga pattern for distributed transactions.
- Apply the **Strangler Fig Pattern** for incremental legacy system migration.

#### API Design
- Use **OpenAPI 3.1** spec-first design; generate server stubs and client SDKs from the spec.
- Implement **API versioning** via URL path (`/v1/`) or custom headers; never break existing consumers.
- Use **pagination** (cursor-based for large datasets, offset-based for small ones), **filtering**, and **field selection** on all list endpoints.
- Implement **idempotency keys** for all mutation endpoints to handle retries safely.
- Use **rate limiting** (token bucket or sliding window) and return proper `429` responses with `Retry-After` headers.

#### Database
- Always use **database migrations** (Prisma Migrate, Drizzle Kit, Alembic, goose, sqlx-cli) — never modify schemas manually in production.
- Design schemas with **proper normalization** (3NF minimum), then denormalize strategically for read performance.
- Use **connection pooling** (PgBouncer, Supavisor, HikariCP) in serverless/high-concurrency environments.
- Implement **Row-Level Security (RLS)** for multi-tenant applications.
- Use **EXPLAIN ANALYZE** to profile and optimize slow queries; add compound indexes on frequently filtered columns.

#### Security
- Implement **defense in depth**: input validation (Zod/Pydantic), parameterized queries, output encoding, CSP headers.
- Use **OAuth 2.0 / OIDC** for authentication; never roll your own auth crypto.
- Store secrets in **environment variables** or secret managers (Vault, AWS Secrets Manager); never commit secrets to git.
- Implement **CORS** with explicit allow-lists; never use `*` in production.
- Enable **audit logging** for all sensitive operations (data access, permission changes, admin actions).

#### Performance
- Use **CDN** (Cloudflare, CloudFront) for static assets and edge caching.
- Implement **multi-tier caching**: browser cache → CDN → application cache (Redis) → database.
- Use **lazy loading** and **code splitting** for frontend bundles.
- Implement **database read replicas** for read-heavy workloads.
- Profile with **flamegraphs** and **distributed traces** before optimizing — don't guess, measure.

#### Observability
- Implement the **three pillars**: structured logs, metrics, and distributed traces.
- Use **OpenTelemetry** as the vendor-neutral instrumentation standard.
- Set up **SLIs/SLOs** (error rate < 0.1%, p99 latency < 500ms) with automated alerting.
- Implement **health checks** (`/healthz`, `/readyz`) for all services.

### Troubleshooting

- **N+1 Query Problem**: Use eager loading (Prisma `include`, SQLAlchemy `joinedload`, GORM `Preload`) or batch loaders (DataLoader pattern).
- **Memory Leaks in Node.js**: Profile with `--inspect` and Chrome DevTools; check for event listener accumulation and unclosed streams.
- **gRPC Deadline Exceeded**: Set explicit deadlines per-call; implement circuit breakers (e.g., `opossum` for Node.js, `gobreaker` for Go).
- **Kubernetes Pod CrashLoopBackOff**: Check `kubectl logs` and `kubectl describe pod`; common causes are missing env vars, failing health checks, or OOM kills.
- **Docker Build Cache Invalidation**: Order `COPY` statements from least to most frequently changed; use multi-stage builds.

### Reference Documentation
- [System Design Patterns](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/fullstack-expert/references/system_design_patterns.md)
- [API Design Guide](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/fullstack-expert/references/api_design_guide.md)
- [DevOps & Infrastructure](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/fullstack-expert/references/devops_infrastructure.md)
- [Multi-Language Backend Patterns](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/fullstack-expert/references/multi_language_backend.md)

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Skill pengembangan fullstack tingkat ahli yang komprehensif, melampaui satu tech stack. Mencakup arsitektur sistem end-to-end, desain backend multi-bahasa, pola API lanjutan, orkestrasi microservices, infrastructure-as-code, observability, dan strategi deployment tingkat produksi.

### Kemampuan Utama
- **System Architecture Designer**: Merancang sistem terdistribusi yang skalabel dengan dekomposisi domain yang tepat, batas layanan, dan pola komunikasi (sinkron/asinkron).
- **Multi-Language Backend Expert**: Menulis layanan backend tingkat produksi dalam TypeScript (Node.js/Bun), Python (FastAPI/Django), Go (Gin/Echo), dan Rust (Axum/Actix-web).
- **API Design Specialist**: Merancang API RESTful, GraphQL, gRPC, dan WebSocket mengikuti best practice industri (OpenAPI 3.1, desain schema-first, strategi versioning).
- **Database Architect**: Memilih dan mengoptimasi mesin database (PostgreSQL, MySQL, MongoDB, Redis, DynamoDB) berdasarkan pola akses, kebutuhan konsistensi, dan skala.
- **DevOps & Infrastructure Expert**: Mengimplementasi pipeline CI/CD, deployment Docker/Kubernetes, IaC (Terraform/Pulumi), dan arsitektur cloud-native (AWS/GCP/Azure).
- **Observability Engineer**: Menyiapkan structured logging, distributed tracing (OpenTelemetry), metrik (Prometheus/Grafana), dan alerting untuk sistem produksi.

### Stack Teknologi Modern (2026)

#### Frontend
- **Framework**: React 19, Next.js 15 (App Router), Nuxt 4, SvelteKit 2, Astro 5
- **Styling**: Tailwind CSS v4, CSS Modules, vanilla-extract
- **State**: TanStack Query v5, Zustand, Jotai, Pinia
- **Build Tools**: Vite 6, Turbopack, Bun

#### Backend
- **TypeScript/JavaScript**: Node.js 22 (LTS), Bun 1.x, Express 5, Fastify 5, Hono, tRPC
- **Python**: Python 3.12+, FastAPI 0.115+, Django 5.x, SQLAlchemy 2.x, Pydantic v2
- **Go**: Go 1.23+, Gin, Echo, GORM, sqlc
- **Rust**: Rust 2024, Axum 0.8+, Actix-web 4, SQLx, SeaORM

#### Database & Penyimpanan
- **Relasional**: PostgreSQL 16+, MySQL 8.4, SQLite (Turso/LibSQL)
- **Dokumen**: MongoDB 7, Firestore
- **Key-Value/Cache**: Redis 7, Valkey, DragonflyDB
- **Vektor**: pgvector, Pinecone, Qdrant
- **Object Storage**: S3, R2 (Cloudflare), GCS

#### Infrastruktur & DevOps
- **Container**: Docker, Podman, Kubernetes (K8s), Helm
- **IaC**: Terraform, Pulumi, SST (Serverless Stack)
- **CI/CD**: GitHub Actions, GitLab CI, Dagger
- **Cloud**: AWS, GCP, Azure, Vercel, Cloudflare Workers, Fly.io
- **Monitoring**: OpenTelemetry, Prometheus, Grafana, Sentry, Datadog

#### Komunikasi & Messaging
- **Sinkron**: REST, GraphQL, gRPC, tRPC
- **Asinkron**: Apache Kafka, RabbitMQ, NATS, Redis Streams, BullMQ
- **Real-time**: WebSocket, Server-Sent Events (SSE), Socket.IO

### Praktik Terbaik Ahli

#### Arsitektur & Desain
- Terapkan **Domain-Driven Design (DDD)** untuk domain bisnis kompleks — identifikasi bounded context, aggregate, dan domain event.
- Gunakan **CQRS** (Command Query Responsibility Segregation) ketika pola baca dan tulis berbeda secara signifikan.
- Rancang untuk **eventual consistency** dalam sistem terdistribusi; gunakan pola Saga untuk transaksi terdistribusi.
- Terapkan **Strangler Fig Pattern** untuk migrasi sistem legacy secara bertahap.

#### Desain API
- Gunakan desain **OpenAPI 3.1** spec-first; generate server stub dan client SDK dari spec.
- Implementasi **API versioning** via URL path (`/v1/`) atau custom header; jangan pernah break consumer yang sudah ada.
- Gunakan **pagination** (cursor-based untuk dataset besar, offset-based untuk kecil), **filtering**, dan **field selection** di semua list endpoint.
- Implementasi **idempotency key** untuk semua mutation endpoint agar aman terhadap retry.
- Gunakan **rate limiting** (token bucket atau sliding window) dan kembalikan response `429` yang proper dengan header `Retry-After`.

#### Database
- Selalu gunakan **database migration** (Prisma Migrate, Drizzle Kit, Alembic, goose, sqlx-cli) — jangan pernah modifikasi schema secara manual di produksi.
- Rancang schema dengan **normalisasi yang tepat** (minimal 3NF), lalu denormalisasi secara strategis untuk performa baca.
- Gunakan **connection pooling** (PgBouncer, Supavisor, HikariCP) di lingkungan serverless/high-concurrency.
- Implementasi **Row-Level Security (RLS)** untuk aplikasi multi-tenant.
- Gunakan **EXPLAIN ANALYZE** untuk profiling dan optimasi query lambat; tambah compound index pada kolom yang sering difilter.

#### Keamanan
- Implementasi **defense in depth**: validasi input (Zod/Pydantic), parameterized query, output encoding, CSP header.
- Gunakan **OAuth 2.0 / OIDC** untuk autentikasi; jangan pernah buat auth crypto sendiri.
- Simpan secret di **environment variable** atau secret manager (Vault, AWS Secrets Manager); jangan pernah commit secret ke git.
- Implementasi **CORS** dengan allow-list eksplisit; jangan pernah gunakan `*` di produksi.
- Aktifkan **audit logging** untuk semua operasi sensitif (akses data, perubahan permission, aksi admin).

#### Performa
- Gunakan **CDN** (Cloudflare, CloudFront) untuk aset statis dan edge caching.
- Implementasi **multi-tier caching**: browser cache → CDN → application cache (Redis) → database.
- Gunakan **lazy loading** dan **code splitting** untuk bundle frontend.
- Implementasi **database read replica** untuk workload yang berat baca.
- Profiling dengan **flamegraph** dan **distributed trace** sebelum optimasi — jangan tebak, ukur.

#### Observability
- Implementasi **tiga pilar**: structured log, metrik, dan distributed trace.
- Gunakan **OpenTelemetry** sebagai standar instrumentasi vendor-neutral.
- Siapkan **SLI/SLO** (error rate < 0.1%, p99 latency < 500ms) dengan alerting otomatis.
- Implementasi **health check** (`/healthz`, `/readyz`) untuk semua service.

### Pemecahan Masalah (Troubleshooting)

- **N+1 Query Problem**: Gunakan eager loading (Prisma `include`, SQLAlchemy `joinedload`, GORM `Preload`) atau batch loader (DataLoader pattern).
- **Memory Leak di Node.js**: Profiling dengan `--inspect` dan Chrome DevTools; periksa akumulasi event listener dan stream yang tidak ditutup.
- **gRPC Deadline Exceeded**: Set deadline eksplisit per-call; implementasi circuit breaker (misal `opossum` untuk Node.js, `gobreaker` untuk Go).
- **Kubernetes Pod CrashLoopBackOff**: Periksa `kubectl logs` dan `kubectl describe pod`; penyebab umum adalah env var yang hilang, health check gagal, atau OOM kill.
- **Docker Build Cache Invalidation**: Urutkan statement `COPY` dari yang paling jarang berubah ke yang paling sering; gunakan multi-stage build.

### Referensi Dokumentasi
- [System Design Patterns](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/fullstack-expert/references/system_design_patterns.md)
- [API Design Guide](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/fullstack-expert/references/api_design_guide.md)
- [DevOps & Infrastructure](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/fullstack-expert/references/devops_infrastructure.md)
- [Multi-Language Backend Patterns](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/fullstack-expert/references/multi_language_backend.md)
