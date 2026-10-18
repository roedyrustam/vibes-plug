import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import os from 'node:os';
import vm from 'node:vm';

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLI_PATH = path.resolve(__dirname, '../bin/vibes.mjs');

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

  await t.test('vibes version current should return 4.3.0', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'version', 'current']);
    assert.match(stdout, /4\.3\.0/);
  });

  await t.test('vibes doctor should verify 155 skills and pass health checks', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'doctor']);
    assert.match(stdout, /Global skills registry: 155 skills found/);
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

  await t.test('vibes docs should generate 155-skill ecosystem preview', async () => {
    const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'docs']);
    assert.match(stdout, /Vibes-Plug Skills Catalog \(155 Skills\)/);
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

  await t.test('vibes graph:build and vibes graph:query should index and locate AST symbols', async () => {
    const { stdout: buildOut } = await execFileAsync(process.execPath, [CLI_PATH, 'graph:build']);
    assert.match(buildOut, /Building Codebase AST Symbol Knowledge Graph/);
    assert.match(buildOut, /Symbol Knowledge Graph built/);
    assert.match(buildOut, /Symbols Indexed/);

    const { stdout: queryOut } = await execFileAsync(process.execPath, [CLI_PATH, 'graph:query', 'startStudioServer']);
    assert.match(queryOut, /Query: "startStudioServer"/);
    assert.match(queryOut, /scripts\/studio-server\.mjs/);
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

  await t.test('vibes registry pack should audit custom skill against 155 gold standards', async () => {
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
    assert.equal(pkg.version, '4.3.0');
    assert.equal(pkg.contributes.commands.length >= 6, true);
    assert.ok(pkg.contributes.configuration.properties['vibes.studioPort']);
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

  await t.test('studio server should serve 155 skills, cockpit HTML, and Remote MCP SSE', async () => {
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
      assert.match(htmlText, /155-Skill Swarm Architecture/);
      assert.match(htmlText, /Remote Model Context Protocol/);

      const scriptMatch = htmlText.match(/<script\b[^>]*>([\s\S]*?)<\/script\b[^>]*>/i);
      assert.ok(scriptMatch, 'Cockpit HTML must contain <script> tag');
      assert.doesNotThrow(() => {
        new vm.Script(scriptMatch[1], { filename: 'cockpit-client.js' });
      }, 'Cockpit client script must parse without syntax errors');

      const skillsRes = await fetch(`${url}/api/skills`);
      const skills = await skillsRes.json();
      assert.equal(Array.isArray(skills), true);
      assert.equal(skills.length, 155);

      const statusRes = await fetch(`${url}/api/status`);
      const status = await statusRes.json();
      assert.equal(status.totalSkills, 155);
      assert.equal(status.version, '4.3.0');
      assert.equal(status.mcpToolsCount >= 10, true);

      const subagentsRes = await fetch(`${url}/api/subagents`);
      const subagents = await subagentsRes.json();
      assert.equal(subagents.length, 5);

      // Test Remote MCP execute endpoint
      const mcpExecRes = await fetch(`${url}/api/mcp/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: 'vibes_list_skills', arguments: {} })
      });
      const mcpData = await mcpExecRes.json();
      assert.equal(mcpExecRes.status, 200);
      assert.match(mcpData.result.result.content[0].text, /"total": 155/);

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

      // Test Studio Registry List endpoint
      const regListRes = await fetch(`${url}/api/registry/list`);
      const regListData = await regListRes.json();
      assert.equal(regListRes.status, 200);
      assert.equal(regListData.success, true);
      assert.ok(regListData.count >= 155);

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
});
