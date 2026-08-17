---
name: multi-agent-orchestration
description: "Expert guide for designing and orchestrating multi-agent systems, agent swarms, graph-based workflows (LangGraph, CrewAI, AutoGen), shared state memory, and human-in-the-loop guardrails in English and Indonesian."
author: "vibes-plug-swarm"
---

# Multi-Agent Orchestration Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills like `brainstorming`, `zero-to-prod-orchestrator`, and `project-context-mapper` to ensure cohesive execution.

### Description
Expert guide for designing, building, and deploying production-grade multi-agent AI systems. Covers agent orchestration frameworks (LangGraph, OpenAI Agents SDK, Google ADK, Mastra.ai, CrewAI, AutoGen), shared state and memory management, tool execution, human-in-the-loop (HITL) guardrails, and observability for agentic workflows.

**Swarm Synergy:** This skill acts as a powerful orchestrator when combined with `mcp-server-architect` (for external tool integration) and `ai-llm-integration-expert` (for foundation model setup). Together, they form a complete, end-to-end **AI Engineering Swarm**.

### Trigger Conditions
- Building autonomous AI agents that execute multi-step tasks.
- Designing systems where multiple specialized AI agents collaborate.
- Implementing graph-based agent workflows with LangGraph or similar frameworks.
- Integrating human-in-the-loop checkpoints for high-stakes decisions.
- Building AI pipelines with tool-calling, RAG retrieval, code execution, or browser control.
- Evaluating and selecting agent frameworks (LangGraph vs OpenAI Agents SDK vs Google ADK).

### Agent Framework Comparison (2026)

| Framework | Language | Best For | Key Differentiator |
|---|---|---|---|
| **LangGraph** | Python / TypeScript | Complex stateful workflows | Graph-based, any LLM, full control |
| **OpenAI Agents SDK** | Python | GPT-5 native agents | Built-in handoffs, tracing, guardrails |
| **Google ADK** | Python | Gemini-powered agents | Multi-agent, Vertex AI, streaming |
| **Mastra.ai** | TypeScript | TS-first agent apps | Built-in memory, evals, RAG, MCP |
| **CrewAI** | Python | Team-of-agents tasks | Role-based agents, easy to start |
| **AutoGen** | Python | Research & LLM evaluation | Conversation-driven agents |

### Core Architecture Principles

#### 1. Agent Roles & Specialization
Design agents with single responsibilities — avoid "do-everything" agents:
- **Orchestrator Agent**: Routes tasks, decomposes goals, delegates to specialists.
- **Specialist Agents**: Domain-specific (research agent, code agent, data analyst, writer).
- **Tool Agents**: Wrap external capabilities (browser agent, SQL agent, file agent).
- **Critic/Validator Agent**: Reviews output of other agents before finalizing.

#### 2. LangGraph — Stateful Graph Workflows
LangGraph models agent workflows as directed graphs with persistent state — ideal for complex, multi-step tasks with branching logic and HITL:
```python
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from typing import TypedDict, Annotated
import operator

class AgentState(TypedDict):
    messages: Annotated[list, operator.add]
    task: str
    result: str

def research_node(state: AgentState):
    # Call research agent
    return {"messages": [research_agent.invoke(state["task"])]}

def write_node(state: AgentState):
    # Call writing agent with research result
    return {"result": writing_agent.invoke(state["messages"])}

def should_revise(state: AgentState) -> str:
    # Conditional routing
    return "revise" if needs_revision(state["result"]) else "end"

builder = StateGraph(AgentState)
builder.add_node("research", research_node)
builder.add_node("write", write_node)
builder.add_conditional_edges("write", should_revise, {"revise": "research", "end": END})

# Persist state for HITL
memory = MemorySaver()
graph = builder.compile(checkpointer=memory, interrupt_before=["write"])
```

#### 3. OpenAI Agents SDK — Handoffs & Guardrails
Use the OpenAI Agents SDK for native GPT-5 agent workflows with built-in tracing:
```python
from agents import Agent, Runner, handoff, input_guardrail, GuardrailFunctionOutput

# Define specialist agents
researcher = Agent(
    name="Researcher",
    instructions="Search and retrieve relevant information.",
    tools=[web_search, document_retrieval],
)

writer = Agent(
    name="Writer",
    instructions="Write high-quality content based on research.",
    handoffs=[handoff(researcher, tool_name_override="get_research")],
)

# Input guardrail to prevent harmful requests
@input_guardrail
async def content_filter(ctx, agent, input) -> GuardrailFunctionOutput:
    if contains_harmful_content(input):
        return GuardrailFunctionOutput(output_info="Blocked", tripwire_triggered=True)
    return GuardrailFunctionOutput(output_info="OK", tripwire_triggered=False)

# Run with tracing
result = await Runner.run(writer, "Write an article about...", guardrails=[content_filter])
```

#### 4. Google ADK — Gemini Multi-Agent
Google Agent Development Kit (ADK) for building Gemini-powered agents with Vertex AI integration:
```python
from google.adk.agents import Agent
from google.adk.tools import google_search, code_execution

root_agent = Agent(
    model="gemini-2.5-pro",
    name="orchestrator",
    instruction="Coordinate research and analysis tasks.",
    sub_agents=[research_agent, analysis_agent],
    tools=[google_search, code_execution],
)
```

#### 5. Mastra.ai — TypeScript-First Agents
For TypeScript teams, Mastra provides the most complete agentic framework:
```typescript
import { Agent, MastraMemory } from '@mastra/core';
import { createTool } from '@mastra/core/tools';

const webSearchTool = createTool({
  id: 'web-search',
  description: 'Search the web for current information',
  inputSchema: z.object({ query: z.string() }),
  execute: async ({ context: { query } }) => searchWeb(query),
});

const researchAgent = new Agent({
  name: 'researcher',
  instructions: 'Find and summarize information accurately.',
  model: { provider: 'ANTHROPIC', name: 'claude-sonnet-4-5' },
  tools: { webSearch: webSearchTool },
  memory: new MastraMemory({ storage: supabaseStorage }),
});
```

#### 6. Human-in-the-Loop (HITL) Guardrails
Mandatory for high-stakes agent actions (financial transactions, email sending, code deployment):
- **Interrupt Checkpoints**: Pause graph execution before irreversible actions.
- **Approval Flows**: Send pending action to a UI for human review before continuing.
- **Confidence Thresholds**: Auto-approve if confidence > 90%, escalate if < 70%.

#### 7. Agent Memory Architecture
- **Working Memory (In-context)**: Recent messages and task state in the prompt window.
- **Episodic Memory**: Summarized past sessions stored as embeddings (Mem0, MemGPT).
- **Semantic Memory**: Domain knowledge in a vector store (pgvector, Qdrant).
- **Procedural Memory**: Learned tool-use patterns stored as structured data.

#### 8. Observability & Evaluation
- **LangSmith**: Native tracing for LangGraph, LangChain agents.
- **OpenAI Tracing**: Built-in in OpenAI Agents SDK — view agent runs, handoffs, tool calls.
- **Mastra Evals**: Built-in evaluation framework for Mastra agents.
- **Custom Metrics**: Track task completion rate, tool call accuracy, latency, and cost per run.

#### 9. Antigravity Native Swarm Director
Leverage Antigravity's native `invoke_subagent` for parallel execution:
- **Analyze & Decompose**: Break tasks into independent, non-overlapping chunks.
- **Spawn Parallel Subagents**: Use `invoke_subagent` with specific scoped prompts. Pass `branch` or `share` workspace parameters safely. Do NOT spawn >5 subagents simultaneously.
- **Wait & Monitor**: System automatically wakes you upon subagent completion. No polling needed.
- **Adversarial Critique**: Spawn an "Auditor" subagent to red-team and review the outputs before merging.
- **Mandatory PRD Guardrail**: When starting a new project, the Director MUST ensure `PRD.md`, `ERD.md`, and `DOKUMENTASI.md` are generated first.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan seperti `brainstorming`, `zero-to-prod-orchestrator`, dan `project-context-mapper` untuk memastikan eksekusi yang kohesif.

### Deskripsi
Panduan ahli untuk merancang, membangun, dan men-deploy sistem multi-agen AI tingkat produksi. Mencakup framework orkestrasi agen (LangGraph, OpenAI Agents SDK, Google ADK, Mastra.ai), manajemen state dan memori bersama, eksekusi tool, guardrail human-in-the-loop (HITL), dan observabilitas untuk alur kerja agentik.

**Sinergi Swarm:** Skill ini bertindak sebagai orkestrator yang sangat *powerful* jika dikombinasikan dengan `mcp-server-architect` (untuk integrasi eksternal tool) dan `ai-llm-integration-expert` (untuk penyiapan foundation model). Bersama-sama, ketiganya membentuk **AI Engineering Swarm** yang komprehensif dari ujung ke ujung.

### Kondisi Pemicu
- Membangun agen AI otonom yang mengeksekusi tugas multi-langkah.
- Merancang sistem di mana beberapa agen AI khusus berkolaborasi.
- Mengimplementasikan alur kerja agen berbasis graph dengan LangGraph atau framework serupa.
- Mengintegrasikan checkpoint human-in-the-loop untuk keputusan berisiko tinggi.
- Membangun pipeline AI dengan tool-calling, RAG, eksekusi kode, atau kontrol browser.
- Mengevaluasi dan memilih framework agen yang tepat.

### Perbandingan Framework Agen (2026)

| Framework | Bahasa | Terbaik Untuk | Diferensiasi Kunci |
|---|---|---|---|
| **LangGraph** | Python / TS | Alur kerja stateful kompleks | Berbasis graph, LLM apa saja, kontrol penuh |
| **OpenAI Agents SDK** | Python | Agen GPT-5 native | Handoffs, tracing, guardrails bawaan |
| **Google ADK** | Python | Agen berbasis Gemini | Multi-agen, Vertex AI, streaming |
| **Mastra.ai** | TypeScript | Aplikasi agen TS-first | Memori, evaluasi, RAG, MCP bawaan |
| **CrewAI** | Python | Tugas tim-agen | Agen berbasis peran, mudah dimulai |
| **AutoGen** | Python | Riset & evaluasi LLM | Agen berbasis percakapan |

### Prinsip Arsitektur Inti

#### 1. Peran & Spesialisasi Agen
Rancang agen dengan tanggung jawab tunggal:
- **Orchestrator Agent**: Mendelegasikan tugas ke agen spesialis.
- **Specialist Agents**: Domain-spesifik (agen riset, kode, analis data, penulis).
- **Tool Agents**: Membungkus kemampuan eksternal (browser, SQL, file).
- **Critic/Validator Agent**: Meninjau output agen lain sebelum difinalisasi.

#### 2. LangGraph — Alur Kerja Graf Stateful
LangGraph memodelkan alur kerja agen sebagai graf terarah dengan state persisten — ideal untuk tugas kompleks dengan logika percabangan dan HITL. State disimpan di checkpointer (MemorySaver atau PostgreSQL) untuk resume antar sesi.

#### 3. OpenAI Agents SDK — Handoffs & Guardrails
SDK native untuk agen GPT-5 dengan handoffs agen-ke-agen, tracing bawaan, dan guardrails untuk mencegah output berbahaya.

#### 4. Google ADK — Agen Gemini Multi-Agent
ADK untuk membangun agen Gemini dengan integrasi Vertex AI, sub-agents, dan tool seperti Google Search dan eksekusi kode.

#### 5. Mastra.ai — Agen TypeScript-First
Framework paling lengkap untuk tim TypeScript: memori bawaan, evaluasi, RAG, dan dukungan MCP native.

#### 6. Human-in-the-Loop (HITL) Guardrails
Wajib untuk aksi agen berisiko tinggi (transaksi keuangan, pengiriman email, deployment kode):
- **Interrupt Checkpoints**: Jeda eksekusi graf sebelum aksi tidak dapat dibalik.
- **Approval Flows**: Kirim aksi yang menunggu ke UI untuk ditinjau manusia.
- **Confidence Thresholds**: Auto-approve jika keyakinan > 90%, eskalasi jika < 70%.

#### 7. Arsitektur Memori Agen
- **Working Memory**: Riwayat percakapan recent dalam context window.
- **Episodic Memory**: Sesi masa lalu yang diringkas sebagai embedding (Mem0).
- **Semantic Memory**: Pengetahuan domain dalam vector store (pgvector, Qdrant).
- **Procedural Memory**: Pola penggunaan tool yang dipelajari sebagai data terstruktur.

#### 8. Observabilitas & Evaluasi
- **LangSmith**: Tracing native untuk LangGraph.
- **OpenAI Tracing**: Bawaan di OpenAI Agents SDK — lihat run, handoff, tool call.
- **Mastra Evals**: Framework evaluasi bawaan untuk agen Mastra.
- **Metrik Kustom**: Lacak tingkat penyelesaian tugas, akurasi tool call, latensi, dan biaya per run.

#### 9. Antigravity Native Swarm Director
Manfaatkan kemampuan native `invoke_subagent` dari Antigravity:
- **Pecah & Delegasikan**: Pecah tugas menjadi independen.
- **Spawn Sub-Agen Paralel**: Panggil sub-agen dengan prompt spesifik. Hindari menugaskan dua agen untuk file yang sama. Maksimal 5 sub-agen sekaligus.
- **Tunggu Otomatis**: Sistem akan membangunkan Anda otomatis saat sub-agen selesai.
- **Kritik Adversarial (Red Teaming)**: Panggil sub-agen "Auditor" khusus untuk mencari kerentanan dari hasil kerja agen lain sebelum digabungkan.
- **Dokumentasi Wajib (Proyek Baru)**: Jika proyek baru, Direktur WAJIB memastikan `PRD.md`, `ERD.md`, dan `DOKUMENTASI.md` dibuat sebelum pekerjaan koding dimulai.
