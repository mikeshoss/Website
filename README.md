# Mike Shoss — Personal Website

The source for [mikeshoss.com](https://mikeshoss.com), a fast, statically generated personal site built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com).

## Tech Stack

- **Framework:** [Astro](https://astro.build) 5 (static site generator)
- **Styling:** [Tailwind CSS](https://tailwindcss.com) 3 via `@astrojs/tailwind`, with the `@tailwindcss/typography` plugin
- **Fonts:** Self-hosted [Inter](https://fontsource.org/fonts/inter) and [JetBrains Mono](https://fontsource.org/fonts/jetbrains-mono) via `@fontsource` (no external font requests)
- **Content:** Markdown blog posts through Astro content collections (`astro:content`)
- **SEO:** `@astrojs/sitemap` for automatic sitemap generation, plus per-page meta tags, Open Graph/Twitter cards and a JSON-LD `@graph` in the base layout
- **Data:** Read-only JSON API and a remote MCP server, both derived from the same content module
- **Hosting:** Cloudflare Workers (Workers Builds + static assets)

## Project Structure

```
.
├── astro.config.mjs        # Astro config (site URL, port, sitemap + tailwind integrations)
├── tailwind.config.mjs     # Theme tokens (colors, fonts) and Tailwind content globs
├── public/                 # Static assets served as-is
│   ├── favicon.svg
│   ├── apple-touch-icon.png # Generated — see scripts/
│   ├── og-image.png        # Generated — see scripts/
│   ├── robots.txt
│   ├── _headers            # Cloudflare security, cache & CORS headers
│   └── _redirects          # Cloudflare redirects
├── scripts/                # Image sources + their renderer (`npm run images`)
│   ├── og-image.html
│   ├── apple-touch-icon.html
│   └── generate-images.mjs
├── wrangler.jsonc          # Worker config: entrypoint + static assets
├── worker/
│   ├── index.ts            # Worker entry: /mcp, everything else to assets
│   └── mcp.ts              # MCP server (JSON-RPC over HTTP)
└── src/
    ├── data/content.ts     # All site content (edit here to update text)
    ├── lib/                # Shared helpers: dates, API envelope, JSON Resume
    ├── layouts/
    │   └── Layout.astro     # Base HTML layout: SEO meta, Open Graph, JSON-LD
    ├── components/
    │   ├── Nav.astro
    │   └── Footer.astro
    ├── pages/              # Routed pages
    │   ├── index.astro      # Home
    │   ├── companies/
    │   │   ├── index.astro  # Ventures index
    │   │   └── [slug].astro # One page per venture, from `slug` in content.ts
    │   ├── projects.astro
    │   ├── experience.astro
    │   ├── contact.astro
    │   ├── 404.astro
    │   ├── blog/            # Blog index + [slug] post pages (currently redirected)
    │   ├── llms.txt.ts      # Generated from content.ts
    │   └── api/             # Prerendered JSON endpoints
    ├── content/
    │   ├── config.ts        # Blog content collection schema
    │   └── blog/            # Markdown blog posts
    └── styles/
        └── global.css
```

### Content

All copy (hero text, experience, ventures, projects, patents, skills, volunteering,
interests) lives in `src/data/content.ts`; the glossary lives in
`src/data/glossary.ts`. Edit those files to update the site's text.

**Note that `/api/*.json` is generated output, not input** — it is rebuilt from
these modules on every deploy, so edits made there are overwritten.

For editing without a local checkout — the GitHub web flow, what each export
controls, and what happens when a commit breaks the build — see
[EDITING.md](./EDITING.md).

Each entry in `companies` carries a `slug`, which is its URL under `/companies/`.
Adding a venture there is the whole job: it gets a page, a card on the ventures
index and the home page, a JSON API entry, an `Organization` JSON-LD node, a
sitemap URL and a section in `llms.txt`, with no other file touched. Slugs are
indexed URLs, so renaming one costs that page its search ranking — treat them as
permanent once deployed.

A volunteering entry can carry a `timeline` of roles within the same
organization (`title` stays the current one), which renders under the entry and
is published through the API.

Blog posts are Markdown files in `src/content/blog/`, validated against the schema in `src/content/config.ts` (`title`, `description`, `date`, `tags`, `draft`).

## Data API

The site publishes its content as machine-readable data. Everything derives from
`src/data/content.ts` — there is no separate data store to keep in sync, and no build
step beyond `astro build`.

Everything is public, read-only, CORS-enabled, and regenerated on each deploy.

### JSON endpoints

Start at the discovery document, which lists every endpoint:

```bash
curl -s https://mikeshoss.com/api/index.json | python3 -m json.tool
```

| Endpoint | Contents |
| --- | --- |
| `/api/index.json` | Discovery document listing all endpoints |
| `/api/resume.json` | The entire profile in one request |
| `/api/jsonresume.json` | [JSON Resume](https://jsonresume.org) v1.0.0 document |
| `/api/profile.json` | Name, contact, headline, summary, philosophy |
| `/api/experience.json` | Work history with dates and accomplishments |
| `/api/companies.json` | Companies founded, including their products |
| `/api/companies/<slug>.json` | One venture, joined to its projects and the founder block |
| `/api/projects.json` | Projects, with status |
| `/api/patents.json` | Patents with numbers, filing and grant dates, links |
| `/api/volunteering.json` | Volunteering, mentoring, advisory, and board work |
| `/api/education.json` | Education |
| `/api/certifications.json` | Certifications |
| `/api/skills.json` | Skills |
| `/api/highlights.json` | Headline statistics |
| `/llms.txt` | Plain-text summary for language models |

Also present and currently empty, ready to be filled in: `awards`, `publications`,
`recommendations`, `organizations`, `languages`, `interests`, `causes`.

List endpoints return `{ "data": [...], "count": n, "meta": {...} }`. `meta` carries the
build timestamp, source URL, licence, and API version. `/api/jsonresume.json` is the
exception: it is served bare, because tooling expects the schema document at the top level.

Dates are ISO 8601 (`YYYY`, `YYYY-MM`, or `YYYY-MM-DD`). Ongoing entries have a `start` and
no `end`. Each dated entry also carries a `period` string for direct display. Education is
the exception — those entries keep a hand-written `period` and have no machine dates.

There is no blog endpoint: the blog is currently redirected off the site, so publishing its
posts here would be misleading.

### Venture syndication

`/api/companies/<slug>.json` is how a venture's own site stays in sync with this one.

`/api/companies.json` returns the venture records alone. The per-venture feed returns the
joined view a second site would otherwise have to assemble and then keep in step by hand:

- `company` — the full record: role, tagline, description, long-form body, arms, products,
  clients, networks
- `projects` — `{ active, past, count }`, only the projects whose `association` matches that
  venture's name
- `founder` — name, title, headline, subheadline, thesis, location and contact links
- `page` — the venture's canonical page here
- `related` — the glossary, profile and discovery feeds

```bash
curl -s https://mikeshoss.com/api/companies/epilogue.json | python3 -m json.tool
```

The consuming site can read it either way. At build time it is a fetch in the build step,
which costs a rebuild to pick up a change and adds no runtime dependency. At runtime it is a
fetch in the browser, which is live but shows nothing until it resolves. The response is
static, CORS-open and cached five minutes at the edge, so both are cheap.

Either way the content is edited once, in `src/data/content.ts`, and both sites follow.

Active vs past comes from `isActive()` in `src/lib/projects.ts`, which is the same test the
`/projects` page and `llms.txt` use — a venture site and this one cannot disagree about
whether a project is still running.

URLs in these feeds are untagged, like the rest of the API. Campaign parameters mark a link
a person clicked; a feed is a machine resolving an identifier.

### MCP server

`https://mikeshoss.com/mcp` is a remote [MCP](https://modelcontextprotocol.io) server, so AI
clients can query this data as a connector rather than scraping the site. Add that URL as a
custom connector in any client that supports remote MCP servers.

It speaks streamable HTTP and is stateless — a JSON-RPC POST gets a single JSON response.

| Tool | Purpose |
| --- | --- |
| `get_resume` | Full structured resume, or one section via `section` |
| `search_experience` | Search roles, companies, and volunteering by keyword |
| `list_patents` | Patents, optionally filtered by keyword |
| `list_projects` | Projects, optionally filtered by status |
| `get_contact` | Contact details and profile links |

Call it directly to check it is up:

```bash
curl -s https://mikeshoss.com/mcp \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | python3 -m json.tool
```

The server lives in `worker/mcp.ts` and reads `/api/resume.json` through the Worker's assets
binding, so its output is identical to the JSON API by construction. It deliberately does not
import `content.ts`: that module derives `yearsExperience` from `new Date()` at module scope,
and Cloudflare pins `Date.now()` to the last I/O, which at module initialization has not
happened — so a direct import reports the epoch rather than the current year.

### Adding data

Add or edit entries in `src/data/content.ts`. The JSON endpoints, the JSON Resume document,
the MCP tools, `llms.txt`, and the page JSON-LD all derive from it, so a single edit
propagates everywhere on the next deploy.

## Analytics & campaign links

Google Analytics is configured in `src/components/Analytics.astro`, which does
two separate things behind two different guards.

The **gtag loader** is gated on `import.meta.env.PROD` *and* the hostname, so it
never runs in dev and never runs on a Cloudflare branch preview (previews are
production builds, so the PROD gate alone would not exclude them).

The **click listener** ships everywhere and no-ops when `gtag` is absent. One
delegated handler covers every link and button on the site:

| Event | Fires on | Notable params |
| --- | --- | --- |
| `click_internal` | in-site links | `link_url` (path) |
| `click_outbound` | external links | `link_domain`, `outbound: true` |
| `click_email` | `mailto:` links | `link_url` |
| `click_button` | buttons | — |

All four carry `link_text`, `link_location` and `page_path`. `link_location` is
derived from the nearest section heading, so a click reports as "Currently" or
"Selected results" and a new section needs no wiring.

Because the listener is not hostname-gated, it can be tested on a preview
rather than only observed in production: stub `window.gtag`, dispatch clicks,
and read back what would have been sent.

### Inbound campaign links

Safe to tag freely. Canonical URLs and `og:url` are built from the path at
build time, so `mikeshoss.com/?utm_source=linkedin` still canonicalises to
`https://mikeshoss.com/` and cannot fragment the index. GA4 reads `utm_*`
automatically — no configuration here.

### Outbound campaign links

`src/lib/links.ts` tags outbound links to domains whose analytics we own, so a
click arrives as an attributable campaign rather than an anonymous referral.
Referrers get dropped by privacy settings and stripped by some clients, and
they never say *where on this site* the click came from.

Only `OWNED_DOMAINS` are tagged; `withCampaign()` returns every other URL
untouched, so it is safe to wrap any href. GitHub, LinkedIn, Clio and Google
Patents expose no analytics to us, so parameters there would just be noise on
someone else's URL.

`utm_content` carries the placement, which is the part worth having — it
separates the footer link that appears on all 23 pages from a deliberate click
on the Epilogue venture page:

```
https://epiloguelabs.com/?utm_source=mikeshoss.com&utm_medium=referral
  &utm_campaign=personal-site&utm_content=footer
https://epiloguelabs.com/?utm_source=mikeshoss.com&utm_medium=referral
  &utm_campaign=personal-site&utm_content=venture-epilogue
```

Add a domain to `OWNED_DOMAINS` and its links tag themselves.

Tagging is applied only to rendered anchors — never to structured data, the
JSON API or `llms.txt`. Those URLs are identifiers, and a tagged one is a
different string for the same thing.

## Local Development

Requires Node.js (Node 20 is used in production).

```bash
npm install     # install dependencies
npm run dev     # start the dev server at http://localhost:4321
```

A helper script, `dev.sh`, optionally fetches/checks out a branch, installs, and starts the dev server: `./dev.sh [branch]`.

## Build & Preview

```bash
npm run check     # typecheck the project (astro check)
npm run build     # build the static site to dist/
npm run preview   # preview the production build locally
```

### Social card and icons

`public/og-image.png` and `public/apple-touch-icon.png` are generated, not
hand-drawn. Their sources are the HTML files in `scripts/`; edit those and
re-render:

```bash
npm run images
```

The renderer drives Playwright's Chromium over the DevTools Protocol and has no
npm dependencies, but it needs Node 22+ (for the global `WebSocket`) and a
Chromium on disk — set `CHROME_PATH` if it is not where Playwright puts it. The
outputs are committed, so a deploy never runs it.

The card is a PNG deliberately: LinkedIn, X, Facebook, Slack and iMessage all
ignore an SVG `og:image` and render a blank preview. Its dimensions (1200x630)
are declared in `src/layouts/Layout.astro` as `og:image:width`/`og:image:height`
and are set in `scripts/generate-images.mjs` — change one and change the other.

To preview the build through the Cloudflare Workers runtime locally (requires `wrangler`):

```bash
npm run dev:full  # astro build && wrangler dev
```

This is the only way to exercise the MCP server locally — `astro dev` does not run the
Worker. With it running the endpoint is at `http://localhost:8787/mcp`, and
`npx @modelcontextprotocol/inspector` can be pointed at it to browse the tools
interactively.

## Deployment

Hosted on **Cloudflare Workers** with automatic deployments:

1. Push to `main` → site rebuilds and deploys to production.
2. Push to `staging` → deploys to [staging.mikeshoss.com](https://staging.mikeshoss.com), behind a password.
3. Push to any other branch → preview deployment at a unique URL.

### Staging

Staging is a second Worker, `personalwebsite-staging`, defined as `env.staging` in
`wrangler.jsonc` and built by its own Workers Builds project whose production branch is
`staging` (deploy command `npx wrangler deploy --env staging`). It differs from production
in two ways: `run_worker_first` routes every request through `worker/index.ts`, and that
Worker holds a `STAGING_PASSWORD` secret. When the secret is present the Worker demands it
via HTTP Basic Auth (any username) before serving anything, including `/mcp`. Production
has no such secret, so the gate is inert there.

```bash
wrangler secret put STAGING_PASSWORD --env staging   # set or rotate the password
npm run build && wrangler dev --env staging          # run staging locally
```

For local runs, put `STAGING_PASSWORD=...` in `.dev.vars.staging` (gitignored).

To promote work, merge into `staging` first, check it there, then merge `staging` into
`main`.

**Cloudflare Workers Builds settings:**

- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: `20`

The dashboard build settings apply only to the production branch, so `wrangler.jsonc`
is committed at the repo root for non-production branch builds to use. It sets
`assets.directory` to `dist` and points `main` at `worker/index.ts`, a hand-written entry
that serves `/mcp` and hands everything else to the assets binding. That is not an Astro
SSR build: the site is still fully static (no adapter), and no `dist/_worker.js` exists.

Requests matching a static asset are served by Cloudflare's asset layer without invoking
the Worker, so `_headers` and `_redirects` apply exactly as they did before the Worker
entry was added.

Security, caching, and CORS headers are configured in `public/_headers`, and redirects in `public/_redirects` (the www-to-apex redirect is handled by Cloudflare Redirect Rules).

`public/robots.txt` is **not** the whole robots.txt that mikeshoss.com serves.
Cloudflare's AI Crawl Control prepends a managed block setting `Content-Signal`
and disallowing the major AI crawlers, and this file is appended after it. That
is why no per-crawler rules live here: a rule for a user-agent the managed block
already names would be served as a second, contradictory group. Check the live
file (`curl https://mikeshoss.com/robots.txt`) rather than the repo copy, and
change crawler policy in the Cloudflare dashboard.

Note also that the branch preview URLs are `*.workers.dev`, which Cloudflare
serves with `X-Robots-Tag: noindex`, so preview deployments cannot be indexed
even though the pages carry an `index, follow` robots meta.

Note that `/api/*` responses are prerendered to static files, so their headers come from
`public/_headers` — headers set inside an Astro route handler are not preserved for
prerendered routes.

## License

Licensed under the [Apache License 2.0](./LICENSE). See the [LICENSE](./LICENSE) and [NOTICE](./NOTICE) files for details.
