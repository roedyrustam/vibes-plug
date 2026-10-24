---
name: supabase-security-expert
description: "Supabase security expert to audit RLS (Row Level Security), RBAC, relational databases, prevent data leakage, and utilize Supabase Linter / Ahli keamanan Supabase untuk audit RLS (Row Level Security), RBAC, database relasional, pencegahan kebocoran data, dan pemanfaatan Supabase Linter."
author: "Roedy Rustam"
version: "4.4.2"

---

# Supabase Security Expert (2026 Edition — Auth v3 / PKCE)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Database Architecture & ORM**: `database-orm-expert`, `saas-multi-tenant`, `saas-billing`
- **Identity & Authentication**: `authentication-identity-expert`, `zero-trust-secret-vault`
- **Threat Defense & Pen-Testing**: `autonomous-red-teamer`, `rate-limit-abuse-prevention`, `prompt-injection-firewall`
- **Frontend & Storage Integration**: `senior-frontend`, `nextjs-app-router-expert`, `file-upload-media-expert`
- **Lifecycle & Governance**: `production-ready-hardener`, `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`

### Description
Expert guide for auditing and hardening Supabase applications. Covers Row Level Security (RLS), Supabase Auth v3 (PKCE flow), API key hygiene, data leakage prevention, Supabase Linter, and production security checklists.

### Trigger Conditions
- Auditing RLS policies for correctness and security gaps.
- Setting up Supabase Auth v3 with PKCE flow (replaces implicit flow).
- Reviewing API key usage (anon key vs. service role key).
- Preventing data leakage from misconfigured policies.
- Running Supabase Linter (`supabase lint`) for automated security checks.
- Implementing user roles and access control in a Supabase project.

### Supabase Auth v3 — PKCE Flow (2026 Default)

Supabase Auth v3 now uses **PKCE (Proof Key for Code Exchange)** as the default flow for all OAuth and magic link authentication — replacing the older implicit flow:

```typescript
// supabase/client.ts — v3 client setup
import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      flowType: 'pkce', // Default in Auth v3
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    }
  }
);
```

```typescript
// Server-side session handling (Next.js App Router)
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

### API Key Security

| Key Type | Purpose | Where to Use |
|---|---|---|
| `anon` key | Public client access — restricted by RLS | Frontend (browser) |
| `service_role` key | Bypasses ALL RLS | Backend only (server) |

> ⚠️ **NEVER** expose `service_role` key to the frontend. If it leaks, an attacker can read/write all data in your database, bypassing RLS completely.

```typescript
// ✅ CORRECT: service_role used only in server-side code
// app/api/admin/route.ts (only accessible at admin.domain.com)
import { createClient } from '@supabase/supabase-js';

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // NOT exposed to client
);

// 🔴 WRONG: service_role in client-side code
const publicClient = createBrowserClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!);
```

### RLS Policy Audit Checklist

#### Common RLS Mistakes
```sql
-- 🔴 INSECURE: auth.uid() is not validated — returns null if not authenticated
CREATE POLICY "users can see own data" ON profiles
FOR SELECT USING (user_id = auth.uid());
-- If user is unauthenticated, auth.uid() returns null, which means 
-- NULL = NULL is NULL (falsy in SQL) — so this IS secure... but next one isn't:

-- 🔴 DANGEROUS: Using 'true' without auth check
CREATE POLICY "all can read" ON public_posts
FOR SELECT USING (true);  -- Anyone, including anonymous, can read

-- ✅ SECURE: Explicit authentication requirement
CREATE POLICY "only authenticated users can read" ON sensitive_data
FOR SELECT USING (auth.role() = 'authenticated');

-- ✅ SECURE: Workspace isolation with auth check
CREATE POLICY "workspace isolation" ON projects
FOR ALL USING (
  workspace_id IN (
    SELECT workspace_id FROM workspace_members
    WHERE user_id = auth.uid()
  )
);
```

#### RLS Audit SQL Queries
```sql
-- Find tables WITHOUT RLS enabled
SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename NOT IN (
    SELECT tablename FROM pg_policies WHERE schemaname = 'public'
  );

-- Find tables with RLS enabled but NO policies (effectively blocks all access)
SELECT c.relname AS table_name, c.relrowsecurity AS rls_enabled
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relrowsecurity = true
  AND NOT EXISTS (
    SELECT 1 FROM pg_policies p
    WHERE p.tablename = c.relname AND p.schemaname = n.nspname
  );
```

### Supabase Linter
Run automated security checks:
```bash
# Install Supabase CLI
npm install -g supabase

# Run the linter against your project
supabase db lint --project-id <your-project-id>

# Common lint checks:
# - Tables with RLS disabled
# - Policies using mutable functions (NOW(), RANDOM())
# - Security definer functions without search_path
# - Auth functions used incorrectly
```

### Storage Security
```typescript
// Create a private storage bucket (files not publicly accessible by URL)
const { data, error } = await supabase.storage.createBucket('user-uploads', {
  public: false,  // Private — requires signed URLs
  fileSizeLimit: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
});

// Generate a signed URL (expires in 1 hour)
const { data: { signedUrl } } = await supabase.storage
  .from('user-uploads')
  .createSignedUrl(`${userId}/${filename}`, 3600);
```

```sql
-- Storage RLS: users can only access their own files
CREATE POLICY "users can manage own files"
ON storage.objects FOR ALL
USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Production Security Checklist
- [ ] All tables in `public` schema have RLS enabled.
- [ ] `service_role` key is only in server-side environment variables.
- [ ] PKCE flow enabled (`flowType: 'pkce'`) in Auth v3 client.
- [ ] Storage buckets are private by default.
- [ ] JWT expiry set appropriately (recommended: 1 hour + refresh tokens).
- [ ] Email confirmations required for new signups.
- [ ] Supabase Linter (`supabase db lint`) passes with no critical issues.
- [ ] MFA (Multi-Factor Authentication) enabled for admin users.
- [ ] Realtime subscriptions restricted — filter by authenticated user.
- [ ] Custom `auth.uid()` policies tested with anonymous/different user sessions.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`Gemini 4 Argon`, `GPT-5.6 Sol Medium`, `Claude Sonnet 5.5 High`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec supabase-security-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_eval_sql`, `vibes_verify_invariants`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 Query Latency < 15ms, 100% Row Level Security (RLS) coverage on multi-tenant tables, explicit B-Tree indexes on all Foreign Keys; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Arsitektur Database & ORM**: `database-orm-expert`, `saas-multi-tenant`, `saas-billing`
- **Identitas & Autentikasi**: `authentication-identity-expert`, `zero-trust-secret-vault`
- **Pertahanan Ancaman & Pen-Testing**: `autonomous-red-teamer`, `rate-limit-abuse-prevention`, `prompt-injection-firewall`
- **Integrasi Frontend & Storage**: `senior-frontend`, `nextjs-app-router-expert`, `file-upload-media-expert`
- **Siklus Hidup & Tata Kelola**: `production-ready-hardener`, `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`

### Deskripsi
Panduan ahli untuk mengaudit dan mengeraskan aplikasi Supabase. Mencakup Row Level Security (RLS), Supabase Auth v3 (PKCE flow), kebersihan API key, pencegahan kebocoran data, Supabase Linter, dan checklist keamanan produksi.

### Kondisi Pemicu
- Mengaudit kebijakan RLS untuk kebenaran dan celah keamanan.
- Menyiapkan Supabase Auth v3 dengan PKCE flow (menggantikan implicit flow).
- Meninjau penggunaan API key (anon key vs. service role key).
- Mencegah kebocoran data dari kebijakan yang salah konfigurasi.
- Menjalankan Supabase Linter untuk pemeriksaan keamanan otomatis.

### Supabase Auth v3 — PKCE Flow (Default 2026)

Supabase Auth v3 menggunakan **PKCE** sebagai alur default untuk semua OAuth dan magic link — menggantikan implicit flow yang lama. Konfigurasikan dengan `flowType: 'pkce'` di klien browser dan gunakan `@supabase/ssr` untuk penanganan sesi sisi server di Next.js App Router.

### Keamanan API Key

| Tipe Key | Tujuan | Tempat Penggunaan |
|---|---|---|
| `anon` key | Akses klien publik — dibatasi RLS | Frontend (browser) |
| `service_role` key | Melewati SEMUA RLS | Hanya backend (server) |

> ⚠️ **JANGAN PERNAH** mengekspos `service_role` key ke frontend. Jika bocor, penyerang dapat membaca/menulis semua data di database Anda, melewati RLS sepenuhnya.

### Audit Kebijakan RLS

Kesalahan RLS umum: menggunakan `USING (true)` tanpa pemeriksaan autentikasi (siapa saja, termasuk anonim, dapat membaca). Selalu verifikasi dengan `auth.role() = 'authenticated'` atau cek `auth.uid()` eksplisit.

Gunakan query audit SQL untuk menemukan tabel tanpa RLS dan tabel dengan RLS aktif tetapi tanpa kebijakan (memblokir semua akses).

### Supabase Linter
Jalankan `supabase db lint` untuk pemeriksaan keamanan otomatis: tabel dengan RLS dinonaktifkan, kebijakan menggunakan fungsi yang dapat dimutasi, fungsi security definer tanpa `search_path`.

### Keamanan Storage
Buat bucket penyimpanan privat (`public: false`) dengan batasan ukuran file dan tipe MIME yang diizinkan. Gunakan URL bertanda tangan (signed URL) untuk memberikan akses sementara ke file privat. Terapkan RLS di `storage.objects` untuk memastikan pengguna hanya dapat mengakses file mereka sendiri.

### Checklist Keamanan Produksi
- Semua tabel di schema `public` mengaktifkan RLS.
- `service_role` key hanya di variabel lingkungan sisi server.
- PKCE flow diaktifkan di klien Auth v3.
- Bucket storage privat secara default.
- Supabase Linter tidak ada isu kritis.
- MFA diaktifkan untuk pengguna admin.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`Gemini 4 Argon`, `GPT-5.6 Sol Medium`, `Claude Sonnet 5.5 High`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec supabase-security-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_eval_sql`, `vibes_verify_invariants`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi Query P99 < 15ms, cakupan Row Level Security (RLS) 100% pada tabel multi-tenant, indeks B-Tree eksplisit pada seluruh Foreign Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
