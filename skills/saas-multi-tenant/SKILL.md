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

### Best Practices & Pitfalls
- **Never** query a tenant-scoped table without a `tenant_id` filter or active RLS.
- **Never** use auto-incrementing integer IDs for tenant-scoped resources. Use UUIDs to prevent ID enumeration attacks.
- **Reset the tenant context** in the connection cleanup path to prevent context pollution in connection pooling.
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

### Praktik Terbaik & Hal yang Harus Dihindari
- **Jangan pernah** melakukan query pada tabel bertingkat tenant tanpa filter `tenant_id` atau tanpa RLS yang aktif.
- **Jangan pernah** menggunakan ID integer berurutan (auto-increment) untuk resource bertingkat tenant. Gunakan UUID untuk mencegah penjelajahan ID oleh penyerang.
- **Reset konteks tenant** setelah transaksi selesai untuk mencegah context kebocoran saat koneksi dikembalikan ke connection pool.
- **Uji dengan minimal 3 tenant** dalam database pengembangan (seed data) untuk mendeteksi bug kebocoran data lintas tenant.
