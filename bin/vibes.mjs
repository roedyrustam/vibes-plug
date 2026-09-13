#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.join(__dirname, '..');

const args = process.argv.slice(2);
const command = args[0];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function runInit(projectName) {
  if (!projectName) {
    console.error('❌ Error: Project name is required.');
    console.log('Usage: vibes init <project-name>');
    process.exit(1);
  }

  const targetDir = path.join(process.cwd(), projectName);
  
  try {
    await fs.mkdir(targetDir);
    console.log(`\n📂 Created project directory: ${projectName}`);

    // Create standard Zero-To-Prod boilerplate
    const filesToCreate = {
      'README.md': `# ${projectName}\n\nProject initialized with Vibes-Plug Swarm Orchestrator.\n\n## Next Steps\nAsk your AI agent to begin **Phase 1: Discovery** using the \`zero-to-prod-orchestrator\` skill.`,
      'PROGRESS.md': `# 🚀 Zero to Prod - Progress Tracker\n\n- [ ] Phase 1: Discovery & PRD\n- [ ] Phase 2: Foundation & Monorepo\n- [ ] Phase 3: Database & Auth\n- [ ] Phase 4: Backend & APIs\n- [ ] Phase 5: Frontend & UI\n- [ ] Phase 6: Testing & Security\n- [ ] Phase 7: DevOps & Monitoring\n- [ ] Phase 8: Launch`,
      'BLUEPRINT.md': `# 📐 System Blueprint\n\n(Auto-generated architectural decisions will be logged here by the AI agent)`,
      'PRD.md': `# 📋 Product Requirements Document\n\n(To be filled by the deep-research-analyst agent)`
    };

    for (const [filename, content] of Object.entries(filesToCreate)) {
      await fs.writeFile(path.join(targetDir, filename), content, 'utf8');
      console.log(`  📄 Created ${filename}`);
    }

    console.log('\n🎉 Project scaffolded successfully!');
    console.log('\nTo get started:');
    console.log(`  cd ${projectName}`);
    console.log('  Ask your AI (Claude/Cursor/Antigravity): "Begin phase 1 using zero-to-prod-orchestrator"');
    
  } catch (err) {
    console.error(`\n❌ Error creating project: ${err.message}`);
  } finally {
    rl.close();
  }
}

async function runValidate() {
  console.log('Running ecosystem validation...\n');
  try {
    const { execSync } = await import('child_process');
    execSync('node ' + path.join(PLUGIN_ROOT, 'scripts', 'validate-skills.mjs'), { stdio: 'inherit' });
  } catch (err) {
    // Error is already printed by the child process
  }
  rl.close();
}

function showHelp() {
  console.log(`
🌊 Vibes-Plug CLI (v3.1.0)
The ultimate AI Swarm Orchestrator tool.

Usage:
  vibes <command> [options]

Commands:
  init <project-name>   Scaffold a new zero-to-prod 8-Phase project structure
  validate              Run the strict 124-skill ecosystem validation check
  help                  Show this help menu
`);
  rl.close();
}

// Main Router
switch (command) {
  case 'init':
    runInit(args[1]);
    break;
  case 'validate':
    runValidate();
    break;
  default:
    showHelp();
    break;
}