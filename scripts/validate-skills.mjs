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
  'session-context-loader'
];

async function validateSkills() {
  console.log('🔍 Starting Vibes-Plug Ecosystem Validation...\n');
  
  try {
    const entries = await fs.readdir(SKILLS_DIR, { withFileTypes: true });
    const skillDirs = entries.filter(e => e.isDirectory());
    
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
            skillErrors.push('Missing "version" tag (Rule: All skills must be 3.0.0+)');
          } else {
            const version = versionMatch[1];
            if (!version.startsWith('3.')) {
              skillErrors.push(`Version outdated: ${version} (expected >= 3.0.0)`);
            }
          }
        }

        // 2. Check for deprecated references
        for (const ref of DEPRECATED_REFS) {
          if (content.includes(ref)) {
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
      // Just print first 5 errors to avoid terminal spam
      errors.slice(0, 10).forEach(e => console.log(e));
      if(errors.length > 10) console.log(`... and ${errors.length - 10} more skills failed.`);
      console.log('\n❌ CI Pipeline Failed! Please fix the errors above.');
      process.exit(1);
    } else {
      console.log(`🎉 All ${totalSkills} skills passed strict validation! Ecosystem is perfectly healthy.`);
      process.exit(0);
    }

  } catch (error) {
    console.error('Failed to read skills directory:', error);
    process.exit(1);
  }
}

validateSkills();