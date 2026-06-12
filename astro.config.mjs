import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: 'https://mikeshoss.com',
  server: { port: 4321 },

  integrations: [
    tailwind(),
    sitemap(),
  ],

  adapter: cloudflare()
});