---
name: multi-agent-orchestration
description: "Expert guide for designing and orchestrating multi-agent systems, agent swarms, graph-based workflows (LangGraph, CrewAI, AutoGen), shared state memory, and human-in-the-loop guardrails in English and Indonesian."
author: "Roedy Rustam"
---

# Multi-Agent Orchestration Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Production-grade architecture guide for designing, building, and operating **Multi-Agent AI Systems**. Covers stateful graph workflows (**LangGraph**), agent swarms (**CrewAI**, **AutoGen**, **OpenAI Swarm**), supervisor routing patterns, shared memory state management, tool delegation, and human-in-the-loop (HITL) approval gates.

### Trigger Conditions
- Designing complex AI systems requiring multiple specialized agents working together (e.g., Planner + Coder + Reviewer + Tester).
- Implementing stateful, cyclic AI workflows using **LangGraph** (Python / TypeScript).
- Creating agent teams with role-based delegations using **CrewAI** or **AutoGen**.
- Setting up Human-in-the-Loop (HITL) approval steps for high-risk agent tool actions (DB deletion, financial payments, production deploys).
- Managing shared state, context truncation, and recursion limits across agent graphs.

### Architecture Patterns

```
                          +-------------------+
                          |  Supervisor Agent |
                          +---------+---------+
                                    |
          +-------------------------+-------------------------+
          |                         |                         |
+---------v---------+     +---------v---------+     +---------v---------+
|   Researcher AI   |     |    Coder Agent    |     |   Reviewer Agent  |
|  (Web/Doc Tools)  |     |  (Code Gen/Edit)  |     | (Linter/Tests)    |
+-------------------+     +-------------------+     +-------------------+
```

#### 1. Supervisor / Hierarchical Routing
A central **Supervisor Agent** evaluates the user request, breaks it into subtasks, and dynamically routes execution to specialized worker agents based on output state.

#### 2. Stateful Graph Workflows (LangGraph)
Define AI workflows as directed graphs:
- **Nodes**: Individual agents or deterministic tool functions.
- **Edges**: Conditional routing logic based on state inspection.
- **State**: Central, immutable state object passed across nodes (with reducers for state updates).

#### 3. Human-in-the-Loop (HITL) Guardrails
Pause graph execution before dangerous node transitions (e.g., deploying code or executing destructive SQL queries). Wait for explicit human confirmation or user input before resuming graph state.

---

### Implementation Example (LangGraph TypeScript)

```typescript
import { StateGraph, END, START } from '@langchain/langgraph';
import { Annotation } from '@langchain/langgraph';

// Define Shared Memory State
const AgentState = Annotation.Root({
  messages: Annotation<string[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  nextAgent: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => 'researcher',
  }),
});

// Build Workflow Graph
const workflow = new StateGraph(AgentState)
  .addNode('researcher', async (state) => {
    // Researcher logic
    return { messages: ['Research completed.'], nextAgent: 'coder' };
  })
  .addNode('coder', async (state) => {
    // Coder logic
    return { messages: ['Code generated.'], nextAgent: 'reviewer' };
  })
  .addNode('reviewer', async (state) => {
    // Reviewer logic
    return { messages: ['Review passed.'], nextAgent: END };
  })
  .addEdge(START, 'researcher')
  .addConditionalEdges('researcher', (state) => state.nextAgent)
  .addConditionalEdges('coder', (state) => state.nextAgent)
  .addConditionalEdges('reviewer', (state) => state.nextAgent);

const app = workflow.compile();
```

---

### Production Guardrails
- **Recursion Limits**: Set maximum graph step limits (e.g., `recursionLimit: 25`) to prevent infinite looping loops between agents.
- **Token Cost Budgets**: Track cumulative token consumption per execution run. Terminate or pause graph execution if budget thresholds are exceeded.
- **State Checkpointing**: Persist graph state in PostgreSQL/Redis at every node transition to allow state recovery after failures.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan arsitektur tingkat produksi untuk merancang, membangun, mengoperasikan, dan mendokumentasikan **Sistem Multi-Agen AI**. Mencakup alur kerja graf berbasis state (**LangGraph**), kelompok agen (*swarms* via **CrewAI**, **AutoGen**), pola perutean supervisor, manajemen state memori bersama, delegasi alat, dan gerbang persetujuan manusia (*Human-in-the-Loop*).

### Kondisi Pemicu
- Merancang sistem AI kompleks yang membutuhkan beberapa agen spesialis (misal: Perencana + Pemrogram + Peninjau + Penguji).
- Mengimplementasikan alur kerja AI berbasis graf menggunakan **LangGraph** (Python / TypeScript).
- Membuat tim agen dengan peran spesifik menggunakan **CrewAI** atau **AutoGen**.
- Mengatur langkah *Human-in-the-Loop* (HITL) untuk tindakan alat berisiko tinggi (penghapusan DB, pembayaran, rilis produksi).
- Mengelola state bersama, pemotongan konteks, dan batas rekursi pada graf agen.

### Pola Arsitektur Utama

1. **Perutean Supervisor / Hierarkis**: Agen Supervisor mengevaluasi permintaan pengguna, membaginya menjadi sub-tugas, dan merutekannya ke agen pekerja.
2. **Alur Kerja Graf Berbasis State (LangGraph)**:
   - **Nodes**: Agen individual atau fungsi alat deterministik.
   - **Edges**: Logika perutean kondisional berdasarkan kondisi state.
   - **State**: Objek memori terpusat yang diturunkan antar node.
3. **Human-in-the-Loop (HITL)**: Menghentikan eksekusi graf sejenak sebelum transisi node berbahaya untuk meminta persetujuan manusia.

### Guardrails Produksi
- **Batas Rekursi**: Tetapkan batas maksimal langkah graf (misal: `recursionLimit: 25`) untuk mencegah *looping* tanpa henti.
- **Anggaran Token**: Lacak akumulasi konsumsi token per alur kerja. Hentikan eksekusi jika melebihi batas.
- **Checkpointing State**: Simpan state graf di PostgreSQL/Redis pada setiap transisi node untuk pemulihan jika terjadi eror.
