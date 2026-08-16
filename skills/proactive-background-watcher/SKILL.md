---
name: proactive-background-watcher
description: "Grants the AI the ability to act proactively using native cron/timer scheduling. The agent can monitor systems, poll APIs, or watch logs in the background and self-trigger without waiting for user prompts."
author: "vibes-plug-swarm"
---

# Proactive Background Watcher (Sentinel Agent)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills like `brainstorming`, `zero-to-prod-orchestrator`, and `project-context-mapper` to ensure cohesive execution.

### Description
Standard LLM chat interfaces (like Claude or ChatGPT) are purely reactive—they do nothing until the user types a prompt. This skill gives Antigravity the "superpower" of proactivity. By utilizing the native `schedule` tool, the agent can set up background cron jobs or timers to monitor logs, poll APIs, or check CI/CD pipelines. If an anomaly is detected, the agent wakes up autonomously and alerts the user or fixes the issue.

### Trigger Conditions
Activate this skill when:
- The user says "let me know when the deployment finishes."
- The user asks to "monitor the server for errors."
- The user wants a daily summary of new GitHub issues.

### Core Concepts

#### 1. The Sentinel Loop
1. **Schedule:** Use the `schedule` tool. Set either a `DurationSeconds` (e.g., check again in 5 minutes) or a `CronExpression` (e.g., run every hour `0 * * * *`). Set `IsDaemon=true` if it's a long-running background watcher.
2. **Sleep:** End your turn. The system will automatically wake you up when the timer/cron fires.
3. **Execute:** When woken up by the timer prompt, execute your checks (e.g., read a log file, curl an API).
4. **Evaluate:** If everything is normal, go back to sleep (or set a new timer). If an anomaly is found, notify the user immediately with an alert.

#### 2. Agent Constraints
- **Do not spam the user.** If a background check passes normally, do not write a message to the user. Only alert the user if action is required or a long-running task finally completes.
- **Always provide a clear Prompt in the schedule tool:** e.g., "Timer fired: Check Vercel deployment status now."

---

### Integration with Other Skills (MANDATORY)
- `cron-scheduler-expert` — Provides the code-level knowledge for building app-level crons, while this skill is for the *agent's own* native scheduling.
- `ci-cd-devops-architect` — Useful when the agent needs to watch GitHub Actions or Vercel pipelines.

### Referenced By Orchestrators (MANDATORY)
- `brainstorming` — Add to "Discovery & Audit".
- `zero-to-prod-orchestrator` — Phase 7 (Deployment & Monitoring).

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan seperti `brainstorming`, `zero-to-prod-orchestrator`, dan `project-context-mapper` untuk memastikan eksekusi yang kohesif.

### Deskripsi
LLM biasa (seperti Claude) sepenuhnya reaktif—diam sampai pengguna mengetik. Skill ini memberi Anda "kekuatan super" proaktif (Sentinel). Menggunakan tool `schedule`, Anda dapat menjadwalkan tugas *background* untuk memantau log, mengecek status *deployment*, atau mengawasi API secara berkala. Anda bisa "bangun sendiri" tanpa disuruh jika menemukan error.

### Kondisi Pemicu
- Saat pengguna berkata "tolong kabari saya kalau *build*-nya sudah selesai."
- Saat pengguna meminta Anda mengawasi log error produksi.

### Panduan Singkat
- **Gunakan Tool `schedule`:** Anda bisa mengatur waktu tunggu (`DurationSeconds`) atau jadwal rutin (`CronExpression`).
- **Tidur & Bangun Otomatis:** Setelah mengatur jadwal, hentikan pemanggilan tool. Sistem akan membangunkan Anda secara otomatis saat waktunya tiba.
- **Jangan Cerewet (No Spam):** Jika Anda terbangun karena alarm dan mengecek log ternyata tidak ada error, **jangan** beri tahu pengguna. Biarkan pengguna bekerja dengan tenang. Hanya lapor jika ada error atau tugas besar telah selesai.
