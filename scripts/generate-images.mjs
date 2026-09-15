/**
 * Renders the raster images under public/ from their HTML sources in this
 * directory. Run it after editing either source:
 *
 *   npm run images
 *
 * Why a script and not a one-line `chrome --screenshot`: headless Chromium
 * gives the page a viewport ~87px shorter than --window-size while still
 * writing a screenshot the full --window-size tall, so the plain flag leaves
 * an unpainted strip at the bottom of every capture and no window size
 * produces a correct 1200x630 card. Driving the DevTools Protocol sets the
 * viewport exactly, and waits for the webfonts before capturing.
 *
 * Dependency-free on purpose: Node's global WebSocket (Node 22+) and the
 * Chromium that Playwright already installs. Nothing in the production build
 * depends on it — the outputs are committed.
 *
 * PNG, not SVG, for the social card: LinkedIn, X, Facebook, Slack and iMessage
 * all ignore an SVG og:image and render a blank preview. The og-image
 * dimensions here must stay in step with the og:image:width and
 * og:image:height meta tags in src/layouts/Layout.astro.
 */
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const TARGETS = [
  { source: 'scripts/og-image.html', output: 'public/og-image.png', width: 1200, height: 630 },
  {
    source: 'scripts/apple-touch-icon.html',
    output: 'public/apple-touch-icon.png',
    width: 180,
    height: 180,
  },
];

/** Playwright's Chromium, wherever this machine keeps it. */
function findChromium() {
  const fromEnv = process.env.CHROME_PATH;
  if (fromEnv) return fromEnv;

  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || `${process.env.HOME}/.cache/ms-playwright`;
  const candidates = [
    'chrome-linux/chrome',
    'chrome-mac/Chromium.app/Contents/MacOS/Chromium',
    'chrome-win/chrome.exe',
  ];

  // Directory names carry a build number (chromium-1194), so scan rather than guess.
  for (const dir of readdirSync(base).filter((d) => d.startsWith('chromium-'))) {
    for (const candidate of candidates) {
      const path = resolve(base, dir, candidate);
      if (existsSync(path)) return path;
    }
  }

  throw new Error(
    `No Chromium found under ${base}. Set CHROME_PATH to a Chrome or Chromium binary.`,
  );
}

/** Minimal CDP client: send a command, await its reply. */
function connect(wsUrl) {
  const socket = new WebSocket(wsUrl);
  const pending = new Map();
  let nextId = 0;

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    const handler = pending.get(message.id);
    if (!handler) return;
    pending.delete(message.id);
    message.error ? handler.reject(new Error(message.error.message)) : handler.resolve(message.result);
  });

  const ready = new Promise((resolveReady, rejectReady) => {
    socket.addEventListener('open', () => resolveReady());
    socket.addEventListener('error', () => rejectReady(new Error('DevTools connection failed')));
  });

  return {
    ready,
    close: () => socket.close(),
    send(method, params = {}, sessionId) {
      const id = ++nextId;
      return new Promise((resolvePromise, rejectPromise) => {
        pending.set(id, { resolve: resolvePromise, reject: rejectPromise });
        socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
      });
    },
  };
}

/** Chromium prints its DevTools endpoint to stderr once it is listening. */
function waitForEndpoint(child) {
  return new Promise((resolvePromise, rejectPromise) => {
    let buffer = '';
    const timer = setTimeout(() => rejectPromise(new Error('Chromium did not report a DevTools endpoint')), 30_000);

    child.stderr.on('data', (chunk) => {
      buffer += chunk;
      const match = buffer.match(/ws:\/\/\S+/);
      if (!match) return;
      clearTimeout(timer);
      resolvePromise(match[0]);
    });
    child.on('exit', (code) => {
      clearTimeout(timer);
      rejectPromise(new Error(`Chromium exited with code ${code}`));
    });
  });
}

const chromium = spawn(findChromium(), [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--hide-scrollbars',
  // The card loads its webfonts from node_modules over file://.
  '--allow-file-access-from-files',
  '--remote-debugging-port=0',
  '--user-data-dir=' + resolve(root, 'node_modules/.cache/og-chromium'),
]);

try {
  const client = connect(await waitForEndpoint(chromium));
  await client.ready;

  const { targetId } = await client.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await client.send('Target.attachToTarget', { targetId, flatten: true });

  for (const { source, output, width, height } of TARGETS) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: false,
    }, sessionId);

    await client.send('Page.enable', {}, sessionId);
    await client.send('Page.navigate', { url: pathToFileURL(resolve(root, source)).href }, sessionId);

    // Fonts are the only async work on these pages; waiting on them avoids
    // capturing a frame still painted in the fallback face.
    await client.send('Runtime.evaluate', {
      expression: 'document.fonts.ready.then(() => true)',
      awaitPromise: true,
    }, sessionId);

    const { data } = await client.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false,
      clip: { x: 0, y: 0, width, height, scale: 1 },
    }, sessionId);

    const target = resolve(root, output);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, Buffer.from(data, 'base64'));

    console.log(`Wrote ${output} (${width}x${height})`);
  }

  client.close();
} finally {
  chromium.kill();
}
