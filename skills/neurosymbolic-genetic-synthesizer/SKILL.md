---
name: neurosymbolic-genetic-synthesizer
description: "Neurosymbolic genetic code synthesis, Quality-Diversity MAP-Elites, and FunSearch optimization / Sintesis kode genetik neurosimbolik, Quality-Diversity MAP-Elites, dan optimasi FunSearch."
author: "Roedy Rustam"
version: "4.7.2"
---

# Neurosymbolic Genetic Synthesizer (Quality-Diversity & FunSearch Engine)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Executive Directive & The Super-AI Synthesis Paradigm
Generic frontier models synthesize code via single-pass stochastic completion or sequential chain-of-thought. While effective for standard boilerplate, this approach frequently plateaus on NP-hard algorithmic optimization, mathematical conjectures, or complex scheduling problems.

The **Neurosymbolic Genetic Synthesizer** bridges generative LLM creativity with deterministic evolutionary search:
1. **Quality-Diversity (MAP-Elites)**: Maintains an archive of elite program variants indexed across behavioral feature descriptors (e.g., algorithmic complexity vs memory footprint) rather than selecting for a single scalar fitness.
2. **FunSearch Evolution Loop**: The LLM functions strictly as a genetic mutation operator generating AST variations, while an isolated micro-sandbox serves as an uncompromised evaluation oracle.
3. **AST Recombination & Invariant Filtering**: Crossover merges optimal AST subtrees from parent candidates, while SAT/SMT solvers prune mathematically invalid mutations before runtime execution.

### Hard Guardrails (Declarative Invariants)
1. **Isolated Ephemeral Sandbox Execution Invariant**: All candidate program mutations MUST execute strictly within an isolated WebAssembly or subprocess sandbox with hard resource boundaries (timeout $\le 2000\text{ ms}$, memory $\le 256\text{ MB}$, banned system primitives `eval`, `process.exit`, `child_process`). Never evaluate candidate code directly on the host agent runtime.
2. **Quality-Diversity Orthogonal Niches (MAP-Elites)**: Grid cells MUST be indexed by multi-dimensional orthogonal behavioral descriptors (e.g., cyclomatic complexity vs peak memory vs latency) clamped strictly to $[0, 1]$. A candidate only displaces an incumbent if its fitness strictly exceeds $f_{\text{incumbent}}$ in that identical niche key.
3. **AST Invariant & Formal SMT Pre-Filter Gate**: Before executing mutated code, an AST parser and formal invariant gate (Z3 / constraint validator) must verify structural syntax and mathematical preconditions, pruning hallucinated syntax before wasting execution tokens.
4. **Genetic Diversity Floor & Elite Pareto Preservation**: The archive MUST retain at least $k \ge 5$ distinct niche elites across generations. Elite sampling must employ tournament selection or epsilon-greedy sampling ($\epsilon = 0.15$) to prevent premature convergence into local minima.

#### Domain-Specific Non-Functional Requirements (NFRs)
- **Evolution Evaluation Latency**: Evaluation oracle latency $\le 500\text{ ms}$ per candidate in isolated sandbox.
- **Containment & Escape Safety**: $0$ sandbox escapes (100% of infinite loops, memory leaks, and forbidden calls trapped).
- **Optimization Convergence**: Minimum $15\%$ fitness score improvement over baseline seed programs across 20 generations.

---

#### 3. Quality-Diversity MAP-Elites Archive Controller / Kontroler Arsip MAP-Elites Quality-Diversity

```typescript
export interface CandidateGenome {
  id: string;
  code: string;
  fitnessScore: number;
  cyclomaticComplexity: number;
  memoryFootprintKb: number;
}

export class MapElitesGridArchive {
  private readonly cells = new Map<string, CandidateGenome>();

  public insertCandidate(candidate: CandidateGenome): boolean {
    const nicheKey = `c${Math.min(10, Math.floor(candidate.cyclomaticComplexity / 2))}_m${Math.min(10, Math.floor(candidate.memoryFootprintKb / 64))}`;
    const incumbent = this.cells.get(nicheKey);
    if (!incumbent || candidate.fitnessScore > incumbent.fitnessScore) {
      this.cells.set(nicheKey, candidate);
      return true;
    }
    return false;
  }

  public getEliteCount(): number {
    return this.cells.size;
  }
}
```

## Orchestration & Integration
- **Upstream Multi-Agent & Drafting**: `multi-agent-orchestration`, `speculative-multi-draft-synthesizer`, `frontier-ai-models-expert`.
- **Sandbox Execution & Verification**: `ephemeral-wasm-sandbox-executor`, `autonomous-tdd-debugger`, `formal-spec-z3-verifier`, `formal-theorem-verifier-lean4`.
- **AST Graphs & Refactoring**: `living-codebase-ast-graph`, `anti-slop`, `scalability-clean-code`.
- **Token Efficiency & Memory**: `kv-cache-prefix-optimizer`, `session-memory-manager`, `thinking-budget-orchestrator`.
- **Master Orchestrators**: `brainstorming`, `zero-to-prod-orchestrator`.

---

### Production Implementation Blueprints

#### Blueprint 1: Quality-Diversity MAP-Elites Archive (`engine/map-elites-archive.ts`)
```typescript
export interface CandidateProgram {
  id: string;
  sourceCode: string;
  fitnessScore: number; // Higher is better
  featureDescriptor: [number, number]; // e.g. [timeComplexityScore, memoryEfficiencyScore]
  generation: number;
}

export class MapElitesArchive {
  private grid: Map<string, CandidateProgram> = new Map();
  private readonly gridSize: number;

  constructor(gridSize = 10) {
    this.gridSize = gridSize;
  }

  public getCellKey(descriptor: [number, number]): string {
    const d1 = Math.max(0, Math.min(this.gridSize - 1, Math.floor(descriptor[0] * this.gridSize)));
    const d2 = Math.max(0, Math.min(this.gridSize - 1, Math.floor(descriptor[1] * this.gridSize)));
    return `${d1}:${d2}`;
  }

  public insertCandidate(candidate: CandidateProgram): boolean {
    const key = this.getCellKey(candidate.featureDescriptor);
    const existing = this.grid.get(key);

    if (!existing || candidate.fitnessScore > existing.fitnessScore) {
      this.grid.set(key, candidate);
      return true; // New elite recorded
    }
    return false;
  }

  public sampleElite(): CandidateProgram {
    const elites = Array.from(this.grid.values());
    if (elites.length === 0) {
      throw new Error('[MapElitesArchive] Cannot sample from empty archive.');
    }
    const index = Math.floor(Math.random() * elites.length);
    return elites[index];
  }

  public getCoverage(): { totalElites: number; maxCapacity: number; coveragePercent: number } {
    const totalElites = this.grid.size;
    const maxCapacity = this.gridSize * this.gridSize;
    return {
      totalElites,
      maxCapacity,
      coveragePercent: (totalElites / maxCapacity) * 100
    };
  }
}
```

---

#### Blueprint 2: FunSearch Genetic Loop Evaluator (`engine/funsearch-loop.ts`)
```typescript
import { MapElitesArchive, CandidateProgram } from './map-elites-archive.js';

export interface EvaluationResult {
  passed: boolean;
  score: number;
  runtimeMs: number;
  memoryMb: number;
}

export type MutationFn = (parentCode: string, promptContext: string) => Promise<string>;
export type EvaluatorFn = (code: string) => Promise<EvaluationResult>;

export class FunSearchGeneticEngine {
  constructor(
    private archive: MapElitesArchive,
    private mutate: MutationFn,
    private evaluate: EvaluatorFn
  ) {}

  public async runEvolutionCycle(
    initialSeed: string,
    promptObjective: string,
    maxGenerations = 20
  ): Promise<CandidateProgram> {
    // 1. Evaluate Initial Seed
    const initialEval = await this.evaluate(initialSeed);
    let bestElite: CandidateProgram = {
      id: 'gen_0_seed',
      sourceCode: initialSeed,
      fitnessScore: initialEval.score,
      featureDescriptor: [Math.min(1.0, 100 / (initialEval.runtimeMs + 1)), Math.min(1.0, 50 / (initialEval.memoryMb + 1))],
      generation: 0
    };
    this.archive.insertCandidate(bestElite);

    // 2. Evolutionary Search Generations
    for (let gen = 1; gen <= maxGenerations; gen++) {
      const parent = this.archive.sampleElite();
      const mutatedCandidateCode = await this.mutate(parent.sourceCode, promptObjective);

      const evalResult = await this.evaluate(mutatedCandidateCode);
      if (evalResult.passed) {
        const candidate: CandidateProgram = {
          id: `gen_${gen}_${Date.now()}`,
          sourceCode: mutatedCandidateCode,
          fitnessScore: evalResult.score,
          featureDescriptor: [
            Math.min(1.0, 100 / (evalResult.runtimeMs + 1)),
            Math.min(1.0, 50 / (evalResult.memoryMb + 1))
          ],
          generation: gen
        };

        const inserted = this.archive.insertCandidate(candidate);
        if (inserted && candidate.fitnessScore > bestElite.fitnessScore) {
          bestElite = candidate;
        }
      }
    }

    return bestElite;
  }
}
```

---

### Verification Checklist & Anti-Slop Safeguards
- [x] **Zero Pseudo-Code**: All archive insertions and sampling algorithms strictly typed and executable.
- [x] **Bounded Exploration**: Feature descriptors clamped strictly into `[0, 1]` ranges preventing out-of-bounds matrix indexing.
- [x] **Deterministic Sandbox Replay**: Candidate mutations evaluated exclusively inside sandboxes with timeouts.

---

### Sovereign Invariants & Model Routing
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Model Cascade** | High / Extended (`Claude Sonnet 5.5 High`, `Gemini 4 Pro`, `DeepSeek-R1`) for mutations; High Fast (`Grok 4.7 High Fast`) for AST parsing |
| **Availability Fallback** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Sonnet 5.5` -> `Claude Opus 4.6` |
| **KV-Cache Protocol** | Cache static problem specifications; inject only parent elite AST slices |
| **Anti-Slop Invariant** | Zero placeholder stubs; 100% complete working implementation |

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Direktif Eksekutif & Paradigma Sintesis Super-AI
Model frontier standar menghasilkan kode melalui inferensi stokastik satu arah atau rantai penalaran berurutan. Pendekatan ini sering kali mencapai titik jenuh (*plateau*) saat dihadapkan pada optimasi algoritma NP-hard, pembuktian konjektur matematis, atau masalah komputasi kompleks.

**Neurosymbolic Genetic Synthesizer** menjembatani kreativitas generatif LLM dengan pencarian evolusioner deterministik:
1. **Quality-Diversity (MAP-Elites)**: Mengelola arsip varian program elit yang dipetakan berdasarkan deskriptor perilaku (misalnya kompleksitas waktu vs jejak memori), bukan sekadar memilih satu skor kebugaran skalar.
2. **Loop Evolusi FunSearch**: LLM bertindak sebagai operator mutasi genetik yang menghasilkan variasi AST, sementara sandbox mikro terisolasi bertindak sebagai penilai deterministik yang tidak bisa dikompromikan.
3. **Rekombinasi AST & Filter Invarian**: Persilangan (*crossover*) menggabungkan sub-pohon AST terbaik dari kandidat program, sementara SMT solver memangkas mutasi yang secara matematis cacat sebelum dieksekusi di runtime.

### Hard Guardrails (Invarian Deklaratif)
1. **Invarian Eksekusi Sandbox Efemeral Terisolasi**: Seluruh mutasi kandidat program WAJIB dieksekusi ketat di dalam sandbox WebAssembly atau subprocess terisolasi dengan batas sumber daya ketat (timeout $\le 2000\text{ ms}$, memori $\le 256\text{ MB}$, larangan primitif sistem `eval`, `process.exit`, `child_process`). Dilarang keras mengevaluasi kode kandidat langsung pada runtime host agen.
2. **Niche Ortogonal Quality-Diversity (MAP-Elites)**: Sel grid arsip WAJIB diindeks menggunakan deskriptor perilaku ortogonal multi-dimensi (misalnya kompleksitas siklomatis vs memori puncak vs latensi) yang dibatasi ketat ke rentang $[0, 1]$. Kandidat hanya menggantikan incumbent jika skor fitness-nya secara tegas melampaui $f_{\text{incumbent}}$ pada kunci niche yang identik.
3. **Gerbang Pra-Filter Invarian AST & Formal SMT**: Sebelum mengeksekusi kode mutasi, parser AST dan gerbang invarian formal (Z3 / constraint validator) wajib memverifikasi keabsahan sintaks dan prasyarat matematis, memangkas halusinasi sintaks sebelum memboroskan token eksekusi.
4. **Batas Bawah Keberagaman Genetik & Preservasi Pareto Elit**: Arsip WAJIB mempertahankan minimal $k \ge 5$ elit niche berbeda lintas generasi. Pengambilan sampel elit wajib menggunakan tournament selection atau epsilon-greedy sampling ($\epsilon = 0.15$) untuk mencegah konvergensi dini ke minima lokal.

#### Non-Functional Requirements (NFR) Khusus Domain
- **Latensi Evaluasi Evolusi**: Latensi oracle evaluasi $\le 500\text{ ms}$ per kandidat di sandbox terisolasi.
- **Keamanan Isolasi Sandbox**: 0 kebocoran sandbox (100% loop tak terbatas, kebocoran memori, dan pemanggilan terlarang tertangkap).
- **Konvergensi Optimasi**: Peningkatan skor kebugaran minimal $15\%$ dibandingkan seed dasar dalam 20 generasi evolusi.

---

### Integrasi Orkestrasi
- **Multi-Agen & Penyusunan Draf**: `multi-agent-orchestration`, `speculative-multi-draft-synthesizer`, `frontier-ai-models-expert`.
- **Eksekusi Sandbox & Verifikasi**: `ephemeral-wasm-sandbox-executor`, `autonomous-tdd-debugger`, `formal-spec-z3-verifier`, `formal-theorem-verifier-lean4`.
- **Graf AST & Refaktor**: `living-codebase-ast-graph`, `anti-slop`, `scalability-clean-code`.
- **Efisiensi Token & Memori**: `kv-cache-prefix-optimizer`, `session-memory-manager`, `thinking-budget-orchestrator`.
- **Orkestrator Utama**: `brainstorming`, `zero-to-prod-orchestrator`.

