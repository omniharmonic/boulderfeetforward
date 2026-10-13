import { defineConfig } from 'astro/config';

// Where the site lives. For a GitHub Pages project site this is
//   SITE_URL=https://<account>.github.io   BASE_PATH=/<repo-name>
// For a custom domain, set SITE_URL to that domain and leave BASE_PATH empty.
// The deploy workflow fills both in automatically.
const site = process.env.SITE_URL || 'https://example.github.io';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  // Old Google Sites addresses keep working.
  redirects: {
    '/home': '/',
    '/about-us': '/about/',
    '/about-us/our-mission': '/about/',
    '/about-us/our-approach': '/approach/',
    '/our-work': '/work/',
    '/our-work/peer-support': '/work/peer-support/',
    '/our-work/weekly-outreach': '/work/weekly-outreach/',
    '/our-work/tuesdays-in-the-park': '/work/weekly-outreach/',
    '/our-work/friday-breakfast-club': '/work/weekly-outreach/',
    '/get-involved': '/give/',
    '/get-involved/donate': '/give/',
    '/get-involved/sponsor': '/give/',
    '/get-involved/volunteer': '/volunteer/',
    '/get-involved/contact': '/contact/',
  },
});
