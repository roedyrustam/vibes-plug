/**
 * VibesPlug Pro VSCode & Cursor Extension Companion (2026 Edition)
 * 
 * Provides native IDE command integration for Vibes-Plug:
 * - Status bar indicator for 155 active skills
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

  // 1. Status Bar Item
  const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBar.text = '$(zap) VibesPlug: 155 Skills';
  statusBar.tooltip = 'VibesPlug Pro: 155-Skill AI Swarm Orchestrator active. Click to open Studio Cockpit.';
  statusBar.command = 'vibes.openStudio';
  statusBar.show();
  context.subscriptions.push(statusBar);

  // 2. Open Studio Cockpit
  const openStudioCmd = vscode.commands.registerCommand('vibes.openStudio', () => {
    const config = vscode.workspace.getConfiguration('vibes');
    const port = config.get('studioPort') || 3888;
    const url = `http://localhost:${port}`;
    vscode.env.openExternal(vscode.Uri.parse(url));
    runInTerminal(`npx vibes-plug studio --port ${port}`, 'Vibes Studio');
  });
  context.subscriptions.push(openStudioCmd);

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
}

/**
 * Deactivates the extension
 */
export function deactivate() {}
