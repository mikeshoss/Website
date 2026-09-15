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
        const path = new URL(item.url).pathname.replace(/\/+$/, '') || '/';
        const priority =
          path === '/' ? 1.0
          : path === '/companies' || path.startsWith('/companies/') ? 0.9
          : path === '/experience' || path === '/projects' ? 0.8
          : 0.6;

        // Emit the same URL the page declares as its canonical. Astro's
        // directory build format would otherwise list /companies/ while the
        // page canonicalises to /companies, which reads to a crawler as two
        // URLs for one page.
        return {
          ...item,
          url: path === '/' ? item.url : new URL(path, item.url).href,
          lastmod: new Date().toISOString(),
          changefreq: path === '/' ? 'weekly' : 'monthly',
          priority,
        };
      },
    }),
  ],
});
