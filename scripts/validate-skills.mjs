import fs from 'fs/promises';
import path from 'path';

const SKILLS_DIR = path.join(process.cwd(), 'skills');

const DEPRECATED_REFS = [
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
];

async function validateSkills() {
  console.log('🔍 Starting Vibes-Plug Ecosystem Validation...\n');
  
  try {
    const entries = await fs.readdir(SKILLS_DIR, { withFileTypes: true });
    const skillDirs = entries.filter(e => e.isDirectory());
    
    // Load orchestrators to verify full registration
    const brainstormingContent = await fs.readFile(path.join(SKILLS_DIR, 'brainstorming', 'SKILL.md'), 'utf8');
    const zeroToProdContent = await fs.readFile(path.join(SKILLS_DIR, 'zero-to-prod-orchestrator', 'SKILL.md'), 'utf8');

    let totalSkills = 0;
    let passedSkills = 0;
    let failedSkills = 0;
    const errors = [];

    for (const dir of skillDirs) {
      totalSkills++;
      const skillName = dir.name;
      const skillPath = path.join(SKILLS_DIR, skillName, 'SKILL.md');
      
      try {
        const content = await fs.readFile(skillPath, 'utf8');
        const skillErrors = [];

        // 1. Check Frontmatter existence (ignore BOM)
        const frontmatterMatch = content.match(/---\r?\n([\s\S]*?)\r?\n---/);
        if (!frontmatterMatch) {
          skillErrors.push('Missing YAML frontmatter');
        } else {
          const fm = frontmatterMatch[1];
          if (!fm.includes('name:')) skillErrors.push('Missing "name" in frontmatter');
          if (!fm.includes('description:')) skillErrors.push('Missing "description" in frontmatter');
          
          const versionMatch = fm.match(/version:\s*"([^"]+)"/);
          if (!versionMatch) {
            skillErrors.push('Missing "version" tag (Rule: All skills must be 4.1.0+)');
          } else {
            const version = versionMatch[1];
            const [major, minor] = version.split('.').map(Number);
            if (isNaN(major) || major < 4 || (major === 4 && minor < 1)) {
              skillErrors.push(`Version outdated: ${version} (expected >= 4.1.0)`);
            }
          }

          const authorMatch = fm.match(/author:\s*"([^"]+)"/);
          if (!authorMatch || !authorMatch[1].includes('Roedy Rustam')) {
            skillErrors.push('Missing or invalid "author" tag (expected "Roedy Rustam")');
          }
        }

        // 2. Check for deprecated references
        for (const ref of DEPRECATED_REFS) {
          if (content.includes(`\`${ref}\``) || content.includes(`"${ref}"`)) {
            skillErrors.push(`Contains deprecated reference: ${ref}`);
          }
        }

        // 3. Check for Bilingual structure
        const lowerContent = content.toLowerCase();
        const hasEnglish = lowerContent.includes('english') || lowerContent.includes('inggris');
        const hasIndo = lowerContent.includes('bahasa indonesia') || lowerContent.includes('indonesia');
        
        if (!hasEnglish || !hasIndo) {
          skillErrors.push('Missing bilingual sections (English & Bahasa Indonesia)');
        }

        // 4. Check for Orchestration & Integration section
        const hasOrchestration = /##\s*Orchestration & Integration|##\s*Integrasi Orkestrasi|###\s*Orchestration & Integration|###\s*Integrasi Orkestrasi/i.test(content);
        if (!hasOrchestration) {
          skillErrors.push('Missing Orchestration & Integration section');
        }

        // 5. Check registration in Master Orchestrators
        if (!brainstormingContent.includes(skillName)) {
          skillErrors.push(`Not registered in skills/brainstorming/SKILL.md`);
        }
        if (!zeroToProdContent.includes(skillName)) {
          skillErrors.push(`Not registered in skills/zero-to-prod-orchestrator/SKILL.md`);
        }

        if (skillErrors.length > 0) {
          failedSkills++;
          errors.push(`❌ ${skillName}:\n    - ${skillErrors.join('\n    - ')}`);
        } else {
          passedSkills++;
        }

      } catch (err) {
        failedSkills++;
        errors.push(`❌ ${skillName}:\n    - Missing SKILL.md file`);
      }
    }

    console.log(`📊 Validation Summary:`);
    console.log(`----------------------`);
    console.log(`Total Skills : ${totalSkills}`);
    console.log(`✅ Passed    : ${passedSkills}`);
    console.log(`❌ Failed    : ${failedSkills}\n`);

    if (errors.length > 0) {
      console.log('🚨 Issues Found:');
      errors.slice(0, 10).forEach(e => console.log(e));
      if(errors.length > 10) console.log(`... and ${errors.length - 10} more skills failed.`);
      console.log('\n❌ CI Pipeline Failed! Please fix the errors above.');
      process.exit(1);
    } else {
      console.log(`🎉 All ${totalSkills} skills passed strict validation & master orchestration! Ecosystem is 100% SWARM-synchronized.`);
      process.exit(0);
    }

  } catch (error) {
    console.error('Failed to read skills directory:', error);
    process.exit(1);
  }
}

validateSkills();