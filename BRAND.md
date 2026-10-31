# Brand: Mental Models Daily

The rules the site shares with the printed products (the Core Deck, the Workbook and the Almanac). `SPEC.md` §5 turns them into CSS tokens; this file says what they mean. When in doubt, look at the product images in `src/assets/products/`: the site should feel like holding them.

## The idea

Paper and ink. A quiet, well-made reference book, not an app. Cream paper, ink type, generous white space, thin rules, "No. 62" numbering, lines no wider than about 65 characters. No stock photos, emoji, gradients, glass, badges, pop-ups or countdowns.

## Colour

| Name | Hex | Used for |
|---|---|---|
| Cream | #FFFAE5 | paper: the site's background; type on dark rooms |
| Ink | #111111 | reading text on cream |
| Terracotta | #935F4C | the Workbook's type; the Almanac's paper; the brand's main colour |
| Rust | #914110 | rules and accents on cream |
| Sand | #EFCFA0 | soft fills; the Risk situation |
| Taupe | #D0B49F | soft fills; the Work situation |
| Cocoa | #705C4E | muted text; the Your own mind situation |
| Chocolate | #532200 | the Core Deck's box and room |
| Gold | #E1A140 | type on chocolate; the Evidence situation |

**Rooms.** Each product has its own room in its cover's colours, so a visitor always knows where they are: the Workbook is terracotta on cream, the Almanac is cream on terracotta (the two are twins in swapped colours), the Core Deck is cream and gold on chocolate. Everything else is ink on cream.

**Situations.** The eight situations (Decisions, Risk, People, Work, Strategy, Evidence, Your own mind, Fixing problems) keep the deck's card colours (`parts.json` › `colours`): `bg` is the card colour, `fg` the type on it, `accent` the small details. On cream, use a situation's darker colour for type and drawings (check contrast; Risk, Work and Evidence have light backgrounds).

## Type

| Font | Role | Notes |
|---|---|---|
| Roxborough CF | the wordmark, page titles, model names, big lines | commercial; web licence not yet bought, so it is **not** in the repo. Until it is, `--display` falls back to Sorts Mill Goudy. When the licence arrives, `roxborough-cf.woff2` goes in `public/fonts/` and nothing else changes |
| IBM Plex Sans Condensed (400) | small labels in capitals: THE, product words, kickers, nav, buttons, "No. 62 · RISK" | letter-spaced .12–.2em |
| Sorts Mill Goudy | all reading text | upright; italic only for one-liners and quotes; **never bold** (it has no bold weight: browsers fake one) |

Always lining numerals (`font-variant-numeric: lining-nums`). Sentence case everywhere except the Plex labels. British spelling.

**The wordmark** is the brain mark, then "THE" (Plex, capitals, small) above "Mental Models Daily" (Roxborough, large, set on up to three lines), then the product word in Plex capitals where there is one (CORE DECK, WORKBOOK, ALMANAC). `src/assets/brand/brain-mark.svg` is the mark; recolour it with `currentColor` or a mask.

## Drawings

One style everywhere: graphite pencil, 4:3, a single idea per drawing. The files in `src/assets/drawings/` are ink on a transparent background (16 levels of alpha), made to be recoloured: use them as CSS masks over a solid colour, so the same file is terracotta on cream, cream on terracotta, gold on chocolate or a situation's colour on a model page. Never put them on a white box; the paper should be the page.

- Models: `drawings/models/<id>.png` (365)
- Situations: `drawings/parts/<code>.png` (8), the part openers of the Almanac
- Fields: `drawings/fields/<slug>.png` (16)
- Toolkit personas: `drawings/personas/<key>.png` (10)

## The streaks

Soft horizontal lines fading out from the right edge, from the podcast cover and both book covers (`src/assets/brand/streaks.svg`; `currentColor`, about 40% opacity). A signature, used sparingly: the Home hero's right edge and the product rooms. Never behind text.

## Motion

Like paper, never like an app: slow, soft, purposeful. Page changes cross-fade; a drawing glides from a tile into its page; a drawing draws itself in once, left to right; a card flips; a book page turns; moving between rooms washes from one colour to the next. Nothing bounces, spins or loops for attention, apart from the silent product films. Everything stops when the visitor asks for reduced motion.

## Voice

Plain words, short sentences, British spelling. Calm and confident; never hype, urgency or exclamation marks. The UI strings in `site.json` › `ui` show the tone.

## Images in `src/assets/products/`

`workbook-front`, `workbook-back`, `almanac-front`, `almanac-back` (the paperback covers), `pair` (both books), `deck-front`, `deck-back`, `deck-pair`, `deck-3d` (the tuck box on a warm backdrop, #F2E9CF), `deck-fan` (cards fanned). The box images carry their own backdrop: place them on cream or in a frame of that colour, not on chocolate, where the box would disappear.
