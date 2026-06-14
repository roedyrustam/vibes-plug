---
name: supabase-migration
description: "Kemampuan untuk membuat atau menerapkan migrasi database Supabase / A skill to create or apply a Supabase database migration."
author: "Roedy Rustam"
---

# Supabase Migration Skill

[Bahasa Indonesia](#bahasa-indonesia) | [English](#english)

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
