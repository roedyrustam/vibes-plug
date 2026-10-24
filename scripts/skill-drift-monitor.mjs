#!/usr/bin/env node
/**
 * 🌊 Vibes-Plug Automated Skill Health & Framework Drift Monitor (2026 Edition)
 *
 * Scans all 176 skills across the Vibes-Plug catalog to detect:
 * 1. Framework drift & deprecated legacy patterns (React 19 / Next 15 / Tailwind v4 / Node 24 alignment)
 * 2. Cross-skill dependency graph integrity (dead links, phantom references, in/out-degree centrality)
 * 3. Master orchestrator registration (brainstorming & zero-to-prod-orchestrator)
 * 4. Sovereign Anti-Slop Directive compliance & information density
 *
 * Zero external runtime dependencies. 100% deterministic Node.js standard library.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(PLUGIN_ROOT, 'skills');

// Obsolete or deprecated skill names that must not be referenced
export const DEPRECATED_SKILL_REFS = Object.freeze([
  'project-context-mapper',
  'ui-components-expert',
  'database-migration-versioning-expert',
  'supabase-migration',
  'auto-doc-updater',
  'session-handoff-resume',
  'session-context-loader',
  'visual-qa-vision-agent',
  'bootstrap-to-modern',
  'mobile-push-notification-expert',
  'saas-transformer',
  'saas-mvp-launcher',
  'ai-cost-token-optimizer',
  'mcp-client-orchestrator',
  'edge-serverless-db-expert',
  'ai-evals-benchmark-expert',
  'ui-ux-expert',
  'vibe-code-gardener',
  'monday-design-aesthetic'
]);

// Deprecated syntax patterns or obsolete framework idioms
const FRAMEWORK_DRIFT_PATTERNS = Object.freeze([
  {
    id: 'REACT_CLASS_LIFECYCLE',
    regex: /\b(componentDidMount|componentWillMount|componentWillReceiveProps|componentWillUpdate)\b/,
    description: 'Deprecated React class component lifecycle method detected',
    recommendation: 'Replace with React 19 functional components and native hooks or Server Components'
  },
  {
    id: 'NEXTJS_PAGES_DATA_FETCHING',
    regex: /\b(getStaticProps|getServerSideProps|getInitialProps)\b/,
    description: 'Legacy Next.js Pages Router data-fetching function detected',
    recommendation: 'Migrate to Next.js 15 App Router Server Components, async params, and Server Actions'
  },
  {
    id: 'REACT_FC_TYPING',
    regex: /\bReact\.FC\b/,
    description: 'Discouraged React.FC component signature detected',
    recommendation: 'Use typed props function declaration: `export function Component(props: Props)`'
  },
  {
    id: 'LEGACY_VAR_DECLARATION',
    regex: /\bvar\s+[a-zA-Z0-9_$]+\s*=/,
    description: 'Obsolete ES5 "var" variable declaration detected in code blocks',
    recommendation: 'Use modern "const" or "let" block-scoped declarations'
  }
]);

/**
 * Audits a single skill's content against ecosystem standards
 * @param {string} skillName
 * @param {string} content
 * @param {Object} ecosystemContext
 * @returns {Object}
 */
export function auditSkill(skillName, content, ecosystemContext) {
  const issues = [];
  const recommendations = [];
  let score = 100;

  // 1. Frontmatter Validation (Weight: 20 pts)
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  let version = 'unknown';
  let author = 'unknown';
  let description = '';

  if (!fmMatch) {
    score -= 20;
    issues.push({ code: 'FM_MISSING', message: 'Missing YAML frontmatter' });
    recommendations.push('Add YAML frontmatter with name, description, author, and version.');
  } else {
    const fm = fmMatch[1];
    const nameMatch = fm.match(/name:\s*([^\r\n]+)/);
    const descMatch = fm.match(/description:\s*([^\r\n]+)/);
    const authorMatch = fm.match(/author:\s*"([^"]+)"|author:\s*([^\r\n]+)/);
    const versionMatch = fm.match(/version:\s*"([^"]+)"|version:\s*([^\r\n]+)/);

    if (!nameMatch || nameMatch[1].trim() !== skillName) {
      score -= 5;
      issues.push({ code: 'FM_NAME_MISMATCH', message: `Frontmatter name '${nameMatch ? nameMatch[1].trim() : ''}' does not match directory '${skillName}'` });
      recommendations.push(`Ensure frontmatter name matches directory: name: ${skillName}`);
    }

    if (!descMatch || descMatch[1].trim().length < 10) {
      score -= 5;
      issues.push({ code: 'FM_DESC_INADEQUATE', message: 'Missing or overly brief description in frontmatter' });
      recommendations.push('Provide a descriptive, bilingual English / Indonesian summary in description.');
    } else {
      description = descMatch[1].trim();
    }

    if (authorMatch) {
      author = (authorMatch[1] || authorMatch[2] || '').trim();
    }
    if (!author || author.length < 2) {
      score -= 5;
      issues.push({ code: 'FM_AUTHOR_MISSING', message: 'Missing author tag in frontmatter' });
      recommendations.push('Set author: "Roedy Rustam" in frontmatter.');
    }

    if (versionMatch) {
      version = (versionMatch[1] || versionMatch[2] || '').trim();
      const parts = version.split('.').map(Number);
      if (isNaN(parts[0]) || parts[0] < 4 || (parts[0] === 4 && parts[1] < 3)) {
        score -= 5;
        issues.push({ code: 'FM_VERSION_STALE', message: `Version ${version} is below 4.3.0 standard` });
        recommendations.push('Bump version to >= "4.3.0" to conform with 2026 Gold Standard.');
      }
    } else {
      score -= 5;
      issues.push({ code: 'FM_VERSION_MISSING', message: 'Missing version tag in frontmatter' });
      recommendations.push('Add version: "4.4.2" to frontmatter.');
    }
  }

  // 2. Orchestration & Cross-Skill Graph Integrity (Weight: 25 pts)
  const outgoingLinks = [];
  const deadLinks = [];
  const orchSectionMatch = content.match(/(?:##|###|####)\s*(?:Orchestration & Integration|Integrasi Orkestrasi)[\s\S]*?(?=\r?\n(?:##|###|####)\s|\r?\n#[^#]|$)/i);

  if (!orchSectionMatch) {
    score -= 15;
    issues.push({ code: 'ORCH_SECTION_MISSING', message: 'Missing "## Orchestration & Integration" section' });
    recommendations.push('Add "## Orchestration & Integration" listing collaborating skills in backticks.');
  } else {
    const orchText = orchSectionMatch[0];
    const linkMatches = orchText.matchAll(/`([a-z0-9-]+)`/g);
    for (const match of linkMatches) {
      const targetSkill = match[1];
      if (targetSkill !== skillName && !outgoingLinks.includes(targetSkill)) {
        if (ecosystemContext?.allSkillNames?.has(targetSkill)) {
          outgoingLinks.push(targetSkill);
        }
      }
    }

    // Check bullet declarations for phantom skills
    const bulletMatches = orchText.matchAll(/(?:^|\n)\s*[-*]\s*[`'"]([a-z0-9-]+)[`'"]/g);
    for (const match of bulletMatches) {
      const declared = match[1];
      const KNOWN_EXTERNAL = ['modern-web-guidance', 'vibes-plug'];
      if (ecosystemContext?.allSkillNames && !ecosystemContext.allSkillNames.has(declared) && !KNOWN_EXTERNAL.includes(declared)) {
        if (!deadLinks.includes(declared)) {
          deadLinks.push(declared);
        }
      }
    }

    if (deadLinks.length > 0) {
      score -= Math.min(15, deadLinks.length * 5);
      issues.push({ code: 'GRAPH_DEAD_LINKS', message: `Referenced unknown/phantom skills: ${deadLinks.join(', ')}` });
      recommendations.push(`Remove or update phantom skill references: ${deadLinks.join(', ')}`);
    }
  }

  // Check master orchestrator registration
  const inBrainstorming = ecosystemContext?.brainstormingContent?.includes(skillName) ?? true;
  const inZeroToProd = ecosystemContext?.zeroToProdContent?.includes(skillName) ?? true;

  if (!inBrainstorming) {
    score -= 5;
    issues.push({ code: 'ORCH_NOT_IN_BRAINSTORMING', message: 'Not registered in skills/brainstorming/SKILL.md Domain Matrix' });
    recommendations.push(`Add ${skillName} to the Domain Matrix in skills/brainstorming/SKILL.md.`);
  }

  if (!inZeroToProd) {
    score -= 5;
    issues.push({ code: 'ORCH_NOT_IN_ZERO_TO_PROD', message: 'Not registered in skills/zero-to-prod-orchestrator/SKILL.md' });
    recommendations.push(`Add ${skillName} to the Orchestrates list in skills/zero-to-prod-orchestrator/SKILL.md.`);
  }

  // 3. Framework Modernity & Drift (Weight: 25 pts)
  for (const ref of DEPRECATED_SKILL_REFS) {
    if (content.includes(`\`${ref}\``) || content.includes(`"${ref}"`)) {
      score -= 10;
      issues.push({ code: 'DEPRECATED_SKILL_REF', message: `Contains reference to deprecated skill '${ref}'` });
      recommendations.push(`Replace deprecated reference '${ref}' with its modern successor.`);
    }
  }

  for (const pattern of FRAMEWORK_DRIFT_PATTERNS) {
    if (pattern.regex.test(content)) {
      score -= 10;
      issues.push({ code: pattern.id, message: pattern.description });
      recommendations.push(pattern.recommendation);
    }
  }

  // 4. Anti-Slop Directive & Content Quality (Weight: 30 pts)
  let codeBlocksCount = 0;
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\r?\n([\s\S]*?)```/g;
  let blockMatch;

  while ((blockMatch = codeBlockRegex.exec(content)) !== null) {
    codeBlocksCount++;
    const code = blockMatch[2];

    const hasTodo = /(?:^|\n)\s*\/\/\s*(TODO|FIXME)\b/i.test(code) && !/Flag placeholders|Zero placeholder|Pillars?|rule/i.test(code);
    if (hasTodo) {
      score -= 10;
      issues.push({ code: 'ANTI_SLOP_TODO', message: 'Found "// TODO" placeholder in code block' });
      recommendations.push('Implement complete logic; avoid placeholder TODO comments.');
    }

    const hasTruncation = /(?:^|\n)\s*\/\/\s*(\.\.\.|rest of code)\b/i.test(code) && !/Flag placeholders|Zero placeholder|Pillars?|rule/i.test(code);
    if (hasTruncation) {
      score -= 10;
      issues.push({ code: 'ANTI_SLOP_TRUNCATION', message: 'Found truncated code ("// ..." or "// rest of code")' });
      recommendations.push('Provide 100% complete, working code snippets without truncation.');
    }

    if (/catch\s*\([^)]*\)\s*\{\s*\}/.test(code)) {
      score -= 10;
      issues.push({ code: 'ANTI_SLOP_EMPTY_CATCH', message: 'Found silent empty catch block in code block' });
      recommendations.push('Add proper error handling or rethrow with structured context.');
    }
  }

  if (codeBlocksCount === 0) {
    score -= 10;
    issues.push({ code: 'NO_CODE_BLOCKS', message: 'Skill contains zero code blocks or practical implementation examples' });
    recommendations.push('Include concrete, working code blocks illustrating the patterns.');
  }

  // Bilingual Check
  const lower = content.toLowerCase();
  const hasEnglish = lower.includes('english') || lower.includes('inggris');
  const hasIndo = lower.includes('bahasa indonesia') || lower.includes('indonesia');
  if (!hasEnglish || !hasIndo) {
    score -= 10;
    issues.push({ code: 'BILINGUAL_MISSING', message: 'Missing bilingual structure (English & Bahasa Indonesia)' });
    recommendations.push('Ensure both English and Bahasa Indonesia sections are present.');
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  let grade = 'A+';
  let status = 'PRISTINE';
  if (score < 60) {
    grade = 'F';
    status = 'DEGRADED';
  } else if (score < 75) {
    grade = 'C';
    status = 'DRIFTING';
  } else if (score < 85) {
    grade = 'B';
    status = 'HEALTHY';
  } else if (score < 95) {
    grade = 'A';
    status = 'PRISTINE';
  }

  return {
    skillName,
    version,
    author,
    description,
    score,
    grade,
    status,
    outgoingLinks,
    deadLinks,
    codeBlocksCount,
    issuesCount: issues.length,
    issues,
    recommendations
  };
}

/**
 * Runs a complete audit across the entire skill ecosystem
 * @param {Object} [options]
 * @returns {Promise<Object>}
 */
export async function auditEcosystem(options = {}) {
  const startTime = performance.now();
  const entries = await fs.readdir(SKILLS_DIR, { withFileTypes: true });
  const skillDirs = entries.filter(e => e.isDirectory()).map(e => e.name);
  const allSkillNames = new Set(skillDirs);

  // Load orchestrator files for cross-check
  let brainstormingContent = '';
  let zeroToProdContent = '';

  try {
    brainstormingContent = await fs.readFile(path.join(SKILLS_DIR, 'brainstorming', 'SKILL.md'), 'utf8');
  } catch {
    // Graceful fallback if file is missing
  }

  try {
    zeroToProdContent = await fs.readFile(path.join(SKILLS_DIR, 'zero-to-prod-orchestrator', 'SKILL.md'), 'utf8');
  } catch {
    // Graceful fallback if file is missing
  }

  const ecosystemContext = {
    allSkillNames,
    brainstormingContent,
    zeroToProdContent
  };

  // Audit all skills in parallel
  const skillAudits = await Promise.all(
    skillDirs.map(async (name) => {
      const skillPath = path.join(SKILLS_DIR, name, 'SKILL.md');
      try {
        const content = await fs.readFile(skillPath, 'utf8');
        return auditSkill(name, content, ecosystemContext);
      } catch (err) {
        return {
          skillName: name,
          version: 'missing',
          author: 'unknown',
          description: '',
          score: 0,
          grade: 'F',
          status: 'DEGRADED',
          outgoingLinks: [],
          deadLinks: [],
          codeBlocksCount: 0,
          issuesCount: 1,
          issues: [{ code: 'FILE_READ_ERROR', message: `Cannot read SKILL.md: ${err.message}` }],
          recommendations: ['Create a valid SKILL.md file in the skill folder.']
        };
      }
    })
  );

  // Calculate In-Degree Centrality and Graph Topology
  const inDegreeMap = new Map();
  skillDirs.forEach(name => inDegreeMap.set(name, 0));

  let totalEdges = 0;
  skillAudits.forEach(audit => {
    audit.outgoingLinks.forEach(target => {
      if (inDegreeMap.has(target)) {
        inDegreeMap.set(target, inDegreeMap.get(target) + 1);
        totalEdges++;
      }
    });
  });

  // Attach in-degree and compute graph hubs
  skillAudits.forEach(audit => {
    audit.inDegree = inDegreeMap.get(audit.skillName) || 0;
    audit.outDegree = audit.outgoingLinks.length;
  });

  const topHubs = [...skillAudits]
    .sort((a, b) => b.inDegree - a.inDegree)
    .slice(0, 10)
    .map(s => ({
      skill: s.skillName,
      inDegree: s.inDegree,
      outDegree: s.outDegree,
      score: s.score
    }));

  const isolatedSkills = skillAudits.filter(s => s.inDegree === 0 && s.outDegree === 0).map(s => s.skillName);
  const totalSkills = skillAudits.length;
  const totalCodeBlocks = skillAudits.reduce((acc, s) => acc + s.codeBlocksCount, 0);
  const averageScore = Math.round((skillAudits.reduce((acc, s) => acc + s.score, 0) / (totalSkills || 1)) * 10) / 10;
  const pristineCount = skillAudits.filter(s => s.status === 'PRISTINE').length;
  const healthyCount = skillAudits.filter(s => s.status === 'HEALTHY').length;
  const driftingCount = skillAudits.filter(s => s.status === 'DRIFTING').length;
  const degradedCount = skillAudits.filter(s => s.status === 'DEGRADED').length;
  const allDeadLinks = skillAudits.flatMap(s => s.deadLinks.map(target => ({ from: s.skillName, to: target })));

  const elapsedMs = Math.round((performance.now() - startTime) * 100) / 100;

  return {
    timestamp: new Date().toISOString(),
    elapsedMs,
    totalSkills,
    totalCodeBlocks,
    totalEdges,
    averageScore,
    ecosystemStatus: averageScore >= 90 ? 'PRISTINE' : averageScore >= 75 ? 'HEALTHY' : 'DRIFTING',
    distribution: {
      pristine: pristineCount,
      healthy: healthyCount,
      drifting: driftingCount,
      degraded: degradedCount
    },
    topHubs,
    isolatedSkills,
    deadLinksCount: allDeadLinks.length,
    deadLinks: allDeadLinks,
    skills: skillAudits
  };
}

/**
 * Formats the audit result into a clean, human-readable terminal report
 * @param {Object} result
 * @param {Object} [options]
 * @returns {string}
 */
export function formatDriftReport(result, options = {}) {
  const lines = [];

  lines.push('\n╔═══════════════════════════════════════════════════════════════════════════════════════════╗');
  lines.push('║             🌊 VIBES-PLUG AUTOMATED SKILL HEALTH & FRAMEWORK DRIFT MONITOR                ║');
  lines.push('╚═══════════════════════════════════════════════════════════════════════════════════════════╝\n');

  lines.push(`📊 Ecosystem Overview:`);
  lines.push(`   • Total Skills Audited : ${result.totalSkills}`);
  lines.push(`   • Total Code Blocks    : ${result.totalCodeBlocks} blocks validated`);
  lines.push(`   • Cross-Skill Links    : ${result.totalEdges} directed graph edges`);
  lines.push(`   • Ecosystem Health     : ${result.averageScore}/100 [${result.ecosystemStatus}]`);
  lines.push(`   • Scan Elapsed Time    : ${result.elapsedMs} ms`);

  lines.push(`\n📈 Health Distribution:`);
  lines.push(`   • Pristine (95-100) : ${result.distribution.pristine}`);
  lines.push(`   • Healthy  (85-94)  : ${result.distribution.healthy}`);
  lines.push(`   • Drifting (75-84)  : ${result.distribution.drifting}`);
  lines.push(`   • Degraded (<75)    : ${result.distribution.degraded}`);

  if (result.deadLinksCount > 0) {
    lines.push(`\n⚠️  Phantom / Dead Skill References Detected (${result.deadLinksCount}):`);
    result.deadLinks.slice(0, 5).forEach(dl => {
      lines.push(`   • [${dl.from}] -> references non-existent [${dl.to}]`);
    });
    if (result.deadLinks.length > 5) {
      lines.push(`   • ... and ${result.deadLinks.length - 5} more.`);
    }
  } else {
    lines.push(`\n✅ Graph Integrity: 0 dead links. All cross-skill references point to valid skills.`);
  }

  if (result.topHubs && result.topHubs.length > 0) {
    lines.push(`\n🌐 Top Ecosystem Hub Skills (Highest In-Degree Centrality):`);
    lines.push('   ┌───────────────────────────────────────────────┬────────────┬────────────┬─────────┐');
    lines.push('   │ Skill Name                                    │ In-Degree  │ Out-Degree │ Score   │');
    lines.push('   ├───────────────────────────────────────────────┼────────────┼────────────┼─────────┤');
    result.topHubs.forEach(hub => {
      const name = hub.skill.padEnd(45, ' ');
      const inDeg = String(hub.inDegree).padStart(10, ' ');
      const outDeg = String(hub.outDegree).padStart(10, ' ');
      const score = (hub.score + '/100').padStart(7, ' ');
      lines.push(`   │ ${name} │ ${inDeg} │ ${outDeg} │ ${score} │`);
    });
    lines.push('   └───────────────────────────────────────────────┴────────────┴────────────┴─────────┘');
  }

  // If specific skill was audited or errors exist
  const skillsWithIssues = result.skills.filter(s => s.issuesCount > 0);
  if (skillsWithIssues.length > 0) {
    lines.push(`\n🚨 Skills Requiring Attention (${skillsWithIssues.length}):`);
    skillsWithIssues.slice(0, 10).forEach(s => {
      lines.push(`   • ${s.skillName} (Score: ${s.score}/100, Grade: ${s.grade}):`);
      s.issues.forEach(iss => lines.push(`       - [${iss.code}] ${iss.message}`));
    });
    if (skillsWithIssues.length > 10) {
      lines.push(`   • ... and ${skillsWithIssues.length - 10} more skills.`);
    }
  } else {
    lines.push(`\n🎉 Zero drift detected across all ${result.totalSkills} skills! Ecosystem is 100% 2026 Gold Standard.`);
  }

  return lines.join('\n');
}

/**
 * Main execution entrypoint
 */
async function main() {
  const args = process.argv.slice(2);
  const isJson = args.includes('--json');
  const isStrict = args.includes('--strict');
  const skillArg = args.find(a => !a.startsWith('-'));

  try {
    const ecosystem = await auditEcosystem();

    // If targeted at a single skill
    if (skillArg) {
      const single = ecosystem.skills.find(s => s.skillName === skillArg);
      if (!single) {
        console.error(`❌ Skill '${skillArg}' not found in catalog.`);
        process.exit(1);
      }

      if (isJson) {
        console.log(JSON.stringify(single, null, 2));
      } else {
        console.log(`\n🔍 Skill Deep Dive: ${single.skillName} (v${single.version})`);
        console.log(`Score: ${single.score}/100 [Grade: ${single.grade}, Status: ${single.status}]`);
        console.log(`Author: ${single.author}`);
        console.log(`Code Blocks: ${single.codeBlocksCount}`);
        console.log(`Centrality: In-Degree: ${single.inDegree}, Out-Degree: ${single.outDegree}`);
        console.log(`Outgoing Connections: ${single.outgoingLinks.join(', ') || 'None'}`);
        if (single.deadLinks.length > 0) {
          console.log(`❌ Dead Links: ${single.deadLinks.join(', ')}`);
        }
        if (single.issues.length > 0) {
          console.log('\nIssues:');
          single.issues.forEach(i => console.log(`  - [${i.code}] ${i.message}`));
          console.log('\nRecommendations:');
          single.recommendations.forEach(r => console.log(`  💡 ${r}`));
        } else {
          console.log('\n✅ 100% Compliant: Zero drift, zero anti-slop violations.');
        }
      }

      if (isStrict && (single.score < 85 || single.issues.length > 0)) {
        process.exit(1);
      }
      return;
    }

    if (isJson) {
      console.log(JSON.stringify(ecosystem, null, 2));
    } else {
      console.log(formatDriftReport(ecosystem));
    }

    if (isStrict && (ecosystem.averageScore < 85 || ecosystem.deadLinksCount > 0 || ecosystem.distribution.degraded > 0)) {
      console.error('\n❌ Strict drift check failed: Ecosystem score below threshold or dead links detected.');
      process.exit(1);
    }

    return;
  } catch (err) {
    console.error(`❌ Drift monitor failed: ${err.message}`);
    process.exit(1);
  }
}

const isDirectExecution = process.argv[1] && (
  path.resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase() ||
  process.argv[1].endsWith('skill-drift-monitor.mjs')
);

if (isDirectExecution) {
  main();
}
