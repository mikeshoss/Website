# Mike Shoss — Personal Website

A lightweight, modern personal website built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com).

## Tech Stack

- **Framework:** Astro (static site generator)
- **Styling:** Tailwind CSS
- **Deployment:** Docker (nginx)

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

## Docker

```bash
docker build -t mikeshoss-site .
docker run -p 8080:80 mikeshoss-site
```

Then visit `http://localhost:8080`.

## Structure

- `src/pages/` — Pages (Home, Companies, Projects, Experience, Contact)
- `src/components/` — Shared components (Nav, Footer)
- `src/layouts/` — Base HTML layout with SEO
- `src/data/content.ts` — All site content (edit here to update text)
- `public/` — Static assets, robots.txt, llms.txt

## Editing Content

All text content lives in `src/data/content.ts`. Edit that file to update any information on the site.
