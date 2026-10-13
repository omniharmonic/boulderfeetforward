#!/usr/bin/env node
/**
 * Password gate for the built site.  Run after `astro build`:   SITE_PASSWORD=... node tools/gate.mjs
 *
 * What it does: encrypts every built HTML page with StatiCrypt, so a visitor sees a password box and
 * the page content only decrypts in their browser after they type the password. The /admin/ editor and
 * the old-address redirect pages are left alone.
 *
 * Honest limits (also in DEPLOY.md): only the HTML is encrypted. Images, fonts, CSS and scripts are
 * served as normal files at long, unguessable-looking addresses. That is fine for a work-in-progress
 * site, and it is not a vault. Use a long passphrase (16+ characters).
 *
 * Designed and built by Benjamin Life (@omniharmonic) as a gift to Boulder Feet Forward.
 */
import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, statSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const password = process.env.SITE_PASSWORD;

if (!existsSync(dist)) { console.error('No dist/ folder. Run `npm run build` first.'); process.exit(1); }
if (!password) {
  console.error('SITE_PASSWORD is not set. Add it as a repository secret (Settings, Secrets and variables, Actions).');
  process.exit(1);
}
if (password.length < 16) console.warn('Warning: the password is shorter than 16 characters. A long passphrase is much safer.');

// A fixed salt keeps the "remember me" login working across pages and across deploys. It is not secret.
const SALT = 'b3ff0f0a7c5d4e21a96d1c8e50b7f3a2';

/* ---------- branded password page ---------- */
const mark = readFileSync(join(root, 'tools/gate-mark.svg'), 'utf8').replace(/<svg /, '<svg class="gate-mark" ');
let tpl = readFileSync(join(root, 'node_modules/staticrypt/lib/password_template.html'), 'utf8');
const css = `
  .staticrypt-content { background: #e9e6d2 !important; font-family: Georgia, 'Times New Roman', serif !important; color: #15261a; }
  .staticrypt-form { background: #f3f1e2 !important; box-shadow: none !important; border-radius: 16px; border-top: 6px solid #6b8e36; }
  .staticrypt-title { font-size: 1.7em !important; font-weight: 400; margin: 0.4em 0 0.6em; }
  .staticrypt-instructions p { font-size: 1.05rem; line-height: 1.45; }
  .gate-mark { width: 150px; height: auto; display: block; margin: 0 auto; }
  .staticrypt-password-container { background: #ffffff !important; border: 2px solid #44553f !important; border-radius: 10px; }
  .staticrypt-form input[type="password"], input[type="text"] { font-family: Arial, sans-serif; color: #15261a; }
  .staticrypt-form .staticrypt-decrypt-button { text-transform: none !important; border-radius: 999px !important; background: linear-gradient(100deg, #a7c25a, #f2cb4a) !important; color: #15261a !important; font-weight: 700; font-size: 16px !important; padding: 14px !important; }
  .staticrypt-form .staticrypt-decrypt-button:hover, .staticrypt-form .staticrypt-decrypt-button:focus { filter: brightness(0.94); }
  .staticrypt-hr { border-top-color: rgba(21,38,26,.2) !important; }
  label.staticrypt-remember { font-family: Arial, sans-serif; font-size: 15px; }
  #staticrypt-password:focus-visible, .staticrypt-decrypt-button:focus-visible { outline: 3px solid #1b6d46; outline-offset: 2px; }
  @media (prefers-color-scheme: dark) {
    .staticrypt-content { background: #0f1a13 !important; color: #eaebd6; }
    .staticrypt-form { background: #16241b !important; }
    .staticrypt-password-container { background: #0b130e !important; border-color: #b9c1a6 !important; }
    .staticrypt-form input[type="password"], input[type="text"] { color: #eaebd6; }
    .staticrypt-hr { border-top-color: rgba(234,235,214,.2) !important; }
  }
`;
tpl = tpl.replace('</style>', css + '</style>');
tpl = tpl.replace('<div class="staticrypt-instructions">', mark + '<div class="staticrypt-instructions">');
// Show the wrong-password message on the page, not in a browser alert box.
if (!tpl.includes('alert(templateError);')) throw new Error('StatiCrypt template changed: cannot replace the alert.');
tpl = tpl.replace('alert(templateError);', "var g = document.getElementById('gate-error'); g.textContent = templateError; g.hidden = false; document.getElementById('staticrypt-password').select();");
tpl = tpl.replace('</form>', '<p id="gate-error" role="alert" hidden></p></form>');
tpl = tpl.replace('</style>', '  #gate-error { margin: 14px 0 0; padding: 10px 14px; border-radius: 10px; background: #fbe9d8; color: #5a2400; font-family: Arial, sans-serif; font-size: 15px; font-weight: 700; }\n  @media (prefers-color-scheme: dark) { #gate-error { background: #3a1f10; color: #ffd9bd; } }\n</style>');
// Check "remember me" by default so people are not asked again on every page.
tpl = tpl.replace('<input id="staticrypt-remember" type="checkbox" name="remember" />', '<input id="staticrypt-remember" type="checkbox" name="remember" checked />');
tpl = tpl.replace('<meta name="viewport"', '<meta name="robots" content="noindex, nofollow" />\n        <link rel="icon" href="data:," />\n        <meta name="viewport"');
// Warm the browser cache with the site fonts while the visitor is typing the password, so the page
// does not flash a fallback font when it opens. The base path comes from the favicon link in the build.
{
  const home = readFileSync(join(dist, 'index.html'), 'utf8');
  const prefix = (home.match(/href="([^"]*?)favicon\.svg"/) || [, '/'])[1];
  const fonts = readdirSync(join(dist, '_astro')).filter((f) => /^(newsreader-latin-opsz|atkinson-hyperlegible-latin-(400|700))-?.*\.woff2$/.test(f) && !f.includes('latin-ext'));
  const links = fonts.map((f) => `<link rel="preload" as="font" type="font/woff2" href="${prefix}_astro/${f}" crossorigin>`).join('\n        ');
  tpl = tpl.replace('<meta name="viewport"', links + '\n        <meta name="viewport"');
}
const work = join(tmpdir(), 'bff-gate-' + process.pid);
mkdirSync(work, { recursive: true });
const tplPath = join(work, 'template.html');
writeFileSync(tplPath, tpl);

/* ---------- which files ---------- */
const walk = (dir) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const files = walk(dist).filter((f) => {
  if (!f.endsWith('.html')) return false;
  const rel = relative(dist, f).replaceAll('\\', '/');
  if (rel.startsWith('admin/')) return false;                       // the editor must stay reachable
  if (/http-equiv=["']refresh["']/i.test(readFileSync(f, 'utf8'))) return false; // redirect stubs
  return true;
});
if (!files.length) { console.error('No HTML files found to protect.'); process.exit(1); }

/* ---------- encrypt ---------- */
const bin = join(root, 'node_modules/.bin/staticrypt');
let n = 0;
for (const f of files) {
  const original = readFileSync(f, 'utf8');
  const out = join(work, 'out', String(n++));
  const r = spawnSync(bin, [
    f, '-d', out, '-c', 'false', '-s', SALT, '--short', '--remember', '30', '-t', tplPath,
    '--template-title', 'Boulder Feet Forward',
    '--template-instructions', 'This site is private while we finish it. Enter the password to come in.',
    '--template-button', 'Enter',
    '--template-placeholder', 'Password',
    '--template-remember', 'Keep me signed in on this device',
    '--template-error', 'That password did not work. Try again.',
  ], { env: { ...process.env, STATICRYPT_PASSWORD: password }, encoding: 'utf8' });
  if (r.status !== 0) { console.error(`Failed on ${relative(dist, f)}:\n${r.stderr || r.stdout}`); process.exit(1); }
  const produced = join(out, f.split(/[\\/]/).pop());
  copyFileSync(produced, f);
  // safety net: the readable page text must not survive in the output
  const h1 = original.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const probe = h1 ? h1[1].replace(/<[^>]+>/g, '').trim().slice(0, 24) : '';
  if (probe && readFileSync(f, 'utf8').includes(probe)) { console.error(`Page text is still readable in ${relative(dist, f)}.`); process.exit(1); }
}
rmSync(work, { recursive: true, force: true });

// Keep search engines out while the site is gated.
writeFileSync(join(dist, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
console.log(`Protected ${files.length} pages. Left /admin/ and redirect pages open.`);
