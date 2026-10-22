---
name: multi-agent-orchestration
description: "Expert guide for designing and orchestrating multi-agent systems, agent swarms, 2026 Anthropic agentic design patterns, graph and flow engines (LangGraph, CrewAI, OpenAI Agents SDK, Google ADK, Mastra.ai), shared state memory, and human-in-the-loop guardrails in English and Indonesian."
author: "Roedy Rustam"
version: "4.4.2"

---

# Multi-Agent Orchestration Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Swarm Directorship & Planning**: `brainstorming`, `zero-to-prod-orchestrator`, `speculative-multi-draft-synthesizer`
- **Foundation Models & Providers**: `ai-llm-integration-expert`, `frontier-ai-models-expert`, `gemini-agent-booster`, `vercel-ai-sdk-expert`
- **Tool Execution & MCP Protocols**: `mcp-server-architect`, `parallel-tool-orchestrator`, `doku-mcp-server`
- **Agent Languages & Frameworks**: `pydantic-ai-expert`, `structured-output-contracts`, `python-programming-expert`
- **Memory, State & Telemetry**: `session-memory-manager`, `agentic-memory-architect`, `data-telemetry-expert`
- **Security & Quality Gates**: `anti-slop`, `mcp-sampling-critic`, `autonomous-red-teamer`, `zero-trust-secret-vault`

### Description
Expert guide for designing, building, and deploying production-grade multi-agent AI systems. Covers core agentic design patterns (Prompt Chaining, Routing, Parallelization, Orchestrator-Workers, Evaluator-Optimizer), stateful graph engines (LangGraph, OpenAI Agents SDK, Google ADK, Mastra.ai), shared episodic/semantic memory, tool execution sandboxes, and human-in-the-loop (HITL) guardrails.

**Swarm Synergy:** This skill acts as a master orchestrator when combined with `mcp-server-architect` (for external tool integration) and `ai-llm-integration-expert` (for foundation model setup). Together, they form a complete, end-to-end **AI Engineering Swarm**.

### Trigger Conditions
- Building autonomous AI agents that execute complex, multi-step tasks across several domains.
- Designing systems where multiple specialized AI agents collaborate, deliberate, and cross-validate.
- Implementing stateful, graph-based agent workflows with LangGraph, OpenAI Agents SDK, or Google ADK.
- Implementing Anthropic agentic design patterns: Evaluator-Optimizer loops, Orchestrator-Workers, or Routing.
- Integrating human-in-the-loop (HITL) pause checkpoints for high-risk actions (code execution, database migrations, financial transactions).
- Evaluating and selecting agent architectures across Python, TypeScript, and multi-platform swarms.

### Anthropic 2026 Core Agentic Design Patterns

Production systems should favor explicit **Workflows** over unbounded autonomous loops where predictability and reliability are required:

```
1. PROMPT CHAINING
   [Input] ---> [LLM Step 1] ---> [Gate/Validator] ---> [LLM Step 2] ---> [Output]

2. ROUTING
   [Input] ---> [Classifier/Router] ──┬──> [Specialist Agent A]
                                     ├──> [Specialist Agent B]
                                     └──> [Specialist Agent C]

3. PARALLELIZATION (Sectioning & Voting)
   [Input] ──┬──> [Task 1 (Subagent)] ──┐
             ├──> [Task 2 (Subagent)] ──┼──> [Aggregator / Synthesizer]
             └──> [Task 3 (Subagent)] ──┘

4. ORCHESTRATOR-WORKERS (Dynamic Decomposition)
   [Input] ---> [Orchestrator] ──┬──> [Worker 1 (Focused Context)] ──┐
                                 ├──> [Worker 2 (Focused Context)] ──┼──> [Orchestrator Synthesis]
                                 └──> [Worker 3 (Focused Context)] ──┘

5. EVALUATOR-OPTIMIZER LOOP (Zero-Tolerance Quality Gate)
   [Input] ---> [Generator Agent] <─────┐ (Feedback Loop)
                       │                 │
                       ▼                 │
               [Evaluator / Auditor] ────┘ (Reject / Needs Revision)
                       │
                       ▼ (Approved)
                   [Output]
```

### Bridging Internal Swarm Patterns
vibes-plug's internal Swarm Director patterns (from `AGENTS.md`) map directly to these external frameworks:
- **Fan-Out / Fan-In topology**: Mapped via LangGraph parallel node execution + reducer functions, or Google ADK sub-agent arrays.
- **Pipeline Saga topology**: Mapped via OpenAI Agents SDK sequential handoffs or Mastra.ai sequential chains.
- **Critic-Validator Loop topology**: Mapped via LangGraph conditional edges routing back to generator nodes.

### Agent Framework Comparison (2026)

| Framework | Language | Best For | Key Differentiator |
|---|---|---|---|
| **LangGraph (v0.3+)** | Python / TypeScript | Complex stateful workflows & graphs | Graph-based, persistent checkpointers, time-travel debugging |
| **OpenAI Agents SDK** | Python | GPT-5.6 Sol / o4-series native agents | Built-in agent handoffs, tracing, and tripwire guardrails |
| **Google ADK** | Python | Gemini-powered swarms | Native Vertex AI, multi-agent streaming, search grounding |
| **Mastra.ai** | TypeScript | TS-first web apps & microservices | Built-in memory, evals, RAG, and native MCP support |
| **CrewAI** | Python | Role-playing business teams & flows | Event-driven Flows, hierarchical manager execution, multi-tier memory |

### Core Implementation Guidelines

#### 1. LangGraph — Persistent State & HITL Checkpoints
LangGraph models agent workflows as directed acyclic or cyclic graphs with persistent state:
```python
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from typing import TypedDict, Annotated
import operator

class AgentState(TypedDict):
    messages: Annotated[list, operator.add]
    task: str
    code_artifact: str
    audit_feedback: str
    approved: bool

def generator_node(state: AgentState):
    # Generates or refactors code based on previous feedback
    code = coder_agent.invoke(state["task"], feedback=state.get("audit_feedback"))
    return {"code_artifact": code}

def evaluator_node(state: AgentState):
    # Runs automated linter/tests & security review
    audit = auditor_agent.invoke(state["code_artifact"])
    return {
        "audit_feedback": audit.critique,
        "approved": audit.is_passing
    }

def route_next(state: AgentState) -> str:
    return END if state["approved"] else "generator"

builder = StateGraph(AgentState)
builder.add_node("generator", generator_node)
builder.add_node("evaluator", evaluator_node)
builder.set_entry_point("generator")
builder.add_edge("generator", "evaluator")
builder.add_conditional_edges("evaluator", route_next, {"generator": "generator", END: END})

# Persist state with checkpointer for HITL interruption before destructive actions
checkpointer = MemorySaver()
graph = builder.compile(checkpointer=checkpointer, interrupt_before=["generator"])
```

**TypeScript LangGraph Implementation:**
```typescript
import { StateGraph, MemorySaver, END } from "@langchain/langgraph";

const graphState = {
  messages: { value: (x, y) => x.concat(y), default: () => [] },
  approved: { value: (x, y) => y, default: () => false }
};

const builder = new StateGraph({ channels: graphState })
  .addNode("generator", async (state) => ({ messages: [await coder.invoke(state)] }))
  .addNode("evaluator", async (state) => {
    const res = await auditor.invoke(state);
    return { messages: [res.critique], approved: res.isPassing };
  })
  .addEdge("__start__", "generator")
  .addEdge("generator", "evaluator")
  .addConditionalEdges("evaluator", (state) => state.approved ? END : "generator");

const checkpointer = new MemorySaver();
const graph = builder.compile({ checkpointer, interruptBefore: ["generator"] });
```

#### 2. OpenAI Agents SDK — Agent Handoffs & Guardrails
Implement native agent handoffs where specialized agents transition control cleanly:
```python
from agents import Agent, Runner, handoff, input_guardrail, GuardrailFunctionOutput

researcher = Agent(
    name="Researcher",
    instructions="Research libraries, security advisories, and system specs.",
    tools=[web_search, doc_retrieval],
)

architect = Agent(
    name="Architect",
    instructions="Synthesize technical architecture and delegate research when needed.",
    handoffs=[handoff(researcher, tool_name_override="delegate_research")],
)

@input_guardrail
async def safety_guardrail(ctx, agent, input_data) -> GuardrailFunctionOutput:
    if contains_destructive_commands(input_data):
        return GuardrailFunctionOutput(output_info="Blocked destructive payload", tripwire_triggered=True)
    return GuardrailFunctionOutput(output_info="Safe", tripwire_triggered=False)

result = await Runner.run(architect, "Design high-throughput ingestion pipeline", guardrails=[safety_guardrail])
```

#### 3. Google ADK — Gemini Multi-Agent Systems
Orchestrate Gemini 3.x agents with streaming subagent calls and Vertex AI tooling:
```python
from google.adk.agents import Agent
from google.adk.tools import google_search, code_execution

director = Agent(
    model="gemini-3.1-pro",
    name="director",
    instruction="Coordinate domain specialists and synthesize final deliverables.",
    sub_agents=[frontend_agent, backend_agent, security_agent],
    tools=[google_search, code_execution],
)
```

#### 4. Mastra.ai — TypeScript-Native Agents
For modern Next.js / Node.js / Bun environments:
```typescript
import { Agent, MastraMemory } from '@mastra/core';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

const researcher = new Agent({
  name: 'researcher',
  instructions: 'Find and summarize accurate technical documentation.',
  model: { provider: 'ANTHROPIC', name: 'claude-3-7-sonnet-20250219' },
  memory: new MastraMemory({ storage: supabaseStorage }),
});
```

#### 5. CrewAI — Role-Playing Crews, Hierarchical Execution & Event-Driven Flows
Combines event-driven application state flows (`Flow`) with autonomous role-playing agent crews (`Crew`), supporting hierarchical delegation and typed Pydantic outputs:

```python
from crewai import Agent, Crew, Process, Task
from crewai.tools import tool
from crewai.flow.flow import Flow, start, listen, router
from pydantic import BaseModel, Field

# 1. Typed State and Output Schemas
class SecurityReport(BaseModel):
    is_vulnerable: bool
    vulnerabilities: list[str] = Field(default_factory=list)
    mitigation_plan: str

class PipelineState(BaseModel):
    target_service: str = "payment-gateway"
    audit_passed: bool = False
    report: SecurityReport | None = None

# 2. Custom Safe Tool
@tool("scan_dependencies")
def scan_dependencies(service_name: str) -> str:
    """Scans service dependencies for known CVEs and outdated packages."""
    return f"Scan complete for {service_name}: 0 critical, 1 low severity vulnerability in OpenSSL binding."

# 3. Define Event-Driven Flow with State & Conditional Branching
class DeploymentFlow(Flow[PipelineState]):
    @start()
    def initialize_pipeline(self):
        print(f"Initializing security pipeline for: {self.state.target_service}")
        return self.state.target_service

    @listen(initialize_pipeline)
    def run_security_crew(self, service: str):
        # Define Specialized Role-Playing Agents
        scanner = Agent(
            role="Security Researcher",
            goal=f"Audit dependencies and network vectors for {service}",
            backstory="Veteran cybersecurity auditor specialized in FinTech compliance and OWASP Top 10.",
            tools=[scan_dependencies],
            verbose=True,
            memory=True
        )

        hardener = Agent(
            role="Systems Hardener",
            goal="Formulate actionable mitigation plans for all identified security vectors",
            backstory="Principal DevSecOps engineer with deep zero-trust and kernel security expertise.",
            verbose=True,
            memory=True
        )

        # Define Tasks with Structured Output and HITL Checkpoint
        audit_task = Task(
            description=f"Analyze all package dependencies and attack surfaces for {service}.",
            expected_output="Raw vulnerability scan assessment.",
            agent=scanner
        )

        remediation_task = Task(
            description="Produce a structured mitigation report and verify if the service is safe for deploy.",
            expected_output="A typed JSON security report matching the SecurityReport schema.",
            agent=hardener,
            output_pydantic=SecurityReport,
            human_input=True
        )

        # Instantiate Hierarchical Crew with Manager LLM
        security_crew = Crew(
            agents=[scanner, hardener],
            tasks=[audit_task, remediation_task],
            process=Process.hierarchical,
            manager_llm="gpt-5.6-sol",
            memory=True,
            verbose=True
        )

        result = security_crew.kickoff()
        self.state.report = result.pydantic
        self.state.audit_passed = not self.state.report.is_vulnerable
        return self.state.audit_passed

    @router(run_security_crew)
    def evaluate_deployment(self):
        if self.state.audit_passed:
            return "deploy"
        return "quarantine"

    @listen("deploy")
    def handle_deployment(self):
        print(f"Service {self.state.target_service} approved for zero-downtime deployment.")

    @listen("quarantine")
    def handle_quarantine(self):
        print(f"Deployment halted: {self.state.target_service} quarantined for remediation.")
```

#### 6. Human-in-the-Loop (HITL) Guardrails
Mandatory safeguards before executing irreversible operations:
- **Interrupt Checkpoints**: Halt workflow execution before executing code, migrating databases, or modifying production records.
- **Approval Dashboards**: Surface diff previews and proposed shell commands to the user or admin before proceeding.
- **Confidence Gates**: Auto-proceed only when model confidence score is >= 0.90; trigger human escalation otherwise.

#### 7. Swarm Circuit Breakers & Fallback Protocols
- **Retry Caps**: Maximum 2 automated retries per subagent.
- **Fallback Escalation**: If a specialist agent stalls or loops, the Swarm Director gracefully fallbacks to `fullstack-expert` or requests human guidance.
- **Checkpoint Persistence**: Always persist intermediate progress to `PROGRESS.md` or `BLUEPRINT.md` so sessions can resume without losing context.

#### 8. Narrative Simulation Swarms (Fable Paradigm)
Multi-agent autonomous story world simulation architecture where agents act as characters.
- **Character-Agent Personality Encoding:** Uses Big Five personality model + emotional valence vectors (joy, anger, fear, surprise, sadness, disgust).
- **Inter-Agent Dialogue Protocols:** Constrained by narrative coherence.
- **World-State Consensus Protocol:** Distributed shared memory with conflict resolution to maintain a consistent simulated reality.
- **Autonomous Episodic Generation:** Agents create story episodes dynamically without human prompting.
- **Director Agent Pattern:** A meta-agent that monitors the swarm and ensures narrative arc consistency.

```typescript
import { StateGraph, END } from "@langchain/langgraph";
import { BaseMessage, SystemMessage } from "@langchain/core/messages";

interface WorldState {
  messages: BaseMessage[];
  events: string[];
}

const romeoAgent = async (state: WorldState) => {
  // Encoded with High Openness, High Neuroticism, emotional vectors
  const response = await llm.invoke([
    new SystemMessage("You are Romeo. You are feeling [Joy: 0.8, Sadness: 0.2]. Respond to the world state."),
    ...state.messages
  ]);
  return { messages: [response] };
};

const directorAgent = async (state: WorldState) => {
  // Ensures narrative arc consistency
  const evaluation = await evaluatorLLM.invoke(state.messages);
  return { events: [evaluation.content] };
};
```

#### 9. Computer-Using Agent (CUA) Orchestration
- **CUA Agent Delegation:** Swarm director delegates specific UI tasks to CUA worker agents.
- **Screen-Sharing Observation:** Orchestrator agent observes CUA's visual stream to verify progress.
- **Recovery Protocols:** Handles CUA failures like stuck UI states or navigation errors via visual feedback loops.
- **Parallel CUA Execution:** Multiple CUA workers operate different browser tabs/windows simultaneously.

```typescript
import { CUARunner, CUAWorker } from "cua-orchestration-sdk";

const orchestrator = new CUARunner();
const worker1 = new CUAWorker({ id: "tab-1", objective: "Scrape pricing page" });
const worker2 = new CUAWorker({ id: "tab-2", objective: "Monitor system health" });

orchestrator.registerWorkers([worker1, worker2]);
orchestrator.on("worker_stuck", async (worker, screenshot) => {
  await orchestrator.recoverWorker(worker, screenshot);
});
await orchestrator.executeParallel();
```

#### 10. Continuous Perception Swarms
- **Always-on Monitoring:** 24/7 perception loops capturing multimodal input.
- **Live Video/Audio Triage Agents:** (Intake → Classify → Route) pipelines processing continuous streams.
- **Spatial Awareness Distribution:** Sharing spatial context across the agent swarm.
- **Event-Driven Wakeup Protocols:** Agents remain dormant until a relevant stimulus is detected.
- **Gemini Multimodal Live API Integration:** Native hooks for continuous audio/video perception.

```typescript
import { MultimodalLiveClient } from "gemini-live-sdk";
import { TriageSwarm } from "./swarm";

const client = new MultimodalLiveClient({ apiKey: process.env.GEMINI_API_KEY });
const swarm = new TriageSwarm();

client.on("video_frame", async (frame) => {
  const classification = await swarm.intake(frame);
  if (classification.isCritical) {
    swarm.wakeupSpecialists(classification.type);
    await swarm.route(frame, classification.type);
  }
});
client.connect();
```

#### 11. Massive Parallel Swarms (Agentic MoE) for Next-Gen LLMs
For next-gen models like **Gemini 4 Pro**:
- **Batched Tool Invocation**: Transition from sequential step-by-step orchestrators to massive batched function calling.
- **Monolithic Context Flow**: Pass the entire massive context (codebase snapshot) directly via KV-Cache rather than using chunked RAG retrieval per agent, allowing subagents to natively attend to the exact same shared memory state instantly.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Direktur Swarm & Perencanaan**: `brainstorming`, `zero-to-prod-orchestrator`, `speculative-multi-draft-synthesizer`
- **Model Fondasi & Penyedia**: `ai-llm-integration-expert`, `frontier-ai-models-expert`, `gemini-agent-booster`, `vercel-ai-sdk-expert`
- **Eksekusi Alat & Protokol MCP**: `mcp-server-architect`, `parallel-tool-orchestrator`, `doku-mcp-server`
- **Bahasa & Framework Agen**: `pydantic-ai-expert`, `structured-output-contracts`, `python-programming-expert`
- **Memori, State & Telemetri**: `session-memory-manager`, `agentic-memory-architect`, `data-telemetry-expert`
- **Keamanan & Gerbang Kualitas**: `anti-slop`, `mcp-sampling-critic`, `autonomous-red-teamer`, `zero-trust-secret-vault`

### Deskripsi
Panduan ahli untuk merancang, membangun, dan men-deploy sistem multi-agen AI tingkat produksi. Mencakup pola desain agentik inti (Prompt Chaining, Routing, Parallelization, Orchestrator-Workers, Evaluator-Optimizer), engine graph stateful (LangGraph, OpenAI Agents SDK, Google ADK, Mastra.ai), memori bersama episodik/semantik, sandbox eksekusi tool, dan guardrail human-in-the-loop (HITL).

**Sinergi Swarm:** Skill ini bertindak sebagai orkestrator utama jika dipadukan dengan `mcp-server-architect` (untuk integrasi tool eksternal) dan `ai-llm-integration-expert` (untuk konfigurasi foundation model). Bersama-sama, ketiganya membentuk **AI Engineering Swarm** yang tangguh dari awal hingga rilis produksi.

### Kondisi Pemicu
- Membangun agen AI otonom yang mengeksekusi tugas kompleks multi-langkah lintas domain.
- Merancang sistem kolaborasi, deliberasi, dan validasi silang antar beberapa agen AI spesialis.
- Mengimplementasikan alur kerja graph stateful dengan LangGraph, OpenAI Agents SDK, atau Google ADK.
- Menerapkan 5 pola desain agentik standar: Prompt Chaining, Routing, Parallelization, Orchestrator-Workers, atau Evaluator-Optimizer.
- Mengintegrasikan pos henti human-in-the-loop (HITL) untuk tindakan berisiko tinggi (eksekusi kode, migrasi database, transaksi keuangan).
- Memilih dan mengevaluasi arsitektur agen di ekosistem Python, TypeScript, atau multi-platform.

### 5 Pola Desain Agentik Inti (Standar Anthropic 2026)

Untuk sistem produksi yang handal, utamakan arsitektur **Workflows** terstruktur daripada loop otonom tanpa batas:

1. **Prompt Chaining**: Memecah tugas menjadi langkah-langkah sekuensial dengan validasi output di setiap transisi.
2. **Routing**: Mengklasifikasikan input pengguna dan mengarahkannya ke model atau sub-agen yang memiliki spesialisasi yang tepat.
3. **Parallelization (Sectioning & Voting)**: Menjalankan beberapa sub-agen secara simultan untuk tugas independen atau menjalankan ensemble untuk konsensus voting.
4. **Orchestrator-Workers**: Agen orkestrator pusat memecah masalah dinamis, mendelegasikannya ke pekerja dengan konteks terfokus, lalu merangkum hasil akhirnya.
5. **Evaluator-Optimizer Loop**: Agen pembuat (*generator*) menghasilkan solusi sementara agen penilai (*evaluator*) memberikan audit dan umpan balik hingga standar kualitas terpenuhi.

### Perbandingan Framework Agen (2026)

| Framework | Bahasa | Terbaik Untuk | Keunggulan Utama |
|---|---|---|---|
| **LangGraph (v0.3+)** | Python / TypeScript | Alur kerja graf stateful kompleks | Berbasis graf, checkpointer persisten, time-travel debugging |
| **OpenAI Agents SDK** | Python | Agen native GPT-5.6 Sol / o4-series | Handoff antar agen bawaan, tracing, dan guardrail otomatis |
| **Google ADK** | Python | Swarm agen bertenaga Gemini | Integrasi Vertex AI native, streaming multi-agen, search grounding |
| **Mastra.ai** | TypeScript | Web apps & microservice TS-first | Memori bawaan, evaluasi otomatis, RAG, dan dukungan MCP native |
| **CrewAI** | Python | Tim kolaborasi peran & flow terstruktur | Event-driven Flows, eksekusi manajer hierarkis, memori multi-tier |

### Panduan Implementasi Inti

#### 1. LangGraph — State Persisten & Checkpoint HITL
Memodelkan alur agen sebagai graf terarah dengan state bersama dan penyimpanan checkpoint:
- Simpan state di database (PostgreSQL / MemorySaver) agar alur kerja dapat dijeda dan dilanjutkan kapan saja.
- Terapkan `interrupt_before` sebelum node yang menjalankan perintah destruktif untuk meminta persetujuan manusia (*Human-in-the-loop*).

#### 2. OpenAI Agents SDK — Handoffs & Guardrails
Terapkan transisi kendali yang mulus antar agen dengan fungsi `handoff` bawaan serta pasang filter `guardrail` pada input dan output untuk mencegah eksekusi instruksi berbahaya.

#### 3. Google ADK — Multi-Agent Gemini
Bangun hierarki agen dengan model Gemini 3.x, di mana root agent mengoordinasikan sub-agents untuk riset, eksekusi kode, dan pembuatan dokumen.

#### 4. Mastra.ai — Solusi TypeScript Penuh
Gunakan Mastra untuk ekosistem Next.js dan Node.js: sediakan memori persisten ke Supabase/PostgreSQL, integrasikan tool MCP secara langsung, dan manfaatkan framework evaluasi bawaan.

#### 5. CrewAI — Tim Kolaborasi Agen, Eksekusi Hierarkis & Event-Driven Flows
Menggabungkan alur status aplikasi berbasis peristiwa (`Flow`) dengan tim agen otonom berbasis peran (`Crew`), mendukung delegasi hierarkis dan output Pydantic yang terstruktur:

```python
from crewai import Agent, Crew, Process, Task
from crewai.tools import tool
from crewai.flow.flow import Flow, start, listen, router
from pydantic import BaseModel, Field

# 1. Skema State dan Output Terstruktur
class LaporanKeamanan(BaseModel):
    is_vulnerable: bool
    vulnerabilities: list[str] = Field(default_factory=list)
    mitigation_plan: str

class StatePipeline(BaseModel):
    target_service: str = "payment-gateway"
    audit_passed: bool = False
    laporan: LaporanKeamanan | None = None

# 2. Tool Kustom Aman
@tool("pindai_dependensi")
def pindai_dependensi(service_name: str) -> str:
    """Memindai dependensi layanan terhadap kerentanan CVE yang diketahui."""
    return f"Pemindaian {service_name}: 0 kerentanan kritis, 1 peringatan tingkat rendah pada modul OpenSSL."

# 3. Alur Kerja Event-Driven (Flow) dengan State & Percabangan Kondisional
class PipelineDeploymentFlow(Flow[StatePipeline]):
    @start()
    def inisialisasi_pipeline(self):
        print(f"Menginisialisasi pipeline audit keamanan untuk: {self.state.target_service}")
        return self.state.target_service

    @listen(inisialisasi_pipeline)
    def jalankan_crew_keamanan(self, service: str):
        # Definisikan Agen Kolaboratif Berbasis Peran
        auditor = Agent(
            role="Auditor Keamanan",
            goal=f"Audit dependensi dan celah serangan untuk {service}",
            backstory="Pakar keamanan siber spesialisasi regulasi FinTech dan standar OWASP Top 10.",
            tools=[pindai_dependensi],
            verbose=True,
            memory=True
        )

        engineer = Agent(
            role="DevSecOps Engineer",
            goal="Menyusun langkah mitigasi terstruktur untuk seluruh temuan keamanan",
            backstory="Arsitek infrastruktur zero-trust dan rekayasa keandalan sistem.",
            verbose=True,
            memory=True
        )

        # Definisikan Tugas dengan Output Terstruktur dan Checkpoint HITL
        tugas_audit = Task(
            description=f"Periksa seluruh dependensi pustaka dan attack surface pada {service}.",
            expected_output="Hasil pemindaian dependensi mentah.",
            agent=auditor
        )

        tugas_mitigasi = Task(
            description="Buat laporan mitigasi dan verifikasi apakah layanan aman untuk di-deploy.",
            expected_output="Laporan JSON terstruktur sesuai skema LaporanKeamanan.",
            agent=engineer,
            output_pydantic=LaporanKeamanan,
            human_input=True
        )

        # Inisialisasi Crew dengan Eksekusi Manajer Hierarkis
        crew_keamanan = Crew(
            agents=[auditor, engineer],
            tasks=[tugas_audit, tugas_mitigasi],
            process=Process.hierarchical,
            manager_llm="gpt-5.6-sol",
            memory=True,
            verbose=True
        )

        hasil = crew_keamanan.kickoff()
        self.state.laporan = hasil.pydantic
        self.state.audit_passed = not self.state.laporan.is_vulnerable
        return self.state.audit_passed

    @router(jalankan_crew_keamanan)
    def evaluasi_rilis(self):
        if self.state.audit_passed:
            return "deploy"
        return "karantina"

    @listen("deploy")
    def tangani_deploy(self):
        print(f"Layanan {self.state.target_service} disetujui untuk rilis produksi zero-downtime.")

    @listen("karantina")
    def tangani_karantina(self):
        print(f"Rilis ditangguhkan: {self.state.target_service} dikarantina untuk perbaikan celah keamanan.")
```

#### 6. Guardrails Human-in-the-Loop (HITL)
Pengamanan wajib sebelum melakukan tindakan yang tidak dapat dibatalkan:
- **Pos Henti Interupsi**: Hentikan eksekusi sebelum menjalankan skrip shell berbahaya, migrasi skema tabel, atau memodifikasi data produksi.
- **Tinjauan Pratinjau**: Tampilkan ringkasan perbedaan (*diff*) kepada pengguna sebelum modifikasi dieksekusi.
- **Ambang Keyakinan**: Otomatis lanjutkan hanya jika skor keyakinan model >= 0.90; eskalasikan ke manusia jika berada di bawah ambang batas.

#### 7. Circuit Breakers & Protokol Pemulihan Swarm
- **Batas Percobaan Ulang**: Maksimal 2 kali perbaikan otomatis per sub-agen.
- **Eskalasi Fallback**: Jika agen spesialis mengalami kendala konteks atau gagal berulang kali, Swarm Director segera mengalihkan tugas ke `fullstack-expert` atau meminta masukan pengguna.
- **Persistensi Kemajuan**: Simpan selalu checkpoint di `PROGRESS.md` atau `BLUEPRINT.md` agar alur kerja dapat dilanjutkan secara efisien tanpa token berlebih.

#### 8. Swarm Simulasi Naratif (Paradigma Fable)
Arsitektur simulasi dunia cerita otonom multi-agen di mana agen bertindak sebagai karakter.
- **Pengkodean Kepribadian Karakter-Agen:** Menggunakan model kepribadian Big Five + vektor valensi emosional.
- **Protokol Dialog Antar-Agen:** Dibatasi oleh koherensi naratif.
- **Protokol Konsensus Status Dunia:** Memori bersama terdistribusi dengan penyelesaian konflik.
- **Pola Agen Sutradara (Director):** Meta-agen yang memastikan konsistensi alur cerita.

#### 9. Orkestrasi Computer-Using Agent (CUA)
- **Delegasi Agen CUA:** Sutradara mendelegasikan tugas UI ke agen pekerja CUA.
- **Observasi Berbagi Layar:** Orkestrator memantau aliran visual CUA.
- **Protokol Pemulihan:** Menangani kegagalan CUA (UI macet) melalui loop umpan balik visual.
- **Eksekusi CUA Paralel:** Berbagai agen mengoperasikan tab browser berbeda secara bersamaan.

#### 10. Swarm Persepsi Berkelanjutan
- **Pemantauan Selalu Aktif:** Loop persepsi 24/7 yang menangkap input multimodal (video/audio).
- **Agen Triase Langsung:** Pipeline (Intake → Klasifikasi → Rute).
- **Protokol Bangun Berbasis Peristiwa (Event-Driven):** Agen tidur hingga mendeteksi stimulus yang relevan.
- **Integrasi API Live Multimodal Gemini:** Hook bawaan untuk pemrosesan persepsi berkelanjutan.

#### 11. Swarm Paralel Masif (Agentic MoE) untuk LLM Next-Gen
Untuk model generasi berikutnya seperti **Gemini 4 Pro**:
- **Pemanggilan Tool Massal (Batching)**: Beralih dari orkestrator sekuensial (bertahap) ke pemanggilan fungsi massal secara serentak.
- **Aliran Konteks Monolitik**: Kirimkan seluruh konteks masif (snapshot codebase) secara langsung melalui KV-Cache, hindari RAG terfragmentasi per agen. Ini memungkinkan sub-agen menganalisis *state* memori yang sama secara instan.
