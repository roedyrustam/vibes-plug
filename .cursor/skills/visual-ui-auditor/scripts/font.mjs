#!/usr/bin/env node
// Self-host a font (performance + no third-party request): downloads woff2 files and prints
// @font-face CSS plus <link rel="preload"> tags, or with --next a next/font/local snippet.
//   node font.mjs fontshare <slug> <weights>        e.g. fontshare satoshi 400,500,700
//   node font.mjs google "<Family Name>" <weights>  e.g. google "Inter Tight" 400,600   (variable: 100..900)
//                                                   axes: google "Instrument Sans" "wdth,wght@75..100,400..700"
//   options: --italic  --ext (also latin-ext: Polish, Czech, Turkish...)  --dir public/fonts  --as "Display"
//            --next  write to src/fonts and print a next/font/local block for src/app/fonts.ts
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a === '--italic' || a === '--ext' || a === '--next'));
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i > -1 ? args[i + 1] : d; };
const [provider, family, weights = '400'] = args.filter((a, i) => !a.startsWith('--') && !['--dir', '--as'].includes(args[i - 1]));
if (!provider || !family) {
  console.error('usage: node font.mjs <fontshare|google> <family> <weights> [--italic] [--as Name] [--dir public/fonts]');
  process.exit(1);
}
const next = flags.has('--next');
const dir = path.resolve(opt('dir', next ? 'src/fonts' : 'public/fonts'));
fs.mkdirSync(dir, { recursive: true });
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

let cssUrl;
if (provider === 'fontshare') {
  const ws = weights.split(',').flatMap((w) => (flags.has('--italic') ? [w, `${+w + 1}`] : [w])).join(',');
  cssUrl = `https://api.fontshare.com/v2/css?f[]=${family}@${ws}&display=swap`;
} else if (provider === 'google') {
  // Raw axis spec passes through, e.g. "wdth,wght@75..100,400..700" for a width axis.
  const range = weights.includes('..') ? weights : weights.split(',').join(';');
  const axis = weights.includes('@') ? weights
    : flags.has('--italic') ? `ital,wght@${range.split(';').flatMap((w) => [`0,${w}`, `1,${w}`]).join(';')}` : `wght@${range}`;
  cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, '+')}:${axis}&display=swap`;
} else { console.error('provider must be fontshare or google'); process.exit(1); }

const res = await fetch(cssUrl, { headers: { 'user-agent': UA } });
if (!res.ok) { console.error(`font CSS request failed ${res.status}: ${cssUrl}`); process.exit(1); }
const css = await res.text();
const blocks = css.match(/@font-face\s*{[^}]+}/g) || [];
// Google splits by unicode subset; keep latin + latin-ext only.
const keep = blocks.filter((b, i) => provider !== 'google' || /\/\* latin(-ext)? \*\//.test(css.slice(css.lastIndexOf('/*', css.indexOf(b)), css.indexOf(b))) || !/unicode-range/.test(b));
const name = opt('as', family.replace(/(^|-)(\w)/g, (_, s, c) => (s ? ' ' : '') + c.toUpperCase()));
const out = [];
const preloads = [];
const local = [];
const seen = new Set();
const wanted = new Set(weights.split(','));
for (const b of keep) {
  const src = (b.match(/url\(['"]?([^'")]+\.woff2)['"]?\)/) || [])[1];
  if (!src) continue;
  const weight = (b.match(/font-weight:\s*([^;]+);/) || [])[1]?.trim() || '400';
  const style = (b.match(/font-style:\s*([^;]+);/) || [])[1]?.trim() || 'normal';
  const range = (b.match(/unicode-range:\s*([^;]+);/) || [])[1]?.trim();
  const stretch = (b.match(/font-stretch:\s*([^;]+);/) || [])[1]?.trim();
  const subset = range && /U\+0100/.test(range) && !/U\+0000/.test(range) ? '-ext' : '';
  if (subset && !flags.has('--ext')) continue;
  if (provider === 'fontshare' && !wanted.has(String(+weight - (style === 'italic' ? 1 : 0))) && !wanted.has(weight)) continue;
  const key = `${weight}|${style}|${subset}`;
  if (seen.has(key)) continue;
  seen.add(key);
  const file = `${name.toLowerCase().replace(/\s+/g, '-')}-${weight.replace(/\s+/g, '_')}-${style}${subset}.woff2`;
  const buf = Buffer.from(await (await fetch(src.startsWith('//') ? `https:${src}` : src, { headers: { 'user-agent': UA } })).arrayBuffer());
  fs.writeFileSync(path.join(dir, file), buf);
  out.push(`@font-face {\n  font-family: '${name}';\n  src: url('/fonts/${file}') format('woff2');\n  font-weight: ${weight};\n  font-style: ${style};${stretch ? `\n  font-stretch: ${stretch};` : ''}\n  font-display: swap;${range ? `\n  unicode-range: ${range};` : ''}\n}`);
  const rel = path.relative(path.resolve('src/app'), path.join(dir, file)).split(path.sep).join('/');
  local.push(`    { path: '${rel.startsWith('.') ? rel : `./${rel}`}', weight: '${weight}', style: '${style}' },`);
  if (!subset && style === 'normal') preloads.push(`<link rel="preload" href="/fonts/${file}" as="font" type="font/woff2" crossorigin />`);
  console.error(`saved ${file} (${Math.round(buf.length / 1024)} KB)`);
}
if (!out.length) { console.error('no woff2 found in provider CSS'); process.exit(1); }
if (next) {
  const id = name.replace(/[^a-z0-9]+(.)?/gi, (_, c) => (c ? c.toUpperCase() : '')).replace(/^./, (c) => c.toLowerCase());
  const cssVar = `--font-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  console.log(`// src/app/fonts.ts  (add ${id}.variable to <html className>, use var(${cssVar}) in CSS)
import localFont from 'next/font/local';
export const ${id} = localFont({
  src: [
${local.join('\n')}
  ],
  variable: '${cssVar}',
  display: 'swap',
});`);
  process.exit(0);
}
console.log(`/* ${family} (${provider}) */\n${out.join('\n')}`);
console.log(`\n<!-- preload in the layout <head> (only fonts used above the fold) -->\n${[...new Set(preloads)].slice(0, 2).join('\n')}`);
