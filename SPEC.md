# mentalmodelsdaily.com: coding spec

Version 1 · 31 Oct 2026 · for Claude Code in the cloud, working in `mentalmodelsdaily/mentalmodelsdaily.github.io`.

This is the build brief. **What** the site is and why lives in `BLUEPRINT.md` (the agreed blueprint); the look lives in `BRAND.md`; what was exported and how to refresh it lives in `HANDOVER.md`. This file says **how to build it**: stack, data contract, routes, components, motion, security, tests and the order of work. Where this spec and the blueprint disagree, ask in the pull request rather than guess.

---

## 0. Ground rules

1. **Never write or edit content.** Every word a reader sees comes from `src/data/*.json` or `src/content/**/*.md`, which are exported from the project's database on the owner's Mac (`step17_site_data.py`). If text is missing, render nothing (or a clearly marked `TODO` in development builds only) and list it in the PR. Do not invent model descriptions, stories, prices, quotes, reviews or links.
2. **This repo is public.** Never add paid content (full book entries, stories in full, workbook practice pages, more than the 6 public deck cards), transcripts, credentials, API keys, or the Roxborough CF font file unless `HANDOVER.md` says its web licence has been bought.
3. **Dependencies:** `astro` and `@astrojs/sitemap` only. No React/Vue/Svelte, no Tailwind or UI kit, no animation, carousel, analytics or icon libraries. Astro's built-in image service (sharp) and `astro:content` (with `astro/zod`) are fine because they ship with Astro. Pin exact versions and commit the lockfile. Dev-only tools may run through `npx` in CI without being added to `package.json`.
4. **JavaScript budget:** about 10 KB (minified, before compression) of our own JS on any page, all of it progressive enhancement. Every page must read and navigate fully with JavaScript off.
5. **Work in pull requests**, one per milestone (§15), each with its Cloudflare preview link and screenshots at 390 px and 1280 px wide. Never push to `master` directly, never force-push, never merge your own PR. Commit as the repo's configured user.
6. British spelling in code comments and any UI string that is not from the data (button labels, aria labels). Keep labels in `src/data/site.json` (`ui` block) so the owner can edit them.

## 1. Stack and hosting

- **Astro** (current stable major, static output, `output: "static"`), **Node 22 LTS**, npm.
- **Cloudflare Pages**: build `npm run build`, output `dist/`, `NODE_VERSION=22`. Every branch gets a preview URL; a failed build leaves the last good deploy live.
- **Domain:** `mentalmodelsdaily.com` (apex) with `www` redirecting to it. `CNAME` stays until the DNS moves from GitHub Pages to Cloudflare; the owner switches DNS.
- **Old site:** before the first PR, the 2020 Jekyll blog on `master` must already be preserved on a `legacy-2020-blog` branch (create it from `master` if it does not exist, in its own small PR or as instructed in `HANDOVER.md`). The Astro site replaces the tree on `master` through the milestone PRs.
- **Daily rebuild:** a GitHub Actions workflow on `cron: "15 5 * * *"` (05:15 UTC, after the podcast's 05:00 release) calls the Cloudflare Pages deploy hook stored as the repo secret `CF_DEPLOY_HOOK`, so `/today` and the Home hero change each day. The owner adds the secret.

## 2. Repository layout

```
/
├─ astro.config.mjs          site: "https://mentalmodelsdaily.com", trailingSlash: "always", integrations: [sitemap()]
├─ package.json              scripts: dev, build, preview, check (astro check + scripts/verify.mjs)
├─ BLUEPRINT.md  BRAND.md  HANDOVER.md  SPEC.md (this file)
├─ public/
│  ├─ _headers               security and cache headers (§11)
│  ├─ fonts/                 goudy-*.woff2, plex-sans-condensed-400.woff2, roxborough-cf.woff2 (only once licensed)
│  ├─ films/                 deck|workbook|almanac-{1080,720}.{mp4,webm}, <name>-poster.avif
│  ├─ downloads/             nothing paid; the printable is emailed, not hosted
│  ├─ favicon.svg  favicon.ico  apple-touch-icon.png  site.webmanifest  robots.txt
├─ src/
│  ├─ data/                  exported JSON (§3); never hand-edited
│  ├─ content/pages/         copy in Markdown: about, privacy, cookies, terms, shipping-returns, affiliate-disclosure, accessibility
│  ├─ assets/
│  │  ├─ drawings/models/<id>.png     365, transparent, 1600 px wide
│  │  ├─ drawings/parts/<code>.png    8 (D R P W S E M X)
│  │  ├─ drawings/fields/<slug>.png   16
│  │  ├─ drawings/personas/<key>.png  10
│  │  ├─ products/            covers (fronts, backs, pair), deck box (front, back, pair, 3d), card mock-ups
│  │  ├─ cards/<C##>-front.png, <C##>-back.png   the public cards only (§3.6)
│  │  ├─ look-inside/workbook-{1..4}.png, almanac-{sample,contents,overview,a-z,index,toolkit}.png
│  │  ├─ og/<slug>.jpg        1200 × 630 sharing images (365 models + home, deck, workbook, almanac), pre-rendered
│  │  └─ brand/brain-mark.svg, streaks.svg
│  ├─ content.config.ts      collections with zod schemas over src/data (§3)
│  ├─ styles/                tokens.css, base.css, rooms.css, motion.css (§5, §8)
│  ├─ layouts/Base.astro     <head>, header, footer, consent dialog, skip link
│  ├─ components/            §7
│  ├─ scripts/               the few small client scripts (§8, §9), each under 2 KB
│  └─ pages/                 §6, plus _redirects.ts and search.json.ts endpoints
└─ scripts/verify.mjs        post-build checks, plain Node, no dependencies (§13)
```

## 3. Data contract (`src/data/`)

Load each file with a `file()` loader in `src/content.config.ts` and validate with the zod schema there. **A schema failure must fail the build.** Field names below are the contract the export script writes to; do not rename them. Optional fields may be `null`; render the page without that section when they are.

### 3.1 `models.json`: array of 365

```jsonc
{
  "id": 140,                        // database id; stable
  "no": 62,                         // number in the book, 1–365 (book order)
  "slug": "margin-of-safety",       // permanent URL; never derive or change it
  "name": "Margin of Safety",       // as printed (curly apostrophes, British spelling)
  "part": "R",                      // situation code: D R P W S E M X
  "theme": "R4",                    // theme id: part code + its order in the part ("Protecting yourself")
  "field": "systems",               // field slug (fields.json)
  "one_liner": "Build in a buffer, so that being wrong is not a catastrophe.",
  "teaser": "…",                    // 55–105 words, plain text, the free description; paragraphs split on a blank line
  "stories": [                      // titles and years only: never the story text
    { "kind": "history",  "title": "The Brooklyn Bridge", "year": "1883" },
    { "kind": "business", "title": "Fukushima Daiichi",  "year": "2011" }
  ],
  "related": [89, 271, 209],        // model ids, 3
  "deck": "C10",                    // or null (60 models have a card)
  "workbook": "M10",                // or null (60 models)
  "episode": { "title": "…", "url": "https://…", "date": "2025-05-11" },  // or null
  "video":   { "youtube_id": "…" }, // or null until the channel is matched
  "drawing": "drawings/models/62.png"  // relative to src/assets, or null
}
```

### 3.2 `parts.json`: array of 8, in book order
`{ "code": "R", "numeral": "II", "title": "Risk", "question": "What could go wrong, and what will I do if it does?", "idea": "…", "slug": "risk", "drawing": "drawings/parts/R.png", "colours": { "bg": "#EFCFA0", "fg": "#914110", "accent": "#614E41" } }`

### 3.3 `themes.json`: array of 42
`{ "id": "R4", "part": "R", "sort": 4, "title": "Protecting yourself", "idea": "…", "models": [ids in book order] }`

### 3.4 `fields.json`: array of 16
`{ "slug": "systems", "label": "Systems", "drawing": "drawings/fields/systems.png" }`

### 3.5 `products.json`
```jsonc
{
  "launch_mode": "soft",            // "soft" until 1 Jan 2027: Notify me instead of Buy; "live" after
  "deck":     { "title": "…", "line": "…", "role": "Remember", "price": { "GBP": 24.99 }, "buy_url": null,
                "listing": { "short": "…", "description": ["…"], "ways": [{ "title": "…", "text": "…" }],
                             "in_the_box": ["…"], "specs": [["Cards", "66 …"]], "for_whom": "…" },
                "public_cards": ["C…", 6 card refs, chosen in the export], "fan_cards": [3 of the public cards] },
  "workbook": { "title": "…", "tagline": "60 thinking tools for better decisions",
                "features": "Exercises · Worksheets · A month of practice", "role": "Apply", "pages": 162,
                "price": { "GBP": 14.99 }, "amazon": { "paperback": null, "kindle": null }, "description": ["…"] },
  "almanac":  { "title": "The Mental Models Daily Almanac", "tagline": "365 mental models for clearer thinking",
                "features": "True stories · Drawings · A year of reading", "role": "Learn all 365", "pages": 448,
                "price": { "GBP": 19.99 }, "amazon": { "paperback": null, "kindle": null }, "description": ["…"],
                "wall": [ids in book order], "wall_lit": [156, 173, 269, 279, 350] },
  "pair": { "workbook_line": "Better decisions, one tool at a time", "almanac_line": "Clearer thinking, one model a day" }
}
```
Prices are drafts until the owner sets them. `null` buy links mean "not on sale yet": show **Notify me** (§9.3), whatever `launch_mode` says.

### 3.6 Others
- `site.json`: `{ "hero_line": "One mental model a day to elevate your daily decision making.", "ui": { …button and label strings… }, "mailerlite": { "form_action": null, "notify_groups": { "deck": null, "almanac": null } }, "associates_tags": { "home": null, "model": null, "product": null }, "analytics_token": null, "contact_email": null, "deck_shipping": null }`
- `socials.json`: array of `{ "name": "Instagram", "handle": "@mentalmodelsdaily", "url": "…" }` for Instagram, X (@mindmodelsdaily), YouTube (@MentalModelsDaily), Spotify, Apple Podcasts, RSS. Show only entries with a `url`.
- `schedule.json`: `{ "start": "2027-01-01", "order": [365 model ids] }`: today's model is `order[(days since start) mod 365]`, counting days in Europe/London, so it also works before `start` (the soft launch) and wraps after a year.
- `episodes.json`: the latest 10 episodes and videos for `/podcast/` (title, date, url, youtube_id, model id).
- `legacy_redirects.json`: `[["/old/path/", "/new/path/"], …]` for the 2020 blog's URLs (see §6.12).

## 4. URL map

| Route | Source | Notes |
|---|---|---|
| `/` | Home | §6.1 |
| `/explore/` | parts, models | tiles, A–Z, search |
| `/explore/<part-slug>/` | 8 pages | `getStaticPaths` from parts |
| `/models/<slug>/` | 365 pages | `getStaticPaths` from models |
| `/deck/` `/workbook/` `/almanac/` | product rooms | |
| `/podcast/` `/free/` `/today/` `/about/` | | |
| `/privacy/` `/cookies/` `/terms/` `/shipping-returns/` `/affiliate-disclosure/` `/accessibility/` | content/pages | one Markdown template |
| `/thanks/` | after the email form | not indexed |
| `/404.html` | 404 | drawing, search box, today's model |
| `/search.json` | endpoint | §9.1 |
| `/_redirects` | endpoint `src/pages/_redirects.ts` | generated at build (§10) |

Short links (all in `_redirects`, 302 unless noted): `/today` → `/today/` (301), `/listen` → `/podcast/`, `/watch` → `/podcast/#watch`, `/free` → `/free/` (301), `/book` and `/book/*` → `/almanac/` (301), `/buy/deck`, `/buy/workbook`, `/buy/almanac`, `/buy/kindle-workbook`, `/buy/kindle-almanac` → the product's buy URL, or to `/<product>/#notify` while it is `null`. Printed QR codes use these, so they must never 404.

## 5. Design tokens (`src/styles/tokens.css`)

Define once on `:root`; no colour or font literal anywhere else.

```css
:root {
  /* brand */
  --terracotta: #935F4C; --rust: #914110; --sand: #EFCFA0; --taupe: #D0B49F; --cream: #FFFAE5;
  --cocoa: #705C4E; --ink: #111; --chocolate: #532200; --gold: #E1A140;
  --paper: var(--cream); --text: var(--ink); --muted: #5b4a40; --rule: rgba(17,17,17,.18);
  /* type */
  --display: "Roxborough CF", "Sorts Mill Goudy", Georgia, serif;   /* stand-in until licensed */
  --body: "Sorts Mill Goudy", Georgia, serif;
  --label: "IBM Plex Sans Condensed", "Arial Narrow", sans-serif;
  --measure: 65ch;
  --step--1: clamp(.83rem, .8rem + .15vw, .9rem); --step-0: clamp(1.06rem, 1rem + .3vw, 1.2rem);
  --step-1: clamp(1.3rem, 1.2rem + .5vw, 1.55rem); --step-2: clamp(1.7rem, 1.4rem + 1.2vw, 2.3rem);
  --step-3: clamp(2.3rem, 1.8rem + 2.4vw, 3.6rem); --step-4: clamp(3rem, 2rem + 4.5vw, 5.6rem);
  /* space and motion */
  --s1: .25rem; --s2: .5rem; --s3: 1rem; --s4: 1.5rem; --s5: 2.5rem; --s6: 4rem; --s7: 6rem;
  --ease: cubic-bezier(.2,.7,.2,1); --t-fast: 180ms; --t: 420ms; --t-slow: 900ms;
}
```

**Situation colours** (cards, chips, tile edges, model pages), as `[data-part="R"] { --part-bg; --part-fg; --part-accent }`:

| Code | Part | bg | fg | accent |
|---|---|---|---|---|
| D | Decisions | #935F4C | #FFFAE5 | #EFCFA0 |
| R | Risk | #EFCFA0 | #914110 | #614E41 |
| P | People | #532200 | #E1A140 | #EFCFA0 |
| W | Work | #D0B49F | #3F3129 | #53433A |
| S | Strategy | #914110 | #FFFAE5 | #EFCFA0 |
| E | Evidence | #E1A140 | #532200 | #5A3510 |
| M | Your own mind | #705C4E | #FFFAE5 | #EFCFA0 |
| X | Fixing problems | #231C18 | #FFFAE5 | #E1A140 |

(Also in `parts.json`; read them from there and emit the CSS at build.)

**Rooms**, as `<body data-room="…">`: `paper` (default: ink on cream), `workbook` (terracotta on cream), `almanac` (cream on terracotta), `deck` (cream and gold on chocolate). Each room sets `--paper`, `--text`, `--muted`, `--rule` and `--draw` (the drawing colour).

**Type rules:** Roxborough for the wordmark, page titles, model names and big lines; Plex Sans Condensed, uppercase, letter-spaced .12–.2em, for labels, kickers, nav and buttons; Goudy for all reading text, upright, italic only for one-liners and quotes, **never bold** (it has no bold; use size or a label instead). `font-variant-numeric: lining-nums` on `body`. Light mode only. Self-host every font as woff2 with `font-display: swap` and preload the two used above the fold.

**Drawings** are greyscale pencil on transparent backgrounds. Recolour them with CSS so one file serves every room: render as a CSS mask (`mask-image: url(...)` on an element whose `background` is `var(--draw)`), with an `<img>` fallback inside `<noscript>`-free markup for print and old browsers. Always give drawings a fixed `aspect-ratio: 4 / 3` box so nothing shifts while loading.

## 6. Pages

Each page: one `<h1>`, a `<title>` of the form "Margin of Safety · Mental Models Daily", a meta description from the data (one-liner or the product's short line), canonical URL, Open Graph and Twitter tags with the matching `og/` image (`og/<slug>.jpg` for models, `og/home.jpg`, `og/deck.jpg`, `og/workbook.jpg`, `og/almanac.jpg` for the rest), and JSON-LD where noted.

### 6.1 Home (`/`)
1. **Hero:** brain mark, "THE" (label) over "Mental Models Daily" (display), `site.hero_line`; today's model (§9.2) as a drawing that draws itself in (§8), its name and one-liner, link *Read today's model*. Streaks on the right edge.
2. **Three products:** three objects in a row (one column on phones) in their room colours: deck box, Workbook front, Almanac front; role, price (or "Coming 1 January"), one button each. Hover/focus lifts the object; a muted film (§8.4) may play on hover on desktop only.
3. **Explore the 365:** the 8 `PartTile`s.
4. **The pair:** `Pair` component.
5. **Pick a card:** the 3 `fan_cards`, tap to flip; link to `/deck/`.
6. **Listen and watch:** `PodcastFacade` and `YouTubeFacade` for the latest episode.
7. **Free printable:** preview image and `EmailForm` (printable).
JSON-LD: `Organization` and `WebSite` with `SearchAction` pointing to `/explore/?q=`.

### 6.2 Explore (`/explore/`)
The 8 tiles; an A–Z list of all 365 (name, No., field) grouped by letter with a letter jump bar; a search box (§9.1). With JS off the A–Z is the fallback.

### 6.3 Part pages (`/explore/<part>/`)
Part drawing, numeral, title, its question, the idea. Then each theme: title, idea, and its models as `ModelRow`s (small drawing, No., name, field chip, one-liner) in book order. Field chips at the top filter rows (JS; with JS off they link to `#field-<slug>` anchors). Breadcrumb *Explore › Risk* (with `BreadcrumbList` JSON-LD), previous/next part.

### 6.4 Model pages (`/models/<slug>/`), the core template
`<body data-room="paper" data-part="…">`.
```
No. 62 · RISK · SYSTEMS                         label, part colour
[drawing 4:3, part fg colour, draws itself in]
Margin of Safety                                display, h1
Build in a buffer, …                            italic one-liner
────
teaser                                          Goudy, max 65ch
────
IN THE ALMANAC  "The Brooklyn Bridge", 1883 · "Fukushima Daiichi", 2011
  Both stories in full, three ways to use it and where it misleads.   [Get the Almanac]
IN THE CORE DECK  Card C10                       [See the deck]        (only if deck)
PRACTISE IT  Workbook M10                         [See the Workbook]    (only if workbook)
LISTEN · WATCH  [PodcastFacade] [YouTubeFacade]                          (only if present)
RELATED  three ModelChips
← No. 61 Name            No. 63 Name →           (book order, wraps 365 → 1)
```
The "IN THE ALMANAC" text before the button is a UI string in `site.json`; story titles and years only. JSON-LD: `DefinedTerm` (name, description = one-liner, inDefinedTermSet = the Almanac) and `BreadcrumbList`. View-transition name on the drawing: `model-<id>` (§8.1).

### 6.5 Deck (`/deck/`, `data-room="deck"`)
Film (deck); title, line, price, **Buy** (or Notify me), delivery note; the 6 public cards as `FlipCard`s, then "54 more in the box" as a row of face-down card backs (a CSS pattern, not images of real cards); how a card works (front and back annotated, from the listing); five ways to use it; what's in the box and specs (table); gift note. JSON-LD `Product` with `offers` only when `buy_url` is set.

### 6.6 Workbook (`/workbook/`, `data-room="workbook"`)
Film; title, tagline, features, price, **Buy on Amazon** (paperback) and **Kindle**; look inside (4 pages, `Zoom` component); how it works (from `description`); `Pair`; link to the deck. JSON-LD `Book` (two `workExample`s: Paperback and EBook) once Amazon links exist.

### 6.7 Almanac (`/almanac/`, `data-room="almanac"`)
Film; title, tagline, features, price, Amazon buttons or **Notify me**; **the wall**: all 365 names as one justified block of display type (the back cover in HTML), each name a link to its model page, the `wall_lit` five set in `--gold`/full opacity and the rest at reduced opacity; sample pages via `Zoom`; `Pair`; the deck. JSON-LD `Book`.

### 6.8 Podcast (`/podcast/`)
`PodcastFacade` (show), `YouTubeFacade` (latest video, `id="watch"`), the latest 10 from `episodes.json` (each links to its model page and the episode), subscribe links from `socials.json`. `PodcastSeries` JSON-LD.

### 6.9 Free (`/free/`)
Preview image, "12 mental models to try this week", `EmailForm` (printable). The PDF is sent by MailerLite after double opt-in; it is never linked from the site.

### 6.10 Today (`/today/`)
Today's model as on its model page (drawing, name, one-liner, teaser, story titles, episode), a link to the full model page, and *Tomorrow's model arrives at 6am* with `EmailForm`. `noindex` (it duplicates model pages); canonical points at the model page.

### 6.11 About and the small print
One `Prose` template over `src/content/pages/*.md`, with the room `paper`. Footer links to all six policy pages and *Cookie settings*.

**Copy pages** (`src/content/pages/*.md`) have front matter `title`, `description`, `updated` (date) and `draft` (boolean). The `Prose` template replaces `{{key}}` placeholders with the matching value in `site.json` (for now `{{contact_email}}` and `{{deck_shipping}}`). While a value is `null` or a page has `draft: true`, show a small "Draft" note at the top of that page; once `launch_mode` is `"live"`, the build must fail if any page is still a draft or has an unfilled placeholder.

### 6.12 404 and legacy URLs
404: a drawing, "This page isn't here", the search box and today's model. Read the 2020 blog's permalinks from the `legacy-2020-blog` branch (posts and category pages) and propose the mapping in your PR as `legacy_redirects.json`; the owner confirms it. Category pages map to the closest part page or `/explore/`; posts about a model map to its model page; everything else to `/`.

## 7. Components (`src/components/`)

`Header` (wordmark, nav: Explore · Deck · Workbook · Almanac · Podcast · Free; on phones a `<details>` disclosure, no JS) · `Footer` (socials, products, small print, Cookie settings, © and the AI note from `site.json`) · `Wordmark` · `Drawing` (props: src, part/colour, size, `draw` boolean, `vtName`) · `PartTile` · `ModelRow` · `ModelChip` · `FieldChip` · `ProductCard` · `BuyButton` (resolves `/buy/*`, Notify me, Associates tag per placement) · `Pair` · `FlipCard` (front/back images; a real `<button>` with `aria-pressed`) · `CardFan` · `Film` (§8.4) · `Zoom` (a `<dialog>` with the large image) · `PodcastFacade` · `YouTubeFacade` · `EmailForm` (printable | notify-deck | notify-almanac) · `ConsentDialog` · `Prose` · `Breadcrumbs` · `Search`.

Components take data as props; only pages read `src/data`. Situation colours come from `data-part` selectors, never inline. The only inline `style` attributes allowed are `view-transition-name` and CSS custom properties; the CSP allows style attributes (`style-src-attr`) but never inline `<style>` or `<script>` (§11).

## 8. Motion (`src/styles/motion.css`)

Everything here sits inside `@media (prefers-reduced-motion: no-preference)`; with reduced motion the end state shows at once. No animation library and no JS animation loops.

1. **Page changes:** cross-document View Transitions in CSS only: `@view-transition { navigation: auto; }`. Name the shared elements (`view-transition-name: model-<id>` on a tile's drawing and the model page's drawing; `product-<key>` on a product object and its room's cover). Default cross-fade 300 ms; the room colour wash between rooms is the root transition at 600 ms. Do not use Astro's `<ClientRouter />` (it adds JS and is not needed).
2. **Drawing draws itself in:** a mask sweep. The `Drawing` element gets a second mask layer, a linear gradient from opaque to transparent, whose position animates from left to right (`mask-position`) over `--t-slow` on first view, using `animation-timeline: view()` where supported and a plain on-load animation elsewhere. Once only: no replay on scroll back.
3. **Reveals on scroll:** sections fade and rise 12 px with `animation-timeline: view(); animation-range: entry 0% cover 25%`. Unsupported browsers simply show the content.
4. **Films** (`Film`): `<video muted loop playsinline preload="none" poster="…">` with WebM and MP4 sources at 1080 and 720 (`media` queries), a visible play/pause button, never autoplay with sound. Autoplay only when in view, when `prefers-reduced-motion` is not set and `navigator.connection?.saveData` is not true (≈1 KB script, IntersectionObserver). On slow connections show the poster only.
5. **Card flip:** CSS 3D (`transform: rotateY(180deg)`, `backface-visibility: hidden`) toggled by the button's `aria-pressed`; 500 ms. With reduced motion, a cross-fade.
6. **Lifts:** product objects and tiles rise 4 px with a soft shadow on hover and focus-visible.
7. No layout shift from any animation: animate only `transform`, `opacity`, `mask-position`.

## 9. Behaviour

### 9.1 Search
`/search.json` (built from `models.json`): `[[id, slug, name, one_liner, field, part], …]`, under ~60 KB gzipped. `Search` lazily fetches it on first focus, filters by name, then one-liner, then field (case- and accent-insensitive), shows up to 12 results as `ModelRow`s, keyboard navigable (↑ ↓ Enter, Esc clears), with an `aria-live` result count. `?q=` pre-fills it. With JS off the box submits to `/explore/` (the A–Z).

### 9.2 Today's model
Built at build time from `schedule.json` using the build date in **Europe/London**, and rebuilt daily (§1). The hero and `/today/` are therefore plain HTML; no client-side date logic.

### 9.3 Email (MailerLite)
`EmailForm` is a plain HTML `<form method="post" action="{site.mailerlite.form_action}">` with the email field, a hidden group field, a honeypot field, a consent line ("We'll email you the cards and a model now and then. Unsubscribe any time.", from `site.json`) and a link to `/privacy/`. MailerLite does the double opt-in and sends the PDF. No MailerLite script on our pages. When `form_action` is `null`, render the form disabled with "Opens soon". After submitting, MailerLite redirects to `/thanks/`.

### 9.4 Media players (click to load)
`PodcastFacade` and `YouTubeFacade` render a branded placeholder (drawing, title, a play button). Nothing from Spotify or YouTube loads until the visitor presses play. The first press opens `ConsentDialog` (equal **Accept** and **Reject** buttons, the provider named); on Accept, store `{ media: true }` in `localStorage` under `mmd-consent`, then swap in the iframe (`https://www.youtube-nocookie.com/embed/<id>?autoplay=1` or the Spotify embed). On Reject, link out to the episode instead. *Cookie settings* in the footer reopens the dialog and can withdraw consent. This is the only consent the site asks for.

### 9.5 Analytics
Cloudflare Web Analytics beacon, only when `site.analytics_token` is set (no cookies, no banner). `/buy/*` clicks are counted by Cloudflare at the redirect; add no click-tracking JS.

## 10. Selling and redirects

- `src/pages/_redirects.ts` is a static endpoint returning Cloudflare `_redirects` text, generated from `products.json`, `site.json` and `legacy_redirects.json` (§4, §6.12).
- `BuyButton` always links to the `/buy/*` short link (so a price page and a QR code behave the same), adding `?tag=` per placement only in the generated redirect, never in page markup. Amazon links come in `products.json` already localised (Associates OneLink handles other stores).
- `launch_mode: "soft"`: every Buy becomes **Notify me** (an `EmailForm` with the product's notify group, anchored `#notify`), prices show with "From 1 January 2027". `"live"`: Buy buttons where a link exists. One switch, one rebuild.
- The deck's Buy goes to the Shopify checkout URL in `products.json`. No Shopify script, cart or Buy Button SDK on our pages.

## 11. Security and caching (`public/_headers`)

```
/*
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  Content-Security-Policy: default-src 'self'; img-src 'self' data: https://i.ytimg.com; media-src 'self'; font-src 'self'; style-src 'self'; style-src-attr 'unsafe-inline'; script-src 'self' https://static.cloudflareinsights.com; connect-src 'self' https://cloudflareinsights.com; frame-src https://www.youtube-nocookie.com https://open.spotify.com; form-action 'self' https://assets.mailerlite.com https://*.mailerlite.com; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; upgrade-insecure-requests
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
  Cross-Origin-Opener-Policy: same-origin
/_astro/*
  Cache-Control: public, max-age=31536000, immutable
/fonts/*
  Cache-Control: public, max-age=31536000, immutable
/films/*
  Cache-Control: public, max-age=2592000
```
- Configure Astro so no inline `<script>` or `<style>` is emitted (`build.inlineStylesheets: "never"`; ship scripts as files). If something must be inline, use a hash in the CSP, never `'unsafe-inline'`.
- Confirm the MailerLite form host from the real `form_action` and narrow `form-action` to it.
- Target A+ on securityheaders.com and Mozilla Observatory.

## 12. Images, fonts, performance, accessibility

- Every drawing and image through Astro's `<Image>`/`<Picture>`: AVIF and WebP, `widths` 320/640/960/1280/1600 as needed, `sizes` set, explicit width and height, `loading="lazy"` except the LCP image (`fetchpriority="high"`). Drawings used as masks: export resized PNG/WebP masks at build with `getImage()`.
- **Budgets per page** (phone, 4G): LCP < 1.5 s, CLS < 0.02, total transfer < 500 KB excluding films, our JS ≤ 10 KB, CSS ≤ 30 KB, fonts ≤ 4 files on any page.
- **Lighthouse 95+** in all four categories on Home, a model page, a part page and each product room.
- **WCAG 2.2 AA:** contrast checked for every room and situation colour pair (the tokens above pass for text at the sizes used; check small labels on `R`, `E` and `W`), visible focus rings in each room, skip link, landmarks, alt text (drawings: "Drawing: <model name>"; decorative streaks `alt=""`), `lang="en-GB"`, all controls reachable by keyboard, `prefers-reduced-motion` honoured, zoom to 400% without horizontal scroll at 320 px.
- Layout works from 320 px to wide screens with a 16 px minimum side gutter and no horizontal scroll.

## 13. Checks (`npm run check`, and in CI on every PR)

1. `astro check` (types) and the zod schemas (build fails on bad data).
2. `scripts/verify.mjs` over `dist/`:
   - exactly 365 `/models/*/index.html` and 8 `/explore/*/index.html`; every `related`, prev/next and wall link resolves;
   - every short link in §4 is present in `_redirects`;
   - our JS per page ≤ 10 KB; no `<script>` or `<style>` inline (except allowed hashes); no requests to `fonts.googleapis.com`, `fonts.gstatic.com` or any third party in the HTML except those the CSP lists;
   - **no paid content:** at most 6 card fronts and 6 card backs in `dist/`, no PDF or EPUB in `dist/`, and no string from the export's paid-content guard list (`HANDOVER.md`: a few distinctive sentences from paid pages, given as SHA-256 hashes of normalised text) appears in any page;
   - every page has one `h1`, a title, a description, a canonical and an OG image; every `<img>` has `alt`.
3. GitHub Actions: build, `npm run check`, then Lighthouse CI (`npx @lhci/cli autorun`) on the five pages in §12 against the preview URL, failing below 95; `npx linkinator dist --skip "^https?://(?!mentalmodelsdaily)"` for internal links.

## 14. Content flow (for reference)

The owner edits content on the Mac; `step17_site_data.py` regenerates `src/data/*.json` and the assets and opens a PR titled "Data refresh <date>". Your code must accept that PR without changes. If a schema change is needed, propose it in a PR that updates this spec's §3 and `content.config.ts` together, and the export script is changed to match.

## 15. Order of work (one PR each)

| # | Milestone | Done when |
|---|---|---|
| 0 | Preserve the old blog on `legacy-2020-blog`; empty Astro project, `_headers`, CI, Cloudflare preview | Preview URL serves a blank Astro page with A+ headers |
| 1 | Tokens, fonts, rooms, `Base` layout, header, footer, Prose pages | Policy pages render in all four rooms; Lighthouse 95+ |
| 2 | Data collections and schemas; model pages (365); part pages; Explore with A–Z | Every model page builds from data; `verify.mjs` passes |
| 3 | Product rooms: deck, workbook, almanac; `Pair`, `FlipCard`, `Zoom`, the wall; Notify me | All three rooms in soft-launch mode |
| 4 | Home, Today, Podcast, Free, 404; facades and consent; search; email forms | Whole site navigable; consent flow tested with keyboard |
| 5 | Motion: view transitions, draw-in, reveals, films; OG tags and JSON-LD; sitemap; redirects incl. legacy | Reduced-motion and JS-off passes; all short links work on the preview |
| 6 | Polish: accessibility audit, budgets, cross-browser (Safari iOS, Chrome Android, Firefox) | §12 and §13 all green; ready for the owner's review |

## 16. Not now

The "Ask Mental Models" chatbot (BLUEPRINT §14), signed copies and gift sets, persona decks, accounts or logins, comments, a blog, dark mode, cookies other than the media consent, any paid tool or service not listed here.

## 17. Placeholders the owner fills (leave them `null`, never guess)

Prices; Amazon links (paperback and Kindle, both books); Shopify checkout URL; MailerLite form action and group ids; Associates tags; Cloudflare analytics token and deploy hook; Spotify and Apple Podcasts show URLs; YouTube video ids; the Roxborough CF web font (until licensed, `--display` falls back to Goudy); the repo rename to `website`; the DNS move to Cloudflare.
