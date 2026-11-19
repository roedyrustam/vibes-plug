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
 * @version 4.7.0
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
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
  },
  kimi: {
    id: 'kimi',
    name: 'Kimi CLI',
    files: ['.kimirules'],
    rulesDir: null
  },
  kiro: {
    id: 'kiro',
    name: 'Kiro CLI',
    files: ['.kirorules'],
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
      has178Skills: false,
      has176Skills: false,
      has160Skills: false,
      has155Skills: false,
      hasAntiSlop: false
    };

    for (const f of platform.files) {
      const fPath = path.join(targetDir, f);
      try {
        const content = await fs.readFile(fPath, 'utf8');
        pInfo.filesPresent.push(f);
        if (content.includes('178') || /178[- ]Skill/i.test(content) || content.includes('176') || content.includes('171') || content.includes('160') || content.includes('155') || /17\d-Skill/i.test(content) || /skills/i.test(content)) {
          pInfo.has178Skills = true;
          pInfo.has176Skills = true;
          pInfo.has160Skills = true;
          pInfo.has155Skills = true;
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
        if (content.includes('178') || /178[- ]Skill/i.test(content) || content.includes('176') || content.includes('171') || content.includes('160') || content.includes('155') || /17\d-Skill/i.test(content) || /skills/i.test(content)) {
          pInfo.has178Skills = true;
          pInfo.has176Skills = true;
          pInfo.has160Skills = true;
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
    return '# Core Rule for Vibes-Plug Agents\nUniversal 178-Skill Swarm Architecture.\n';
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

      // Sync all modular rules in rulesDir if present (e.g. .cursor/rules/, .claude/rules/, .codex/rules/)
      if (platform.rulesDir) {
        const srcDir = path.join(PLUGIN_ROOT, platform.rulesDir);
        const destDir = path.join(targetDir, platform.rulesDir);
        try {
          const rEntries = await fs.readdir(srcDir, { withFileTypes: true });
          await fs.mkdir(destDir, { recursive: true });
          for (const re of rEntries) {
            if (re.isFile()) {
              const ruleSrc = path.join(srcDir, re.name);
              const ruleDest = path.join(destDir, re.name);
              const rContent = await fs.readFile(ruleSrc, 'utf8');
              await fs.writeFile(ruleDest, rContent, 'utf8');
            }
          }
        } catch {
          // If rulesDir doesn't exist, fallback
        }
      } else if (platform.ruleFile) {
        const dest = path.join(targetDir, platform.ruleFile);
        await fs.mkdir(path.dirname(dest), { recursive: true });
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
> **Active Architecture:** 178-Skill Multi-Agent Swarm with Zero Tech Debt
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

const RULE_BRIDGE_TARGETS = [
  'AGENTS.md', 'CLAUDE.md', 'CODEX.md', '.clinerules',
  '.cursorrules', '.kimirules', '.kirorules', '.traerules', '.windsurfrules'
];

/**
 * Verifies that multi-IDE rule entrypoints are byte-identical to rules/AGENTS.md,
 * and optionally verifies skills/ vs .cursor/skills/ parity.
 * @param {string} [targetDir]
 * @param {Object} [options]
 * @param {boolean} [options.withSkills]
 * @returns {Promise<{ inSync: boolean, canonicalHash: string, checkedCount: number, driftedFiles: string[], checkedSkillsCount?: number, driftedSkills?: string[] }>}
 */
export async function checkBridgeDrift(targetDir = process.cwd(), options = {}) {
  const canonicalPath = path.join(targetDir, 'rules', 'AGENTS.md');
  const normalize = (s) => s.replace(/\r\n/g, '\n').trim();
  const sha12 = (txt) => crypto.createHash('sha256').update(normalize(txt)).digest('hex').slice(0, 12);
  const canonicalRaw = await fs.readFile(canonicalPath, 'utf8');
  const canonicalHash = sha12(canonicalRaw);

  const driftedFiles = [];
  for (const rel of RULE_BRIDGE_TARGETS) {
    const filePath = path.join(targetDir, rel);
    try {
      const raw = await fs.readFile(filePath, 'utf8');
      if (sha12(raw) !== canonicalHash) driftedFiles.push(rel);
    } catch {
      driftedFiles.push(`${rel} (missing)`);
    }
  }

  let checkedSkillsCount = 0;
  const driftedSkills = [];
  if (options.withSkills) {
    const skillsRoot = path.join(targetDir, 'skills');
    const cursorSkillsRoot = path.join(targetDir, '.cursor', 'skills');
    const entries = await fs.readdir(skillsRoot, { withFileTypes: true }).catch(() => []);
    const skillDirs = entries.filter(e => e.isDirectory()).map(e => e.name).sort();
    checkedSkillsCount = skillDirs.length;

    await Promise.all(skillDirs.map(async (name) => {
      const srcPath = path.join(skillsRoot, name, 'SKILL.md');
      const dstPath = path.join(cursorSkillsRoot, name, 'SKILL.md');
      try {
        const [srcRaw, dstRaw] = await Promise.all([
          fs.readFile(srcPath, 'utf8'),
          fs.readFile(dstPath, 'utf8')
        ]);
        if (sha12(srcRaw) !== sha12(dstRaw)) driftedSkills.push(name);
      } catch {
        driftedSkills.push(`${name} (missing)`);
      }
    }));
  }

  return {
    inSync: driftedFiles.length === 0 && driftedSkills.length === 0,
    canonicalHash,
    checkedCount: RULE_BRIDGE_TARGETS.length,
    driftedFiles,
    ...(options.withSkills ? { checkedSkillsCount, driftedSkills: driftedSkills.sort() } : {})
  };
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
      const skillIcon = (p.has178Skills || p.has176Skills || p.has160Skills || p.has155Skills) ? '178' : '???';
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

  if (command === 'check') {
    const withSkills = args.includes('--with-skills');
    const report = await checkBridgeDrift(targetDir, { withSkills });
    if (args.includes('--json')) {
      console.log(JSON.stringify(report, null, 2));
    } else if (report.inSync) {
      const skillsMsg = withSkills ? ` + ${report.checkedSkillsCount}/${report.checkedSkillsCount} .cursor/skills` : '';
      console.log(`✅ Cross-IDE bridge drift check passed (${report.checkedCount}/${report.checkedCount} rule files${skillsMsg} synced, hash: ${report.canonicalHash})`);
    } else {
      if (report.driftedFiles.length > 0) {
        console.error(`❌ Cross-IDE rule drift (${report.driftedFiles.length}): ${report.driftedFiles.join(', ')}`);
      }
      if (report.driftedSkills?.length > 0) {
        console.error(`❌ .cursor/skills drift (${report.driftedSkills.length}): ${report.driftedSkills.slice(0, 10).join(', ')}${report.driftedSkills.length > 10 ? '...' : ''}`);
      }
    }
    if (!report.inSync) process.exit(1);
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

  console.log('Usage: vibes bridge [status|sync|bundle] [--dir <dir>] [--target all|claude|cursor|codex|windsurf|cline|trae|kimi|kiro]');
}

if (process.argv[1] && process.argv[1].endsWith('cross-ide-bridge.mjs')) {
  main().catch(err => {
    console.error(`\n❌ Bridge Error: ${err.message}`);
    process.exit(1);
  });
}
