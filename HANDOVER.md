# Handover: what is in this package

Exported on the owner's Mac by `mm_pipeline/step17_site_data.py` from the project's database. Read `SPEC.md` first (how to build), then `BLUEPRINT.md` (what and why), then `BRAND.md` (the look). This file lists what arrived, what is still missing, and how the data gets refreshed.

## Rules that matter most

- **Content is never edited in this repo.** `src/data/*.json`, `src/content/pages/*.md` and everything in `src/assets/` and `public/films/` are generated. If something reads wrong, say so in the PR; the owner fixes it at the source and a "Data refresh" PR follows.
- **This repo is public.** It holds only what the site shows for free. The paid products (the Almanac's full entries, the Workbook's practice pages, the rest of the deck) are not here and must never be reconstructed here.

## What is here

| Path | What | Count / size |
|---|---|---|
| `src/data/models.json` | the 365 models (schema: `SPEC.md` §3.1). `teaser` is the podcast's long caption: plain text, paragraphs separated by a blank line (`\n\n`) | 365 |
| `src/data/parts.json` | the 8 situations, in book order, with their question, idea and colours | 8 |
| `src/data/themes.json` | the 42 themes inside the situations, each with its models in book order | 42 |
| `src/data/fields.json` | the 16 fields | 16 |
| `src/data/products.json` | the three products: copy, specs, draft prices (`price_is_draft: true`), `launch_mode: "soft"`, the 6 public deck cards and the Almanac's wall of names | 3 |
| `src/data/site.json` | hero line, UI strings, the AI note, slots for MailerLite, Associates tags and analytics (all `null` for now) | |
| `src/data/socials.json` | Instagram, X, YouTube, Spotify (URLs set); Apple Podcasts and RSS (`null` until confirmed) | 6 |
| `src/data/schedule.json` | today's model: `start` 2027-01-01 and the 365 ids. For now in book order; the podcast's relaunch schedule replaces it | |
| `src/data/episodes.json` | the 10 most recent episodes of the 2024–25 run (Spotify links; `youtube_id` still `null`) | 10 |
| `src/data/legacy_redirects.json` | empty: you propose the mapping from the old blog (`SPEC.md` §6.12) | 0 |
| `src/content/pages/*.md` | About and the six policy pages, as drafts (`draft: true` in the front matter) | 7 |
| `src/assets/drawings/` | models (by id), parts (by code), fields (by slug), personas (by key): ink on transparent, 1200 px wide, 16-level palette PNGs | 399, 40 MB |
| `src/assets/products/` | covers, the pair, the deck box and the fan (`BRAND.md`) | 10 |
| `src/assets/cards/` | the 6 public cards, `<C##>-front.png` and `-back.png`, trimmed (no bleed), 824 × 1424 | 12 |
| `src/assets/look-inside/` | `workbook-1..4` (contents, situation finder, a learn page, the 30-day plan) and `almanac-*` (contents, overview, sample page "Inertia", a toolkit, A–Z, story index), each one page at 1632 × 2112 | 10 |
| `src/assets/og/` | sharing images, 1200 × 630 JPEG: one per model (`<slug>.jpg`) and `home`, `deck`, `workbook`, `almanac` | 369 |
| `src/assets/brand/` | `brain-mark.svg`, `streaks.svg` | 2 |
| `public/films/` | `deck`, `workbook`, `almanac`: 10–13 s silent loops, `-1080`/`-720` × `.mp4`/`.webm`, each under 1 MB, plus `-poster.avif` | 15 |
| `public/fonts/` | Sorts Mill Goudy (regular, italic) and IBM Plex Sans Condensed 400, woff2, latin and latin-ext subsets, with a ready `fonts.css` and the OFL notice | 6 + 2 |
| `scripts/paid_guard.json` | SHA-256 hashes of every sentence of 8+ words in the paid book text, with the normalisation rule in `_how`, for `verify.mjs` (`SPEC.md` §13) | ~4,200 |

Notes:
- `public_cards` were chosen so they do not overlap the 12 cards in the free printable: visitors see 18 different cards in all.
- The sharing images and films were drawn with the brand's display font; that is fine as images. The font file itself stays out of the repo.
- The workbook's `M10` and the deck's `C10` are the product references; `deck` and `workbook` are `null` for the 305 models that are only in the Almanac.
- `episode.url` points at the old Spotify for Podcasters pages. They are the best links we have until the relaunch; treat them as external links.

## Still missing (leave `null`, never guess)

Final prices · Amazon links (paperback and Kindle, both books: not published yet) · the Shopify checkout URL · MailerLite form action and group ids · Amazon Associates tags · the Cloudflare analytics token and deploy hook (repo secret `CF_DEPLOY_HOOK`) · Apple Podcasts and RSS URLs · YouTube video ids per model · the Roxborough CF web font · product photos (when printed proofs arrive) · reviews and praise · the podcast relaunch schedule.

## Refreshing the data

On the owner's Mac, from `mm_pipeline/`:

```
python3 step17_site_data.py            # data only
python3 step17_site_data.py --assets   # plus drawings, images, sharing images, fonts
python3 step17_site_data.py --films    # plus the films
```

It writes `mm_pipeline/output/site/`, laid out like this repo, and refuses to finish if the package is not public-safe. The owner copies it onto a branch and opens a "Data refresh <date>" PR. Code must accept such a PR without changes; a schema change goes through `SPEC.md` §3 and `content.config.ts` first.

## Accounts

The repo belongs to the project's GitHub account, `mentalmodelsdaily`. Commit as the repo's configured user. Never commit secrets: Cloudflare and MailerLite values that are not public go into repository or Cloudflare secrets, set by the owner.
