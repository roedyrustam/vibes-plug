---
name: api-gateway-proxy-expert
description: "Expert guide for API Gateways, Reverse Proxies, and Service Mesh. Covers Kong, Traefik, NGINX, Cloudflare Gateway, and load balancing / Panduan ahli untuk API Gateway, Reverse Proxy, dan Service Mesh."
author: "Roedy Rustam"
---

# API Gateway & Proxy Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Expert guide for architecting the edge layer of microservices and distributed systems. Covers API Gateways, Reverse Proxies, Load Balancing, and Service Mesh concepts. Focuses on tools like Kong, Traefik, AWS API Gateway, NGINX, and Envoy, providing patterns for routing, SSL termination, rate limiting, and traffic management.

### Trigger Conditions
Activate this skill when the user is:
- Exposing multiple microservices behind a single unified API endpoint.
- Setting up a reverse proxy for SSL termination and load balancing.
- Implementing global rate limiting, IP whitelisting, or WAF (Web Application Firewall) at the network edge.
- Migrating from a monolith to microservices and needing a strangler fig pattern implementation via routing.

---

### Core Concepts

#### 1. API Gateway vs Reverse Proxy vs Service Mesh
- **Reverse Proxy (e.g., NGINX, HAProxy):** Forwards client requests to backend servers. Handles SSL termination and simple load balancing.
- **API Gateway (e.g., Kong, AWS API Gateway):** A specialized reverse proxy that adds API-specific capabilities like authentication validation (JWT), rate limiting, request/response transformation, and API analytics.
- **Service Mesh (e.g., Istio, Linkerd):** Handles service-to-service communication *internal* to the cluster (East-West traffic), rather than external client-to-cluster communication (North-South traffic).

#### 2. The Strangler Fig Pattern
An API Gateway is essential for safely migrating legacy systems. The Gateway routes new API paths to the new microservices while sending all other traffic to the legacy monolith.

```yaml
# Example: Traefik Docker Compose routing configuration
http:
  routers:
    # Route to the new microservice
    new-service-router:
      rule: "PathPrefix(`/api/v2/users`)"
      service: "new-users-microservice"
    # Fallback to the legacy monolith
    legacy-monolith-router:
      rule: "PathPrefix(`/`)"
      service: "legacy-monolith"
```

---

### Best Practices

1. **Offload Cross-Cutting Concerns:** Do not implement rate limiting, JWT validation, or CORS in every single microservice. Offload these concerns to the API Gateway.
2. **Centralize SSL/TLS Termination:** Terminate HTTPS at the API Gateway or Edge network (Cloudflare) to reduce the computational overhead on internal backend services.
3. **Implement Circuit Breakers at the Edge:** If a backend service is failing, the API Gateway should trip the circuit breaker and return a 503 instantly to prevent cascading failures across the system.
4. **Use Infrastructure as Code (IaC):** Define your API Gateway routes and policies using declarative YAML or Terraform. Do not rely on manual click-ops in a UI dashboard.

---

### Common Pitfalls to Avoid

| Anti-Pattern | Problem | Correct Approach |
|---|---|---|
| **Gateway Monolith** | Putting business logic inside the API Gateway makes it a brittle monolith | Keep the Gateway dumb. Only handle routing, auth, and traffic shaping. |
| **No Timeout Configuration** | Hanging requests exhaust connection pools | Always configure strict read, write, and idle timeouts on the proxy. |
| **Exposing internal endpoints** | Security vulnerabilities | Use explicit route mapping; deny all traffic by default except defined routes. |

---

### Integration with Other Skills (MANDATORY)

This skill works best when combined with:
- `api-design-expert` — While `api-design-expert` covers the API contract, this skill covers how that API is delivered and protected over the network.
- `authentication-identity-expert` — For integrating JWT validation and OAuth2 scopes at the API Gateway level.
- `rate-limit-abuse-prevention` — The actual rate limiting policies and bot detection logic are often enforced by the Gateway described here.

### Referenced By Orchestrators (MANDATORY)

This skill should be referenced by the following orchestrators:
- `brainstorming` — Add to the "Backend & Infrastructure" domain.
- `zero-to-prod-orchestrator` — Phase 3 (Architecture) and Phase 8 (Deployment).
- `production-ready-hardener` — Phase 6 (Security Hardening) for WAF and rate limit checks.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan ahli untuk merancang lapisan tepi (edge layer) dari microservices dan sistem terdistribusi. Mencakup API Gateway, Reverse Proxy, Load Balancing, dan konsep Service Mesh (Kong, Traefik, AWS API Gateway, Envoy). Memberikan pola untuk *routing*, terminasi SSL, *rate limiting*, dan manajemen lalu lintas jaringan.

### Kondisi Pemicu
Aktifkan skill ini ketika pengguna sedang:
- Mengekspos beberapa microservices di balik satu *endpoint* API terpadu.
- Menyiapkan *reverse proxy* untuk terminasi SSL dan *load balancing*.
- Mengimplementasikan *rate limiting* global atau WAF di tingkat jaringan.
- Memigrasi sistem monolitik ke microservices dan membutuhkan pola *strangler fig* melalui konfigurasi *routing*.

### Panduan Singkat

- **Pusatkan Keamanan dan CORS:** Jangan menulis logika validasi JWT atau pengaturan CORS di setiap *microservice*. Bebankan tugas *cross-cutting* ini kepada API Gateway.
- **Jaga Gateway Tetap "Bodoh":** Jangan masukkan logika bisnis atau agregasi data kompleks ke dalam API Gateway. Gateway hanya boleh mengurus *routing*, autentikasi, dan kontrol lalu lintas.
- **Atur Timeout:** Selalu konfigurasikan batas waktu (*timeout*) yang ketat di proxy. Jika *backend* mati, Gateway harus cepat memutuskan koneksi (mungkin dengan memicu *circuit breaker*) agar *thread pool* tidak habis.
- **Terminasi SSL di Tepi:** Selesaikan enkripsi SSL/TLS di Gateway. Komunikasi internal antar-service di dalam jaringan privat (VPC) dapat menggunakan HTTP biasa untuk performa, atau mTLS ringan via Service Mesh.

### Integrasi dengan Skill Lain (WAJIB)

Skill ini bekerja paling baik dikombinasikan dengan:
- `api-design-expert` — Untuk mendesain kontrak API yang akan diekspos melalui Gateway.
- `authentication-identity-expert` — Untuk memvalidasi token JWT di level Gateway sebelum *request* mencapai *backend*.
- `rate-limit-abuse-prevention` — Untuk menetapkan kebijakan anti-DDoS dan pembatasan akses di gerbang masuk.

### Direferensikan oleh Orchestrator (WAJIB)

Skill ini harus direferensikan oleh orchestrator berikut:
- `brainstorming` — Tambahkan ke domain "Backend & Infrastructure".
- `zero-to-prod-orchestrator` — Fase 3 (Arsitektur) dan Fase 8 (Deployment).
- `production-ready-hardener` — Fase 6 (Security Hardening).
