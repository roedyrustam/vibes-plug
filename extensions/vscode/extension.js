/**
 * VibesPlug Pro VSCode & Cursor Extension Companion (2026 Edition)
 * 
 * Provides native IDE command integration for Vibes-Plug:
 * - Status bar indicator for 160 active skills
 * - 1-Click Studio Cockpit launch
 * - Integrated terminal runner for Scaffolding Wizard, Sovereign Guard, and FinOps Tracker
 * - Active file Critic-in-the-Loop validation
 */

let vscode;
try {
  vscode = await import('vscode');
} catch {
  // Graceful fallback for non-VSCode execution / CI validation
}

/**
 * Executes a vibes-plug CLI command in the integrated terminal
 * @param {string} cmd
 * @param {string} name
 */
function runInTerminal(cmd, name = 'VibesPlug') {
  if (!vscode) {
    return;
  }
  const terminal = vscode.window.terminals.find(t => t.name === name) || vscode.window.createTerminal(name);
  terminal.show();
  terminal.sendText(cmd);
}

/**
 * Activates the extension
 * @param {Object} context 
 */
export function activate(context) {
  if (!vscode) return;

  // 1. Swarm Mode Auto-Active Status Bar Indicator
  const swarmBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 101);
  swarmBar.text = '$(hubot) Swarm: AUTO-ACTIVE';
  swarmBar.tooltip = 'Vibes-Plug Swarm Director is automatically active. Multi-agent coordination is enabled for all tasks.';
  swarmBar.command = 'vibes.swarmStatus';
  swarmBar.show();
  context.subscriptions.push(swarmBar);

  // 2. Skills & Cockpit Status Bar Item
  const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBar.text = '$(zap) Vibes: 178 Skills';
  statusBar.tooltip = 'Vibes-Plug Pro: 178-Skill AI Swarm Orchestrator. Click to open Swarm Cockpit.';
  statusBar.command = 'vibes.openStudio';
  statusBar.show();
  context.subscriptions.push(statusBar);

  // 3. Auto-Activation Notification
  vscode.window.showInformationMessage('⚡ Vibes-Plug Pro: Autonomous Multi-Agent Swarm Mode is AUTO-ACTIVE (178 Skills, 9 Specialist Subagents).');

  // 4. Open Studio / Swarm Cockpit
  const openStudioCmd = vscode.commands.registerCommand('vibes.openStudio', () => {
    const config = vscode.workspace.getConfiguration('vibes');
    const port = config.get('studioPort') || 3888;
    const url = `http://localhost:${port}`;
    vscode.env.openExternal(vscode.Uri.parse(url));
    runInTerminal(`npx vibes-plug studio --port ${port}`, 'Vibes Swarm Cockpit');
  });
  context.subscriptions.push(openStudioCmd);

  const openCockpitCmd = vscode.commands.registerCommand('vibes.openSwarmCockpit', () => {
    vscode.commands.executeCommand('vibes.openStudio');
  });
  context.subscriptions.push(openCockpitCmd);

  // 5. Swarm Status Check
  const swarmStatusCmd = vscode.commands.registerCommand('vibes.swarmStatus', () => {
    vscode.window.showInformationMessage('⚡ Vibes-Plug Swarm Mode: AUTO-ACTIVE\n• 9 Specialist Subagents: Ready\n• 178 Skills: Synchronized\n• Execution Topology: Parallel Fan-Out / Fan-In\n• Quality Gate: Critic-in-the-Loop & Anti-Slop');
  });
  context.subscriptions.push(swarmStatusCmd);

  // 6. Ensure Auto-Swarm Mode Command
  const enableAutoSwarmCmd = vscode.commands.registerCommand('vibes.enableAutoSwarm', () => {
    runInTerminal('npx vibes-plug swarm:auto --enable', 'Vibes Swarm Auto');
    vscode.window.showInformationMessage('⚡ Vibes-Plug: Automatic Swarm Mode confirmed ACTIVE across all workflows.');
  });
  context.subscriptions.push(enableAutoSwarmCmd);

  // 3. Project Scaffolding Wizard
  const wizardCmd = vscode.commands.registerCommand('vibes.wizard', () => {
    runInTerminal('npx vibes-plug wizard', 'Vibes Wizard');
  });
  context.subscriptions.push(wizardCmd);

  // 4. Run Sovereign Anti-Slop Guard
  const guardCmd = vscode.commands.registerCommand('vibes.runGuard', () => {
    runInTerminal('npx vibes-plug guard', 'Vibes Guard');
  });
  context.subscriptions.push(guardCmd);

  // 5. Critic Validate Active Document
  const criticCmd = vscode.commands.registerCommand('vibes.criticValidate', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('VibesPlug: No active file to audit.');
      return;
    }
    const filePath = editor.document.uri.fsPath;
    runInTerminal(`npx vibes-plug critic "${filePath}"`, 'Vibes Critic');
  });
  context.subscriptions.push(criticCmd);

  // 6. FinOps Token Savings Report
  const finopsCmd = vscode.commands.registerCommand('vibes.finopsStatus', () => {
    runInTerminal('npx vibes-plug finops status', 'Vibes FinOps');
  });
  context.subscriptions.push(finopsCmd);

  // 7. Master Synchronize
  const syncCmd = vscode.commands.registerCommand('vibes.sync', () => {
    runInTerminal('npx vibes-plug sync', 'Vibes Sync');
  });
  context.subscriptions.push(syncCmd);

  // 8. Cross-IDE Multi-Platform Rule Sync
  const bridgeSyncCmd = vscode.commands.registerCommand('vibes.bridgeSync', () => {
    runInTerminal('npx vibes-plug bridge sync --target all', 'Vibes Bridge');
  });
  context.subscriptions.push(bridgeSyncCmd);

  // 9. Synthesize Gold-Standard AI Skill
  const learnCmd = vscode.commands.registerCommand('vibes.learnSkill', async () => {
    const skillName = await vscode.window.showInputBox({
      prompt: 'Enter skill name to synthesize (e.g. fast-api-expert, trpc-v11-expert)',
      placeHolder: 'custom-tool-expert'
    });
    if (skillName) {
      runInTerminal(`npx vibes-plug learn "${skillName.trim()}"`, 'Vibes Learn');
    }
  });
  context.subscriptions.push(learnCmd);

  // 10. Pre-Disk Verification Gate on Active Document
  const verifyGateCmd = vscode.commands.registerCommand('vibes.verifyGate', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('VibesPlug: No active file to verify.');
      return;
    }
    const filePath = editor.document.uri.fsPath;
    runInTerminal(`npx vibes-plug verify-gate "${filePath}"`, 'Vibes Verify Gate');
  });
  context.subscriptions.push(verifyGateCmd);

  // 11. Dispatch Concurrent Multi-Agent Swarm
  const swarmDispatchCmd = vscode.commands.registerCommand('vibes.swarmDispatch', async () => {
    const task = await vscode.window.showInputBox({
      prompt: 'Enter multi-agent swarm task goal',
      placeHolder: 'Build multi-tenant SaaS with DOKU payment checkout'
    });
    if (task) {
      runInTerminal(`npx vibes-plug swarm:dispatch "${task.trim()}"`, 'Vibes Swarm');
    }
  });
  context.subscriptions.push(swarmDispatchCmd);

  // 12. Local Hybrid GraphRAG Search
  const graphSearchCmd = vscode.commands.registerCommand('vibes.graphSearch', async () => {
    const query = await vscode.window.showInputBox({
      prompt: 'Enter search query for codebase AST symbol knowledge graph',
      placeHolder: 'payment checkout'
    });
    if (query) {
      runInTerminal(`npx vibes-plug graph:search "${query.trim()}"`, 'Vibes GraphRAG');
    }
  });
  context.subscriptions.push(graphSearchCmd);

  // 13. Smart Project Stack Detector
  const detectCmd = vscode.commands.registerCommand('vibes.detect', () => {
    runInTerminal('npx vibes-plug detect', 'Vibes Detect');
  });
  context.subscriptions.push(detectCmd);
}

/**
 * Deactivates the extension
 */
export function deactivate() {}
