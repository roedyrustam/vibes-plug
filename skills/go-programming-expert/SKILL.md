---
name: go-programming-expert
description: "Expert-level skill for Go programming (Go 1.23/1.24+). Covers high-performance microservices, concurrency patterns, sqlc, net/http, Gin/Echo/Fiber, gRPC, and testing in English and Indonesian."
author: "Roedy Rustam"
---

# Go Programming Expert (1.23 / 1.24+ Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Expert-level guidance for building high-performance, concurrent, scalable, and memory-efficient backend applications using **Go (1.23+)**. Covers idiomatic Go patterns, concurrency primitives, modern `net/http` routing, compile-time safe database queries (`sqlc`, `pgx`), gRPC, microservices, profiling (`pprof`), and table-driven testing.

### Trigger Conditions
- Bootstrapping or maintaining a Go application, HTTP API, gRPC service, CLI tool, or microservice.
- Designing concurrent workflows using **Goroutines**, **Channels**, `sync`, and `errgroup`.
- Writing web handlers using standard `net/http` (Go 1.22+ enhanced routing), **Gin**, **Echo**, **Fiber**, or **Chi**.
- Implementing database interactions using **`sqlc`**, **`pgx/v5`**, or **GORM**.
- Building gRPC and Protocol Buffer services.
- Writing unit tests, benchmarks, table-driven tests, or fuzz tests with Go's built-in `testing` package.
- Profiling memory allocations or CPU bottlenecks using `pprof` or `go tool trace`.

### Modern Go 1.23+ Features
1. **Enhanced `net/http` ServeMux Routing**: Native path parameter matching and HTTP method matching without third-party routers:
   ```go
   mux := http.NewServeMux()
   mux.HandleFunc("GET /users/{id}", handleGetUser)
   mux.HandleFunc("POST /users", handleCreateUser)
   ```
2. **Standard Library Iterators (`iter` package)**: First-class range-over-func support using `iter.Seq` and `iter.Seq2`.
3. **Slices & Maps Packages**: Generic helpers in standard library (`slices.Contains`, `slices.SortFunc`, `maps.Clone`).
4. **Range Over Integers & Functions**: `for i := range 10` is natively supported.

### Idiomatic Concurrency & Context
- **Always Pass `context.Context`**: The first parameter of functions handling I/O or network requests must be `ctx context.Context`.
- **Structured Concurrency with `errgroup`**: Use `golang.org/x/sync/errgroup` to manage multiple goroutines, propagate errors, and cancel pending tasks on failure.
  ```go
  g, ctx := errgroup.WithContext(parentCtx)
  g.Go(func() error {
      return fetchUser(ctx, userID)
  })
  if err := g.Wait(); err != nil {
      // Handle first error encountered
  }
  ```
- **Prevent Goroutine Leaks**: Ensure every goroutine launched has an explicit exit condition or listens to `ctx.Done()`.

### Type-Safe Database Access (`sqlc` & `pgx/v5`)
Prefer `sqlc` for compile-time type-safe SQL code generation over heavy reflection-based ORMs:
- **`sqlc`**: Generates clean, type-safe Go code from raw SQL queries.
- **Connection Pooling**: Use `pgxpool.Pool` for PostgreSQL with production-grade configuration (max conns, idle timeouts).

### Testing & Quality
- **Table-Driven Tests**: Write clean, maintainable unit tests using slice of test structs:
  ```go
  tests := []struct {
      name    string
      input   int
      want    int
      wantErr bool
  }{
      {"valid input", 5, 25, false},
      {"negative input", -1, 0, true},
  }
  ```
- **Fuzz Testing**: Native `testing.F` to discover unexpected edge cases and crash inputs automatically.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan tingkat ahli untuk membangun aplikasi backend yang berkinerja tinggi, konkuren, skalabel, dan efisien dalam penggunaan memori menggunakan **Go (1.23+)**. Skill ini mencakup pola Go idiomatis, primitif konkurensi, perutean modern `net/http`, kueri database yang aman pada saat kompilasi (`sqlc`, `pgx`), gRPC, microservices, profiling (`pprof`), dan pengujian berbasis tabel (*table-driven testing*).

### Kondisi Pemicu
- Merancang atau memelihara aplikasi Go, HTTP API, layanan gRPC, alat CLI, atau microservice.
- Merancang alur kerja konkuren menggunakan **Goroutines**, **Channels**, `sync`, dan `errgroup`.
- Menulis handler web menggunakan `net/http` standar (routing bawaan Go 1.22+), **Gin**, **Echo**, **Fiber**, atau **Chi**.
- Mengimplementasikan interaksi database menggunakan **`sqlc`**, **`pgx/v5`**, atau **GORM**.
- Membangun layanan gRPC dan Protocol Buffers.
- Menulis unit test, benchmark, table-driven test, atau fuzz test dengan package bawaan `testing`.
- Melakukan profiling memori atau hambatan CPU menggunakan `pprof` atau `go tool trace`.

### Fitur Modern Go 1.23+
1. **Peningkatan Perutean `net/http` ServeMux**: Pencocokan parameter path dan metode HTTP secara native tanpa butuh router eksternal:
   ```go
   mux := http.NewServeMux()
   mux.HandleFunc("GET /users/{id}", handleGetUser)
   mux.HandleFunc("POST /users", handleCreateUser)
   ```
2. **Iterator Standard Library (`iter` package)**: Dukungan *range-over-func* tingkat pertama menggunakan `iter.Seq` dan `iter.Seq2`.
3. **Package Slices & Maps**: Helper generic bawaan (`slices.Contains`, `slices.SortFunc`, `maps.Clone`).
4. **Range Over Integers**: `for i := range 10` didukung secara langsung.

### Konkurensi Idiomatis & Konteks
- **Selalu Sediakan `context.Context`**: Parameter pertama dari fungsi yang menangani I/O atau jaringan harus berupa `ctx context.Context`.
- **Konkurensi Terstruktur dengan `errgroup`**: Gunakan `golang.org/x/sync/errgroup` untuk mengelola banyak goroutine, menyebarkan error, dan membatalkan tugas jika terjadi kegagalan.
- **Cegah Kebocoran Goroutine**: Pastikan setiap goroutine yang dijalankan memiliki kondisi keluar eksplisit atau mendengarkan event `ctx.Done()`.

### Akses Database Aman-Tipe (`sqlc` & `pgx/v5`)
Utamakan `sqlc` untuk menghasilkan kode Go yang aman secara tipe dari kueri SQL mentah alih-alih ORM berbasis refleksi yang berat. Gunakan `pgxpool.Pool` untuk PostgreSQL dengan konfigurasi batas koneksi produksi.

### Pengujian & Kualitas
- **Table-Driven Tests**: Tulis unit test yang bersih dan mudah dipelihara menggunakan slice struct pengujian.
- **Fuzz Testing**: Gunakan `testing.F` bawaan untuk menemukan kasus batas (*edge cases*) dan input tak terduga secara otomatis.
