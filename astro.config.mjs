import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://mikeshoss.com',
  server: { port: 4321 },
  integrations: [
    tailwind(),
    // Blog is temporarily removed from the site (see public/_redirects), so its
    // pages must not be advertised in the sitemap while they redirect away.
    //
    // `lastmod` is the build time: the site is static and fully rebuilt on each
    // deploy, so every page's content is exactly as old as the deploy that
    // produced it. Priority is a hint about relative importance within this
    // site only — the home page first, then the pages that carry the substance.
    sitemap({
      filter: (page) => !page.includes('/blog'),
      serialize(item) {
        // Slash-stripped only to classify the page; the emitted URL keeps its.
        const path = new URL(item.url).pathname.replace(/\/+$/, '') || '/';
        const priority =
          path === '/' ? 1.0
          : path === '/companies' || path.startsWith('/companies/') ? 0.9
          : path === '/experience' || path === '/projects' ? 0.8
          : 0.6;

        // item.url is left as Astro emits it — the trailing-slash form, which
        // is what Cloudflare serves and what each page declares as canonical.
        return {
          ...item,
          lastmod: new Date().toISOString(),
          changefreq: path === '/' ? 'weekly' : 'monthly',
          priority,
        };
      },
    }),
  ],
});
