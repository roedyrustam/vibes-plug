#!/usr/bin/env node

/**
 * Vibes-Plug Pre-Publish Tarball Audit & Supply-Chain Integrity Verifier
 *
 * Ensures published npm tarballs contain zero unexpected binaries, shell installers,
 * secret files, or lifecycle hooks, and optionally generates/verifies SHA-256
 * integrity manifests for `skills/` and `scripts/`.
 *
 * Usage:
 *   node scripts/audit-tarball.mjs [--json] [--write-manifest] [--verify-manifest]
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');

const FORBIDDEN_LIFECYCLE_HOOKS = new Set([
  'preinstall',
  'install',
  'postinstall',
  'preuninstall',
  'postuninstall'
]);

const FORBIDDEN_FILE_PATTERNS = [
  { name: 'shell_installer', regex: /(^|\/)install\.(sh|ps1)$/i },
  { name: 'env_secret', regex: /(^|\/)\.env(\.|$)/i },
  { name: 'private_key', regex: /\.(pem|key|p12|pfx)$/i },
  { name: 'native_binary', regex: /\.(exe|dll|so|dylib)$/i },
  { name: 'python_bytecode', regex: /(^|\/)__pycache__(\/|$)|\.(pyc|pyo)$/i },
  { name: 'git_metadata', regex: /(^|\/)\.git(\/|$)/i },
  { name: 'node_modules', regex: /(^|\/)node_modules(\/|$)/i }
];

function extractLastJsonArray(stdout) {
  const trimmed = stdout.trim();
  if (trimmed.startsWith('[')) {
    return JSON.parse(trimmed);
  }
  const match = trimmed.match(/\r?\n(\[[\s\S]*\])\s*$/);
  if (match) {
    return JSON.parse(match[1]);
  }
  const start = trimmed.indexOf('[');
  const end = trimmed.lastIndexOf(']');
  if (start === -1 || end <= start) {
    throw new Error('npm pack --dry-run --json did not return a JSON array');
  }
  return JSON.parse(trimmed.slice(start, end + 1));
}

export function validatePackageScripts(scriptsObj = {}) {
  const violations = [];
  for (const hook of Object.keys(scriptsObj)) {
    if (FORBIDDEN_LIFECYCLE_HOOKS.has(hook)) {
      violations.push({ type: 'lifecycle_hook', key: hook, value: scriptsObj[hook] });
    }
  }
  return violations;
}

export function validatePackedFiles(files = []) {
  const violations = [];
  for (const file of files) {
    const filePath = typeof file === 'string' ? file : file.path;
    for (const rule of FORBIDDEN_FILE_PATTERNS) {
      if (rule.regex.test(filePath)) {
        violations.push({ type: rule.name, path: filePath });
      }
    }
  }
  return violations;
}

async function hashFileSha256(filePath) {
  const buf = await fs.readFile(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

export async function generateIntegrityManifest(rootDir = PLUGIN_ROOT) {
  const entries = {};

  const skillsDir = path.join(rootDir, 'skills');
  const skillDirs = await fs.readdir(skillsDir, { withFileTypes: true }).catch(() => []);
  for (const d of skillDirs.sort((a, b) => a.name.localeCompare(b.name))) {
    if (!d.isDirectory()) continue;
    const skillFile = path.join(skillsDir, d.name, 'SKILL.md');
    try {
      entries[`skills/${d.name}/SKILL.md`] = await hashFileSha256(skillFile);
    } catch {
      // Skip directories without SKILL.md
    }
  }

  const scriptsDir = path.join(rootDir, 'scripts');
  const scriptFiles = await fs.readdir(scriptsDir, { withFileTypes: true }).catch(() => []);
  for (const f of scriptFiles.sort((a, b) => a.name.localeCompare(b.name))) {
    if (!f.isFile() || (!f.name.endsWith('.mjs') && !f.name.endsWith('.js'))) continue;
    entries[`scripts/${f.name}`] = await hashFileSha256(path.join(scriptsDir, f.name));
  }

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    fileCount: Object.keys(entries).length,
    sha256: entries
  };
}

export async function verifyIntegrityManifest(manifestPath, rootDir = PLUGIN_ROOT) {
  const saved = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  const current = await generateIntegrityManifest(rootDir);
  const mismatches = [];

  for (const [relPath, expectedHash] of Object.entries(saved.sha256 || {})) {
    const actualHash = current.sha256[relPath];
    if (!actualHash) {
      mismatches.push({ path: relPath, reason: 'missing' });
    } else if (actualHash !== expectedHash) {
      mismatches.push({ path: relPath, reason: 'hash_mismatch' });
    }
  }

  for (const relPath of Object.keys(current.sha256)) {
    if (!(relPath in (saved.sha256 || {}))) {
      mismatches.push({ path: relPath, reason: 'untracked_new_file' });
    }
  }

  return { passed: mismatches.length === 0, mismatches, checkedFiles: current.fileCount };
}

export async function auditTarball(options = {}) {
  const rootDir = options.rootDir || PLUGIN_ROOT;
  const pkgPath = path.join(rootDir, 'package.json');
  const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8'));

  const scriptViolations = validatePackageScripts(pkg.scripts);

  const npmBin = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const { stdout } = await execFileAsync(npmBin, ['pack', '--dry-run', '--json'], {
    cwd: rootDir,
    shell: process.platform === 'win32',
    maxBuffer: 20 * 1024 * 1024
  });

  const packInfo = extractLastJsonArray(stdout)[0];
  const packedFiles = packInfo?.files || [];
  const fileViolations = validatePackedFiles(packedFiles);

  const violations = [...scriptViolations, ...fileViolations];
  return {
    passed: violations.length === 0,
    packageName: pkg.name,
    version: pkg.version,
    entryCount: packInfo?.entryCount ?? packedFiles.length,
    packedSizeBytes: packInfo?.size ?? 0,
    unpackedSizeBytes: packInfo?.unpackedSize ?? 0,
    violations
  };
}

async function main() {
  const args = process.argv.slice(2);
  const isJson = args.includes('--json');
  const writeManifest = args.includes('--write-manifest');
  const verifyManifest = args.includes('--verify-manifest');

  const manifestPath = path.join(PLUGIN_ROOT, '.agents', 'security', 'integrity-manifest.json');
  const report = await auditTarball();

  if (writeManifest) {
    const manifest = await generateIntegrityManifest();
    await fs.mkdir(path.dirname(manifestPath), { recursive: true });
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
    report.manifestWritten = { path: manifestPath, fileCount: manifest.fileCount };
  }

  if (verifyManifest) {
    report.integrityVerification = await verifyIntegrityManifest(manifestPath);
    if (!report.integrityVerification.passed) {
      report.passed = false;
    }
  }

  if (isJson) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`\n🛡️  Vibes-Plug Pre-Publish Tarball Audit (${report.packageName}@${report.version})`);
    console.log('------------------------------------------------------------');
    console.log(`Packed Files   : ${report.entryCount}`);
    console.log(`Tarball Size   : ${(report.packedSizeBytes / 1024).toFixed(1)} KB`);
    console.log(`Unpacked Size  : ${(report.unpackedSizeBytes / 1024).toFixed(1)} KB`);
    console.log(`Violations     : ${report.violations.length}`);
    if (report.manifestWritten) {
      console.log(`Integrity File : ${report.manifestWritten.path} (${report.manifestWritten.fileCount} files hashed)`);
    }
    if (report.integrityVerification) {
      console.log(`Integrity Check: ${report.integrityVerification.passed ? 'PASSED' : 'FAILED'} (${report.integrityVerification.mismatches.length} mismatch(es))`);
    }
    if (!report.passed) {
      console.error('\n❌ Audit failed with violations:');
      for (const v of report.violations) {
        console.error(`  - [${v.type}] ${v.path || v.key}`);
      }
    } else {
      console.log('\n✅ Tarball audit PASSED: Zero forbidden files or lifecycle hooks.\n');
    }
  }

  if (!report.passed) {
    process.exit(1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main().catch(err => {
    console.error(`❌ Tarball audit error: ${err.message}`);
    process.exit(1);
  });
}
