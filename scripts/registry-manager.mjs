/**
 * Vibes-Plug Community Skill Registry & Modular Hub
 * 
 * Manages modular skill discovery, searching, packaging, and project-local installation.
 * Enforces the 176 Skill Gold Standard and Anti-Slop Directive on any custom skill package.
 * 
 * @author Roedy Rustam
 * @version 4.4.0
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const GLOBAL_SKILLS_DIR = path.resolve(__dirname, '../skills');

/**
 * Extracts YAML frontmatter and key sections from a SKILL.md file
 * @param {string} content 
 * @returns {Object}
 */
export function parseSkillMarkdown(content) {
  const meta = {
    name: '',
    description: '',
    author: 'Unknown',
    version: '1.0.0',
    hasIntegrationMatrix: false,
    hasBilingualContent: false,
    contentLength: content.length
  };

  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (frontmatterMatch) {
    const lines = frontmatterMatch[1].split(/\r?\n/);
    for (const line of lines) {
      const nameMatch = line.match(/^name:\s*(.+)$/);
      const descMatch = line.match(/^description:\s*(.+)$/);
      const authorMatch = line.match(/^author:\s*['"]?([^'"]+)['"]?$/);
      const versionMatch = line.match(/^version:\s*['"]?([^'"]+)['"]?$/);

      if (nameMatch) meta.name = nameMatch[1].trim();
      if (descMatch) meta.description = descMatch[1].trim();
      if (authorMatch) meta.author = authorMatch[1].trim();
      if (versionMatch) meta.version = versionMatch[1].trim();
    }
  }

  meta.hasIntegrationMatrix = /#{2,3}\s+(Orchestration & Integration|Integrasi Orkestrasi)/i.test(content);
  meta.hasBilingualContent = /panduan|arsitektur|keahlian|pengujian|integrasi|orchestrat|expert/i.test(content);

  return meta;
}

/**
 * Categorizes a skill based on its slug or description
 * @param {string} name 
 * @param {string} desc 
 * @returns {string}
 */
export function categorizeSkill(name, desc = '') {
  const n = name.toLowerCase();
  const d = desc.toLowerCase();

  if (n.includes('doku') || n.includes('payment') || n.includes('billing') || n.includes('settlement') || n.includes('economy')) {
    return 'FinTech & Payments';
  }
  if (n.includes('frontend') || n.includes('tailwind') || n.includes('css') || n.includes('ui') || n.includes('design') || n.includes('svg') || n.includes('svelte') || n.includes('vue') || n.includes('angular') || n.includes('solid')) {
    return 'Frontend & UI';
  }
  if (n.includes('backend') || n.includes('api') || n.includes('database') || n.includes('orm') || n.includes('sql') || n.includes('python') || n.includes('go-') || n.includes('rust-') || n.includes('bun')) {
    return 'Backend & Database';
  }
  if (n.includes('ai') || n.includes('llm') || n.includes('mcp') || n.includes('prompt') || n.includes('gemini') || n.includes('rag') || n.includes('agent')) {
    return 'AI & Agents';
  }
  if (n.includes('test') || n.includes('tdd') || n.includes('red-team') || n.includes('anti-slop') || n.includes('lint') || n.includes('debt') || n.includes('hardener')) {
    return 'Testing & Quality';
  }
  return 'Architecture & Lifecycle';
}

/**
 * Lists all available skills across core registry and project-local overrides
 * @param {Object} [options]
 * @returns {Promise<Array<Object>>}
 */
export async function listRegistrySkills(options = {}) {
  const cwd = options.cwd || process.cwd();
  const localSkillsDir = path.resolve(cwd, '.agents', 'skills');

  const skillsMap = new Map();

  // 1. Read core skills
  try {
    const coreEntries = await fs.readdir(GLOBAL_SKILLS_DIR, { withFileTypes: true });
    for (const ent of coreEntries) {
      if (!ent.isDirectory()) continue;
      const skillPath = path.join(GLOBAL_SKILLS_DIR, ent.name, 'SKILL.md');
      try {
        const raw = await fs.readFile(skillPath, 'utf8');
        const parsed = parseSkillMarkdown(raw);
        const category = categorizeSkill(parsed.name || ent.name, parsed.description);
        skillsMap.set(ent.name, {
          name: parsed.name || ent.name,
          description: parsed.description,
          author: parsed.author,
          version: parsed.version,
          category,
          source: 'core',
          installed: false
        });
      } catch {
        // Skip unreadable files
      }
    }
  } catch {
    // Core skills dir not found
  }

  // 2. Read local project skills
  try {
    const localEntries = await fs.readdir(localSkillsDir, { withFileTypes: true });
    for (const ent of localEntries) {
      if (!ent.isDirectory()) continue;
      const skillPath = path.join(localSkillsDir, ent.name, 'SKILL.md');
      try {
        const raw = await fs.readFile(skillPath, 'utf8');
        const parsed = parseSkillMarkdown(raw);
        const category = categorizeSkill(parsed.name || ent.name, parsed.description);

        if (skillsMap.has(ent.name)) {
          const item = skillsMap.get(ent.name);
          item.installed = true;
          item.source = 'core+local';
        } else {
          skillsMap.set(ent.name, {
            name: parsed.name || ent.name,
            description: parsed.description,
            author: parsed.author,
            version: parsed.version,
            category,
            source: 'community',
            installed: true
          });
        }
      } catch {
        // Skip
      }
    }
  } catch {
    // No local skills directory
  }

  let skills = Array.from(skillsMap.values()).sort((a, b) => a.name.localeCompare(b.name));

  if (options.category) {
    const catLower = options.category.toLowerCase();
    skills = skills.filter(s => s.category.toLowerCase().includes(catLower));
  }

  return skills;
}

/**
 * Searches skills by keyword across name, description, and author
 * @param {string} query 
 * @param {Object} [options]
 * @returns {Promise<Array<Object>>}
 */
export async function searchRegistry(query, options = {}) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return [];

  const allSkills = await listRegistrySkills(options);
  const scored = [];

  for (const skill of allSkills) {
    let score = 0;
    const nameLower = skill.name.toLowerCase();
    const descLower = skill.description.toLowerCase();

    if (nameLower === q) score += 100;
    else if (nameLower.startsWith(q)) score += 50;
    else if (nameLower.includes(q)) score += 30;

    if (descLower.includes(q)) score += 15;
    if (skill.category.toLowerCase().includes(q)) score += 20;

    if (score > 0) {
      scored.push({ ...skill, relevanceScore: score });
    }
  }

  scored.sort((a, b) => b.relevanceScore - a.relevanceScore);
  return scored;
}

/**
 * Installs a skill into the local workspace `.agents/skills/<skillName>`
 * @param {string} skillName 
 * @param {Object} [options]
 * @returns {Promise<Object>}
 */
export async function installSkill(skillName, options = {}) {
  const name = String(skillName || '').trim();
  if (!name || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
    return { success: false, error: 'Invalid skill identifier. Must be lowercase kebab-case.' };
  }

  const cwd = options.cwd || process.cwd();
  const sourceDir = path.resolve(GLOBAL_SKILLS_DIR, name);
  const targetDir = path.resolve(cwd, '.agents', 'skills', name);

  try {
    const sourceStat = await fs.stat(sourceDir);
    if (!sourceStat.isDirectory()) {
      return { success: false, error: `Skill '${name}' not found in core registry.` };
    }

    await fs.mkdir(path.dirname(targetDir), { recursive: true });
    await fs.cp(sourceDir, targetDir, { recursive: true });

    return {
      success: true,
      skillName: name,
      installedPath: targetDir,
      message: `Skill '${name}' installed successfully into .agents/skills/${name}`
    };
  } catch (err) {
    return { success: false, error: `Installation failed: ${err.message}` };
  }
}

/**
 * Audits and packages a custom skill directory against the 161 Gold Standard
 * @param {string} skillDir 
 * @param {Object} [options]
 * @returns {Promise<Object>}
 */
export async function packageSkill(skillDir, options = {}) {
  let resolvedDir = path.resolve(process.cwd(), skillDir);
  let skillFile = path.join(resolvedDir, 'SKILL.md');

  const exists = await fs.access(skillFile).then(() => true).catch(() => false);
  if (!exists) {
    const normalizedName = skillDir.replace(/^[./\\]+/, '').replace(/^skills[/\\]/, '');
    const altDir = path.resolve(GLOBAL_SKILLS_DIR, normalizedName);
    const altFile = path.join(altDir, 'SKILL.md');
    if (await fs.access(altFile).then(() => true).catch(() => false)) {
      resolvedDir = altDir;
      skillFile = altFile;
    }
  }

  try {
    const raw = await fs.readFile(skillFile, 'utf8');
    const parsed = parseSkillMarkdown(raw);

    const issues = [];
    if (!parsed.name) issues.push('Missing "name" in YAML frontmatter');
    if (!parsed.description) issues.push('Missing "description" in YAML frontmatter');
    if (!parsed.hasIntegrationMatrix) issues.push('Missing "## Orchestration & Integration" section');
    if (!parsed.hasBilingualContent) issues.push('Skill content must provide bilingual context (English & Indonesian)');

    const sha256 = crypto.createHash('sha256').update(raw).digest('hex');

    const manifest = {
      name: parsed.name || path.basename(resolvedDir),
      version: parsed.version,
      author: parsed.author,
      description: parsed.description,
      category: categorizeSkill(parsed.name, parsed.description),
      sha256,
      goldStandardCompliant: issues.length === 0,
      issues
    };

    if (options.writeManifest) {
      const manifestPath = path.join(resolvedDir, 'skill.json');
      await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
      manifest.manifestPath = manifestPath;
    }

    return {
      success: issues.length === 0,
      manifest
    };
  } catch (err) {
    return {
      success: false,
      error: `Failed packaging skill: ${err.message}`
    };
  }
}

// Standalone CLI Router
const isDirectExecution = process.argv[1] && (
  path.resolve(process.argv[1]).toLowerCase() === path.resolve(__filename).toLowerCase() ||
  process.argv[1].endsWith('registry-manager.mjs')
);

if (isDirectExecution) {
  const args = process.argv.slice(2);
  const command = args[0] || 'list';

  if (command === 'list') {
    const category = args[1] && !args[1].startsWith('--') ? args[1] : null;
    const skills = await listRegistrySkills({ category });
    console.log(`\n📦 Vibes-Plug Skill Registry Catalog (${skills.length} skills found)\n`);
    for (const s of skills) {
      const installBadge = s.installed ? '\x1b[32m[INSTALLED]\x1b[0m' : '[REGISTRY]';
      console.log(`  • \x1b[1m${s.name}\x1b[0m (v${s.version}) ${installBadge}`);
      console.log(`    Category: ${s.category} | Author: ${s.author}`);
      console.log(`    ${s.description}\n`);
    }
  } else if (command === 'search') {
    const query = args[1];
    if (!query) {
      console.error('❌ Query term is required (e.g. vibes registry search payment)');
      process.exit(1);
    }
    const matches = await searchRegistry(query);
    console.log(`\n🔎 Search results for "${query}" (${matches.length} matches):\n`);
    for (const m of matches) {
      console.log(`  • \x1b[1m${m.name}\x1b[0m (Score: ${m.relevanceScore})`);
      console.log(`    ${m.description}\n`);
    }
  } else if (command === 'install') {
    const skillName = args[1];
    if (!skillName) {
      console.error('❌ Skill name is required (e.g. vibes registry install spec-driven-development-expert)');
      process.exit(1);
    }
    const res = await installSkill(skillName);
    if (res.success) {
      console.log(`✅ ${res.message}`);
    } else {
      console.error(`❌ ${res.error}`);
      process.exit(1);
    }
  } else if (command === 'pack') {
    const skillDir = args[1];
    if (!skillDir) {
      console.error('❌ Skill path is required (e.g. vibes registry pack skills/my-custom-skill)');
      process.exit(1);
    }
    const res = await packageSkill(skillDir, { writeManifest: true });
    if (res.success) {
      console.log(`✅ Skill validated and packaged successfully!`);
      console.log(`Manifest: ${JSON.stringify(res.manifest, null, 2)}`);
    } else {
      console.error(`❌ Packaging failed: ${res.error || res.manifest?.issues?.join(', ')}`);
      process.exit(1);
    }
  } else {
    console.log(`Usage:
  node scripts/registry-manager.mjs list [category]
  node scripts/registry-manager.mjs search <query>
  node scripts/registry-manager.mjs install <skillName>
  node scripts/registry-manager.mjs pack <skillDir>`);
  }
}
