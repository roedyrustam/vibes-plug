---
name: rea-analysis-optimization
description: "Optimize REA providers, analysis latency, memory, and Evidence / Optimasi provider REA, latensi analisis, memori, dan Evidence."
author: "morluto"
version: "4.7.2"
---

# REA analysis optimization

Find a concrete source of unnecessary work, change it at its owner, and verify
equivalent completed investigations. A useful outcome can also be a measured
decision to leave an implementation alone.

Follow the checkout's [performance priorities](../../../AGENTS.md#performance),
[tool design](../../../docs/tool-design.md), and
[testing guide](../../../docs/testing.md). This skill supplies an optimization
workflow, not additional permission to execute targets, publish, or merge.
Use the current contracts, provider prerequisites, and user authorization.

Read [the Kuna case study](references/kuna-case-study.md) when selecting a
reuse strategy or interpreting a benchmark. Its pinned observations illustrate
tradeoffs; they are not current-provider guarantees or universal speedups.

## Hard Guardrails (Declarative Invariants)
- **Independent Correctness Oracle**: Verify every optimization against an oracle independent of the modified code path (source-built fixtures, raw byte mappings, or verified native output) before claiming a speedup.
- **Content-Addressed Cache Keys**: Include target artifact SHA-256, provider engine ID/version, architecture/load-map options, and schema version in every analysis cache key.
- **Isolated Waiter Cancellation**: When multiple callers await a shared in-flight analysis producer, cancelling one caller's `AbortSignal` must never abort or corrupt the shared producer for remaining peers.
- **Bounded Process-Family Memory**: Enforce hard byte budgets on retained caches and subprocess outputs before allocation; never trade a transport buffer cap for an unbounded in-memory inventory.
- **Early Selection & Projection at Producer**: Push address-range and section filters down to the native provider boundary rather than materializing multi-megabyte full-binary reports and slicing them in CLI/MCP wrappers.
- **Preserve Examined Scope & Same-Address Candidates**: Optimizations must never drop alternative symbols at the same address or omit `examinedScope` coverage metadata.

### Domain-Specific Non-Functional Requirements (NFRs)
- **Bounded Heap & Process Memory**: Retained in-memory cache and subprocess outputs capped at $\le 512\text{ MB}$.
- **Content-Addressed Cache Hit Rate**: Shared in-flight deduplication and cache hit rate $\ge 80\%$ on repeated analysis queries.
- **Cancellation Safety**: $0$ leaked subprocesses or corrupted shared promises when individual callers trigger `AbortSignal`.

## Pin the question and the correctness oracle

Describe the analyst's completed task, including the facts and relationships
needed to answer it, requested detail, source access, and meaningful unknowns.
Choose a representative real artifact and a small or empty case. Record the
baseline revision, target digest, engine identity, options, host, and entrypoint.
Use a separate checkout for changes without disturbing other work.

Establish an oracle independent of the changed implementation: source-built
fixture expectations, independently mapped file bytes, or a native producer
paired with checks of its interpretation. Comparing two wrappers around the
same faulty decoder does not establish correctness. Preserve address widths,
same-address alternatives, unresolved endpoints, coverage, and source linkage.
An empty result proves absence only within the actually examined scope.

## Locate the earliest unnecessary work

Trace one public CLI or MCP task through shared application code to its producer.
Measure relevant phases: admission and identity checks, native analysis,
decoding, lookup, projection, serialization, Evidence retention, and cleanup.
Include catalog discovery and extra calls when they affect the completed task.

Use the evidence to choose the smallest structural correction:

| Observed cost                     | Candidate correction                                       | Condition to establish                                                               |
| --------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Repeated scans of validated facts | Reuse existing order or lookup structure                   | The owner establishes ordering and identity; every matching alternative survives     |
| Repeated equivalent engine work   | Share a validated result or in-flight producer             | Inputs, freshness, lifetime, and per-caller outcomes remain explicit                 |
| Full reports for selected facts   | Push selection or projection to the earliest capable owner | Required facts and evidence remain reachable; examined coverage is reported          |
| Large temporary transport buffers | Decode incrementally or use bounded source reads           | Validate the whole admitted document; retained facts and copies still consume memory |
| Many repeated homogeneous reads   | Share admission, decoding, or batch work                   | Preserve item identity, order where required, and individual failures                |

Do not introduce an index, generic cache, batch endpoint, or orchestration layer
without identifying the work it removes and its maintenance/resource cost.
Projection after materializing a full report may reduce output while leaving
analysis time and peak memory unchanged. Fix missing or incorrect facts before
benchmarking an alternative composition against a better-covered workflow.

## Keep one interpretation and a defined reuse lifetime

Let the producer boundary validate and normalize facts once. Consumers query
that representation through the shared CLI/MCP implementation; adapters should
not rebuild relationships or independently reinterpret raw reports. Keep lookup
identity separate from display formatting. Reuse contracts when their intent
matches, honoring requested detail and complete Evidence access.

For every cache or shared producer, state its key, owner, invalidation, retained
size, and lifetime. Account for result-affecting target bytes, engine contents,
analysis options, architecture/load mapping, and parser/schema versions where
they affect reuse. Validate live state before calling a cached observation
current. Cache a refusal only when it is deterministic for that validated key;
malformed, partial, transient, or cancelled attempts need explicit retry policy.

One cancelled waiter must not invalidate a successful peer. Preserve producer
failure context and each caller's cancellation reason. Retain ownership and
capacity charges until shared work and cleanup settle; preserve completed
observations when cleanup fails. Exercise invalidation, concurrent consumers,
last-waiter cancellation, close, and cleanup retry when those paths change.

Bound the process family and retained state, not just a parent heap or worker
count. Account for decoding and serialization expansion before allocation.
Choose CPU, memory, concurrency, and disk limits from the host and workload;
stop before OOM and verify owned cleanup. A guard-stopped task is incomplete.
Do not replace a transport buffer cap with an unbounded retained inventory or
hide partial results behind a success status.

## Compare completed tasks and limit the claim

Run the affected real public workflow before and after with equivalent inputs,
results, coverage, and Evidence semantics. Include small inputs so setup costs
and regressions are visible. Distinguish fresh sessions, warm runtime caches,
and OS file caches. Alternate or repeat runs when variance affects the decision.
Choose meaningful boundary regressions for cases the actual engine cannot
reliably reproduce; a fake engine does not qualify a real provider.

Report task outcome, relevant phase timings, total elapsed and CPU time, peak
process-family memory and its accounting method, resource stops, and cleanup.
Check the payload exit status as well as the profiler's. Keep failed attempts
and identify unmeasured costs; a passing retry does not explain a failure.

For token claims, count schemas/discovery, arguments, replies, retries, and
continuations needed to finish the task. Label tokenizer estimates separately
from actual model usage and record the client/catalog behavior. Smaller JSON
alone establishes neither fewer model tokens nor better investigation quality.
Do not claim a complex-software advantage without completed representative
investigations and comparable correctness/coverage.

Finish with the bottleneck, owning change, preserved semantics, executed
checks, before/after measurements, and remaining limits. Keep any integration
record current with its tested revision and distinguish merged production work
from experiment-only code. Stop when the demonstrated bottleneck is resolved
or further benefit remains speculative.

## 1. Bounded Cache Key & Benchmark Record (TypeScript)

```typescript
export interface ReaAnalysisCacheKey {
  readonly targetSha256: string;
  readonly engineId: string;
  readonly engineVersion: string;
  readonly archAndLoadMap: string;
  readonly schemaVersion: string;
}

export function formatReaCacheKey(k: ReaAnalysisCacheKey): string {
  return `${k.engineId}@${k.engineVersion}:${k.schemaVersion}:${k.archAndLoadMap}:${k.targetSha256}`;
}
```

## 2. In-Flight Producer Coalescing with Isolated Waiter Cancellation (TypeScript)

```typescript
export class BoundedReaProducerCache<V> {
  private readonly store = new Map<string, { value: V; byteEstimate: number }>();
  private readonly inFlight = new Map<string, Promise<V>>();
  private retainedBytes = 0;

  constructor(private readonly maxRetainedBytes: number = 64 * 1024 * 1024) {}

  async getOrCompute(
    key: string,
    signal: AbortSignal,
    producer: () => Promise<{ value: V; byteEstimate: number }>
  ): Promise<V> {
    if (signal.aborted) {
      throw new Error('Caller aborted before analysis admission');
    }
    const cached = this.store.get(key);
    if (cached) return cached.value;

    let sharedPromise = this.inFlight.get(key);
    if (!sharedPromise) {
      sharedPromise = producer()
        .then(({ value, byteEstimate }) => {
          if (byteEstimate <= this.maxRetainedBytes) {
            while (this.retainedBytes + byteEstimate > this.maxRetainedBytes && this.store.size > 0) {
              const oldestKey = this.store.keys().next().value;
              if (!oldestKey) break;
              const removed = this.store.get(oldestKey);
              this.store.delete(oldestKey);
              this.retainedBytes -= removed?.byteEstimate ?? 0;
            }
            this.store.set(key, { value, byteEstimate });
            this.retainedBytes += byteEstimate;
          }
          return value;
        })
        .finally(() => {
          this.inFlight.delete(key);
        });
      this.inFlight.set(key, sharedPromise);
    }

    return new Promise<V>((resolve, reject) => {
      const onAbort = () => reject(new Error('Caller waiter cancelled without invalidating shared producer'));
      signal.addEventListener('abort', onAbort, { once: true });
      sharedPromise!
        .then((val) => {
          signal.removeEventListener('abort', onAbort);
          resolve(val);
        })
        .catch((err) => {
          signal.removeEventListener('abort', onAbort);
          reject(err);
        });
    });
  }
}
```

## 3. Token-Budgeted Call-Graph & Evidence Pager (TypeScript)

```typescript
export interface CallGraphNode {
  readonly address: string;
  readonly symbol: string;
  readonly callers: readonly string[];
  readonly callees: readonly string[];
}

export interface PaginatedCallGraphSlice {
  readonly nodes: readonly CallGraphNode[];
  readonly examinedCount: number;
  readonly totalAvailable: number;
  readonly nextCursor: string | null;
}

export function paginateCallGraphByTokenBudget(
  sortedNodes: readonly CallGraphNode[],
  cursorAddress: string | null,
  maxTokenBudget: number = 1200
): PaginatedCallGraphSlice {
  const startIndex = cursorAddress
    ? Math.max(0, sortedNodes.findIndex((n) => n.address === cursorAddress))
    : 0;

  const selected: CallGraphNode[] = [];
  let usedTokens = 0;
  let idx = startIndex;

  while (idx < sortedNodes.length) {
    const candidate = sortedNodes[idx];
    const estimatedNodeTokens = Math.ceil(JSON.stringify(candidate).length / 4);
    if (selected.length > 0 && usedTokens + estimatedNodeTokens > maxTokenBudget) {
      return {
        nodes: selected,
        examinedCount: selected.length,
        totalAvailable: sortedNodes.length,
        nextCursor: candidate.address
      };
    }
    selected.push(candidate);
    usedTokens += estimatedNodeTokens;
    idx += 1;
  }

  return {
    nodes: selected,
    examinedCount: selected.length,
    totalAvailable: sortedNodes.length,
    nextCursor: null
  };
}
```

## 4. Phase-Instrumented Analysis Profiler & Memory High-Water Tracker (TypeScript)
Measure admission, native provider execution, decoding, and projection phases along with RSS memory delta so optimizations target proven bottlenecks:

```typescript
// src/rea/phase-profiler.ts
export interface PhaseMeasurement {
  readonly phase: string;
  readonly durationMs: number;
  readonly rssDeltaBytes: number;
}

export class ReaPhaseProfiler {
  private readonly measurements: PhaseMeasurement[] = [];

  public async measurePhase<T>(phase: string, fn: () => Promise<T>): Promise<T> {
    const startRss = process.memoryUsage().rss;
    const startNs = process.hrtime.bigint();
    try {
      return await fn();
    } finally {
      const durationMs = Number(process.hrtime.bigint() - startNs) / 1_000_000;
      const rssDeltaBytes = process.memoryUsage().rss - startRss;
      this.measurements.push({
        phase,
        durationMs: Math.round(durationMs * 100) / 100,
        rssDeltaBytes,
      });
    }
  }

  public summary(): { totalMs: number; peakRssDeltaBytes: number; phases: readonly PhaseMeasurement[] } {
    let totalMs = 0;
    let peakRssDeltaBytes = 0;
    for (const m of this.measurements) {
      totalMs += m.durationMs;
      if (m.rssDeltaBytes > peakRssDeltaBytes) {
        peakRssDeltaBytes = m.rssDeltaBytes;
      }
    }
    return {
      totalMs: Math.round(totalMs * 100) / 100,
      peakRssDeltaBytes,
      phases: this.measurements,
    };
  }
}
```

## 5. Streaming Bounded Binary Section Reader (TypeScript)
Read and scan only the requested ELF/PE virtual section range from disk without loading multi-hundred-megabyte binaries into the V8 heap:

```typescript
// src/rea/bounded-section-reader.ts
import fs from 'node:fs/promises';

export interface SectionSliceRequest {
  readonly filePath: string;
  readonly fileOffset: number;
  readonly byteLength: number;
  readonly maxAllowedBytes?: number;
}

export async function readBoundedSectionSlice(req: SectionSliceRequest): Promise<Buffer> {
  const maxBytes = req.maxAllowedBytes ?? 16 * 1024 * 1024;
  if (req.byteLength <= 0 || req.byteLength > maxBytes) {
    throw new Error(`Requested section slice (${req.byteLength}B) exceeds safety cap (${maxBytes}B)`);
  }

  const handle = await fs.open(req.filePath, 'r');
  try {
    const buffer = Buffer.allocUnsafe(req.byteLength);
    const { bytesRead } = await handle.read(buffer, 0, req.byteLength, req.fileOffset);
    return bytesRead === req.byteLength ? buffer : buffer.subarray(0, bytesRead);
  } finally {
    await handle.close();
  }
}
```

## Orchestration & Integration

**English & Bahasa Indonesia:** Latency, CPU, memory, and agent-context optimization for REA analysis paths. / Optimasi latensi, CPU, memori, dan konteks agen untuk jalur analisis REA.

- `reverse-engineer-anything`, `rea-tool-design` — providers and contracts being optimized / provider dan kontrak yang dioptimasi.
- `rea-ci-tests-audit` — owns CI/test-suite efficiency; hand off there / pemilik efisiensi CI; serahkan ke sana.
- `app-analyzer-optimizer` — profiling and bottleneck detection / profiling dan deteksi bottleneck.
- `context-window-engineer`, `kv-cache-prefix-optimizer` — agent context budget and cache reuse / budget konteks agen dan reuse cache.
- `brainstorming`, `deep-research-analyst` — ideation routing and evidence review / perutean ideasi dan tinjauan bukti.
- **Cross-Domain Synergy & Subagent Swarm Integration**: `rea-changelog-update`, `performance-web-vitals`

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Availability Fallback** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec rea-analysis-optimization <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **NFR & Anti-Slop Invariants** | Zero OWASP Top 10 vectors, 0 hardcoded secrets, >= 90% branch coverage on domain logic, 0 Anti-Slop violations; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec rea-analysis-optimization <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **Invarian NFR & Anti-Slop** | Nol celah OWASP Top 10, 0 kredensial hardcoded, cakupan pengujian >= 90% pada logika domain, 0 pelanggaran Anti-Slop; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |

### Hard Guardrails (Invarian Deklaratif - Bahasa Indonesia)
1. **Oracle Kebenaran Independen**: Wajib memverifikasi setiap optimasi terhadap oracle independen dari jalur kode yang dimodifikasi (fixture bawaan sumber, pemetaan byte mentah, atau output native tervalidasi) sebelum mengklaim peningkatan kecepatan.
2. **Kunci Cache Berbasis Konten (Content-Addressed)**: Sertakan SHA-256 berkas target, ID/versi mesin provider, opsi arsitektur/load-map, dan versi skema dalam setiap kunci cache analisis.
3. **Pembatalan Penunggu Terisolasi (Isolated Waiter Cancellation)**: Saat beberapa pemanggil menunggu satu produser analisis bersama, pembatalan `AbortSignal` dari satu pemanggil tidak boleh membatalkan atau merusak produser yang sedang berjalan untuk pemanggil lain.
4. **Batas Memori Proses & Cache Terbatas**: Terapkan anggaran memori byte yang ketat pada cache dan output subprocess sebelum alokasi; jangan pernah menukar batasan buffer transport dengan penumpukan inventaris memori tak terbatas.
5. **Seleksi & Proyeksi Dini di Tingkat Produser**: Dorong filter rentang alamat dan seksi langsung ke perbatasan provider native daripada memuat laporan biner raksasa berukuran megabyte lalu memotongnya di wrapper CLI/MCP.
6. **Preservasi Cakupan yang Diperiksa & Kandidat Alamat Sama**: Optimasi dilarang keras membuang simbol alternatif pada alamat yang sama atau menghilangkan metadata cakupan `examinedScope`.

#### Non-Functional Requirements (NFR) Khusus Domain
- **Batas Memori Heap & Subprocess**: Cache in-memory dan output subprocess dibatasi maksimum $\le 512\text{ MB}$.
- **Hit Rate Cache Content-Addressed**: Deduplikasi in-flight bersama dan hit rate cache $\ge 80\%$ pada kueri analisis berulang.
- **Keamanan Pembatalan (Cancellation Safety)**: 0 kebocoran subprocess atau promise bersama yang korup saat pemanggil memicu `AbortSignal`.
