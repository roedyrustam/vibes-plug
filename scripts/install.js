#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const PLUGIN_ROOT = path.resolve(__dirname, '..');
const HOME = os.homedir();

// Platform detection and target directories
const platforms = {
    antigravity: {
        name: 'Antigravity (AGY)',
        globalDir: path.join(HOME, '.gemini', 'config', 'plugins', 'vibes-plug'),
        detect: () => fs.existsSync(path.join(HOME, '.gemini')),
    },
    claude: {
        name: 'Claude Code',
        globalDir: path.join(HOME, '.claude'),
        detect: () => {
            return fs.existsSync(path.join(HOME, '.claude'));
        },
    },
    cursor: {
        name: 'Cursor IDE',
        projectOnly: true,
        detect: () => {
            return true;
        },
    },
    codex: {
        name: 'OpenAI Codex CLI',
        globalDir: path.join(HOME, '.codex'),
        detect: () => fs.existsSync(path.join(HOME, '.codex')),
    },
    windsurf: {
        name: 'Windsurf (Codeium)',
        globalDir: path.join(HOME, '.codeium', 'windsurf'),
        detect: () => fs.existsSync(path.join(HOME, '.codeium', 'windsurf')) || fs.existsSync(path.join(HOME, '.windsurf')),
    },
    cline: {
        name: 'Cline / Roo Code',
        detect: () => fs.existsSync(path.join(HOME, '.cline')) || fs.existsSync(path.join(HOME, '.roo-cline')),
    },
    trae: {
        name: 'Trae IDE',
        detect: () => fs.existsSync(path.join(HOME, '.trae')),
    },
    kimi: {
        name: 'Kimi CLI',
        detect: () => fs.existsSync(path.join(HOME, '.kimi')),
    },
    kiro: {
        name: 'Kiro CLI',
        detect: () => fs.existsSync(path.join(HOME, '.kiro')),
    },
};

const DEFAULT_EXCLUDES = new Set(['.git', 'node_modules', 'vibes-plug']);

function copyRecursiveSync(src, dest, excludes = DEFAULT_EXCLUDES) {
    const stat = fs.lstatSync(src);
    if (stat.isSymbolicLink()) {
        return;
    }
    if (stat.isDirectory()) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach(child => {
            if (excludes && excludes.has(child)) return;
            copyRecursiveSync(path.join(src, child), path.join(dest, child), excludes);
        });
    } else if (stat.isFile()) {
        fs.copyFileSync(src, dest);
    }
}

function mergeMcpConfigFile(destPath, incomingServers) {
    let existingMcp = { mcpServers: {} };
    if (fs.existsSync(destPath)) {
        try {
            existingMcp = JSON.parse(fs.readFileSync(destPath, 'utf8'));
        } catch (err) {
            console.warn(`  ⚠️ Could not parse existing MCP config (${destPath}): ${err.message}`);
            existingMcp = { mcpServers: {} };
        }
        if (!existingMcp || typeof existingMcp !== 'object') existingMcp = { mcpServers: {} };
        if (!existingMcp.mcpServers || typeof existingMcp.mcpServers !== 'object') {
            existingMcp.mcpServers = {};
        }
    }
    Object.assign(existingMcp.mcpServers, incomingServers);
    fs.writeFileSync(destPath, JSON.stringify(existingMcp, null, 2), 'utf8');
}

function installForAntigravity() {
    const target = platforms.antigravity.globalDir;
    if (path.resolve(PLUGIN_ROOT) === path.resolve(target)) {
        console.log('  ✅ Already installed at correct location.');
        return;
    }
    console.log(`  📁 Copying to ${target}`);
    copyRecursiveSync(PLUGIN_ROOT, target);
    console.log('  ✅ Done.');
}

function installForClaude(projectDir) {
    const globalClaudeDir = platforms.claude.globalDir;
    if (!fs.existsSync(globalClaudeDir)) {
        fs.mkdirSync(globalClaudeDir, { recursive: true });
    }

    const claudeMdSrc = path.join(PLUGIN_ROOT, 'CLAUDE.md');
    const claudeMdDest = path.join(globalClaudeDir, 'CLAUDE.md');
    if (fs.existsSync(claudeMdSrc)) {
        fs.copyFileSync(claudeMdSrc, claudeMdDest);
        console.log(`  ✅ Copied CLAUDE.md → ${claudeMdDest}`);
    }

    const rulesDir = path.join(PLUGIN_ROOT, '.claude', 'rules');
    const targetRulesDir = path.join(globalClaudeDir, 'rules');
    if (fs.existsSync(rulesDir)) {
        copyRecursiveSync(rulesDir, targetRulesDir);
        console.log(`  ✅ Copied rules → ${targetRulesDir}`);
    }

    const skillsSrc = path.join(PLUGIN_ROOT, 'skills');
    const skillsDest = path.join(globalClaudeDir, 'skills');
    if (fs.existsSync(skillsSrc)) {
        copyRecursiveSync(skillsSrc, skillsDest);
        console.log(`  ✅ Copied skills → ${skillsDest}`);
    }

    if (projectDir) {
        const projClaude = path.join(projectDir, '.claude');
        if (!fs.existsSync(projClaude)) fs.mkdirSync(projClaude, { recursive: true });
        fs.copyFileSync(claudeMdSrc, path.join(projectDir, 'CLAUDE.md'));
        copyRecursiveSync(rulesDir, path.join(projClaude, 'rules'));
        console.log(`  ✅ Per-project install → ${projectDir}`);
    }
}

function installForCursor(projectDir) {
    const targetDir = projectDir ? path.resolve(projectDir) : process.cwd();
    console.log(`  🎯 Target project: ${targetDir}`);

    // 1. Copy .cursorrules to project root
    const cursorRulesSrc = path.join(PLUGIN_ROOT, '.cursorrules');
    const cursorRulesDest = path.join(targetDir, '.cursorrules');
    if (fs.existsSync(cursorRulesSrc)) {
        fs.copyFileSync(cursorRulesSrc, cursorRulesDest);
        console.log(`  ✅ Copied .cursorrules → ${cursorRulesDest}`);
    }

    // 2. Copy .cursor/rules/ to project
    const mdcSrc = path.join(PLUGIN_ROOT, '.cursor', 'rules');
    const mdcDest = path.join(targetDir, '.cursor', 'rules');
    if (fs.existsSync(mdcSrc)) {
        copyRecursiveSync(mdcSrc, mdcDest);
        console.log(`  ✅ Copied .cursor/rules/ (*.mdc) → ${mdcDest}`);
    }

    // 3. Configure .cursor/mcp.json (non-destructive merge)
    const cursorMcpDir = path.join(targetDir, '.cursor');
    if (!fs.existsSync(cursorMcpDir)) fs.mkdirSync(cursorMcpDir, { recursive: true });
    const cursorMcpDest = path.join(cursorMcpDir, 'mcp.json');
    const mcpServers = {
        "vibes-plug-tools": {
            command: process.execPath,
            args: [path.join(PLUGIN_ROOT, 'bin', 'mcp-server.mjs')]
        },
        "xerj": {
            command: "xerj",
            args: ["mcp"],
            env: {
                "XERJ_URL": "http://localhost:9200"
            }
        }
    };
    mergeMcpConfigFile(cursorMcpDest, mcpServers);
    console.log(`  ✅ Configured .cursor/mcp.json → ${cursorMcpDest}`);

    // 4. Copy skills/ for reference in .cursor/skills
    const skillsSrc = path.join(PLUGIN_ROOT, 'skills');
    const skillsDest = path.join(targetDir, '.cursor', 'skills');
    if (fs.existsSync(skillsSrc)) {
        copyRecursiveSync(skillsSrc, skillsDest);
        console.log(`  ✅ Copied skills → ${skillsDest}`);
    }

    // 5. Global Cursor configuration if ~/.cursor exists
    const globalCursorDir = path.join(HOME, '.cursor');
    if (fs.existsSync(globalCursorDir)) {
        const globalRulesDir = path.join(globalCursorDir, 'rules');
        if (fs.existsSync(mdcSrc)) {
            copyRecursiveSync(mdcSrc, globalRulesDir);
            console.log(`  🌐 Copied global Cursor rules → ${globalRulesDir}`);
        }
        const globalMcpDest = path.join(globalCursorDir, 'mcp.json');
        mergeMcpConfigFile(globalMcpDest, mcpServers);
        console.log(`  🌐 Updated global Cursor MCP config → ${globalMcpDest}`);
    }
}

function installForCodex(projectDir) {
    const globalCodexDir = platforms.codex.globalDir;
    if (!fs.existsSync(globalCodexDir)) {
        fs.mkdirSync(globalCodexDir, { recursive: true });
    }

    const codexMdSrc = path.join(PLUGIN_ROOT, 'CODEX.md');
    const codexMdDest = path.join(globalCodexDir, 'CODEX.md');
    if (fs.existsSync(codexMdSrc)) {
        fs.copyFileSync(codexMdSrc, codexMdDest);
        console.log(`  ✅ Copied CODEX.md → ${codexMdDest}`);
    }

    const rulesDir = path.join(PLUGIN_ROOT, '.codex', 'rules');
    const targetRulesDir = path.join(globalCodexDir, 'rules');
    if (fs.existsSync(rulesDir)) {
        copyRecursiveSync(rulesDir, targetRulesDir);
        console.log(`  ✅ Copied rules → ${targetRulesDir}`);
    }

    const skillsSrc = path.join(PLUGIN_ROOT, 'skills');
    const skillsDest = path.join(globalCodexDir, 'skills');
    if (fs.existsSync(skillsSrc)) {
        copyRecursiveSync(skillsSrc, skillsDest);
        console.log(`  ✅ Copied skills → ${skillsDest}`);
    }

    if (projectDir) {
        const projCodex = path.join(projectDir, '.codex');
        if (!fs.existsSync(projCodex)) fs.mkdirSync(projCodex, { recursive: true });
        if (fs.existsSync(codexMdSrc)) {
            fs.copyFileSync(codexMdSrc, path.join(projectDir, 'CODEX.md'));
        }
        if (fs.existsSync(rulesDir)) {
            copyRecursiveSync(rulesDir, path.join(projCodex, 'rules'));
        }
        console.log(`  ✅ Per-project install → ${projectDir}`);
    }
}

function installForWindsurf(projectDir) {
    const targetDir = projectDir ? path.resolve(projectDir) : process.cwd();
    const rulesSrc = path.join(PLUGIN_ROOT, '.windsurfrules');
    const rulesDest = path.join(targetDir, '.windsurfrules');
    if (fs.existsSync(rulesSrc)) {
        fs.copyFileSync(rulesSrc, rulesDest);
        console.log(`  ✅ Copied .windsurfrules → ${rulesDest}`);
    }
    const globalWindsurfDir = path.join(HOME, '.codeium', 'windsurf');
    if (fs.existsSync(globalWindsurfDir)) {
        const mcpDest = path.join(globalWindsurfDir, 'mcp_config.json');
        const mcpServers = {
            "vibes-plug-tools": {
                command: process.execPath,
                args: [path.join(PLUGIN_ROOT, 'bin', 'mcp-server.mjs')]
            },
            "xerj": {
                command: "xerj",
                args: ["mcp"],
                env: { "XERJ_URL": "http://localhost:9200" }
            }
        };
        mergeMcpConfigFile(mcpDest, mcpServers);
        console.log(`  🌐 Configured Windsurf MCP config → ${mcpDest}`);
    }
}

function installForCline(projectDir) {
    const targetDir = projectDir ? path.resolve(projectDir) : process.cwd();
    const rulesSrc = path.join(PLUGIN_ROOT, '.clinerules');
    const rulesDest = path.join(targetDir, '.clinerules');
    if (fs.existsSync(rulesSrc)) {
        fs.copyFileSync(rulesSrc, rulesDest);
        console.log(`  ✅ Copied .clinerules → ${rulesDest}`);
    }
}

function installForTrae(projectDir) {
    const targetDir = projectDir ? path.resolve(projectDir) : process.cwd();
    const rulesSrc = path.join(PLUGIN_ROOT, '.traerules');
    const rulesDest = path.join(targetDir, '.traerules');
    if (fs.existsSync(rulesSrc)) {
        fs.copyFileSync(rulesSrc, rulesDest);
        console.log(`  ✅ Copied .traerules → ${rulesDest}`);
    }
}

function installForKimi(projectDir) {
    const targetDir = projectDir ? path.resolve(projectDir) : process.cwd();
    const rulesSrc = path.join(PLUGIN_ROOT, '.kimirules');
    const rulesDest = path.join(targetDir, '.kimirules');
    if (fs.existsSync(rulesSrc)) {
        fs.copyFileSync(rulesSrc, rulesDest);
        console.log(`  ✅ Copied .kimirules → ${rulesDest}`);
    }
}

function installForKiro(projectDir) {
    const targetDir = projectDir ? path.resolve(projectDir) : process.cwd();
    const rulesSrc = path.join(PLUGIN_ROOT, '.kirorules');
    const rulesDest = path.join(targetDir, '.kirorules');
    if (fs.existsSync(rulesSrc)) {
        fs.copyFileSync(rulesSrc, rulesDest);
        console.log(`  ✅ Copied .kirorules → ${rulesDest}`);
    }
}

// --- CLI ---
function main() {
    const args = process.argv.slice(2);
    const helpFlag = args.includes('--help') || args.includes('-h');
    const allFlag = args.includes('--all');
    const agyFlag = args.includes('--antigravity') || args.includes('--agy');
    const claudeFlag = args.includes('--claude');
    const cursorFlag = args.includes('--cursor');
    const codexFlag = args.includes('--codex');
    const windsurfFlag = args.includes('--windsurf');
    const clineFlag = args.includes('--cline');
    const traeFlag = args.includes('--trae');
    const kimiFlag = args.includes('--kimi');
    const kiroFlag = args.includes('--kiro');
    const projectIdx = args.indexOf('--project');
    let projectDir = null;
    if (projectIdx !== -1) {
        const nextArg = args[projectIdx + 1];
        if (!nextArg || nextArg.startsWith('--')) {
            console.error('❌ Error: --project flag requires a target directory path.');
            process.exit(1);
        }
        projectDir = nextArg;
    }

    const pkg = require('../package.json');
    const version = pkg.version || '4.8.0';

    if (helpFlag || args.length === 0) {
        console.log(`
╔══════════════════════════════════════════════════════════╗
║       vibes-plug installer v${version.padEnd(6)} (2026 Edition)        ║
║   Universal AI Plugin for All Major AI IDE Platforms     ║
╚══════════════════════════════════════════════════════════╝

Usage: npx vibes-plug [options] or node install.js [options]

Options:
  --all                   Install for all detected platforms
  --antigravity, --agy    Install for Antigravity
  --claude                Install for Claude Code (global + optional per-project)
  --cursor                Install for Cursor IDE (requires --project or defaults to cwd)
  --codex                 Install for OpenAI Codex CLI (global + optional per-project)
  --windsurf              Install for Windsurf (rules + MCP)
  --cline                 Install for Cline / Roo Code
  --trae                  Install for Trae IDE
  --kimi                  Install for Kimi CLI
  --kiro                  Install for Kiro CLI
  --project <path>        Target project directory (for per-project rules installation)
  --help, -h              Show this help message

Examples:
  npx vibes-plug --all
  npx vibes-plug --claude
  npx vibes-plug --codex
  npx vibes-plug --cursor --project ./my-app
  npx vibes-plug --windsurf --project ./my-app
  node scripts/install.js --all
`);
        return;
    }

    console.log(`\n🚀 vibes-plug installer v${version}\n`);

    console.log('📡 Detecting platforms...');
    Object.entries(platforms).forEach(([key, p]) => {
        const detected = p.detect();
        console.log(`  ${detected ? '✅' : '❌'} ${p.name}: ${detected ? 'detected' : 'not found'}`);
    });
    console.log('');

    if (allFlag || agyFlag) {
        console.log('🔧 Installing for Antigravity...');
        installForAntigravity();
        console.log('');
    }

    if (allFlag || claudeFlag) {
        console.log('🔧 Installing for Claude Code...');
        installForClaude(projectDir);
        console.log('');
    }

    if (allFlag || cursorFlag) {
        console.log('🔧 Installing for Cursor IDE...');
        installForCursor(projectDir);
        console.log('');
    }

    if (allFlag || codexFlag) {
        console.log('🔧 Installing for OpenAI Codex CLI...');
        installForCodex(projectDir);
        console.log('');
    }

    if (allFlag || windsurfFlag) {
        console.log('🔧 Installing for Windsurf...');
        installForWindsurf(projectDir);
        console.log('');
    }

    if (allFlag || clineFlag) {
        console.log('🔧 Installing for Cline / Roo Code...');
        installForCline(projectDir);
        console.log('');
    }

    if (allFlag || traeFlag) {
        console.log('🔧 Installing for Trae IDE...');
        installForTrae(projectDir);
        console.log('');
    }

    if (allFlag || kimiFlag) {
        console.log('🔧 Installing for Kimi CLI...');
        installForKimi(projectDir);
        console.log('');
    }

    if (allFlag || kiroFlag) {
        console.log('🔧 Installing for Kiro CLI...');
        installForKiro(projectDir);
        console.log('');
    }

    console.log('✨ Installation complete!');
    console.log('⚡ Vibes-Plug is now configured as the PRIMARY TRIGGER (Pemicu Utama).');
    console.log('🔗 All 178 skills are automatically synchronized across all major AI IDE platforms!\n');

    try {
        const detectedPlatforms = Object.entries(platforms)
            .filter(([, p]) => p.detect())
            .map(([k]) => k);
        import('./telemetry.mjs').then(m => {
            m.sendTelemetry('installer_run', {
                version,
                installed_platforms: detectedPlatforms,
                flags: { allFlag, agyFlag, claudeFlag, cursorFlag, codexFlag, windsurfFlag, clineFlag, traeFlag, kimiFlag, kiroFlag }
            });
        }).catch(() => {});
    } catch {
        // Silently ignore
    }
}

main();
