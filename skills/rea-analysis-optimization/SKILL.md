---
name: rea-analysis-optimization
description: Optimize REA providers and shared analysis workflows for agent context, latency, CPU, and memory while preserving correctness and Evidence. Use for analysis bottlenecks and cache or query design; CI/test-suite optimization belongs to rea-ci-tests-audit.
author: "morluto"
version: "4.4.3"
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

## Orchestration & Integration

**English & Bahasa Indonesia:** Latency, CPU, memory, and agent-context optimization for REA analysis paths. / Optimasi latensi, CPU, memori, dan konteks agen untuk jalur analisis REA.

- `reverse-engineer-anything`, `rea-tool-design` — providers and contracts being optimized / provider dan kontrak yang dioptimasi.
- `rea-ci-tests-audit` — owns CI/test-suite efficiency; hand off there / pemilik efisiensi CI; serahkan ke sana.
- `app-analyzer-optimizer` — profiling and bottleneck detection / profiling dan deteksi bottleneck.
- `context-window-engineer`, `kv-cache-prefix-optimizer` — agent context budget and cache reuse / budget konteks agen dan reuse cache.
- `brainstorming`, `deep-research-analyst` — ideation routing and evidence review / perutean ideasi dan tinjauan bukti.
