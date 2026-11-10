---
name: rea-ci-tests-audit
description: "Audit REA CI and test suites for correctness and measured performance / Audit suite tes dan CI REA untuk ketepatan dan performa terukur."
author: "morluto"
version: "4.7.2"
---

# REA CI and tests audit

Establish which checks still catch real regressions and which costs can be
removed without losing that protection. The outcome may be a verified fix,
an evidence-backed recommendation, or an explicit decision to stop.

Follow the checkout's `AGENTS.md`, [testing guide](../../../docs/testing.md),
and [contribution rules](../../../CONTRIBUTING.md). Use their current commands
and pinned toolchain, rather than commands remembered from an earlier audit.
Preserve the requested scope: investigation alone does not authorize edits;
this skill does not grant permission to publish issues, push, or merge. Existing
user authorization still applies. Keep audit notes and raw results outside the
tracked tree, normally in a task-specific `/tmp` directory.

## Hard Guardrails (Declarative Invariants)
- **Pin Baseline Revision & Isolated Worktree**: Always record the exact git commit SHA, toolchain version, and command arguments before running a CI audit; never mutate another task's working directory.
- **Perturbation Proof for Suspicious Green Tests**: Prove that a test gate actually catches regressions by perturbing the target behavior in an isolated copy and verifying the assertion fails for the expected reason.
- **Separate Fake-Producer Mocks from Real-Engine Coverage**: Never claim Ghidra, LLDB, or browser provider coverage based solely on static mock fixtures; track boundary mocks and real-engine lanes separately.
- **Zero Blanket Retries or Timeout Inflation**: Never mask flaky tests or broken assertions by adding unconditional retry loops, raising timeouts without measurement, or deleting failing test cases.
- **Verify Required Discovery & Negative Paths**: Ensure test discovery fails loudly if a required test file or report artifact is missing, and preserve malformed-input rejection fixtures.
- **Compare Equivalent Completed Workloads**: Only claim a CI speedup when comparing identical completed test coverage with separated setup, build, and execution timings.

### Domain-Specific Non-Functional Requirements (NFRs)
- **Test Suite Flakiness Floor**: False-positive/flaky test failure rate $\le 0.01\%$ across CI matrix runs.
- **Regression Catch Rate**: $100\%$ detection of perturbed behavioral regressions before pull request merge.
- **Audit Overhead Ceiling**: Local audit discovery overhead $< 60\text{ seconds}$ without executing full rebuilds needlessly.

## Establish the executed baseline

Fetch when the user asks for latest main. Pin the baseline SHA and inspected
workflow revision; use an isolated worktree when changing or comparing code.
Do not modify another task's checkout. Record dirty changes and the exact
command, toolchain, host, selected tests, instrumentation, and prerequisites.
An old run is evidence for its executed revision, even if main advances.

Trace workflow triggers, changed-path selection, job dependencies, reusable
actions, package scripts, test discovery, artifact producers, and report gates
through to the commands that actually execute. Include scripts, generated data,
runtime registration, and subprocess boundaries missing from import graphs.
Check positive and negative selection paths: required files must be discovered
once per intended test configuration; deliberate platform/configuration repeats
are separate coverage. A missing explicit test or missing required report must
not turn green. Optional lanes may skip; preserve their stated prerequisites.

Use existing timing and failure artifacts to select suspicious families. Run
relevant checks to establish a baseline; reserve a full local suite for broad
CI diagnosis or uncertainty that focused checks cannot resolve. Do not rebuild
or rerun an unchanged complete suite after every documentation edit.

## Prove the failure or protection

For each candidate, state the expected observable behavior and its owner,
then construct the smallest reproduction against production behavior. Follow
the producer and affected consumers before deciding where to fix it.

- For drift, compare fixtures with current admission requirements, protocol
  replies, named contracts, tool versions, and actual public entrypoints. A
  plausible-looking mock can fail before the behavior its test claims to cover.
  Search the whole affected fixture family, including other version strings.
  Preserve intentionally malformed fixtures and test their intended rejection.
- For a suspicious green test, perturb the relevant behavior in an isolated
  copy or inject a controlled failure. Verify that the existing assertion or
  gate detects it. A test may merely repeat its mock, import abandoned code,
  or hide a subprocess/checker failure. Restore mutations after the experiment.
- For shared setup or pruning, map distinct assertions to their retained
  scenarios. Preserve malformed inputs, cancellation, cleanup failure,
  permissions, capacity, identity, and meaningful concurrency interactions.
  A faster run that skips a case or weakens its oracle is not an improvement.
- For provider coverage, separate fake-producer, boundary, and actual-engine
  evidence. Inspect named skips and prerequisites; fixtures do not establish
  real Ghidra, LLDB, browser, or other provider behavior.

Classify findings as reproduced defects, supported costs, hypotheses, or
unavailable evidence. Record the baseline command, observed output/exit status,
expected result, affected scope, and competing explanation. A failure on main
may be pre-existing; that does not by itself make it irrelevant to a CI audit.
Attribute PR failures using the executed revision and a clean baseline, not
just their resemblance to a previous failure. Retry only to test a specific
transient explanation; retain the original failure and stop when repetition
adds no evidence. A passing retry does not establish a root cause or a fix.

## Assess efficiency without losing the gate

Read [measurement and CI checks](references/measurement-and-ci.md) when
investigating slowness, caching, runner waits, shared artifacts, or log noise.
Compare equivalent completed work before claiming a speedup. Distinguish
setup/build time, test execution, coverage instrumentation, dependency waits,
and runner scheduling; state which costs remain unmeasured.

Prefer removing proven duplicate preparation, reusing immutable setup, and
reducing repeated subprocess work before shrinking correctness coverage.
Preserve independent sessions where lifecycle or concurrency is the oracle.
Keep live tests fresh; a cached previous pass cannot validate current host,
installed provider contents, permissions, or external state.

## Fix, verify, and hand off within scope

If implementation is authorized, make the smallest structural change at the
owning boundary and add a regression that fails on the baseline for the right
reason. Retest affected consumers and meaningful negative paths; verify cache
invalidation or discovery when those mechanisms change. Read the installed
Turbo documentation before changing its configuration or commands.

Run the repository's applicable checks and inspect complete current-head CI
results before an authorized merge. Preserve required coverage and discovery
gates. Do not suppress a failure, add blanket retries, raise timeouts, or delete
distinct assertions solely to make CI green. Changes to these controls need
their own demonstrated reason and retained failure detection.

Report each confirmed issue with exact revision, reproduction, consequence,
proposed correction, and validation limits. Report performance with workload
and measurements, not just a percentage. Use English issue/PR records when
requested; follow the user's assignment, commit identity, review, and merge
preferences without assuming them for other users. Open ready-for-review PRs
only when that lifecycle is authorized. Resolve necessary review findings and
check final main against the tested tree after merging.

Stop when the authorized work is verified, remaining benefits are unproven,
or further changes would trade correctness for speculative speed. List genuine
uncertainties without turning them into additional optimization rounds.

## 1. Audit Finding Record (TypeScript)

```typescript
export type ReaCiFindingKind =
  | 'reproduced-defect'
  | 'supported-cost'
  | 'hypothesis'
  | 'unavailable-evidence';

export interface ReaCiAuditFinding {
  readonly id: string;
  readonly revisionSha: string;
  readonly kind: ReaCiFindingKind;
  readonly command: string;
  readonly exitStatus: number;
  readonly expectedOracle: string;
  readonly observedBehavior: string;
}
```

## 2. Fixture SHA-256 Admission & Protocol Drift Auditor (TypeScript)

```typescript
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

export interface FixtureExpectation {
  readonly fixturePath: string;
  readonly expectedSha256: string;
  readonly schemaVersion: string;
}

export interface FixtureDriftResult {
  readonly fixturePath: string;
  readonly status: 'VALID' | 'MISSING' | 'DIGEST_DRIFT' | 'SCHEMA_DRIFT';
  readonly actualSha256: string | null;
}

export async function auditFixtureManifest(
  expectations: readonly FixtureExpectation[],
  currentSchemaVersion: string
): Promise<FixtureDriftResult[]> {
  return Promise.all(
    expectations.map(async (exp) => {
      try {
        const bytes = await fs.readFile(exp.fixturePath);
        const actualSha256 = crypto.createHash('sha256').update(bytes).digest('hex');
        if (actualSha256 !== exp.expectedSha256) {
          return { fixturePath: exp.fixturePath, status: 'DIGEST_DRIFT', actualSha256 };
        }
        if (exp.schemaVersion !== currentSchemaVersion) {
          return { fixturePath: exp.fixturePath, status: 'SCHEMA_DRIFT', actualSha256 };
        }
        return { fixturePath: exp.fixturePath, status: 'VALID', actualSha256 };
      } catch {
        return { fixturePath: exp.fixturePath, status: 'MISSING', actualSha256: null };
      }
    })
  );
}
```

## 3. Suspicious Green-Test & Vacuous Assertion Scanner (TypeScript)

```typescript
export interface VacuousTestFinding {
  readonly testName: string;
  readonly reason: 'NO_ASSERTION_CALL' | 'TRIVIAL_TAUTOLOGY' | 'SWALLOWED_SUBPROCESS_EXIT';
}

export function detectVacuousTestBlocks(testFileSource: string): VacuousTestFinding[] {
  const findings: VacuousTestFinding[] = [];
  const testBlockRegex = /(?:it|test)\(\s*['"`]([^'"`]+)['"`]\s*,\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{([\s\S]*?)\}\s*\)/g;
  let match: RegExpExecArray | null;

  while ((match = testBlockRegex.exec(testFileSource)) !== null) {
    const testName = match[1];
    const body = match[2];

    const hasAssertion = /\b(?:assert|expect)\b/.test(body);
    if (!hasAssertion) {
      findings.push({ testName, reason: 'NO_ASSERTION_CALL' });
      continue;
    }
    if (/expect\(\s*true\s*\)\.toBe\(\s*true\s*\)|assert\.ok\(\s*true\s*\)/.test(body)) {
      findings.push({ testName, reason: 'TRIVIAL_TAUTOLOGY' });
    }
    if (/spawnSync|execFile/.test(body) && !/status|exitCode|rejects|throws/.test(body)) {
      findings.push({ testName, reason: 'SWALLOWED_SUBPROCESS_EXIT' });
    }
  }

  return findings;
}
```

## 4. Test Discovery & Required Lane Completeness Verifier (TypeScript)
Ensure CI never turns green when a required test lane silently skips or discovers zero test files:

```typescript
// src/rea/ci-lane-completeness.ts
export interface CiLaneExecutionReport {
  readonly laneId: string;
  readonly required: boolean;
  readonly discoveredTestFiles: number;
  readonly executedAssertions: number;
  readonly exitCode: number;
}

export function verifyCiLaneCompleteness(
  lanes: readonly CiLaneExecutionReport[]
): { passed: boolean; failures: string[] } {
  const failures: string[] = [];

  for (const lane of lanes) {
    if (lane.exitCode !== 0) {
      failures.push(`Lane "${lane.laneId}" exited with status ${lane.exitCode}`);
      continue;
    }
    if (lane.required && lane.discoveredTestFiles === 0) {
      failures.push(`Required lane "${lane.laneId}" discovered 0 test files (vacuous green pass)`);
    }
    if (lane.required && lane.executedAssertions === 0) {
      failures.push(`Required lane "${lane.laneId}" executed 0 assertions`);
    }
  }

  return {
    passed: failures.length === 0,
    failures,
  };
}
```

## 5. Phase-Segmented CI Timing Delta Comparator (TypeScript)
Compare baseline vs. candidate CI runs across separated `setupMs`, `buildMs`, and `testExecMs` phases while enforcing identical test counts:

```typescript
// src/rea/ci-timing-comparator.ts
export interface CiPhaseMetrics {
  readonly revisionSha: string;
  readonly setupMs: number;
  readonly buildMs: number;
  readonly testExecMs: number;
  readonly passedTestCount: number;
}

export function compareCiBenchmarkRuns(
  baseline: CiPhaseMetrics,
  candidate: CiPhaseMetrics
): { equivalentCoverage: boolean; totalSavedMs: number; phaseDeltaMs: Record<string, number> } {
  const equivalentCoverage = candidate.passedTestCount >= baseline.passedTestCount;
  const baselineTotal = baseline.setupMs + baseline.buildMs + baseline.testExecMs;
  const candidateTotal = candidate.setupMs + candidate.buildMs + candidate.testExecMs;

  return {
    equivalentCoverage,
    totalSavedMs: baselineTotal - candidateTotal,
    phaseDeltaMs: {
      setup: candidate.setupMs - baseline.setupMs,
      build: candidate.buildMs - baseline.buildMs,
      testExec: candidate.testExecMs - baseline.testExecMs,
    },
  };
}
```

## Orchestration & Integration

**English & Bahasa Indonesia:** Evidence-first CI and test-suite auditing for REA. / Audit CI dan test suite REA berbasis bukti.

- `reverse-engineer-anything`, `rea-tool-design` — owners of the behavior under test / pemilik perilaku yang diuji.
- `rea-analysis-optimization` — handoff for analysis-path (non-CI) performance work / serah terima untuk optimasi jalur analisis.
- `github-actions-expert`, `ci-cd-devops-architect` — workflow triggers, caching, and job graphs / trigger workflow, cache, dan graf job.
- `autonomous-tdd-debugger`, `property-mutation-testing-expert` — failure reproduction and mutation-based gate verification / reproduksi kegagalan dan verifikasi gate via mutasi.
- `brainstorming`, `deep-research-analyst` — ideation routing and evidence review / perutean ideasi dan tinjauan bukti.
- **Cross-Domain Synergy & Subagent Swarm Integration**: `rea-changelog-update`, `e2e-testing-expert`

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Availability Fallback** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec rea-ci-tests-audit <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **NFR & Anti-Slop Invariants** | Zero OWASP Top 10 vectors, 0 hardcoded secrets, >= 90% branch coverage on domain logic, 0 Anti-Slop violations; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec rea-ci-tests-audit <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **Invarian NFR & Anti-Slop** | Nol celah OWASP Top 10, 0 kredensial hardcoded, cakupan pengujian >= 90% pada logika domain, 0 pelanggaran Anti-Slop; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |

### Hard Guardrails (Invarian Deklaratif - Bahasa Indonesia)
1. **Kunci Revisi Baseline & Worktree Terisolasi**: Selalu catat commit SHA git yang tepat, versi toolchain, dan argumen perintah sebelum menjalankan audit CI; dilarang memutasi direktori kerja tugas lain.
2. **Bukti Perturbasi untuk Tes Hijau yang Mencurigakan**: Buktikan bahwa sebuah gate tes benar-benar menangkap regresi dengan memodifikasi/merusak perilaku target pada salinan terisolasi dan memastikan assertion gagal sesuai alasan yang diharapkan.
3. **Pemisahan Mock Produser Palsu dari Cakupan Mesin Nyata**: Dilarang mengklaim cakupan engine Ghidra, LLDB, atau browser hanya berdasarkan fixture mock statis; pisahkan pelacakan mock perbatasan dari jalur engine nyata.
4. **Nol Retry Membabi Buta atau Penggelembungan Timeout**: Dilarang menyamarkan tes flaky atau assertion rusak dengan menambahkan loop retry tanpa syarat, menaikkan batas waktu timeout tanpa pengukuran, atau menghapus kasus uji yang gagal.
5. **Verifikasi Penemuan Wajib & Jalur Negatif**: Pastikan proses penemuan tes gagal secara vokal jika file tes atau artefak laporan yang wajib hilang, serta pertahankan fixture penolakan input cacat (malformed).
6. **Perbandingan Beban Kerja Selesai yang Setara**: Hanya klaim percepatan CI jika membandingkan cakupan pengujian yang identik dengan memisahkan waktu setup, build, dan eksekusi tes.

#### Non-Functional Requirements (NFR) Khusus Domain
- **Batas Flakiness Suite Pengujian**: Tingkat kegagalan palsu/flaky $\le 0.01\%$ pada seluruh matriks runner CI.
- **Tingkat Deteksi Regresi**: 100% deteksi regresi perilaku yang terganggu sebelum penggabungan pull request.
- **Batas Overhead Waktu Nyata**: Overhead penemuan audit lokal $< 60\text{ detik}$ tanpa menjalankan kompilasi ulang penuh yang tidak perlu.
