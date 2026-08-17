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
            // Claude Code is installed if ~/.claude exists or `claude` command is available
            return fs.existsSync(path.join(HOME, '.claude'));
        },
    },
    cursor: {
        name: 'Cursor IDE',
        projectOnly: true,
        detect: () => {
            // Cursor uses per-project .cursor/rules/ — always available
            return true;
        },
    },
};

function copyRecursiveSync(src, dest) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach(child => {
            copyRecursiveSync(path.join(src, child), path.join(dest, child));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
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
    // Global: Copy CLAUDE.md to ~/.claude/CLAUDE.md (append or create)
    const globalClaudeDir = platforms.claude.globalDir;
    if (!fs.existsSync(globalClaudeDir)) {
        fs.mkdirSync(globalClaudeDir, { recursive: true });
    }

    // Copy CLAUDE.md
    const claudeMdSrc = path.join(PLUGIN_ROOT, 'CLAUDE.md');
    const claudeMdDest = path.join(globalClaudeDir, 'CLAUDE.md');
    if (fs.existsSync(claudeMdSrc)) {
        fs.copyFileSync(claudeMdSrc, claudeMdDest);
        console.log(`  ✅ Copied CLAUDE.md → ${claudeMdDest}`);
    }

    // Copy .claude/rules/
    const rulesDir = path.join(PLUGIN_ROOT, '.claude', 'rules');
    const targetRulesDir = path.join(globalClaudeDir, 'rules');
    if (fs.existsSync(rulesDir)) {
        copyRecursiveSync(rulesDir, targetRulesDir);
        console.log(`  ✅ Copied rules → ${targetRulesDir}`);
    }

    // Copy skills directory
    const skillsSrc = path.join(PLUGIN_ROOT, 'skills');
    const skillsDest = path.join(globalClaudeDir, 'skills');
    if (fs.existsSync(skillsSrc)) {
        copyRecursiveSync(skillsSrc, skillsDest);
        console.log(`  ✅ Copied skills → ${skillsDest}`);
    }

    // Per-project install
    if (projectDir) {
        const projClaude = path.join(projectDir, '.claude');
        if (!fs.existsSync(projClaude)) fs.mkdirSync(projClaude, { recursive: true });
        fs.copyFileSync(claudeMdSrc, path.join(projectDir, 'CLAUDE.md'));
        copyRecursiveSync(rulesDir, path.join(projClaude, 'rules'));
        console.log(`  ✅ Per-project install → ${projectDir}`);
    }
}

function installForCursor(projectDir) {
    if (!projectDir) {
        console.log('  ⚠️  Cursor requires a project directory. Usage: node install.js --cursor --project /path/to/project');
        return;
    }

    // Copy .cursorrules to project root
    const cursorRulesSrc = path.join(PLUGIN_ROOT, '.cursorrules');
    const cursorRulesDest = path.join(projectDir, '.cursorrules');
    if (fs.existsSync(cursorRulesSrc)) {
        fs.copyFileSync(cursorRulesSrc, cursorRulesDest);
        console.log(`  ✅ Copied .cursorrules → ${cursorRulesDest}`);
    }

    // Copy .cursor/rules/ to project
    const mdcSrc = path.join(PLUGIN_ROOT, '.cursor', 'rules');
    const mdcDest = path.join(projectDir, '.cursor', 'rules');
    if (fs.existsSync(mdcSrc)) {
        copyRecursiveSync(mdcSrc, mdcDest);
        console.log(`  ✅ Copied .cursor/rules/ → ${mdcDest}`);
    }

    // Copy skills/ for reference
    const skillsSrc = path.join(PLUGIN_ROOT, 'skills');
    const skillsDest = path.join(projectDir, '.cursor', 'skills');
    if (fs.existsSync(skillsSrc)) {
        copyRecursiveSync(skillsSrc, skillsDest);
        console.log(`  ✅ Copied skills → ${skillsDest}`);
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
    const projectIdx = args.indexOf('--project');
    const projectDir = projectIdx !== -1 ? args[projectIdx + 1] : null;

    if (helpFlag || args.length === 0) {
        console.log(`
╔══════════════════════════════════════════════════════════╗
║       vibes-plug installer v2.6.0 (2026 Edition)        ║
║    Universal AI Plugin for AGY, Claude, and Cursor       ║
╚══════════════════════════════════════════════════════════╝

Usage: node install.js [options]

Options:
  --all                   Install for all detected platforms
  --antigravity, --agy    Install for Antigravity
  --claude                Install for Claude Code (global + optional per-project)
  --cursor                Install for Cursor IDE (requires --project)
  --project <path>        Target project directory (for Claude/Cursor per-project install)
  --help, -h              Show this help message

Examples:
  node install.js --all
  node install.js --claude
  node install.js --cursor --project ./my-app
  node install.js --claude --cursor --project ./my-app
`);
        return;
    }

    console.log('\n🚀 vibes-plug installer v2.5.0\n');

    // Detect platforms
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

    console.log('✨ Installation complete!\n');
}

main();
