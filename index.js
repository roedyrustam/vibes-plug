/**
 * Vibes Plug - Universal AI Plugin with 145+ Specialized Skills
 * Platform support: Antigravity (AGY), Claude Code, and Cursor IDE
 */

const path = require('path');
const pluginJson = require('./plugin.json');

module.exports = {
  name: pluginJson.name,
  version: pluginJson.version,
  description: pluginJson.description,
  author: pluginJson.author,
  license: pluginJson.license,
  platforms: pluginJson.platforms,
  pluginRoot: path.resolve(__dirname),
  skillsPath: path.resolve(__dirname, 'skills'),
  scriptsPath: path.resolve(__dirname, 'scripts'),
};
