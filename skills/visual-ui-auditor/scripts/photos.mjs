#!/usr/bin/env node
// Curate free-license placeholder photos (Unsplash photos served by Lorem Picsum) when the brief
// needs imagery and none was provided. Always mark them as placeholders and credit the authors.
//   node photos.mjs sheet [--out .photos]                 contact sheets of ~1000 photos with ids (read the PNGs)
//   node photos.mjs get <id> <id> ... [--dir public/photos] [--size 1600x1067]
//                                                          downloads JPGs + credits.json (author, source url)
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const cmd = args[0];
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i > -1 ? args[i + 1] : d; };
const ids = args.slice(1).filter((a, i, all) => !a.startsWith('--') && !['--out', '--dir', '--size'].includes(all[i - 1]));

async function list() {
  let all = [];
  for (let p = 1; p <= 11; p++) {
    const r = await fetch(`https://picsum.photos/v2/list?page=${p}&limit=100`);
    if (!r.ok) break;
    const page = await r.json();
    if (!page.length) break;
    all = all.concat(page);
  }
  return all;
}

if (cmd === 'sheet') {
  const out = path.resolve(opt('out', '.photos'));
  fs.mkdirSync(out, { recursive: true });
  const all = await list();
  fs.writeFileSync(path.join(out, 'list.json'), JSON.stringify(all, null, 1));
  const { launch } = await import('./browser.mjs');
  const browser = await launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  const per = 192;
  for (let i = 0; i * per < all.length; i++) {
    const chunk = all.slice(i * per, (i + 1) * per);
    await page.setContent(`<body style="margin:0;background:#222;display:grid;grid-template-columns:repeat(16,1fr);gap:3px;font:bold 13px sans-serif;color:#ff0">${chunk
      .map((a) => `<div style="position:relative"><img src="https://picsum.photos/id/${a.id}/200/134" style="width:100%;display:block"><span style="position:absolute;left:2px;top:1px;background:#000;padding:0 3px">${a.id}</span></div>`)
      .join('')}</body>`, { waitUntil: 'networkidle' });
    const file = path.join(out, `sheet-${i}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`wrote ${file}`);
  }
  await browser.close();
  console.log('Read the sheets, pick ids that fit the art direction (one coherent eye), then: node photos.mjs get <ids>');
} else if (cmd === 'get' && ids.length) {
  const dir = path.resolve(opt('dir', 'public/photos'));
  const [w, h] = opt('size', '1600x1067').split('x');
  fs.mkdirSync(dir, { recursive: true });
  const credits = [];
  for (const id of ids) {
    const info = await (await fetch(`https://picsum.photos/id/${id}/info`)).json();
    const img = await fetch(`https://picsum.photos/id/${id}/${w}/${h}`);
    if (!img.ok) { console.error(`failed ${id}`); continue; }
    fs.writeFileSync(path.join(dir, `${id}.jpg`), Buffer.from(await img.arrayBuffer()));
    credits.push({ id, file: `${id}.jpg`, author: info.author, source: info.url, license: 'Unsplash License', placeholder: true });
    console.log(`saved ${id}.jpg by ${info.author}`);
  }
  fs.writeFileSync(path.join(dir, 'credits.json'), JSON.stringify(credits, null, 2));
  console.log(`credits → ${path.join(dir, 'credits.json')} (credit them in a colophon; flag for replacement)`);
} else {
  console.error('usage: node photos.mjs sheet [--out .photos] | node photos.mjs get <id...> [--dir public/photos] [--size 1600x1067]');
  process.exit(1);
}
