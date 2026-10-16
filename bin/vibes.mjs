#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';
import { fileURLToPath, pathToFileURL } from 'url';

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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isValidIdentifier(value) {
  return typeof value === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,63}$/.test(value);
}

async function runInit(projectName) {
  if (!projectName || !isValidIdentifier(projectName)) {
    console.error('❌ Error: A valid alphanumeric project name is required.');
    console.log('Usage: vibes init <project-name>');
    process.exit(1);
  }

  const targetDir = path.join(process.cwd(), projectName);
  
  try {
    await fs.mkdir(targetDir);
    console.log(`\n📂 Created project directory: ${projectName}`);

    // Create standard Zero-To-Prod boilerplate
    const filesToCreate = {
      'README.md': `# ${projectName}\n\nProject initialized with Vibes-Plug Swarm Orchestrator.\n\n## Next Steps\nAsk your AI agent to begin **Phase 1: Discovery** using the \`zero-to-prod-orchestrator\` skill.\n`,
      'PROGRESS.md': `# 🚀 Zero to Prod - Progress Tracker\n\n- [ ] Phase 1: Discovery & PRD Architecture\n- [ ] Phase 2: Foundation & Project Structure\n- [ ] Phase 3: Database & Security Isolation\n- [ ] Phase 4: Backend & APIs\n- [ ] Phase 5: Frontend & User Interface\n- [ ] Phase 6: Testing & Quality Gate (TDD / Anti-Slop)\n- [ ] Phase 7: DevOps, Telemetry & CI/CD\n- [ ] Phase 8: Production Release & Post-Launch Validation\n`,
      'BLUEPRINT.md': `# 📐 System Blueprint & Architecture\n\n## 1. Architectural Topology\n\`\`\`\nClient (Web / Mobile) ──► Reverse Proxy / Gateway ──► Application Layer ──► Database / Cache\n\`\`\`\n\n## 2. Technology Stack Selection\n- **Runtime**: Node.js 24+ LTS / Bun 1.2+\n- **Frontend / Fullstack**: Next.js 15 App Router / React 19 / Hono\n- **Language**: TypeScript 5.8+ (Strict Mode)\n- **Styling**: Tailwind CSS v4 (@theme tokens)\n- **Database ORM**: Prisma 6 / Drizzle ORM\n- **Testing**: Vitest + Playwright E2E\n\n## 3. Architectural Decision Records (ADRs)\n- **ADR-001**: Contract-first API schema definition with automated TypeScript client codegen.\n- **ADR-002**: Stateless session tokens with short expiration and refresh rotation.\n- **ADR-003**: Deterministic KV-Cache prompt prefixing for sub-second AI orchestration.\n`,
      'PRD.md': `# 📋 ${projectName} - Product Requirements Document (PRD)\n\n## 1. Executive Summary & Vision\n- **Product Name**: ${projectName}\n- **Lifecycle**: 8-Phase Zero-To-Prod Swarm Lifecycle\n- **Target Audience**: Developers, enterprise teams, and end-users requiring high-velocity reliability.\n\n## 2. Core Functional Requirements\n- **F-01**: Secure identity management and session validation with RBAC.\n- **F-02**: Typed domain models with automated schema validation.\n- **F-03**: Resilient data mutations with transactional idempotency.\n- **F-04**: Real-time event propagation and responsive user interface state.\n\n## 3. Data Architecture Spec (PostgreSQL DDL)\n\`\`\`sql\nCREATE TABLE IF NOT EXISTS users (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  email VARCHAR(255) UNIQUE NOT NULL,\n  role VARCHAR(32) NOT NULL DEFAULT 'user',\n  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n);\n\nCREATE INDEX idx_users_email ON users(email);\n\`\`\`\n\n## 4. API Interface Contract\n\`\`\`json\n{\n  "endpoint": "/api/v1/health",\n  "method": "GET",\n  "response": {\n    "status": "healthy",\n    "version": "1.0.0",\n    "timestamp": "ISO-8601"\n  }\n}\n\`\`\`\n\n## 5. Non-Functional Requirements (NFR Budgets)\n- **Latency**: P99 response time < 150ms.\n- **Quality**: Zero AI slop, zero placeholder stubs, 100% typed contracts.\n- **Accessibility**: WCAG 2.2 Level AA compliance.\n- **Security**: OWASP Top 10 hardened with atomic input sanitization.\n`
    };

    for (const [filename, content] of Object.entries(filesToCreate)) {
      await fs.writeFile(path.join(targetDir, filename), content, 'utf8');
      console.log(`  📄 Created ${filename}`);
    }

    console.log('\n🎉 Project scaffolded successfully!');
    console.log('\nTo get started:');
    console.log(`  cd ${projectName}`);
    console.log('  Ask your AI (Claude/Cursor/Antigravity/Codex): "Begin phase 1 using zero-to-prod-orchestrator"');
    
  } catch (err) {
    console.error(`\n❌ Error creating project: ${err.message}`);
  } finally {
    rl.close();
  }
}

async function runBootstrap(templateName, projectName) {
  if (!templateName || !projectName) {
    console.error('❌ Error: Template name and Project name are required.');
    console.log('Usage: vibes bootstrap <template> <project-name>');
    console.log('Available templates: saas, ecommerce, mobile, api, fullstack, spec-api');
    process.exit(1);
  }

  const validTemplates = ['saas', 'ecommerce', 'mobile', 'api', 'fullstack', 'spec-api'];
  if (!validTemplates.includes(templateName)) {
    console.error(`❌ Error: Invalid template '${templateName}'. Valid options: ${validTemplates.join(', ')}`);
    process.exit(1);
  }

  const targetDir = path.join(process.cwd(), projectName);

  try {
    const exists = await fs.access(targetDir).then(() => true).catch(() => false);
    if (exists) {
      console.error(`❌ Error: Directory '${projectName}' already exists.`);
      process.exit(1);
    }

    if (!isValidIdentifier(projectName)) {
      console.error('❌ Error: Project name must be a safe alphanumeric/kebab-case identifier.');
      process.exit(1);
    }

    let scaffoldArgs = [];
    let prdTitle = projectName;
    let specificSkills = [];

    if (templateName === 'saas') {
      prdTitle = 'Multi-Tenant SaaS';
      scaffoldArgs = ['create-next-app@latest', projectName, '--ts', '--tailwind', '--eslint', '--app', '--src-dir', '--import-alias', '@/*', '--use-npm', '--yes'];
      specificSkills = ['saas-architect', 'saas-multi-tenant', 'saas-billing', 'payment-gateway-expert', 'doku-payment-gateway', 'supabase-security-expert'];
    } else if (templateName === 'ecommerce') {
      prdTitle = 'E-Commerce Platform';
      scaffoldArgs = ['create-next-app@latest', projectName, '--ts', '--tailwind', '--eslint', '--app', '--src-dir', '--import-alias', '@/*', '--use-npm', '--yes'];
      specificSkills = ['ecommerce-expert', 'payment-gateway-expert', 'database-orm-expert', 'doku-payment-gateway'];
    } else if (templateName === 'mobile') {
      prdTitle = 'Mobile App (Expo)';
      scaffoldArgs = ['create-expo-app@latest', projectName, '--template', 'blank-typescript', '--yes'];
      specificSkills = ['mobile-expo-expert', 'authentication-identity-expert', 'api-design-expert', 'state-management-expert'];
    } else if (templateName === 'api') {
      prdTitle = 'Backend API (Hono/Node.js)';
      scaffoldArgs = ['create-hono@latest', projectName, '--template', 'nodejs', '--pm', 'npm', '--install'];
      specificSkills = ['js-backend-expert', 'api-design-expert', 'database-orm-expert', 'authentication-identity-expert', 'logging-error-tracking-expert'];
    } else if (templateName === 'fullstack') {
      prdTitle = 'Full-Stack T3 App';
      scaffoldArgs = ['create-t3-app@latest', projectName, '--CI', '--noGit', '--appRouter', '--tailwind', '--trpc', '--prisma', '--nextAuth'];
      specificSkills = ['nextjs-app-router-expert', 'saas-architect', 'database-orm-expert', 'authentication-identity-expert', 'tailwind-expert'];
    } else if (templateName === 'spec-api') {
      prdTitle = 'Contract-First Spec-Driven API (TypeSpec & OpenAPI 3.1)';
      scaffoldArgs = ['create-hono@latest', projectName, '--template', 'nodejs', '--pm', 'npm', '--install'];
      specificSkills = [
        'spec-driven-development-expert',
        'openapi-swagger-codegen-expert',
        'api-design-expert',
        'autonomous-api-drift-healer',
        'database-orm-expert',
        'authentication-identity-expert',
        'logging-error-tracking-expert'
      ];
    }

    console.log(`\n\ud83d\ude80 Bootstrapping ${prdTitle} project: ${projectName}...`);
    console.log('\u23f3 This may take a minute or two as npm installs dependencies...\n');

    const { execFileSync } = await import('child_process');
    const npxBin = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    execFileSync(npxBin, scaffoldArgs, { stdio: 'inherit' });

    console.log(`\n📂 Project scaffolded. Injecting AI skills for ${templateName}...`);

    // Core skills for all templates
    const coreSkills = [
      'zero-to-prod-orchestrator',
      'senior-frontend',
      'tailwind-expert',
      'anti-slop',
      'session-memory-manager'
    ];

    const allSkills = [...coreSkills, ...specificSkills];
    const targetAgentsDir = path.join(targetDir, '.agents', 'skills');
    await fs.mkdir(targetAgentsDir, { recursive: true });

    for (const skill of allSkills) {
      const sourceDir = path.join(PLUGIN_ROOT, 'skills', skill);
      const skillTargetDir = path.join(targetAgentsDir, skill);
      
      const skillExists = await fs.access(sourceDir).then(() => true).catch(() => false);
      if (skillExists) {
        await fs.cp(sourceDir, skillTargetDir, { recursive: true });
        console.log(`  ➕ Injected skill: ${skill}`);
      } else {
        console.warn(`  ⚠️ Warning: Skill '${skill}' not found in global registry.`);
      }
    }

    // Overwrite README, PROGRESS, BLUEPRINT, and PRD
    const filesToCreate = {
      'README.md': `# ${projectName}\n\nProject initialized with Vibes-Plug Swarm Orchestrator (${templateName.toUpperCase()} template).\n\n## Next Steps\nAsk your AI agent to begin **Phase 1: Discovery** using the \`zero-to-prod-orchestrator\` skill.\n`,
      'PROGRESS.md': `# 🚀 Zero to Prod - Progress Tracker (${templateName.toUpperCase()})\n\n- [ ] Phase 1: Discovery & PRD Architecture\n- [ ] Phase 2: Foundation & Project Structure\n- [ ] Phase 3: Database & Security Isolation\n- [ ] Phase 4: Backend & APIs\n- [ ] Phase 5: Frontend & User Interface\n- [ ] Phase 6: Testing & Quality Gate (TDD / Anti-Slop)\n- [ ] Phase 7: DevOps, Telemetry & CI/CD\n- [ ] Phase 8: Production Release & Post-Launch Validation\n`,
      'BLUEPRINT.md': `# 📐 System Blueprint & Architecture (${templateName.toUpperCase()})\n\n## 1. Architectural Topology\n\`\`\`\nClient (Web / Mobile) ──► Reverse Proxy / Gateway ──► Application Layer ──► Database / Cache\n\`\`\`\n\n## 2. Technology Stack Selection\n- **Template**: ${templateName}\n- **Runtime**: Node.js 24+ LTS / Bun 1.2+\n- **Language**: TypeScript 5.8+ (Strict Mode)\n- **Active Skills**: ${allSkills.join(', ')}\n\n## 3. Architectural Decision Records (ADRs)\n- **ADR-001**: Contract-first domain boundaries with automated schema validation.\n- **ADR-002**: Zero-tolerance Anti-Slop quality gates across all routines.\n- **ADR-003**: Deterministic KV-Cache prompt prefixing for sub-second AI orchestration.\n`,
      'PRD.md': `# 📋 ${prdTitle} - Product Requirements Document (PRD)\n\n## 1. Executive Summary & Vision\n- **Project Name**: ${projectName}\n- **Template Archetype**: ${templateName.toUpperCase()}\n- **Bound Skills**: ${allSkills.join(', ')}\n\n## 2. Core Functional Requirements\n- **F-01**: Secure identity management and session validation with RBAC.\n- **F-02**: Typed domain models with automated schema validation.\n- **F-03**: Resilient data mutations with transactional idempotency.\n- **F-04**: Real-time event propagation and responsive user interface state.\n\n## 3. Data Architecture Spec (PostgreSQL DDL)\n\`\`\`sql\nCREATE TABLE IF NOT EXISTS users (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  email VARCHAR(255) UNIQUE NOT NULL,\n  role VARCHAR(32) NOT NULL DEFAULT 'user',\n  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n);\n\nCREATE INDEX idx_users_email ON users(email);\n\`\`\`\n\n## 4. API Interface Contract\n\`\`\`json\n{\n  "endpoint": "/api/v1/health",\n  "method": "GET",\n  "response": {\n    "status": "healthy",\n    "version": "1.0.0",\n    "timestamp": "ISO-8601"\n  }\n}\n\`\`\`\n\n## 5. Non-Functional Requirements (NFR Budgets)\n- **Latency**: P99 response time < 150ms.\n- **Quality**: Zero AI slop, zero placeholder stubs, 100% typed contracts.\n- **Accessibility**: WCAG 2.2 Level AA compliance.\n- **Security**: OWASP Top 10 hardened with atomic input sanitization.\n`
    };

    for (const [filename, content] of Object.entries(filesToCreate)) {
      await fs.writeFile(path.join(targetDir, filename), content, 'utf8');
      console.log(`  📄 Created ${filename}`);
    }

    console.log(`\n🎉 Super-Scaffolding complete for ${projectName}!`);
    console.log('\nTo get started:');
    console.log(`  cd ${projectName}`);
    console.log('  Ask your AI (Claude/Cursor/Antigravity): "Begin phase 1 using zero-to-prod-orchestrator"');

  } catch (err) {
    console.error(`\n❌ Error during bootstrap: ${err.message}`);
  } finally {
    rl.close();
  }
}

async function runValidate() {
  console.log('Running ecosystem validation...\n');
  try {
    const { execFileSync } = await import('child_process');
    execFileSync('node', [path.join(PLUGIN_ROOT, 'scripts', 'validate-skills.mjs')], { stdio: 'inherit' });
  } catch (err) {
    // Error is already printed by the child process
  }
  rl.close();
}

async function runAudit() {
  const auditArgs = args.slice(1);
  try {
    const { execFileSync } = await import('child_process');
    execFileSync('node', [path.join(PLUGIN_ROOT, 'scripts', 'check-anti-slop.mjs'), ...auditArgs], { stdio: 'inherit' });
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
  if (!serverName || !/^[a-zA-Z][a-zA-Z0-9-_]{0,63}$/.test(serverName)) {
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
  if (!skillName || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(skillName)) {
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

async function runUi() {
  let checkbox, select;
  try {
    const prompts = await import('@inquirer/prompts');
    checkbox = prompts.checkbox;
    select = prompts.select;
  } catch (err) {
    console.error('❌ Error: The Interactive TUI requires the @inquirer/prompts package.');
    console.error('Please run "npm install" inside the vibes-plug directory first:');
    console.error(`  cd ${PLUGIN_ROOT}`);
    console.error('  npm install');
    process.exit(1);
  }

  // Close the global readline so inquirer can take over stdin
  rl.close();

  try {
    const skillsDir = path.join(PLUGIN_ROOT, 'skills');
    const entries = await fs.readdir(skillsDir, { withFileTypes: true });
    const allSkills = entries
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .sort();

    console.log(`\n🌊 Vibes-Plug Interactive TUI (${allSkills.length} Skills)`);

    const mode = await select({
      message: 'Choose installation mode:',
      choices: [
        { name: '📦 Curated Recipe Bundles (Quickest: AI, Fullstack, FinTech, API)', value: 'recipe' },
        { name: '📂 Browse by Domain Category (Frontend, Backend, AI, Security...)', value: 'domain' },
        { name: `🧩 Custom Selection from All ${allSkills.length} Skills`, value: 'all' }
      ]
    });

    let selectedSkills = [];

    if (mode === 'recipe') {
      const recipeChoices = Object.entries(RECIPES).map(([name, r]) => ({
        name: `${name.padEnd(20)} — ${r.description} (${r.skills.length} skills)`,
        value: name
      }));

      const chosenRecipeName = await select({
        message: 'Select a curated recipe bundle to install:',
        choices: recipeChoices,
        pageSize: 10
      });

      selectedSkills = RECIPES[chosenRecipeName]?.skills || [];
      console.log(`\nSelected recipe "${chosenRecipeName}" with ${selectedSkills.length} skills.`);
    } else if (mode === 'domain') {
      const chosenDomain = await select({
        message: 'Select domain category:',
        choices: [
          { name: '🎨 Frontend & Mobile UI/UX (35 Skills)', value: 'frontend' },
          { name: '⚙️ Backend, Systems & API Design (27 Skills)', value: 'backend' },
          { name: '🤖 Frontier AI, LLM, MCP & Multi-Agent (30 Skills)', value: 'ai' },
          { name: '💸 SaaS, FinTech, E-Commerce & Growth (16 Skills)', value: 'saas' },
          { name: '🛡️ Testing, Security, Anti-Slop & Quality (23 Skills)', value: 'security' },
          { name: '🚀 Data, Media, Lifecycle & Orchestration (24 Skills)', value: 'data' }
        ]
      });

      const DOMAIN_SKILL_MAP = {
        frontend: [
          'angular-expert', 'apple-ecosystem-expert', 'astro-framework-expert',
          'blockchain-web3-expert', 'browser-extension-mv3-pro', 'design-system-architect',
          'desktop-electron-expert', 'ephemeral-generative-ui-architect', 'form-validation-expert',
          'global-a11y-i18n-expert', 'glsl-shader-expert', 'hig', 'micro-frontend-architect',
          'mobile-expo-expert', 'modern-css-native-expert', 'mpa-orchestrator',
          'multimodal-spatial-video-cloner', 'nextjs-app-router-expert', 'pwa-offline-first-expert',
          'rich-text-editor-expert', 'screenshot-to-code-expert', 'senior-frontend',
          'solidjs-expert', 'spa-orchestrator', 'state-management-expert',
          'svg-animation-motion-expert', 'svelte-sveltekit-expert', 'tailwind-expert',
          'tanstack-query-expert', 'tauri-expert', 'ui-ux-pro-max', 'visual-ui-auditor',
          'vue-frontend-expert', 'web-3d-graphics-expert', 'webxr-ar-vr-expert'
        ],
        backend: [
          'api-design-expert', 'api-gateway-proxy-expert', 'async-queue-temporal-expert',
          'autonomous-api-drift-healer', 'bun-runtime-expert', 'composable-mach-architect',
          'cron-scheduler-expert', 'domain-driven-design-expert', 'ephemeral-wasm-sandbox-executor',
          'event-driven-architect', 'fullstack-expert', 'go-programming-expert',
          'graphql-apollo-expert', 'js-backend-expert', 'legacy-code-translator',
          'living-codebase-ast-graph', 'monorepo-architect', 'mvc-expert',
          'openapi-swagger-codegen-expert', 'python-programming-expert', 'rust-programming-expert',
          'scalability-clean-code', 'spec-driven-development-expert', 'structured-output-contracts',
          'typescript-expert', 'wasm-edge-computing-expert', 'web-game-engine-expert'
        ],
        ai: [
          'adaptive-model-cascade', 'affective-computing-emotion-ai', 'agentic-coding-workflow-expert',
          'agentic-memory-architect', 'agentic-micro-economy-architect', 'ai-llm-integration-expert',
          'ai-media-generation-expert', 'ai-prompt-engineering-expert', 'ai-safety-governance-expert',
          'context-window-engineer', 'deep-research-analyst', 'doku-mcp-server',
          'frontier-ai-models-expert', 'gemini-agent-booster', 'graph-rag-knowledge-expert',
          'kv-cache-prefix-optimizer', 'llm-finops-router', 'llm-observability-expert',
          'local-slm-edge-ai-expert', 'mcp-server-architect', 'multi-agent-orchestration',
          'parallel-tool-orchestrator', 'pydantic-ai-expert', 'speculative-multi-draft-synthesizer',
          'synthetic-data-finetuning-expert', 'test-time-compute-optimizer', 'thinking-budget-orchestrator',
          'vector-db-rag-expert', 'vercel-ai-sdk-expert', 'voice-ai-realtime-agent'
        ],
        saas: [
          'agentic-m2m-settlement', 'app-promo-media-expert', 'chatbot-messaging-expert',
          'doku-payment-gateway', 'ecommerce-expert', 'email-notification-expert',
          'feature-flag-analytics-expert', 'headless-cms-expert', 'n8n-automation-expert',
          'payment-gateway-expert', 'saas-architect', 'saas-billing', 'saas-multi-tenant',
          'seo', 'data-telemetry-expert', 'wordpress-headless-expert'
        ],
        security: [
          'accessibility-testing-expert', 'ai-code-review-autonomous', 'anti-slop',
          'authentication-identity-expert', 'autonomous-red-teamer', 'autonomous-tdd-debugger',
          'biome-linter-formatter-expert', 'compliance-gdpr-privacy-expert', 'e2e-testing-expert',
          'error-resilience-expert', 'firebase-security-expert', 'formal-spec-z3-verifier',
          'logging-error-tracking-expert', 'mcp-sampling-critic', 'post-quantum-crypto-migrator',
          'production-ready-hardener', 'prompt-injection-firewall', 'property-mutation-testing-expert',
          'rate-limit-abuse-prevention', 'supabase-security-expert', 'zero-tech-debt-auditor',
          'zero-trust-secret-vault', 'coderabbit'
        ],
        data: [
          'agy-customizations', 'app-analyzer-optimizer', 'brainstorming', 'browser-automation-expert',
          'ci-cd-devops-architect', 'cloud-hosting-expert', 'data-pipeline-etl-expert',
          'data-visualization-expert', 'database-orm-expert', 'dependency-upgrade-migrator',
          'documentation-site-expert', 'file-upload-media-expert', 'geospatial-maps-expert',
          'pdf-document-generation-expert', 'performance-web-vitals', 'prd-architect',
          'proactive-background-watcher', 'realtime-collaboration-expert', 'search-engine-expert',
          'self-healing-cloud-orchestrator', 'session-memory-manager', 'sse-websocket-streaming-expert',
          'web-scraper', 'website-design-cloner', 'zero-to-prod-orchestrator'
        ]
      };

      const domainSkills = (DOMAIN_SKILL_MAP[chosenDomain] || []).filter(s => allSkills.includes(s));
      const choices = domainSkills.map(skill => ({ name: skill, value: skill }));

      selectedSkills = await checkbox({
        message: 'Select skills to install:',
        choices: choices,
        pageSize: 15
      });
    } else {
      const choices = allSkills.map(skill => ({ name: skill, value: skill }));
      selectedSkills = await checkbox({
        message: 'Select the AI skills to install into this project:',
        choices: choices,
        loop: false,
        pageSize: 15
      });
    }

    if (!selectedSkills || selectedSkills.length === 0) {
      console.log('No skills selected. Exiting.');
      return;
    }

    const targetBaseDir = path.join(process.cwd(), '.agents', 'skills');
    await fs.mkdir(targetBaseDir, { recursive: true });

    let count = 0;
    for (const skill of selectedSkills) {
      const sourceDir = path.join(skillsDir, skill);
      const targetDir = path.join(targetBaseDir, skill);
      
      const exists = await fs.access(targetDir).then(() => true).catch(() => false);
      if (!exists) {
        await fs.cp(sourceDir, targetDir, { recursive: true });
        console.log(`  ➕ Added: ${skill}`);
        count++;
      } else {
        console.log(`  ⏭️ Skipped (already exists): ${skill}`);
      }
    }
    
    console.log(`\n🎉 Successfully installed ${count} skill(s) into .agents/skills/`);
    console.log('Your AI agents will now automatically load these skills when working in this repository.');
    
  } catch (err) {
    if (err.name === 'ExitPromptError') {
      console.log('Interactive prompt cancelled.');
    } else {
      console.error(`\n❌ Error: ${err.message}`);
    }
  }
}

async function runRemoveSkill(skillName) {
  if (!skillName || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(skillName)) {
    console.error('❌ Error: Skill name is required.');
    console.log('Usage: vibes remove <skill-name>');
    process.exit(1);
  }

  const targetDir = path.join(process.cwd(), '.agents', 'skills', skillName);

  try {
    const exists = await fs.access(targetDir).then(() => true).catch(() => false);
    if (!exists) {
      console.error(`❌ Skill '${skillName}' is not installed in this project.`);
      console.log('Run "vibes list" to see available skills or "vibes ui" to manage them.');
      process.exit(1);
    }

    await fs.rm(targetDir, { recursive: true, force: true });
    console.log(`\n✅ Successfully removed '${skillName}' from your local project.`);
    console.log('💡 Run "vibes add" or "vibes ui" to re-install skills anytime.');

  } catch (err) {
    console.error(`\n❌ Error removing skill: ${err.message}`);
  } finally {
    rl.close();
  }
}

async function runListSkills(filter) {
  try {
    const skillsDir = path.join(PLUGIN_ROOT, 'skills');
    const entries = await fs.readdir(skillsDir, { withFileTypes: true });
    const allSkills = entries
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .sort();

    // Check which skills are already installed locally
    const localAgentsDir = path.join(process.cwd(), '.agents', 'skills');
    let localSkills = new Set();
    const localExists = await fs.access(localAgentsDir).then(() => true).catch(() => false);
    if (localExists) {
      const localEntries = await fs.readdir(localAgentsDir, { withFileTypes: true });
      localEntries
        .filter(d => d.isDirectory())
        .forEach(d => localSkills.add(d.name));
    }

    // Apply filter if provided
    const filtered = filter
      ? allSkills.filter(s => s.includes(filter.toLowerCase()))
      : allSkills;

    if (filtered.length === 0) {
      console.log(`❌ No skills found matching "${filter}".`);
      rl.close();
      return;
    }

    const title = filter ? `Skills matching "${filter}"` : 'All Available Skills';
    console.log(`\n🌊 Vibes-Plug Registry — ${title}`);
    console.log(`📊 ${filtered.length} skill(s) found | ✅ = installed locally\n`);

    // Group by domain prefix for readability
    filtered.forEach(skill => {
      const installed = localSkills.has(skill) ? ' ✅' : '';
      console.log(`  • ${skill}${installed}`);
    });

    console.log(`
💡 Commands:`);
    console.log('  vibes add <skill-name>    — Install a skill into this project');
    console.log('  vibes remove <skill-name> — Remove a skill from this project');
    console.log('  vibes ui               — Interactive multiselect menu');

  } catch (err) {
    console.error(`\n❌ Error listing skills: ${err.message}`);
  } finally {
    rl.close();
  }
}

async function runVersion(action, type) {
  const pkgPath = path.join(PLUGIN_ROOT, 'package.json');
  const pluginJsonPath = path.join(PLUGIN_ROOT, 'plugin.json');
  const changelogPath = path.join(PLUGIN_ROOT, 'CHANGELOG.md');
  const vivesMjsPath = path.join(PLUGIN_ROOT, 'bin', 'vibes.mjs');

  try {
    const pkgRaw = await fs.readFile(pkgPath, 'utf8');
    const pkg = JSON.parse(pkgRaw);
    const current = pkg.version;
    const [major, minor, patch] = current.split('.').map(Number);

    if (!action || action === 'current') {
      console.log(`📦 Current version: v${current}`);
      rl.close();
      return;
    }

    if (action !== 'bump') {
      console.error('❌ Usage: vibes version current  OR  vibes version bump <major|minor|patch>');
      process.exit(1);
    }

    let next;
    if (type === 'major') next = `${major + 1}.0.0`;
    else if (type === 'minor') next = `${major}.${minor + 1}.0`;
    else if (type === 'patch') next = `${major}.${minor}.${patch + 1}`;
    else {
      console.error('❌ Bump type must be: major | minor | patch');
      process.exit(1);
    }

    const files = [
      { path: pkgPath, from: `"version": "${current}"`, to: `"version": "${next}"` },
      { path: pluginJsonPath, from: `"version": "${current}"`, to: `"version": "${next}"` },
      { path: path.join(PLUGIN_ROOT, 'gemini-extension.json'), from: `"version": "${current}"`, to: `"version": "${next}"` },
      { path: path.join(PLUGIN_ROOT, '.codex-plugin', 'plugin.json'), from: `"version": "${current}"`, to: `"version": "${next}"` },
      { path: vivesMjsPath, from: `CLI (v${current})`, to: `CLI (v${next})` },
      { path: path.join(PLUGIN_ROOT, 'bin', 'mcp-server.mjs'), from: `v${current}`, to: `v${next}` },
      { path: path.join(PLUGIN_ROOT, 'scripts', 'studio-server.mjs'), from: `v${current}`, to: `v${next}` }
    ];

    for (const { path: filePath, from, to } of files) {
      const raw = await fs.readFile(filePath, 'utf8');
      if (raw.includes(from)) {
        await fs.writeFile(filePath, raw.replaceAll(from, to), 'utf8');
        console.log(`  ✅ Updated: ${path.basename(filePath)}  ${current} → ${next}`);
      } else {
        console.log(`  ⏭️ Skipped (pattern not found): ${path.basename(filePath)}`);
      }
    }

    // Prepend a new changelog entry
    const today = new Date().toISOString().split('T')[0];
    const entry = `## [${next}] - ${today}\n\n### Changed\n- Version bumped from ${current} to ${next}\n\n---\n\n`;
    const changelog = await fs.readFile(changelogPath, 'utf8');
    const insertIdx = changelog.indexOf('## [');
    const updated = changelog.slice(0, insertIdx) + entry + changelog.slice(insertIdx);
    await fs.writeFile(changelogPath, updated, 'utf8');
    console.log(`  ✅ Updated: CHANGELOG.md  added [${next}] entry`);

    console.log(`
🎉 Version bumped: v${current} → v${next}`);
    console.log('💡 Don\'t forget to commit and tag: git tag v' + next);

  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
  } finally {
    rl.close();
  }
}

async function runDoctor() {
  console.log('\n🧬 Vibes-Plug Doctor — Running diagnostics...\n');
  const checks = [];

  // 1. Node.js version
  const nodeVersion = process.versions.node;
  const nodeMajor = parseInt(nodeVersion.split('.')[0], 10);
  checks.push(nodeMajor >= 18
    ? `✅ Node.js v${nodeVersion} (>= 18 required)`
    : `❌ Node.js v${nodeVersion} is too old. Please upgrade to v18+`);

  // 2. npx available
  try {
    const { execSync } = await import('child_process');
    execSync('npx --version', { stdio: 'pipe' });
    checks.push('✅ npx is available');
  } catch {
    checks.push('❌ npx not found. Install Node.js from https://nodejs.org');
  }

  // 3. Global skills directory
  const skillsDir = path.join(PLUGIN_ROOT, 'skills');
  try {
    const entries = await fs.readdir(skillsDir, { withFileTypes: true });
    const count = entries.filter(d => d.isDirectory()).length;
    checks.push(`✅ Global skills registry: ${count} skills found`);
  } catch {
    checks.push('❌ Skills directory missing! Run: npm install -g vibes-plug');
  }

  // 4. @inquirer/prompts installed
  try {
    await import('@inquirer/prompts');
    checks.push('✅ @inquirer/prompts is installed (vibes ui works)');
  } catch {
    checks.push(`⚠️  @inquirer/prompts not found. Run: cd ${PLUGIN_ROOT} && npm install`);
  }

  // 5. Local project .agents/skills
  const localAgentsDir = path.join(process.cwd(), '.agents', 'skills');
  const localExists = await fs.access(localAgentsDir).then(() => true).catch(() => false);
  if (localExists) {
    const localEntries = await fs.readdir(localAgentsDir, { withFileTypes: true });
    const localCount = localEntries.filter(d => d.isDirectory()).length;
    checks.push(`✅ Local project: ${localCount} skill(s) installed in .agents/skills/`);
  } else {
    checks.push('ℹ️  No local .agents/skills/ found (run vibes add or vibes ui to install skills)');
  }

  // 6. Package version
  const pkgPath = path.join(PLUGIN_ROOT, 'package.json');
  const pkgRaw = await fs.readFile(pkgPath, 'utf8');
  const pkg = JSON.parse(pkgRaw);
  checks.push(`📦 vibes-plug version: v${pkg.version}`);

  checks.forEach(c => console.log('  ' + c));

  const failed = checks.filter(c => c.startsWith('  ❌')).length;
  console.log(failed > 0
    ? `\n🚨 ${failed} issue(s) found. Fix them above and re-run: vibes doctor`
    : '\n🎉 All checks passed! Your Vibes-Plug environment is healthy.');

  rl.close();
}

async function runSkillInfo(skillName) {
  if (!skillName) {
    console.error('❌ Error: Skill name is required.');
    console.log('Usage: vibes skill info <skill-name>');
    process.exit(1);
  }

  const skillPath = path.join(PLUGIN_ROOT, 'skills', skillName, 'SKILL.md');
  try {
    const content = await fs.readFile(skillPath, 'utf8');

    // Parse frontmatter
    const fmMatch = content.match(/---[\r\n]+([\s\S]*?)[\r\n]+---/);
    if (!fmMatch) {
      console.error(`❌ Skill '${skillName}' has no frontmatter.`);
      process.exit(1);
    }

    const fm = fmMatch[1];
    const get = (key) => { const m = fm.match(new RegExp(`${key}:\\s*["']?([^"'\\n]+)["']?`)); return m ? m[1].trim() : 'N/A'; };

    const name = get('name');
    const version = get('version');
    const description = get('description');
    const author = get('author');

    // Extract orchestration section
    const orchMatch = content.match(/## (?:Orchestration & Integration|Integrasi Orkestrasi)[\r\n]+([\s\S]*?)(?=\n##|$)/);
    const orchText = orchMatch ? orchMatch[1].trim().split('\n').slice(0, 5).join('\n') : 'N/A';

    // Check local installation status
    const localPath = path.join(process.cwd(), '.agents', 'skills', skillName);
    const isLocal = await fs.access(localPath).then(() => true).catch(() => false);

    console.log(`\n📖 ${name} (v${version})`);
    console.log(`📝 ${description}`);
    console.log(`👤 Author : ${author}`);
    console.log(`📍 Status : ${isLocal ? '✅ Installed locally (.agents/skills/)' : '❌ Not installed in this project'}`);
    console.log(`\n🔗 Orchestration:`);
    console.log(orchText);
    console.log(`\n💡 To install: vibes add ${skillName}`);

  } catch {
    console.error(`❌ Skill '${skillName}' not found in the global registry.`);
    console.log('Run "vibes list" to see all available skills.');
  } finally {
    rl.close();
  }
}

async function runHooks(action) {
  const gitDir = path.join(process.cwd(), '.git');
  const hookPath = path.join(gitDir, 'hooks', 'pre-commit');

  const gitExists = await fs.access(gitDir).then(() => true).catch(() => false);
  if (!gitExists) {
    console.error('❌ No .git directory found. Run this command inside a git repository.');
    process.exit(1);
  }

  try {
    if (!action || action === 'install') {
      const hookContent = `#!/bin/sh
# Installed by vibes-plug — Anti-AI Slop pre-commit gate
echo "🔍 Running Vibes Anti-Slop Audit..."
node "${path.join(PLUGIN_ROOT, 'scripts', 'check-anti-slop.mjs')}" || exit 1
`;
      await fs.mkdir(path.join(gitDir, 'hooks'), { recursive: true });
      await fs.writeFile(hookPath, hookContent, { mode: 0o755 });
      console.log('\n\u2705 Git pre-commit hook installed!');
      console.log('🛡️  Anti-Slop Audit will now run automatically before every commit.');
      console.log(`📂 Hook location: ${hookPath}`);

    } else if (action === 'remove') {
      const exists = await fs.access(hookPath).then(() => true).catch(() => false);
      if (!exists) {
        console.log('ℹ️  No vibes pre-commit hook found to remove.');
      } else {
        await fs.rm(hookPath, { force: true });
        console.log('✅ Git pre-commit hook removed.');
      }
    } else {
      console.error('❌ Usage: vibes hooks install  OR  vibes hooks remove');
      process.exit(1);
    }
  } catch (err) {
    console.error(`❌ Error managing hooks: ${err.message}`);
  } finally {
    rl.close();
  }
}

// Built-in skill recipes (curated bundles)
const RECIPES = {
  'ai-stack': {
    description: 'Full AI/LLM integration stack with RAG, vector DB, and agent orchestration',
    skills: ['ai-llm-integration-expert', 'vector-db-rag-expert', 'vercel-ai-sdk-expert', 'ai-prompt-engineering-expert', 'multi-agent-orchestration']
  },
  'fullstack-pro': {
    description: 'Production-grade fullstack: Next.js 15, auth, DB, payments, testing',
    skills: ['nextjs-app-router-expert', 'authentication-identity-expert', 'database-orm-expert', 'payment-gateway-expert', 'e2e-testing-expert', 'error-resilience-expert']
  },
  'security-hardened': {
    description: 'Security-first stack: zero-trust, rate limiting, auth, GDPR compliance',
    skills: ['zero-trust-secret-vault', 'rate-limit-abuse-prevention', 'authentication-identity-expert', 'compliance-gdpr-privacy-expert', 'autonomous-red-teamer', 'supabase-security-expert']
  },
  'realtime-app': {
    description: 'Real-time collaboration: WebSockets, SSE, CRDTs, streaming',
    skills: ['realtime-collaboration-expert', 'sse-websocket-streaming-expert', 'state-management-expert', 'error-resilience-expert']
  },
  'mobile-first': {
    description: 'Mobile app stack: Expo, offline-first PWA, push notifications',
    skills: ['mobile-expo-expert', 'pwa-offline-first-expert', 'authentication-identity-expert', 'api-design-expert', 'email-notification-expert']
  },
  'data-platform': {
    description: 'Data engineering: ETL pipelines, visualization, telemetry, analytics',
    skills: ['data-pipeline-etl-expert', 'data-visualization-expert', 'data-telemetry-expert', 'search-engine-expert']
  },
  'agentic-commerce': {
    description: 'Autonomous M2M Agentic Commerce: micro-economies, DOKU Checkout & SNAP BI, dual-rail settlement, and SaaS billing',
    skills: ['agentic-micro-economy-architect', 'agentic-m2m-settlement', 'doku-payment-gateway', 'doku-mcp-server', 'saas-billing', 'payment-gateway-expert', 'formal-spec-z3-verifier']
  },
  'frontier-ai': {
    description: 'Frontier AI engineering: Gemini 4 Pro / Claude 5.1, KV-cache locking, model cascading, test-time compute, and MCP servers',
    skills: ['frontier-ai-models-expert', 'gemini-agent-booster', 'mcp-server-architect', 'kv-cache-prefix-optimizer', 'adaptive-model-cascade', 'test-time-compute-optimizer']
  },
  'spec-driven-api': {
    description: 'Contract-first API engineering: TypeSpec, OpenAPI 3.1, BDD Gherkin, consumer-driven Pact contracts, and API drift healing',
    skills: ['spec-driven-development-expert', 'openapi-swagger-codegen-expert', 'api-design-expert', 'autonomous-api-drift-healer', 'formal-spec-z3-verifier', 'e2e-testing-expert']
  }
};

async function runRecipe(action, recipeName) {
  if (!action || action === 'list') {
    console.log('\n\ud83e\uddc9 Available Vibes-Plug Recipes:\n');
    for (const [name, { description, skills }] of Object.entries(RECIPES)) {
      console.log(`  \x1b[36m${name}\x1b[0m`);
      console.log(`    ${description}`);
      console.log(`    Skills (${skills.length}): ${skills.join(', ')}\n`);
    }
    console.log('Usage: vibes recipe apply <recipe-name>');
    rl.close();
    return;
  }

  if (action === 'apply') {
    if (!recipeName) {
      console.error('\u274c Error: Recipe name required.');
      console.log('Usage: vibes recipe apply <recipe-name>');
      console.log('Run "vibes recipe list" to see available recipes.');
      process.exit(1);
    }

    const recipe = RECIPES[recipeName];
    if (!recipe) {
      console.error(`\u274c Recipe '${recipeName}' not found.`);
      console.log(`Available: ${Object.keys(RECIPES).join(', ')}`);
      process.exit(1);
    }

    console.log(`\n\ud83e\uddc9 Applying recipe: ${recipeName}`);
    console.log(`\ud83d\udcdd ${recipe.description}\n`);

    const targetAgentsDir = path.join(process.cwd(), '.agents', 'skills');
    await fs.mkdir(targetAgentsDir, { recursive: true });

    let installed = 0, skipped = 0;
    for (const skill of recipe.skills) {
      const sourceDir = path.join(PLUGIN_ROOT, 'skills', skill);
      const targetDir = path.join(targetAgentsDir, skill);
      const alreadyInstalled = await fs.access(targetDir).then(() => true).catch(() => false);
      if (alreadyInstalled) {
        console.log(`  \u23ed\ufe0f Already installed: ${skill}`);
        skipped++;
      } else {
        const exists = await fs.access(sourceDir).then(() => true).catch(() => false);
        if (exists) {
          await fs.cp(sourceDir, targetDir, { recursive: true });
          console.log(`  \u2705 Installed: ${skill}`);
          installed++;
        } else {
          console.warn(`  \u26a0\ufe0f  Not found in registry: ${skill}`);
        }
      }
    }

    console.log(`\n\ud83c\udf89 Recipe '${recipeName}' applied! ${installed} new, ${skipped} already installed.`);
    console.log('\ud83d\udca1 Ask your AI agent to read the injected skills and begin development.');

  } else {
    console.error('\u274c Usage: vibes recipe list  OR  vibes recipe apply <name>');
    process.exit(1);
  }

  rl.close();
}

async function runSearch(query) {
  if (!query) {
    console.error('\u274c Error: Search query required.');
    console.log('Usage: vibes search <query>');
    process.exit(1);
  }

  const skillsDir = path.join(PLUGIN_ROOT, 'skills');
  const entries = await fs.readdir(skillsDir, { withFileTypes: true });
  const skills = entries.filter(d => d.isDirectory()).map(d => d.name);

  const q = query.toLowerCase();
  const safeQ = escapeRegExp(q);
  const results = [];

  for (const skill of skills) {
    const skillMdPath = path.join(skillsDir, skill, 'SKILL.md');
    try {
      const content = await fs.readFile(skillMdPath, 'utf8');
      const lower = content.toLowerCase();
      // Score by keyword frequency
      const score = (lower.match(new RegExp(safeQ, 'g')) || []).length;
      if (score > 0) {
        // Extract description from frontmatter
        const descMatch = content.match(/description:\s*["']?([^"'\n]{10,120})/);
        const desc = descMatch ? descMatch[1].trim() : '';
        results.push({ skill, score, desc });
      }
    } catch { /* skip unreadable */ }
  }

  results.sort((a, b) => b.score - a.score);

  if (results.length === 0) {
    console.log(`\n\ud83d\udd0d No skills found matching "${query}".`);
    console.log('Try: vibes list  to browse all 155 skills.');
  } else {
    console.log(`\n\ud83d\udd0d Found ${results.length} skill(s) matching "${query}":\n`);
    results.slice(0, 10).forEach(({ skill, score, desc }) => {
      console.log(`  \x1b[36m${skill}\x1b[0m  (relevance: ${score})`);
      if (desc) console.log(`    ${desc.slice(0, 100)}`);
    });
    if (results.length > 10) console.log(`  ... and ${results.length - 10} more. Use "vibes list" to see all.`);
  }

  rl.close();
}

async function runSync() {
  console.log('\n🔄 Vibes-Plug Master Synchronizer (Pemicu Utama)...');
  console.log('Verifying primary trigger configuration and cross-skill synchronization...\n');

  const skillsDir = path.join(PLUGIN_ROOT, 'skills');
  let skillCount = 0;
  try {
    const entries = await fs.readdir(skillsDir, { withFileTypes: true });
    skillCount = entries.filter(e => e.isDirectory()).length;
  } catch (e) {
    console.error(`❌ Could not read skills dir: ${e.message}`);
  }

  console.log(`  ✅ Global Registry: ${skillCount} skills detected.`);

  // Check platforms entry points
  const checkFiles = [
    { name: 'Antigravity (AGENTS.md)', file: path.join(PLUGIN_ROOT, 'AGENTS.md') },
    { name: 'Claude Code (CLAUDE.md)', file: path.join(PLUGIN_ROOT, 'CLAUDE.md') },
    { name: 'Cursor IDE (.cursorrules)', file: path.join(PLUGIN_ROOT, '.cursorrules') },
    { name: 'OpenAI Codex (CODEX.md)', file: path.join(PLUGIN_ROOT, 'CODEX.md') },
    { name: 'Cursor Rules (.cursor/rules/vibes-plug-core.mdc)', file: path.join(PLUGIN_ROOT, '.cursor', 'rules', 'vibes-plug-core.mdc') },
    { name: 'Claude Rules (.claude/rules/vibes-plug-core.md)', file: path.join(PLUGIN_ROOT, '.claude', 'rules', 'vibes-plug-core.md') },
    { name: 'Codex Rules (.codex/rules/vibes-plug-core.md)', file: path.join(PLUGIN_ROOT, '.codex', 'rules', 'vibes-plug-core.md') }
  ];

  for (const item of checkFiles) {
    try {
      const content = await fs.readFile(item.file, 'utf8');
      const hasTrigger = content.includes('PRIMARY TRIGGER') || content.includes('Pemicu Utama');
      if (hasTrigger) {
        console.log(`  ✅ ${item.name}: Primary Trigger active & configured.`);
      } else {
        console.log(`  ⚠️  ${item.name}: Missing Primary Trigger directive.`);
      }
    } catch {
      console.log(`  ℹ️  ${item.name}: Not found.`);
    }
  }

  // Check master orchestrators
  const brainPath = path.join(skillsDir, 'brainstorming', 'SKILL.md');
  const ztpPath = path.join(skillsDir, 'zero-to-prod-orchestrator', 'SKILL.md');
  const hasBrain = await fs.access(brainPath).then(() => true).catch(() => false);
  const hasZtp = await fs.access(ztpPath).then(() => true).catch(() => false);

  if (hasBrain && hasZtp) {
    console.log(`  ✅ Master Orchestrators: brainstorming & zero-to-prod-orchestrator synchronized.`);
  } else {
    console.log(`  ⚠️  Master Orchestrators: check missing files.`);
  }

  console.log('\n⚡ Vibes-Plug is operational as the PRIMARY TRIGGER (Pemicu Utama).');
  console.log('   All 155 skills automatically synchronize when the user submits any coding prompt.\n');
  rl.close();
}

async function runDocs(format = 'markdown', outputFile) {
  try {
    const skillsDir = path.join(PLUGIN_ROOT, 'skills');
    const entries = await fs.readdir(skillsDir, { withFileTypes: true });
    const skillDirs = entries.filter(e => e.isDirectory()).map(e => e.name).sort();

    const catalog = [];
    for (const skillName of skillDirs) {
      const skillPath = path.join(skillsDir, skillName, 'SKILL.md');
      try {
        const content = await fs.readFile(skillPath, 'utf8');
        const descMatch = content.match(/description:\s*["']?([^"'\n\r]+)/);
        const versionMatch = content.match(/version:\s*["']?([^"'\n\r]+)/);
        const authorMatch = content.match(/author:\s*["']?([^"'\n\r]+)/);
        catalog.push({
          name: skillName,
          description: descMatch ? descMatch[1].trim() : '',
          version: versionMatch ? versionMatch[1].trim() : '4.3.0',
          author: authorMatch ? authorMatch[1].trim() : 'Roedy Rustam'
        });
      } catch (e) {
        // Skip unreadable files
      }
    }

    if (format === 'json') {
      const jsonOutput = JSON.stringify({ total: catalog.length, skills: catalog }, null, 2);
      if (outputFile) {
        await fs.writeFile(outputFile, jsonOutput, 'utf8');
        console.log(`\n📄 Exported JSON catalog of ${catalog.length} skills to: ${outputFile}`);
      } else {
        console.log(jsonOutput);
      }
    } else {
      let md = `# Vibes-Plug Skills Catalog (${catalog.length} Skills)\n\n`;
      md += `*Universal AI Agent Swarm Architecture (v4.3.0)*\n\n`;
      md += `| Skill Name | Version | Description |\n`;
      md += `| :--- | :---: | :--- |\n`;
      for (const item of catalog) {
        md += `| \`${item.name}\` | \`${item.version}\` | ${item.description.replace(/\\/g, '\\\\').replace(/\|/g, '\\|')} |\n`;
      }

      if (outputFile) {
        await fs.writeFile(outputFile, md, 'utf8');
        console.log(`\n📄 Exported Markdown catalog of ${catalog.length} skills to: ${outputFile}`);
      } else {
        console.log(`\n🌊 Vibes-Plug Skills Catalog (${catalog.length} Skills)\n`);
        console.log(`| Skill Name | Version | Description |`);
        console.log(`| :--- | :---: | :--- |`);
        catalog.slice(0, 15).forEach(item => {
          console.log(`| \`${item.name}\` | \`${item.version}\` | ${item.description.slice(0, 70)}... |`);
        });
        console.log(`\n... and ${catalog.length - 15} more skills.`);
        console.log(`\n💡 To export full catalog: vibes docs markdown CATALOG.md  OR  vibes docs json CATALOG.json`);
      }
    }
  } catch (err) {
    console.error(`\n❌ Error generating docs: ${err.message}`);
  } finally {
    rl.close();
  }
}

function showHelp() {
  console.log(`
🌊 Vibes-Plug CLI (v4.3.0)
The ultimate AI Swarm Orchestrator tool.

Usage:
  vibes <command> [options]

Commands:
  sync                      Verify and synchronize primary trigger & cross-skill orchestration
  init <project-name>       Scaffold a new zero-to-prod 8-Phase project structure
  bootstrap <type> <name>   Super-scaffold a project + AI Skills (saas | ecommerce | mobile | api | fullstack | spec-api)
  ui                        Launch the interactive TUI to visually select and install skills
  list [filter]             List all available skills (optional: filter by keyword)
  search <query>            Search all 155 skills by keyword (ranked by relevance)
  add <skill-name>          Inject a skill from the global registry into your local project
  remove <skill-name>       Remove an installed skill from your local project (.agents/skills)
  skill info <skill-name>   Show metadata, description, and orchestration info for a skill
  recipe list               List all built-in skill bundles/recipes
  recipe apply <name>       Apply a recipe bundle to your project (ai-stack, fullstack-pro, ...)
  create-skill <skill-name> Scaffold a new skill using the standard template (kebab-case)
  create-mcp <server-name>  Scaffold a new Model Context Protocol (MCP) server
  version current           Show current version
  version bump <type>       Bump version across all files (type: major | minor | patch)
  hooks install             Install Git pre-commit Anti-Slop gate
  hooks remove              Remove the Git pre-commit hook
  doctor                    Run environment health diagnostics
  audit                     Run the strict Anti-AI Slop quality gate check
  critic <file>             Run deep Critic-in-the-Loop audit on code/PRD before commit
  visual-audit <file>       Audit UI code or screenshot image against Pillar 7 & generate vision rubric
  cache [status|compile]    Inspect prompt cache hit rate, token economics, or recompile prefix
  compile-cache             Compile and lock deterministic KV-Cache prefix (>1024 tokens)
  db:eval [file|--sql]      Evaluate and simulate SQL DDL migrations in-memory
  ast <action> [args]       Query AST symbols, inspect code, or blast-radius
  arbitrate [fileA] [fileB] Score and arbitrate competing code drafts (P4 PRM)
  verify-invariants [file]  Verify state machine transitions & invariants (P5 SMT)
  swarm [task] [--reasoning <speed|balanced|deep|exhaustive>] Execute or plan autonomous swarm with dynamic thinking budget
  memory <action> [args]    Episodic project memory & ultra-compact checkpoints (record, query, checkpoint)
  mcp                       Start the native Model Context Protocol (MCP) server on stdio
  guard                     Run full Sovereign Guard (P1–P5 + Anti-Slop CI validation)
  validate                  Run the strict skill ecosystem validation check
  docs [markdown|json]      Export or preview the complete 155-skill ecosystem catalog
  studio [--port <n>]       Launch local web Studio Cockpit dashboard (visual 155-skill explorer)
  help                      Show this help menu
`);
  rl.close();
}

// Main Router
switch (command) {
  case 'sync':
    runSync();
    break;
  case 'mcp':
  case 'serve-mcp': {
    rl.close();
    const { spawn } = await import('child_process');
    const extraArgs = args.slice(1);
    const child = spawn(process.execPath, [path.join(PLUGIN_ROOT, 'bin', 'mcp-server.mjs'), ...extraArgs], { stdio: 'inherit' });
    child.on('exit', (code) => process.exit(code || 0));
    break;
  }
  case 'guard': {
    rl.close();
    const { execFileSync } = await import('child_process');
    console.log('🛡️ Running full Sovereign Guard validation...');
    execFileSync(process.execPath, ['scripts/validate-skills.mjs'], { stdio: 'inherit', cwd: PLUGIN_ROOT });
    execFileSync(process.execPath, ['scripts/check-anti-slop.js', '--strict'], { stdio: 'inherit', cwd: PLUGIN_ROOT });
    execFileSync(process.execPath, ['--test', 'scripts/test-cli.mjs'], { stdio: 'inherit', cwd: PLUGIN_ROOT });
    break;
  }
  case 'cache': {
    rl.close();
    const subCmd = args[1];
    if (subCmd === 'compile') {
      const { compileCache } = await import('../scripts/compile-cache.mjs');
      await compileCache();
    } else {
      const { getCacheStatus } = await import('../scripts/compile-cache.mjs');
      const status = await getCacheStatus();
      console.log(`
╔══════════════════════════════════════════════════════════╗
║    Vibes-Plug Deterministic Prompt Cache Status          ║
╚══════════════════════════════════════════════════════════╝

📦 Artifact File    : .cache-prefix.json (${status.byteSize} bytes)
🔢 Estimated Tokens : ~${status.estimatedTokens} tokens (${status.totalSkills} skills indexed)
⚡ TTFT Acceleration: ${status.economics.estimatedTtfSpeedup}

Platform Eligibility & Economics:
  • Anthropic Claude : ${status.platforms.claude.eligible ? '✅ QUALIFIED' : '⚠️ BELOW THRESHOLD'} (90% discount — saves $${status.economics.claudeSavingsPer1k}/1k reqs)
  • Google Gemini    : ${status.platforms.gemini.eligible ? '✅ QUALIFIED' : '⚠️ BELOW THRESHOLD'} (75% discount — saves $${status.economics.geminiSavingsPer1k}/1k reqs)
  • OpenAI Codex / o3: ${status.platforms.openai.eligible ? '✅ QUALIFIED' : '⚠️ BELOW THRESHOLD'} (50% discount — saves $${status.economics.openAiSavingsPer1k}/1k reqs)

💡 Baseline Input Cost (1k reqs un-cached) : $${status.economics.standardCostPer1kReqs}
🚀 To recompile: vibes cache compile
`);
    }
    break;
  }
  case 'compile-cache': {
    const { spawnSync } = await import('child_process');
    spawnSync(process.execPath, [path.join(PLUGIN_ROOT, 'scripts', 'compile-cache.mjs'), ...args.slice(1)], { stdio: 'inherit', cwd: PLUGIN_ROOT });
    rl.close();
    break;
  }
  case 'db:eval': {
    const { spawnSync } = await import('child_process');
    spawnSync(process.execPath, [path.join(PLUGIN_ROOT, 'scripts', 'eval-migration.mjs'), ...args.slice(1)], { stdio: 'inherit', cwd: PLUGIN_ROOT });
    rl.close();
    break;
  }
  case 'ast': {
    const { spawnSync } = await import('child_process');
    spawnSync(process.execPath, [path.join(PLUGIN_ROOT, 'scripts', 'ast-query.mjs'), ...args.slice(1)], { stdio: 'inherit', cwd: PLUGIN_ROOT });
    rl.close();
    break;
  }
  case 'arbitrate': {
    const { spawnSync } = await import('child_process');
    spawnSync(process.execPath, [path.join(PLUGIN_ROOT, 'scripts', 'speculative-arbiter.mjs'), ...args.slice(1)], { stdio: 'inherit', cwd: PLUGIN_ROOT });
    rl.close();
    break;
  }
  case 'verify-invariants': {
    const { spawnSync } = await import('child_process');
    spawnSync(process.execPath, [path.join(PLUGIN_ROOT, 'scripts', 'verify-invariants.mjs'), ...args.slice(1)], { stdio: 'inherit', cwd: PLUGIN_ROOT });
    rl.close();
    break;
  }
  case 'swarm': {
    const { spawnSync } = await import('child_process');
    spawnSync(process.execPath, [path.join(PLUGIN_ROOT, 'scripts', 'swarm-runner.mjs'), ...args.slice(1)], { stdio: 'inherit', cwd: PLUGIN_ROOT });
    rl.close();
    break;
  }
  case 'memory': {
    const { spawnSync } = await import('child_process');
    spawnSync(process.execPath, [path.join(PLUGIN_ROOT, 'scripts', 'memory-daemon.mjs'), ...args.slice(1)], { stdio: 'inherit', cwd: PLUGIN_ROOT });
    rl.close();
    break;
  }
  case 'init':
    runInit(args[1]);
    break;
  case 'bootstrap':
    runBootstrap(args[1], args[2]);
    break;
  case 'ui':
    runUi();
    break;
  case 'list':
    runListSkills(args[1]);
    break;
  case 'search':
    runSearch(args[1]);
    break;
  case 'add':
    runAddSkill(args[1]);
    break;
  case 'remove':
    runRemoveSkill(args[1]);
    break;
  case 'recipe':
    runRecipe(args[1], args[2]);
    break;
  case 'version':
    runVersion(args[1], args[2]);
    break;
  case 'doctor':
    runDoctor();
    break;
  case 'skill':
    runSkillInfo(args[2]);
    break;
  case 'hooks':
    runHooks(args[1]);
    break;
  case 'create-skill':
    runCreateSkill(args[1]);
    break;
  case 'create-mcp':
    runCreateMcp(args[1]);
    break;
  case 'create-agent': {
    const { spawnSync } = await import('child_process');
    spawnSync(process.execPath, [path.join(PLUGIN_ROOT, 'scripts', 'create-agent.mjs'), ...args.slice(1)], { stdio: 'inherit', cwd: PLUGIN_ROOT });
    rl.close();
    break;
  }
  case 'critic': {
    const { spawnSync } = await import('child_process');
    spawnSync(process.execPath, [path.join(PLUGIN_ROOT, 'scripts', 'critic-validator.mjs'), ...args.slice(1)], { stdio: 'inherit', cwd: PLUGIN_ROOT });
    rl.close();
    break;
  }
  case 'visual-audit':
  case 'visual-critic': {
    const { visualAudit } = await import('../scripts/visual-critic.mjs');
    const targetPath = args[1];
    if (!targetPath) {
      console.error('❌ Error: Target file or code is required.');
      console.log('Usage: vibes visual-audit <file-or-image>');
      process.exit(1);
    }
    const report = visualAudit(targetPath);
    console.log('\n🎨 === Vibes-Plug Visual UI Audit Report ===');
    console.log(`Target     : ${report.targetFile || 'inline_code'}`);
    console.log(`Score      : ${report.score}/100`);
    console.log(`Verdict    : ${report.verdict === 'APPROVED' ? '\x1b[32mAPPROVED\x1b[0m' : '\x1b[31mREJECTED\x1b[0m'}`);
    console.log(`Findings   : ${report.findingsCount}`);
    if (report.findings?.length > 0) {
      console.log('\nFindings:');
      for (const f of report.findings) {
        console.log(`  - [${f.severity}] ${f.ruleName}: ${f.message}`);
        console.log(`    Fix: ${f.fix}`);
      }
    }
    if (report.visionPrompt) {
      console.log('\n' + report.visionPrompt);
    }
    rl.close();
    break;
  }
  case 'audit':
  case 'anti-slop':
    runAudit();
    break;
  case 'validate':
    runValidate();
    break;
  case 'docs':
  case 'catalog':
    runDocs(args[1], args[2]);
    break;
  case 'studio': {
    rl.close();
    const studioModuleUrl = pathToFileURL(path.join(PLUGIN_ROOT, 'scripts', 'studio-server.mjs')).href;
    const { startStudioServer } = await import(studioModuleUrl);
    const portIdx = args.indexOf('--port');
    const port = portIdx !== -1 ? parseInt(args[portIdx + 1], 10) : 3888;
    const noOpen = args.includes('--no-open');
    await startStudioServer({ port, noOpen });
    break;
  }
  default:
    showHelp();
    break;
}

