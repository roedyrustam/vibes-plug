import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import os from 'node:os';

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLI_PATH = path.resolve(__dirname, '../bin/vibes.mjs');

test('Vibes-Plug CLI Test Suite', async (t) => {
  await t.test('vibes --help should output banner and commands', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, '--help']);
    assert.match(stdout, /Vibes-Plug CLI/);
    assert.match(stdout, /sync/);
    assert.match(stdout, /init/);
    assert.match(stdout, /doctor/);
    assert.match(stdout, /recipe/);
  });

  await t.test('vibes version current should return 4.2.2', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'version', 'current']);
    assert.match(stdout, /4\.2\.2/);
  });

  await t.test('vibes doctor should verify 150 skills and pass health checks', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'doctor']);
    assert.match(stdout, /Global skills registry: 150 skills found/);
    assert.match(stdout, /All checks passed/);
  });

  await t.test('vibes search settlement should find agentic-m2m-settlement', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'search', 'settlement']);
    assert.match(stdout, /agentic-m2m-settlement/);
  });

  await t.test('vibes search sidepanel should find browser-extension-mv3-pro', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'search', 'sidepanel']);
    assert.match(stdout, /browser-extension-mv3-pro/);
  });

  await t.test('vibes search spec should find spec-driven-development-expert', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'search', 'spec']);
    assert.match(stdout, /spec-driven-development-expert/);
  });

  await t.test('vibes recipe list should contain agentic-commerce, frontier-ai, and spec-driven-api', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'recipe', 'list']);
    assert.match(stdout, /agentic-commerce/);
    assert.match(stdout, /frontier-ai/);
    assert.match(stdout, /spec-driven-api/);
    assert.match(stdout, /ai-stack/);
  });

  await t.test('vibes skill info should display accurate metadata and orchestration', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'skill', 'info', 'spec-driven-development-expert']);
    assert.match(stdout, /spec-driven-development-expert/);
    assert.match(stdout, /Roedy Rustam/);
    assert.match(stdout, /openapi-swagger-codegen-expert/);
  });

  await t.test('vibes docs should generate 150-skill ecosystem preview', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'docs']);
    assert.match(stdout, /Vibes-Plug Skills Catalog \(150 Skills\)/);
    assert.match(stdout, /accessibility-testing-expert/);
  });

  await t.test('vibes bootstrap without args should list all templates including spec-api', async () => {
    try {
      await execFileAsync(process.execPath, [CLI_PATH, 'bootstrap']);
      assert.fail('Should have exited with code 1');
    } catch (err) {
      assert.match(err.stdout + err.stderr, /Available templates: saas, ecommerce, mobile, api, fullstack, spec-api/);
    }
  });

  await t.test('vibes init should generate concrete PRD, BLUEPRINT, and PROGRESS', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vibes-test-'));
    const testProjectName = 'test-sample-app';
    try {
      await execFileAsync(process.execPath, [CLI_PATH, 'init', testProjectName], { cwd: tempDir });
      const prdContent = await fs.readFile(path.join(tempDir, testProjectName, 'PRD.md'), 'utf-8');
      const blueprintContent = await fs.readFile(path.join(tempDir, testProjectName, 'BLUEPRINT.md'), 'utf-8');
      const progressContent = await fs.readFile(path.join(tempDir, testProjectName, 'PROGRESS.md'), 'utf-8');

      assert.match(prdContent, /Product Requirements Document \(PRD\)/);
      assert.match(prdContent, /PostgreSQL DDL/);
      assert.match(blueprintContent, /Architectural Topology/);
      assert.match(progressContent, /Phase 1: Discovery & PRD Architecture/);
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });
});
