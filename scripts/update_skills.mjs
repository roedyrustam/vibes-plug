#!/usr/bin/env node
/**
 * scripts/update_skills.mjs
 * Batch update skill files: fix encoding, standardize headers, bump tech versions.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const skillsDir = path.join(__dirname, '../skills');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      results.push(fullPath);
    }
  });
  return results;
}

function updateSkills() {
  const files = walk(skillsDir);

  files.forEach(filePath => {
    const ext = path.extname(filePath);
    if (ext === '.md' || ext === '.csv' || ext === '.py') {
      let content = fs.readFileSync(filePath, 'utf-8');
      const originalContent = content;

      if (ext === '.md') {
        // Only clean frontmatter if it exists at the top of the file
        if (content.startsWith('---')) {
          const parts = content.split('---');
          if (parts.length >= 3) {
            let frontmatter = parts[1];
            frontmatter = frontmatter.replace(/github:.*?\n/g, '');
            frontmatter = frontmatter.replace(/risk:.*?\n/g, '');
            frontmatter = frontmatter.replace(/source:.*?\n/g, '');
            frontmatter = frontmatter.replace(/date_added:.*?\n/g, '');
            parts[1] = frontmatter;
            content = parts.join('---');
          }
        }

        // Standardize headers
        content = content.replace(/^## When to Use$/gm, '## Kondisi Pemicu / Trigger Conditions');

        // Fix encoding issues from ui_ux_expert
        content = content.replace(/ðŸŽ¯/g, '🎯');
        content = content.replace(/ðŸ§ /g, '🧠');
        content = content.replace(/ðŸŽ¨/g, '🎨');
        content = content.replace(/ðŸ"±/g, '📱');
        content = content.replace(/ðŸ§©/g, '🧩');
        content = content.replace(/âš™ï¸ /g, '⚙️');
        content = content.replace(/ðŸš€/g, '🚀');
        content = content.replace(/â Œ/g, '❌');
      }

      // Update technologies to keep them current
      content = content.replace(/React(?:&nbsp;|\\u0026nbsp;| )18/g, m => m.replace('18', '19'));
      content = content.replace(/Next\.js(?:&nbsp;|\\u0026nbsp;| )14/g, m => m.replace('14', '15'));
      content = content.replace(/Tailwind CSS(?:&nbsp;|\\u0026nbsp;| )v3/g, m => m.replace('v3', 'v4'));
      content = content.replace(/Tailwind(?:&nbsp;|\\u0026nbsp;| )v3/g, m => m.replace('v3', 'v4'));
      content = content.replace(/TanStack Query(?:&nbsp;|\\u0026nbsp;| )v4/g, m => m.replace('v4', 'v5'));
      content = content.replace(/Bun(?:&nbsp;|\\u0026nbsp;| )v1\.0/g, m => m.replace('v1.0', 'v1.2+'));

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✅ Updated: ${path.relative(skillsDir, filePath)}`);
      }
    }
  });

  console.log('\n🎉 Skills update complete.');
}

updateSkills();
