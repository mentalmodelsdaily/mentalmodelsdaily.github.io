# mentalmodelsdaily.com

The website for Mental Models Daily: one mental model a day, and the three products built from them (the Core Deck, the Workbook and the Almanac). Astro, fully static, hosted on Cloudflare Pages.

| Document | What it is |
|---|---|
| `SPEC.md` | How the site is built: stack, data contract, routes, motion, security, checks |
| `BLUEPRINT.md` | What the site is for, and the decisions behind it |
| `BRAND.md` | The look: colours, type, drawings, motion, voice |
| `HANDOVER.md` | What the exported data and assets are, and how they are refreshed |
| `docs/STATUS.md` | What has been built, where it differs from the spec, and what is still open |
| `CLAUDE.md` | Working notes for Claude Code sessions in this repo |

## How it works

Everything a reader sees comes from three generated folders. They are exported from the project's database on the owner's Mac (`step17_site_data.py`) and arrive here in "Data refresh" pull requests. **Never edit them in this repo.**

- `src/data/*.json`: the 365 models, the 8 parts, 42 themes, 16 fields, the products, site strings, socials, the daily schedule and the latest episodes
- `src/content/pages/*.md`: About and the six policy pages
- `src/assets/`, `public/films/`, `public/fonts/`: drawings, covers, cards, sharing images, films, and the Goudy and Plex fonts

The code turns them into about 390 static pages:

| Route | Page |
|---|---|
| `/` | Home: today's model, the three products, the eight situations, the pair, cards to turn, the latest episode, the free printable |
| `/explore/`, `/explore/<part>/` | The eight situations, an A to Z of all 365 with search, and one page per situation |
| `/models/<slug>/` | One page per model (365) |
| `/deck/`, `/workbook/`, `/almanac/` | The product rooms, each in its cover's colours |
| `/podcast/`, `/today/`, `/free/`, `/thanks/` | Listen and watch, today's model, the printable sign-up, the sign-up confirmation |
| `/about/`, `/privacy/`, `/cookies/`, `/terms/`, `/shipping-returns/`, `/affiliate-disclosure/`, `/accessibility/` | Copy pages |
| `/404.html`, `/search.json`, `/_redirects`, `/sitemap-index.xml` | 404, the search index, short links and redirects, the sitemap |

Today's model is chosen at build time from `schedule.json`, using the date in Europe/London. A daily rebuild at 05:15 UTC moves it on.

## Working on it

Node 22.23.4 or later (Astro 7 needs it).

```
npm ci
npm run dev       # local server at http://localhost:4321
npm run build     # static site in dist/ (a cold build takes about 4 minutes: it encodes every drawing)
npm install --no-save @astrojs/check@0.9.12 typescript@5
npm run check     # astro check + scripts/verify.mjs over dist/
```

`scripts/verify.mjs` checks the built site:
- **Pages:** 365 model pages and 8 part pages, and every link between them resolves.
- **Short links:** every short link and redirect works.
- **Budgets:** no inline script or style, and no third-party host the security headers don't allow. At most 10 KB of our JavaScript and 30 KB of CSS per page.
- **Paid content:** at most 6 deck cards, no PDFs, and no sentence that matches the paid-content guard in `scripts/paid_guard.json`.
- **Page basics:** one `h1`, a title, a description, a canonical link and a sharing image per page, and alt text on every image.

Set `MMD_TODAY=YYYY-MM-DD` to build the site as it will look on another day.

## Hosting and deployment

- **Cloudflare Pages:**
  - the project is `mentalmodelsdaily`; preset Astro, build command `npm run build`, output `dist`, `NODE_VERSION=22`;
  - production builds from `master`; every other branch gets a preview at `https://<branch>.mentalmodelsdaily.pages.dev` (slashes become hyphens, e.g. `site-m6-polish`), and Cloudflare posts a check on each commit;
  - Web Analytics is on in the Pages project, and Cloudflare injects its cookie-free beacon itself.
- **GitHub Actions:**
  - **`CI`**, on every pull request and every branch except `master`: the job is named `build`. It builds, runs `npm run check`, checks every internal link with linkinator, and runs Lighthouse (median of three runs, 95 or more in all four categories).
  - **`Daily rebuild`**, at 05:15 UTC: calls the Cloudflare deploy hook stored in the repo secret `CF_DEPLOY_HOOK`.
- **`master` is protected** by the "Protect master" ruleset: changes go in only through pull requests, the `build` check must pass, and force-pushes and deletion are blocked. Merged branches are deleted automatically.
- **Headers:** security and cache headers are in `public/_headers`. Short links and redirects are generated into `/_redirects` from `products.json`, `site.json` and `legacy_redirects.json`.

## The domain

DNS for `mentalmodelsdaily.com` is on Cloudflare. **The domain still points at GitHub Pages**, which serves the old site, until the switch at the soft launch. The new site is live at https://mentalmodelsdaily.pages.dev meanwhile. The steps to switch are in `docs/STATUS.md`.

## Branches

- `master`: the site.
- `legacy-2020-blog`: the 2020 Jekyll blog, kept as it was.
- `handover-2026-10-31`: the handover package the site was built from.
- `pr-screenshots`: screenshots referenced by the build pull requests (#1 to #7); safe to delete.
