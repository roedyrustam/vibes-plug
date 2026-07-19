---
name: saas-multi-tenant
description: "Design and implement multi-tenant SaaS architectures with RLS, tenant isolation, and PostgreSQL / Desain dan implementasikan arsitektur SaaS multi-tenant dengan RLS, isolasi tenant, dan PostgreSQL."
author: "Roedy Rustam"
---

# SaaS Multi-Tenant Architecture

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Trigger Conditions
Use this skill when:
- The user is building a SaaS application where multiple customers share the same database.
- The user asks about tenant isolation, Row-Level Security (RLS), or data leakage prevention.
- The user needs to scope every database query to a specific tenant automatically.
- The user asks about tradeoffs between shared-schema, schema-per-tenant, and database-per-tenant.
- The user is implementing admin endpoints that must access data across tenants.
- The user needs to add `tenant_id` columns to an existing single-tenant application.

### Core Workflow

#### 1. Determine the Tenancy Model
Discuss scale expectations and isolation requirements with the user. For most SaaS apps under 1000 tenants, a **shared-schema with a `tenant_id` column** on every table is the correct default.

#### 2. Add `tenant_id` to Every Tenant-Scoped Table
The column must be `NOT NULL`, type `UUID` or `TEXT`, and included in every composite index. Never allow a tenant-scoped table to exist without this column to prevent data leaks.

#### 3. Set Up PostgreSQL Row-Level Security (RLS)
Create a policy on each tenant-scoped table that filters rows by a session variable like `current_setting('app.current_tenant_id')`. This acts as a database-level safety net if application code forgets a WHERE clause.

#### 4. Build Tenant-Aware Middleware
At the start of every request, extract the `tenant_id` from the authenticated session or JWT claims. Set it on the database connection using `SET LOCAL app.current_tenant_id = '...'` inside a transaction.

#### 5. Scope ORM Queries Automatically
If using Prisma, apply a global middleware that injects `where: { tenantId }` automatically. If using Drizzle, create a base query builder that includes the tenant filter.

#### 6. Separate Cross-Tenant Admin Routes
Admin endpoints that aggregate data across tenants must bypass RLS explicitly using a dedicated database role (e.g., `bypassrls` or an admin bypass role).

#### 7. Multi-Page Application (MPA) Approach in a Single Repository
When organizing a multi-tenant SaaS as a Multi-Page Application within a single repository, adhere to the following guidelines:
- **Centralized Routing**: Use a Front Controller to handle all page requests. Route each request to its respective controller and view, ensuring each page load is fully processed on the server side with tenant context correctly initialized.
- **Shared Layouts & Partials**: Avoid duplicating HTML (headers, footers, navigation). Create a `src/Views/layouts/` directory for base templates and a `src/Views/partials/` directory for reusable UI components. Controllers should inject page-specific content into the base layout.
- **Asset Management**: Store all static assets in the `public/` directory. Use cache-busting techniques when linking assets in the views.
- **State Management**: Use server-side sessions securely for user authentication, tenant context, flash messages, and tracking state across full page reloads.

### Best Practices & Pitfalls
- **Never** query a tenant-scoped table without a `tenant_id` filter or active RLS.
- **Never** use auto-incrementing integer IDs for tenant-scoped resources. Use UUIDs to prevent ID enumeration attacks.
- **Connection Pooling Mitigation**: When using connection pooling (e.g., PgBouncer), session variables set by `SET LOCAL` are only scoped to the transaction. If you use session-scoped variables, ensure you reset them (`RESET ALL` or `SET app.current_tenant_id = ''`) before returning the connection to the pool, or run them strictly inside a `BEGIN`...`COMMIT` transaction block.
- **RLS Bypass Risk**: Ensure database migrations and triggers are run with `SECURITY DEFINER` only when strictly necessary, and explicitly set a safe `search_path` to prevent search path hijacking.
- **Test with at least 3 tenants** in your seed data to catch cross-tenant data leakage bugs.


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Kondisi Pemicu
Gunakan skill ini ketika:
- Pengguna membangun aplikasi SaaS di mana beberapa pelanggan berbagi database yang sama.
- Pengguna bertanya tentang isolasi tenant, Row-Level Security (RLS), atau pencegahan kebocoran data.
- Pengguna perlu membatasi setiap query database ke tenant tertentu secara otomatis.
- Pengguna bertanya tentang trade-off antara shared-schema, schema-per-tenant, dan database-per-tenant.
- Pengguna mengimplementasikan endpoint admin yang perlu mengakses data lintas tenant.
- Pengguna perlu menambahkan kolom `tenant_id` ke aplikasi single-tenant yang sudah ada.

### Alur Kerja Inti

#### 1. Tentukan Model Tenancy
Diskusikan dengan pengguna mengenai skala dan persyaratan isolasi mereka. Untuk sebagian besar aplikasi SaaS di bawah 1000 tenant, model **shared-schema dengan kolom `tenant_id`** pada setiap tabel adalah pilihan default yang tepat.

#### 2. Tambahkan `tenant_id` di Setiap Tabel yang Terkait Tenant
Kolom ini harus `NOT NULL`, bertipe `UUID` or `TEXT`, dan dimasukkan ke dalam setiap composite index. Jangan biarkan ada tabel tanpa kolom ini untuk mencegah kebocoran data.

#### 3. Konfigurasikan PostgreSQL Row-Level Security (RLS)
Buat kebijakan (policy) RLS pada setiap tabel yang memfilter baris berdasarkan variabel sesi seperti `current_setting('app.current_tenant_id')`. Ini bertindak sebagai pengaman tingkat database jika kode aplikasi lupa menyertakan filter WHERE.

#### 4. Buat Middleware yang Sadar Tenant (Tenant-Aware)
Pada awal setiap request, ekstrak `tenant_id` dari sesi autentikasi atau JWT. Atur nilai tersebut pada koneksi database menggunakan `SET LOCAL app.current_tenant_id = '...'` di dalam transaksi.

#### 5. Batasi Query ORM Secara Otomatis
Jika menggunakan Prisma, gunakan middleware global untuk menyisipkan `where: { tenantId }` secara otomatis. Jika menggunakan Drizzle, buat base query builder yang menyertakan filter tenant.

#### 6. Pisahkan Jalur Akses Admin Lintas Tenant
Endpoint admin yang memerlukan agregasi data lintas tenant harus melewati RLS secara eksplisit menggunakan peran database khusus (misal: `bypassrls` atau role admin terdedikasi).

#### 7. Pendekatan Multi-Page Application (MPA) dalam Satu Repositori
Saat mengatur proyek SaaS multi-tenant sebagai Multi-Page Application di dalam satu repositori, ikuti panduan berikut:
- **Routing Terpusat (Centralized Routing)**: Gunakan Front Controller untuk menangani semua permintaan halaman. Arahkan setiap permintaan ke controller dan view masing-masing, memastikan setiap pemuatan halaman diproses sepenuhnya di sisi server dengan konteks tenant yang diinisialisasi dengan benar.
- **Layout & Parsial Bersama (Shared Layouts & Partials)**: Hindari duplikasi HTML (header, footer, navigasi). Buat direktori `src/Views/layouts/` untuk template dasar dan direktori `src/Views/partials/` untuk komponen UI yang dapat digunakan kembali. Controller harus menyuntikkan konten spesifik halaman ke dalam layout dasar.
- **Manajemen Aset**: Simpan semua aset statis di direktori `public/`. Gunakan teknik cache-busting saat menautkan aset di dalam view.
- **Manajemen State**: Gunakan session sisi server secara aman untuk autentikasi pengguna, konteks tenant, pesan flash, dan melacak state di seluruh proses reload halaman secara penuh.

### Praktik Terbaik & Hal yang Harus Dihindari
- **Jangan pernah** melakukan query pada tabel bertingkat tenant tanpa filter `tenant_id` atau tanpa RLS yang aktif.
- **Jangan pernah** menggunakan ID integer berurutan (auto-increment) untuk resource bertingkat tenant. Gunakan UUID untuk mencegah penjelajahan ID oleh penyerang.
- **Mitigasi Connection Pooling**: Saat menggunakan connection pool (seperti PgBouncer), variabel sesi yang diatur oleh `SET LOCAL` hanya berlaku selama transaksi berlangsung. Jika Anda menggunakan variabel sesi, pastikan Anda meresetnya (`RESET ALL` atau `SET app.current_tenant_id = ''`) sebelum mengembalikan koneksi ke pool, atau jalankan perintah secara ketat di dalam blok transaksi `BEGIN`...`COMMIT`.
- **Risiko RLS Bypass**: Pastikan fungsi migrasi database dan triggers yang dijalankan dengan `SECURITY DEFINER` hanya digunakan saat benar-benar diperlukan, dan atur `search_path` secara aman untuk mencegah pembajakan search path.
- **Uji dengan minimal 3 tenant** dalam database pengembangan (seed data) untuk mendeteksi bug kebocoran data lintas tenant.

