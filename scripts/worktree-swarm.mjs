#!/usr/bin/env node
/**
 * scripts/worktree-swarm.mjs
 * Ephemeral Git Worktree Swarm Isolation Engine (v4.7.0)
 *
 * Provides isolated file sandboxes for parallel AI subagents:
 * - Allocates isolated Git worktrees under `.agents/worktrees/<worker-id>`
 * - Prevents cross-agent write collision, dirty workspace clobbering, and file locks
 * - Merges validated worker branches atomically back to main branch
 * - Cleans up worktrees and temporary branches upon completion
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');
const WORKTREES_ROOT = path.join(PLUGIN_ROOT, '.agents', 'worktrees');

export class WorktreeSwarmManager {
  constructor(baseDir = PLUGIN_ROOT) {
    this.baseDir = baseDir;
    this.worktreesRoot = path.join(baseDir, '.agents', 'worktrees');
  }

  /**
   * Executes a git command within the target directory
   * @param {string[]} args 
   * @param {string} [cwd]
   * @returns {Promise<{ stdout: string, stderr: string }>}
   */
  async git(args, cwd = this.baseDir) {
    try {
      return await execFileAsync('git', args, { cwd, maxBuffer: 10 * 1024 * 1024 });
    } catch (err) {
      const msg = err.stderr ? err.stderr.trim() : err.message;
      throw new Error(`Git command failed [git ${args.join(' ')}]: ${msg}`);
    }
  }

  /**
   * Verifies if the working directory is inside a valid git repository
   * @returns {Promise<boolean>}
   */
  async isGitRepo() {
    try {
      const { stdout } = await this.git(['rev-parse', '--is-inside-work-tree']);
      return stdout.trim() === 'true';
    } catch {
      return false;
    }
  }

  /**
   * Creates an isolated worktree for a specialized subagent
   * @param {string} workerId 
   * @param {string} [baseRef='HEAD']
   * @returns {Promise<{ success: boolean, worktreeDir: string, branch: string, workerId: string }>}
   */
  async createWorktree(workerId, baseRef = 'HEAD') {
    const sanitizedId = workerId.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
    const branchName = `vibes-worker/${sanitizedId}`;
    const worktreeDir = path.join(this.worktreesRoot, sanitizedId);

    await fs.mkdir(this.worktreesRoot, { recursive: true });

    // Clean up existing worktree or branch if lingering
    await this.removeWorktree(sanitizedId).catch(() => {});

    await this.git(['worktree', 'add', '-B', branchName, worktreeDir, baseRef]);

    return {
      success: true,
      workerId: sanitizedId,
      worktreeDir,
      branch: branchName
    };
  }

  /**
   * Lists all currently active vibes-plug worktrees
   * @returns {Promise<Array<{ worktree: string, head: string, branch: string, workerId: string }>>}
   */
  async listWorktrees() {
    if (!(await this.isGitRepo())) return [];

    const { stdout } = await this.git(['worktree', 'list', '--porcelain']);
    const blocks = stdout.trim().split('\n\n');
    const results = [];

    for (const block of blocks) {
      if (!block.trim()) continue;
      const lines = block.split('\n');
      let worktree = '';
      let head = '';
      let branch = '';

      for (const line of lines) {
        if (line.startsWith('worktree ')) worktree = line.slice(9).trim();
        else if (line.startsWith('HEAD ')) head = line.slice(5).trim();
        else if (line.startsWith('branch ')) branch = line.slice(7).trim();
      }

      if (worktree.includes(path.join('.agents', 'worktrees')) || branch.includes('vibes-worker/')) {
        const workerId = path.basename(worktree);
        results.push({ worktree, head, branch, workerId });
      }
    }

    return results;
  }

  /**
   * Merges worktree changes atomically back to target branch
   * @param {string} workerId 
   * @param {Object} [options]
   * @returns {Promise<{ success: boolean, merged: boolean, commitHash: string, workerId: string }>}
   */
  async mergeWorktree(workerId, options = {}) {
    const sanitizedId = workerId.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
    const branchName = `vibes-worker/${sanitizedId}`;
    const worktreeDir = path.join(this.worktreesRoot, sanitizedId);

    // 1. Commit uncommitted changes inside the worktree if any exist
    try {
      const { stdout: statusOut } = await this.git(['status', '--porcelain'], worktreeDir);
      if (statusOut.trim().length > 0) {
        await this.git(['add', '-A'], worktreeDir);
        const commitMsg = options.commitMessage || `feat(subagent-${sanitizedId}): automated synthesis from isolated worktree`;
        await this.git(['commit', '-m', commitMsg], worktreeDir);
      }
    } catch (statusErr) {
      throw new Error(`Failed to commit worker tree: ${statusErr.message}`);
    }

    // 2. Fetch commit hash of the worker branch
    const { stdout: revOut } = await this.git(['rev-parse', branchName]);
    const commitHash = revOut.trim();

    // 3. Merge into main repository working tree
    const targetBranch = options.targetBranch || 'HEAD';
    try {
      await this.git(['merge', '--no-ff', '-m', `merge(swarm): merge subagent worktree [${sanitizedId}]`, branchName]);
    } catch (mergeErr) {
      // Abort failed merge to preserve repository integrity
      await this.git(['merge', '--abort']).catch(() => {});
      throw new Error(`Merge conflict while integrating worker [${sanitizedId}]: ${mergeErr.message}`);
    }

    // 4. Cleanup worktree if requested (default true)
    if (options.cleanup !== false) {
      await this.removeWorktree(sanitizedId);
    }

    return {
      success: true,
      merged: true,
      commitHash,
      workerId: sanitizedId
    };
  }

  /**
   * Safely removes a worktree and its temporary branch
   * @param {string} workerId 
   * @returns {Promise<{ success: boolean, removed: boolean, workerId: string }>}
   */
  async removeWorktree(workerId) {
    const sanitizedId = workerId.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
    const branchName = `vibes-worker/${sanitizedId}`;
    const worktreeDir = path.join(this.worktreesRoot, sanitizedId);

    try {
      await this.git(['worktree', 'remove', '--force', worktreeDir]);
    } catch {
      // Directory removal fallback
      await fs.rm(worktreeDir, { recursive: true, force: true }).catch(() => {});
      await this.git(['worktree', 'prune']).catch(() => {});
    }

    // Delete temporary worker branch
    await this.git(['branch', '-D', branchName]).catch(() => {});

    return {
      success: true,
      removed: true,
      workerId: sanitizedId
    };
  }

  /**
   * Cleans up all lingering or stale worktrees
   * @returns {Promise<{ cleanedCount: number }>}
   */
  async cleanupAll() {
    const list = await this.listWorktrees();
    let cleanedCount = 0;

    for (const item of list) {
      await this.removeWorktree(item.workerId).catch(() => {});
      cleanedCount++;
    }

    await this.git(['worktree', 'prune']).catch(() => {});
    await fs.rm(this.worktreesRoot, { recursive: true, force: true }).catch(() => {});

    return { cleanedCount };
  }
}

export const worktreeSwarm = new WorktreeSwarmManager(PLUGIN_ROOT);

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'list';

  try {
    if (command === 'list') {
      const active = await worktreeSwarm.listWorktrees();
      console.log(`\n🌿 Vibes-Plug Ephemeral Swarm Worktrees (${active.length} active):\n`);
      if (active.length === 0) {
        console.log('  No isolated worktrees currently active.');
      } else {
        for (const item of active) {
          console.log(`  • Worker [${item.workerId}]: ${item.branch} -> ${item.worktree}`);
        }
      }
      return;
    }

    if (command === 'create') {
      const workerId = args[1];
      if (!workerId) {
        console.error('❌ Error: Worker ID required (e.g. vibes swarm:worktree create frontend-agent)');
        process.exit(1);
      }
      const res = await worktreeSwarm.createWorktree(workerId);
      console.log(`✅ Worktree created for [${res.workerId}]:\n   Dir:    ${res.worktreeDir}\n   Branch: ${res.branch}`);
      return;
    }

    if (command === 'merge') {
      const workerId = args[1];
      if (!workerId) {
        console.error('❌ Error: Worker ID required (e.g. vibes swarm:worktree merge frontend-agent)');
        process.exit(1);
      }
      const res = await worktreeSwarm.mergeWorktree(workerId);
      console.log(`✅ Worktree [${res.workerId}] merged successfully! Commit: ${res.commitHash}`);
      return;
    }

    if (command === 'remove') {
      const workerId = args[1];
      if (!workerId) {
        console.error('❌ Error: Worker ID required (e.g. vibes swarm:worktree remove frontend-agent)');
        process.exit(1);
      }
      const res = await worktreeSwarm.removeWorktree(workerId);
      console.log(`✅ Worktree [${res.workerId}] cleanly removed.`);
      return;
    }

    if (command === 'cleanup') {
      const res = await worktreeSwarm.cleanupAll();
      console.log(`🧹 Cleaned up ${res.cleanedCount} ephemeral worktree(s).`);
      return;
    }

    console.log('Usage: vibes swarm:worktree [list|create <id>|merge <id>|remove <id>|cleanup]');
  } catch (err) {
    console.error(`\n❌ Swarm Worktree Error: ${err.message}`);
    process.exit(1);
  }
}

if (process.argv[1] && process.argv[1].endsWith('worktree-swarm.mjs')) {
  main();
}

