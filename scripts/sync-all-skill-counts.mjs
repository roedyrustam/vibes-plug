import fs from 'fs';
import path from 'path';

const PLUGIN_ROOT = process.cwd();

// Helper to replace text safely in a file
function replaceInFile(relPath, replacements) {
  const fullPath = path.join(PLUGIN_ROOT, relPath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`File not found: ${relPath}`);
    return;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;
  for (const [target, replacement] of replacements) {
    if (content.includes(target)) {
      content = content.replaceAll(target, replacement);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Synchronized: ${relPath}`);
  }
}

console.log('⚡ Starting 178-Skill & 8-Subagent Universal Ecosystem Synchronization (v4.7.0)...\n');

// 1. Core Configs & Manifests
replaceInFile('package.json', [
  ['"version": "4.5.0"', '"version": "4.7.0"'],
  ['171 specialized skills', '178 specialized skills'],
  ['161 specialized skills', '178 specialized skills'],
  ['160 specialized skills', '178 specialized skills'],
  [
    'Updated for the modern 2026 tech stack (React 19, Tailwind v4, Bun, Hono, A2A, MCP, ClickHouse, Kubernetes GitOps, CUA).',
    'Updated for the modern 2026 tech stack (React 19, Tailwind v4, Bun, Hono, A2A, MCP, Universal Skill-as-a-Tool SaaT, Ghidra/REA Reverse Engineering, ClickHouse, Kubernetes GitOps, CUA).'
  ]
]);

replaceInFile('plugin.json', [
  ['"version": "4.5.0"', '"version": "4.7.0"'],
  ['171 specialized skills', '178 specialized skills'],
  ['161 specialized skills', '178 specialized skills'],
  ['159 specialized skills', '178 specialized skills']
]);

replaceInFile('gemini-extension.json', [
  ['"version": "4.5.0"', '"version": "4.7.0"'],
  ['171 specialized skills', '178 specialized skills'],
  ['161 specialized skills', '178 specialized skills'],
  ['160 specialized skills', '178 specialized skills']
]);

replaceInFile('.codex-plugin/plugin.json', [
  ['"version": "4.5.0"', '"version": "4.7.0"'],
  ['171 specialized skills', '178 specialized skills'],
  ['161 specialized skills', '178 specialized skills'],
  ['160 specialized skills', '178 specialized skills']
]);

replaceInFile('.cursor-plugin/plugin.json', [
  ['"version": "4.5.0"', '"version": "4.7.0"'],
  ['171 specialized domain skills, 5 native agents', '178 specialized domain skills, 8 native agents'],
  ['171 specialized domain skills', '178 specialized domain skills'],
  ['161 specialized domain skills', '178 specialized domain skills']
]);

replaceInFile('index.js', [
  ['171 Specialized Skills', '178 Specialized Skills'],
  ['161 Specialized Skills', '178 Specialized Skills'],
  ['160 Specialized Skills', '178 Specialized Skills']
]);

replaceInFile('extensions/vscode/package.json', [
  ['"version": "4.5.0"', '"version": "4.7.0"'],
  ['171 Skills', '178 Skills'],
  ['171-Skill', '178-Skill'],
  ['161-agent', '178-agent'],
  ['171-agent', '178-agent'],
  ['161 Skills', '178 Skills'],
  ['161-Skill', '178-Skill'],
  ['160 Skills', '178 Skills'],
  ['160-Skill', '178-Skill']
]);

replaceInFile('extensions/vscode/extension.js', [
  ['171 Skills', '178 Skills'],
  ['171-Skill', '178-Skill'],
  ['161 Skills', '178 Skills'],
  ['161-Skill', '178-Skill'],
  ['160 Skills', '178 Skills'],
  ['160-Skill', '178-Skill']
]);

replaceInFile('extensions/vscode/README.md', [
  ['171 Skills', '178 Skills'],
  ['161 Skills', '178 Skills'],
  ['160 Skills', '178 Skills']
]);

// 2. Rules & Agent Entry Points
const ruleFiles = [
  'AGENTS.md',
  'CLAUDE.md',
  'CODEX.md',
  '.cursorrules',
  '.clinerules',
  '.windsurfrules',
  '.traerules'
];

for (const rf of ruleFiles) {
  replaceInFile(rf, [
    ['core rules and 171 skills are shared.', 'core rules and 178 skills are shared.'],
    ['from the 171 skill registry:', 'from the 178 skill registry:'],
    ['based on the 171 specialized skills in `vibes-plug`.', 'based on the 178 specialized skills in `vibes-plug`.']
  ]);
}

replaceInFile('rules/AGENTS.md', [
  ['core rules and 171 skills are shared.', 'core rules and 178 skills are shared.'],
  ['from the 171 skill registry:', 'from the 178 skill registry:'],
  ['based on the 171 specialized skills in `vibes-plug`.', 'based on the 178 specialized skills in `vibes-plug`.']
]);

replaceInFile('.claude/rules/vibes-plug-core.md', [
  ['core rules and 171 skills are shared.', 'core rules and 178 skills are shared.'],
  ['against the 171 skills', 'against the 178 skills']
]);

replaceInFile('.codex/rules/vibes-plug-core.md', [
  ['core rules and 171 skills are shared.', 'core rules and 178 skills are shared.'],
  ['against the 171 skills', 'against the 178 skills']
]);

replaceInFile('.cursor/rules/vibes-plug-core.mdc', [
  ['171-Skill', '178-Skill'],
  ['171-skill registry', '178-skill registry'],
  ['171 specialized skills', '178 specialized skills']
]);

replaceInFile('.cursor/rules/vibes-plug-skills.mdc', [
  ['171-Skill', '178-Skill']
]);

replaceInFile('rules/vibes-plug-core.mdc', [
  ['171-Skill', '178-Skill'],
  ['171 specialized skills', '178 specialized skills']
]);

replaceInFile('.kimirules', [
  ['171 specialized skills', '178 specialized skills']
]);

replaceInFile('.kirorules', [
  ['171 specialized skills', '178 specialized skills']
]);

replaceInFile('.github/workflows/anti-slop-gate.yml', [
  ['171 Skills', '178 Skills']
]);

// 3. Binaries & MCP Server
replaceInFile('bin/vibes.mjs', [
  ['browse all 171 skills', 'browse all 178 skills'],
  ['All 171 skills automatically synchronize', 'All 178 skills automatically synchronize'],
  ['Search all 171 skills by keyword', 'Search all 178 skills by keyword'],
  ['Export or preview the complete 171-skill ecosystem catalog', 'Export or preview the complete 178-skill ecosystem catalog'],
  ['Launch local web Studio Cockpit dashboard (visual 171-skill explorer)', 'Launch local web Studio Cockpit dashboard (visual 178-skill explorer)']
]);

replaceInFile('bin/mcp-server.mjs', [
  ['any of the 171 skills', 'any of the 178 skills'],
  ['Discover all 171 skills', 'Discover all 178 skills'],
  ['any of the 171 specialized skills', 'any of the 178 specialized skills'],
  ['List all 171 AI domain skills', 'List all 178 AI domain skills'],
  ['Synchronize 171-skill', 'Synchronize 178-skill'],
  ['audits all 171 skills', 'audits all 178 skills'],
  ['Compiled 171-skill canonical prefix', 'Compiled 178-skill canonical prefix']
]);

// 4. Scripts
replaceInFile('scripts/audit-graph.mjs', [
  ['Graph Audit (171 Skills):', 'Graph Audit (178 Skills):']
]);

replaceInFile('scripts/create-agent.mjs', [
  ['171 skills', '178 skills']
]);

replaceInFile('scripts/cross-ide-bridge.mjs', [
  ['171-Skill', '178-Skill'],
  ['171 skills', '178 skills']
]);

replaceInFile('scripts/install.js', [
  ['171 skills', '178 skills']
]);

replaceInFile('scripts/package-extension.mjs', [
  ['171-skill', '178-skill'],
  ['171 skills', '178 skills']
]);

replaceInFile('scripts/registry-manager.mjs', [
  ['171 Skill Gold Standard', '178 Skill Gold Standard']
]);

replaceInFile('scripts/skill-drift-monitor.mjs', [
  ['171 skills', '178 skills']
]);

replaceInFile('scripts/swarm-bus.mjs', [
  ['171-skill', '178-skill']
]);

replaceInFile('scripts/swarm-dispatcher.mjs', [
  ['171-skill', '178-skill']
]);

replaceInFile('scripts/terminal-monitor.mjs', [
  ['171 skills', '178 skills']
]);

replaceInFile('scripts/token-budget-optimizer.mjs', [
  ['171-Skill', '178-Skill']
]);

replaceInFile('scripts/studio-server.mjs', [
  ['Visualizes the 171 AI domain skills', 'Visualizes the 178 AI domain skills'],
  ['let totalSkills = 171;', 'let totalSkills = 178;'],
  ['totalSkills = 171;', 'totalSkills = 178;'],
  ['171-Skill Swarm Architecture', '178-Skill Swarm Architecture'],
  ['Autonomous 171-Agent Swarm', 'Autonomous 178-Agent Swarm'],
  ['<span class="num" id="stat-total-skills">171</span>', '<span class="num" id="stat-total-skills">178</span>'],
  ['171-Skill Arsenal', '178-Skill Arsenal'],
  ['Search 171 skills', 'Search 178 skills'],
  ['All Domains (171)', 'All Domains (178)'],
  ['access the 171 skills', 'access the 178 skills'],
  ['Discover 171 skills', 'Discover 178 skills'],
  ['Synchronize 171 skills', 'Synchronize 178 skills'],
  ['Roedy Rustam &bull; 171 Skills', 'Roedy Rustam &bull; 178 Skills']
]);

// 5. Showcase Web App
replaceInFile('showcase/index.html', [
  ['171 Skill Ecosystem', '178 Skill Ecosystem'],
  ['171 Skills Verified', '178 Skills Verified'],
  ['171-skill', '178-skill'],
  ['171 skills', '178 skills'],
  ['171 Skills', '178 Skills'],
  ['171 verified skills', '178 verified skills'],
  ['171 verified skill ecosystem', '178 verified skill ecosystem'],
  ['171 specialized domain skills', '178 specialized domain skills'],
  ['Explore 171 Specialized Domain Skills', 'Explore 178 Specialized Domain Skills'],
  ['Explore 171 Skills', 'Explore 178 Skills'],
  ['<div class="stat-value tabular-nums" id="statSkillsCount">171</div>', '<div class="stat-value tabular-nums" id="statSkillsCount">178</div>'],
  ['<span class="category-badge-count tabular-nums">171</span>', '<span class="category-badge-count tabular-nums">178</span>'],
  ['Showing <strong id="skillCountBadge" class="tabular-nums">171 of 171</strong> verified skills', 'Showing <strong id="skillCountBadge" class="tabular-nums">178 of 178</strong> verified skills'],
  ['171 Verified Skills', '178 Verified Skills'],
  ['171 Skills Registry', '178 Skills Registry'],
  ['<span>Testing &amp; Anti-Slop</span>\n              <span class="category-badge-count tabular-nums">26</span>', '<span>Testing &amp; Anti-Slop</span>\n              <span class="category-badge-count tabular-nums">31</span>']
]);

replaceInFile('showcase/app.js', [
  ['Verified Skills     : 171 loaded from registry', 'Verified Skills     : 178 loaded from registry'],
  ['171/171 skills valid with frontmatter & matrix', '178/178 skills valid with frontmatter & matrix'],
  ['Total 171 Verified Skills in Vibes-Plug:', 'Total 178 Verified Skills in Vibes-Plug:'],
  ['across 171 registry...', 'across 178 registry...'],
  ['skills_total: 171', 'skills_total: 178']
]);

// Rebuild showcase/skills-data.js from CATALOG.json
const catalogPath = path.join(PLUGIN_ROOT, 'CATALOG.json');
if (fs.existsSync(catalogPath)) {
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const domainCategories = {
    frontend: { label: 'Frontend & Mobile UI/UX', icon: 'UI', color: '#06b6d4' },
    backend: { label: 'Backend & System Design', icon: 'SYS', color: '#3b82f6' },
    ai: { label: 'Frontier AI, LLM & MCP', icon: 'AI', color: '#a855f7' },
    saas: { label: 'SaaS, FinTech & Growth', icon: 'BIZ', color: '#10b981' },
    security: { label: 'Testing, Security & Anti-Slop', icon: 'SEC', color: '#ef4444' },
    data: { label: 'Data, Media & Orchestration', icon: 'DATA', color: '#f59e0b' }
  };
  const skillDomainMap = {
    'angular-expert': 'frontend', 'apple-ecosystem-expert': 'frontend', 'astro-framework-expert': 'frontend',
    'blockchain-web3-expert': 'frontend', 'browser-extension-mv3-pro': 'frontend', 'design-system-architect': 'frontend',
    'desktop-electron-expert': 'frontend', 'ephemeral-generative-ui-architect': 'frontend', 'form-validation-expert': 'frontend',
    'global-a11y-i18n-expert': 'frontend', 'glsl-shader-expert': 'frontend', 'hig': 'frontend', 'micro-frontend-architect': 'frontend',
    'mobile-expo-expert': 'frontend', 'modern-css-native-expert': 'frontend', 'mpa-orchestrator': 'frontend',
    'multimodal-spatial-video-cloner': 'frontend', 'nextjs-app-router-expert': 'frontend', 'pwa-offline-first-expert': 'frontend',
    'rich-text-editor-expert': 'frontend', 'screenshot-to-code-expert': 'frontend', 'senior-frontend': 'frontend',
    'solidjs-expert': 'frontend', 'spa-orchestrator': 'frontend', 'state-management-expert': 'frontend',
    'svg-animation-motion-expert': 'frontend', 'svelte-sveltekit-expert': 'frontend', 'tailwind-expert': 'frontend',
    'tanstack-query-expert': 'frontend', 'tauri-expert': 'frontend', 'ui-ux-pro-max': 'frontend', 'vue-frontend-expert': 'frontend',
    'visual-ui-auditor': 'frontend', 'performance-web-vitals': 'frontend', 'web-3d-graphics-expert': 'frontend', 'webxr-ar-vr-expert': 'frontend',
    'flutter-dart-expert': 'frontend', 'htmx-hypermedia-expert': 'frontend', 'reactive-sync-engine-expert': 'frontend',
    'api-design-expert': 'backend', 'api-gateway-proxy-expert': 'backend', 'async-queue-temporal-expert': 'backend',
    'autonomous-api-drift-healer': 'backend', 'bun-runtime-expert': 'backend', 'cloudflare-workers-expert': 'backend', 'composable-mach-architect': 'backend',
    'cron-scheduler-expert': 'backend', 'domain-driven-design-expert': 'backend', 'ephemeral-wasm-sandbox-executor': 'backend',
    'event-driven-architect': 'backend', 'fullstack-expert': 'backend', 'go-programming-expert': 'backend',
    'graphql-apollo-expert': 'backend', 'js-backend-expert': 'backend', 'legacy-code-translator': 'backend',
    'living-codebase-ast-graph': 'backend', 'monorepo-architect': 'backend', 'mvc-expert': 'backend',
    'openapi-swagger-codegen-expert': 'backend', 'python-programming-expert': 'backend', 'rust-programming-expert': 'backend',
    'scalability-clean-code': 'backend', 'spec-driven-development-expert': 'backend', 'typescript-expert': 'backend',
    'wasm-edge-computing-expert': 'backend', 'web-game-engine-expert': 'backend', 'structured-output-contracts': 'backend',
    'adaptive-model-cascade': 'ai', 'affective-computing-emotion-ai': 'ai', 'agentic-coding-workflow-expert': 'ai',
    'agentic-memory-architect': 'ai', 'agentic-micro-economy-architect': 'ai', 'ai-llm-integration-expert': 'ai',
    'ai-media-generation-expert': 'ai', 'ai-prompt-engineering-expert': 'ai', 'ai-safety-governance-expert': 'ai',
    'context-window-engineer': 'ai', 'deep-research-analyst': 'ai', 'doku-mcp-server': 'ai',
    'frontier-ai-models-expert': 'ai', 'gemini-agent-booster': 'ai', 'graph-rag-knowledge-expert': 'ai',
    'kv-cache-prefix-optimizer': 'ai', 'llm-finops-router': 'ai', 'llm-observability-expert': 'ai',
    'local-slm-edge-ai-expert': 'ai', 'mcp-server-architect': 'ai', 'multi-agent-orchestration': 'ai',
    'pydantic-ai-expert': 'ai', 'speculative-multi-draft-synthesizer': 'ai', 'synthetic-data-finetuning-expert': 'ai',
    'test-time-compute-optimizer': 'ai', 'vector-db-rag-expert': 'ai', 'vercel-ai-sdk-expert': 'ai', 'voice-ai-realtime-agent': 'ai',
    'thinking-budget-orchestrator': 'ai', 'parallel-tool-orchestrator': 'ai', 'xerj-search-expert': 'ai',
    'a2a-agent-protocol-expert': 'ai', 'durable-agent-execution-expert': 'ai', 'computer-use-os-agent-expert': 'ai',
    'neurosymbolic-genetic-synthesizer': 'ai',
    'agentic-m2m-settlement': 'saas', 'app-promo-media-expert': 'saas', 'chatbot-messaging-expert': 'saas',
    'doku-payment-gateway': 'saas', 'ecommerce-expert': 'saas', 'email-notification-expert': 'saas',
    'feature-flag-analytics-expert': 'saas', 'headless-cms-expert': 'saas', 'n8n-automation-expert': 'saas',
    'payment-gateway-expert': 'saas', 'saas-architect': 'saas', 'saas-billing': 'saas', 'saas-multi-tenant': 'saas',
    'seo': 'saas', 'data-telemetry-expert': 'saas', 'wordpress-headless-expert': 'saas', 'double-entry-ledger-fintech-expert': 'saas',
    'accessibility-testing-expert': 'security', 'ai-code-review-autonomous': 'security', 'anti-slop': 'security',
    'authentication-identity-expert': 'security', 'autonomous-red-teamer': 'security', 'autonomous-tdd-debugger': 'security',
    'biome-linter-formatter-expert': 'security', 'compliance-gdpr-privacy-expert': 'security', 'e2e-testing-expert': 'security',
    'error-resilience-expert': 'security', 'firebase-security-expert': 'security', 'formal-spec-z3-verifier': 'security',
    'logging-error-tracking-expert': 'security', 'post-quantum-crypto-migrator': 'security', 'prompt-injection-firewall': 'security',
    'property-mutation-testing-expert': 'security', 'rate-limit-abuse-prevention': 'security', 'supabase-security-expert': 'security',
    'zero-tech-debt-auditor': 'security', 'zero-trust-secret-vault': 'security', 'coderabbit': 'security', 'app-analyzer-optimizer': 'security',
    'mcp-sampling-critic': 'security', 'fga-rebac-authorization-expert': 'security', 'passkeys-webauthn-identity-expert': 'security', 'sbom-supply-chain-security-expert': 'security',
    'reverse-engineer-anything': 'security', 'rea-tool-design': 'security', 'rea-analysis-optimization': 'security', 'rea-ci-tests-audit': 'security', 'rea-changelog-update': 'security',
    'formal-theorem-verifier-lean4': 'security',
    'brainstorming': 'data', 'browser-automation-expert': 'data',
    'ci-cd-devops-architect': 'data', 'github-actions-expert': 'data', 'docker-container-expert': 'data', 'cloud-hosting-expert': 'data', 'data-pipeline-etl-expert': 'data',
    'data-visualization-expert': 'data', 'database-orm-expert': 'data', 'dependency-upgrade-migrator': 'data',
    'documentation-site-expert': 'data', 'file-upload-media-expert': 'data', 'geospatial-maps-expert': 'data',
    'pdf-document-generation-expert': 'data', 'prd-architect': 'data', 'proactive-background-watcher': 'data',
    'production-ready-hardener': 'data', 'search-engine-expert': 'data', 'self-healing-cloud-orchestrator': 'data',
    'session-memory-manager': 'data', 'realtime-collaboration-expert': 'data', 'sse-websocket-streaming-expert': 'data', 'web-scraper': 'data', 'website-design-cloner': 'data', 'zero-to-prod-orchestrator': 'data', 'olap-columnar-analytics-expert': 'data', 'kubernetes-gitops-platform-expert': 'data'
  };

  const skillsData = catalog.skills.map((s) => {
    const domain = skillDomainMap[s.name] || 'data';
    const cat = domainCategories[domain];
    const parts = (s.description || '').split(' / ');
    const summaryEn = parts[0] || s.description || '';
    const summaryId = parts[1] || summaryEn;
    const rawTags = s.name.split('-').filter((w) => w !== 'expert' && w !== 'architect' && w !== 'pro');
    const tags = Array.from(new Set([...rawTags, domain]));
    return {
      name: s.name,
      domain,
      domainLabel: cat.label,
      domainColor: cat.color,
      domainIcon: cat.icon,
      version: s.version || '4.7.0',
      author: s.author || 'Roedy Rustam',
      trigger: `@${s.name}`,
      summaryEn,
      summaryId,
      tags
    };
  });

  const skillsDataContent = `/**
 * Vibes-Plug 178 Verified Skills Registry
 * Auto-synchronized dataset for Public Web Showcase & Interactive Explorer
 */

export const SKILLS_DATA = ${JSON.stringify(skillsData, null, 2)};

export const DOMAIN_CATEGORIES = ${JSON.stringify(domainCategories, null, 2)};
`;
  fs.writeFileSync(path.join(PLUGIN_ROOT, 'showcase/skills-data.js'), skillsDataContent, 'utf8');
  console.log('✅ Synchronized: showcase/skills-data.js (178 verified skills)');
}

// 6. Documentation Files
replaceInFile('CONTRIBUTING.md', [
  ['the 171 ecosystem', 'the 178 ecosystem'],
  ['the 171 catalog', 'the 178 catalog'],
  ['dalam 171 katalog', 'dalam 178 katalog']
]);

replaceInFile('README.md', [
  ['171-agent software development studio', '178-agent software development studio'],
  ['171 Domain Skills', '178 Domain Skills'],
  ['Deterministic P1–P6 Reasoning', 'Deterministic P1–P7 Reasoning'],
  ['171-agent%20autonomous%20software%20studio', '178-agent%20autonomous%20software%20studio'],
  ['Swarm Director & 171 Specialists', 'Swarm Director & 178 Specialists'],
  ['P1–P5 Engines (KV-Cache, In-Memory DB, AST, PRM, SMT)', 'P1–P7 Engines (KV-Cache, DB Sandbox, AST, PRM, SMT, VM, SaaT)'],
  ['Stdio MCP v1.x Server with 8 Frontier Tools', 'Stdio & SSE MCP v1.x Server with 35 Frontier Tools'],
  ['The 171-Skill Arsenal', 'The 178-Skill Arsenal'],
  ['171 specialized AI domain skills', '178 specialized AI domain skills'],
  ['171-Skill Interactive Catalog', '178-Skill Interactive Catalog'],
  ['Superintelligence Engineering Substrate (P1 – P6 Engines)', 'Superintelligence Engineering Substrate (P1 – P7 Engines)'],
  ['embeds 6 foundational engineering engines', 'embeds 7 foundational engineering engines'],
  ['any of the 171 specialized skills', 'any of the 178 specialized skills'],
  ['Discover all 171 skills', 'Discover all 178 skills'],
  ['synchronize rules & 171 skills', 'synchronize rules & 178 skills'],
  ['VibesPlug: 171 Skills Active', 'VibesPlug: 178 Skills Active'],
  ['orchestrating 171 specialized AI subagents', 'orchestrating 178 specialized AI subagents'],
  ['visual 171-skill explorer', 'visual 178-skill explorer'],
  ['Lists all 171 skills', 'Lists all 178 skills'],
  ['Searches 171 skills', 'Searches 178 skills'],
  ['Exports full 171-skill catalog', 'Exports full 178-skill catalog'],
  ['mengorkestrasi 171 sub-agen AI spesialis', 'mengorkestrasi 178 sub-agen AI spesialis'],
  ['update 171 skill dan engine terbaru', 'update 178 skill dan engine terbaru'],
  ['eksplorasi visual 171 skill', 'eksplorasi visual 178 skill'],
  ['daftar 171 skill', 'daftar 178 skill'],
  ['Mencari 171 skill', 'Mencari 178 skill'],
  ['katalog 171 skill', 'katalog 178 skill'],
  ['编排 171 个专业的 AI 子代理', '编排 178 个专业的 AI 子代理'],
  ['171 个技能可视化探索', '178 个技能可视化探索'],
  ['导出 171 个技能的完整目录', '导出 178 个技能的完整目录'],
  ['orchestert 160 spezialisierte KI-Subagenten', 'orchestert 178 spezialisierte KI-Subagenten'],
  ['orchestriert 160 spezialisierte KI-Subagenten', 'orchestriert 178 spezialisierte KI-Subagenten'],
  ['orchestriert 171 spezialisierte KI-Subagenten', 'orchestriert 178 spezialisierte KI-Subagenten'],
  ['visueller 171-Skill-Explorer', 'visueller 178-Skill-Explorer'],
  ['vollständigen 171-Skill-Katalog', 'vollständigen 178-Skill-Katalog'],
  ['171 の専門的な AI サブエージェント', '178 の専門的な AI サブエージェント'],
  ['171スキルの視覚的探索', '178スキルの視覚的探索'],
  ['171のスキル全カタログ', '178のスキル全カタログ']
]);

replaceInFile('BENCHMARK_REPORT.md', [
  ['171 Specialized Skills', '178 Specialized Skills'],
  ['171-skill', '178-skill'],
  ['171 skills', '178 skills']
]);

replaceInFile('COMPARISON.md', [
  ['171 Skills', '178 Skills'],
  ['171 skills', '178 skills']
]);

replaceInFile('PRODUCT_HUNT.md', [
  ['171-Skill', '178-Skill'],
  ['171 skills', '178 skills']
]);

replaceInFile('REDDIT_LAUNCH.md', [
  ['171-skill', '178-skill'],
  ['171 specialized skills', '178 specialized skills'],
  ['171 skills', '178 skills']
]);

replaceInFile('SHOW_HN.md', [
  ['171-Skill', '178-Skill'],
  ['171 specialized skills', '178 specialized skills'],
  ['171 skills', '178 skills']
]);

replaceInFile('TRENDING_PLAYBOOK.md', [
  ['171-Skill', '178-Skill'],
  ['171-skill', '178-skill'],
  ['171 Specialized Skills', '178 Specialized Skills'],
  ['171 skills', '178 skills']
]);

// 7. Test CLI Assertions
replaceInFile('scripts/test-cli.mjs', [
  ['vibes doctor should verify 171 skills', 'vibes doctor should verify 178 skills'],
  ['vibes docs should generate 171 skill ecosystem preview', 'vibes docs should generate 178 skill ecosystem preview'],
  ['against 171 gold standards', 'against 178 gold standards'],
  ['studio server should serve 171 skills, cockpit HTML, and Remote MCP SSE', 'studio server should serve 178 skills, cockpit HTML, and Remote MCP SSE'],
  ['171-Skill Swarm Architecture', '178-Skill Swarm Architecture'],
  ['assert.ok(skills.length >= 171);', 'assert.ok(skills.length >= 178);'],
  ['assert.ok(status.totalSkills >= 171);', 'assert.ok(status.totalSkills >= 178);'],
  ['assert.ok(regListData.count >= 171);', 'assert.ok(regListData.count >= 178);'],
  ['assert.ok(driftData.totalSkills >= 171);', 'assert.ok(driftData.totalSkills >= 178);'],
  ['assert.match(showcaseHtml, /171 Skill Ecosystem/);', 'assert.match(showcaseHtml, /178 Skill Ecosystem/);'],
  ['assert.ok(fullData.totalSkills >= 171);', 'assert.ok(fullData.totalSkills >= 178);'],
  ['assert.ok(monitorData.drift.totalSkills >= 171);', 'assert.ok(monitorData.drift.totalSkills >= 178);']
]);

console.log('\n🎉 All references synchronized to 178 Skills (v4.7.0)!');
