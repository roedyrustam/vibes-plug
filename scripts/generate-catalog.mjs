import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');
const skillsDir = path.join(PLUGIN_ROOT, 'skills');
const dirs = fs.readdirSync(skillsDir).filter(f => fs.statSync(path.join(skillsDir, f)).isDirectory());

const skills = [];

for (const dir of dirs.sort()) {
  const skillFile = path.join(skillsDir, dir, 'SKILL.md');
  if (!fs.existsSync(skillFile)) continue;
  const content = fs.readFileSync(skillFile, 'utf8');
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) continue;
  const fm = fmMatch[1];
  const nameMatch = fm.match(/^name:\s*(.+)$/m);
  const descMatch = fm.match(/^description:\s*(.+)$/m);
  const versionMatch = fm.match(/^version:\s*["']?([^"'\r\n]+)["']?$/m);
  const authorMatch = fm.match(/^author:\s*["']?([^"'\r\n]+)["']?$/m);

  const name = nameMatch ? nameMatch[1].trim() : dir;
  let description = descMatch ? descMatch[1].trim() : '';
  if (description.startsWith('"') && description.endsWith('"')) {
    description = description.slice(1, -1);
  } else if (description.startsWith("'") && description.endsWith("'")) {
    description = description.slice(1, -1);
  }

  const version = versionMatch ? versionMatch[1].trim() : '4.8.0';
  const author = authorMatch ? authorMatch[1].trim() : 'Roedy Rustam';

  skills.push({ name, description, version, author });
}

console.log(`Parsed ${skills.length} skills.`);

const catalogJson = {
  total: skills.length,
  skills
};
fs.writeFileSync(path.join(PLUGIN_ROOT, 'CATALOG.json'), JSON.stringify(catalogJson, null, 2) + '\n', 'utf8');
console.log('✅ Updated CATALOG.json');

let catalogMd = `# Vibes-Plug Skills Catalog (${skills.length} Skills)\n\n*Universal AI Agent Swarm Architecture (v4.8.0)*\n\n| Skill Name | Version | Description |\n| :--- | :---: | :--- |\n`;

for (const s of skills) {
  const safeDesc = s.description.replace(/\\/g, '\\\\').replace(/\|/g, '\\|');
  catalogMd += `| \`${s.name}\` | \`${s.version}\` | ${safeDesc} |\n`;
}

fs.writeFileSync(path.join(PLUGIN_ROOT, 'CATALOG.md'), catalogMd, 'utf8');
console.log('✅ Updated CATALOG.md');
