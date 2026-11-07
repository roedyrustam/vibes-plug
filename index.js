/**
 * Vibes Plug - Universal AI Plugin with 178 Specialized Skills & 9 Autonomous Subagents
 * Platform support: Antigravity (AGY), Claude Code, Cursor IDE, Windsurf, Trae, and OpenAI Codex
 */

const path = require('path');
const pluginJson = require('./plugin.json');

module.exports = {
  name: pluginJson.name,
  version: pluginJson.version,
  description: pluginJson.description,
  author: pluginJson.author,
  license: pluginJson.license,
  platforms: pluginJson.platforms || pluginJson.extensions?.['org.vibesplug.platforms'],
  pluginRoot: path.resolve(__dirname),
  skillsPath: path.resolve(__dirname, 'skills'),
  agentsPath: path.resolve(__dirname, 'agents'),
  scriptsPath: path.resolve(__dirname, 'scripts'),
  mcpServerPath: path.resolve(__dirname, 'bin', 'mcp-server.mjs'),
};
