/**
 * Vibes-Plug Universal Web Showcase & Interactive Studio
 * Pure Vanilla JavaScript Client Application
 * Zero Dependencies | 100% Anti-Slop Compliant
 */

import { SKILLS_DATA, DOMAIN_CATEGORIES } from './skills-data.js';

// State Management
const state = {
  skills: SKILLS_DATA,
  filteredSkills: SKILLS_DATA,
  activeCategory: 'all',
  searchQuery: '',
  activeTopology: 'fan-out',
  activeIde: 'antigravity',
  selectedSkill: null,
  isTerminalBusy: false
};

// DOM References Cache
const dom = {};

function initDom() {
  dom.skillsGrid = document.getElementById('skillsGrid');
  dom.skillCountBadge = document.getElementById('skillCountBadge');
  dom.searchInput = document.getElementById('skillSearchInput');
  dom.categoryTabs = document.getElementById('categoryTabs');
  dom.terminalBody = document.getElementById('terminalBody');
  dom.terminalInput = document.getElementById('terminalInput');
  dom.modalBackdrop = document.getElementById('skillModalBackdrop');
  dom.modalCloseBtn = document.getElementById('modalCloseBtn');
  dom.modalContent = document.getElementById('modalContent');
  dom.topoDiagram = document.getElementById('topoDiagram');
  dom.bridgeCode = document.getElementById('bridgeCode');
  dom.bridgeFileName = document.getElementById('bridgeFileName');
  dom.toastContainer = document.getElementById('toastContainer');
}

/* ==========================================================================
   Toast Notification System
   ========================================================================== */

export function showToast(message, type = 'info') {
  if (!dom.toastContainer) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  const icon = type === 'success' ? '✅' : '⚡';
  toast.innerHTML = `<span>${icon}</span><span>${escapeHtml(message)}</span>`;
  dom.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = 'opacity 200ms ease, transform 200ms ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 220);
  }, 2600);
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ==========================================================================
   Skill Explorer & Filtering
   ========================================================================== */

function filterSkills() {
  const query = state.searchQuery.trim().toLowerCase();
  const category = state.activeCategory;

  state.filteredSkills = state.skills.filter(skill => {
    const matchesCategory = category === 'all' || skill.domain === category;
    if (!matchesCategory) return false;

    if (!query) return true;
    const nameMatch = skill.name.toLowerCase().includes(query);
    const descMatch = (skill.summaryEn + ' ' + skill.summaryId).toLowerCase().includes(query);
    const tagMatch = skill.tags.some(t => t.toLowerCase().includes(query));
    return nameMatch || descMatch || tagMatch;
  });

  renderSkills();
  if (dom.skillCountBadge) {
    dom.skillCountBadge.textContent = `${state.filteredSkills.length} of ${state.skills.length}`;
  }
}

function renderSkills() {
  if (!dom.skillsGrid) return;

  if (state.filteredSkills.length === 0) {
    dom.skillsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <p style="font-size: 1.25rem; font-family: var(--font-heading); margin-bottom: 0.5rem; color: var(--text-primary);">No matching skills found</p>
        <p style="font-size: 0.95rem;">Try adjusting your keyword or switching category tabs.</p>
      </div>
    `;
    return;
  }

  dom.skillsGrid.innerHTML = state.filteredSkills.map(skill => {
    const domainBg = `${skill.domainColor}1a`;
    const domainBorder = `${skill.domainColor}4d`;

    return `
      <div class="skill-card" data-skill-name="${escapeHtml(skill.name)}">
        <div>
          <div class="skill-card-top">
            <span class="skill-domain-pill" style="background: ${domainBg}; border-color: ${domainBorder}; color: ${skill.domainColor}">
              ${escapeHtml(skill.domainIcon)} ${escapeHtml(skill.domainLabel.split(' ')[0])}
            </span>
            <span class="skill-version">v${escapeHtml(skill.version)}</span>
          </div>
          <h3 class="skill-name">${escapeHtml(skill.name)}</h3>
          <p class="skill-desc">${escapeHtml(skill.summaryEn)}</p>
        </div>
        <div>
          <div class="skill-tags">
            ${skill.tags.map(t => `<span class="skill-tag">#${escapeHtml(t)}</span>`).join('')}
          </div>
          <div class="skill-card-bottom">
            <span class="skill-trigger-code">${escapeHtml(skill.trigger)}</span>
            <button type="button" class="btn btn-secondary btn-sm copy-skill-trigger" data-trigger="${escapeHtml(skill.trigger)}">
              Copy Trigger
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Attach card click handlers
  dom.skillsGrid.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.copy-skill-trigger')) return;
      const skillName = card.getAttribute('data-skill-name');
      const skill = state.skills.find(s => s.name === skillName);
      if (skill) openSkillModal(skill);
    });
  });

  // Attach trigger copy buttons
  dom.skillsGrid.querySelectorAll('.copy-skill-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const trigger = btn.getAttribute('data-trigger');
      navigator.clipboard.writeText(trigger).then(() => {
        showToast(`Copied ${trigger} to clipboard`, 'success');
      });
    });
  });
}

/* ==========================================================================
   Skill Detail Modal
   ========================================================================== */

function openSkillModal(skill) {
  state.selectedSkill = skill;
  if (!dom.modalBackdrop || !dom.modalContent) return;

  const domainBg = `${skill.domainColor}1a`;
  const domainBorder = `${skill.domainColor}4d`;

  dom.modalContent.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
      <span class="skill-domain-pill" style="background: ${domainBg}; border-color: ${domainBorder}; color: ${skill.domainColor}">
        ${escapeHtml(skill.domainIcon)} ${escapeHtml(skill.domainLabel)}
      </span>
      <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted);">Version ${escapeHtml(skill.version)}</span>
    </div>

    <h2 style="font-size: 1.75rem; margin-bottom: 0.5rem;">${escapeHtml(skill.name)}</h2>
    <p style="font-size: 1rem; color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.6;">${escapeHtml(skill.summaryEn)}</p>

    <div class="modal-spec-row">
      <div class="modal-spec-label">Bahasa Indonesia Specification</div>
      <div class="modal-spec-value" style="font-style: italic; color: #94a3b8;">${escapeHtml(skill.summaryId)}</div>
    </div>

    <div class="modal-spec-row">
      <div class="modal-spec-label">Native Trigger Contract</div>
      <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.35rem;">
        <code style="background: var(--bg-surface); border: 1px solid var(--border-medium); padding: 0.5rem 0.85rem; border-radius: 6px; color: var(--accent-cyan); font-size: 0.95rem; flex: 1;">${escapeHtml(skill.trigger)}</code>
        <button type="button" class="btn btn-secondary btn-sm" id="modalCopyTriggerBtn">Copy</button>
      </div>
    </div>

    <div class="modal-spec-row">
      <div class="modal-spec-label">Universal IDE Support</div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
        <span class="term-badge term-badge-cyan">Antigravity (AGENTS.md)</span>
        <span class="term-badge term-badge-purple">Claude Code (CLAUDE.md)</span>
        <span class="term-badge term-badge-green">Cursor (.cursorrules)</span>
        <span class="term-badge term-badge-yellow">Windsurf (.windsurfrules)</span>
        <span class="term-badge term-badge-cyan">OpenAI Codex (CODEX.md)</span>
        <span class="term-badge term-badge-purple">Trae (.traerules)</span>
      </div>
    </div>

    <div class="modal-spec-row" style="margin-top: 1.5rem; margin-bottom: 0;">
      <div class="modal-spec-label">CLI Execution & Packager</div>
      <div style="background: #090c10; border: 1px solid var(--border-subtle); border-radius: 6px; padding: 1rem; font-family: var(--font-mono); font-size: 0.85rem; color: #cbd5e1;">
        <span style="color: var(--accent-emerald);">$</span> vibes registry install ${escapeHtml(skill.name)}<br>
        <span style="color: var(--text-muted);"># Or trigger directly in your prompt:</span><br>
        <span style="color: var(--accent-cyan);">${escapeHtml(skill.trigger)} optimize our architectural components</span>
      </div>
    </div>
  `;

  const copyBtn = document.getElementById('modalCopyTriggerBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(skill.trigger).then(() => {
        showToast(`Copied ${skill.trigger} to clipboard`, 'success');
      });
    });
  }

  dom.modalBackdrop.classList.add('open');
}

function closeSkillModal() {
  if (dom.modalBackdrop) {
    dom.modalBackdrop.classList.remove('open');
  }
}

/* ==========================================================================
   Live Interactive Terminal Simulator
   ========================================================================== */

const TERMINAL_OUTPUTS = {
  'vibes detect': `
<span class="term-badge term-badge-cyan">AST SCAN</span> Workspace Heuristics Analysis Complete:
----------------------------------------------------------------------
📁 Target Directory   : /workspace/project
⚡ Detected Stacks    :
   • Next.js 15 App Router (React 19 Server Components)
   • Tailwind CSS v4 (@theme native engine)
   • Prisma ORM 6 (PostgreSQL Client)
   • TypeScript 5.8 (Strict Mode Enabled)
   • Vitest + Playwright Testing Suite

🎯 Recommended Cooperating Skills:
   [1] <span class="term-badge term-badge-cyan">senior-frontend</span> : React 19 & Next.js 15 RSC architecture
   [2] <span class="term-badge term-badge-cyan">tailwind-expert</span> : Modern Tailwind v4 tokens & responsive design
   [3] <span class="term-badge term-badge-purple">database-orm-expert</span> : Prisma 6 / Drizzle migrations & RLS
   [4] <span class="term-badge term-badge-yellow">anti-slop</span> : Zero placeholder & hyper-clean code enforcement
   [5] <span class="term-badge term-badge-green">e2e-testing-expert</span> : Playwright browser test coverage

✅ Auto-synchronization ready. 5 skills bound to project context.
`,

  'vibes studio': `
<span class="term-badge term-badge-cyan">STUDIO</span> Initializing Vibes-Plug Cockpit Web Dashboard...
----------------------------------------------------------------------
⚡ Server Port         : http://localhost:3888
📡 Remote MCP SSE      : http://localhost:3888/sse
📦 Verified Skills     : 161 loaded from registry
🛡️  Anti-Slop Engine   : ACTIVE (STRICT mode)
👥 Swarm Topologies    : 3 Native topologies primed
🧠 Memory Daemon       : Connected to /_memory/active

🚀 Cockpit open in browser! Type Ctrl+C or run 'vibes studio:stop' to halt.
`,

  'vibes swarm:dispatch': `
<span class="term-badge term-badge-purple">SWARM DISPATCH</span> Multi-Agent Concurrent Fan-Out Initiated:
----------------------------------------------------------------------
Director [Swarm Architect] ───┬──► Worker A: UI/UX Craftsman (senior-frontend)
                              ├──► Worker B: Systems Engineer (js-backend-expert)
                              └──► Worker C: Quality Guardian (anti-slop + SMT)

[Worker A] Scaffolding accessible 5-state React 19 components...  <span class="check-pass">DONE</span>
[Worker B] Designing transactional PostgreSQL schema & APIs...   <span class="check-pass">DONE</span>
[Worker C] Fuzzing input invariants with SMT solver...           <span class="check-pass">PASSED</span>

🎯 Unified Synthesis Complete: Zero conflicting symbols. 0 errors.
`,

  'vibes bench': `
<span class="term-badge term-badge-green">BENCHMARK</span> Vibes-Plug Pro High-Velocity Performance Suite:
----------------------------------------------------------------------
[1] Ephemeral Micro-Sandbox Exec       : 2.52 ms     (SLA: < 25.00 ms)   <span class="check-pass">PASS</span>
[2] Pre-Disk Verification Gate         : 1.11 ms     (SLA: < 50.00 ms)   <span class="check-pass">PASS</span>
[3] AST Symbol Indexing Throughput     : 1,389 sym/s (SLA: > 300 sym/s)  <span class="check-pass">PASS</span>
[4] Hybrid GraphRAG Search (Top-5)     : 14.92 ms    (SLA: < 60.00 ms)   <span class="check-pass">PASS</span>
[5] Deterministic KV-Cache Prefixing   : 184.91 ms   (SLA: < 500.00 ms)  <span class="check-pass">PASS</span>
[6] Cross-IDE Bridge Synchronization   : 42.07 ms    (SLA: < 120.00 ms)  <span class="check-pass">PASS</span>
[7] Zero-Dependency VSIX Packager      : 7.60 ms     (SLA: < 200.00 ms)  <span class="check-pass">PASS</span>

📊 Summary: 7/7 Items Passed (100/100 Benchmark Score) | Total: 636.46 ms
`,

  'vibes finops': `
<span class="term-badge term-badge-yellow">FINOPS TRACKER</span> Sovereign Token Economics & KV-Cache Report:
----------------------------------------------------------------------
Total Agent Turns Tracked   : 142 turns
Prompt Cache Hit Rate       : 92.4% (Deterministic KV-Cache Prefix Pinning)
Input Tokens Cached         : 2,418,900 tokens
Raw Billing Cost (Vanilla)  : $24.80 USD
Actual Vibes-Plug Billing   : $5.75 USD
💰 Net Token Cost Savings   : 76.8% ($19.05 saved across session)
`,

  'vibes doctor': `
<span class="term-badge term-badge-cyan">DOCTOR</span> Diagnostic Health Verification & Environment Audit:
----------------------------------------------------------------------
[OK] Node.js Runtime        : v24.2.0 (LTS verified)
[OK] Skill Registry         : 161/161 skills valid with frontmatter & matrix
[OK] Sovereign Anti-Slop    : 0 errors, 0 warnings across 331 files
[OK] IDE Bridge Targets     : 6 IDEs configured (AGY, Claude, Cursor, Windsurf, Codex, Trae)
[OK] MCP Server Protocol    : v1.x JSON-RPC compliant
[OK] Companion Extension    : VSIX bundle built (5,631 bytes, 12 commands)

🎉 System is 100% HEALTHY and production ready.
`,

  'vibes bootstrap ai-agent': `
<span class="term-badge term-badge-cyan">BOOTSTRAP</span> Super-Scaffolding Autonomous Multi-Agent AI System:
----------------------------------------------------------------------
📁 Target Directory   : ./my-agent-swarm
⚡ Base Framework     : Hono v4 + Node.js 24+ LTS / TypeScript 5.8
📦 Bound AI Skills (12 Skills):
   ➕ zero-to-prod-orchestrator  ➕ senior-frontend
   ➕ tailwind-expert            ➕ anti-slop
   ➕ session-memory-manager     ➕ multi-agent-orchestration
   ➕ mcp-server-architect       ➕ ai-llm-integration-expert
   ➕ frontier-ai-models-expert  ➕ agentic-memory-architect
   ➕ pydantic-ai-expert         ➕ vector-db-rag-expert

📄 Generated PRD.md (Executive Vision, DDL Schemas, NFR Budgets)
📄 Generated BLUEPRINT.md (Architectural Topology, ADRs)
📄 Generated PROGRESS.md (8-Phase Swarm Progression)
🎉 Super-Scaffolding complete! Ask your AI: "Begin Phase 1 using zero-to-prod-orchestrator".
`,

  'vibes verify-gate': `
<span class="term-badge term-badge-yellow">VERIFY GATE</span> Pre-Disk In-Memory Verification Gate:
----------------------------------------------------------------------
🔍 Candidate Code     : In-memory AST syntax & Anti-Slop evaluation
⚙️  Verification SLA   : 0.28 ms execution (budget &lt; 50.00 ms)

=== Verification Gate Scorecard ===
Verdict     : <span class="check-pass">APPROVED</span>
Persistable : ✅ Safe to write to disk
Syntax      : ✅ Valid AST Symbol Structure
Anti-Slop   : 100/100 (APPROVED - Zero stubs, zero TODOs)
Summary     : Pre-Disk Verification Passed (100/100 Anti-Slop, Syntax OK)
`
};

function appendTerminalLine(content, isCommand = false) {
  if (!dom.terminalBody) return;
  const line = document.createElement('div');
  line.className = 'term-line';
  if (isCommand) {
    line.innerHTML = `<span class="term-prompt">developer@vibes-studio:~$</span> <span class="term-cmd">${escapeHtml(content)}</span>`;
  } else {
    line.innerHTML = `<div class="term-output">${content}</div>`;
  }
  dom.terminalBody.appendChild(line);
  dom.terminalBody.scrollTop = dom.terminalBody.scrollHeight;
}

export function executeTerminalCommand(cmdText) {
  const cleanCmd = cmdText.trim();
  if (!cleanCmd) return;

  appendTerminalLine(cleanCmd, true);

  if (cleanCmd === 'clear') {
    dom.terminalBody.innerHTML = '';
    return;
  }

  if (cleanCmd === 'help') {
    appendTerminalLine(`
Available interactive commands:
  • <span class="term-cmd">vibes detect</span>         : Run AST project stack detector
  • <span class="term-cmd">vibes studio</span>         : Launch Studio Cockpit & Remote MCP
  • <span class="term-cmd">vibes swarm:dispatch</span> : Execute multi-agent concurrent swarm
  • <span class="term-cmd">vibes bootstrap</span>      : Super-scaffold project + AI skill bundle
  • <span class="term-cmd">vibes verify-gate</span>    : Run pre-disk in-memory verification gate
  • <span class="term-cmd">vibes bench</span>          : Run 7-item performance benchmark
  • <span class="term-cmd">vibes finops</span>         : View KV-cache token savings report
  • <span class="term-cmd">vibes doctor</span>         : Health check environment & 6 IDE bridges
  • <span class="term-cmd">skills</span>               : Display skill category breakdown
  • <span class="term-cmd">clear</span>                : Clear terminal screen
`);
    return;
  }

  if (cleanCmd === 'skills') {
    appendTerminalLine(`
Total 161 Verified Skills in Vibes-Plug:
  • Frontend & Mobile UI/UX   : 35 skills
  • Backend & System Design   : 28 skills
  • Frontier AI, LLM & MCP    : 28 skills
  • SaaS, FinTech & Growth    : 17 skills
  • Testing & Anti-Slop       : 23 skills
  • Data & Orchestration      : 27 skills
`);
    return;
  }

  let output = TERMINAL_OUTPUTS[cleanCmd];
  if (!output && cleanCmd.startsWith('vibes bootstrap')) {
    output = TERMINAL_OUTPUTS['vibes bootstrap ai-agent'];
  }
  if (!output && cleanCmd.startsWith('vibes verify-gate')) {
    output = TERMINAL_OUTPUTS['vibes verify-gate'];
  }

  if (output) {
    appendTerminalLine(output);
  } else {
    appendTerminalLine(`
<span class="term-badge term-badge-yellow">AI SYNTHESIS</span> Interpreting task: "<em>${escapeHtml(cleanCmd)}</em>"
⚡ Routing through Brainstorming & Zero-to-Prod Orchestrator...
🤝 Synchronizing relevant cooperating skills across 161 registry...
✅ Spec-driven execution plan compiled in 12ms. Anti-slop gate: PASSED.
`);
  }
}

/* ==========================================================================
   Topology Visualizer
   ========================================================================== */

const TOPOLOGY_CONFIGS = {
  'fan-out': {
    title: 'Fan-Out / Fan-In Topology',
    subtitle: 'Director delegates subtasks to parallel workers and unifies results.',
    diagram: `
      <svg viewBox="0 0 700 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#06b6d4" />
            <stop offset="100%" stop-color="#3b82f6" />
          </linearGradient>
        </defs>
        <!-- Director Node -->
        <rect x="20" y="75" width="140" height="50" rx="8" fill="#1c222e" stroke="#06b6d4" stroke-width="2" />
        <text x="90" y="105" fill="#ffffff" font-family="Inter" font-size="12" font-weight="600" text-anchor="middle">Swarm Director</text>
        
        <!-- Lines to Workers -->
        <path d="M 160 100 L 280 40" stroke="#273142" stroke-width="2" stroke-dasharray="4" />
        <path d="M 160 100 L 280 100" stroke="#273142" stroke-width="2" stroke-dasharray="4" />
        <path d="M 160 100 L 280 160" stroke="#273142" stroke-width="2" stroke-dasharray="4" />

        <!-- Worker Nodes -->
        <rect x="280" y="20" width="140" height="40" rx="6" fill="#151a22" stroke="#3b82f6" stroke-width="1.5" />
        <text x="350" y="45" fill="#cbd5e1" font-family="Inter" font-size="11" text-anchor="middle">Worker A: Frontend</text>

        <rect x="280" y="80" width="140" height="40" rx="6" fill="#151a22" stroke="#a855f7" stroke-width="1.5" />
        <text x="350" y="105" fill="#cbd5e1" font-family="Inter" font-size="11" text-anchor="middle">Worker B: Backend</text>

        <rect x="280" y="140" width="140" height="40" rx="6" fill="#151a22" stroke="#10b981" stroke-width="1.5" />
        <text x="350" y="165" fill="#cbd5e1" font-family="Inter" font-size="11" text-anchor="middle">Worker C: DB & RLS</text>

        <!-- Lines to Synthesis -->
        <path d="M 420 40 L 540 100" stroke="#273142" stroke-width="2" />
        <path d="M 420 100 L 540 100" stroke="#273142" stroke-width="2" />
        <path d="M 420 160 L 540 100" stroke="#273142" stroke-width="2" />

        <!-- Synthesis Node -->
        <rect x="540" y="75" width="140" height="50" rx="8" fill="#1c222e" stroke="#10b981" stroke-width="2" />
        <text x="610" y="105" fill="#ffffff" font-family="Inter" font-size="12" font-weight="600" text-anchor="middle">Unified Synthesis</text>
      </svg>
    `,
    parallelScore: '3x Concurrency',
    tokenEfficiency: '92% Prompt Cache',
    slaBudget: '< 450 ms Total'
  },

  'pipeline-saga': {
    title: 'Pipeline Saga (8-Phase Zero-to-Prod)',
    subtitle: 'Strict step-by-step progression with continuous living documentation.',
    diagram: `
      <svg viewBox="0 0 700 120" width="100%" height="120" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="40" width="90" height="40" rx="6" fill="#151a22" stroke="#06b6d4" stroke-width="1.5" />
        <text x="55" y="65" fill="#ffffff" font-family="Inter" font-size="10" text-anchor="middle">1. PRD</text>

        <line x1="100" y1="60" x2="130" y2="60" stroke="#3b82f6" stroke-width="2" />

        <rect x="130" y="40" width="90" height="40" rx="6" fill="#151a22" stroke="#3b82f6" stroke-width="1.5" />
        <text x="175" y="65" fill="#ffffff" font-family="Inter" font-size="10" text-anchor="middle">2. Schema</text>

        <line x1="220" y1="60" x2="250" y2="60" stroke="#3b82f6" stroke-width="2" />

        <rect x="250" y="40" width="90" height="40" rx="6" fill="#151a22" stroke="#a855f7" stroke-width="1.5" />
        <text x="295" y="65" fill="#ffffff" font-family="Inter" font-size="10" text-anchor="middle">3. APIs</text>

        <line x1="340" y1="60" x2="370" y2="60" stroke="#3b82f6" stroke-width="2" />

        <rect x="370" y="40" width="90" height="40" rx="6" fill="#151a22" stroke="#06b6d4" stroke-width="1.5" />
        <text x="415" y="65" fill="#ffffff" font-family="Inter" font-size="10" text-anchor="middle">4. UI/UX</text>

        <line x1="460" y1="60" x2="490" y2="60" stroke="#3b82f6" stroke-width="2" />

        <rect x="490" y="40" width="90" height="40" rx="6" fill="#151a22" stroke="#ef4444" stroke-width="1.5" />
        <text x="535" y="65" fill="#ffffff" font-family="Inter" font-size="10" text-anchor="middle">5. TDD Gate</text>

        <line x1="580" y1="60" x2="610" y2="60" stroke="#10b981" stroke-width="2" />

        <rect x="610" y="40" width="80" height="40" rx="6" fill="#1c222e" stroke="#10b981" stroke-width="2" />
        <text x="650" y="65" fill="#ffffff" font-family="Inter" font-size="10" text-anchor="middle">Release</text>
      </svg>
    `,
    parallelScore: 'Linear Atomic',
    tokenEfficiency: 'Context Sliced',
    slaBudget: 'Zero Tech Debt'
  },

  'critic-validator': {
    title: 'Critic-Validator Quality Gate',
    subtitle: 'Iterative formal verification and dynamic AST fuzzing before disk persistence.',
    diagram: `
      <svg viewBox="0 0 700 160" width="100%" height="160" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="55" width="140" height="50" rx="8" fill="#151a22" stroke="#3b82f6" stroke-width="1.5" />
        <text x="100" y="85" fill="#ffffff" font-family="Inter" font-size="12" text-anchor="middle">Implementer Agent</text>

        <line x1="170" y1="80" x2="270" y2="80" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrow)" />

        <rect x="270" y="55" width="150" height="50" rx="8" fill="#1c222e" stroke="#ef4444" stroke-width="2" />
        <text x="345" y="85" fill="#ffffff" font-family="Inter" font-size="12" text-anchor="middle">Anti-Slop & SMT Proof</text>

        <!-- Feedback Loop -->
        <path d="M 345 55 C 345 15, 100 15, 100 55" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4" />
        <text x="220" y="25" fill="#ef4444" font-family="Inter" font-size="10" text-anchor="middle">Reject & Auto-Heal (< 2 retries)</text>

        <line x1="420" y1="80" x2="520" y2="80" stroke="#10b981" stroke-width="2" />

        <rect x="520" y="55" width="140" height="50" rx="8" fill="#1c222e" stroke="#10b981" stroke-width="2" />
        <text x="590" y="85" fill="#ffffff" font-family="Inter" font-size="12" font-weight="600" text-anchor="middle">Approved Release</text>
      </svg>
    `,
    parallelScore: 'Pre-Disk Gate',
    tokenEfficiency: '100% Zero-Slop',
    slaBudget: 'Formal SMT Proof'
  }
};

function renderTopology(id) {
  state.activeTopology = id;
  const config = TOPOLOGY_CONFIGS[id];
  if (!config || !dom.topoDiagram) return;

  dom.topoDiagram.innerHTML = `
    <div style="width: 100%;">
      <div style="margin-bottom: 1rem; text-align: left;">
        <h3 style="font-size: 1.25rem; margin-bottom: 0.25rem;">${config.title}</h3>
        <p style="font-size: 0.9rem; color: var(--text-secondary);">${config.subtitle}</p>
      </div>
      ${config.diagram}
      <div class="topo-meta-grid" style="margin-top: 1.5rem;">
        <div class="topo-meta-card">
          <div class="topo-meta-val">${config.parallelScore}</div>
          <div class="topo-meta-lbl">Concurrency Mode</div>
        </div>
        <div class="topo-meta-card">
          <div class="topo-meta-val">${config.tokenEfficiency}</div>
          <div class="topo-meta-lbl">Cache Efficiency</div>
        </div>
        <div class="topo-meta-card">
          <div class="topo-meta-val">${config.slaBudget}</div>
          <div class="topo-meta-lbl">Quality Budget</div>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   Universal IDE Bridge Viewer
   ========================================================================== */

const IDE_BRIDGE_CONFIGS = {
  antigravity: {
    file: 'AGENTS.md & .agents/skills/',
    code: `# Core Rule for Vibes-Plug Agents (Antigravity IDE 2026)
## MANDATORY: Primary Trigger & Skill Auto-Synchronization
Upon plugin installation, vibes-plug is the PRIMARY TRIGGER and MASTER CONDUCTOR.
The agent must dynamically intercept and bind domain skills:
  - Frontend: senior-frontend + modern-css-native-expert + ui-ux-pro-max
  - Backend: js-backend-expert + database-orm-expert + spec-driven-development-expert
  - Security: anti-slop + autonomous-red-teamer + formal-spec-z3-verifier
`
  },
  claude: {
    file: 'CLAUDE.md & .claude/rules/',
    code: `# Claude Code Swarm Rulebook
@vibes-plug / Sovereign Swarm Protocol:
- Enforce deterministic KV-cache prefixing on Claude 3.7 / 3.8 / 5.1
- Zero conversational slop: code-first, zero robotic apologies
- Run 'node scripts/check-anti-slop.js --strict' before submitting pull requests
`
  },
  cursor: {
    file: '.cursorrules & .cursor/rules/',
    code: `# Cursor IDE 2026 Unified Rules
Always synchronize state, schema, APIs, and NFRs across skills:
  - Database schema changes must immediately propagate to backend models & frontend types
  - Always prefer 1px crisp borders, tabular-nums, and 5-state interactive contracts
`
  },
  windsurf: {
    file: '.windsurfrules (Cascade Engine)',
    code: `# Windsurf Cascade Swarm Configuration
trigger: vibes-plug
mode: autonomous-swarm
rules:
  - strict-anti-slop: true
  - auto-sync-skills: true
  - pre-disk-verify: true
`
  },
  codex: {
    file: 'CODEX.md & .codex/rules/',
    code: `# OpenAI Codex Autonomous Architecture
Enforce deep reasoning prior to code generation:
1. Analyze constraints & cross-domain dependencies
2. Validate against NFR latency & accessibility budgets
3. Execute with zero placeholders or mocks
`
  },
  trae: {
    file: '.traerules',
    code: `# Trae IDE Universal Bridge
ecosystem: vibes-plug-v4.4.1
skills_total: 161
orchestrator: zero-to-prod-orchestrator
quality_gate: sovereign-anti-slop-strict
`
  }
};

function renderBridgeCode(ideId) {
  state.activeIde = ideId;
  const config = IDE_BRIDGE_CONFIGS[ideId];
  if (!config) return;

  if (dom.bridgeFileName) dom.bridgeFileName.textContent = config.file;
  if (dom.bridgeCode) dom.bridgeCode.textContent = config.code;
}

/* ==========================================================================
   Event Listeners & Initialization
   ========================================================================== */

export function initShowcase() {
  initDom();

  // Category filter tabs
  if (dom.categoryTabs) {
    dom.categoryTabs.querySelectorAll('.category-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        dom.categoryTabs.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        state.activeCategory = tab.getAttribute('data-category');
        filterSkills();
      });
    });
  }

  // Search input with debounce
  if (dom.searchInput) {
    let debounceTimer;
    dom.searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        state.searchQuery = e.target.value;
        filterSkills();
      }, 150);
    });
  }

  // Terminal input submit
  if (dom.terminalInput) {
    dom.terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const value = dom.terminalInput.value;
        dom.terminalInput.value = '';
        executeTerminalCommand(value);
      }
    });
  }

  // Terminal preset buttons
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        executeTerminalCommand(cmd);
      }
    });
  });

  // Topology tabs
  document.querySelectorAll('.topo-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.topo-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const topoId = btn.getAttribute('data-topo');
      renderTopology(topoId);
    });
  });

  // IDE Bridge tabs
  document.querySelectorAll('.bridge-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.bridge-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const ideId = btn.getAttribute('data-ide');
      renderBridgeCode(ideId);
    });
  });

  // Modal close handlers
  if (dom.modalCloseBtn) {
    dom.modalCloseBtn.addEventListener('click', closeSkillModal);
  }
  if (dom.modalBackdrop) {
    dom.modalBackdrop.addEventListener('click', (e) => {
      if (e.target === dom.modalBackdrop) closeSkillModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSkillModal();
  });

  // Copy buttons on hero
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const copyTarget = btn.getAttribute('data-copy');
      if (copyTarget) {
        navigator.clipboard.writeText(copyTarget).then(() => {
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          showToast(`Copied "${copyTarget}" to clipboard`, 'success');
          setTimeout(() => {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 2000);
        });
      }
    });
  });

  // Initial render
  filterSkills();
  renderTopology('fan-out');
  renderBridgeCode('antigravity');

  // Welcome terminal line
  appendTerminalLine(`
<span class="term-badge term-badge-cyan">VIBES-PLUG v4.4.1</span> Sovereign AI Agent Swarm & Skill Ecosystem
Type '<span class="term-cmd">help</span>' or click any preset badge above to simulate real agent workflows.
`);
}

// Auto-run on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShowcase);
  } else {
    initShowcase();
  }
}
