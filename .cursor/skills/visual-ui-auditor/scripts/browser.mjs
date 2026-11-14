// Generated from jury/scripts/browser.mjs by tests/_gen/build.py; edit there, not here.
// Resolve a Chromium for Playwright without forcing a download: bundled → any cached build →
// system Chrome/Edge. Requires `playwright` (or `playwright-core`) resolvable from the project.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';

const req = createRequire(path.join(process.cwd(), 'noop.js'));
async function loadPlaywright() {
  for (const name of ['playwright', 'playwright-core']) {
    try { return await import(req.resolve(name).replace(/\\/g, '/').replace(/^([A-Za-z]):/, 'file:///$1:')); } catch (err) { void err; }
    try { return await import(name); } catch (err) { void err; }
  }
  console.error('Playwright not found. Run in the project: npm i -D playwright');
  process.exit(1);
}

function cachedChromes() {
  const roots = [
    process.env.PLAYWRIGHT_BROWSERS_PATH,
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'ms-playwright'),
    path.join(os.homedir(), '.cache', 'ms-playwright'),
    path.join(os.homedir(), 'Library', 'Caches', 'ms-playwright'),
  ].filter(Boolean);
  const found = [];
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    for (const dir of fs.readdirSync(root).filter((d) => /^chromium-\d+/.test(d)).sort().reverse()) {
      for (const rel of ['chrome-win64/chrome.exe', 'chrome-win/chrome.exe', 'chrome-linux64/chrome', 'chrome-linux/chrome',
        'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
        'chrome-mac/Chromium.app/Contents/MacOS/Chromium']) {
        const p = path.join(root, dir, rel);
        if (fs.existsSync(p)) found.push(p);
      }
    }
  }
  return found;
}

export async function launch() {
  const pw = await loadPlaywright();
  const chromium = pw.chromium || pw.default?.chromium;
  const args = ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
  try { return await chromium.launch({ args }); } catch (err) { void err; }
  for (const executablePath of cachedChromes()) {
    try { return await chromium.launch({ executablePath, args }); } catch (err) { void err; }
  }
  for (const channel of ['chrome', 'msedge']) {
    try { return await chromium.launch({ channel, args }); } catch (err) { void err; }
  }
  console.error('No Chromium found. Run: npx playwright install chromium');
  process.exit(1);
}
