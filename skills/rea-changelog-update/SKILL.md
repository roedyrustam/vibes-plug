---
name: rea-changelog-update
description: "Prepare REA release changelogs and GitHub release notes / Siapkan changelog rilis REA dan catatan rilis GitHub."
author: "morluto"
version: "4.7.2"
---

# REA changelog update

Use this for release-note preparation and contributor attribution. Read
[docs/releasing.md](../../../docs/releasing.md) from the repository root for
publication authority and the existing checkpoint checks. This skill prepares
notes; it does not authorize merging, tagging, or publishing.

## Hard Guardrails (Declarative Invariants)
- **Inventory Before Prose**: Always build the machine-verified contribution manifest (`docs/releases/VERSION.contributions.json`) from the pinned base-branch SHA before writing release notes.
- **Zero Fabricated Handle Attribution**: Keep unresolved commit identities as `user: null` in the inventory; never guess a GitHub handle or credit the PR merger in place of the author.
- **Exclude Bot & Agent Accounts from Public Thanks**: Filter out `@claude`, `@cursoragent`, `@codex`, `dependabot[bot]`, `github-actions[bot]`, and `release-please[bot]` from public `Thanks @...` clauses while preserving their provenance metadata.
- **Single-Entry Credit Deduplication**: Credit each human contributor and confirmed closing-issue reporter once per work item; never duplicate thanks across Highlights and Changes or credit reverted commits.
- **Mandatory Finalization Label Guard**: Apply `rea:release-notes-finalized` to the open Release Please PR before editing its branch or body so bot refreshes do not overwrite curated notes.
- **Ancestry & 65,536-Char Body Gate**: Verify that the inventory target SHA matches the release PR base branch HEAD and that the rendered PR body stays within GitHub's 65,536-character limit.

### Domain-Specific Non-Functional Requirements (NFRs)
- **100% Verified Attribution**: $0$ hallucinated or guessed GitHub contributor handles in release notes.
- **Payload Size Boundary**: PR body length strictly capped at $\le 65.536\text{ characters}$ to prevent GitHub API rejection.
- **Provenance Deduplication**: Every individual commit author and closing reporter credited exactly once per section.

## Inventory before prose

Fetch complete history and tags. Select the published baseline tag from
`.release-please-manifest.json` on the release PR's **base branch**, and pin that
branch's exact SHA as the editorial target. REA tags are `rea-agents-VERSION`.
Use the proposed version, including its prerelease suffix; do not change the
`always-bump-minor` strategy to imitate OpenClaw's calendar versions.

```bash
node scripts/release-notes.mjs inventory \
  --repository morluto/rea --base rea-agents-PREVIOUS \
  --target FULL_BASE_BRANCH_SHA --version VERSION \
  --manifest /tmp/rea-VERSION.contributions.json
node scripts/release-notes.mjs record \
  --manifest /tmp/rea-VERSION.contributions.json \
  --summary \
  --output /tmp/rea-VERSION.record.md
```

Read the inventory, not just the existing bot draft. It includes side-branch
commits, GitHub-associated PRs whose merge commits are in the range, commit
authors/co-authors, and confirmed closing issues with their reporters. GitHub
connections are paginated. Network errors stop generation; rerun into a new
output file after recovery. Existing output files are never overwritten.

Unresolved commit identities are retained as names/emails with `user: null`;
never guess a handle or thank the merger as a substitute. The report preserves
unknowns. This is a reviewed metadata snapshot, not independent proof that a
human authored a patch. For unattributed identities, unusual merge strategies,
backports, reversions, or references that GitHub did not associate, inspect
the source PRs and diffs and report the limitation. The current collector uses
confirmed PR-closing relationships for issue-reporter credit; unrelated issue
mentions are not automatically credited. Do not claim that merely inventoried
work still ships after a revert.

## Write for users and retain credit

Rewrite only the newest `## [VERSION]` section in `CHANGELOG.md`, preserving its
version/date/link heading. Use single-line Markdown list items under:

- `### Highlights`: a few release-defining user outcomes; no quota for small releases.
- `### Changes`: capabilities and meaningful behavior changes.
- `### Fixes`: reliability, correctness, compatibility, and safety fixes.
- `### ⚠ BREAKING CHANGES`: retain when applicable, with migrations and original
  PR/commit references required by the existing checkpoint validator.

Group related work by analyst workflow or user impact. Explain the resulting
behavior in short, concrete entries. Highlights summarize the release; avoid
repeating their full descriptions in Changes. Internal cleanup, tests, CI, and
routine documentation generally belong only in the provenance file. Read ambiguous PRs/diffs before making
claims. Distinguish simulated-provider checks from real-provider verification.

Credit each represented contribution once in the public notes with its link
and `Thanks @...` for its verified human author, known co-authors, and confirmed
closing-issue reporters. Grouping preserves all those credits in one line.
When Highlights, detailed entries or migrations reference the same work,
put its thanks in one of those entries, not all of them. Include issue links.
Direct-commit bullets carry the commit link and known human credit.
Exclude GitHub bots and known agent accounts. REA's observed Anthropic, Cursor
and Codex co-author trailers resolve to `@claude`, `@cursoragent` and `@codex`
with GitHub type `User`; the credit policy excludes them while retaining their metadata.
At the REA maintainer's request, omit `@morluto` self-thanks while preserving
authorship in the inventory. Other human contributors remain eligible.
Use explicit GitHub links for cross-repository references to avoid ambiguous
`#NNN` numbers. Unknown handles stay unknown; they are not fabricated credit.

Append the generated `record --summary` provenance link verbatim at the end
of this release. The linked inventory accounts for every discovered in-range
PR and direct contribution, including internal work omitted from the prose.
Do not paste the full `record` output into public notes: it duplicates thanks
and obscures the user-facing changes. Full records remain available for review.
Do not hand-edit generated credits to make validation pass. Refresh the inventory
when product history changes; a prose-only correction can reuse the snapshot.

## Finalize with Release Please

Before changing the live release PR, have authorization for that PR update.
Local preparation and validation can proceed independently.

1. Add `rea:release-notes-finalized` to the selected open release PR **before**
   editing its branch/body. Main proposal pushes respect this label. This is
   our workflow guard, not Release Please's `autorelease: snooze` mechanism.
   A proposal already running must finish before editing. Do not dispatch
   manual preparation over finalized notes.
2. On that release branch, save the reviewed inventory as
   `docs/releases/VERSION.contributions.json`. This is durable public release
   provenance, not a temporary planning file. Do not add credentials or local
   environment dumps. Keep the existing version artifacts aligned.
3. Run the existing checkpoint validator and the new checker:

   ```bash
   node scripts/release-notes.mjs check \
     --manifest docs/releases/VERSION.contributions.json
   node scripts/release-notes.mjs render \
     --manifest docs/releases/VERSION.contributions.json \
     --output /tmp/rea-VERSION.notes.md
   ```

   The checker supports inline PR bodies, including their surrounding metadata,
   up to GitHub's 65,536-character limit. It fails on larger notes rather than
   truncating credit; Release Please's overflow-link bodies are not integrated.

4. Update the release PR body with the rendered section while preserving its
   Release Please header/footer and component/version structure. Use a body
   file for `gh pr edit --body-file`; changing only `CHANGELOG.md` does not
   change Release Please's release body. Push only authorized changes.
5. Freshly fetch the PR body to a file and run `check --pr-body FILE`. Review
   the complete diff and wait for current CI. Publication checks the body
   again before release creation. Avoid further body edits while publishing.

The finalization label freezes bot refreshes, not main. New product changes
after the inventory target require refreshing the notes before publication.
The workflow checks target ancestry and allows only release metadata paths
after that target. It also requires the inventory target to equal the reviewed
merge's first parent, so intervening main commits require a fresh inventory.
Review diffs within the allowed release metadata paths too: the path guard does
not prove that package dependency/script edits are version-only changes.
To resume automatic proposals, remove the finalization label and let the bot
regenerate; expect editorial changes to be replaced.

Existing releases without a contribution inventory retain their current
publication path. Never retag or republish a package to correct release prose.

---

## 1. Contributor Attribution & Bot-Exclusion Policy Engine (TypeScript)

```typescript
export interface RawContributionRecord {
  readonly prOrCommitUrl: string;
  readonly authorHandles: readonly string[];
  readonly issueReporterHandles: readonly string[];
  readonly revertedInRange: boolean;
}

const EXCLUDED_HANDLES = new Set([
  'claude',
  'cursoragent',
  'codex',
  'dependabot[bot]',
  'github-actions[bot]',
  'release-please[bot]',
  'morluto'
]);

export function formatVerifiedThanksClause(record: RawContributionRecord): string | null {
  if (record.revertedInRange) {
    return null;
  }
  const eligible = new Set<string>();
  for (const raw of [...record.authorHandles, ...record.issueReporterHandles]) {
    const clean = raw.replace(/^@/, '').trim();
    if (clean && !EXCLUDED_HANDLES.has(clean.toLowerCase())) {
      eligible.add(`@${clean}`);
    }
  }
  if (eligible.size === 0) {
    return null;
  }
  return `Thanks ${Array.from(eligible).join(', ')}`;
}
```

## 2. Release Please PR Body & Ancestry Guard Validator (TypeScript)

```typescript
export interface ReleasePrValidationInput {
  readonly prBodyText: string;
  readonly labels: readonly string[];
  readonly inventoryTargetSha: string;
  readonly baseBranchHeadSha: string;
}

export interface ReleasePrValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

export function validateReleasePleaseFinalization(
  input: ReleasePrValidationInput
): ReleasePrValidationResult {
  const errors: string[] = [];
  const GITHUB_MAX_BODY_CHARS = 65536;

  if (!input.labels.includes('rea:release-notes-finalized')) {
    errors.push('Missing mandatory "rea:release-notes-finalized" workflow guard label on release PR.');
  }
  if (input.inventoryTargetSha !== input.baseBranchHeadSha) {
    errors.push(
      `Inventory target SHA (${input.inventoryTargetSha}) does not match base branch HEAD (${input.baseBranchHeadSha}). Refresh inventory before publishing.`
    );
  }
  if (input.prBodyText.length > GITHUB_MAX_BODY_CHARS) {
    errors.push(
      `Release PR body length (${input.prBodyText.length}) exceeds GitHub 65,536-character limit.`
    );
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
```

## 3. Single-Section Changelog Splicer & Provenance Footer Attacher (TypeScript)
Update only the target `## [VERSION]` block inside `CHANGELOG.md` and append the mandatory `record --summary` provenance link without altering historical release entries:

```typescript
// src/rea/changelog-splicer.ts
export interface ChangelogUpdateSpec {
  readonly version: string;
  readonly releaseDateIso: string;
  readonly highlights: readonly string[];
  readonly changes: readonly string[];
  readonly fixes: readonly string[];
  readonly provenanceRecordPath: string;
}

export function renderVersionChangelogSection(spec: ChangelogUpdateSpec): string {
  const lines: string[] = [`## [${spec.version}] (${spec.releaseDateIso})`, ''];

  if (spec.highlights.length > 0) {
    lines.push('### Highlights', ...spec.highlights.map((h) => `- ${h}`), '');
  }
  if (spec.changes.length > 0) {
    lines.push('### Changes', ...spec.changes.map((c) => `- ${c}`), '');
  }
  if (spec.fixes.length > 0) {
    lines.push('### Fixes', ...spec.fixes.map((f) => `- ${f}`), '');
  }

  lines.push(`Full contribution provenance: [\`${spec.provenanceRecordPath}\`](${spec.provenanceRecordPath})`);
  return lines.join('\n');
}
```

## Orchestration & Integration

**English & Bahasa Indonesia:** Release changelogs and GitHub release notes for REA. / Changelog rilis dan catatan rilis GitHub untuk REA.

- `reverse-engineer-anything` — product whose releases are documented / produk yang rilisnya didokumentasikan.
- `prd-architect` — continuous documentation sync after code changes / sinkronisasi dokumentasi kontinu pasca perubahan kode.
- `github-actions-expert` — Release Please workflow integration / integrasi workflow Release Please.
- `brainstorming`, `deep-research-analyst` — ideation routing and verification of pinned Git history / perutean ideasi dan verifikasi riwayat Git.
- **Cross-Domain Synergy & Subagent Swarm Integration**: `rea-tool-design`, `rea-analysis-optimization`, `rea-ci-tests-audit`

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Availability Fallback** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec rea-changelog-update <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **NFR & Anti-Slop Invariants** | Zero OWASP Top 10 vectors, 0 hardcoded secrets, >= 90% branch coverage on domain logic, 0 Anti-Slop violations; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec rea-changelog-update <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **Invarian NFR & Anti-Slop** | Nol celah OWASP Top 10, 0 kredensial hardcoded, cakupan pengujian >= 90% pada logika domain, 0 pelanggaran Anti-Slop; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |

### Hard Guardrails (Invarian Deklaratif - Bahasa Indonesia)
1. **Inventaris Sebelum Prosa**: Wajib membuat manifest kontribusi terverifikasi mesin (`docs/releases/VERSION.contributions.json`) dari commit SHA cabang dasar sebelum menyusun catatan rilis.
2. **Nol Fabrikasi Atribusi Handle**: Simpan identitas commit yang tidak terselesaikan sebagai `user: null` di inventaris; dilarang menebak handle GitHub atau memberikan kredit kepada merger PR alih-alih penulis aslinya.
3. **Pengecualian Akun Bot & Agen dari Ucapan Terima Kasih Publik**: Filter dan kecualikan bot seperti `@claude`, `@cursoragent`, `@codex`, `dependabot[bot]`, `github-actions[bot]`, dan `release-please[bot]` dari klausa publik `Thanks @...` dengan tetap menjaga metadata asal-usulnya (provenance).
4. **Deduplikasi Kredit Tunggal**: Berikan kredit pada masing-masing kontributor manusia dan pelapor issue terkonfirmasi tepat satu kali per item pekerjaan; jangan pernah menduplikasi ucapan terima kasih di Highlights dan Changes atau memberikan kredit pada commit yang di-revert.
5. **Gerbang Label Finalisasi Wajib**: Terapkan label `rea:release-notes-finalized` pada Release Please PR yang terbuka sebelum mengedit branch atau body-nya agar refresh otomatis bot tidak menimpa catatan rilis yang telah dikurasi.
6. **Gerbang Batas Karakter 65.536 & Kekerabatan SHA**: Verifikasi bahwa target SHA inventaris cocok dengan HEAD cabang dasar PR rilis dan panjang body PR tetap berada di bawah batas ketat GitHub 65.536 karakter.

#### Non-Functional Requirements (NFR) Khusus Domain
- **Atribusi Terverifikasi 100%**: 0 handle GitHub kontributor yang berhalusinasi atau ditebak sembarangan di catatan rilis.
- **Batas Ukuran Payload**: Panjang teks body PR dibatasi maksimum $\le 65.536\text{ karakter}$ untuk mencegah penolakan API GitHub.
- **Deduplikasi Provenance**: Setiap penulis commit dan pelapor issue dikreditkan tepat satu kali per seksi.
