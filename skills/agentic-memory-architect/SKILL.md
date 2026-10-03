---
name: agentic-memory-architect
description: Expert guide for long-term episodic memory integration (Mem0, Letta/MemGPT, Zep) and unified context management for autonomous AI agents / Panduan ahli untuk integrasi memori episodik jangka panjang dan manajemen konteks agen AI otonom.
version: "4.2.0"
author: "Roedy Rustam"
---

# Agentic Memory Architect & Episodic Memory Guide

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with `multi-agent-orchestration`, `pydantic-ai-expert`, `session-memory-manager`, and `zero-to-prod-orchestrator`.

### Purpose
To design and implement persistent, long-term episodic memory systems for autonomous AI agents, moving beyond simple context windows or localized session checkpoints. 

### Key Technologies
- **Mem0**: For cross-session entity memory and user preference persistence.
- **Letta (formerly MemGPT)**: For unbounded memory management allowing LLMs to page memory in and out.
- **Zep (v2)**: Fast, scalable memory service for AI applications, including temporal memory.

### Architectural Guidelines
1. **Memory Tiers**: Segregate memory into short-term (working context), mid-term (session graph), and long-term (vector-backed episodic memory).
2. **Context Paging**: Implement mechanisms for agents to proactively recall and summarize past interactions without overwhelming the token budget.
3. **User Knowledge Graphs**: Continually update the graph of user preferences, project constraints, and architectural decisions over time.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi bersama `multi-agent-orchestration`, `pydantic-ai-expert`, `session-memory-manager`, dan `zero-to-prod-orchestrator`.

### Tujuan
Merancang dan mengimplementasikan sistem memori episodik jangka panjang yang persisten untuk agen AI otonom, bergerak melampaui jendela konteks sederhana atau checkpoint sesi lokal.

### Teknologi Utama
- **Mem0**: Untuk memori entitas lintas-sesi dan persistensi preferensi pengguna.
- **Letta (sebelumnya MemGPT)**: Untuk manajemen memori tak terbatas yang memungkinkan LLM mengambil/menyimpan memori.
- **Zep (v2)**: Layanan memori cepat dan skalabel untuk aplikasi AI, termasuk memori temporal.

### Panduan Arsitektur
1. **Tingkatan Memori**: Pisahkan memori menjadi jangka pendek (konteks kerja), jangka menengah (grafik sesi), dan jangka panjang (memori episodik berbasis vektor).
2. **Context Paging**: Implementasikan mekanisme agar agen secara proaktif memanggil dan merangkum interaksi masa lalu tanpa menghabiskan anggaran token.
3. **User Knowledge Graph**: Terus perbarui graf preferensi pengguna, batasan proyek, dan keputusan arsitektur seiring waktu.
