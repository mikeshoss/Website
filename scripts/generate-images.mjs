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

/**
 * One social card per page that gets shared, from the one template in
 * scripts/og-image.html. The wording mirrors each page's own headline in
 * src/pages/ and its tagline in src/data/content.ts — when one of those
 * changes, change it here and re-run. A page without a card here falls back
 * to the default (see `card` in src/layouts/Layout.astro), so a new venture
 * never ships a broken image, only a generic one.
 *
 * Keep years-of-experience and other derived numbers out of the cards: they
 * are rendered once and would go stale.
 */
const card = (output, params) => ({
  source: 'scripts/og-image.html',
  query: new URLSearchParams(params).toString(),
  output,
  width: 1200,
  height: 630,
});

const HOME = {
  eyebrow: 'MS–01 · Milton, Ontario',
  title: 'I ship AI products in industries where being wrong is *expensive*.',
};

const icon = (output, size) => ({ source: 'scripts/apple-touch-icon.html', query: '', output, width: size, height: size });

const TARGETS = [
  // The default card, also kept at its old URL so links already shared still resolve.
  card('public/og-image.png', HOME),
  card('public/og/home.png', HOME),
  card('public/og/credits.png', {
    eyebrow: 'Credits · Selected works',
    title: "If my name's on it, it *shipped*.",
    sub: 'The work, who it was for, what I did on it, and what it did.',
    path: '/credits',
  }),
  card('public/og/companies.png', {
    eyebrow: 'The companies',
    title: '*Ventures*.',
    sub: 'Epilogue, ShossX, Milton Innovation and the angel investing.',
    path: '/companies',
  }),
  card('public/og/companies-epilogue.png', {
    eyebrow: 'Ventures · Founder & Principal',
    title: '*Epilogue*',
    sub: 'Turning complex business problems into practical AI systems.',
    path: '/companies/epilogue',
  }),
  card('public/og/companies-investing.png', {
    eyebrow: 'Ventures · Angel investor',
    title: 'Angel *investing*',
    sub: 'Backing early-stage Canadian AI, science and technology companies.',
    path: '/companies/investing',
  }),
  card('public/og/companies-shossx.png', {
    eyebrow: 'Ventures · Founder',
    title: 'Shoss*X*',
    sub: 'The holding company behind Epilogue, Milton Innovation and the angel investing.',
    path: '/companies/shossx',
  }),
  card('public/og/companies-milton-innovation.png', {
    eyebrow: 'Ventures · Founder',
    title: 'Milton *Innovation*',
    sub: 'A community hub for technologists, innovators and creators in Milton.',
    path: '/companies/milton-innovation',
  }),
  card('public/og/projects.png', {
    eyebrow: 'Projects',
    title: 'Built for myself, in the *open*.',
    sub: 'Radio, aircraft, transit, civic records, castles, and a lot of MCP servers.',
    path: '/projects',
  }),
  card('public/og/experience.png', {
    eyebrow: 'Experience',
    title: 'Developer first, then *product*.',
    sub: 'Career, patents, boards and mentoring.',
    path: '/experience',
  }),
  card('public/og/collection.png', {
    eyebrow: 'Off the clock · Trading cards',
    title: 'Pokémon and *Magic*.',
    sub: 'Wizards-era Pokémon, set by set. Commander decks on the side.',
    path: '/off-the-clock/cards',
  }),
  card('public/og/off-the-clock.png', {
    eyebrow: 'Side B',
    title: 'Off the *clock*.',
    sub: 'Steel bikes, radio, cards and a homelab. Finish the thing.',
    path: '/off-the-clock',
  }),
  card('public/og/glossary.png', {
    eyebrow: 'Reference',
    title: '*Glossary*.',
    sub: 'AI vocabulary, read twice: what it means, and what it really means.',
    path: '/glossary',
  }),
  card('public/og/api.png', {
    eyebrow: 'Developers · v2',
    title: 'The *API*.',
    sub: 'Everything on this site as JSON. OpenAPI spec, no key, plus an MCP server.',
    path: '/api',
  }),
  card('public/og/brand.png', {
    eyebrow: 'Brand guidelines',
    title: '℗ and a live *cursor*.',
    sub: 'The mark, the tag, the colours, the voice. Press kit included.',
    path: '/brand',
  }),
  card('public/og/contact.png', {
    eyebrow: 'Contact',
    title: "Let's *build*.",
    sub: "Bring the problem, not the deck.",
    path: '/contact',
  }),

  icon('public/apple-touch-icon.png', 180),
  icon('public/favicon-32.png', 32),
  icon('public/icon-192.png', 192),
  icon('public/icon-512.png', 512),
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

  for (const { source, query, output, width, height } of TARGETS) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: false,
    }, sessionId);

    await client.send('Page.enable', {}, sessionId);
    await client.send('Page.navigate', { url: pathToFileURL(resolve(root, source)).href + (query ? `?${query}` : '') }, sessionId);

    // Fonts are the only async work on these pages; waiting on them avoids
    // capturing a frame still painted in the fallback face.
    // Successive cards navigate the same file with a different query string,
    // so give the navigation a moment to commit before asking the document
    // about itself — otherwise the check can answer for the previous card.
    await new Promise((r) => setTimeout(r, 350));
    await client.send('Runtime.evaluate', {
      expression:
        "new Promise((r) => { const go = () => document.fonts.ready.then(() => r(true)); document.readyState === 'complete' ? go() : addEventListener('load', go); })",
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
