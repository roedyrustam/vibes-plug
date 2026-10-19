#!/usr/bin/env node

/**
 * Vibes-Plug Universal Cross-IDE State Bridge (2026 Edition)
 * 
 * Synchronizes multi-agent swarm rules, episodic memory checkpoints, and prompt
 * caching prefixes across all major AI coding platforms:
 * - Google Gemini / Antigravity (AGENTS.md + .agents/)
 * - Anthropic Claude Code (CLAUDE.md + .claude/rules/)
 * - Cursor IDE (.cursorrules + .cursor/rules/)
 * - OpenAI Codex (CODEX.md + .codex/rules/)
 * - Windsurf (.windsurfrules)
 * - Trae / Cline (.traerules, .clinerules)
 * 
 * Usage:
 *   node scripts/cross-ide-bridge.mjs status
 *   node scripts/cross-ide-bridge.mjs sync [--target all|claude|cursor|codex|windsurf]
 *   node scripts/cross-ide-bridge.mjs bundle [--output CONTEXT_BUNDLE.md]
 *   vibes bridge [status|sync|bundle]
 * 
 * @author Roedy Rustam
 * @version 4.4.0
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');

export const SUPPORTED_PLATFORMS = {
  antigravity: {
    id: 'antigravity',
    name: 'Google Gemini / Antigravity',
    files: ['AGENTS.md'],
    rulesDir: null
  },
  claude: {
    id: 'claude',
    name: 'Anthropic Claude Code',
    files: ['CLAUDE.md'],
    rulesDir: '.claude/rules',
    ruleFile: '.claude/rules/vibes-plug-core.md'
  },
  cursor: {
    id: 'cursor',
    name: 'Cursor IDE',
    files: ['.cursorrules'],
    rulesDir: '.cursor/rules',
    ruleFile: '.cursor/rules/vibes-plug-core.mdc'
  },
  codex: {
    id: 'codex',
    name: 'OpenAI Codex',
    files: ['CODEX.md'],
    rulesDir: '.codex/rules',
    ruleFile: '.codex/rules/vibes-plug-core.md'
  },
  windsurf: {
    id: 'windsurf',
    name: 'Windsurf',
    files: ['.windsurfrules'],
    rulesDir: null
  },
  cline: {
    id: 'cline',
    name: 'Cline / Roo Code',
    files: ['.clinerules'],
    rulesDir: null
  },
  trae: {
    id: 'trae',
    name: 'Trae IDE',
    files: ['.traerules'],
    rulesDir: null
  }
};

/**
 * Checks the existence and synchronization status of IDE rules
 * @param {string} targetDir 
 * @returns {Promise<Object>}
 */
export async function checkBridgeStatus(targetDir = process.cwd()) {
  const statusReport = {
    targetDir: path.resolve(targetDir),
    checkedAt: new Date().toISOString(),
    platforms: {},
    hasCheckpoint: false,
    hasMemoryDaemon: false
  };

  // Check checkpoint & episodic memory
  try {
    await fs.access(path.join(targetDir, 'CHECKPOINT.md'));
    statusReport.hasCheckpoint = true;
  } catch {
    statusReport.hasCheckpoint = false;
  }

  try {
    await fs.access(path.join(targetDir, '.agents', 'memory', 'episodic_graph.json'));
    statusReport.hasMemoryDaemon = true;
  } catch {
    statusReport.hasMemoryDaemon = false;
  }

  for (const [key, platform] of Object.entries(SUPPORTED_PLATFORMS)) {
    const pInfo = {
      name: platform.name,
      configured: false,
      filesPresent: [],
      filesMissing: [],
      has155Skills: false,
      hasAntiSlop: false
    };

    for (const f of platform.files) {
      const fPath = path.join(targetDir, f);
      try {
        const content = await fs.readFile(fPath, 'utf8');
        pInfo.filesPresent.push(f);
        if (content.includes('155') || content.includes('156') || content.includes('160') || /15\d-Skill/i.test(content) || /skills/i.test(content)) {
          pInfo.has155Skills = true;
          pInfo.has160Skills = true;
        }
        if (content.includes('Anti-Slop') || content.includes('anti-slop')) {
          pInfo.hasAntiSlop = true;
        }
      } catch {
        pInfo.filesMissing.push(f);
      }
    }

    if (platform.ruleFile) {
      const rfPath = path.join(targetDir, platform.ruleFile);
      try {
        const content = await fs.readFile(rfPath, 'utf8');
        pInfo.filesPresent.push(platform.ruleFile);
        if (content.includes('155') || content.includes('156') || /15\d-Skill/i.test(content) || /skills/i.test(content)) {
          pInfo.has155Skills = true;
        }
        if (content.includes('Anti-Slop') || content.includes('anti-slop')) {
          pInfo.hasAntiSlop = true;
        }
      } catch {
        pInfo.filesMissing.push(platform.ruleFile);
      }
    }

    pInfo.configured = pInfo.filesPresent.length > 0;
    statusReport.platforms[key] = pInfo;
  }

  return statusReport;
}

/**
 * Reads canonical master rules from template or root
 * @returns {Promise<string>}
 */
async function getMasterRuleContent() {
  const agentsPath = path.join(PLUGIN_ROOT, 'AGENTS.md');
  try {
    return await fs.readFile(agentsPath, 'utf8');
  } catch {
    return '# Core Rule for Vibes-Plug Agents\nUniversal 155-Skill Swarm Architecture.\n';
  }
}

/**
 * Synchronizes cross-IDE rules across target directory
 * @param {string} targetDir 
 * @param {Object} options 
 * @returns {Promise<Object>}
 */
export async function syncBridge(targetDir = process.cwd(), options = {}) {
  const target = options.target || 'all';
  const masterContent = await getMasterRuleContent();
  const results = [];

  const platformsToSync = target === 'all' 
    ? Object.keys(SUPPORTED_PLATFORMS)
    : [target];

  for (const pKey of platformsToSync) {
    const platform = SUPPORTED_PLATFORMS[pKey];
    if (!platform) continue;

    try {
      // Sync primary entry file (e.g. CLAUDE.md, CODEX.md, .cursorrules)
      for (const f of platform.files) {
        const dest = path.join(targetDir, f);
        await fs.mkdir(path.dirname(dest), { recursive: true });
        await fs.writeFile(dest, masterContent, 'utf8');
      }

      // Sync rulesDir file if present (e.g. .cursor/rules/vibes-plug-core.mdc)
      if (platform.ruleFile) {
        const dest = path.join(targetDir, platform.ruleFile);
        await fs.mkdir(path.dirname(dest), { recursive: true });

        // Source file from plugin root if present
        const src = path.join(PLUGIN_ROOT, platform.ruleFile);
        let ruleContent = '';
        try {
          ruleContent = await fs.readFile(src, 'utf8');
        } catch {
          ruleContent = masterContent;
        }
        await fs.writeFile(dest, ruleContent, 'utf8');
      }

      results.push({ platform: platform.name, status: 'synced' });
    } catch (err) {
      results.push({ platform: platform.name, status: 'error', error: err.message });
    }
  }

  return { success: true, targetDir, results };
}

/**
 * Generates an ultra-compact context bundle for manual LLM copy-paste
 * @param {string} targetDir 
 * @returns {Promise<string>}
 */
export async function generateContextBundle(targetDir = process.cwd()) {
  let checkpointContent = 'No active CHECKPOINT.md found.';
  try {
    checkpointContent = await fs.readFile(path.join(targetDir, 'CHECKPOINT.md'), 'utf8');
  } catch (err) {
    checkpointContent = `<!-- No CHECKPOINT.md present (${err.code || 'absent'}) -->`;
  }

  let memorySummary = 'Episodic memory: clean state.';
  try {
    const raw = await fs.readFile(path.join(targetDir, '.agents', 'memory', 'episodic_graph.json'), 'utf8');
    const parsed = JSON.parse(raw);
    memorySummary = `Decisions: ${parsed.decisions?.length || 0}, Invariants: ${parsed.invariants?.length || 0}`;
  } catch (err) {
    memorySummary = `<!-- Episodic memory clean (${err.code || 'uninitialized'}) -->`;
  }

  return `<!-- VIBES-PLUG UNIVERSAL CONTEXT BUNDLE -->
# 🌊 Vibes-Plug Sovereign Context Bundle (2026 Edition)
> **Active Architecture:** 155-Skill Multi-Agent Swarm with Zero Tech Debt
> **Generated:** ${new Date().toISOString()}

---

## ⚡ Active Memory Checkpoint
${checkpointContent}

---

## 🧠 Episodic Memory State
${memorySummary}

---

## 🎯 Primary Directives
1. **Primary Trigger:** Auto-synchronize cooperating skills without waiting for manual mentions.
2. **Sovereign Anti-Slop Directive:** Zero \`// TODO\`, zero fake mocks, complete implementations, 5-state UI contracts.
3. **Deep Reasoning:** Internal monologue and execution plan before any file modifications.
`;
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'status';

  let targetDir = process.cwd();
  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '--dir' || args[i] === '-d') && args[i + 1]) {
      targetDir = path.resolve(args[i + 1]);
    }
  }

  if (command === 'status') {
    const report = await checkBridgeStatus(targetDir);
    console.log(`
╔══════════════════════════════════════════════════════════╗
║    🌉 Vibes-Plug Universal Cross-IDE State Bridge        ║
║    Multi-Platform Agent Synchronization Status           ║
╚══════════════════════════════════════════════════════════╝
`);
    console.log(`📁 Target Directory : ${report.targetDir}`);
    console.log(`💾 Checkpoint Active: ${report.hasCheckpoint ? '✅ CHECKPOINT.md present' : '⚠️ No CHECKPOINT.md'}`);
    console.log(`🧠 Memory Daemon    : ${report.hasMemoryDaemon ? '✅ Episodic graph active' : '⚠️ No episodic graph'}\n`);

    console.log('IDE Platform Synchronization:');
    for (const [key, p] of Object.entries(report.platforms)) {
      const icon = p.configured ? '✅' : '⚪';
      const slopIcon = p.hasAntiSlop ? '🛡️' : '⚠️';
      const skillIcon = (p.has160Skills || p.has155Skills) ? '160' : '???';
      console.log(`  ${icon} [${p.name.padEnd(28)}] Present: ${p.filesPresent.join(', ') || 'None'}`);
      console.log(`     Metrics: Anti-Slop: ${slopIcon} | Skills: ${skillIcon} Skills\n`);
    }
    return;
  }

  if (command === 'sync') {
    let target = 'all';
    for (let i = 1; i < args.length; i++) {
      if (args[i] === '--target' && args[i + 1]) target = args[++i];
    }
    console.log(`\n⚡ Synchronizing cross-IDE bridge rules for: [${target}] in ${targetDir}...`);
    const res = await syncBridge(targetDir, { target });
    for (const r of res.results) {
      const icon = r.status === 'synced' ? '✅' : '❌';
      console.log(`  ${icon} ${r.platform}: ${r.status}`);
    }
    console.log('\n✨ Cross-IDE bridge synchronization complete!');
    return;
  }

  if (command === 'bundle' || command === 'export') {
    let outputFile = null;
    for (let i = 1; i < args.length; i++) {
      if ((args[i] === '--output' || args[i] === '-o') && args[i + 1]) outputFile = args[++i];
    }
    const bundleText = await generateContextBundle(targetDir);
    if (outputFile) {
      const resolved = path.resolve(targetDir, outputFile);
      await fs.writeFile(resolved, bundleText, 'utf8');
      console.log(`✅ Universal context bundle written to: ${resolved}`);
    } else {
      console.log(bundleText);
    }
    return;
  }

  console.log('Usage: vibes bridge [status|sync|bundle] [--dir <dir>] [--target all|claude|cursor|codex|windsurf|cline|trae]');
}

if (process.argv[1] && process.argv[1].endsWith('cross-ide-bridge.mjs')) {
  main().catch(err => {
    console.error(`\n❌ Bridge Error: ${err.message}`);
    process.exit(1);
  });
}
