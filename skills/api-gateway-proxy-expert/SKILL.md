---
name: api-gateway-proxy-expert
description: "Expert guide for API Gateways, Reverse Proxies, and Service Mesh. Covers Kong, Traefik, NGINX, Cloudflare Gateway, and load balancing / Panduan ahli untuk API Gateway, Reverse Proxy, dan Service Mesh."
author: vibes-plug-swarm
---

# API Gateway & Reverse Proxy Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
A comprehensive guide for routing, load balancing, and managing traffic at the perimeter of your microservices architecture. Covers configuring API Gateways (Kong, Tyk), modern reverse proxies (Traefik, Caddy, NGINX), and understanding Service Mesh patterns.

### Trigger Conditions
- When architecting a microservices backend that needs a unified entry point (BFF - Backend for Frontend).
- When configuring SSL/TLS termination, rate limiting, or IP allowlisting at the infrastructure level.
- When the user asks about "Traefik", "NGINX config", "Kong", or "API routing".
- When implementing blue-green deployments or canary releases via traffic splitting.

### Core Architectural Guidelines

#### 1. API Gateway Pattern
Instead of client applications calling individual microservices, route all traffic through an API Gateway.
- **Cross-Cutting Concerns**: Offload authentication (JWT verification), rate limiting, and CORS handling to the Gateway.
- **Routing**: Use path-based routing (e.g., `/api/users` -> Users Service, `/api/billing` -> Billing Service).

#### 2. Tool Selection
- **Traefik**: Best for Docker/Kubernetes environments due to its auto-discovery capabilities via labels/annotations.
- **Caddy**: Best for simplicity and automatic HTTPS (Let's Encrypt provisioning).
- **Kong API Gateway**: Best for enterprise environments requiring extensive plugins (OIDC, rate limiting, analytics).
- **Cloudflare (Edge)**: Use Cloudflare rules for edge-level caching, WAF, and DDoS protection before traffic even reaches your origin proxy.

#### 3. Configuration Best Practices
- **Timeouts**: Always configure strict proxy read/write timeouts to prevent stalled connections from exhausting worker pools.
- **Health Checks**: Configure active health checks so the proxy can automatically remove failing backend instances from the load balancer pool.
- **X-Forwarded Headers**: Ensure your proxy correctly sets `X-Forwarded-For` and `X-Forwarded-Proto` so backend services know the client's real IP and protocol.

## Orchestration & Integration
- Sits in front of `js-backend-expert`, `go-programming-expert`, and `rust-programming-expert` services.
- Offloads work from `rate-limit-abuse-prevention` by handling rate limits at the L7 proxy layer.
- Complements `ci-cd-devops-architect` when configuring Docker Compose or Kubernetes Ingress.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan komprehensif untuk routing, load balancing, dan manajemen trafik di lapisan terluar (perimeter) arsitektur microservices. Mencakup konfigurasi API Gateway (Kong), reverse proxy modern (Traefik, Caddy, NGINX), dan Service Mesh.

### Kondisi Pemicu
- Saat merancang backend microservices yang membutuhkan satu pintu masuk terpadu (BFF).
- Saat mengonfigurasi terminasi SSL/TLS, rate limiting, atau IP allowlisting di tingkat infrastruktur.
- Saat menerapkan rilis canary atau blue-green deployment melalui pembagian trafik (traffic splitting).

### Panduan Arsitektur Inti

#### 1. Pola API Gateway
Jangan biarkan klien (frontend/mobile) memanggil microservices secara langsung.
- Gunakan Gateway untuk menangani masalah lintas-layanan (cross-cutting) seperti verifikasi JWT, CORS, dan rate limiting.
- Gunakan routing berbasis *path* (jalur).

#### 2. Pemilihan Tool
- **Traefik**: Pilihan terbaik untuk lingkungan Docker/Kubernetes karena penemuan layanan otomatis (auto-discovery) melalui label.
- **Caddy**: Pilihan terbaik untuk kemudahan setup dan HTTPS otomatis (Let's Encrypt).
- **Kong**: Standar industri untuk kebutuhan Enterprise dengan sistem plugin yang kuat.
- **Cloudflare**: Lini pertahanan pertama untuk WAF dan perlindungan DDoS di sisi Edge.

#### 3. Praktik Terbaik Konfigurasi
- **Timeouts**: Selalu tetapkan batas waktu (timeout) koneksi proxy untuk mencegah server kehabisan resource karena koneksi yang menggantung.
- **Health Checks**: Aktifkan health check agar proxy tidak mengirimkan request ke service yang sedang mati.
- **Header X-Forwarded**: Pastikan proxy menyertakan header `X-Forwarded-For` agar backend mengetahui IP asli klien.

## Integrasi Orkestrasi
- Berada di depan service yang dibangun dengan `js-backend-expert`, `go-programming-expert`, atau `rust-programming-expert`.
- Bekerja sama dengan `ci-cd-devops-architect` untuk konfigurasi Ingress Kubernetes atau Docker Compose.
