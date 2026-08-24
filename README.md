# Mike Shoss — Personal Website

The source for [mikeshoss.com](https://mikeshoss.com), a fast, statically generated personal site built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com).

## Tech Stack

- **Framework:** [Astro](https://astro.build) 5 (static site generator)
- **Styling:** [Tailwind CSS](https://tailwindcss.com) 3 via `@astrojs/tailwind`, with the `@tailwindcss/typography` plugin
- **Fonts:** Self-hosted [Inter](https://fontsource.org/fonts/inter) and [JetBrains Mono](https://fontsource.org/fonts/jetbrains-mono) via `@fontsource` (no external font requests)
- **Content:** Markdown blog posts through Astro content collections (`astro:content`)
- **SEO:** `@astrojs/sitemap` for automatic sitemap generation, plus per-page meta tags and JSON-LD structured data in the base layout
- **Data:** Read-only JSON API and a remote MCP server, both derived from the same content module
- **Hosting:** Cloudflare Workers (Workers Builds + static assets)

## Project Structure

```
.
├── astro.config.mjs        # Astro config (site URL, port, sitemap + tailwind integrations)
├── tailwind.config.mjs     # Theme tokens (colors, fonts) and Tailwind content globs
├── public/                 # Static assets served as-is
│   ├── favicon.svg
│   ├── og-image.svg
│   ├── robots.txt
│   ├── _headers            # Cloudflare security, cache & CORS headers
│   └── _redirects          # Cloudflare redirects
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
    │   ├── companies.astro
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

All copy (hero text, experience, companies, projects, patents, skills, volunteering) lives in `src/data/content.ts`. Edit that file to update the site's text.

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
2. Push to any other branch → preview deployment at a unique URL.

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

Note that `/api/*` responses are prerendered to static files, so their headers come from
`public/_headers` — headers set inside an Astro route handler are not preserved for
prerendered routes.

## License

Licensed under the [Apache License 2.0](./LICENSE). See the [LICENSE](./LICENSE) and [NOTICE](./NOTICE) files for details.
