---
name: database-migration-versioning-expert
description: "Expert guide for database migrations: schema versioning, zero-downtime migrations, backward-compatible changes, data backfill, and rollback strategies / Panduan ahli migrasi database."
author: vibes-plug-swarm
---

# Database Migration & Versioning Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
A specialized skill focused strictly on the lifecycle of database schemas in production environments. While `database-orm-expert` handles queries and types, this skill covers the DevOps aspect of databases: zero-downtime schema migrations, backward-compatible release cycles, stateful data backfills, rollback mechanisms, and schema versioning strategies.

### Trigger Conditions
- When modifying an existing production database schema.
- When planning a deployment that involves database changes (blue-green, canary).
- When resolving merge conflicts in migration files (e.g., Prisma, Drizzle, Alembic).
- When designing backfill scripts for massive data migrations.

### Core Architectural Guidelines

#### 1. Zero-Downtime Migration Pattern (Expand and Contract)
Never make breaking changes in a single deployment. Use the "Expand and Contract" pattern (Parallel Change):
- **Phase 1 (Expand)**: Add the new schema element (column, table) without removing the old one. Deploy the database change.
- **Phase 2 (Migrate)**: Update application code to write to *both* old and new elements, and read from the new element (with fallback). Deploy code.
- **Phase 3 (Backfill)**: Run a background script to backfill data from the old element to the new element for older records.
- **Phase 4 (Contract)**: Remove the old application code that writes to the old element. Deploy code.
- **Phase 5 (Cleanup)**: Drop the old schema element from the database.

#### 2. Backward Compatibility Rules
- **Never `DROP` or `RENAME`** a column/table in active use. Create a new one, migrate data, then drop the old one later.
- **Avoid changing constraints** on existing data without carefully verifying that all data complies.
- **Add `DEFAULT` values** to new `NOT NULL` columns, or make them nullable first, backfill, then enforce `NOT NULL`.

#### 3. Migration Mechanics
- Always use version-controlled, immutable migration scripts (e.g., `20260814_add_user_status.sql`).
- Never modify an already-applied migration file. If a mistake was made, create a new forward-migration to fix it.
- **Idempotency**: Write scripts that can be safely run multiple times (e.g., `CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`).

#### 4. Safe Data Backfilling
For large tables (millions of rows), running `UPDATE table SET new_col = old_col` will lock the table and cause downtime.
- **Chunking**: Perform updates in batches using `LIMIT` and sleep intervals to avoid locking the database.
- **Background Jobs**: Use dedicated queues (like BullMQ or Inngest) to orchestrate massive backfills.

## Orchestration & Integration
- Enhances `database-orm-expert` with production-grade migration strategies.
- Complements `ci-cd-devops-architect` for automated migration deployment steps.
- Integrates with `supabase-migration` for Supabase-specific PostgreSQL migration workflows.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Skill khusus yang berfokus ketat pada siklus hidup skema database di lingkungan produksi. Sementara `database-orm-expert` menangani query dan tipe, skill ini mencakup aspek DevOps database: migrasi skema tanpa downtime (zero-downtime), rilis backward-compatible, skrip backfill data stateful, mekanisme rollback, dan strategi pembuatan versi skema.

### Kondisi Pemicu
- Saat memodifikasi skema database produksi yang sudah ada.
- Saat merencanakan deployment yang melibatkan perubahan database (blue-green, canary).
- Saat merancang skrip backfill untuk tabel berukuran besar (jutaan baris).

### Panduan Arsitektur Inti

#### 1. Pola Zero-Downtime (Expand and Contract)
Jangan pernah melakukan perubahan yang merusak (breaking change) dalam satu deployment.
- Tambahkan kolom baru tanpa menghapus yang lama.
- Ubah aplikasi untuk menulis ke keduanya dan membaca dari yang baru.
- Lakukan migrasi data lama (backfill).
- Hapus penggunaan kolom lama dari kode aplikasi.
- Hapus kolom lama dari database di migrasi berikutnya.

#### 2. Aturan Kompatibilitas Mundur (Backward Compatibility)
- **Jangan pernah melakukan `DROP` atau `RENAME`** pada kolom yang sedang aktif digunakan. Buat yang baru, pindahkan data, baru hapus yang lama di siklus rilis berikutnya.
- Kolom `NOT NULL` baru harus selalu memiliki nilai `DEFAULT`, atau jadikan nullable terlebih dahulu sebelum memaksakan constraint.

#### 3. Keamanan Skrip Migrasi
- Gunakan file migrasi yang immutable (tidak boleh diubah setelah di-deploy). Jika ada bug, buat file migrasi baru untuk memperbaikinya (forward-fix).
- Skrip harus sebisa mungkin bersifat idempoten.
- Untuk tabel besar, lakukan backfill data secara bertahap (chunking/batching) agar tidak terjadi table lock yang menyebabkan downtime aplikasi.

## Integrasi Orkestrasi
- Memperkuat `database-orm-expert` dengan strategi deployment yang aman.
- Melengkapi `ci-cd-devops-architect` dalam alur CI/CD untuk otomatisasi migrasi.
- Terintegrasi dengan `supabase-migration` untuk ekosistem spesifik Supabase.
