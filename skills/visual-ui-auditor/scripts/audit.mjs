#!/usr/bin/env node
// Generated from jury/scripts/audit.mjs by tests/_gen/build.py; edit there, not here.
// Static audit of a production build: semantics/SEO, metadata, accessibility basics, page weight,
// leftover placeholders and AI-copy tells. Crawls same-origin links from the start page.
//   node audit.mjs <url | build-dir> [--max 40]
//     url:        a running production server, e.g. `next start` → http://127.0.0.1:4400/
//     build-dir:  a static output folder (dist/, out/); served internally
//   exit code 1 if any FAIL
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { serve } from './serve.mjs';

const args = process.argv.slice(2);
const target = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--max') || 'dist';
const maxPages = +(args[args.indexOf('--max') + 1] || 40) || 40;
let server = null;
let base = target;
if (!/^https?:\/\//.test(target)) {
  if (!fs.existsSync(target)) { console.error(`No build at ${path.resolve(target)} and not a URL. Build first, or pass the server URL.`); process.exit(1); }
  server = await serve(target, 0);
  base = `http://127.0.0.1:${server.address().port}/`;
}
const origin = new URL(base).origin;

const results = [];
const add = (level, where, msg) => results.push({ level, where, msg });
const strip = (html) => html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;|&#160;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&#x27;|&#39;|&rsquo;/g, "'")
  .replace(/\s+/g, ' ');
// Attributes as HTML parses them: double-quoted, single-quoted, unquoted (minifiers drop quotes:
// <html lang=en>) or bare (<img alt>, an empty value).
const ATTR = /\s([^\s"'>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
const attrs = (tag) => {
  const out = {};
  for (const m of tag.replace(/^<[^\s>]+/, '').matchAll(ATTR)) out[m[1].toLowerCase()] ??= m[2] ?? m[3] ?? m[4] ?? '';
  return out;
};
const attr = (tag, name) => attrs(tag)[name] ?? null;
const TAG_BODY = `(?:"[^"]*"|'[^']*'|[^'">])*`; // a '>' inside a quoted value does not end the tag
const tags = (html, name) => html.match(new RegExp(`<${name}\\b${TAG_BODY}>`, 'gi')) || [];
const rels = (tag) => (attr(tag, 'rel') || '').toLowerCase().split(/\s+/);
const meta = (html, key) => {
  const tag = tags(html, 'meta').find((t) => [attr(t, 'name'), attr(t, 'property')].some((v) => v?.toLowerCase() === key));
  return tag ? attr(tag, 'content') : null;
};
const onSite = (u) => { const x = new URL(u); return new URL(x.pathname + x.search, origin).href; }; // production URLs → local server
const get = async (u) => {
  try {
    const r = await fetch(u, { redirect: 'follow' });
    return { status: r.status, type: r.headers.get('content-type') || '', body: Buffer.from(await r.arrayBuffer()), url: r.url };
  } catch (e) { return { status: 0, type: '', body: Buffer.alloc(0), url: u, error: e.message }; }
};

const PLACEHOLDERS = [/lorem ipsum/i, /\bName Surname\b/, /example\.com/, /Replace with/i, /\bTODO\b/, /\bAcme\b/, /\bJohn Doe\b/i, /\bJane Doe\b/i, /One plain sentence about/i];
const TELLS = [
  [/\b(elevate|seamless(ly)?|unleash|revolutioni[sz]e|cutting-edge|next-gen|synergy|game-chang)/i, 'filler marketing verb'],
  [/\b(crafting digital experiences|pixel[- ]perfect|passionate about)\b/i, 'portfolio cliche'],
  [/scroll to explore/i, 'generic scroll cue copy'],
  // Page text is one line, so both phrases stop at sentence ends to avoid matching across sentences.
  [/\bwhere\s+(?:[^\s.!?]+\s+){1,3}meets?\s+[^\s.!?,;:]+/i, 'portfolio cliche'],
  [/\b(?:not|\w+n['’]t)\s+just\b[^.!?]{1,80}?\bbut\b/i, 'portfolio cliche'],
];

// Crawl
const pages = new Map(); // url → html
const queue = [new URL(base).href];
const seen = new Set(queue);
while (queue.length && pages.size < maxPages) {
  const u = queue.shift();
  const r = await get(u);
  if (r.status >= 400 || r.status === 0) { add('FAIL', new URL(u).pathname, `HTTP ${r.status || r.error} for an internal link`); continue; }
  if (!r.type.includes('html')) continue;
  const html = r.body.toString('utf8');
  pages.set(u, html);
  for (const a of tags(html, 'a')) {
    const href = attr(a, 'href');
    if (!href || href.startsWith('#')) continue;
    let next;
    try { next = new URL(href.replace(/&amp;/g, '&'), u); } catch { continue; }
    next.hash = ''; next.search = '';
    if (next.origin !== origin || seen.has(next.href) || /\.(?!html?$)[a-z0-9]{2,5}$/i.test(next.pathname)) continue;
    seen.add(next.href);
    queue.push(next.href);
  }
}
if (!pages.size) { console.error(`Could not load ${base}`); add('FAIL', 'site', `start page ${base} did not load as HTML`); }

for (const [u, html] of pages) {
  const where = new URL(u).pathname;
  const head = html.match(/<head[\s\S]*?<\/head>/i)?.[0] || '';
  const text = strip(html.replace(/<head[\s\S]*?<\/head>/i, ''));
  if (!attr(tags(html, 'html')[0] || '', 'lang')?.trim()) add('FAIL', where, '<html> has no lang');
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]?.trim();
  if (!title) add('FAIL', where, 'missing <title>');
  else if (title.length > 70) add('WARN', where, `title is ${title.length} chars (keep <= 70)`);
  const desc = meta(html, 'description');
  if (!desc) add('FAIL', where, 'missing meta description');
  else if (desc.length < 50 || desc.length > 170) add('WARN', where, `meta description is ${desc.length} chars (aim 50-160)`);
  const links = tags(html, 'link');
  if (!links.some((t) => rels(t).includes('canonical'))) add('WARN', where, 'no canonical link');
  for (const k of ['og:title', 'og:description', 'og:image', 'twitter:card']) if (!meta(html, k)) add('WARN', where, `missing ${k}`);
  if (!tags(html, 'meta').some((t) => attr(t, 'name')?.toLowerCase() === 'viewport')) add('FAIL', where, 'missing viewport meta');
  if (!links.some((t) => rels(t).includes('icon'))) add('WARN', where, 'no favicon link');

  const h1s = html.match(/<h1[\s>]/gi) || [];
  if (h1s.length !== 1) add('FAIL', where, `${h1s.length} <h1> elements (want exactly 1)`);
  const levels = [...html.matchAll(/<h([1-6])[\s>]/gi)].map((m) => +m[1]);
  for (let i = 1; i < levels.length; i++) if (levels[i] > levels[i - 1] + 1) { add('WARN', where, `heading level skips h${levels[i - 1]} -> h${levels[i]}`); break; }
  if (!/<main[\s>]/i.test(html)) add('FAIL', where, 'no <main> landmark');

  for (const tag of tags(html, 'img')) {
    const src = attr(tag, 'src') || '';
    if (attr(tag, 'alt') === null) add('FAIL', where, `img without alt: ${src.slice(0, 60)}`);
    if (!attr(tag, 'width') && !/\bfill\b|position:\s*absolute/.test(tag)) add('WARN', where, `img without width/height (layout shift): ${src.slice(0, 60)}`);
  }
  for (const m of html.matchAll(new RegExp(`<a\\b(${TAG_BODY})>([\\s\\S]*?)</a>`, 'gi'))) {
    const a = `<a ${m[1]}>`;
    if (!strip(m[2]).trim() && attr(a, 'aria-label') === null && !tags(m[2], 'img').some((t) => attr(t, 'alt')?.trim())) add('FAIL', where, `link with no accessible name: ${attr(a, 'href')}`);
    if (attr(a, 'target')?.toLowerCase() === '_blank' && !rels(a).includes('noopener')) add('WARN', where, 'target=_blank without rel=noopener');
  }
  for (const m of html.matchAll(new RegExp(`<button\\b(${TAG_BODY})>([\\s\\S]*?)</button>`, 'gi'))) {
    if (!strip(m[2]).trim() && attr(`<button ${m[1]}>`, 'aria-label') === null) add('FAIL', where, 'button with no accessible name');
  }
  if (/<div[^>]+onclick=/i.test(html)) add('FAIL', where, 'clickable <div> (use <button> or <a>)');

  const dashes = (text.match(/[—–]/g) || []).length;
  if (dashes) add('WARN', where, `${dashes} em/en dash(es) in visible text (read as AI tell; rewrite)`);
  for (const re of PLACEHOLDERS) if (re.test(text) || re.test(head)) add('FAIL', where, `placeholder content: ${re}`);
  for (const [re, why] of TELLS) { const m = text.match(re); if (m) add('WARN', where, `${why}: "${m[0]}"`); }
  // The same sentence twice on one page reads as filler (e.g. hero line repeated in about).
  const body = html.replace(/<head[\s\S]*?<\/head>/i, '').replace(/<script[\s\S]*?<\/script>/gi, '');
  const sentences = [...body.matchAll(/<(p|h[1-6]|li|blockquote|figcaption|dd)\b[^>]*>([\s\S]*?)<\/\1>/gi)]
    .flatMap((m) => strip(m[2]).split(/(?<=[.!?])\s+/))
    .map((s) => s.trim())
    .filter((s) => s.split(' ').length >= 6);
  const counts = new Map();
  for (const s of sentences) counts.set(s, (counts.get(s) || 0) + 1);
  for (const [s, n] of counts) if (n > 1) add('WARN', where, `sentence repeated ${n}x: "${s.slice(0, 70)}"`);
  // Headings must read cleanly: visual duplicates (shadows, outlines) belong outside them.
  for (const m of html.matchAll(/<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi)) {
    const t = strip(m[2]).trim().split(' ').filter(Boolean);
    const half = t.length / 2;
    if (t.length >= 2 && t.length % 2 === 0 && t.slice(0, half).join(' ').toLowerCase() === t.slice(half).join(' ').toLowerCase()) add('FAIL', where, `<h${m[1]}> text is duplicated ("${t.join(' ')}"): move decorative copies out of the heading`);
  }
  const words = text.split(' ').filter(Boolean).length;
  if (words < 60) add('WARN', where, `only ${words} words of visible text (thin content)`);
}

// Site level (skipped when the start page did not load: every check would fail with it)
if (pages.size) {
  const missing = await get(new URL(`/__audit-missing-${Date.now()}`, origin).href);
  if (missing.status !== 404) add('FAIL', 'site', `a missing URL returned HTTP ${missing.status}, not 404`);
  else if (!/<h1[\s>]/i.test(missing.body.toString('utf8'))) add('WARN', 'site', '404 page has no <h1> (design it: a way back, in the site voice)');
  const robots = await get(new URL('/robots.txt', origin).href);
  if (robots.status !== 200) add('WARN', 'site', 'no robots.txt');
  else if (/example\.com/.test(robots.body.toString())) add('WARN', 'site', 'robots.txt still points at example.com');
  const maps = [...robots.body.toString().matchAll(/^sitemap:\s*(\S+)/gim)].map((m) => onSite(m[1]));
  let sitemapOk = false;
  for (const u of [...maps, new URL('/sitemap.xml', origin).href, new URL('/sitemap-index.xml', origin).href]) if ((await get(u)).status === 200) { sitemapOk = true; break; }
  if (!sitemapOk) add('WARN', 'site', 'no sitemap');
  const ogs = new Set([...pages.values()].map((h) => meta(h, 'og:image')).filter(Boolean));
  // As written (a live site, or a CDN), else mapped onto this server (a local build whose tags
  // already point at the production domain).
  const isImage = (r) => r.status === 200 && r.type.startsWith('image/');
  for (const og of ogs) {
    const abs = new URL(og, origin).href;
    if (!isImage(await get(abs)) && !isImage(await get(onSite(abs)))) add('FAIL', 'site', `og:image ${abs} does not load (create a 1200x630 image)`);
  }
}

// Weight: what each page actually downloads (gzip size for text assets).
const sizes = new Map();
const kb = (b) => Math.round(b / 1024);
async function size(u) {
  if (sizes.has(u)) return sizes.get(u);
  const r = await get(u);
  const text = /javascript|css|html|json|svg/.test(r.type);
  const entry = { bytes: r.status === 200 ? (text ? zlib.gzipSync(r.body).length : r.body.length) : 0, type: r.type, body: r.body, url: u };
  sizes.set(u, entry);
  return entry;
}
const pick = (tag) => {
  const set = attr(tag, 'srcset');
  if (set) {
    const c = set.split(',').map((s) => s.trim().split(/\s+/)).map(([u, d]) => ({ u, w: parseFloat(d) || 0 })).filter((c) => c.u).sort((a, b) => a.w - b.w);
    return (c.find((x) => x.w >= 1440) || c[c.length - 1])?.u;
  }
  return attr(tag, 'src');
};
let worst = null;
for (const [u, html] of pages) {
  const where = new URL(u).pathname;
  const res = (list) => list.filter(Boolean).map((x) => new URL(x.replace(/&amp;/g, '&'), u).href);
  const links = tags(html, 'link');
  const js = res(tags(html, 'script').map((t) => attr(t, 'src')));
  const css = res(links.filter((t) => rels(t).includes('stylesheet')).map((t) => attr(t, 'href')));
  const preFonts = res(links.map((t) => attr(t, 'href')).filter((h) => /\.(?:woff2?|ttf|otf)$/i.test(h || '')));
  const imgs = res(tags(html, 'img').map(pick));
  const tally = { html: (await size(u)).bytes, js: 0, css: 0, fonts: 0, img: 0 };
  for (const x of new Set(js)) tally.js += (await size(x)).bytes;
  const fonts = new Set(preFonts);
  for (const x of new Set(css)) {
    const c = await size(x);
    tally.css += c.bytes;
    // Fonts the latin page will fetch: @font-face without unicode-range or covering basic latin.
    for (const face of c.body.toString().match(/@font-face\s*{[^}]+}/g) || []) {
      const range = face.match(/unicode-range:\s*([^;}]+)/)?.[1];
      if (range && !/U\+0000|U\+0020|U\+00?20-/i.test(range)) continue;
      const f = face.match(/url\(["']?([^"')]+\.(?:woff2?|ttf|otf))/)?.[1];
      if (f) fonts.add(new URL(f, x).href);
    }
  }
  for (const f of fonts) { tally.fonts += (await size(f)).bytes; if (/\.(ttf|otf)$/.test(f)) add('WARN', where, `ttf/otf font shipped: ${path.basename(f)} (use woff2)`); }
  for (const x of new Set(imgs)) {
    const s = (await size(x)).bytes;
    tally.img += s;
    if (s > 500 * 1024) add('WARN', where, `image ${kb(s)} KB: ${x.replace(origin, '').slice(0, 70)} (compress, AVIF/WebP, smaller variant)`);
  }
  const total = tally.html + tally.js + tally.css + tally.fonts + tally.img;
  if (kb(tally.js) > 300) add('WARN', where, `JS ${kb(tally.js)} KB gzipped (aim < 300 KB; lazy-load heavy libraries)`);
  if (kb(tally.fonts) > 300) add('WARN', where, `fonts ${kb(tally.fonts)} KB (fewer weights, variable font, subset)`);
  if (kb(total) > 3000) add('WARN', where, `page weight ~${kb(total)} KB (aim < 3 MB)`);
  if (!worst || total > worst.total) worst = { where, total, ...tally };
}

const order = { FAIL: 0, WARN: 1 };
results.sort((a, b) => order[a.level] - order[b.level]);
for (const r of results) console.log(`${r.level.padEnd(4)}  ${r.where.padEnd(28)}  ${r.msg}`);
const fails = results.filter((r) => r.level === 'FAIL').length;
console.log(`\n${pages.size} pages crawled from ${base}`);
if (worst) console.log(`heaviest page ${worst.where}: ~${kb(worst.total)} KB | html ${kb(worst.html)} | JS ${kb(worst.js)} (gz) | CSS ${kb(worst.css)} (gz) | fonts ${kb(worst.fonts)} | images ${kb(worst.img)}`);
console.log(`${fails} FAIL, ${results.length - fails} WARN`);
// Let Node exit on its own: process.exit() right after fetch() aborts Node on Windows (libuv
// UV_HANDLE_CLOSING assertion, exit code 127) instead of returning this code.
server?.closeAllConnections();
server?.close();
process.exitCode = fails ? 1 : 0;
