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
    sitemap({ filter: (page) => !page.includes('/blog') }),
  ],
});
