#!/usr/bin/env node
/* Checks that the site's text and button colors meet WCAG AA in both Day and Night.
   Run:  node tools/contrast.mjs        (exits with an error if anything fails)
   Designed and built by Benjamin Life (@omniharmonic) as a gift to Boulder Feet Forward. */

const hex = (h) => { h = h.replace('#', ''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255); };
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const L = (rgb) => { const [r, g, b] = rgb.map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [L(a), L(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
// color-mix(in oklab, a pct%, b)
const toOk = (rgb) => { const [r, g, b] = rgb.map(lin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s]; };
const fromOk = ([L_, a, b]) => { const l = (L_ + 0.3963377774 * a + 0.2158037573 * b) ** 3, m = (L_ - 0.1055613458 * a - 0.0638541728 * b) ** 3, s = (L_ - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, bb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  const gam = (c) => { c = Math.max(0, Math.min(1, c)); return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055; };
  return [gam(r), gam(g), gam(bb)]; };
const mix = (a, pct, b) => { const A = toOk(a), B = toOk(b); return fromOk(A.map((v, i) => v * pct + B[i] * (1 - pct))); };

const themes = {
  Day:   { paper: '#e9e6d2', raised: '#f3f1e2', sunken: '#dad7be', ink: '#15261a', ink2: '#3f4f3b', action: '#1b6d46', btnA: '#a7c25a', btnB: '#f2cb4a', focus: '#1b6d46' },
  Night: { paper: '#0f1a13', raised: '#16241b', sunken: '#0b130e', ink: '#eaebd6', ink2: '#b9c1a6', action: '#bfd66b', btnA: '#9fc35a', btnB: '#f3d768', focus: '#f7d65c' },
};
const dims = { physical: ['#09518d', '#09518d', '#ffffff'], social: ['#4b87b1', '#3b749c', '#ffffff'], financial: ['#03a5c3', '#03a5c3', '#0b1a1f'], environmental: ['#3f8733', '#397b2e', '#ffffff'], intellectual: ['#f9bd27', '#f9bd27', '#15261a'], occupational: ['#e7691b', '#e7691b', '#15261a'], emotional: ['#db4bab', '#c43a97', '#ffffff'], spiritual: ['#7539ab', '#7539ab', '#ffffff'] };

let fails = 0;
const check = (label, fg, bg, min = 4.5) => {
  const r = ratio(fg, bg), ok = r >= min;
  if (!ok) fails++;
  console.log(`${ok ? 'pass' : 'FAIL'}  ${r.toFixed(2).padStart(5)}  (need ${min})  ${label}`);
};
for (const [name, t] of Object.entries(themes)) {
  console.log(`\n== ${name}`);
  const c = Object.fromEntries(Object.entries(t).map(([k, v]) => [k, hex(v)]));
  check('body text on paper', c.ink, c.paper);
  check('muted text on paper', c.ink2, c.paper);
  check('body text on raised', c.ink, c.raised);
  check('muted text on raised', c.ink2, c.raised);
  check('muted text on footer (sunken)', c.ink2, c.sunken);
  check('links on paper', c.action, c.paper);
  check('links on raised', c.action, c.raised);
  check('button text on gradient start', hex('#15261a'), c.btnA);
  check('button text on gradient end', hex('#15261a'), c.btnB);
  check('focus ring on paper (non-text, 3:1)', c.focus, c.paper, 3);
  for (const [d, [base, fill, on]] of Object.entries(dims)) {
    const tint = mix(hex(base), 0.2, c.raised);
    check(`wheel ${d}: label on resting segment`, c.ink, tint);
    const hover = mix(hex(base), 0.38, c.raised);
    check(`wheel ${d}: label on hovered segment`, c.ink, hover);
    check(`wheel ${d}: label on selected segment`, hex(on), hex(fill));
  }
}
console.log(fails ? `\n${fails} check(s) failed.` : '\nAll checks pass.');
process.exit(fails ? 1 : 0);
