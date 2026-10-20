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

console.log('⚡ Starting 161-Skill Universal Ecosystem Synchronization...\n');

// 1. Core Configs & Manifests
replaceInFile('package.json', [
  ['160 specialized skills', '161 specialized skills']
]);

replaceInFile('plugin.json', [
  ['159 specialized skills', '161 specialized skills']
]);

replaceInFile('gemini-extension.json', [
  ['160 specialized skills', '161 specialized skills']
]);

replaceInFile('.codex-plugin/plugin.json', [
  ['160 specialized skills', '161 specialized skills']
]);

replaceInFile('index.js', [
  ['160 Specialized Skills', '161 Specialized Skills']
]);

replaceInFile('extensions/vscode/package.json', [
  ['160 Skills', '161 Skills'],
  ['160-Skill', '161-Skill']
]);

replaceInFile('extensions/vscode/extension.js', [
  ['160 Skills', '161 Skills']
]);

replaceInFile('extensions/vscode/README.md', [
  ['160 Skills', '161 Skills']
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
    ['core rules and 160 skills are shared.', 'core rules and 161 skills are shared.'],
    ['from the 160 skill registry:', 'from the 161 skill registry:'],
    ['based on the 158 specialized skills in `vibes-plug`.', 'based on the 161 specialized skills in `vibes-plug`.']
  ]);
}

replaceInFile('rules/AGENTS.md', [
  ['core rules and 155 skills are shared.', 'core rules and 161 skills are shared.'],
  ['from the 155 skill registry:', 'from the 161 skill registry:'],
  ['based on the 155 specialized skills in `vibes-plug`.', 'based on the 161 specialized skills in `vibes-plug`.']
]);

replaceInFile('.claude/rules/vibes-plug-core.md', [
  ['core rules and 155 skills are shared.', 'core rules and 161 skills are shared.']
]);

replaceInFile('.codex/rules/vibes-plug-core.md', [
  ['core rules and 155 skills are shared.', 'core rules and 161 skills are shared.']
]);

replaceInFile('.cursor/rules/vibes-plug-core.mdc', [
  ['159-Skill', '161-Skill'],
  ['159 specialized skills', '161 specialized skills']
]);

replaceInFile('.cursor/rules/vibes-plug-skills.mdc', [
  ['159-Skill', '161-Skill']
]);

replaceInFile('rules/vibes-plug-core.mdc', [
  ['160-Skill', '161-Skill'],
  ['160 specialized skills', '161 specialized skills']
]);

replaceInFile('.kimirules', [
  ['155 specialized skills', '161 specialized skills']
]);

replaceInFile('.kirorules', [
  ['155 specialized skills', '161 specialized skills']
]);

replaceInFile('.github/workflows/anti-slop-gate.yml', [
  ['158 Skills', '161 Skills']
]);

// 3. Binaries & MCP Server
replaceInFile('bin/vibes.mjs', [
  ['browse all 160 skills', 'browse all 161 skills'],
  ['All 160 skills automatically synchronize', 'All 161 skills automatically synchronize'],
  ['Search all 160 skills by keyword', 'Search all 161 skills by keyword'],
  ['Export or preview the complete 160-skill ecosystem catalog', 'Export or preview the complete 161-skill ecosystem catalog'],
  ['Launch local web Studio Cockpit dashboard (visual 160-skill explorer)', 'Launch local web Studio Cockpit dashboard (visual 161-skill explorer)'],
  ['v4.3.0', 'v4.4.1']
]);

replaceInFile('bin/mcp-server.mjs', [
  ['any of the 160 skills', 'any of the 161 skills'],
  ['Discover all 160 skills', 'Discover all 161 skills'],
  ['any of the 160 specialized skills', 'any of the 161 specialized skills'],
  ['List all 160 AI domain skills', 'List all 161 AI domain skills'],
  ['Synchronize 160-skill', 'Synchronize 161-skill'],
  ['audits all 160 skills', 'audits all 161 skills'],
  ['Compiled 160-skill canonical prefix', 'Compiled 161-skill canonical prefix']
]);

// 4. Scripts
replaceInFile('scripts/audit-graph.mjs', [
  ['Graph Audit (160 Skills):', 'Graph Audit (161 Skills):']
]);

replaceInFile('scripts/create-agent.mjs', [
  ['155 skills', '161 skills']
]);

replaceInFile('scripts/cross-ide-bridge.mjs', [
  ['155-Skill', '161-Skill'],
  ['155 skills', '161 skills']
]);

replaceInFile('scripts/install.js', [
  ['159 skills', '161 skills']
]);

replaceInFile('scripts/package-extension.mjs', [
  ['155-skill', '161-skill'],
  ['155 skills', '161 skills']
]);

replaceInFile('scripts/registry-manager.mjs', [
  ['155 Skill Gold Standard', '161 Skill Gold Standard']
]);

replaceInFile('scripts/skill-drift-monitor.mjs', [
  ['155 skills', '161 skills']
]);

replaceInFile('scripts/swarm-bus.mjs', [
  ['155-skill', '161-skill']
]);

replaceInFile('scripts/swarm-dispatcher.mjs', [
  ['155-skill', '161-skill']
]);

replaceInFile('scripts/terminal-monitor.mjs', [
  ['155 skills', '161 skills']
]);

replaceInFile('scripts/token-budget-optimizer.mjs', [
  ['155-Skill', '161-Skill']
]);

replaceInFile('scripts/studio-server.mjs', [
  ['Visualizes the 155 AI domain skills', 'Visualizes the 161 AI domain skills'],
  ['let totalSkills = 155;', 'let totalSkills = 161;'],
  ['totalSkills = 155;', 'totalSkills = 161;'],
  ['155-Skill Swarm Architecture', '161-Skill Swarm Architecture'],
  ['Autonomous 160-Agent Swarm', 'Autonomous 161-Agent Swarm'],
  ['<span class="num" id="stat-total-skills">160</span>', '<span class="num" id="stat-total-skills">161</span>'],
  ['160-Skill Arsenal', '161-Skill Arsenal'],
  ['160-Skill Arsenal', '161-Skill Arsenal'],
  ['Search 160 skills', 'Search 161 skills'],
  ['All Domains (160)', 'All Domains (161)'],
  ['access the 155 skills', 'access the 161 skills'],
  ['Discover 155 skills', 'Discover 161 skills'],
  ['Synchronize 155 skills', 'Synchronize 161 skills'],
  ['Roedy Rustam &bull; 160 Skills', 'Roedy Rustam &bull; 161 Skills']
]);

// 5. Showcase Web App
replaceInFile('showcase/index.html', [
  ['160 Skill Ecosystem', '161 Skill Ecosystem'],
  ['160 Skills Verified', '161 Skills Verified'],
  ['160-skill', '161-skill'],
  ['160 skills', '161 skills'],
  ['160 Skills', '161 Skills'],
  ['160 specialized domain skills', '161 specialized domain skills'],
  ['Explore 160 Specialized Domain Skills', 'Explore 161 Specialized Domain Skills'],
  ['Explore 160 Skills', 'Explore 161 Skills'],
  ['<div class="stat-value tabular-nums" id="statSkillsCount">160</div>', '<div class="stat-value tabular-nums" id="statSkillsCount">161</div>'],
  ['<span class="category-badge-count tabular-nums">160</span>', '<span class="category-badge-count tabular-nums">161</span>'],
  ['Showing <strong id="skillCountBadge" class="tabular-nums">160 of 160</strong> verified skills', 'Showing <strong id="skillCountBadge" class="tabular-nums">161 of 161</strong> verified skills'],
  ['160 Verified Skills', '161 Verified Skills'],
  ['160 Skills Registry', '161 Skills Registry']
]);

replaceInFile('showcase/app.js', [
  ['Verified Skills     : 160 loaded from registry', 'Verified Skills     : 161 loaded from registry'],
  ['160/160 skills valid with frontmatter & matrix', '161/161 skills valid with frontmatter & matrix'],
  ['Total 160 Verified Skills in Vibes-Plug:', 'Total 161 Verified Skills in Vibes-Plug:'],
  ['across 160 registry...', 'across 161 registry...'],
  ['skills_total: 160', 'skills_total: 161']
]);

// 6. Documentation Files
replaceInFile('README.md', [
  ['160-Skill AI Agent Swarm Architecture', '161-Skill AI Agent Swarm Architecture'],
  ['160-agent software development studio', '161-agent software development studio'],
  ['Swarm Director & 160 Specialists', 'Swarm Director & 161 Specialists'],
  ['The 160-Skill Arsenal', 'The 161-Skill Arsenal'],
  ['160 specialized AI domain skills', '161 specialized AI domain skills'],
  ['160-Skill Interactive Catalog', '161-Skill Interactive Catalog'],
  ['any of the 160 specialized skills', 'any of the 161 specialized skills'],
  ['Discover all 160 skills', 'Discover all 161 skills'],
  ['synchronize rules & 160 skills', 'synchronize rules & 161 skills'],
  ['VibesPlug: 160 Skills Active', 'VibesPlug: 161 Skills Active'],
  ['orchestrating 160 specialized AI subagents', 'orchestrating 161 specialized AI subagents'],
  ['visual 160-skill explorer', 'visual 161-skill explorer'],
  ['Lists all 160 skills', 'Lists all 161 skills'],
  ['Searches 160 skills', 'Searches 161 skills'],
  ['Exports full 160-skill catalog', 'Exports full 161-skill catalog'],
  ['mengorkestrasi 160 sub-agen AI spesialis', 'mengorkestrasi 161 sub-agen AI spesialis'],
  ['update 160 skill dan engine terbaru', 'update 161 skill dan engine terbaru'],
  ['eksplorasi visual 160 skill', 'eksplorasi visual 161 skill'],
  ['daftar 160 skill', 'daftar 161 skill'],
  ['Mencari 160 skill', 'Mencari 161 skill'],
  ['katalog 160 skill', 'katalog 161 skill'],
  ['编排 160 个专业的 AI 子代理', '编排 161 个专业的 AI 子代理'],
  ['160 个技能可视化探索', '161 个技能可视化探索'],
  ['导出 160 个技能的完整目录', '导出 161 个技能的完整目录'],
  ['orchestrierte 160 spezialisierte KI-Subagenten', 'orchestrierte 161 spezialisierte KI-Subagenten'],
  ['orchestrierst 160 spezialisierte KI-Subagenten', 'orchestrierst 161 spezialisierte KI-Subagenten'],
  ['visueller 160-Skill-Explorer', 'visueller 161-Skill-Explorer'],
  ['vollständigen 160-Skill-Katalog', 'vollständigen 161-Skill-Katalog'],
  ['160 の専門的な AI サブエージェント', '161 の専門的な AI サブエージェント'],
  ['160スキルの視覚的探索', '161スキルの視覚的探索'],
  ['160のスキル全カタログ', '161のスキル全カタログ']
]);

replaceInFile('BENCHMARK_REPORT.md', [
  ['160 Specialized Skills', '161 Specialized Skills'],
  ['160-skill', '161-skill'],
  ['160 skills', '161 skills']
]);

replaceInFile('COMPARISON.md', [
  ['160 Skills', '161 Skills'],
  ['160 skills', '161 skills']
]);

replaceInFile('PRODUCT_HUNT.md', [
  ['160-Skill', '161-Skill'],
  ['160 skills', '161 skills']
]);

replaceInFile('REDDIT_LAUNCH.md', [
  ['160-skill', '161-skill'],
  ['160 specialized skills', '161 specialized skills'],
  ['160 skills', '161 skills']
]);

replaceInFile('SHOW_HN.md', [
  ['160-Skill', '161-Skill'],
  ['160 specialized skills', '161 specialized skills'],
  ['160 skills', '161 skills']
]);

replaceInFile('TRENDING_PLAYBOOK.md', [
  ['155-Skill', '161-Skill'],
  ['155-skill', '161-skill'],
  ['155 Specialized Skills', '161 Specialized Skills'],
  ['155 skills', '161 skills']
]);

// 7. Test CLI Assertions
replaceInFile('scripts/test-cli.mjs', [
  ['vibes doctor should verify 160+ skills', 'vibes doctor should verify 161 skills'],
  ['vibes docs should generate 160+ skill ecosystem preview', 'vibes docs should generate 161 skill ecosystem preview'],
  ['against 155 gold standards', 'against 161 gold standards'],
  ['studio server should serve 155 skills, cockpit HTML, and Remote MCP SSE', 'studio server should serve 161 skills, cockpit HTML, and Remote MCP SSE'],
  ['155-Skill Swarm Architecture', '161-Skill Swarm Architecture'],
  ['assert.ok(skills.length >= 160);', 'assert.ok(skills.length >= 161);'],
  ['assert.ok(status.totalSkills >= 160);', 'assert.ok(status.totalSkills >= 161);'],
  ['assert.ok(regListData.count >= 155);', 'assert.ok(regListData.count >= 161);'],
  ['assert.ok(driftData.totalSkills >= 160);', 'assert.ok(driftData.totalSkills >= 161);'],
  ['assert.match(showcaseHtml, /160 Skill Ecosystem/);', 'assert.match(showcaseHtml, /161 Skill Ecosystem/);'],
  ['assert.ok(fullData.totalSkills >= 160);', 'assert.ok(fullData.totalSkills >= 161);'],
  ['assert.ok(monitorData.drift.totalSkills >= 160);', 'assert.ok(monitorData.drift.totalSkills >= 161);']
]);

console.log('\n🎉 All references synchronized to 161 Skills!');
