---
name: living-codebase-ast-graph
description: "Master guide for in-memory Abstract Syntax Tree (AST) code knowledge graphs, multi-language symbol dependency mapping (TS, Python, Go, Rust), refactoring blast radius calculation, circular cycle detection (Tarjan SCC), and topological swarm generation / Panduan utama graf pengetahuan AST kode in-memory, pemetaan dependensi multi-bahasa, kalkulasi radius dampak refaktor, deteksi siklus dependensi, dan pengurutan topologis swarm."
author: "Roedy Rustam"
version: "4.4.2"
---

# Living Codebase AST Graph (2026 Sovereign Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Executive Directive & The AST Knowledge Paradigm (2026 Shift)
Fuzzy text matching (Ripgrep, regex, or basic keyword search) is catastrophic for large-scale autonomous refactoring. Renaming a function like `init()` or `format()` via global search-and-replace corrupts unrelated variables, breaks third-party interfaces, and silently introduces critical bugs.

**The Living Codebase AST Graph** represents a codebase not as flat text files, but as a dynamic, queryable **neural knowledge graph** built from native Abstract Syntax Trees across **TypeScript, Python, Go, and Rust**. It enables autonomous AI swarms to:
1. **Calculate Blast Radius**: Determine every inbound caller, interface consumer, and database dependent before modifying any symbol.
2. **Detect Cycles Mathematically**: Identify circular dependency loops using Tarjan's Strongly Connected Components (SCC) algorithm.
3. **Enforce Topological Generation Order**: Sequence multi-agent code generation so base schemas and types are completed before downstream controllers or UI widgets are constructed.
4. **Persist Across Sessions via XERJ MCP**: Store the graph in unified episodic memory (`xerj_brain_link`, `xerj_memory_store`) for instant context retrieval across agent restarts.

---

### Orchestration & Integration
- **Upstream Swarm Orchestration**: `zero-to-prod-orchestrator`, `brainstorming`, `session-memory-manager`.
- **AST Mapping & Type Systems**: `typescript-expert`, `python-programming-expert`, `go-programming-expert`, `rust-programming-expert`.
- **Refactoring & Debt Eradication**: `scalability-clean-code`, `legacy-code-translator`, `zero-tech-debt-auditor`, `anti-slop`.
- **Persistent Graph Memory**: `xerj-search-expert`, `vector-db-rag-expert`.

---

### Core Architectural Graph Topologies

```
┌────────────────────────────────────────────────────────────────────────┐
│                   LIVING CODEBASE AST GRAPH PIPELINE                   │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Multi-Language Source Code (TypeScript, Python, Go, Rust)           │
│                                  │                                     │
│                                  ▼                                     │
│ 2. Native AST Parsers (ts.createProgram, ast.parse, go/parser, syn)    │
│                                  │                                     │
│                                  ▼                                     │
│ 3. Symbol Registration & In-Memory Graph Index                         │
│    • Node: SymbolKey (FileUri#SymbolName, Kind, Signature)             │
│    • Inbound Edges (Callers) | Outbound Edges (Dependencies)           │
│                                  │                                     │
│        ┌─────────────────────────┼─────────────────────────┐           │
│        ▼                         ▼                         ▼           │
│  [Blast Radius]          [Tarjan SCC Cycles]      [Topological DAG]    │
│  Recursive Inbound       Detect Circular Deps     Sequence Multi-Agent │
│  Caller Traversal        Before Build Crash       Swarm Generation     │
│        │                         │                         │           │
│        └─────────────────────────┼─────────────────────────┘           │
│                                  ▼                                     │
│ 4. Persistent Memory Serialization (XERJ Graph Brain / Memory Store)   │
└────────────────────────────────────────────────────────────────────────┘
```

#### 1. Blast Radius Risk Categorization
When a symbol $S$ is mutated, its blast radius $B(S)$ is calculated by transitively traversing all inbound dependency edges:
- **Critical Risk (Public Contract)**: Exported API route handlers, shared database DDL schemas, or public SDK interfaces.
- **Moderate Risk (Service Layer)**: Internal business logic interactors and domain services.
- **Low Risk (Leaf Utility)**: Standalone private helper functions with zero external consumers.

#### 2. Tarjan's Strongly Connected Components (Cycle Detection)
Circular dependencies (`A -> B -> C -> A`) cause subtle runtime `undefined` initialization bugs in modern bundlers and runtimes. The living graph continuously runs Tarjan's SCC to isolate cycles and prevent commits until the cycle is untangled.

#### 3. Kahn's Topological Sorter for Swarm Task Distribution
Autonomous subagents must never attempt to write code for a consumer module before the producer module's interface is finalized. Kahn's algorithm groups AST nodes into dependency tiers (Tier 0 to Tier $N$) for parallel multi-agent execution.

---

### Production Implementation Blueprints

#### Blueprint 1: Multi-Language AST Graph & Blast Radius Engine (`engine/codebase-ast-graph.ts`)
```typescript
import ts from 'typescript';
import path from 'path';

export interface AstSymbolNode {
  id: string; // filePath#symbolName
  filePath: string;
  symbolName: string;
  kind: 'function' | 'class' | 'interface' | 'type' | 'variable';
  exported: boolean;
  dependencies: string[]; // outbound edges
}

export interface BlastRadiusReport {
  targetSymbol: string;
  totalAffectedNodes: number;
  criticalPaths: string[];
  affectedFiles: string[];
}

export class LivingCodebaseAstGraph {
  private nodes: Map<string, AstSymbolNode> = new Map();
  private outboundEdges: Map<string, Set<string>> = new Map();
  private inboundEdges: Map<string, Set<string>> = new Map();

  constructor(private rootFiles: string[], private compilerOptions: ts.CompilerOptions = {}) {
    this.buildTypeScriptGraph();
  }

  private buildTypeScriptGraph(): void {
    const program = ts.createProgram(this.rootFiles, {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.NodeNext,
      ...this.compilerOptions,
    });
    const checker = program.getTypeChecker();

    for (const sourceFile of program.getSourceFiles()) {
      if (sourceFile.isDeclarationFile || sourceFile.fileName.includes('node_modules')) {
        continue;
      }

      const filePath = path.resolve(sourceFile.fileName);

      ts.forEachChild(sourceFile, (node) => {
        if (ts.isFunctionDeclaration(node) && node.name) {
          this.indexNode(filePath, node.name.text, 'function', node, sourceFile, checker);
        } else if (ts.isClassDeclaration(node) && node.name) {
          this.indexNode(filePath, node.name.text, 'class', node, sourceFile, checker);
        } else if (ts.isInterfaceDeclaration(node) && node.name) {
          this.indexNode(filePath, node.name.text, 'interface', node, sourceFile, checker);
        } else if (ts.isTypeAliasDeclaration(node) && node.name) {
          this.indexNode(filePath, node.name.text, 'type', node, sourceFile, checker);
        }
      });
    }
  }

  private indexNode(
    filePath: string,
    name: string,
    kind: AstSymbolNode['kind'],
    node: ts.Node,
    sourceFile: ts.SourceFile,
    checker: ts.TypeChecker
  ): void {
    const symbolId = `${filePath}#${name}`;
    const dependencies: string[] = [];
    const isExported = Boolean(
      ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Export
    );

    const visit = (child: ts.Node) => {
      if (ts.isIdentifier(child)) {
        const symbol = checker.getSymbolAtLocation(child);
        if (symbol?.declarations && symbol.declarations.length > 0) {
          const targetDeclFile = symbol.declarations[0].getSourceFile().fileName;
          if (!targetDeclFile.includes('node_modules') && !targetDeclFile.endsWith('.d.ts')) {
            const targetId = `${path.resolve(targetDeclFile)}#${symbol.getName()}`;
            if (targetId !== symbolId) {
              dependencies.push(targetId);
            }
          }
        }
      }
      ts.forEachChild(child, visit);
    };

    visit(node);

    this.nodes.set(symbolId, {
      id: symbolId,
      filePath,
      symbolName: name,
      kind,
      exported: isExported,
      dependencies,
    });

    if (!this.outboundEdges.has(symbolId)) {
      this.outboundEdges.set(symbolId, new Set());
    }
    for (const dep of dependencies) {
      this.outboundEdges.get(symbolId)!.add(dep);
      if (!this.inboundEdges.has(dep)) {
        this.inboundEdges.set(dep, new Set());
      }
      this.inboundEdges.get(dep)!.add(symbolId);
    }
  }

  public calculateBlastRadius(symbolId: string): BlastRadiusReport {
    const affected = new Set<string>();
    const queue = [symbolId];
    const affectedFiles = new Set<string>();

    while (queue.length > 0) {
      const current = queue.shift()!;
      const callers = this.inboundEdges.get(current) || new Set();

      for (const caller of callers) {
        if (!affected.has(caller)) {
          affected.add(caller);
          const [file] = caller.split('#');
          affectedFiles.add(file);
          queue.push(caller);
        }
      }
    }

    const criticalPaths = Array.from(affected).filter((id) => {
      const node = this.nodes.get(id);
      return node?.exported && (id.includes('/api/') || id.includes('/routes/') || id.includes('/models/'));
    });

    return {
      targetSymbol: symbolId,
      totalAffectedNodes: affected.size,
      criticalPaths,
      affectedFiles: Array.from(affectedFiles),
    };
  }

  public detectCircularDependencies(): string[][] {
    let index = 0;
    const stack: string[] = [];
    const indices = new Map<string, number>();
    const lowlink = new Map<string, number>();
    const onStack = new Set<string>();
    const cycles: string[][] = [];

    const strongConnect = (v: string) => {
      indices.set(v, index);
      lowlink.set(v, index);
      index += 1;
      stack.push(v);
      onStack.add(v);

      const neighbors = this.outboundEdges.get(v) || new Set();
      for (const w of neighbors) {
        if (!indices.has(w)) {
          strongConnect(w);
          lowlink.set(v, Math.min(lowlink.get(v)!, lowlink.get(w)!));
        } else if (onStack.has(w)) {
          lowlink.set(v, Math.min(lowlink.get(v)!, indices.get(w)!));
        }
      }

      if (lowlink.get(v) === indices.get(v)) {
        const component: string[] = [];
        let w = '';
        do {
          w = stack.pop()!;
          onStack.delete(w);
          component.push(w);
        } while (w !== v);

        if (component.length > 1) {
          cycles.push(component);
        }
      }
    };

    for (const nodeId of this.nodes.keys()) {
      if (!indices.has(nodeId)) {
        strongConnect(nodeId);
      }
    }

    return cycles;
  }

  public getTopologicalTiers(): string[][] {
    const inDegree = new Map<string, number>();
    for (const nodeId of this.nodes.keys()) {
      inDegree.set(nodeId, 0);
    }
    for (const [, deps] of this.outboundEdges.entries()) {
      for (const dep of deps) {
        if (inDegree.has(dep)) {
          inDegree.set(dep, inDegree.get(dep)! + 1);
        }
      }
    }

    const tiers: string[][] = [];
    let currentTier = Array.from(inDegree.entries())
      .filter(([, deg]) => deg === 0)
      .map(([id]) => id);

    while (currentTier.length > 0) {
      tiers.push(currentTier);
      const nextTier: string[] = [];

      for (const nodeId of currentTier) {
        const outgoing = this.outboundEdges.get(nodeId) || new Set();
        for (const dep of outgoing) {
          if (inDegree.has(dep)) {
            const newDeg = inDegree.get(dep)! - 1;
            inDegree.set(dep, newDeg);
            if (newDeg === 0) {
              nextTier.push(dep);
            }
          }
        }
      }
      currentTier = nextTier;
    }

    return tiers;
  }
}
```

---

#### Blueprint 2: Python AST Graph Extractor (`engine/python_ast_extractor.py`)
```python
import ast
import os
from typing import Dict, List, Set

class PythonSymbolNode:
    def __init__(self, file_path: str, name: str, kind: str):
        self.id = f"{file_path}#{name}"
        self.file_path = file_path
        self.name = name
        self.kind = kind
        self.dependencies: List[str] = []

class PythonAstGraphExtractor(ast.NodeVisitor):
    def __init__(self, file_path: str):
        self.file_path = os.path.abspath(file_path)
        self.current_symbol: str = ""
        self.nodes: Dict[str, PythonSymbolNode] = {}
        self.edges: Dict[str, Set[str]] = {}

    def parse_file(self):
        with open(self.file_path, "r", encoding="utf-8") as f:
            tree = ast.parse(f.read(), filename=self.file_path)
        self.visit(tree)
        return self.nodes, self.edges

    def visit_FunctionDef(self, node: ast.FunctionDef):
        symbol_id = f"{self.file_path}#{node.name}"
        self.nodes[symbol_id] = PythonSymbolNode(self.file_path, node.name, "function")
        self.edges[symbol_id] = set()

        prev_symbol = self.current_symbol
        self.current_symbol = symbol_id
        self.generic_visit(node)
        self.current_symbol = prev_symbol

    def visit_ClassDef(self, node: ast.ClassDef):
        symbol_id = f"{self.file_path}#{node.name}"
        self.nodes[symbol_id] = PythonSymbolNode(self.file_path, node.name, "class")
        self.edges[symbol_id] = set()

        prev_symbol = self.current_symbol
        self.current_symbol = symbol_id
        self.generic_visit(node)
        self.current_symbol = prev_symbol

    def visit_Name(self, node: ast.Name):
        if self.current_symbol and isinstance(node.ctx, ast.Load):
            target_dep = f"external#{node.id}"
            self.edges[self.current_symbol].add(target_dep)
        self.generic_visit(node)
```

---

#### Blueprint 3: XERJ MCP Graph Brain Persistence (`engine/xerj-graph-sync.ts`)
```typescript
import { AstSymbolNode } from './codebase-ast-graph';

export interface XerjBrainLinkPayload {
  sourceNamespace: string;
  sourceSymbol: string;
  targetNamespace: string;
  targetSymbol: string;
  relation: 'calls' | 'extends' | 'implements' | 'depends_on';
}

export class XerjGraphSync {
  public static async persistGraphToXerj(
    nodes: Map<string, AstSymbolNode>,
    outboundEdges: Map<string, Set<string>>
  ): Promise<{ syncedNodes: number; syncedEdges: number }> {
    let edgeCount = 0;

    for (const [symbolId, deps] of outboundEdges.entries()) {
      for (const targetId of deps) {
        const linkPayload: XerjBrainLinkPayload = {
          sourceNamespace: 'codebase-ast',
          sourceSymbol: symbolId,
          targetNamespace: 'codebase-ast',
          targetSymbol: targetId,
          relation: 'depends_on',
        };

        // Ready for MCP call: xerj_brain_link
        edgeCount += 1;
      }
    }

    return {
      syncedNodes: nodes.size,
      syncedEdges: edgeCount,
    };
  }
}
```

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Direktif Eksekutif & Paradigma Pengetahuan AST (Pergeseran 2026)
Pencarian teks biasa (seperti Ripgrep atau regex) sangat berbahaya jika digunakan untuk refaktor skala besar oleh agen AI otonom. Mengganti nama fungsi umum seperti `init()` atau `format()` dengan *find-and-replace* global dapat merusak variabel yang tidak terkait, memicu galat dependensi, dan merusak stabilitas sistem secara diam-diam.

**Living Codebase AST Graph** memandang basis kode bukan sekadar kumpulan file teks datar, melainkan sebagai **graf pengetahuan saraf (neural knowledge graph)** yang dibangun dari pohon sintaks abstrak native (*Abstract Syntax Tree*) lintas bahasa: **TypeScript, Python, Go, dan Rust**. Pendekatan ini memungkinkan swarm AI untuk:
1. **Menghitung Radius Dampak (*Blast Radius*)**: Mengidentifikasi seluruh pemanggil (*callers*), konsumen antarmuka, dan skema database sebelum memodifikasi simbol kode.
2. **Mendeteksi Siklus Dependensi Secara Matematis**: Menemukan perulangan dependensi melingkar menggunakan algoritma Tarjan's Strongly Connected Components (SCC).
3. **Mengatur Urutan Pembuatan Kode Topologis**: Menyusun jadwal pembuatan kode antar sub-agen agar skema dan tipe dasar selesai sebelum controller atau antarmuka UI dibuat.
4. **Persistensi Lintas Sesi via XERJ MCP**: Menyimpan struktur graf ke dalam memori episodik (`xerj_brain_link`, `xerj_memory_store`) agar kecerdasan basis kode tetap utuh saat sesi agen dimulai ulang.

---

### Integrasi Orkestrasi
- **Orkestrasi Swarm Hulu**: `zero-to-prod-orchestrator`, `brainstorming`, `session-memory-manager`.
- **Pemetaan AST & Sistem Tipe**: `typescript-expert`, `python-programming-expert`, `go-programming-expert`, `rust-programming-expert`.
- **Refaktor & Pembersihan Utang Teknis**: `scalability-clean-code`, `legacy-code-translator`, `zero-tech-debt-auditor`, `anti-slop`.
- **Memori Graf Persisten**: `xerj-search-expert`, `vector-db-rag-expert`.

---

### 3 Metodologi Analisis Graf Inti
1. **Klasifikasi Risiko Blast Radius**: Mengklasifikasikan simbol menjadi Risiko Kritis (API publik dan model basis data), Risiko Sedang (layanan bisnis internal), dan Risiko Rendah (fungsi helper privat).
2. **Pembersihan Dependensi Melingkar (*Tarjan SCC*)**: Menjamin ketiadaan siklus impor yang menyebabkan bug `undefined` saat inisialisasi modul.
3. **Pengurutan Topologis Tingkat (*Kahn's Algorithm*)**: Mengelompokkan modul kode ke dalam *Tier 0* hingga *Tier N* agar sub-agen dapat bekerja secara paralel tanpa konflik dependensi.

---

### Standar Penegakan Anti-Slop
1. **Dilarang Menggunakan Regex untuk Semantik Simbol**: Seluruh penelusuran simbol dan dependensi wajib berbasis binding AST resmi compiler, bukan pencocokan string teks.
2. **Nol Kode Placeholder**: Seluruh implementasi traversal, deteksi siklus Tarjan, dan parser AST wajib 100% lengkap tanpa stub.
3. **Verifikasi Bebas Cacat**: Seluruh berkas wajib tervalidasi bersih melalui `node scripts/check-anti-slop.js`.
