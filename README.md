# Boulder Feet Forward website

The website for [Boulder Feet Forward](https://boulderfeetforward.org/), a peer-led street outreach team in Boulder, Colorado.

**Designed and built as a gift by Benjamin Life ([@omniharmonic](https://x.com/omniharmonic)).** It is not a project of any other organization. Boulder Feet Forward owns it and can change it, move it, or hand it to anyone, with no help from the person who built it.

## Where to start

| If you are... | Read |
|---|---|
| Staff who will edit the site | [EDITING-GUIDE.md](EDITING-GUIDE.md) |
| Setting up GitHub, the password, the sign-up forms or the launch | [DEPLOY.md](DEPLOY.md) |
| Checking what still needs a person at BFF to confirm | [docs/TO-CONFIRM.md](docs/TO-CONFIRM.md) |
| A developer picking this up | the rest of this file, and [docs/design-spec.md](docs/design-spec.md) |

## What it is

A static site built with [Astro](https://astro.build). There is no server and no database, so it costs nothing to host and there is little to break or hack. Staff edit content in a browser-based editor at `/admin/` ([Sveltia CMS](https://sveltiacms.app)). Each save is a commit to this repository, and GitHub Actions rebuilds and republishes the site in about two minutes.

The design idea is that **the site is a walk**: a trail down the left edge draws itself as you scroll, with footprints from the BFF logo landing along it. Everything else stays quiet. Light and dark modes both work, and motion turns off for people who ask their device for reduced motion.

## Run it on your computer

You need [Node.js](https://nodejs.org) 22.12 or newer.

```bash
npm install
npm run dev          # opens a live preview at http://localhost:4321
npm run build        # builds the site into dist/
npm run build:gated  # builds, then password-protects (needs SITE_PASSWORD set)
node tools/contrast.mjs   # checks text colors meet WCAG AA in light and dark
```

## Where things live

```
src/content/         editable text: pages, quotes, programs, events, team, FAQ (Markdown)
src/data/            editable numbers and links: site.json, stats.json, budget.json,
                     dimensions.json (the wellness wheel), partners.json
src/pages/           one file per page of the site
src/components/      the pieces: Wheel, Facts, Carousel, Budget, HeroScene, Header, Footer...
src/scripts/         the small scripts: trail, wheel, carousel, volunteer form, newsletter, theme
src/styles/global.css  every color, size and rule (colors are at the top)
public/admin/        the editor (config.yml says what staff can edit)
tools/               gate.mjs (password), contrast.mjs (accessibility), build-hero.py, build-sprite.py
integrations/        volunteer-apps-script.gs (the Google Sheet behind volunteer sign-ups)
.github/workflows/   deploy.yml (build and publish)
```

## Settings that change how it builds

Set in `.github/workflows/deploy.yml` (or in your shell when running locally):

| Setting | Default | What it does |
|---|---|---|
| `PUBLIC_NOINDEX` | `true` | Tells search engines to stay away. Set `false` at launch. |
| `PUBLIC_SHOW_DRAFTS` | `true` | Shows "Draft for Libby" notes and "waiting on written OK" flags. Set `false` at launch. |
| `PUBLIC_REQUIRE_CONSENT` | `false` | When `true`, any quote still marked "waiting on written OK" is left out. |
| `SITE_URL`, `BASE_PATH` | filled in by the workflow | Where the site lives (matters on GitHub Pages project sites). |
| `SITE_PASSWORD` | repository secret | The password for the gate. See DEPLOY.md. |

## Changing the look

All colors are at the top of `src/styles/global.css`. Each is written once as a pair, `light-dark(day, night)`. The logo gradient is `--g0` to `--g3`. The eight wellness-wheel colors are near the end of the wheel section. After changing colors, run `node tools/contrast.mjs`.

The hero drawing is generated: edit the numbers in `tools/build-hero.py` and run `python3 tools/build-hero.py`.

## Credits

- Design, build and research: Benjamin Life ([@omniharmonic](https://x.com/omniharmonic)).
- Logo: Boulder Feet Forward. It was cleaned up and vectorized for this site.
- Type: [Newsreader](https://fonts.google.com/specimen/Newsreader) (Production Type) and [Atkinson Hyperlegible](https://brailleinstitute.org/freefont) (Braille Institute), both under the SIL Open Font License.
- Wellness framework: SAMHSA's Eight Dimensions of Wellness.
