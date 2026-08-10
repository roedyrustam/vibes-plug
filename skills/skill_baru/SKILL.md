---
name: skill-baru
description: "Comprehensive template for creating new vibes-plug skills with proper structure, trigger conditions, and bilingual support / Template komprehensif untuk membuat skill vibes-plug baru dengan struktur yang tepat, kondisi pemicu, dan dukungan bilingual."
author: "Roedy Rustam"
---

# [Skill Name] — vibes-plug Skill Template

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

> **HOW TO USE THIS TEMPLATE**
> 1. Copy this entire folder (`skill_baru/`) and rename it using kebab-case (e.g., `my-new-skill/`).
> 2. Replace all placeholder text marked with `[...]` brackets.
> 3. Update the frontmatter `name` and `description` fields above.
> 4. Delete this instruction block before publishing.
> 5. Add your skill to the `brainstorming` orchestration matrix if it belongs to a domain.

---

<a name="english"></a>
## English

### Description
[One paragraph describing the purpose and scope of this skill. Be specific about what problems it solves and what technology versions it targets.]

Example: *"Expert guide for [Technology/Domain] (v[X.Y]+). Covers [feature A], [feature B], [pattern C], and [best practice D] for production-grade TypeScript/JavaScript applications."*

### Trigger Conditions
Activate this skill when the user is:
- [Trigger scenario 1 — be specific, e.g., "Writing X with framework Y"]
- [Trigger scenario 2]
- [Trigger scenario 3]
- [Trigger scenario 4]

---

### Core Concepts

#### [Concept 1 — e.g., "Architecture Overview"]
[Explain the foundational concept. Use tables for comparisons, bullet points for lists, and code blocks for examples.]

```typescript
// [Language] — [What this code demonstrates]
// Replace this block with a real, runnable code example.
const example = {
  field: 'value',
};
```

#### [Concept 2 — e.g., "Selection Guide"]

| Criteria | Option A | Option B | Option C |
|---|---|---|---|
| [Criterion 1] | [Value] | [Value] | [Value] |
| [Criterion 2] | [Value] | [Value] | [Value] |
| **Best For** | [Use case] | [Use case] | [Use case] |

**Recommendation:** [State a clear default recommendation with rationale.]

---

### [Main Topic Section 1 — e.g., "Setup & Configuration"]

#### [Sub-topic 1.1]
```typescript
// Example: Configuration or setup code
```

#### [Sub-topic 1.2]
```typescript
// Example: Core usage pattern
```

---

### [Main Topic Section 2 — e.g., "Best Practices"]

1. **[Practice 1]:** [Explanation]
2. **[Practice 2]:** [Explanation]
3. **[Practice 3]:** [Explanation]
4. **[Practice 4]:** [Explanation]

---

### Common Pitfalls to Avoid

| Anti-Pattern | Problem | Correct Approach |
|---|---|---|
| [Bad practice 1] | [Why it's bad] | [What to do instead] |
| [Bad practice 2] | [Why it's bad] | [What to do instead] |
| [Bad practice 3] | [Why it's bad] | [What to do instead] |

---

### Integration with Other Skills (MANDATORY)

> ⚠️ **Every skill MUST list at least 3 cross-references.** No skill should exist in isolation.

This skill works best when combined with:
- `[skill-name]` — [Why and when to combine]
- `[skill-name]` — [Why and when to combine]
- `[skill-name]` — [Why and when to combine]

### Referenced By Orchestrators (MANDATORY)

> ⚠️ **Update the orchestrator skills below when creating a new domain skill.**

This skill should be referenced by the following orchestrators:
- `brainstorming` — Add to the "[Domain]" row in the Skill Integration & Orchestration Matrix
- `zero-to-prod-orchestrator` — Add to Phase [N]: [Phase Name]
- `production-ready-hardener` — Add to Phase [N] if relevant to pre-launch audit

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
[Satu paragraf menjelaskan tujuan dan ruang lingkup skill ini. Spesifik tentang masalah apa yang dipecahkan dan versi teknologi apa yang ditargetkan.]

Contoh: *"Panduan ahli untuk [Teknologi/Domain] (v[X.Y]+). Mencakup [fitur A], [fitur B], [pola C], dan [praktik terbaik D] untuk aplikasi TypeScript/JavaScript berkualitas produksi."*

### Kondisi Pemicu
Aktifkan skill ini ketika pengguna sedang:
- [Skenario pemicu 1 — spesifik, misal: "Menulis X dengan framework Y"]
- [Skenario pemicu 2]
- [Skenario pemicu 3]
- [Skenario pemicu 4]

### Panduan Singkat

[Ringkasan praktis berisi poin-poin utama yang harus diketahui. Merujuk ke bagian English untuk detail teknis dan contoh kode lengkap.]

- **[Prinsip 1]:** [Penjelasan singkat]
- **[Prinsip 2]:** [Penjelasan singkat]
- **[Prinsip 3]:** [Penjelasan singkat]
- **[Prinsip 4]:** [Penjelasan singkat]

### Integrasi dengan Skill Lain (WAJIB)

> ⚠️ **Setiap skill WAJIB mencantumkan minimal 3 referensi silang.** Tidak ada skill yang boleh berdiri sendiri.

Skill ini bekerja paling baik dikombinasikan dengan:
- `[nama-skill]` — [Mengapa dan kapan dikombinasikan]
- `[nama-skill]` — [Mengapa dan kapan dikombinasikan]
- `[nama-skill]` — [Mengapa dan kapan dikombinasikan]

### Direferensikan oleh Orchestrator (WAJIB)

Skill ini harus direferensikan oleh orchestrator berikut:
- `brainstorming` — Tambahkan ke baris "[Domain]" di Matriks Orkestrasi
- `zero-to-prod-orchestrator` — Tambahkan ke Fase [N]
- `production-ready-hardener` — Tambahkan ke Fase [N] jika relevan

---

## Checklist Sebelum Mempublikasikan Skill Ini

- [ ] Frontmatter `name` dan `description` sudah diisi (bilingual EN/ID).
- [ ] Semua teks `[...]` placeholder sudah diganti.
- [ ] Ada minimal 2 contoh kode yang nyata dan dapat dijalankan.
- [ ] Ada tabel perbandingan atau selection guide jika relevan.
- [ ] Ada bagian "Common Pitfalls" atau anti-pattern.
- [ ] **Bagian "Integration with Other Skills" mencantumkan minimal 3 skill.**
- [ ] **Bagian "Referenced By Orchestrators" sudah diisi.**
- [ ] Bagian Bahasa Indonesia sudah diterjemahkan dengan benar.
- [ ] Blok instruksi ini sudah dihapus.
- [ ] **Skill sudah ditambahkan ke matriks orkestrasi `brainstorming`.**
- [ ] **Skill sudah ditambahkan ke fase yang relevan di `zero-to-prod-orchestrator`.**
- [ ] `BLUEPRINT.md` sudah diperbarui dengan deskripsi skill baru.
