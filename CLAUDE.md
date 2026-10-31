# Working in this repo

The website for Mental Models Daily. Read `SPEC.md` (how), `BLUEPRINT.md` (what and why), `BRAND.md` (look) and `HANDOVER.md` (data) before changing anything; `docs/STATUS.md` says what is built and what is open.

## Rules (SPEC.md §0)

- **Never write or edit content.** Every word a reader sees comes from `src/data/*.json` or `src/content/pages/*.md`. Never edit `src/data`, `src/content`, `src/assets`, `public/films`, `public/fonts` or `scripts/paid_guard.json`: they are generated on the owner's Mac. Leave every `null` as `null` (prices, Amazon and Shopify links, MailerLite, contact email…). If text is missing, render nothing and say so in the PR.
- **The repo is public.** No paid content (full book entries, full stories, workbook practice pages, more than the 6 public cards), no transcripts, credentials or keys, and never the Roxborough CF font file.
- **Dependencies:** `astro` and `@astrojs/sitemap` only, pinned exactly. Plain CSS; about 10 KB of our own JavaScript per page, all of it progressive enhancement. Every page must work with JavaScript off.
- **Pull requests only.** `master` is protected: the `build` check must pass, no force-pushes, never merge your own PR. Commit as the repo's configured user. If you rename the CI job or add required jobs, say so in the PR so the owner can update the ruleset.
- **British spelling** in code comments and UI strings.

## Commands

```
npm ci
npm run dev
npm run build                 # runs scripts/parts-css.mjs first
npm install --no-save @astrojs/check@0.9.12 typescript@5
npm run check                 # astro check + scripts/verify.mjs (needs a build)
npx --yes linkinator@6 dist --recurse --skip "^(?!http://localhost)"
```

- **Node 22.23.4 or later.** Astro 7 refuses older Node at startup. CI and Cloudflare install the latest Node 22. On a machine with an older 22.x, import `node_modules/astro/dist/cli/index.js` and call `cli(process.argv)` from a script to get past the check. Use that only for local checks, never in CI.
- **Builds are slow cold.** A cold build takes about 4 minutes, because every drawing is encoded as AVIF and WebP at several sizes. Warm builds reuse `node_modules/.astro` and take seconds.

## Where things are

| Path | What |
|---|---|
| `src/content.config.ts` | One collection per data file, with zod schemas. A schema failure fails the build. Single-object files (`site`, `products`, `schedule`) load as one entry with the id `main`. |
| `src/lib/data.ts`, `catalogue.ts` | The only places that read data. `getCatalogue()` sorts the models into book order and cross-checks every reference. |
| `src/lib/ui.ts` | UI strings: `site.json › ui` wins; the defaults cover labels the export does not carry yet (listed in `docs/STATUS.md`). |
| `src/lib/buy.ts`, `rooms.ts` | Buy, Notify me or Coming, by `launch_mode` and whether a link exists; prices; the pair. |
| `src/lib/today.ts` | Today's model from `schedule.json` in Europe/London. `MMD_TODAY` overrides the date. |
| `src/lib/drawing.ts`, `components/Drawing.astro` | Drawings as CSS masks over a colour: AVIF in `image-set()` where supported, WebP otherwise. |
| `src/layouts/Base.astro` | `<head>` (title, description, canonical, OG, JSON-LD), skip link, header, footer, consent dialog. |
| `src/pages/[redirects].ts` | Builds `/_redirects`. Astro ignores page files starting with `_`, hence the parameter route. |
| `src/styles/` | `tokens.css` (the only colour and font literals), `rooms.css`, `base.css`, `motion.css`; `parts.generated.css` is generated from `parts.json` by `scripts/parts-css.mjs` and gitignored. |
| `src/scripts/` | The small client scripts: search, consent and players, card flip, zoom, films, field filter. |
| `scripts/verify.mjs` | Post-build checks (`DIST=… node scripts/verify.mjs` checks another folder). |

## Gotchas

- **No inline `<script>` or `<style>`.** The CSP forbids them. `build.inlineStylesheets` is `"never"`. Inline `style` attributes may hold only CSS custom properties and `view-transition-name`. Pass values to scripts in `data-*` attributes.
- **Never put `animation-timeline` with the `animation` shorthand in one rule.** The CSS minifier folds them together, and browsers drop the result. See `motion.css`, which sets the timeline in a separate `:is()` rule.
- **Copy-page placeholders** like `{{contact_email}}` are filled in the rendered HTML (`src/lib/placeholders.ts`), not by a Markdown plugin. Astro 7's Markdown processor runs no remark plugins without an extra package.
- **No analytics beacon in the code.** Cloudflare Pages injects it, and adding one would count every visit twice.
- **Slugs are permanent**, because printed QR codes use them. So are the short links in `/_redirects` (`/today`, `/listen`, `/watch`, `/free`, `/book`, `/buy/*`), which must never 404.
- **Lighthouse flags half-revealed sections.** A section revealed on scroll that sits at the fold on load gets flagged for contrast. Keep long lists out of the reveal, as the Podcast page does.
