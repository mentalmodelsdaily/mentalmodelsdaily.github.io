# mentalmodelsdaily.com: website blueprint

Version 2 · 30 Oct 2026 · **Agreed 30 Oct** (content, pages, selling: §13). Visual details come next.
Builds on the strawman signed off on 28 Oct (kept in `backups/WEBSITE_PLAN.v1-signed-off-20261028.md`); its decisions on hosting, privacy, security and checkout stand unless this version says otherwise.
Soft launch by 13 Dec · buy buttons live **1 January 2027**.

**For the builder (Claude in the cloud):** this is the brief. Read it with `SPEC.md` (how to build it: stack, data contract, routes, tests, order of work), `BRAND.md` and `HANDOVER.md`, which come with the asset package (§12). Content is never written or edited in the site repo: it comes from the project's database through `data/*.json`. The decisions are in §13.

---

## 1. What the site is for

The front door for everything we make. Every card, book, post, episode and video points here. It has three jobs, in this order:

1. **Sell** the three products: the Core Deck (sold here), the Workbook and the Almanac (sold on Amazon, paperback and Kindle).
2. **Show the 365**, generously but never in full, so people want the whole thing (§3).
3. **Grow the audience**: the email list (the free 12-card printable), the podcast, YouTube and Instagram.

Success at 3 months: deck sales and Amazon clicks per visit, email sign-ups, and pages that load in under 1.5 s on a phone.

## 2. Design principles: the products, as a place

The site should feel like holding the products. Everything follows the system the Workbook, the Almanac and the deck box already share.

- **Paper and ink.** Cream paper (#FFFAE5), ink type, lots of white space, thin rules, "No. 123" numbering, lines no wider than about 65 characters. No stock photos, emoji, glassy gradients or dark patterns. Light mode only, like paper.
- **The type, in the same roles as on the covers.**
  - Roxborough CF: titles, model names, big lines.
  - IBM Plex Sans Condensed: the small capitals labels (THE, product words, kickers, buttons, nav).
  - Sorts Mill Goudy: all reading text, upright; italic only for one-liners and quotes. Never bold (it has none).
  - Lining numerals everywhere.
- **Three product rooms, each in its own colours** (from the covers), so you always know where you are:
  - Workbook: terracotta (#935F4C) on cream.
  - Almanac: cream on terracotta.
  - Core Deck: cream and gold (#E1A140) on chocolate (#532200).
  - The rest of the site is cream paper; each of the eight situations keeps its deck colour for chips, tiles and accents.
- **The drawings are the visuals.** The same graphite drawings, recoloured per place: terracotta on cream, cream on terracotta, gold on chocolate, the situation colour on a model page. The paper is always transparent, so drawings look drawn on the page.
- **The streaks.** The soft horizontal streaks from the podcast cover and the book covers, used sparingly as a signature (hero edges, product rooms).
- **Motion that feels like paper, never like an app.**
  - Page changes: View Transitions; the drawing on a tile glides into place on the next page, and a product cover lifts into the product page.
  - A drawing that "draws itself": the line art revealed as a pencil stroke (a mask sweep) the first time it appears.
  - Card flips on the deck, a page turn on the books, gentle reveals as you scroll (CSS scroll-driven animations, no library).
  - Colour washes between rooms: moving from cream into the Almanac's terracotta or the deck's chocolate is a slow cross-fade, not a cut.
  - Everything off when the visitor's device asks for reduced motion.
- **Video, used like a shop window.** Short, silent, looping product films (§8), each under about 2 MB, with a still poster and a play/pause control. Never autoplay with sound.
- **Quality bar** (unchanged): Lighthouse 95+ in all four categories, WCAG 2.2 AA, about 10 KB of our own JavaScript per page, A+ on securityheaders.com, nothing jumps while loading.

## 3. Free to browse, paid to go deep

| Free on the site | Paid, in the products |
|---|---|
| All 365 models: drawing, number, part and field, the one-liner, a short teaser (the podcast caption, about 80 words), the titles and years of its two stories | **The Almanac**: the full page for each model (both stories, three ways to use it, watch out, the question), overviews, toolkits, A–Z and index |
| The situation finder, and the Workbook's look-inside (4 pages) | **The Workbook**: 60 two-page spreads, the 30-day plan, worksheets |
| 6 deck cards to flip, front and back; 12 more in the free printable (email) | **The Core Deck**: all 66 cards in the box |
| Every podcast episode and YouTube video | |

Rule for every page: show the *what*, sell the *how*. Never more than 6 card backs on the site, never a book entry's stories in full, never a practice page.

## 4. Who comes, and where they go

| Visitor | Arrives from | First page | We want them to |
|---|---|---|---|
| Listener | podcast, YouTube, Instagram | `/today` or a model page | Explore, sign up, buy one product |
| Browser | search ("what is the Lindy Effect") | a model page | Read the teaser, then the Almanac or deck |
| Gift buyer | a friend, a post, Christmas | Home or a product page | Understand the three in 10 seconds, buy, ideally the pair or all three |
| Reader of a product | the QR or link printed in a product | `/today`, `/free` or a model | Come back daily; buy the next product |

## 5. Site map

```
/                      Home
/explore/              The 8 situations as tiles, plus A–Z and search
/explore/<part>/       That situation's themes and models, with a field filter
/models/<slug>/        One page per model (365)
/deck/                 The Core Deck: the deck's room (chocolate and gold); buy here
/workbook/             The Workbook: its room (cream and terracotta); buy on Amazon
/almanac/              The Almanac: its room (terracotta and cream); buy on Amazon      [/book redirects here]
/podcast/              Listen and watch: the podcast players, the latest episodes and YouTube videos, subscribe on every app
/free/                 The free 12-card printable, for an email address
/today/                Today's model (the podcast and Instagram schedule)
/about/                The story: a podcast since 2024, now a line of products
/privacy/ /cookies/ /terms/ /shipping-returns/ /affiliate-disclosure/ /accessibility/
404                    A drawing, a search box and today's model

Short links for print, posts, QR codes and bios (they never change):
/today  /listen  /watch (→ /podcast/#watch)  /free  /buy/deck  /buy/workbook  /buy/almanac  /buy/kindle-workbook  /buy/kindle-almanac
```

URLs never contain the part or field, so a model can move without breaking printed links. The old site's category pages redirect to the new part pages.

## 6. Page blueprints

Each page below lists its sections in order. Content comes from `data/*.json` unless it says "copy" (written once, in `content/*.md`).

### Home
1. **Hero.** The brain mark, "The Mental Models Daily", the line "One mental model a day to elevate your daily decision making.", and today's model drawing itself in, with *Read today's model*. A quiet streak on the right edge.
2. **The three products.** One row, three rooms side by side: the deck box, the Workbook, the Almanac, each in its colours, with its role (Remember · Apply · Learn all 365), price and one button. Hover or tap lifts the object; a short loop plays.
3. **Explore the 365.** The 8 situation tiles: part drawing, numeral, name, its question ("Is this really true?"), model count, its colour along the edge.
4. **The pair.** The twin covers side by side, "Better decisions, one tool at a time" / "Clearer thinking, one model a day", buy both.
5. **Pick a card.** Three deck cards fanned; tap to flip. Leads to the deck.
6. **Listen and watch.** The podcast player and the latest YouTube video (both click-to-load, §9).
7. **Free printable.** "12 cards to try": the preview image and an email field.
8. **Footer.** Socials, the products, the small print, Cookie settings.

### Explore and part pages
- Tiles as on Home, then A–Z and a search box (one small data file, searched in the browser).
- A part page: the part drawing, its question and themes; each theme lists its models (small drawing, No., name, field chip, one-liner) in book order. Field chips filter. Trail: *Explore › Risk*. Previous/next part.

### Model page (365, one template)
```
 No. 62 · RISK · SYSTEMS                    (situation colour)
 [ drawing, 4:3, in the situation colour, drawing itself in ]
 Margin of Safety                           Roxborough
 Build in a buffer, so that being wrong is not a catastrophe.   (one-liner, italic)
 ─────
 The teaser (about 80 words)
 ─────
 In the Almanac: "The Brooklyn Bridge, 1883" · "Fukushima Daiichi, 2011"
   Both stories in full, three ways to use it and where it misleads.   [ Get the Almanac ]
 In the Core Deck: card C10          [ See the deck ]        (60 models only)
 Practise it: Workbook M10           [ See the Workbook ]    (60 models only)
 Listen · Watch: episode 171         [ click to play ]
 Related: three models  ·  ← No. 61   No. 63 →
```
Sharing image per model: drawing, name and number on cream (1200 × 630).

### Core Deck: the deck's room
1. **Film:** the box opens, cards fan, three flip (loop, §8).
2. Title, the line "60 mental models to elevate your daily decision making", price, **Buy** (Apple Pay and Google Pay on phones), delivery times.
3. **Six cards to flip**, one from six situations; then "54 more in the box" shown face down.
4. How a card works: front (drawing, name, one line) and back (what it means, when to reach for it, a true story, a question).
5. Five ways to use the deck (the daily draw, the decision spread, the table game, learn the deck, make it yours).
6. What's in the box and specifications (from `LISTING.md`). Gift note.
7. Reviews and praise when we have them.

### Workbook: its room
1. **Film:** a page-through of the Workbook (cover, finder, a spread, the plan).
2. Title, "60 thinking tools for better decisions", "Exercises · Worksheets · A month of practice", price, **Buy on Amazon** (paperback) and **Kindle**.
3. Look inside: the four pages, zoomable.
4. How it works: find your situation, learn the model, practise it, in 30 days.
5. The pair (the Almanac) and the deck.

### Almanac: its room
1. **Film:** a slow page-turn through the Almanac, ending on the back cover's wall of 365 names.
2. Title, "365 mental models for clearer thinking", "True stories · Drawings · A year of reading", price, **Buy on Amazon** and **Kindle**. Before release: **Notify me**.
3. The wall of models: all 365 names, the five drawn ones lit, each a link to its model page.
4. One sample page (Inertia), the contents, the two overviews, the A–Z and the story index, the toolkits for ten kinds of work.
5. The pair and the deck.

### The pair (a section, not a page)
On Home and on both book pages: the Workbook and the Almanac together, then all three. Amazon cannot sell our books as one bundle, so the buttons are two Amazon links side by side, plus the deck from our shop. A Shopify bundle of the deck with **signed** books (author copies) is possible later (§7).

### Podcast (listen and watch)
Players (click to load), the latest 10 episodes and videos, subscribe on Spotify, Apple Podcasts, YouTube and RSS; YouTube playlists by situation once the channel is reorganised (ROADMAP section 9).

### Free printable
The preview, "12 mental models to try this week", an email field (double opt-in), and the PDF in A4 or Letter by email.

### Today
Today's model in full teaser form, the episode, and *Tomorrow's model arrives at 6am* with sign-up. Instagram's link in bio points here.

### About
The story in a few paragraphs: a daily podcast since 2024, 365 models, a line of products. How the books are made (AI-assisted, fact-checked; the same disclosure as the copyright pages). Contact.

## 7. Selling

| Product | Where | Notes |
|---|---|---|
| **Core Deck** | **Shopify Starter**: our button is a plain link to Shopify's checkout (Apple Pay, Google Pay, Shop Pay, cards). No Shopify script on our pages | Handles VAT, shipping, emails and refunds; connects to print-on-demand printers. Stripe Payment Links if the printer cannot connect |
| **Workbook, Almanac** (paperback) | **Amazon** through KDP | KDP print books are sold only on Amazon. `/buy/*` sends each visitor to their own Amazon store |
| **Kindle editions** | **Amazon** | Separate buttons, same redirect |
| **The pair, all three** | Two or three buttons side by side | No true bundle on Amazon |
| **After launch** | Shopify: signed copies, a gift set (deck + signed books), persona decks | Uses author copies bought from KDP at cost; added once the launch is running (decided 30 Oct) |

- **Amazon Associates** with one tracking ID per placement (home, model page, product page), for the commission and to see which buttons sell.
- **Prices** are still the roadmap's draft (your decision, ROADMAP section 1); the site reads them from one file, so they change in one place.
- **Gifting** matters (the Almanac is meant for the desks of busy people): a gift note at checkout, and "Send it as a gift" links to Amazon's gift options.

## 8. Visuals and video

| Asset | Where | Exists? |
|---|---|---|
| 365 model drawings, 8 part, 16 field, 10 persona drawings | everywhere | Yes (master PNGs, 1600 × 1200; web versions to export, §12) |
| Covers: Workbook and Almanac fronts, backs and full wraps; the pair image | product rooms, Home | Yes |
| Deck: box front, back, pair, 3D; card mock-ups (all fronts, pairs, fan) | deck room, Home | Yes |
| Deck card images for the 6 public cards (front and back) and the 3 fanned | deck room, Home | Yes (only these 9 go in the repo) |
| Look-inside pages: Workbook (4), Almanac (sample page, contents, A–Z) | product rooms | To export from the print files |
| Product photos | product rooms | When the printed proofs arrive |
| **Deck film** (box opens, fan, flips), 8–12 s loop | deck room, Home | **To make now**, from our own card and box art (headless Chrome + ffmpeg); a Higgsfield version may replace it after the trial |
| **Workbook film** (page-through), **Almanac film** (page-turn to the wall of names) | product rooms | **To make now**, from the print pages |
| Drawing-itself-in effect | hero, model pages | Built in CSS from each drawing (no video needed) |
| Sharing images (365 + products) | link previews | Generated at build time |
| Favicon and app icons | everywhere | From the brain mark |

Films: MP4 (H.264) and WebM, 1080p and 720p, under about 2 MB, silent, looping, with a poster frame; they never load on slow connections or when the visitor saves data.

## 9. Podcast, YouTube and social

- **Links in the header and footer:** Instagram @mentalmodelsdaily · X @mindmodelsdaily · YouTube @MentalModelsDaily · Spotify · Apple Podcasts · RSS. No others until they are active (decided 30 Oct).
- **Players load only when tapped** (no tracking until then): a branded placeholder, then Spotify or YouTube's no-cookie player.
- Each model page gets its own episode and video. A script matches the episode and video IDs by title from the RSS feed and the channel (still to do).

## 10. Privacy, analytics, security (unchanged from the signed-off plan)

- Cloudflare Web Analytics (no cookies, no banner); `/buy/*` click counts; Plausible later if needed.
- A consent banner only for the media players; equal Accept and Reject; Cookie settings in every footer.
- Fonts self-hosted (never from Google's servers).
- MailerLite (EU) with double opt-in for the email list.
- Policies drafted by Claude: privacy, cookies, terms, shipping and returns, affiliate disclosure, accessibility. Check the ICO fee.
- Payments only on Shopify's or Amazon's checkout; we hold no card data. Security headers (HSTS, a strict Content Security Policy, no framing) for an A+.

## 11. How it is built (unchanged in substance)

- **Astro**, static, on **Cloudflare Pages** (free), from the GitHub repo `mentalmodelsdaily/mentalmodelsdaily.github.io` (to be renamed `website`; the 2020 blog kept on a `legacy-2020-blog` branch). Only `astro` and `@astrojs/sitemap`; no React, UI kit or Tailwind; plain CSS with the brand set once as tokens.
- **Data in, never edited in the repo:** `mm_pipeline/step17_site_data.py` (to write) exports the database to `src/data/*.json`, checked against a schema at build time.
- **Images:** Astro's image tool makes AVIF and WebP at each size. View Transitions for page changes.
- **Branches:** every branch gets a preview link; a failed build leaves the last good site online.

## 12. The handover package for Claude in the cloud

The cloud session works from the GitHub repo only: it cannot see this Mac, the database or the print files. So everything it needs is exported into the repo first, and nothing paid or private goes in.

**The repo is public** (it serves GitHub Pages today; to confirm before the first push). So:

| Goes in the repo | Never goes in the repo |
|---|---|
| `BLUEPRINT.md` (this document), `SPEC.md` (the coding spec, `WEBSITE_SPEC.md` here), `BRAND.md` (tokens: colours, type roles, spacing, motion rules), `HANDOVER.md` (what is where, how to rebuild the data) | Book PDFs, Kindle files, full card sets, workbook practice pages, transcripts |
| `src/data/models.json`: 365 models with number, slug, part, theme, field, one-liner, teaser, story titles and years, related, deck and workbook refs, episode links | `book_entries.json` in full, `deck_cards.json`, the database |
| `src/data/parts.json`, `fields.json`, `themes.json`, `products.json` (titles, lines, specs, prices, buy links), `socials.json` | Roxborough CF until the web licence is bought (the build uses a stand-in until then) |
| Web drawings: 365 + 8 + 16 + 10, transparent PNG at 1600 px for Astro to resize (about 40–60 MB in all, from 485 MB of masters) | The credentials file, any API keys or tokens |
| Covers, box and pair images; 9 public card images; look-inside pages; the films | The 2,000-word podcast transcripts |
| Sorts Mill Goudy and IBM Plex Sans Condensed (open licence, woff2) | |
| The brain mark (SVG), favicon source | |

**Steps (Claude on this Mac, with your go-ahead):**
1. Write `step17_site_data.py`: the JSON above, from the database.
2. Export the web drawings and images, and make the three films.
3. Write `BRAND.md` and `HANDOVER.md`.
4. On a new branch in `website/`, add all of it and push (as `mentalmodelsdaily`). You then point the cloud session at that branch.
5. Check: the cloud session's GitHub connection must be able to write to `mentalmodelsdaily/mentalmodelsdaily.github.io`.

## 13. Decisions (agreed 30 Oct 2026)

| # | Question | Decided |
|---|---|---|
| 1 | Pages | The pair is a **section** (Home and both book pages), not a page. Listen and watch share **`/podcast/`**; `/watch` is a short link to it |
| 2 | The book's address | **`/almanac/`**, with `/book` redirecting |
| 3 | What is free | As in §3: teaser and story titles for all 365, 6 deck cards, 4 Workbook pages, the 12-card printable for an email address |
| 4 | Selling | Deck on Shopify, books and Kindle on Amazon. Signed copies and a gift set **after launch**. Prices: the roadmap's draft until you set them |
| 5 | Hero line | **"One mental model a day to elevate your daily decision making."** (the podcast's intro, as on the deck box) |
| 6 | Films | **Made now from our own art**; Higgsfield versions may replace them after the trial |
| 7 | Socials | Instagram, X, YouTube, Spotify, Apple Podcasts, RSS; **no others** until they are active |
| 8 | About page | **The brand's story, no personal name**, signed Mental Models Daily as the books are |
| 9 | Soft launch, 13 Dec | **Browse everything, email sign-up with the printable, "Notify me" for the deck and the Almanac**; buy buttons switch on 1 January |

## 14. Later, a separate project: "Ask Mental Models"

Unchanged: a chatbot on `/ask` or a subdomain, answering from the public teaser data only (never the paid text), with links to model pages and products; free open-weight model via OpenRouter, Turnstile and a rate limit, kept apart from the main site.
