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
