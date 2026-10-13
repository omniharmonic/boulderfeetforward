# Boulder Feet Forward — Design Spec

*Designed by Benjamin Life (@omniharmonic) as a gift to Boulder Feet Forward. Not a project of OpenCivics or OpenCivics Labs.*
*Companion to [`../research/00-synthesis-brief.md`](../research/00-synthesis-brief.md).*

---

## 1. The one idea

**The site is a walk.** BFF's whole method is *showing up every day, step by step*, and their logo is a pair of footprints. So the page is one continuous line, a trail that starts at the Flatirons in the hero and unspools down the left edge of every page. It draws itself as you scroll, and footprints (cut from the real logo) land along it, one per step. Each section hangs off the trail.

That is the single memorable thing. Everything else stays quiet.

- **Hero moment (the only automatic animation):** on load, the Flatirons ridge line draws in, then footprints walk across it left to right and the headline settles. About four seconds, once.
- **Through-line:** the trail's stroke carries the logo gradient (leaf green at the bottom → gold at the top). It's the same bottom-left → top-right direction as the logo: *forward and up*.
- **Wheel and tiers:** user-triggered motion only (hover, focus, tap).
- **Everything respects `prefers-reduced-motion`:** the trail is simply fully drawn, footprints are static.

## 2. Design plan (before review)

**Color (light, "Day")**: sage-tan paper `#E9E6D2` · raised `#F3F1E2` · deep pine ink `#15261A` · muted pine `#44553F` · leaf `#6B8E36` → gold `#EEC02B` (the logo gradient) · forest action `#1B754B`.
**Color (dark, "Night")**: night pine `#0F1A13` · raised `#16241B` · ink `#EAEBD6` · muted `#B5BDA2` · leaf `#8FB653` → gold `#F7D65C` · link green `#BFD66B`.
**Type:** *Newsreader* (variable serif with optical sizes, echoing the logo's bookish lettering) for headlines and pull-quotes; *Atkinson Hyperlegible* (designed by the Braille Institute for low-vision readers) for everything else.
**Layout:** left-aligned, ragged-right. A narrow left rail carries the trail; content sits in a 12-column grid to its right, max 1180 px. Line length ≤ 62 characters for body.
**Principles:** plain words; one walk; the wheel is the only place with a full spectrum; no stock-charity imagery.

### Wireframes (desktop)

```
HERO
┌───────────────────────────────────────────────────────────────┐
│ [bff mark] Boulder Feet Forward    Approach Work Impact Give… │ ☾  (Give)
│                                                               │
│  Meeting people                                               │
│  where they are.                                  ·  ☀        │
│                                                  /\    /\     │
│  A peer-led street outreach team in Boulder.   /\/  \/\/  \   │
│  We show up every day, and we keep showing up.        ⌇ ridge │
│  [ Give where it's needed ]  [ Volunteer ]          👣 👣 👣   │
│  Find us: Tuesdays 2:30 · Fridays 11:00 · Central Park        │
└───────────────────────────────────────────────────────────────┘

BODY (the trail runs down the left rail)
 ╎  ┌──────────────────────────────┐
 👣 │ When systems fail…           │  story, three short beats
 ╎  └──────────────────────────────┘
 👣  Wheel: [ 8-segment ring ]  →  [ detail panel: 3 stepped tiers ]
 ╎
 👣  The numbers, written as sentences, with one visual per idea
 ╎
 👣  Testimonials: one large quote at a time, scroll-snap carousel
 ╎
 👣  Ways to give (3 paths)  ·  Newsletter  ·  Footer + skyline
```

## 3. Review against the brief — what I changed

I checked the plan against the generic patterns this kind of page usually lands on.

| Default I caught | Change |
|---|---|
| Warm cream + high-contrast serif + terracotta accent | Paper is a *greener* sage-tan, not cream; no clay/terracotta anywhere. The only warm note is the logo's gold, and it's the brand's own |
| Gradient wash as decoration | The gradient is *meaning*: it runs along the trail in the logo's direction, and appears on the logo, the footprints and the primary button. Nowhere else |
| Big number + small label + gradient stat tiles | Stats are written as sentences with numerals inline. Each idea gets a *purpose-built* visual: "4 out of 5" = five footprint pairs, four filled; "20 people reach stable housing" = 20 dots in three honest groups (5 / 10 / 5) |
| Identical rounded cards everywhere | Only the wheel's detail panel and the testimonial quote are "objects." Everything else is open typography on the paper, divided by the trail and whitespace |
| ALL-CAPS tracked eyebrows over every heading; "01 / 02 / 03" | None. Numbering appears in exactly one place where the content *is* a sequence: the three tiers (1 → 2 → 3) |
| One accent word per headline | Headlines are plain sentences, set large |
| Fade-and-slide-up on every section; hover lift on every card | No scroll-reveal on sections. Only the trail draw, footprints, and user-triggered motion |
| Stock photo of a person looking hopeful | No client photography at all. Line art only |
| Packet's rainbow dimension palette bleeding into the whole page | Rainbow lives *only* inside the wheel (muted, tonal); the rest of the site is pine, sage, tan and gold |

**Spent boldness:** the trail. **Everything else is restrained.**

## 4. Tokens (as implemented)

```css
/* Day */
--paper:#E9E6D2; --raised:#F3F1E2; --sunken:#DAD7BE;
--ink:#15261A;   --ink-2:#44553F; --line:rgba(21,38,26,.2);
--leaf:#6B8E36;  --gold:#EEC02B;  --action:#1B754B;

/* Night */
--paper:#0F1A13; --raised:#16241B; --sunken:#0B130E;
--ink:#EAEBD6;   --ink-2:#B5BDA2; --line:rgba(234,235,214,.2);
--leaf:#8FB653;  --gold:#F7D65C;  --action:#BFD66B;
```

**Type scale** (fluid, 1.25 ratio, rem): 0.875 / 1 / 1.125 (body) / 1.4 / 1.75 / 2.4 / 3.4 / 4.8–6.4 (display, `clamp`). Newsreader headlines run weight 380 at display sizes, tight leading (1.02–1.1), negative tracking −0.015em. Body 18 px / 1.65 Atkinson Hyperlegible.

**Contrast:** all text pairs are tested to WCAG AA in both themes during QA (the script is in `tools/contrast.mjs`).

## 5. Components

| Component | Behavior |
|---|---|
| **Trail** | One SVG path generated from section anchors; draws with scroll (`stroke-dashoffset`); footprints land as it reaches them. On mobile it narrows to a thin left rail. Static if reduced motion or no JS |
| **Footprints** | The two real footprints from the logo, extracted and reused as `<symbol>`s. Alternate left/right |
| **Hero scene** | Flatirons ridge, pines, tiny downtown skyline, sun arc: single-weight line art, drawn on load |
| **Header** | Logo mark + wordmark, flat nav (Approach · Work · Impact · Give · Volunteer · About), "Need help?" text link, theme toggle, gradient *Give* button. Sticky, quiet |
| **Wellness wheel** | 8-segment ring; hover, focus or tap a segment → detail panel swaps. Panel shows the dimension plus its three tiers as a rising staircase (Tier 1 low, Tier 3 high). Arrow keys move between segments. Without JS, falls back to a list |
| **Tier staircase** | Three steps, bottom-left to top-right, echoing the trail direction |
| **Numbers as sentences** | Serif numerals inline; purpose-built visuals (five footprints; 20 dots) |
| **Where your gift goes** | One stacked horizontal bar (Tier 1 $48,920 / Tier 2 $147,200 / Tier 3 $76,000) with itemized rows below |
| **Testimonial carousel** | Native scroll-snap, one large serif quote at a time; prev/next buttons and dots as tabs; no auto-advance; optional "Watch their story" link per quote |
| **Giving paths** | (1) Give where it's needed most (default, with a one-time/monthly choice that routes to the right Zeffy form), (2) Fund something specific (a ledger of programs with concrete impact amounts), (3) Give things (Amazon wish list + items list) |
| **Volunteer shifts** | Recurring shifts and one-off events from the CMS; "I'm in" opens a short form that posts to BFF's own Google Sheet (Apps Script). Fallback is a prefilled email |
| **Newsletter** | One-field form in the footer and on `/newsletter/`; posts to the email provider; inline confirmation |
| **Password gate** | Branded prompt page; build-time encryption (see Deployment) |

## 6. Page specs

| Page | Composition |
|---|---|
| **Home** | Hero → "When systems fail…" story (three beats) → the wheel (teaser: same component) → numbers as sentences → one testimonial → ways to give → newsletter |
| **/approach/** | Person First / Wellness First / The engagement bridge → full wheel → three tiers → "what meeting people where they are looks like" (five modes as an open list) → "we stick around for the long haul" |
| **/work/** | Two weekly events with times and place, then Peer Support, Case Management, with plain descriptions; links through |
| **/work/weekly-outreach/** | Tuesdays in the Park, Friday Breakfast Club: schedule, what's offered, partners (as a quiet list), workshops |
| **/work/peer-support/** | Original copy tightened, SAMHSA definition, the eight dimensions, further reading |
| **/work/case-management/** | New page from the packet: what it is, how it starts, what it covers (IDs, documents, benefits, housing assessments), the honesty line about outcomes |
| **/impact/** | Numbers → housing honesty (20 dots) → "4 out of 5" → testimonials carousel → where your gift goes |
| **/give/** | The three paths; programs; wish list; item donations; where to send clothing and furniture |
| **/volunteer/** | What it's like, shifts, sign-up form, bus-pass note, FAQ |
| **/about/** | Mission (near-verbatim) and the team |
| **/contact/** | Phone, email, PO box, find-us card (Tuesdays and Fridays), a contact form fallback (mailto) |
| **/newsletter/** | Signup |
| **404** | A trail that ends: "This path doesn't go anywhere. Here's where to find us." |

## 7. Voice

Plain verbs, sentence case, short declaratives, the way the mission page already speaks. "Neighbors" and "peers"; not "clients," "beneficiaries" or "the homeless." Buttons say what happens: *Give where it's needed*, *Sign me up*, *Join the newsletter*. Numbers are dated ("as of Oct 2026") and sourced to the packet. Gap-fill copy is marked `draft: true` in its file's front matter (shown in the editor) until Libby approves it.

## 8. Accessibility and performance floor

- WCAG 2.2 AA contrast, visible 3 px focus ring, skip link, landmarks, real `<button>`s and `<a>`s.
- Wheel is keyboard-operable (arrow keys, Home/End) and announces the selected dimension.
- Carousel is a labelled region with buttons; no auto-advance.
- `prefers-reduced-motion`: no smooth scroll, no trail draw, no footprint walk.
- Target: under 300 KB of JS and fonts per page after compression (two variable fonts, subsetted to Latin); no video, no raster images except the social-share card.
- Theme: respects `prefers-color-scheme`, remembers the toggle in `localStorage` (wrapped in try/catch).

## 9. Deployment (private repo, password-protected Pages)

- Repo is **private**, owned by BFF's GitHub account or organization.
- GitHub Actions builds the Astro site, then runs **StatiCrypt** over the built HTML (except `/admin/` and redirect stubs). Password is the `SITE_PASSWORD` repository secret.
- Honest limits: only HTML is encrypted; assets are public at hashed URLs. True private Pages requires GitHub Enterprise Cloud. Use a long passphrase. Pages are `noindex` while gated.
- To launch publicly: delete one workflow step.
