/**
 * Accessibility audit for the built site (WCAG 2.2 AA), run by `npm run a11y`
 * against `astro preview`. Two checks on every page in the sitemap:
 *
 *   1.4.3  Contrast: every visible text element against its real background
 *          (backgrounds composited up the tree), 4.5:1, or 3:1 for large text.
 *          Hidden tab panels and closed <details> are opened first. Text over
 *          photos and anything aria-hidden is skipped.
 *   1.4.10 Reflow: no sideways scrolling at 320 CSS pixels.
 *
 * Usage: npm run build && npx astro preview, then
 *        CHROME_PATH=... node scripts/a11y-audit.mjs [baseUrl] [path...]
 * Exits non-zero if anything fails. Update the date on /accessibility after a run.
 */
import { spawn } from 'node:child_process';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const [base = 'http://localhost:4321', ...given] = process.argv.slice(2);
const paths = given.length ? given : [...(await readFile('dist/sitemap-0.xml', 'utf8')).matchAll(/<loc>https:\/\/[^/]+([^<]*)<\/loc>/g)].map((m) => m[1]).concat('/404.html');
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const profile = await mkdtemp(join(tmpdir(), 'a11y-chrome-'));
const child = spawn(CHROME, ['--headless=new', '--disable-gpu', '--remote-debugging-port=0', `--user-data-dir=${profile}`]);
const ws = await new Promise((res, rej) => { let b = ''; child.stderr.on('data', c => { b += c; const m = b.match(/ws:\/\/\S+/); if (m) res(m[0]); }); setTimeout(() => rej(new Error('no endpoint')), 20000); });
const sock = new WebSocket(ws); const pend = new Map(); let id = 0;
sock.addEventListener('message', e => { const m = JSON.parse(e.data); const h = pend.get(m.id); if (h) { pend.delete(m.id); m.error ? h[1](new Error(m.error.message)) : h[0](m.result); } });
await new Promise(r => sock.addEventListener('open', r));
const send = (method, params = {}, sessionId) => new Promise((a, b) => { const i = ++id; pend.set(i, [a, b]); sock.send(JSON.stringify({ id: i, method, params, ...(sessionId ? { sessionId } : {}) })); });
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId: s } = await send('Target.attachToTarget', { targetId, flatten: true });
await send('Page.enable', {}, s);
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }, s);
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] }, s);
const ev = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }, s)).result.value;
const AUDIT = `(() => {
  const parse = c => { const m = c.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const p = m[1].split(/[ ,\\/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lum = ({ r, g, b }) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const blend = (top, bot) => ({ r: top.r * top.a + bot.r * (1 - top.a), g: top.g * top.a + bot.g * (1 - top.a), b: top.b * top.a + bot.b * (1 - top.a), a: 1 });
  const bgOf = el => { const stack = []; let img = false; for (let n = el; n; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.backgroundImage !== 'none' && !/radial-gradient/.test(cs.backgroundImage)) img = true; const c = parse(cs.backgroundColor); if (c && c.a > 0) { stack.push(c); if (c.a >= 1) break; } } let bg = { r: 255, g: 255, b: 255, a: 1 }; for (let i = stack.length - 1; i >= 0; i--) bg = blend(stack[i], bg); return { bg, img }; };
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    if (['SCRIPT','STYLE','SVG','PATH','svg','path'].includes(el.tagName)) continue;
    const own = [...el.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim()).map(n => n.textContent.trim()).join(' ');
    if (!own) continue;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || +cs.opacity === 0) continue;
    if (el.closest('[aria-hidden="true"]')) continue;
    let fg = parse(cs.color); if (!fg) continue;
    const { bg, img } = bgOf(el); if (img) continue;
    fg = blend(fg, bg);
    const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x); const ratio = (a + 0.05) / (b + 0.05);
    const size = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 700;
    const large = size >= 24 || (bold && size >= 18.66);
    const need = large ? 3 : 4.5;
    if (ratio < need) out.push({ text: own.slice(0, 40), ratio: +ratio.toFixed(2), need, size, color: cs.color, tag: el.tagName.toLowerCase(), cls: (el.className && el.className.baseVal === undefined ? el.className : '').toString().slice(0, 60) });
  }
  return out;
})()`;
const REFLOW = `document.documentElement.scrollWidth <= innerWidth + 1`;
let total = 0;
for (const p of paths) {
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }, s);
  await send('Page.navigate', { url: base + p }, s);
  await new Promise(r => setTimeout(r, 1200));
  // Open every tab panel and details so hidden content is audited too.
  await ev(`document.querySelectorAll('[hidden]').forEach(n => n.hidden = false); document.querySelectorAll('details').forEach(d => d.open = true); true`);
  const res = await ev(AUDIT);
  await send('Emulation.setDeviceMetricsOverride', { width: 320, height: 800, deviceScaleFactor: 1, mobile: true }, s);
  await new Promise(r => setTimeout(r, 300));
  const fits = await ev(REFLOW);
  total += res.length + (fits ? 0 : 1);
  console.log(`${p}  ${res.length ? res.length + ' contrast fail' : 'contrast ok'} · ${fits ? 'reflow ok' : 'SCROLLS SIDEWAYS at 320px'}`);
  for (const r of res) console.log(`   ${r.ratio}<${r.need} ${r.size}px ${r.tag}.${r.cls} "${r.text}" ${r.color}`);
}
console.log(total ? `${total} problem(s)` : 'All pages pass.');
child.kill();
process.exit(total ? 1 : 0);
