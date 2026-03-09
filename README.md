# Mike Shoss — Personal Website

A lightweight, modern personal website built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com).

## Tech Stack

- **Framework:** Astro (static site generator)
- **Styling:** Tailwind CSS
- **Hosting:** Cloudflare Pages

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deployment

Hosted on **Cloudflare Pages** with automatic deployments:

1. Push to `main` → site rebuilds and deploys automatically
2. Push to any other branch → preview deployment at a unique URL

**Cloudflare Pages settings:**
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: `20`

## Structure

- `src/pages/` — Pages (Home, Companies, Projects, Experience, Contact)
- `src/components/` — Shared components (Nav, Footer)
- `src/layouts/` — Base HTML layout with SEO
- `src/data/content.ts` — All site content (edit here to update text)
- `public/` — Static assets, robots.txt, llms.txt

## Editing Content

All text content lives in `src/data/content.ts`. Edit that file to update any information on the site.
