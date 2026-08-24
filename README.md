# Mike Shoss — Personal Website

The source for [mikeshoss.com](https://mikeshoss.com), a fast, statically generated personal site built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com).

## Tech Stack

- **Framework:** [Astro](https://astro.build) 5 (static site generator)
- **Styling:** [Tailwind CSS](https://tailwindcss.com) 3 via `@astrojs/tailwind`, with the `@tailwindcss/typography` plugin
- **Fonts:** Self-hosted [Inter](https://fontsource.org/fonts/inter) and [JetBrains Mono](https://fontsource.org/fonts/jetbrains-mono) via `@fontsource` (no external font requests)
- **Content:** Markdown blog posts through Astro content collections (`astro:content`)
- **SEO:** `@astrojs/sitemap` for automatic sitemap generation, plus per-page meta tags and JSON-LD structured data in the base layout
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
│   ├── llms.txt
│   ├── _headers            # Cloudflare security & cache headers
│   └── _redirects          # Cloudflare redirects
└── src/
    ├── data/content.ts     # All site content (edit here to update text)
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
    │   ├── blog/            # Blog index + [slug] post pages
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

### JSON API

The site also exposes a small read-only JSON API, prerendered at build time and served as static files. The index is at `/api/index.json`, with endpoints for `companies`, `experience`, `projects`, `patents`, `volunteering`, and `skills`.

## Local Development

Requires Node.js (Node 20 is used in production).

```bash
npm install     # install dependencies
npm run dev     # start the dev server at http://localhost:4321
```

A helper script, `dev.sh`, optionally fetches/checks out a branch, installs, and starts the dev server: `./dev.sh [branch]`.

## Build & Preview

```bash
npm run build     # build the static site to dist/
npm run preview   # preview the production build locally
```

To preview the build through the Cloudflare Workers runtime locally (requires `wrangler`):

```bash
npm run dev:full  # astro build && wrangler dev
```

## Deployment

Hosted on **Cloudflare Workers** with automatic deployments:

1. Push to `main` → site rebuilds and deploys to production.
2. Push to any other branch → preview deployment at a unique URL.

**Cloudflare Workers Builds settings:**

- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: `20`

The dashboard build settings apply only to the production branch, so `wrangler.jsonc`
is committed at the repo root for non-production branch builds to use. The site is
built statically (no Astro adapter), so that config sets `assets.directory` and
deliberately omits `main` — there is no `dist/_worker.js` entrypoint.

Security and caching headers are configured in `public/_headers`, and redirects in `public/_redirects` (the www-to-apex redirect is handled by Cloudflare Redirect Rules).

## License

Licensed under the [Apache License 2.0](./LICENSE). See the [LICENSE](./LICENSE) and [NOTICE](./NOTICE) files for details.
