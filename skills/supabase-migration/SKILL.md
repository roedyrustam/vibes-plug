---
name: supabase-migration
description: "A skill to create or apply a Supabase database migration / Kemampuan untuk membuat atau menerapkan migrasi database Supabase."
author: "Roedy Rustam"
---

# Supabase Migration Skill

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
When the user asks to create or apply a database migration for Supabase, follow these instructions:

### Instructions
1. **Check Environment**: Ensure `supabase/migrations` directory exists. Run `list_dir` on it if needed.
2. **Review Available MCP Commands**: Utilize the Supabase MCP integration.
   - For listing existing migrations, use `mcp_supabase-mcp-server_list_migrations` with `project_id`.
   - Before executing migration queries on the server directly, confirm the SQL is correct.
3. **Execute Command**: 
   - Write the SQL script to a local migration file located in `supabase/migrations/` using `write_to_file`. Use standard timestamps or `supabase migration new` command to get the filename.
   - Run `npx supabase migration up` to test locally or use the remote MCP `apply_migration` if the user wants it applied remotely.
4. **Final Step**: Confirm with the user that the migration successfully completed.

### Implementation Checklist
- [ ] Generate a new migration file: `npx supabase migration new [name]`
- [ ] Write raw SQL in the generated migration file (DDL and DML).
- [ ] Test the migration locally: `npx supabase db reset` or `npx supabase migration up`.
- [ ] If using RLS, explicitly add policies to the new tables.
- [ ] Commit the migration file to version control.

### Example: Supabase Migration Command Flow
```bash
# 1. Create a new migration file
npx supabase migration new create_users_table

# 2. Write SQL to supabase/migrations/<timestamp>_create_users_table.sql
# 3. Apply to local database
npx supabase migration up

# 4. Apply to remote production database
npx supabase db push
```

## Orchestration & Integration
- Integrates with: `supabase-security-expert`, `database-orm-expert`, `ci-cd-devops-architect`.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Ketika pengguna meminta untuk membuat atau menerapkan migrasi database untuk Supabase, ikuti instruksi berikut:

### Instruksi
1. **Periksa Lingkungan**: Pastikan direktori `supabase/migrations` ada. Jalankan `list_dir` jika diperlukan.
2. **Tinjau Perintah MCP yang Tersedia**: Manfaatkan integrasi Supabase MCP.
   - Untuk mencantumkan migrasi yang ada, gunakan `mcp_supabase-mcp-server_list_migrations` dengan `project_id`.
   - Sebelum menjalankan kueri migrasi di server secara langsung, pastikan kode SQL-nya sudah benar.
3. **Jalankan Perintah**:
   - Tulis skrip SQL ke file migrasi lokal yang terletak di `supabase/migrations/` menggunakan `write_to_file`. Gunakan timestamp standar atau perintah `supabase migration new` untuk mendapatkan nama file.
   - Jalankan `npx supabase migration up` untuk menguji secara lokal atau gunakan MCP remote `apply_migration` jika pengguna ingin menerapkannya secara remote.
4. **Langkah Terakhir**: Konfirmasikan dengan pengguna bahwa migrasi telah berhasil diselesaikan.

### Checklist Implementasi
- [ ] Buat file migrasi baru: `npx supabase migration new [nama]`
- [ ] Tulis SQL mentah di file migrasi yang dihasilkan (DDL dan DML).
- [ ] Uji migrasi secara lokal: `npx supabase db reset` atau `npx supabase migration up`.
- [ ] Jika menggunakan RLS, tambahkan kebijakan secara eksplisit ke tabel baru.
- [ ] Commit file migrasi ke sistem kontrol versi.

### Contoh: Alur Perintah Migrasi Supabase
```bash
# 1. Buat file migrasi baru
npx supabase migration new create_users_table

# 2. Tulis SQL ke supabase/migrations/<timestamp>_create_users_table.sql
# 3. Terapkan ke database lokal
npx supabase migration up

# 4. Terapkan ke database remote produksi
npx supabase db push
```

## Integrasi Orkestrasi
- Terintegrasi dengan: `supabase-security-expert`, `database-orm-expert`, `ci-cd-devops-architect`.
