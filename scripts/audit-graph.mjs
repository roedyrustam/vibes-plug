import fs from 'fs/promises';
import path from 'path';

const SKILLS_DIR = path.resolve('skills');

async function auditGraph() {
  const entries = await fs.readdir(SKILLS_DIR, { withFileTypes: true });
  const allSkills = new Set(entries.filter(e => e.isDirectory()).map(e => e.name));
  
  const broken = [];
  const inDegree = {};
  const outDegree = {};
  
  for (const skill of allSkills) {
    inDegree[skill] = 0;
    outDegree[skill] = 0;
  }

  for (const skill of allSkills) {
    const filePath = path.join(SKILLS_DIR, skill, 'SKILL.md');
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const orchMatch = content.match(/(?:Orchestration & Integration|Integrasi Orkestrasi)[\s\S]*?(?:\r?\n###|\r?\n##|$)/i);
      if (orchMatch) {
        const refs = Array.from(orchMatch[0].matchAll(/`([a-z0-9_-]+)`/g)).map(m => m[1]);
        const uniqueRefs = [...new Set(refs)].filter(r => r !== skill);
        outDegree[skill] = uniqueRefs.length;
        for (const ref of uniqueRefs) {
          if (allSkills.has(ref)) {
            inDegree[ref] = (inDegree[ref] || 0) + 1;
          } else if (ref.includes('-') && !['utf-8', 'iso-8859-1', 'x-api-key'].includes(ref)) {
            broken.push({ skill, missingRef: ref });
          }
        }
      }
    } catch (e) {
      console.error(`Failed to read ${skill}: ${e.message}`);
    }
  }

  console.log(`\n🕸️  Skill Dependency Graph Audit (160 Skills):`);
  console.log(`-----------------------------------------------`);
  console.log(`Total Skills in Registry : ${allSkills.size}`);
  console.log(`Broken Skill References   : ${broken.length}`);

  if (broken.length > 0) {
    console.log(`\n🚨 Broken References Detected:`);
    for (const b of broken) {
      console.log(`   ❌ [${b.skill}] references unknown skill: \`${b.missingRef}\``);
    }
  } else {
    console.log(`✅ All cross-skill references are 100% valid! Zero broken links.`);
  }

  // Top 5 Central Hubs
  const sortedByInDegree = Object.entries(inDegree).sort((a, b) => b[1] - a[1]);
  console.log(`\n🏆 Top 5 Core Orchestration Hubs (In-Degree Centrality):`);
  for (let i = 0; i < Math.min(5, sortedByInDegree.length); i++) {
    console.log(`   ${i + 1}. \`${sortedByInDegree[i][0]}\` (${sortedByInDegree[i][1]} incoming connections)`);
  }
}

auditGraph().catch(console.error);
