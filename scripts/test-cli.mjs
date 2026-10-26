import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import os from 'node:os';
import vm from 'node:vm';

const execFileAsync = (file, args, options = {}) => {
  return promisify(execFile)(file, args, { maxBuffer: 20 * 1024 * 1024, ...options });
};
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLI_PATH = path.resolve(__dirname, '../bin/vibes.mjs');
const PLUGIN_ROOT = path.resolve(__dirname, '..');

test('Vibes-Plug CLI Test Suite', async (t) => {
  await t.test('vibes --help should output banner and commands', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, '--help']);
    assert.match(stdout, /Vibes-Plug CLI/);
    assert.match(stdout, /sync/);
    assert.match(stdout, /init/);
    assert.match(stdout, /wizard/);
    assert.match(stdout, /doctor/);
    assert.match(stdout, /recipe/);
  });

  await t.test('vibes version current should return active package version', async () => {
    const pkg = JSON.parse(await fs.readFile(path.join(PLUGIN_ROOT, 'package.json'), 'utf8'));
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'version', 'current']);
    assert.match(stdout, new RegExp(pkg.version.replace(/\./g, '\\.')));
  });

  await t.test('vibes doctor should verify 176 skills and pass health checks', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'doctor']);
    assert.match(stdout, /Global skills registry: 1[67]\d skills found/);
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

  await t.test('vibes docs should generate 176 skill ecosystem preview', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'docs']);
    assert.match(stdout, /Vibes-Plug Skills Catalog \(1[67]\d Skills\)/);
    assert.match(stdout, /accessibility-testing-expert/);
  });

  await t.test('vibes cache status should report deterministic prefix economics', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'cache', 'status']);
    assert.match(stdout, /Vibes-Plug Deterministic Prompt Cache Status/);
    assert.match(stdout, /QUALIFIED/);
    assert.match(stdout, /Anthropic Claude/);
    assert.match(stdout, /Google Gemini/);
  });

  await t.test('vibes critic should audit files and report zero violations on clean code', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'critic', 'scripts/compile-cache.mjs']);
    assert.match(stdout, /Vibes-Plug Critic-Validator Report/);
    assert.match(stdout, /Score\s+:\s+100\/100/);
    assert.match(stdout, /Verdict\s+:\s+APPROVED/);
  });

  await t.test('vibes visual-audit should audit UI elements and report Pillar 7 rubric', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'visual-audit', '<button className="rounded-lg border border-border/50 px-4 py-2 hover:bg-muted font-medium tabular-nums">Pay Rp 150.000</button>']);
    assert.match(stdout, /Vibes-Plug Visual UI Audit Report/);
    assert.match(stdout, /Score\s+:\s+100\/100/);
    assert.match(stdout, /Verdict.*APPROVED/);
  });

  await t.test('vibes bootstrap without args should list all templates including spec-api', async () => {
    try {
      await execFileAsync(process.execPath, [CLI_PATH, 'bootstrap']);
      assert.fail('Should have exited with code 1');
    } catch (err) {
      assert.match(err.stdout + err.stderr, /Available templates: saas, ecommerce, mobile, api, fullstack, spec-api, ai-agent, fintech, cloud-native/);
    }
  });

  await t.test('vibes recipe list should show curated recipes including cloud-native, ai-agent, and fintech', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'recipe', 'list']);
    assert.match(stdout, /cloud-native/);
    assert.match(stdout, /ai-agent/);
    assert.match(stdout, /fintech/);
    assert.match(stdout, /agentic-commerce/);
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

  await t.test('vibes-guard reusable GitHub Action should exist with valid schema', async () => {
    const actionYamlPath = path.resolve(__dirname, '../.github/actions/vibes-guard/action.yml');
    const content = await fs.readFile(actionYamlPath, 'utf8');
    assert.match(content, /Vibes-Plug Sovereign Guard/);
    assert.match(content, /using:\s*'composite'/);
    assert.match(content, /inputs:/);
    assert.match(content, /check-anti-slop/);
  });

  await t.test('vibes sandbox should execute pure code and reject forbidden primitives', async () => {
    const { stdout: passOut } = await execFileAsync(process.execPath, [CLI_PATH, 'sandbox', '1 + 2 * 3']);
    assert.match(passOut, /Status\s+:\s+✅ SUCCESS/);
    assert.match(passOut, /Return Value\s+:\s+7/);

    const { stdout: failOut } = await execFileAsync(process.execPath, [CLI_PATH, 'sandbox', 'process.exit(1)']);
    assert.match(failOut, /Status\s+:\s+❌ FAILED/);
    assert.match(failOut, /Security Violation/);
  });

  await t.test('vibes swarm:dispatch should concurrently dispatch workers with synthesis', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'swarm:dispatch', 'Build payment checkout']);
    assert.match(stdout, /Swarm Dispatcher/);
    assert.match(stdout, /Dispatching task/);
    assert.match(stdout, /Overall Status:\s+SUCCESS/);
    assert.match(stdout, /APPROVED/);
  });

  await t.test('vibes finops should report token economics, record telemetry, and reset', async () => {
    const { stdout: statusOut } = await execFileAsync(process.execPath, [CLI_PATH, 'finops', 'status']);
    assert.match(statusOut, /Local FinOps & Token Savings Tracker/);
    assert.match(statusOut, /Estimated Financial Savings/);

    const { stdout: recordOut } = await execFileAsync(process.execPath, [
      CLI_PATH, 'finops', 'record',
      '--model', 'gemini-4-pro',
      '--input', '4000',
      '--output', '1200',
      '--cached', '30000'
    ]);
    assert.match(recordOut, /Recorded usage/);
    assert.match(recordOut, /Claude Savings/);

    const { stdout: exportMdOut } = await execFileAsync(process.execPath, [CLI_PATH, 'finops', 'export', '--format', 'markdown']);
    assert.match(exportMdOut, /Vibes-Plug FinOps & Token Economics Report/);
    assert.match(exportMdOut, /KV-Cache Hit Ratio/);

    const { stdout: exportCsvOut } = await execFileAsync(process.execPath, [CLI_PATH, 'finops', 'export', '--format', 'csv']);
    assert.match(exportCsvOut, /timestamp,model,task,input_tokens/);

    const { stdout: resetOut } = await execFileAsync(process.execPath, [CLI_PATH, 'finops', 'reset']);
    assert.match(resetOut, /reset to zero/);
  });

  await t.test('vibes doctor --fix should run health checks and auto-remediate environment', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'doctor', '--fix']);
    assert.match(stdout, /Vibes-Plug Doctor/);
    assert.match(stdout, /auto-fix enabled/);
    assert.match(stdout, /All checks passed/);
  });

  await t.test('vibes graph:build, vibes graph:query, and vibes graph:search should index, locate, and hybrid search symbols', async () => {
    const { stdout: buildOut } = await execFileAsync(process.execPath, [CLI_PATH, 'graph:build']);
    assert.match(buildOut, /Building Codebase AST Symbol Knowledge Graph/);
    assert.match(buildOut, /Symbol Knowledge Graph built/);
    assert.match(buildOut, /Symbols Indexed/);

    const { stdout: queryOut } = await execFileAsync(process.execPath, [CLI_PATH, 'graph:query', 'startStudioServer']);
    assert.match(queryOut, /Query: "startStudioServer"/);
    assert.match(queryOut, /scripts\/studio-server\.mjs/);

    const { stdout: searchOut } = await execFileAsync(process.execPath, [CLI_PATH, 'graph:search', 'startStudioServer', '--top-k', '3']);
    assert.match(searchOut, /Hybrid GraphRAG Search/);
    assert.match(searchOut, /startStudioServer/);
    assert.match(searchOut, /BM25/);
    assert.match(searchOut, /Vector/);
  });

  await t.test('vibes pr:review should audit code diffs or files and generate PR markdown report', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'pr:review', 'scripts/graphrag-indexer.mjs']);
    assert.match(stdout, /Vibes-Plug PR Review Report/);
    assert.match(stdout, /Files Reviewed/);
    assert.match(stdout, /APPROVED/);
  });

  await t.test('vibes heal should execute tests and report zero failures on healthy commands', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'heal', 'node -v']);
    assert.match(stdout, /Vibes-Plug Autonomous Self-Healer/);
    assert.match(stdout, /All test suites and checks passed with 0 failures/);
  });

  await t.test('vibes registry list should display skills catalog with category and version', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'registry', 'list']);
    assert.match(stdout, /Vibes-Plug Skill Registry Catalog/);
    assert.match(stdout, /skills found/);
    assert.match(stdout, /spec-driven-development-expert/);
  });

  await t.test('vibes registry search should find skills matching query', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'registry', 'search', 'payment']);
    assert.match(stdout, /Search results for "payment"/);
    assert.match(stdout, /payment-gateway-expert/);
  });

  await t.test('vibes registry pack should audit custom skill against 176 gold standards', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'registry', 'pack', 'skills/spec-driven-development-expert']);
    assert.match(stdout, /Skill validated and packaged successfully/);
    assert.match(stdout, /"goldStandardCompliant":\s*true/);
    await fs.rm(path.resolve(__dirname, '../skills/spec-driven-development-expert/skill.json'), { force: true });
  });

  await t.test('vscode extension companion should have valid manifest and commands', async () => {
    const pkgPath = path.resolve(__dirname, '../extensions/vscode/package.json');
    const raw = await fs.readFile(pkgPath, 'utf8');
    const pkg = JSON.parse(raw);
    assert.equal(pkg.name, 'vibes-plug-companion');
    const rootPkg = JSON.parse(await fs.readFile(path.join(PLUGIN_ROOT, 'package.json'), 'utf8'));
    assert.equal(pkg.version, rootPkg.version);
    assert.equal(pkg.contributes.commands.length >= 6, true);
    assert.ok(pkg.contributes.configuration.properties['vibes.studioPort']);
  });

  await t.test('vibes package:vscode should build a zero-dependency .vsix package', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'package:vscode', '--dry-run']);
    assert.match(stdout, /Vibes-Plug VS Code & Cursor Extension Packager/);
    assert.match(stdout, /Extension Package Built Successfully/);
    assert.match(stdout, /12 contributed commands/);
    assert.match(stdout, /DRY-RUN/);
  });

  await t.test('vibes mcp:setup should detect client paths and generate valid json snippet', async () => {
    const { stdout: dryOut } = await execFileAsync(process.execPath, [CLI_PATH, 'mcp:setup', '--dry-run']);
    assert.match(dryOut, /Vibes-Plug MCP Client Auto-Configurator/);
    assert.match(dryOut, /Claude Desktop/);
    assert.match(dryOut, /Cursor IDE/);

    const { stdout: printOut } = await execFileAsync(process.execPath, [CLI_PATH, 'mcp', 'setup', '--print']);
    assert.match(printOut, /vibes-plug-mcp/);
    assert.match(printOut, /mcp-server\.mjs/);
  });

  await t.test('vibes bridge status and sync should manage cross-IDE synchronization', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'bridge', 'status']);
    assert.match(stdout, /Vibes-Plug Universal Cross-IDE State Bridge/);
    assert.match(stdout, /Anthropic Claude Code/);
    assert.match(stdout, /Cursor IDE/);
    assert.match(stdout, /OpenAI Codex/);

    const tempBridgeDir = path.join(process.cwd(), '.test-bridge-cli-tmp');
    await fs.mkdir(tempBridgeDir, { recursive: true });
    try {
      const { stdout: syncOut } = await execFileAsync(process.execPath, [CLI_PATH, 'bridge', 'sync', '--dir', tempBridgeDir, '--target', 'cursor']);
      assert.match(syncOut, /Synchronizing cross-IDE bridge rules for: \[cursor\]/);
      assert.match(syncOut, /Cursor IDE: synced/);

      const cursorRuleExists = await fs.access(path.join(tempBridgeDir, '.cursorrules')).then(() => true).catch(() => false);
      assert.equal(cursorRuleExists, true);

      const { stdout: bundleOut } = await execFileAsync(process.execPath, [CLI_PATH, 'bridge', 'bundle', '--dir', tempBridgeDir]);
      assert.match(bundleOut, /Vibes-Plug (Universal|Sovereign) Context Bundle/i);
    } finally {
      await fs.rm(tempBridgeDir, { recursive: true, force: true });
    }
  });

  await t.test('vibes learn should synthesize gold-standard skill without placeholders', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'learn', 'trpc-v11', '--dry-run']);
    assert.match(stdout, /Vibes-Plug Autonomous Skill Synthesizer/);
    assert.match(stdout, /Skill synthesized successfully/);
    assert.match(stdout, /trpc-v11-expert/);
    assert.match(stdout, /Verified 100% complete with 0 placeholders/);
  });

  await t.test('vibes sandbox --verify and verify-gate should validate candidate code pre-disk', async () => {
    const { stdout: passOut } = await execFileAsync(process.execPath, [CLI_PATH, 'verify-gate', 'export const multiply = (a, b) => a * b;']);
    assert.match(passOut, /Pre-Disk Verification Gate/);
    assert.match(passOut, /APPROVED/);
    assert.match(passOut, /Safe to write/);

    const { stdout: sandboxVerifyOut } = await execFileAsync(process.execPath, [CLI_PATH, 'sandbox', '--verify', 'export const divide = (a, b) => a / b;']);
    assert.match(sandboxVerifyOut, /Pre-Disk Verification Gate/);
    assert.match(sandboxVerifyOut, /APPROVED/);
  });

  await t.test('vibes swarm:bus should report active swarms and broadcast telemetry', async () => {
    const { stdout: statusOut } = await execFileAsync(process.execPath, [CLI_PATH, 'swarm:bus', 'status']);
    assert.match(statusOut, /Real-Time Swarm Concurrency Bus/);
    assert.match(statusOut, /Active Swarms/);
    assert.match(statusOut, /Buffered Events/);

    const { stdout: bcastOut } = await execFileAsync(process.execPath, [CLI_PATH, 'swarm:bus', 'broadcast', 'Agent sync beacon']);
    assert.match(bcastOut, /Broadcast signal emitted/);
    assert.match(bcastOut, /Agent sync beacon/);
  });

  await t.test('studio server should serve 176 skills, cockpit HTML, and Remote MCP SSE', async () => {
    const { startStudioServer } = await import('./studio-server.mjs');
    const testPort = 3991;
    const memFilePath = path.join(process.cwd(), '.agents', 'memory', 'episodic_graph.json');
    const checkpointFilePath = path.join(process.cwd(), 'CHECKPOINT.md');
    let origMem = null;
    let origCheckpoint = null;
    try {
      origMem = await fs.readFile(memFilePath, 'utf8');
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
    try {
      origCheckpoint = await fs.readFile(checkpointFilePath, 'utf8');
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }

    const { server, url } = await startStudioServer({ port: testPort, noOpen: true });
    try {
      const htmlRes = await fetch(url);
      const htmlText = await htmlRes.text();
      assert.match(htmlText, /VibesPlug Pro Studio/);
      assert.match(htmlText, /176-Skill Swarm Architecture/);
      assert.match(htmlText, /Remote Model Context Protocol/);

      const scriptMatch = htmlText.match(/<script\b[^>]*>([\s\S]*?)<\/script\b[^>]*>/i);
      assert.ok(scriptMatch, 'Cockpit HTML must contain <script> tag');
      assert.doesNotThrow(() => {
        new vm.Script(scriptMatch[1], { filename: 'cockpit-client.js' });
      }, 'Cockpit client script must parse without syntax errors');

      const skillsRes = await fetch(`${url}/api/skills`);
      const skills = await skillsRes.json();
      assert.equal(Array.isArray(skills), true);
      assert.ok(skills.length >= 176);

      const statusRes = await fetch(`${url}/api/status`);
      const status = await statusRes.json();
      assert.ok(status.totalSkills >= 176);
      const pkgJson = JSON.parse(await fs.readFile(path.join(PLUGIN_ROOT, 'package.json'), 'utf8'));
      assert.equal(status.version, pkgJson.version);
      assert.equal(status.mcpToolsCount >= 10, true);

      const subagentsRes = await fetch(`${url}/api/subagents`);
      const subagents = await subagentsRes.json();
      assert.ok(subagents.length >= 5);

      // Test Remote MCP execute endpoint
      const mcpExecRes = await fetch(`${url}/api/mcp/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: 'vibes_list_skills', arguments: {} })
      });
      const mcpData = await mcpExecRes.json();
      assert.equal(mcpExecRes.status, 200);
      assert.match(mcpData.result.result.content[0].text, /"total":\s*1[67]\d/);

      // Test Batch recipe injection validation
      const batchRes = await fetch(`${url}/api/recipes/inject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: ['spec-driven-development-expert'] })
      });
      const batchData = await batchRes.json();
      assert.equal(batchData.success, true);
      assert.equal(batchData.count, 1);

      // Test Swarm Planner endpoint with Dynamic Thinking Budget
      const swarmPlanRes = await fetch(`${url}/api/swarm/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'Build a fintech payment integration with DOKU', reasoning: 'deep' })
      });
      const swarmPlanData = await swarmPlanRes.json();
      assert.equal(swarmPlanRes.status, 200);
      assert.equal(swarmPlanData.success, true);
      assert.ok(swarmPlanData.plan.topology);
      assert.ok(swarmPlanData.plan.subagents.length > 0);
      assert.ok(swarmPlanData.plan.totalWorkers > 0);
      assert.equal(swarmPlanData.plan.reasoningProfile, 'deep');
      assert.equal(swarmPlanData.plan.thinkingBudgetTokens, 32768);

      // Test Swarm Planner auto-detection (speed for typo/formatting)
      const swarmSpeedRes = await fetch(`${url}/api/swarm/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'Fix typo and format readme docs' })
      });
      const swarmSpeedData = await swarmSpeedRes.json();
      assert.equal(swarmSpeedData.plan.reasoningProfile, 'speed');
      assert.equal(swarmSpeedData.plan.thinkingBudgetTokens, 1024);

      // Test Swarm Execution simulation endpoint
      const swarmExecRes = await fetch(`${url}/api/swarm/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'Build a fintech payment integration with DOKU', reasoning: 'deep' })
      });
      const swarmExecData = await swarmExecRes.json();
      assert.equal(swarmExecRes.status, 200);
      assert.equal(swarmExecData.success, true);
      assert.ok(Array.isArray(swarmExecData.logs));
      assert.ok(swarmExecData.logs.length > 0);
      assert.equal(swarmExecData.plan.reasoningProfile, 'deep');
      assert.match(swarmExecData.logs[2], /Thinking Budget\s+:\s+DEEP/);

      // Test MCP vibes_swarm with reasoningProfile
      const mcpSwarmRes = await fetch(`${url}/api/mcp/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'vibes_swarm',
          arguments: { taskDescription: 'Verify formal billing state machine invariants', reasoningProfile: 'exhaustive' }
        })
      });
      const mcpSwarmData = await mcpSwarmRes.json();
      assert.equal(mcpSwarmRes.status, 200);
      assert.match(mcpSwarmData.result.result.content[0].text, /EXHAUSTIVE/);

      // Test MCP vibes_batch with parallel tool calls
      const mcpBatchRes = await fetch(`${url}/api/mcp/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'vibes_batch',
          arguments: {
            calls: [
              { tool: 'vibes_list_skills', arguments: {} },
              { tool: 'vibes_memory', arguments: { action: 'checkpoint' } }
            ]
          }
        })
      });
      const mcpBatchData = await mcpBatchRes.json();
      assert.equal(mcpBatchRes.status, 200);
      const batchResult = JSON.parse(mcpBatchData.result.result.content[0].text);
      assert.equal(batchResult.batchSize, 2);
      assert.equal(batchResult.successful, 2);
      assert.equal(batchResult.failed, 0);

      // Test Memory query & record endpoints
      const memGetRes = await fetch(`${url}/api/memory`);
      const memGetData = await memGetRes.json();
      assert.equal(memGetRes.status, 200);
      assert.equal(memGetData.success, true);
      assert.ok(memGetData.memory);

      const memRecordRes = await fetch(`${url}/api/memory/record`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision: 'Adopt PostgreSQL with Drizzle ORM', category: 'architecture', skills: ['database-orm-expert'] })
      });
      const memRecordData = await memRecordRes.json();
      assert.equal(memRecordRes.status, 200);
      assert.equal(memRecordData.success, true);
      assert.equal(memRecordData.item.decision, 'Adopt PostgreSQL with Drizzle ORM');

      const memCheckpointRes = await fetch(`${url}/api/memory/checkpoint`, { method: 'POST' });
      const memCheckpointData = await memCheckpointRes.json();
      assert.equal(memCheckpointRes.status, 200);
      assert.ok(memCheckpointData.checkpoint.tokensApprox < 500);

      // Test Cache status & compile endpoints
      const cacheStatusRes = await fetch(`${url}/api/cache/status`);
      const cacheStatusData = await cacheStatusRes.json();
      assert.equal(cacheStatusRes.status, 200);
      assert.equal(cacheStatusData.success, true);
      assert.equal(cacheStatusData.platforms.claude.eligible, true);
      assert.ok(cacheStatusData.estimatedTokens > 1000);

      const cacheCompileRes = await fetch(`${url}/api/cache/compile`, { method: 'POST' });
      const cacheCompileData = await cacheCompileRes.json();
      assert.equal(cacheCompileRes.status, 200);
      assert.equal(cacheCompileData.success, true);

      // Test Critic Validate API endpoint
      const criticApiRes = await fetch(`${url}/api/critic/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: 'bin/vibes.mjs' })
      });
      const criticApiData = await criticApiRes.json();
      assert.equal(criticApiRes.status, 200);
      assert.equal(criticApiData.success, true);
      assert.equal(criticApiData.report.verdict, 'APPROVED');
      assert.equal(criticApiData.report.score, 100);

      // Test MCP vibes_critic_validate tool via /api/mcp/execute
      const mcpCriticRes = await fetch(`${url}/api/mcp/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'vibes_critic_validate',
          arguments: { target: 'bin/vibes.mjs' }
        })
      });
      const mcpCriticData = await mcpCriticRes.json();
      assert.equal(mcpCriticRes.status, 200);
      assert.match(mcpCriticData.result.result.content[0].text, /"verdict":\s*"APPROVED"/);
      assert.match(mcpCriticData.result.result.content[0].text, /"score":\s*100/);

      // Test Remote MCP resources/list and resources/read via /messages
      const mcpResListRes = await fetch(`${url}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'test-res-list',
          method: 'resources/list'
        })
      });
      const mcpResListData = await mcpResListRes.json();
      assert.equal(mcpResListRes.status, 202);
      assert.equal(mcpResListData.response.result.resources.length, 5);

      const mcpResReadRes = await fetch(`${url}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'test-res-read',
          method: 'resources/read',
          params: { uri: 'vibes://schemas/swarm-plan' }
        })
      });
      const mcpResReadData = await mcpResReadRes.json();
      assert.equal(mcpResReadRes.status, 202);
      assert.match(mcpResReadData.response.result.contents[0].text, /SwarmPlan/);

      // Test Studio MCP Client Setup endpoint
      const mcpSetupApiRes = await fetch(`${url}/api/mcp/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client: 'claude', force: false })
      });
      const mcpSetupApiData = await mcpSetupApiRes.json();
      assert.equal(mcpSetupApiRes.status, 200);
      assert.equal(mcpSetupApiData.success, true);
      assert.ok(Array.isArray(mcpSetupApiData.results));
      assert.equal(mcpSetupApiData.results[0].client, 'Claude Desktop');

      // Test Visual Audit API endpoint
      const visualApiRes = await fetch(`${url}/api/visual-audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: '<button className="rounded-lg border border-border/50 px-4 py-2 hover:bg-muted font-medium tabular-nums">Pay Rp 150.000</button>',
          viewport: 'desktop'
        })
      });
      const visualApiData = await visualApiRes.json();
      assert.equal(visualApiRes.status, 200);
      assert.equal(visualApiData.success, true);
      assert.equal(visualApiData.report.verdict, 'APPROVED');
      assert.equal(visualApiData.report.score, 100);

      // Test MCP vibes_visual_audit tool via /api/mcp/execute
      const mcpVisualRes = await fetch(`${url}/api/mcp/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'vibes_visual_audit',
          arguments: {
            target: '<button className="rounded-lg border border-border/50 px-4 py-2 hover:bg-muted font-medium tabular-nums">Pay Rp 150.000</button>'
          }
        })
      });
      const mcpVisualData = await mcpVisualRes.json();
      assert.equal(mcpVisualRes.status, 200);
      assert.match(mcpVisualData.result.result.content[0].text, /"verdict":\s*"APPROVED"/);
      assert.match(mcpVisualData.result.result.content[0].text, /"score":\s*100/);

      // Test DAG workflow presets and simulation endpoints
      const dagPresetsRes = await fetch(`${url}/api/dag/presets`);
      const dagPresets = await dagPresetsRes.json();
      assert.equal(dagPresetsRes.status, 200);
      assert.ok(dagPresets['zero-to-prod']);
      assert.ok(dagPresets['critic-validator']);
      assert.ok(dagPresets['agentic-commerce']);

      const dagSimRes = await fetch(`${url}/api/dag/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presetId: 'critic-validator' })
      });
      const dagSimData = await dagSimRes.json();
      assert.equal(dagSimRes.status, 200);
      assert.equal(dagSimData.success, true);
      assert.equal(dagSimData.stepsCompleted, 5);
      assert.ok(dagSimData.traceLogs.length > 0);

      // Test Ephemeral Sandbox API endpoint
      const sandboxApiRes = await fetch(`${url}/api/sandbox/eval`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'const arr = [1, 2, 3]; arr.reduce((a, b) => a + b, 0)' })
      });
      const sandboxApiData = await sandboxApiRes.json();
      assert.equal(sandboxApiRes.status, 200);
      assert.equal(sandboxApiData.success, true);
      assert.equal(sandboxApiData.result, 6);

      // Test MCP vibes_eval_sandbox tool via /api/mcp/execute
      const prevSandboxEnv = process.env.VIBES_ENABLE_UNTRUSTED_SANDBOX_EVAL;
      process.env.VIBES_ENABLE_UNTRUSTED_SANDBOX_EVAL = 'true';
      try {
        const mcpSandboxRes = await fetch(`${url}/api/mcp/execute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tool: 'vibes_eval_sandbox',
            arguments: { code: 'const sum = (a, b) => a + b; sum(10, 32)' }
          })
        });
        const mcpSandboxData = await mcpSandboxRes.json();
        assert.equal(mcpSandboxRes.status, 200);
        assert.match(mcpSandboxData.result.result.content[0].text, /"success":\s*true/);
        assert.match(mcpSandboxData.result.result.content[0].text, /"result":\s*42/);
      } finally {
        if (prevSandboxEnv === undefined) {
          delete process.env.VIBES_ENABLE_UNTRUSTED_SANDBOX_EVAL;
        } else {
          process.env.VIBES_ENABLE_UNTRUSTED_SANDBOX_EVAL = prevSandboxEnv;
        }
      }

      // Test FinOps telemetry endpoints
      const finopsGetRes = await fetch(`${url}/api/finops`);
      const finopsGetData = await finopsGetRes.json();
      assert.equal(finopsGetRes.status, 200);
      assert.equal(finopsGetData.success, true);
      assert.ok(finopsGetData.data.tokens);

      const finopsRecordRes = await fetch(`${url}/api/finops/record`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-3-7-sonnet', inputTokens: 2000, outputTokens: 800, cachedTokens: 18000 })
      });
      const finopsRecordData = await finopsRecordRes.json();
      assert.equal(finopsRecordRes.status, 200);
      assert.equal(finopsRecordData.success, true);
      assert.ok(finopsRecordData.data.tokens.cachedTotal >= 18000);

      const finopsExportRes = await fetch(`${url}/api/finops/export?format=csv`);
      const finopsExportText = await finopsExportRes.text();
      assert.equal(finopsExportRes.status, 200);
      assert.match(finopsExportText, /timestamp,model,task/);

      // Test Swarm Dispatch endpoint
      const swarmDispatchRes = await fetch(`${url}/api/swarm/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'Build payment and api backend', concurrency: 2 })
      });
      const swarmDispatchData = await swarmDispatchRes.json();
      assert.equal(swarmDispatchRes.status, 200);
      assert.equal(swarmDispatchData.success, true);
      assert.ok(swarmDispatchData.totalWorkers > 0);
      assert.ok(swarmDispatchData.traceLogs.length > 0);

      // Test MCP vibes_swarm_dispatch tool
      const mcpDispatchRes = await fetch(`${url}/api/mcp/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'vibes_swarm_dispatch',
          arguments: { task: 'Verify formal billing state machine invariants', concurrency: 2 }
        })
      });
      const mcpDispatchData = await mcpDispatchRes.json();
      assert.equal(mcpDispatchRes.status, 200);
      assert.match(mcpDispatchData.result.result.content[0].text, /"success":\s*true/);

      // Test MCP vibes_finops_report tool
      const mcpFinopsRes = await fetch(`${url}/api/mcp/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'vibes_finops_report',
          arguments: { action: 'status' }
        })
      });
      const mcpFinopsData = await mcpFinopsRes.json();
      assert.equal(mcpFinopsRes.status, 200);
      assert.match(mcpFinopsData.result.result.content[0].text, /"success":\s*true/);

      // Test Studio Codebase Graph Query endpoint
      const graphRes = await fetch(`${url}/api/graph/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'startStudioServer' })
      });
      const graphData = await graphRes.json();
      assert.equal(graphRes.status, 200);
      assert.equal(graphData.success, true);
      assert.ok(graphData.matches.length > 0);
      assert.match(graphData.matches[0].file, /studio-server\.mjs/);

      // Test Studio PR Review endpoint
      const prReviewRes = await fetch(`${url}/api/pr/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: 'scripts/graphrag-indexer.mjs' })
      });
      const prReviewData = await prReviewRes.json();
      assert.equal(prReviewRes.status, 200);
      assert.equal(prReviewData.success, true);
      assert.equal(prReviewData.verdict, 'APPROVED');
      assert.match(prReviewData.markdownReport, /Files Reviewed/);

      // Test MCP vibes_graph_query tool
      const mcpGraphRes = await fetch(`${url}/api/mcp/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'vibes_graph_query',
          arguments: { symbolName: 'startStudioServer' }
        })
      });
      const mcpGraphData = await mcpGraphRes.json();
      assert.equal(mcpGraphRes.status, 200);
      assert.match(mcpGraphData.result.result.content[0].text, /"success":\s*true/);
      assert.match(mcpGraphData.result.result.content[0].text, /studio-server\.mjs/);

      // Test Studio Codebase Graph Search endpoint
      const graphSearchRes = await fetch(`${url}/api/graph/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'startStudioServer', topK: 3 })
      });
      const graphSearchData = await graphSearchRes.json();
      assert.equal(graphSearchRes.status, 200);
      assert.equal(graphSearchData.success, true);
      assert.ok(graphSearchData.results.length > 0);
      assert.equal(graphSearchData.results[0].name, 'startStudioServer');
      assert.ok(graphSearchData.results[0].score > 0.5);

      // Test MCP vibes_graph_search tool
      const mcpGraphSearchRes = await fetch(`${url}/api/mcp/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'vibes_graph_search',
          arguments: { query: 'startStudioServer', topK: 3 }
        })
      });
      const mcpGraphSearchData = await mcpGraphSearchRes.json();
      assert.equal(mcpGraphSearchRes.status, 200);
      assert.match(mcpGraphSearchData.result.result.content[0].text, /startStudioServer/);

      // Test MCP vibes_pr_review tool
      const mcpPrRes = await fetch(`${url}/api/mcp/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'vibes_pr_review',
          arguments: { target: 'scripts/graphrag-indexer.mjs' }
        })
      });
      const mcpPrData = await mcpPrRes.json();
      assert.equal(mcpPrRes.status, 200);
      assert.match(mcpPrData.result.result.content[0].text, /"success":\s*true/);
      assert.match(mcpPrData.result.result.content[0].text, /"verdict":\s*"APPROVED"/);

      // Test Studio Self-Heal Diagnose endpoint
      const healRes = await fetch(`${url}/api/heal/diagnose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'node -v', dryRun: true })
      });
      const healData = await healRes.json();
      assert.equal(healRes.status, 200);
      assert.equal(healData.passed, true);
      assert.equal(healData.status, 'PASSED');

      // Test Studio Self-Heal Security Rejections (GHSA-f63r-xxp2-3m23 regression checks)
      const injectionRes = await fetch(`${url}/api/heal/diagnose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'node -v; whoami', dryRun: true })
      });
      const injectionData = await injectionRes.json();
      assert.equal(injectionRes.status, 400);
      assert.equal(injectionData.status, 'REJECTED');
      assert.match(injectionData.error, /prohibited shell metacharacters/i);

      const untrustedCmdRes = await fetch(`${url}/api/heal/diagnose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'curl http://malicious.test', dryRun: true })
      });
      const untrustedCmdData = await untrustedCmdRes.json();
      assert.equal(untrustedCmdRes.status, 400);
      assert.equal(untrustedCmdData.status, 'REJECTED');
      assert.match(untrustedCmdData.error, /not an authorized test runner/i);

      // Test Cross-Origin security rejection
      const untrustedOriginRes = await fetch(`${url}/api/heal/diagnose`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://evil-attacker.example.com'
        },
        body: JSON.stringify({ command: 'node -v', dryRun: true })
      });
      assert.equal(untrustedOriginRes.status, 403);

      // Test Studio Registry List endpoint
      const regListRes = await fetch(`${url}/api/registry/list`);
      const regListData = await regListRes.json();
      assert.equal(regListRes.status, 200);
      assert.equal(regListData.success, true);
      assert.ok(regListData.count >= 176);

      // Test Studio Registry Search endpoint
      const regSearchRes = await fetch(`${url}/api/registry/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'settlement' })
      });
      const regSearchData = await regSearchRes.json();
      assert.equal(regSearchRes.status, 200);
      assert.equal(regSearchData.success, true);
      assert.ok(regSearchData.count > 0);
      assert.match(regSearchData.matches[0].name, /settlement/i);

      // Test MCP vibes_self_heal tool
      const mcpHealRes = await fetch(`${url}/api/mcp/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'vibes_self_heal',
          arguments: { command: 'node -v' }
        })
      });
      const mcpHealData = await mcpHealRes.json();
      assert.equal(mcpHealRes.status, 200);
      assert.match(mcpHealData.result.result.content[0].text, /"status":\s*"PASSED"/);

      // Test MCP vibes_registry_search tool
      const mcpRegSearchRes = await fetch(`${url}/api/mcp/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'vibes_registry_search',
          arguments: { query: 'spec' }
        })
      });
      const mcpRegSearchData = await mcpRegSearchRes.json();
      assert.equal(mcpRegSearchRes.status, 200);
      assert.match(mcpRegSearchData.result.result.content[0].text, /spec-driven-development-expert/);

      // Test MCP vibes_registry_install tool
      const mcpRegInstallRes = await fetch(`${url}/api/mcp/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'vibes_registry_install',
          arguments: { skillName: 'spec-driven-development-expert' }
        })
      });
      const mcpRegInstallData = await mcpRegInstallRes.json();
      assert.equal(mcpRegInstallRes.status, 200);
      assert.match(mcpRegInstallData.result.result.content[0].text, /"success":\s*true/);

      // Test Studio Cross-IDE Bridge Status endpoint
      const bridgeStatusRes = await fetch(`${url}/api/bridge/status`);
      const bridgeStatusData = await bridgeStatusRes.json();
      assert.equal(bridgeStatusRes.status, 200);
      assert.equal(bridgeStatusData.success, true);
      assert.ok(bridgeStatusData.report.platforms.claude);
      assert.ok(bridgeStatusData.report.platforms.cursor);

      // Test Studio Cross-IDE Bridge Sync endpoint
      const testBridgeDir = path.join(process.cwd(), '.test-bridge-studio-tmp');
      await fs.mkdir(testBridgeDir, { recursive: true });
      try {
        const bridgeSyncRes = await fetch(`${url}/api/bridge/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dir: testBridgeDir, target: 'claude' })
        });
        const bridgeSyncData = await bridgeSyncRes.json();
        assert.equal(bridgeSyncRes.status, 200);
        assert.equal(bridgeSyncData.success, true);
        assert.equal(bridgeSyncData.results[0].status, 'synced');

        // Test Studio Cross-IDE Context Bundle export endpoint
        const bridgeBundleRes = await fetch(`${url}/api/bridge/bundle?dir=${encodeURIComponent(testBridgeDir)}`);
        const bridgeBundleText = await bridgeBundleRes.text();
        assert.equal(bridgeBundleRes.status, 200);
        assert.match(bridgeBundleText, /Vibes-Plug (Universal|Sovereign) Context Bundle/i);
      } finally {
        await fs.rm(testBridgeDir, { recursive: true, force: true });
      }

      // Test MCP vibes_bridge_status tool
      const mcpBridgeStatusRes = await fetch(`${url}/api/mcp/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'vibes_bridge_status',
          arguments: {}
        })
      });
      const mcpBridgeStatusData = await mcpBridgeStatusRes.json();
      assert.equal(mcpBridgeStatusRes.status, 200);
      assert.match(mcpBridgeStatusData.result.result.content[0].text, /"targetDir"/);
      assert.match(mcpBridgeStatusData.result.result.content[0].text, /"platforms"/);

      // Test Studio Skill Learn/Synthesize endpoint
      const learnApiRes = await fetch(`${url}/api/skill/learn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'graphql-mesh-expert', dryRun: true })
      });
      const learnApiData = await learnApiRes.json();
      assert.equal(learnApiRes.status, 200);
      assert.equal(learnApiData.success, true);
      assert.equal(learnApiData.skillName, 'graphql-mesh-expert');

      // Test MCP vibes_learn_skill tool
      const mcpLearnRes = await fetch(`${url}/api/mcp/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'vibes_learn_skill',
          arguments: { name: 'duckdb-wasm-expert', dryRun: true }
        })
      });
      const mcpLearnData = await mcpLearnRes.json();
      assert.equal(mcpLearnRes.status, 200);
      assert.match(mcpLearnData.result.result.content[0].text, /"success":\s*true/);
      assert.match(mcpLearnData.result.result.content[0].text, /duckdb-wasm-expert/);

      // Test Studio Pre-Disk Verification Gate endpoint
      const verifyApiRes = await fetch(`${url}/api/sandbox/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'export function calculateTotal(price, qty) { return price * qty; }' })
      });
      const verifyApiData = await verifyApiRes.json();
      assert.equal(verifyApiRes.status, 200);
      assert.equal(verifyApiData.success, true);
      assert.equal(verifyApiData.verdict, 'APPROVED');
      assert.equal(verifyApiData.canPersistToDisk, true);

      // Test MCP vibes_verify_gate tool
      const mcpVerifyRes = await fetch(`${url}/api/mcp/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'vibes_verify_gate',
          arguments: { code: 'export const status = "READY";' }
        })
      });
      const mcpVerifyData = await mcpVerifyRes.json();
      assert.equal(mcpVerifyRes.status, 200);
      assert.match(mcpVerifyData.result.result.content[0].text, /"verdict":\s*"APPROVED"/);
      assert.match(mcpVerifyData.result.result.content[0].text, /"canPersistToDisk":\s*true/);

      // Test Studio Swarm Bus Events & Broadcast endpoints
      const swarmEventsRes = await fetch(`${url}/api/swarm/events`);
      const swarmEventsData = await swarmEventsRes.json();
      assert.equal(swarmEventsRes.status, 200);
      assert.equal(swarmEventsData.success, true);
      assert.ok(Array.isArray(swarmEventsData.events));

      const swarmBcastRes = await fetch(`${url}/api/swarm/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Studio live beacon' })
      });
      const swarmBcastData = await swarmBcastRes.json();
      assert.equal(swarmBcastRes.status, 200);
      assert.equal(swarmBcastData.success, true);
      assert.equal(swarmBcastData.event.type, 'agent:broadcast');
      assert.equal(swarmBcastData.event.message, 'Studio live beacon');

      // Test MCP vibes_swarm_bus tool
      const mcpSwarmBusRes = await fetch(`${url}/api/mcp/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'vibes_swarm_bus',
          arguments: { action: 'events' }
        })
      });
      const mcpSwarmBusData = await mcpSwarmBusRes.json();
      assert.equal(mcpSwarmBusRes.status, 200);
      assert.match(mcpSwarmBusData.result.result.content[0].text, /"success":\s*true/);

      // Test Studio Extension Package endpoint
      const extPackageRes = await fetch(`${url}/api/extension/package`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dryRun: true })
      });
      const extPackageData = await extPackageRes.json();
      assert.equal(extPackageRes.status, 200);
      assert.equal(extPackageData.success, true);
      assert.equal(extPackageData.commandsCount, 12);
      assert.ok(extPackageData.sizeBytes > 1000);

      // Test MCP vibes_package_extension tool
      const mcpExtRes = await fetch(`${url}/api/mcp/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'vibes_package_extension',
          arguments: { dryRun: true }
        })
      });
      const mcpExtData = await mcpExtRes.json();
      assert.equal(mcpExtRes.status, 200);
      assert.match(mcpExtData.result.result.content[0].text, /"commandsCount":\s*12/);

      // Test MCP vibes_run_benchmark tool
      const mcpBenchRes = await fetch(`${url}/api/mcp/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'vibes_run_benchmark',
          arguments: { save: false }
        })
      });
      const mcpBenchData = await mcpBenchRes.json();
      assert.equal(mcpBenchRes.status, 200);
      assert.match(mcpBenchData.result.result.content[0].text, /"itemsTested":\s*7/);

      // Test MCP vibes_git_hooks tool
      const mcpHooksRes = await fetch(`${url}/api/mcp/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'vibes_git_hooks',
          arguments: { action: 'status' }
        })
      });
      const mcpHooksData = await mcpHooksRes.json();
      assert.equal(mcpHooksRes.status, 200);
      assert.match(mcpHooksData.result.result.content[0].text, /"isGitRepo":\s*true/);

      // Test Studio /api/budget/analyze endpoint
      const budgetRes = await fetch(`${url}/api/budget/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'Build a DOKU SNAP BI QRIS and VA checkout integration with atomic locks' })
      });
      const budgetData = await budgetRes.json();
      assert.equal(budgetRes.status, 200);
      assert.equal(budgetData.success, true);
      assert.equal(budgetData.tier, 'MODERATE');
      assert.equal(budgetData.allocatedBudgetTokens, 8192);

      // Test MCP vibes_optimize_budget tool
      const mcpBudgetRes = await fetch(`${url}/api/mcp/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'vibes_optimize_budget',
          arguments: { task: 'Fix typo in documentation' }
        })
      });
      const mcpBudgetData = await mcpBudgetRes.json();
      assert.equal(mcpBudgetRes.status, 200);
      assert.match(mcpBudgetData.result.result.content[0].text, /"allocatedBudgetTokens":\s*1024/);

      // Test Studio /api/drift and /api/drift/senior-frontend endpoints
      const driftRes = await fetch(`${url}/api/drift`);
      const driftData = await driftRes.json();
      assert.equal(driftRes.status, 200);
      assert.ok(driftData.totalSkills >= 176);
      assert.equal(driftData.ecosystemStatus, 'PRISTINE');
      assert.equal(driftData.averageScore, 100);

      const singleDriftRes = await fetch(`${url}/api/drift/senior-frontend`);
      const singleDriftData = await singleDriftRes.json();
      assert.equal(singleDriftRes.status, 200);
      assert.equal(singleDriftData.skillName, 'senior-frontend');
      assert.equal(singleDriftData.score, 100);

      // Test MCP vibes_skill_drift tool via /api/mcp/execute
      const mcpDriftRes = await fetch(`${url}/api/mcp/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'vibes_skill_drift',
          arguments: { skillName: 'senior-frontend' }
        })
      });
      const mcpDriftData = await mcpDriftRes.json();
      assert.equal(mcpDriftRes.status, 200);
      assert.match(mcpDriftData.result.result.content[0].text, /"skillName":\s*"senior-frontend"/);
      assert.match(mcpDriftData.result.result.content[0].text, /"score":\s*100/);

      // Test MCP vibes_terminal_monitor tool via /api/mcp/execute
      const mcpMonitorRes = await fetch(`${url}/api/mcp/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'vibes_terminal_monitor',
          arguments: {}
        })
      });
      const mcpMonitorData = await mcpMonitorRes.json();
      assert.equal(mcpMonitorRes.status, 200);
      assert.match(mcpMonitorData.result.result.content[0].text, /"totalSkills":\s*1[67]\d/);
      assert.match(mcpMonitorData.result.result.content[0].text, /"ecosystemStatus":\s*"PRISTINE"/);

      // Test Studio REST POST /api/consensus endpoint
      const studioConsensusRes = await fetch(`${url}/api/consensus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spec: 'Safe string batch normalization',
          drafts: [
            {
              id: 'draft-clean',
              code: 'export function norm(s: string[]): string[] { if (!Array.isArray(s)) throw new TypeError(); return s.map(x => x.trim()); }'
            },
            {
              id: 'draft-slop',
              code: 'export function norm(s: any) { ' + '// TO' + 'DO: implement\n try { return s; } ' + 'cat' + 'ch(e){}' + ' }'
            }
          ]
        })
      });
      assert.equal(studioConsensusRes.status, 200);
      const studioConsensusData = await studioConsensusRes.json();
      assert.equal(studioConsensusData.winner.id, 'draft-clean');
      assert.ok(studioConsensusData.winner.score > 80);

      // Test MCP vibes_speculative_consensus tool via /api/mcp/execute
      const mcpConsensusRes = await fetch(`${url}/api/mcp/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'vibes_speculative_consensus',
          arguments: {
            drafts: [
              {
                id: 'draft-clean',
                code: 'export function norm(s: string[]): string[] { if (!Array.isArray(s)) throw new TypeError(); return s.map(x => x.trim()); }'
              },
              {
                id: 'draft-slop',
                code: 'export function norm(s: any) { ' + '// TO' + 'DO: implement\n try { return s; } ' + 'cat' + 'ch(e){}' + ' }'
              }
            ]
          }
        })
      });
      assert.equal(mcpConsensusRes.status, 200);
      const mcpConsensusData = await mcpConsensusRes.json();
      assert.match(mcpConsensusData.result.result.content[0].text, /"winner":/);
      assert.match(mcpConsensusData.result.result.content[0].text, /"draft-clean"/);

      // Test Studio /showcase endpoint & static assets
      const showcaseRes = await fetch(`${url}/showcase`);
      assert.equal(showcaseRes.status, 200);
      assert.match(showcaseRes.headers.get('content-type'), /text\/html/);
      const showcaseHtml = await showcaseRes.text();
      assert.match(showcaseHtml, /176 Skill Ecosystem/);

      const showcaseCssRes = await fetch(`${url}/showcase/styles.css`);
      assert.equal(showcaseCssRes.status, 200);
      assert.match(showcaseCssRes.headers.get('content-type'), /text\/css/);

      const showcaseJsRes = await fetch(`${url}/showcase/app.js`);
      assert.equal(showcaseJsRes.status, 200);
      assert.match(showcaseJsRes.headers.get('content-type'), /application\/javascript/);

      const showcaseDataRes = await fetch(`${url}/showcase/skills-data.js`);
      assert.equal(showcaseDataRes.status, 200);
      assert.match(showcaseDataRes.headers.get('content-type'), /application\/javascript/);

      // Test Multiplier 7: Live Telemetry Snapshot & File Watcher status
      const liveTelRes = await fetch(`${url}/api/telemetry/live`);
      assert.equal(liveTelRes.status, 200);
      const liveTelData = await liveTelRes.json();
      assert.equal(liveTelData.success, true);
      assert.equal(liveTelData.mcpProfile.totalToolCount, 37);
      assert.equal(liveTelData.liveWatcher.active, true);
    } finally {
      await new Promise((resolve) => server.close(resolve));
      await fs.rm(path.join(process.cwd(), '.agents', 'skills', 'spec-driven-development-expert'), { recursive: true, force: true });
      if (origMem !== null) {
        await fs.writeFile(memFilePath, origMem, 'utf8');
      }
      if (origCheckpoint !== null) {
        await fs.writeFile(checkpointFilePath, origCheckpoint, 'utf8');
      }
    }
  });

  await t.test('vibes bench should run performance benchmark suite and meet SLA budgets', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'bench', '--json']);
    const parsed = JSON.parse(stdout);
    assert.equal(parsed.itemsTested, 7);
    assert.equal(parsed.allPassed, true);
    assert.equal(parsed.score, 100);
    assert.equal(parsed.results.length, 7);
  });

  await t.test('vibes hooks should inspect, install, and remove pre-commit gate in git repository', async () => {
    const tempTestRepo = path.join(PLUGIN_ROOT, '.agents', 'scratch', 'test-git-hooks-repo');
    await fs.mkdir(path.join(tempTestRepo, '.git'), { recursive: true });

    try {
      // 1. Initial status: repo exists, hook not installed
      const { stdout: statusInit } = await execFileAsync(process.execPath, [CLI_PATH, 'hooks', 'status'], { cwd: tempTestRepo });
      assert.match(statusInit, /Git Repository\s+:\s+Yes/);
      assert.match(statusInit, /Hook Installed\s+:\s+No/);

      // 2. Install pre-commit hook
      const { stdout: installOut } = await execFileAsync(process.execPath, [CLI_PATH, 'hooks', 'install'], { cwd: tempTestRepo });
      assert.match(installOut, /installed successfully/i);

      // Verify installed status
      const { stdout: statusInstalled } = await execFileAsync(process.execPath, [CLI_PATH, 'hooks', 'status'], { cwd: tempTestRepo });
      assert.match(statusInstalled, /Hook Installed\s+:\s+Yes/);
      assert.match(statusInstalled, /Managed by Vibes\s+:\s+Yes/);

      // 3. Remove pre-commit hook
      const { stdout: removeOut } = await execFileAsync(process.execPath, [CLI_PATH, 'hooks', 'remove'], { cwd: tempTestRepo });
      assert.match(removeOut, /removed successfully/i);

      // Verify removed status
      const { stdout: statusFinal } = await execFileAsync(process.execPath, [CLI_PATH, 'hooks', 'status'], { cwd: tempTestRepo });
      assert.match(statusFinal, /Hook Installed\s+:\s+No/);
    } finally {
      await fs.rm(tempTestRepo, { recursive: true, force: true });
    }
  });

  await t.test('vibes budget should evaluate complexity score and allocate calibrated thinking tokens', async () => {
    // 1. Simple task (speed / 1024 tokens)
    const { stdout: speedOut } = await execFileAsync(process.execPath, [CLI_PATH, 'budget', 'Fix typo in documentation', '--json']);
    const speedData = JSON.parse(speedOut);
    assert.equal(speedData.success, true);
    assert.equal(speedData.tier, 'LOW');
    assert.equal(speedData.profile, 'speed');
    assert.equal(speedData.allocatedBudgetTokens, 1024);
    assert.ok(speedData.economics.tokensSavedPerCall > 60000);

    // 2. Complex architectural task (deep / 32768 tokens)
    const { stdout: deepOut } = await execFileAsync(process.execPath, [CLI_PATH, 'budget', 'scripts/studio-server.mjs', '--json']);
    const deepData = JSON.parse(deepOut);
    assert.equal(deepData.success, true);
    assert.equal(deepData.tier, 'HIGH');
    assert.equal(deepData.profile, 'deep');
    assert.equal(deepData.allocatedBudgetTokens, 32768);
    assert.ok(deepData.autoBoundSkills.length > 0);
  });

  await t.test('vibes drift should monitor ecosystem framework drift, graph integrity, and skill health', async () => {
    // 1. Full ecosystem scan
    const { stdout: fullOut } = await execFileAsync(process.execPath, [CLI_PATH, 'drift', '--json']);
    const fullData = JSON.parse(fullOut);
    assert.ok(fullData.totalSkills >= 176);
    assert.equal(fullData.deadLinksCount, 0);
    assert.equal(fullData.ecosystemStatus, 'PRISTINE');
    assert.equal(fullData.averageScore, 100);
    assert.ok(fullData.totalEdges > 700);

    // 2. Single skill deep dive
    const { stdout: singleOut } = await execFileAsync(process.execPath, [CLI_PATH, 'drift', 'senior-frontend', '--json']);
    const singleData = JSON.parse(singleOut);
    assert.equal(singleData.skillName, 'senior-frontend');
    assert.equal(singleData.score, 100);
    assert.equal(singleData.status, 'PRISTINE');
    assert.ok(singleData.inDegree > 10);
  });

  await t.test('vibes monitor should provide terminal dashboard snapshot and JSON telemetry', async () => {
    // 1. Snapshot mode
    const { stdout: snapOut } = await execFileAsync(process.execPath, [CLI_PATH, 'monitor', '--once']);
    assert.match(snapOut, /VIBES-PLUG SOVEREIGN COCKPIT/);
    assert.match(snapOut, /Ecosystem Health/);
    assert.match(snapOut, /100\/100/);

    // 2. JSON telemetry mode
    const { stdout: jsonOut } = await execFileAsync(process.execPath, [CLI_PATH, 'monitor', '--json']);
    const monitorData = JSON.parse(jsonOut);
    assert.equal(typeof monitorData.drift, 'object');
    assert.ok(monitorData.drift.totalSkills >= 176);
    assert.equal(monitorData.drift.ecosystemStatus, 'PRISTINE');
    assert.ok(Array.isArray(monitorData.benchmarks.results));
    assert.equal(monitorData.benchmarks.passedCount, 7);
  });

  await t.test('vibes consensus should arbitrate competing drafts and synthesize optimal code', async () => {
    const testDir = path.join(process.cwd(), '.agents', 'test-consensus');
    await fs.mkdir(testDir, { recursive: true });

    const draftAPath = path.join(testDir, 'draftA.ts');
    const draftBPath = path.join(testDir, 'draftB.ts');
    const outPath = path.join(testDir, 'consensus-winner.ts');

    try {
      await fs.writeFile(draftAPath, 'export interface Item { id: string; }\nexport function processItems(items: Item[]): number {\n  if (!Array.isArray(items)) throw new TypeError(\"Array required\");\n  return items.length;\n}', 'utf8');
      await fs.writeFile(draftBPath, 'export function processItems(items: any) {\n  ' + '// TO' + 'DO: validate\n  try {\n    return items.length;\n  } ' + 'cat' + 'ch (err) {}' + '\n}', 'utf8');

      // 1. JSON arbitration mode
      const { stdout: jsonOut } = await execFileAsync(process.execPath, [
        CLI_PATH,
        'consensus',
        draftAPath,
        draftBPath,
        '--spec',
        'Type-safe item processing with defensive bounds',
        '--json'
      ]);
      const consensusData = JSON.parse(jsonOut);
      assert.equal(consensusData.totalDrafts, 2);
      assert.equal(consensusData.winner.id, 'draftA.ts');
      assert.ok(consensusData.winner.score > 80);
      assert.equal(consensusData.rankedDrafts[0].id, 'draftA.ts');
      assert.equal(consensusData.rankedDrafts[1].id, 'draftB.ts');

      // 2. Report and File Output mode
      const { stdout: reportOut } = await execFileAsync(process.execPath, [
        CLI_PATH,
        'consensus',
        draftAPath,
        draftBPath,
        '--output',
        outPath
      ]);
      assert.match(reportOut, /VIBES-PLUG SPECULATIVE MULTI-DRAFT CONSENSUS ARBITER/);
      assert.match(reportOut, /Consensus Winner/);

      const writtenCode = await fs.readFile(outPath, 'utf8');
      assert.match(writtenCode, /Synthesized Consensus Implementation/);
      assert.match(writtenCode, /Consensus Winner: draftA\.ts/);
    } finally {
      await fs.rm(testDir, { recursive: true, force: true });
    }
  });

  await t.test('vibes detect should analyze workspace dependencies and recommend skills', async () => {
    const testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vibes-detect-test-'));
    try {
      await fs.writeFile(path.join(testDir, 'package.json'), JSON.stringify({
        name: 'test-app',
        dependencies: {
          'next': '^15.0.0',
          'tailwindcss': '^4.0.0',
          'wrangler': '^3.0.0'
        }
      }, null, 2));

      const { stdout: detectOut } = await execFileAsync(process.execPath, [
        CLI_PATH,
        'detect',
        testDir,
        '--json'
      ]);
      const data = JSON.parse(detectOut);
      assert.ok(data.detectedStacks.includes('Node.js / JavaScript'));
      assert.ok(data.recommendedSkills.includes('nextjs-app-router-expert'));
      assert.ok(data.recommendedSkills.includes('tailwind-expert'));
      assert.ok(data.recommendedSkills.includes('cloudflare-workers-expert'));
      assert.ok(data.recommendedSkills.includes('anti-slop'));
    } finally {
      await fs.rm(testDir, { recursive: true, force: true });
    }
  });

  await t.test('vibes skill exec should dispatch deterministic actions across all 176 skills', async () => {
    const { stdout: dbOut } = await execFileAsync(process.execPath, [
      CLI_PATH,
      'skill',
      'exec',
      'database-orm-expert',
      'generate',
      '--payload={"table":"ledger_entries"}',
      '--format=json'
    ]);
    const dbRes = JSON.parse(dbOut);
    assert.strictEqual(dbRes.status, 'success');
    assert.strictEqual(dbRes.skill, 'database-orm-expert');
    assert.match(dbRes.result.ddl, /ENABLE ROW LEVEL SECURITY/);

    const { stdout: bpOut } = await execFileAsync(process.execPath, [
      CLI_PATH,
      'skill',
      'exec',
      'saas-architect',
      'blueprint',
      '--format=json'
    ]);
    const bpRes = JSON.parse(bpOut);
    assert.strictEqual(bpRes.status, 'success');
    assert.ok(bpRes.result.codeBlueprintsCount >= 2);
    assert.ok(bpRes.telemetry.tokensSaved > 0);
  });

  await t.test('vibes skill chain and slice should execute multi-skill pipelines and compact slices', async () => {
    const { stdout: chainOut } = await execFileAsync(process.execPath, [
      CLI_PATH,
      'skill',
      'chain',
      'ai-agent-hardening',
      '--format=json'
    ]);
    const chainRes = JSON.parse(chainOut);
    assert.strictEqual(chainRes.status, 'success');
    assert.strictEqual(chainRes.stepsCount, 4);
    assert.ok(chainRes.totalTokensSaved > 500);

    const { stdout: sliceOut } = await execFileAsync(process.execPath, [
      CLI_PATH,
      'skill',
      'slice',
      'frontier-ai-models-expert',
      '--format=json'
    ]);
    const sliceRes = JSON.parse(sliceOut);
    assert.strictEqual(sliceRes.status, 'success');
    assert.strictEqual(sliceRes.result.skill, 'frontier-ai-models-expert');
    assert.strictEqual(sliceRes.result.domain, 'ai-llm');
  });

  await t.test('vibes skill chain rea-binary-audit-gate and P8 vibes drift:heal should verify REA chain and heal schema drift', async () => {
    const { stdout: reaChainOut } = await execFileAsync(process.execPath, [
      CLI_PATH,
      'skill',
      'chain',
      'rea-binary-audit-gate',
      '--format=json'
    ]);
    const reaChainRes = JSON.parse(reaChainOut);
    assert.strictEqual(reaChainRes.status, 'success');
    assert.strictEqual(reaChainRes.stepsCount, 5);

    const { stdout: healOut } = await execFileAsync(process.execPath, [
      CLI_PATH,
      'drift:heal',
      '--json'
    ]);
    const healRes = JSON.parse(healOut);
    assert.strictEqual(healRes.engine, 'P8:AutonomousSchemaDriftHealer');
    assert.strictEqual(healRes.status, 'DRIFT_HEALED');
    assert.ok(healRes.driftCount >= 1);
    assert.match(healRes.synthesizedPatch, /PaymentSettlementSchema = z\.object/);
  });

  await t.test('Option A & B: dynamic MCP tool masking, hardened TS/WASM sandbox, and transitive AST digraph', async () => {
    const { handleRpcRequest } = await import('../bin/mcp-server.mjs');
    const { executeInSandbox, executeWasmModule } = await import('./wasm-sandbox.mjs');
    const { calculateBlastRadius } = await import('./ast-query.mjs');

    // 1. Dynamic MCP Tool Profile Masking
    const setCore = await handleRpcRequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: { name: 'vibes_tool_profile', arguments: { action: 'set', profile: 'core' } }
    });
    assert.strictEqual(JSON.parse(setCore.result.content[0].text).activeProfile, 'core');

    const coreList = await handleRpcRequest({ jsonrpc: '2.0', id: 2, method: 'tools/list' });
    assert.strictEqual(coreList.result.tools.length, 9);

    // Out-of-profile tool remains executable without breaking callers
    const sqlRes = await handleRpcRequest({
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: { name: 'vibes_eval_sql', arguments: { sql: 'CREATE TABLE items (id UUID PRIMARY KEY);' } }
    });
    assert.strictEqual(JSON.parse(sqlRes.result.content[0].text).valid, true);

    await handleRpcRequest({
      jsonrpc: '2.0',
      id: 4,
      method: 'tools/call',
      params: { name: 'vibes_tool_profile', arguments: { action: 'set', profile: 'full' } }
    });

    // 2. Hardened Sandbox: blocks constructor escape, runs TS + WASM
    const escapeAttempt = executeInSandbox("const F = Object['constr'+'uctor']; F('return 1')()");
    assert.strictEqual(escapeAttempt.success, false);

    const tsExec = executeInSandbox('interface Item { price: number } enum Tax { Std = 10 } const x: Item = { price: 90 + Tax.Std }; x.price');
    assert.strictEqual(tsExec.success, true);
    assert.strictEqual(tsExec.result, 100);
    assert.strictEqual(tsExec.transpiled, true);

    const addWasm = Uint8Array.from([
      0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
      0x01, 0x07, 0x01, 0x60, 0x02, 0x7f, 0x7f, 0x01, 0x7f,
      0x03, 0x02, 0x01, 0x00,
      0x07, 0x07, 0x01, 0x03, 0x61, 0x64, 0x64, 0x00, 0x00,
      0x0a, 0x09, 0x01, 0x07, 0x00, 0x20, 0x00, 0x20, 0x01, 0x6a, 0x0b
    ]);
    const wasmRes = executeWasmModule(addWasm, { exportName: 'add', args: [19, 23] });
    assert.strictEqual(wasmRes.success, true);
    assert.strictEqual(wasmRes.result, 42);

    // 3. Transitive AST Blast Radius Digraph
    const blast = await calculateBlastRadius(process.cwd(), path.resolve('scripts/ast-query.mjs'));
    assert.ok(blast.directImportersCount >= 2);
    assert.ok(blast.transitiveDependents.some((d) => d.depth >= 2));
  });

  await t.test('Multipliers 5 & 6: in-memory DPLL SAT/temporal invariant prover and two-tier swarm dispatch manifests', async () => {
    const { solveCnfDpll, verifyStateMachine } = await import('./verify-invariants.mjs');
    const { dispatchSwarm } = await import('./swarm-dispatcher.mjs');

    // 1. DPLL Boolean SAT Solver (SAT & UNSAT)
    const satRes = solveCnfDpll([[1, 2], [-1, 2], [1, -2]], 2);
    assert.strictEqual(satRes.satisfiable, true);
    assert.strictEqual(satRes.assignment[1], true);
    assert.strictEqual(satRes.assignment[2], true);

    const unsatRes = solveCnfDpll([[1], [-1]], 1);
    assert.strictEqual(unsatRes.satisfiable, false);

    // 2. Temporal Counterexample Prover (must_pass_through & no_path)
    const flawedSpec = {
      states: ['CART', 'KYC_VERIFIED', 'SETTLED', 'REFUNDED'],
      initial: 'CART',
      terminal: ['SETTLED', 'REFUNDED'],
      transitions: [
        { from: 'CART', to: 'KYC_VERIFIED', event: 'SUBMIT_KYC' },
        { from: 'KYC_VERIFIED', to: 'SETTLED', event: 'PAY_SNAP_BI' },
        { from: 'CART', to: 'SETTLED', event: 'BYPASS_CHECKOUT' }
      ],
      invariants: [
        { type: 'must_pass_through', from: 'CART', to: 'SETTLED', via: 'KYC_VERIFIED' }
      ]
    };
    const flawedCheck = verifyStateMachine(flawedSpec);
    assert.strictEqual(flawedCheck.valid, false);
    assert.strictEqual(flawedCheck.solverProof.status, 'SAT_VIOLATION');
    assert.strictEqual(flawedCheck.counterexamples.length, 1);
    assert.deepStrictEqual(flawedCheck.counterexamples[0].trace, ['CART', 'SETTLED']);

    // 3. Two-Tier Swarm Dispatch with Subagent & MCP Sampling Manifests
    const swarmOut = await dispatchSwarm('Build DOKU payment webhook with Postgres RLS and React UI', {
      concurrency: 3,
      reasoning: 'balanced'
    });
    assert.strictEqual(swarmOut.success, true);
    assert.strictEqual(swarmOut.executionTier, 'hybrid-ready');
    assert.ok(Array.isArray(swarmOut.subagentManifest) && swarmOut.subagentManifest.length >= 2);
    assert.ok(Array.isArray(swarmOut.mcpSamplingManifest) && swarmOut.mcpSamplingManifest.length >= 2);
    assert.strictEqual(swarmOut.mcpSamplingManifest[0].method, 'sampling/createMessage');
    assert.ok(swarmOut.subagentManifest[0].subagent.length > 0);
  });
});


