#!/usr/bin/env node
// Render a 1200x630 Open Graph image from the live hero (after the loader), into public/og.png.
//   node og.mjs <url> [--out public/og.png] [--wait 4500]
import path from 'node:path';
import { launch } from './browser.mjs';

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith('--'));
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i > -1 ? args[i + 1] : d; };
if (!url) { console.error('usage: node og.mjs <url> [--out public/og.png]'); process.exit(1); }
const out = path.resolve(opt('out', 'public/og.png'));
const browser = await launch();
const page = await (await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })).newPage();
await page.goto(url, { waitUntil: 'load' });
await page.waitForFunction(() => { const l = document.getElementById('loader'); return !l || l.hidden || getComputedStyle(l).display === 'none'; }, null, { timeout: 9000 }).catch(() => {});
await page.waitForTimeout(+opt('wait', '2500'));
await page.evaluate(() => document.getElementById('cursor')?.remove());
await page.screenshot({ path: out });
await browser.close();
console.log(`wrote ${out}`);
