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

async function runAudit() {
  console.log('Running Anti-AI Slop Audit...\n');
  try {
    const { execSync } = await import('child_process');
    execSync('node ' + path.join(PLUGIN_ROOT, 'scripts', 'check-anti-slop.js'), { stdio: 'inherit' });
  } catch (err) {
    // Error is already printed by the child process
  }
  rl.close();
}

async function runCreateSkill(skillName) {
  if (!skillName) {
    console.error('❌ Error: Skill name is required.');
    console.log('Usage: vibes create-skill <skill-name>');
    process.exit(1);
  }

  const kebabCaseRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  if (!kebabCaseRegex.test(skillName)) {
    console.error('❌ Error: Skill name must be in kebab-case (e.g., my-new-skill).');
    process.exit(1);
  }

  const targetDir = path.join(PLUGIN_ROOT, 'skills', skillName);
  const templatePath = path.join(PLUGIN_ROOT, 'templates', 'SKILL_TEMPLATE.md');

  try {
    const exists = await fs.access(targetDir).then(() => true).catch(() => false);
    if (exists) {
      console.error(`❌ Error: Skill directory '${skillName}' already exists.`);
      process.exit(1);
    }

    await fs.mkdir(targetDir, { recursive: true });
    
    let templateContent = await fs.readFile(templatePath, 'utf8');
    
    // Basic string replacements
    templateContent = templateContent.replace(/skill-baru/g, skillName);
    templateContent = templateContent.replace(/\[Skill Name\]/g, skillName);

    await fs.writeFile(path.join(targetDir, 'SKILL.md'), templateContent, 'utf8');
    
    console.log(`\n🎉 Scaffolded new skill: ${skillName}`);
    console.log(`📂 Location: skills/${skillName}/SKILL.md`);
    console.log('\nNext steps:');
    console.log('  1. Open the file and follow the checklist at the bottom.');
    console.log('  2. Replace all [...] placeholders with actual content.');
    console.log('  3. Register your new skill in brainstorming/SKILL.md');
    
  } catch (err) {
    console.error(`\n❌ Error creating skill: ${err.message}`);
  } finally {
    rl.close();
  }
}

async function runCreateMcp(serverName) {
  if (!serverName) {
    console.error('❌ Error: MCP Server name is required.');
    console.log('Usage: vibes create-mcp <server-name>');
    process.exit(1);
  }

  const targetDir = path.join(process.cwd(), serverName);

  try {
    const exists = await fs.access(targetDir).then(() => true).catch(() => false);
    if (exists) {
      console.error(`❌ Error: Directory '${serverName}' already exists.`);
      process.exit(1);
    }

    await fs.mkdir(targetDir, { recursive: true });
    await fs.mkdir(path.join(targetDir, 'src'), { recursive: true });

    const filesToCreate = {
      'package.json': `{
  "name": "${serverName}",
  "version": "1.0.0",
  "description": "MCP Server generated by vibes-plug",
  "type": "module",
  "bin": {
    "${serverName}": "./build/index.js"
  },
  "scripts": {
    "build": "tsc",
    "start": "node build/index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "latest",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "typescript": "^5.5.4"
  }
}`,
      'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./build",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}`,
      'src/index.ts': `#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";

class ${serverName.replace(/[^a-zA-Z0-9]/g, '')}Server {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "${serverName}",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "hello_world",
          description: "A simple hello world tool",
          inputSchema: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Name to greet",
              },
            },
            required: ["name"],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name !== "hello_world") {
        throw new McpError(
          ErrorCode.MethodNotFound,
          \`Unknown tool: \${request.params.name}\`
        );
      }

      const args = request.params.arguments as { name: string };
      
      return {
        content: [
          {
            type: "text",
            text: \`Hello, \${args.name}! Welcome to your new MCP server.\`,
          },
        ],
      };
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('${serverName} MCP server running on stdio');
  }
}

const server = new ${serverName.replace(/[^a-zA-Z0-9]/g, '')}Server();
server.run().catch(console.error);
`
    };

    for (const [filename, content] of Object.entries(filesToCreate)) {
      await fs.writeFile(path.join(targetDir, filename), content, 'utf8');
      console.log(`  📄 Created ${filename}`);
    }

    console.log(`\n🎉 MCP Server scaffolded successfully in ./${serverName}`);
    console.log('\nNext steps:');
    console.log(`  cd ${serverName}`);
    console.log('  npm install');
    console.log('  npm run build');
    console.log('\nTo use with Claude Desktop or Cursor, add this to your config:');
    console.log(`
{
  "mcpServers": {
    "${serverName}": {
      "command": "node",
      "args": ["${path.join(process.cwd(), serverName, 'build', 'index.js')}"]
    }
  }
}`);
  } catch (err) {
    console.error(`\n❌ Error creating MCP Server: ${err.message}`);
  } finally {
    rl.close();
  }
}

async function runAddSkill(skillName) {
  if (!skillName) {
    console.error('❌ Error: Skill name is required.');
    console.log('Usage: vibes add <skill-name>');
    process.exit(1);
  }

  const sourceDir = path.join(PLUGIN_ROOT, 'skills', skillName);
  
  try {
    const exists = await fs.access(sourceDir).then(() => true).catch(() => false);
    if (!exists) {
      console.error(`❌ Error: Skill '${skillName}' not found in vibes-plug global registry.`);
      process.exit(1);
    }

    // Default to .agents/skills for local project injection
    const targetBaseDir = path.join(process.cwd(), '.agents', 'skills');
    const targetDir = path.join(targetBaseDir, skillName);

    await fs.mkdir(targetBaseDir, { recursive: true });
    
    // Node v16.7.0+ required for fs.cp
    await fs.cp(sourceDir, targetDir, { recursive: true });

    console.log(`\n🎉 Successfully added '${skillName}' to your local project!`);
    console.log(`📂 Location: .agents/skills/${skillName}/SKILL.md`);
    console.log('\nYour AI agents will now automatically load this skill when working in this repository.');
  } catch (err) {
    console.error(`\n❌ Error adding skill: ${err.message}`);
  } finally {
    rl.close();
  }
}

function showHelp() {
  console.log(`
🌊 Vibes-Plug CLI (v3.2.0)
The ultimate AI Swarm Orchestrator tool.

Usage:
  vibes <command> [options]

Commands:
  init <project-name>       Scaffold a new zero-to-prod 8-Phase project structure
  create-skill <skill-name> Scaffold a new skill using the standard template (kebab-case)
  create-mcp <server-name>  Scaffold a new Model Context Protocol (MCP) server
  add <skill-name>          Inject a skill from the global registry into your local project (.agents/skills)
  audit                     Run the strict Anti-AI Slop quality gate check
  validate                  Run the strict 125-skill ecosystem validation check
  help                      Show this help menu
`);
  rl.close();
}

// Main Router
switch (command) {
  case 'init':
    runInit(args[1]);
    break;
  case 'create-skill':
    runCreateSkill(args[1]);
    break;
  case 'create-mcp':
    runCreateMcp(args[1]);
    break;
  case 'add':
    runAddSkill(args[1]);
    break;
  case 'audit':
    runAudit();
    break;
  case 'validate':
    runValidate();
    break;
  default:
    showHelp();
    break;
}