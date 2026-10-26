---
name: go-programming-expert
description: "Go 1.24+ microservices, sqlc, net/http, and concurrency patterns / Pemrograman Go 1.24+, microservices, sqlc, dan pola konkuren."
author: "Roedy Rustam"
version: "4.4.4"

---

# Go Programming Expert (Go 1.24 / 1.25 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with domain skills:
- **API Design & Protocols**: `api-design-expert`, `openapi-swagger-codegen-expert`, and `spec-driven-development-expert` for gRPC/protobuf contract design, REST endpoints, and RFC 9457 Problem Details.
- **Data Persistence**: `database-orm-expert` for sqlc type-safe query generation, `pgx/v5` connection pooling, and transactional data integrity.
- **Realtime & Streaming**: `sse-websocket-streaming-expert` for goroutine-backed streaming pipelines and low-latency WebSocket hubs.
- **Testing & Quality**: `autonomous-tdd-debugger`, `e2e-testing-expert`, and `anti-slop` for executing `go test -v ./...`, synthetic clock testing via `testing/synctest`, and strict error checking (`if err != nil`).
- **Orchestration**: `brainstorming` and `zero-to-prod-orchestrator` (Phase 4: Backend & APIs).

### Description
Expert-level Go development for building high-performance microservices, concurrent pipelines, and production CLI tools. Covers **Go 1.24+ and 1.25** features (Swiss Table maps, weak pointers, `testing/synctest` deterministic concurrency testing, `tool` directives in `go.mod`), structured logging with `slog`, enhanced ServeMux pattern routing, sqlc type-safe SQL, and robust worker pools.

### Trigger Conditions
- Writing Go 1.24+ / 1.25+ microservices, APIs, or high-throughput distributed workers.
- Utilizing Go 1.24+ Swiss Table optimizations, weak pointers (`weak.Pointer`), or generic type aliases.
- Running deterministic concurrency tests using `testing/synctest` without flaky `time.Sleep`.
- Managing tool dependencies using the official `tool` directive in `go.mod`.
- Writing type-safe SQL with **sqlc** or connection-pooled PostgreSQL with **pgx/v5**.
- Building HTTP servers using standard `net/http` ServeMux method & wildcard routing.

---

### Go 1.24 / 1.25 Core Architectural Features

#### 1. Go 1.24+ Tool Dependencies in `go.mod`
Go 1.24 standardizes executable developer tooling dependencies directly in `go.mod`, eliminating legacy `tools.go` boilerplate:
```bash
# Add a tool dependency
go get -tool github.com/sqlc-dev/sqlc/cmd/sqlc@latest
go get -tool github.com/golangci/golangci-lint/cmd/golangci-lint@latest

# Run the tool directly
go tool sqlc generate
go tool golangci-lint run
```
```go
// go.mod snippet
tool (
    github.com/sqlc-dev/sqlc/cmd/sqlc
    github.com/golangci/golangci-lint/cmd/golangci-lint
)
```

#### 2. Weak Pointers (`weak.Pointer`) & In-Memory Caching
Go 1.24 introduces `weak.Make()` and `weak.Pointer` to reference heap objects without preventing the Garbage Collector from freeing them:
```go
package cache

import (
    "sync"
    "weak"
)

type Session struct {
    UserID    string
    AuthToken string
}

type WeakSessionCache struct {
    mu    sync.RWMutex
    store map[string]weak.Pointer[Session]
}

func NewWeakSessionCache() *WeakSessionCache {
    return &WeakSessionCache{
        store: make(map[string]weak.Pointer[Session]),
    }
}

func (c *WeakSessionCache) Set(key string, session *Session) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.store[key] = weak.Make(session)
}

func (c *WeakSessionCache) Get(key string) (*Session, bool) {
    c.mu.RLock()
    defer c.mu.RUnlock()

    ptr, ok := c.store[key]
    if !ok {
        return nil, false
    }

    // Dereference: returns nil if GC reclaimed the session
    val := ptr.Value()
    if val == nil {
        return nil, false
    }
    return val, true
}
```

#### 3. Deterministic Concurrency Testing with `testing/synctest`
Go 1.24 introduces `testing/synctest` (GOEXPERIMENT=synctest) to test concurrent code with virtual clocks:
```go
package queue_test

import (
    "context"
    "testing"
    "testing/synctest"
    "time"
)

func TestWorkerTimeout(t *testing.T) {
    synctest.Run(func() {
        ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
        defer cancel()

        resultChan := make(chan string, 1)

        go func() {
            // Virtual time advances instantaneously when all goroutines in the bubble are idle
            time.Sleep(10 * time.Second)
            resultChan <- "completed"
        }()

        select {
        case res := <-resultChan:
            t.Fatalf("unexpected success: %s", res)
        case <-ctx.Done():
            // Successfully verified timeout without waiting 5 real seconds!
            t.Log("Worker timed out deterministically")
        }
    })
}
```

#### 4. Range-Over-Func Iterators (Go 1.24+ Standard)
Stream sequence processing with zero slice allocations:
```go
package iterator

import "iter"

type Transaction struct {
    ID     string
    Amount int64
    Failed bool
}

// Custom iterator filtering successful transactions
func SuccessfulTransactions(txs []Transaction) iter.Seq[Transaction] {
    return func(yield func(Transaction) bool) {
        for _, tx := range txs {
            if !tx.Failed {
                if !yield(tx) {
                    return // Stop iteration early if consumer breaks
                }
            }
        }
    }
}

// Consumer loop
func TotalRevenue(txs []Transaction) int64 {
    var total int64
    for tx := range SuccessfulTransactions(txs) {
        total += tx.Amount
    }
    return total
}
```

#### 5. HTTP Microservice with `net/http` ServeMux & `log/slog`
Zero-dependency HTTP server with method routing, path parameters, and structured JSON telemetry:
```go
package main

import (
    "encoding/json"
    "log/slog"
    "net/http"
    "os"
)

type UserResponse struct {
    ID   string `json:"id"`
    Role string `json:"role"`
}

func main() {
    logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))
    slog.SetDefault(logger)

    mux := http.NewServeMux()

    // Method and path parameter matching
    mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
        w.WriteHeader(http.StatusOK)
        w.Write([]byte(`{"status":"healthy"}`))
    })

    mux.HandleFunc("GET /api/v1/users/{id}", func(w http.ResponseWriter, r *http.Request) {
        userID := r.PathValue("id")
        slog.Info("retrieving user profile", "user_id", userID, "remote_addr", r.RemoteAddr)

        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(UserResponse{ID: userID, Role: "member"})
    })

    slog.Info("starting production server", "port", 8080)
    if err := http.ListenAndServe(":8080", mux); err != nil {
        slog.Error("server exited", "error", err)
        os.Exit(1)
    }
}
```

#### 6. Type-Safe SQL with sqlc & pgx/v5
```sql
-- queries/users.sql
-- name: GetUser :one
SELECT id, name, email, created_at FROM users WHERE id = $1 LIMIT 1;

-- name: CreateUser :one
INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email, created_at;
```

```go
// Consuming generated sqlc code
package handler

import (
    "context"
    "example/internal/db"
    "github.com/jackc/pgx/v5/pgxpool"
)

type UserHandler struct {
    queries *db.Queries
    pool    *pgxpool.Pool
}

func (h *UserHandler) Create(ctx context.Context, name, email string) (*db.User, error) {
    user, err := h.queries.CreateUser(ctx, db.CreateUserParams{
        Name:  name,
        Email: email,
    })
    if err != nil {
        return nil, err
    }
    return &user, nil
}
```

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec go-programming-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi bersama skill domain:
- **Desain & Protokol API**: `api-design-expert`, `openapi-swagger-codegen-expert`, dan `spec-driven-development-expert` untuk kontrak gRPC/protobuf, endpoint REST, dan spesifikasi RFC 9457 Problem Details.
- **Persistensi Data**: `database-orm-expert` untuk pembuatan query type-safe via sqlc, connection pooling `pgx/v5`, dan integritas transaksi database.
- **Realtime & Streaming**: `sse-websocket-streaming-expert` untuk pipeline streaming berbasis channel goroutine dan hub WebSocket berlatensi rendah.
- **Pengujian & Kualitas**: `autonomous-tdd-debugger`, `e2e-testing-expert`, dan `anti-slop` untuk eksekusi `go test -v ./...`, pengujian jam sintetis dengan `testing/synctest`, dan penegakan penanganan error ketat (`if err != nil`).
- **Orkestrator Utama**: `brainstorming` dan `zero-to-prod-orchestrator` (Fase 4: Backend & APIs).

### Deskripsi
Panduan Go tingkat ahli untuk membangun microservices, pipeline konkurensi, dan CLI tool berkinerja tinggi. Mencakup fitur **Go 1.24+ dan 1.25** (optimasi hash map Swiss Table, weak pointer, pengujian deterministik `testing/synctest`, direktif `tool` di `go.mod`), structured logging dengan `slog`, ServeMux `net/http` dengan pola pencocokan rute modern, sqlc untuk SQL type-safe, dan worker pool tangguh.

### Kondisi Pemicu
- Menulis microservices atau backend API Go 1.24+/1.25+ berthroughput tinggi.
- Menggunakan optimasi hash map Swiss Table, weak pointer (`weak.Pointer`), atau generic type alias.
- Menjalankan pengujian konkurensi deterministik menggunakan `testing/synctest` tanpa `time.Sleep` yang rapuh.
- Mengelola dependensi perkakas pengembang secara resmi melalui direktif `tool` di `go.mod`.
- Menulis SQL type-safe dengan **sqlc** atau koneksi database PostgreSQL dengan **pgx/v5**.

---

### Fitur Arsitektur Inti Go 1.24 / 1.25

#### 1. Direktif Perkakas `tool` di `go.mod` (Standar Go 1.24+)
Go 1.24 menstandardisasi pelacakan perkakas dependensi biner langsung di dalam `go.mod`, menghapus trik lawas `tools.go`:
```bash
# Menambahkan dependensi tool
go get -tool github.com/sqlc-dev/sqlc/cmd/sqlc@latest
go get -tool github.com/golangci/golangci-lint/cmd/golangci-lint@latest

# Menjalankan tool langsung
go tool sqlc generate
go tool golangci-lint run
```

#### 2. Weak Pointer (`weak.Pointer`) untuk Cache Memori Ramah GC
Go 1.24 menyediakan `weak.Make()` dan `weak.Pointer` untuk menunjuk memori tanpa menghalangi Garbage Collector membersihkannya:
```go
package cache

import (
    "sync"
    "weak"
)

type SesiPengguna struct {
    UserID    string
    AuthToken string
}

type CacheSesiWeak struct {
    mu    sync.RWMutex
    store map[string]weak.Pointer[SesiPengguna]
}

func NewCacheSesiWeak() *CacheSesiWeak {
    return &CacheSesiWeak{
        store: make(map[string]weak.Pointer[SesiPengguna]),
    }
}

func (c *CacheSesiWeak) Set(kunci string, sesi *SesiPengguna) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.store[kunci] = weak.Make(sesi)
}

func (c *CacheSesiWeak) Get(kunci string) (*SesiPengguna, bool) {
    c.mu.RLock()
    defer c.mu.RUnlock()

    ptr, ada := c.store[kunci]
    if !ada {
        return nil, false
    }

    // Dereferensi: mengembalikan nil jika GC telah mengumpulkan memori sesi
    nilai := ptr.Value()
    if nilai == nil {
        return nil, false
    }
    return nilai, true
}
```

#### 3. Pengujian Konkurensi Determinis Menggunakan `testing/synctest`
Go 1.24 memperkenalkan `testing/synctest` untuk menguji alur waktu asinkron dengan jam virtual seketika:
```go
package antrean_test

import (
    "context"
    "testing"
    "testing/synctest"
    "time"
)

func TestBatasWaktuPekerja(t *testing.T) {
    synctest.Run(func() {
        ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
        defer cancel()

        hasilChan := make(chan string, 1)

        go func() {
            // Waktu virtual maju seketika saat seluruh goroutine menganggur
            time.Sleep(10 * time.Second)
            hasilChan <- "sukses"
        }()

        select {
        case hasil := <-hasilChan:
            t.Fatalf("alur gagal: menerima data di luar batas waktu %s", hasil)
        case <-ctx.Done():
            // Berhasil diverifikasi tanpa menunggu 5 detik waktu riil!
            t.Log("Pekerja berhasil timeout secara deterministik")
        }
    })
}
```

#### 4. Iterator Range-Over-Func
Pemrosesan koleksi secara streaming tanpa alokasi memori berlebih:
```go
package iterator

import "iter"

type Transaksi struct {
    ID     string
    Nominal int64
    Gagal   bool
}

func TransaksiSukses(daftar []Transaksi) iter.Seq[Transaksi] {
    return func(yield func(Transaksi) bool) {
        for _, tx := range daftar {
            if !tx.Gagal {
                if !yield(tx) {
                    return
                }
            }
        }
    }
}
```

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec go-programming-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
