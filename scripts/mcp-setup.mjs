#!/usr/bin/env node

/**
 * Vibes-Plug MCP Auto-Configurator
 * Automatically generates, inspects, and injects Model Context Protocol (MCP v1.x)
 * client configurations for Claude Desktop, Cursor, Windsurf, and Zed.
 * 
 * Usage:
 *   node scripts/mcp-setup.mjs [--client claude|cursor|windsurf|zed|all] [--dry-run] [--force]
 *   vibes mcp:setup [--client <name>] [--dry-run]
 * 
 * @author Roedy Rustam
 * @version 4.4.0
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');
const MCP_SERVER_BIN = path.join(PLUGIN_ROOT, 'bin', 'mcp-server.mjs');

/**
 * Returns canonical MCP server snippet
 * @param {string} serverBinPath 
 * @returns {Object}
 */
export function getMcpServerDefinition(serverBinPath = MCP_SERVER_BIN) {
  return {
    command: 'node',
    args: [path.resolve(serverBinPath)]
  };
}

/**
 * Detects known config file paths across platforms
 * @returns {Object}
 */
export function detectClientConfigPaths() {
  const home = os.homedir();
  const platform = process.platform;

  let claudeConfig = '';
  if (platform === 'win32') {
    claudeConfig = path.join(process.env.APPDATA || path.join(home, 'AppData', 'Roaming'), 'Claude', 'claude_desktop_config.json');
  } else if (platform === 'darwin') {
    claudeConfig = path.join(home, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
  } else {
    claudeConfig = path.join(home, '.config', 'Claude', 'claude_desktop_config.json');
  }

  return {
    claude: {
      name: 'Claude Desktop',
      configPath: claudeConfig,
      keyName: 'mcpServers'
    },
    cursor: {
      name: 'Cursor IDE',
      configPath: path.join(home, '.cursor', 'mcp.json'),
      keyName: 'mcpServers'
    },
    windsurf: {
      name: 'Windsurf',
      configPath: path.join(home, '.codeium', 'windsurf', 'mcp_config.json'),
      keyName: 'mcpServers'
    },
    zed: {
      name: 'Zed Editor',
      configPath: platform === 'win32'
        ? path.join(process.env.APPDATA || path.join(home, 'AppData', 'Roaming'), 'Zed', 'settings.json')
        : path.join(home, '.config', 'zed', 'settings.json'),
      keyName: 'context_servers'
    }
  };
}

/**
 * Injects or updates MCP configuration for a specific client
 * @param {string} clientKey 
 * @param {Object} options 
 * @returns {Promise<Object>}
 */
export async function configureClient(clientKey, options = {}) {
  const { dryRun = false, force = false, serverBin = MCP_SERVER_BIN } = options;
  const clients = detectClientConfigPaths();
  const client = clients[clientKey];

  if (!client) {
    throw new Error(`Unsupported MCP client: '${clientKey}'. Supported: ${Object.keys(clients).join(', ')}`);
  }

  const serverDef = getMcpServerDefinition(serverBin);
  const targetPath = client.configPath;

  let currentConfig = {};
  let fileExisted = false;

  try {
    const raw = await fs.readFile(targetPath, 'utf8');
    currentConfig = JSON.parse(raw);
    fileExisted = true;
  } catch (err) {
    if (err.code !== 'ENOENT') {
      return {
        client: client.name,
        targetPath,
        status: 'error',
        message: `Failed to parse existing JSON: ${err.message}`
      };
    }
    currentConfig = {};
  }

  const key = client.keyName;
  if (!currentConfig[key] || typeof currentConfig[key] !== 'object') {
    currentConfig[key] = {};
  }

  const alreadyConfigured = currentConfig[key]['vibes-plug-mcp'] && !force;

  if (alreadyConfigured) {
    return {
      client: client.name,
      targetPath,
      status: 'already_configured',
      snippet: currentConfig[key]['vibes-plug-mcp'],
      message: `'vibes-plug-mcp' is already registered in ${targetPath}`
    };
  }

  currentConfig[key]['vibes-plug-mcp'] = serverDef;

  if (dryRun) {
    return {
      client: client.name,
      targetPath,
      status: 'dry_run',
      snippet: serverDef,
      previewJson: JSON.stringify(currentConfig, null, 2),
      message: `[DRY-RUN] Would write config to ${targetPath}`
    };
  }

  try {
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, JSON.stringify(currentConfig, null, 2) + '\n', 'utf8');
    return {
      client: client.name,
      targetPath,
      status: fileExisted ? 'updated' : 'created',
      snippet: serverDef,
      message: `Successfully ${fileExisted ? 'updated' : 'created'} MCP configuration at ${targetPath}`
    };
  } catch (err) {
    return {
      client: client.name,
      targetPath,
      status: 'error',
      message: `Failed to write file: ${err.message}`
    };
  }
}

/**
 * Configures all or selected clients
 * @param {Object} options 
 * @returns {Promise<Array>}
 */
export async function setupAllClients(options = {}) {
  const clients = detectClientConfigPaths();
  const targetClient = options.client || 'all';

  if (targetClient !== 'all') {
    const result = await configureClient(targetClient, options);
    return [result];
  }

  const results = [];
  for (const clientKey of Object.keys(clients)) {
    const res = await configureClient(clientKey, options);
    results.push(res);
  }
  return results;
}

// CLI Execution entry point
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const clientIdx = args.indexOf('--client');
  const client = clientIdx !== -1 ? args[clientIdx + 1] : 'all';
  const dryRun = args.includes('--dry-run') || args.includes('-d');
  const force = args.includes('--force') || args.includes('-f');
  const printOnly = args.includes('--print');

  console.log(`
╔══════════════════════════════════════════════════════════╗
║    📡 Vibes-Plug MCP Client Auto-Configurator            ║
║    Model Context Protocol (v1.x) Ecosystem Link          ║
╚══════════════════════════════════════════════════════════╝
`);

  if (printOnly) {
    console.log('📋 Universal MCP Server JSON Snippet:\n');
    console.log(JSON.stringify({
      mcpServers: {
        'vibes-plug-mcp': getMcpServerDefinition()
      }
    }, null, 2));
    process.exit(0);
  }

  setupAllClients({ client, dryRun, force })
    .then((results) => {
      for (const r of results) {
        const icon = r.status === 'created' || r.status === 'updated' ? '✅' :
                     r.status === 'already_configured' ? '⚡' :
                     r.status === 'dry_run' ? '🔍' : '⚠️';
        console.log(`${icon} [${r.client}] -> ${r.message}`);
        console.log(`   File: ${r.targetPath}\n`);
      }
    })
    .catch((err) => {
      console.error(`❌ Setup Error: ${err.message}`);
      process.exit(1);
    });
}
