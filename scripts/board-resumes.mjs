// Prints the board resumes to PDF: /boards/resume/<variant>/ → public/files/mike-shoss-board-resume-<variant>.pdf
// Usage: run a build and `npx astro preview` (or `npm run dev`), then
//   CHROME_PATH=... node scripts/board-resumes.mjs [baseUrl]   (default http://localhost:4321)
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const base = process.argv[2] ?? 'http://localhost:4321';
const chromePath = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const variants = ['company', 'nonprofit'];

const profile = await mkdtemp(join(tmpdir(), 'resumes-'));
const chrome = spawn(chromePath, ['--headless=new', '--disable-gpu', '--remote-debugging-port=0', `--user-data-dir=${profile}`]);
const wsUrl = await new Promise((res) => { let b = ''; chrome.stderr.on('data', (c) => { b += c; const m = b.match(/ws:\/\/\S+/); if (m) res(m[0]); }); });
const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const pending = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); const h = pending.get(m.id); if (h) { pending.delete(m.id); m.error ? h[1](new Error(m.error.message)) : h[0](m.result); } });
const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const i = ++id; pending.set(i, [res, rej]); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });

await mkdir(join(root, 'public/files'), { recursive: true });
for (const v of variants) {
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  await send('Page.enable', {}, sessionId);
  await send('Page.navigate', { url: `${base}/boards/resume/${v}/` }, sessionId);
  await new Promise((r) => setTimeout(r, 2500));
  await send('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true }, sessionId);
  const { data } = await send('Page.printToPDF', { preferCSSPageSize: true, printBackground: true, generateTaggedPDF: true }, sessionId);
  const out = join(root, `public/files/mike-shoss-board-resume-${v}.pdf`);
  await writeFile(out, Buffer.from(data, 'base64'));
  console.log(`Wrote ${out.replace(root + '/', '')}`);
  await send('Target.closeTarget', { targetId });
}
chrome.kill();
process.exit(0);
