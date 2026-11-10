#!/usr/bin/env node
// Generated from jury/scripts/shoot.mjs by tests/_gen/build.py; edit there, not here.
// Visual QA: screenshots a running site the way a visitor experiences it (any framework).
//   node shoot.mjs <url> [--out .shots] [--steps 6] [--nav] [--crawl] [--max 8] [--tabs 12] [--hovers 8] [--no-throttle]
// Per page: desktop frames (the first screen once it is still, then scroll steps), mobile frames
// on a throttled mid-range phone (4x CPU, slow 4G), reduced-motion frames, keyboard-focus frames,
// rest/hover pairs per pointer target, page-transition frames (--nav clicks an internal link), plus
// report.json with console errors, failed requests, LCP/CLS, FPS, layout metrics, axe-core
// violations, the tab order, how each hover target reacts, whether anything moves at rest, and
// when the first screen stopped changing (an intro without a #loader is waited out, up to a cap).
// The hover pass adds about 3 s per target; --hovers 0 skips the targets (idle check still runs).
// --crawl shoots one page of every type plus the 404 into <out>/<page>/ and writes summary.json.
// Read every PNG it writes.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { launch } from './browser.mjs';

const args = process.argv.slice(2);
const valued = ['--out', '--steps', '--max', '--tabs', '--hovers'];
const url = args.find((a, i) => !a.startsWith('--') && !valued.includes(args[i - 1]));
if (!url) { console.error('usage: node shoot.mjs <url> [--out dir] [--steps n] [--nav] [--crawl] [--max n] [--tabs n] [--hovers n] [--no-throttle]'); process.exit(1); }
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i > -1 ? args[i + 1] : d; };
const outRoot = path.resolve(opt('out', '.shots'));
const steps = parseInt(opt('steps', '6'), 10);
const tabs = parseInt(opt('tabs', '12'), 10);
const hovers = parseInt(opt('hovers', '8'), 10);
const nav = args.includes('--nav');
const crawl = args.includes('--crawl');
const throttle = !args.includes('--no-throttle');

// axe-core from the project, else a pinned CDN copy checked against its hash (the same file as in
// the npm tarball), so runs are reproducible and a changed file is never run; without either the
// a11y pass is skipped. To bump: new version, and the sha384 of its axe.min.js.
const AXE_CDN = { url: 'https://cdn.jsdelivr.net/npm/axe-core@4.14.0/axe.min.js', sha384: 'lFUXB8tI4BaTE1bqxH9eeAXON2NH1qsdAhs7S5L++nUNP5QOy+hwr0C3TYEJUEl0' };
async function loadAxe() {
  try { return fs.readFileSync(createRequire(path.join(process.cwd(), 'noop.js')).resolve('axe-core/axe.min.js'), 'utf8'); } catch (err) { void err; }
  try {
    const r = await fetch(AXE_CDN.url);
    if (!r.ok) return null;
    const body = Buffer.from(await r.arrayBuffer());
    if (crypto.createHash('sha384').update(body).digest('base64') === AXE_CDN.sha384) return body.toString('utf8');
    console.error(`axe-core from ${AXE_CDN.url} does not match its pinned hash; skipping the a11y pass`);
  } catch (err) {
    return null;
  }
  return null;
}

// One representative URL per page type: home, each top-level page, one item per collection
// (/work/a and /work/b are both "work-item"), plus a missing URL for the 404.
async function pickPages(start, max) {
  const origin = new URL(start).origin;
  const types = new Map([['home', new URL(start).href]]);
  const queue = [new URL(start).href];
  const seen = new Set(queue);
  for (let fetched = 0; queue.length && fetched < 30 && types.size < max; fetched++) {
    const u = queue.shift();
    let html = '';
    try { const r = await fetch(u); if (!r.ok || !(r.headers.get('content-type') || '').includes('html')) continue; html = await r.text(); } catch { continue; }
    for (const m of html.matchAll(/<a\b[^>]*\shref=["']([^"'#]+)[^"']*["']/gi)) {
      let next;
      try { next = new URL(m[1].replace(/&amp;/g, '&'), u); } catch { continue; }
      next.hash = ''; next.search = '';
      if (next.origin !== origin || seen.has(next.href) || /\.(?!html?$)[a-z0-9]{2,5}$/i.test(next.pathname)) continue;
      seen.add(next.href);
      const segs = next.pathname.split('/').filter(Boolean);
      if (!segs.length) continue;
      const type = segs.length === 1 ? segs[0] : `${segs[0]}-item`;
      if (!types.has(type) && types.size < max) types.set(type, next.href);
      queue.push(next.href);
    }
  }
  types.set('404', new URL(`/__shoot-missing-page-${Date.now()}`, origin).href);
  return [...types].map(([name, href]) => ({ name: name.replace(/[^a-z0-9-]/gi, '_'), url: href }));
}

// Runs before any page script: records LCP (and its element), load-time CLS, and whether the
// page has a #loader at all (one that removes itself early would otherwise go unseen).
const vitalsInit = () => {
  window.__vitals = { lcpMs: null, lcpElement: null, cls: 0, hadLoader: false };
  document.addEventListener('DOMContentLoaded', () => { window.__vitals.hadLoader = !!document.getElementById('loader'); });
  const describe = (e) => !e ? null : e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\s+/)[0] : '');
  try {
    new PerformanceObserver((l) => { for (const e of l.getEntries()) { window.__vitals.lcpMs = Math.round(e.startTime); window.__vitals.lcpElement = describe(e.element) || e.url || null; } }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__vitals.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
  } catch (err) {
    void err;
  }
};
const vitals = (page) => page.evaluate(() => {
  const { hadLoader, ...v } = window.__vitals;
  return { ...v, cls: Math.round(v.cls * 1000) / 1000 };
});
const hadLoader = (page) => page.evaluate(() => !!window.__vitals?.hadLoader || !!document.getElementById('loader'));

// Opens a page the way a visitor meets it: as soon as the HTML is parsed, then up to `cap` ms
// for the load event. A heavy page on the throttled phone can take longer than any timeout to
// fire load, while visitors already see it. Returns ms from `t0` to load, or null if it never came.
async function open(page, url, t0, cap = 30000) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  return page.waitForLoadState('load', { timeout: cap }).then(() => Date.now() - t0, () => null);
}

// A loader is any #loader element; it is done when removed or hidden.
const loaderGone = () => { const l = document.getElementById('loader'); if (!l || l.hidden) return true; const cs = getComputedStyle(l); return cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0; };

// Fraction of pixels that differ between two PNG buffers, decoded on a blank `scratch` page (no
// CSP). `r` limits the comparison to a region of the images (x, y, width, height in image pixels).
const pxDiff = (scratch, a, b, r = null) => scratch.evaluate(async ([a, b, r]) => {
  const read = async (s) => {
    const img = new Image();
    img.src = `data:image/png;base64,${s}`;
    await img.decode();
    const c = new OffscreenCanvas(img.width, img.height);
    const x = c.getContext('2d');
    x.drawImage(img, 0, 0);
    const { x: rx, y: ry, width: rw, height: rh } = r || { x: 0, y: 0, width: img.width, height: img.height };
    return x.getImageData(rx, ry, Math.max(1, rw), Math.max(1, rh)).data;
  };
  const [A, B] = await Promise.all([read(a), read(b)]);
  if (A.length !== B.length) return 1;
  let n = 0;
  for (let i = 0; i < A.length; i += 4) if (Math.abs(A[i] - B[i]) + Math.abs(A[i + 1] - B[i + 1]) + Math.abs(A[i + 2] - B[i + 2]) > 40) n++;
  return n / (A.length / 4);
}, [a.toString('base64'), b.toString('base64'), r]);

// Waits at least `min` ms, then until the screen stops changing, for at most `max` ms more. Sites
// without a #loader (most sites not built on the engine) often run an intro that a fixed wait
// would shoot mid-animation. Small ambient motion (particles, a slow shader) counts as settled.
// Still means three checks in a row (about 1.2 s) within 1% of the frame that began the run:
// intros pause between steps, and a single still pair mistook a pause for the end.
// Returns `settledMs`, the ms from `t0` by which the screen was still (null if it never was), and
// `changing`, whether it was still changing once `min` had passed.
async function settle(page, t0, min, max) {
  await page.waitForTimeout(min);
  const scratch = await page.context().newPage();
  try {
    const end = Date.now() + max;
    let base = await page.screenshot();
    let since = Date.now();
    let still = 0;
    let changing = false;
    while (Date.now() < end) {
      await page.waitForTimeout(400);
      const next = await page.screenshot();
      if (await pxDiff(scratch, base, next) < 0.01) {
        if (++still >= 3) return { settledMs: since - t0, changing };
      } else {
        changing = true;
        still = 0;
        base = next;
        since = Date.now();
      }
    }
    return { settledMs: null, changing };
  } finally {
    await scratch.close();
  }
}
// Wheel-scroll like a person so smooth-scroll libraries see real input.
const wheelTo = async (page, y) => {
  for (let i = 0; i < 80; i++) {
    const cur = await page.evaluate(() => scrollY);
    const d = y - cur;
    if (Math.abs(d) < 8) break;
    await page.mouse.wheel(0, Math.max(-900, Math.min(900, d)));
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(1300); // let reveals finish
};
const metrics = (page) => page.evaluate(() => {
  const de = document.documentElement;
  const overflowX = de.scrollWidth > innerWidth + 1;
  const offenders = overflowX
    ? [...document.querySelectorAll('body *')].filter((e) => e.getBoundingClientRect().right > innerWidth + 1).slice(0, 5).map((e) => e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ').join('.') : ''))
    : [];
  const h1 = [...document.querySelectorAll('h1')].map((h) => h.innerText.trim().slice(0, 60));
  const small = [...document.querySelectorAll('a, button, [role="button"]')].filter((e) => {
    const r = e.getBoundingClientRect();
    return r.width > 0 && (r.width < 24 || r.height < 24);
  }).slice(0, 8).map((e) => `${(e.innerText || e.getAttribute('aria-label') || e.tagName).trim().slice(0, 24)} ${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}`);
  // GL planes render on a canvas UNDER the content: an opaque background on the element or any
  // ancestor inside <main> hides the plane completely (shows up as empty boxes).
  const glHidden = de.classList.contains('gl-on') ? [...document.querySelectorAll('[data-gl]')].map((el) => {
    for (let n = el; n && n.tagName !== 'MAIN' && n !== document.body; n = n.parentElement) {
      const cs = getComputedStyle(n);
      const a = cs.backgroundColor.match(/[\d.]+/g);
      const opaque = (a && (a.length < 4 ? true : +a[3] > 0.05) && cs.backgroundColor !== 'rgba(0, 0, 0, 0)') || cs.backgroundImage !== 'none';
      if (opaque) return `${el.tagName.toLowerCase()}${el.className ? '.' + String(el.className).split(' ')[0] : ''} covered by ${n === el ? 'itself' : n.tagName.toLowerCase() + (n.className ? '.' + String(n.className).split(' ')[0] : '')}`;
    }
    return null;
  }).filter(Boolean).slice(0, 6) : [];
  return { height: de.scrollHeight, overflowX, offenders, h1, smallTargets: small, glHidden, title: document.title, glOn: de.classList.contains('gl-on') };
});
// Frame rate over `ms`. With `scrollPx`, the page also scrolls that far each frame (touch-like).
const fps = (page, ms = 2000, scrollPx = 0) => page.evaluate(([ms, scrollPx]) => new Promise((res) => {
  let n = 0; const t0 = performance.now(); let worst = 0; let last = t0;
  const f = (t) => { n++; worst = Math.max(worst, t - last); last = t; if (scrollPx) scrollBy(0, scrollPx); if (t - t0 < ms) requestAnimationFrame(f); else res({ fps: Math.round((n * 1000) / (t - t0)), worstFrameMs: Math.round(worst) }); };
  requestAnimationFrame(f);
}), [ms, scrollPx]);

// axe-core, WCAG 2.1 A/AA. Contrast failures carry the measured colors and ratio;
// "needsReview" counts text axe could not judge (usually text over images or canvas).
async function a11y(page, axeSource) {
  if (!axeSource) return { skipped: 'axe-core not found: run npm i -D axe-core in the project' };
  await page.evaluate(axeSource);
  return page.evaluate(async () => {
    const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] }, resultTypes: ['violations', 'incomplete'] });
    const violations = r.violations.map((v) => ({
      id: v.id, impact: v.impact, help: v.help, count: v.nodes.length,
      nodes: v.nodes.slice(0, 4).map((n) => {
        const d = n.any.find((c) => c.data && c.data.contrastRatio)?.data;
        return d ? `${n.target.join(' ')} (${d.fgColor} on ${d.bgColor}, ${d.contrastRatio}:1, needs ${d.expectedContrastRatio})` : n.target.join(' ');
      }),
    }));
    const needsReview = r.incomplete.find((v) => v.id === 'color-contrast')?.nodes.length || 0;
    return { violations, serious: violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').length, contrastNeedsReview: needsReview };
  });
}

// Tab through the page like a keyboard user. Flags focus stops with no visible change in style
// (heuristic: compares the element, its pseudo-elements and first children focused vs blurred)
// and focus landing on elements that are invisible or off screen.
async function keyboard(page, shot) {
  const stops = [];
  const noVisibleFocus = [];
  const invisibleFocus = [];
  let repeats = 0;
  for (let i = 1; i <= tabs; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(250);
    const stop = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const style = (e, pseudo) => { const cs = getComputedStyle(e, pseudo); return [cs.outlineStyle, cs.outlineWidth, cs.outlineColor, cs.boxShadow, cs.backgroundColor, cs.color, cs.textDecorationLine, cs.borderColor, cs.opacity, cs.transform, cs.content].join('|'); };
      window.__snap = () => [style(el), style(el, '::before'), style(el, '::after'), ...[...el.children].slice(0, 3).map((c) => style(c))].join('#');
      window.__focused = el;
      let alpha = 1;
      for (let n = el; n; n = n.parentElement) alpha *= parseFloat(getComputedStyle(n).opacity);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName.toLowerCase(),
        label: (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || el.getAttribute('href') || el.tagName).trim().replace(/\s+/g, ' ').slice(0, 40),
        href: el.getAttribute('href'),
        visible: alpha > 0.1 && r.width > 1 && r.height > 1 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth,
        focused: window.__snap(),
      };
    });
    if (!stop) { stops.push('(body: focus left the page)'); break; }
    if (i <= 4) await shot(page, `k-${String(i).padStart(2, '0')}-focus`);
    const blurred = await page.evaluate(async () => { window.__focused.blur(); await new Promise((r) => setTimeout(r, 300)); const s = window.__snap(); window.__focused.focus({ preventScroll: true }); return s; });
    const name = `${stop.tag} "${stop.label}"`;
    if (stops.length && stops[stops.length - 1] === name) repeats++;
    stops.push(name);
    if (!stop.visible) invisibleFocus.push(name);
    else if (blurred === stop.focused) noVisibleFocus.push(name);
    if (repeats >= 2) break;
  }
  const first = stops[0] || '';
  return {
    stops,
    skipLinkFirst: /skip|#main|#content/i.test(first),
    noVisibleFocus,
    invisibleFocus,
    stuck: repeats >= 2,
  };
}

// Point at things like a mouse user. Picks varied targets (engine-marked ones first, then
// buttons, then links in content, nav and footer, one per class signature) and moves the pointer
// onto each, off-center (magnetic pull is zero at the exact center), after checking that the
// target is really what sits under the pointer. A target reacts if its computed style changes
// (element, pseudo-elements, descendants, cursor follower) or the pixels around it change by more
// than the page's own idle motion. Both are needed: a finished letter roll looks identical to
// rest but its transforms changed, while a shader hover changes pixels but not the target's style.
// The changed properties tell a color swap from movement: a primary target (a link or button
// that is not legal, cookie, social or small footer text) whose hover only changes color lands
// in `colorOnly`, a list to review by eye (a full fill or inversion is a real treatment, a
// text-color swap is not). When the area already moves at rest (a live shader) and no style
// changed, pixels can't tell a hover apart: the target is `masked`, judged from its pair. Each
// target is saved as a clipped pair, h-NN-rest.png and h-NN-hover.png, at the same coordinates.
// Also records whether anything moves while the pointer is still, at the top and further down.
const COLOR_PROPS = new Set(['color', 'backgroundColor', 'borderColor', 'textDecorationLine', 'textDecorationColor']);
async function hover(page, save) {
  const scratch = await page.context().newPage();
  const diff = (a, b, r) => pxDiff(scratch, a, b, r);

  // Idle: pointer parked mid-left edge (the corners hold UI), cursor follower masked, after
  // intros and the follower have settled. Sampled at the top, then lower down if nothing moved.
  const mask = [page.locator('#cursor')];
  const still = async () => {
    await page.mouse.move(2, 450);
    await page.waitForTimeout(1500);
    const a = await page.screenshot({ mask });
    await page.waitForTimeout(1500);
    return (await diff(a, await page.screenshot({ mask }))) > 0.0005;
  };
  let idleAt = (await still()) ? 'top' : null;
  if (!idleAt) {
    const room = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    for (const f of room > 200 ? [0.35, 0.7] : []) {
      await wheelTo(page, Math.round(room * f));
      if (await still()) { idleAt = `${Math.round(f * 100)}%`; break; }
    }
    if (room > 200) await wheelTo(page, 0);
  }

  const targets = await page.evaluate((max) => {
    const sel = 'a[href], button, [role="button"], [data-magnetic], [data-cursor], [data-gl]';
    const rank = (e) => (e.matches('[data-cursor], [data-magnetic], [data-gl]') ? 0 : e.matches('button, [role="button"]') ? 1 : e.closest('main') ? 2 : 3);
    // Utility links may answer with color alone: legal, cookie, social, small footer text.
    const utility = (e) => {
      const href = e.getAttribute('href') || '';
      if (/privacy|legal|cookie|terms|imprint|impressum|colophon/i.test(href)) return true;
      if (/\/\/(www\.)?(instagram|twitter|x|linkedin|github|dribbble|behance|vimeo|youtube|tiktok|threads|bsky|mastodon|facebook|read)\.(com|net|app|social|cv)\b/i.test(href)) return true;
      return !!e.closest('footer') && rank(e) > 0 && parseFloat(getComputedStyle(e).fontSize) < 16;
    };
    const control = 'a[href], button, [role="button"]';
    // Visible text with spaces between nodes (innerText needs layout; clones have none).
    const text = (e) => {
      const parts = [];
      const walk = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
      for (let n = walk.nextNode(); n; n = walk.nextNode()) if (!n.parentElement.closest('[aria-hidden="true"]')) parts.push(n.textContent);
      return parts.join(' ').replace(/\s+/g, ' ').replace(/ ([,.;:!?])/g, '$1').trim();
    };
    const media = (e) => e.querySelector('img[alt]')?.getAttribute('alt') || e.querySelector('[role="img"][aria-label]')?.getAttribute('aria-label') || '';
    const seen = new Set();
    const picked = [];
    const all = [...document.querySelectorAll(sel)].filter((e) => {
      if (e.closest('[aria-hidden="true"], [hidden], #cursor, #curtain, #loader')) return false;
      // An image or cursor zone inside a link is tested through that link.
      if (!e.matches(control) && e.parentElement?.closest(control)) return false;
      const r = e.getBoundingClientRect();
      return r.width > 4 && r.height > 4 && getComputedStyle(e).visibility !== 'hidden';
    });
    all.sort((a, b) => rank(a) - rank(b));
    for (const e of all) {
      const sig = `${e.tagName}.${[...e.classList].sort().join('.')}|${e.closest('header, nav, footer, main')?.tagName || ''}`;
      if (seen.has(sig)) continue;
      seen.add(sig);
      e.setAttribute('data-qa-hover', picked.length);
      const interactive = e.matches(control);
      picked.push({
        i: picked.length,
        interactive,
        primary: interactive && !utility(e),
        label: `${e.tagName.toLowerCase()} "${(text(e) || e.getAttribute('aria-label') || media(e) || e.getAttribute('href') || e.tagName).trim().replace(/\s+/g, ' ').slice(0, 40)}"`,
      });
      if (picked.length >= max) break;
    }
    const props = ['color', 'backgroundColor', 'borderColor', 'textDecorationLine', 'textDecorationColor', 'backgroundSize', 'backgroundPosition', 'opacity', 'transform', 'translate', 'scale', 'rotate', 'clipPath', 'filter', 'letterSpacing', 'boxShadow', 'fontVariationSettings'];
    window.__hoverSnap = (e) => {
      const snap = {};
      const add = (key, el, pseudo) => { const cs = getComputedStyle(el, pseudo); for (const p of props) snap[`${key}:${p}`] = cs[p]; };
      add('self', e);
      add('before', e, '::before');
      add('after', e, '::after');
      [...e.querySelectorAll('*')].slice(0, 24).forEach((c, i) => add(`child${i}`, c));
      const cursor = document.getElementById('cursor');
      if (cursor) snap['cursor:follower'] = cursor.className;
      return snap;
    };
    return picked;
  }, hovers);

  const results = [];
  const covered = [];
  for (const t of targets) {
    const loc = page.locator(`[data-qa-hover="${t.i}"]`);
    await loc.evaluate((e) => e.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(900);
    const box = await loc.boundingBox();
    if (!box || box.y + box.height < 0 || box.y > 900) continue;
    const at = { x: box.x + box.width * 0.35, y: box.y + box.height * 0.4 };
    const hit = await loc.evaluate((e, { x, y }) => { const h = document.elementFromPoint(x, y); return !!h && (h === e || e.contains(h)); }, at);
    if (!hit) { covered.push(t.label); continue; }
    const away = box.x > 720 ? { x: 2, y: 450 } : { x: 1438, y: 450 };
    await page.mouse.move(away.x, away.y);
    await page.waitForTimeout(600);
    const x = Math.max(0, box.x - 24);
    const y = Math.max(0, box.y - 24);
    const clip = { x, y, width: Math.min(box.x + box.width + 24, 1440) - x, height: Math.min(box.y + box.height + 24, 900) - y };
    const restStyle = await loc.evaluate((e) => window.__hoverSnap(e));
    const rest1 = await page.screenshot({ clip });
    await page.waitForTimeout(700);
    const rest2 = await page.screenshot({ clip });
    await page.mouse.move(at.x, at.y, { steps: 8 });
    await page.waitForTimeout(700);
    const hoverStyle = await loc.evaluate((e) => window.__hoverSnap(e));
    const hovered = await page.screenshot({ clip });
    // Pixels are judged inside the target's own box: the saved pairs keep a margin for context,
    // but a moving neighbour in that margin must not hide a dead link.
    const ox = Math.max(0, Math.round(box.x - x));
    const oy = Math.max(0, Math.round(box.y - y));
    const own = {
      x: ox, y: oy,
      width: Math.max(1, Math.floor(Math.min(box.x + box.width, x + clip.width) - x) - ox),
      height: Math.max(1, Math.floor(Math.min(box.y + box.height, y + clip.height) - y) - oy),
    };
    const noise = await diff(rest1, rest2, own);
    const pixels = await diff(rest2, hovered, own) > Math.max(0.01, noise * 2);
    const changed = [...new Set(Object.keys(restStyle).filter((k) => restStyle[k] !== hoverStyle[k]).map((k) => k.split(':')[1]))];
    const react = changed.length ? (changed.every((p) => COLOR_PROPS.has(p)) ? 'color' : 'moves')
      : pixels ? 'pixels' : noise > 0.05 ? 'masked' : 'none';
    const n = `h-${String(results.length + 1).padStart(2, '0')}`;
    save(`${n}-rest`, rest2);
    save(`${n}-hover`, hovered);
    results.push({ shot: n, label: t.label, interactive: t.interactive, primary: t.primary, react, changed });
  }
  await scratch.close();
  const cursorFollower = await page.evaluate(() => !!document.querySelector('#cursor.is-ready'));
  return {
    targets: results,
    noHoverChange: results.filter((r) => r.interactive && r.react === 'none').map((r) => `${r.shot} ${r.label}`),
    colorOnly: results.filter((r) => r.primary && r.react === 'color').map((r) => `${r.shot} ${r.label}`),
    covered,
    cursorFollower,
    idleMotion: !!idleAt,
    idleAt,
  };
}

async function shootPage(browser, axeSource, url, out) {
  fs.mkdirSync(out, { recursive: true });
  for (const f of fs.readdirSync(out)) if (f.endsWith('.png')) fs.rmSync(path.join(out, f));
  const report = { url, errors: [], failed: [], desktop: {}, mobile: {}, files: [], notes: [] };
  const shot = async (page, name) => {
    const file = path.join(out, `${name}.png`);
    await page.screenshot({ path: file });
    report.files.push(file);
  };
  const save = (name, buf) => {
    const file = path.join(out, `${name}.png`);
    fs.writeFileSync(file, buf);
    report.files.push(file);
  };
  // Shooting a missing URL on purpose (to review the 404 page) is not an error.
  const expect404 = /404|not-?found|nothing|missing/i.test(new URL(url).pathname);
  const watch = (page, tag) => {
    page.on('console', (m) => {
      if (m.type() !== 'error') return;
      if (expect404 && /status of 404/.test(m.text())) return;
      report.errors.push(`[${tag}] ${m.text()}`);
    });
    page.on('pageerror', (e) => report.errors.push(`[${tag}] pageerror: ${e.message}`));
    page.on('requestfailed', (r) => report.failed.push(`[${tag}] ${r.url()} ${r.failure()?.errorText}`));
    page.on('response', (r) => {
      if (r.status() < 400) return;
      if (expect404 && r.status() === 404 && r.request().resourceType() === 'document') return;
      report.failed.push(`[${tag}] ${r.status()} ${r.url()}`);
    });
  };

  // Desktop
  let introMs = 0; // from the page being ready (loaded, loader gone) to the hero frame
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.addInitScript(vitalsInit);
    const page = await ctx.newPage();
    watch(page, 'desktop');
    const t0 = Date.now();
    report.desktop.loadMs = await open(page, url, t0);
    const loader = await hadLoader(page);
    await page.waitForTimeout(400);
    await shot(page, 'd-00-firstpaint');
    await page.waitForFunction(loaderGone, null, { timeout: 8000 }).catch(() => report.errors.push('[desktop] loader still present after 8s'));
    const ready = Date.now();
    report.desktop.loaderMs = loader ? ready - t0 : null;
    report.desktop.settledMs = (await settle(page, t0, 1600, 8000)).settledMs;
    introMs = Date.now() - ready;
    await shot(page, 'd-01-hero');
    report.desktop.vitals = await vitals(page);
    await page.mouse.move(720, 450);
    const m = await metrics(page);
    report.desktop = { ...report.desktop, ...m };
    const max = m.height - 900;
    for (let i = 1; i <= steps; i++) {
      await wheelTo(page, Math.round((max * i) / steps));
      await shot(page, `d-${String(i + 1).padStart(2, '0')}-scroll`);
    }
    // FPS while scrolling back up through the page
    const fpsP = fps(page, 2500);
    for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, -500); await page.waitForTimeout(120); }
    report.desktop.scrollFps = await fpsP;
    if (nav) {
      await wheelTo(page, 0);
      // Up to four links to other pages on this site, relative or absolute. Some can't be
      // clicked (inside a carousel, an off-canvas menu), so each gets a short try.
      const links = await page.evaluate(() => {
        const out = [];
        for (const a of document.querySelectorAll('a[href]')) {
          const u = new URL(a.href, location.href);
          if (u.origin !== location.origin || u.pathname === location.pathname || a.target === '_blank' || a.hasAttribute('download')) continue;
          if (/\.(?!html?$)[a-z0-9]{2,5}$/i.test(u.pathname) || out.some((l) => l.path === u.pathname)) continue;
          a.setAttribute('data-qa-nav', out.length);
          out.push({ i: out.length, path: u.pathname });
          if (out.length >= 4) break;
        }
        return out;
      });
      let href = null;
      for (const l of links) {
        const link = page.locator(`[data-qa-nav="${l.i}"]`);
        try {
          await link.scrollIntoViewIfNeeded({ timeout: 3000 });
          await page.waitForTimeout(800);
          await link.click({ timeout: 3000 });
          href = l.path;
          break;
        } catch (err) {
          void err;
        }
      }
      if (!href) report.notes.push(`--nav: no link to another page could be clicked (tried ${links.map((l) => l.path).join(', ') || 'none found'})`);
      if (href) {
        await page.waitForTimeout(300);
        await shot(page, 'd-90-transition-a');
        await page.waitForTimeout(400);
        await shot(page, 'd-90-transition-b');
        await page.waitForTimeout(500);
        await shot(page, 'd-90-transition-c');
        await page.waitForURL((u) => u.pathname.startsWith(href.replace(/\/$/, '')), { timeout: 8000 }).catch(() => report.errors.push(`[nav] did not reach ${href}`));
        await page.waitForTimeout(2200);
        await shot(page, 'd-91-after-nav');
        report.desktop.nav = { href, scrollYAfter: await page.evaluate(() => scrollY), title: await page.title() };
        await page.goBack({ timeout: 10000 }).catch(() => report.notes.push('--nav: going back did not finish loading within 10 s'));
        await page.waitForTimeout(2500);
        await shot(page, 'd-92-back');
      }
    }
    await ctx.close();
  }

  // Fresh desktop loads below wait as long as the desktop pass did between the page being ready
  // and the hero frame, so their frames don't land mid-intro either. With a #loader, its end
  // already marks the intro's end, and the fixed wait covers the hero's entrance.
  const introWait = (fixed) => (report.desktop.loaderMs != null ? fixed : Math.max(fixed, introMs));

  // Keyboard: a fresh load, then Tab from the top of the page.
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    watch(page, 'keyboard');
    await open(page, url, Date.now());
    await page.waitForFunction(loaderGone, null, { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(introWait(1600));
    report.keyboard = await keyboard(page, shot);
    await ctx.close();
  }

  // Hover: a fresh load, the pointer still for a moment, then onto each target.
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    watch(page, 'hover');
    await open(page, url, Date.now());
    await page.waitForFunction(loaderGone, null, { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(introWait(2200));
    const { idleMotion, idleAt, ...h } = await hover(page, save);
    report.desktop.idleMotion = idleMotion;
    report.desktop.idleAt = idleAt;
    report.hover = h;
    await ctx.close();
  }

  // Mobile, on a mid-range phone: 4x CPU slowdown and slow 4G, like Lighthouse's mobile run.
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await ctx.addInitScript(vitalsInit);
    const page = await ctx.newPage();
    watch(page, 'mobile');
    if (throttle) {
      const cdp = await ctx.newCDPSession(page);
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await cdp.send('Network.enable');
      await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
    }
    const t0 = Date.now();
    const loadMs = await open(page, url, t0, 60000);
    const loader = await hadLoader(page);
    await page.waitForFunction(loaderGone, null, { timeout: 20000 }).catch(() => report.errors.push('[mobile] loader still present after 20s'));
    const loaderMs = loader ? Date.now() - t0 : null;
    const { settledMs } = await settle(page, t0, 1800, 8000);
    await shot(page, 'm-01-hero');
    const v = await vitals(page);
    report.mobile = { throttled: throttle, loadMs, loaderMs, settledMs, vitals: v, ...(await metrics(page)) };
    report.mobile.scrollFps = await fps(page, 2500, 6);
    await page.evaluate(() => scrollTo(0, 0));
    const max = report.mobile.height - 844;
    for (let i = 1; i <= Math.min(steps, 5); i++) {
      await page.evaluate((y) => scrollTo(0, y), Math.round((max * i) / Math.min(steps, 5)));
      await page.waitForTimeout(1500);
      await shot(page, `m-${String(i + 1).padStart(2, '0')}-scroll`);
    }
    await ctx.close();
  }

  // Reduced motion: content must be fully visible with no animation. Also the axe pass, since
  // every text is in its final state here.
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    watch(page, 'reduced');
    const t0 = Date.now();
    await open(page, url, Date.now());
    // `moving`: the screen was still changing 1.5 s after load, with reduced motion requested.
    const { changing: moving } = await settle(page, t0, 1500, 4000);
    await shot(page, 'r-01-hero');
    report.reduced = await page.evaluate(() => ({
      hiddenText: [...document.querySelectorAll('h1,h2,h3,p,a')].filter((e) => {
        const cs = getComputedStyle(e);
        return e.getBoundingClientRect().height > 0 && (cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.05);
      }).length,
    }));
    report.reduced.moving = moving;
    report.a11y = await a11y(page, axeSource).catch((e) => ({ skipped: `axe failed: ${e.message}` }));
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight / 2));
    await page.waitForTimeout(600);
    await shot(page, 'r-02-mid');
    await ctx.close();
  }

  report.notes.push('desktop FPS runs headless on a software GPU: treat it as a floor, not a measurement of real hardware');
  if (throttle) report.notes.push('mobile runs at 4x CPU slowdown on slow 4G: mobile.vitals and mobile.scrollFps are the numbers that count');
  report.notes.push('loadMs: ms from navigation to the load event, null if it had not fired after 30 s (desktop) or 60 s (phone); a heavy page takes long, while visitors see content at vitals.lcpMs. loaderMs: ms until the #loader ended, null when the page has none');
  report.notes.push('settledMs: ms from navigation by which the first screen stopped changing, never before the fixed wait. null: still changing at the cap, either a long intro or continuous motion (a live shader, video); d-01-hero / m-01-hero tell which. reduced.moving: the screen was still changing 1.5 s after load with reduced motion on');
  fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2));
  return report;
}

// The numbers to act on, one line per page.
const brief = (name, r) => ({
  page: name,
  url: r.url,
  errors: r.errors.length + r.failed.length,
  overflow: !!(r.desktop.overflowX || r.mobile.overflowX),
  smallTargets: r.mobile.smallTargets?.length || 0,
  hiddenTextReduced: r.reduced?.hiddenText ?? null,
  movingReduced: r.reduced?.moving ?? null,
  heroSettledMs: r.desktop.settledMs ?? null,
  mobileLcpMs: r.mobile.vitals?.lcpMs ?? null,
  mobileCls: r.mobile.vitals?.cls ?? null,
  desktopFps: r.desktop.scrollFps?.fps ?? null,
  mobileFps: r.mobile.scrollFps?.fps ?? null,
  axeSerious: r.a11y?.serious ?? null,
  axeViolations: r.a11y?.violations?.map((v) => `${v.id} x${v.count}`) ?? r.a11y?.skipped,
  skipLinkFirst: r.keyboard?.skipLinkFirst ?? null,
  noVisibleFocus: r.keyboard?.noVisibleFocus?.length ?? null,
  invisibleFocus: r.keyboard?.invisibleFocus?.length ?? null,
  noHoverChange: r.hover?.noHoverChange?.length ?? null,
  colorOnly: r.hover?.colorOnly?.length ?? null,
  idleMotion: r.desktop.idleMotion ?? null,
});

const browser = await launch();
const axeSource = await loadAxe();
if (crawl) {
  const targets = await pickPages(url, parseInt(opt('max', '8'), 10));
  const summary = [];
  for (const t of targets) {
    console.error(`shooting ${t.name}: ${t.url}`);
    // One page the browser can't get through must not cost the rest of the crawl.
    try {
      summary.push(brief(t.name, await shootPage(browser, axeSource, t.url, path.join(outRoot, t.name))));
    } catch (e) {
      const why = e.message.split('\n')[0];
      console.error(`  failed: ${why}`);
      summary.push({ page: t.name, url: t.url, shootFailed: why });
      for (const c of browser.contexts()) await c.close().catch(() => {});
    }
  }
  fs.writeFileSync(path.join(outRoot, 'summary.json'), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
  console.log(`\n${targets.length} pages shot into ${outRoot}/<page>/ (report.json in each). Read every PNG.`);
} else {
  const report = await shootPage(browser, axeSource, url, outRoot);
  console.log(JSON.stringify({ ...report, files: `${report.files.length} screenshots in ${outRoot}` }, null, 2));
}
await browser.close();
