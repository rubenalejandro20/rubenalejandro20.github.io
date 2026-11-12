// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://matchdayliveofficial.com',

  integrations: [react(), sitemap()],

  // Legacy /index.html needs no redirect: the homepage already builds to
  // dist/index.html, which IS that exact path (a redirects entry here
  // collides with the real file — see commit history for the EISDIR it caused).
  redirects: {
    '/matchday-analytics.html': '/analytics',
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
