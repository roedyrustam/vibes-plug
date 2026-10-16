import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

  await t.test('vibes doctor should verify 149 skills and pass health checks', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'doctor']);
    assert.match(stdout, /Global skills registry: 149 skills found/);
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

  await t.test('vibes recipe list should contain agentic-commerce and frontier-ai', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'recipe', 'list']);
    assert.match(stdout, /agentic-commerce/);
    assert.match(stdout, /frontier-ai/);
    assert.match(stdout, /ai-stack/);
  });

  await t.test('vibes skill info should display accurate metadata and orchestration', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'skill', 'info', 'browser-extension-mv3-pro']);
    assert.match(stdout, /browser-extension-mv3-pro/);
    assert.match(stdout, /Roedy Rustam/);
    assert.match(stdout, /senior-frontend/);
  });
});
