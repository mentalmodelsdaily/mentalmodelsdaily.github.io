# Status of the site

Last updated 31 October 2026, after the build pull requests were merged.

## Built

The whole of SPEC.md §15, milestones 0 to 6, merged into `master` in October 2026:

| PR | Milestone | What it added |
|---|---|---|
| #1 | 0 | Astro project, security headers, CI, daily rebuild, `scripts/verify.mjs`; the 2020 blog kept on `legacy-2020-blog` |
| #2 | 1 | Tokens, the four rooms, `Base` layout, header, footer, About and the six policy pages |
| #3 | 2 | Data schemas, the 365 model pages, the 8 part pages, Explore with an A to Z |
| #4 | 3 | The deck, Workbook and Almanac rooms: card flips, look-inside zoom, the wall of 365 names, Notify me |
| #5 | 4 | Home, Today, Podcast, Free, Thanks, 404; click-to-load players with consent; search; email forms |
| #6 | 5 | View transitions, draw-in, scroll reveals, films; `/_redirects` with short links and buy links; sitemap |
| #7 | 6 | AVIF drawing masks, preloads, page budgets, accessibility fixes |

At the time of merging:
- **Checks:** all 390 pages pass `scripts/verify.mjs`, with 0 matches against the paid-content guard.
- **Lighthouse:** 99–100 in every category on 16 pages, apart from SEO on the `noindex` pages (Today and the 404).
- **Page weight:** every page is under 500 KB even when scrolled to the end.
- **Interaction:** JavaScript off, reduced motion, and the consent flow by keyboard were all tested in Chromium.

## Where the build differs from SPEC.md

| Spec | Built | Why |
|---|---|---|
| §1 Astro "current stable" | Astro 7.4.4, Node 22.23.4 or later | Astro up to 7.3.1 has published security advisories |
| §2 `src/pages/_redirects.ts` | `src/pages/[redirects].ts` | Astro ignores page files that start with `_`; the output is still `/_redirects` |
| §2 drawings 1600 px wide | 1200 × 900 | As exported (HANDOVER.md says 1200) |
| §5 situation colours "emitted at build" | `scripts/parts-css.mjs` writes `src/styles/parts.generated.css` before each build | Ships in the one stylesheet rather than as a second blocking request |
| §5 drawings with an `<img>` fallback | CSS masks only, `role="img"` with "Drawing: <name>" | An `<img>` downloads even when hidden, which would load every drawing twice; masks work in every current browser |
| §6.7 the wall: the rest of the names dimmed, five in gold | All names full cream; the five lit as chocolate on gold | Dimmed cream on terracotta and gold text both fail WCAG AA contrast |
| §8.1 a 600 ms wash between rooms | 600 ms when arriving in a room; 300 ms when leaving | CSS can only time the transition from the arriving page |
| §9.5 beacon when `analytics_token` is set | No beacon in the code | Web Analytics is on in Cloudflare Pages, which injects it |
| §10 Associates tag "per placement" | `/buy/<product>/home/`, `/model/`, `/product/` | Each placement has its own redirect carrying its tag; the plain `/buy/<product>` stays for print |
| §13 linkinator `--skip "^https?://(?!mentalmodelsdaily)"` | `--skip "^(?!http://localhost)"` | The spec's pattern also skips the local server, so it checked nothing |

## Open: for the owner

### Data and copy (in the export, not here)

- **UI strings without a key in `site.json › ui`.** They live as defaults in `src/lib/ui.ts`, and a key added to the export overrides them with no code change:
  - **Navigation and footer:** `skip`, `menu`, `nav_label`, `nav_explore`, `nav_deck`, `nav_workbook`, `nav_almanac`, `nav_podcast`, `nav_free`, `nav_about`, `footer_follow`, `footer_products`, `footer_small_print`, `product_deck`, `product_workbook`, `product_almanac`.
  - **Page headings:**
    - Explore and model pages: `explore_title`, `a_to_z`, `breadcrumbs`, `jump_to_letter`;
    - the product rooms: `cards_heading`, `about_deck`, `how_card_works`, `whats_in_box`, `specs`, `for_whom`, `look_inside`, `how_it_works`, `inside`, `the_wall`, `pair_heading`, `notify_heading`;
    - Home: `home_products`, `pick_card`, `listen_and_watch`, `latest_episode`;
    - Podcast, Today and Free: `podcast_title`, `latest`, `subscribe`, `watch`, `today_title`, `today_full`, `free_title`, `free_heading`;
    - Thanks: `thanks_title`, `thanks_text`.
  - **Copy I had to write as placeholders; please replace them:**
    - `explore_intro` "Eight situations, 365 models. Start from what you are facing."
    - `podcast_intro` "One mental model a day, every day."
    - `thanks_text` "Please check your inbox and confirm your email address."
- **`legacy_redirects.json` is empty.** The proposed mapping of the old blog's 90 addresses is in PR #6 and in `m5/legacy_redirects.proposed.json` on the `pr-screenshots` branch.
- **Spotify can't play on the site.** Episodes link out, because the export has only `podcasters.spotify.com` pages. Add `open.spotify.com` episode ids and the show URL to switch the embedded player on.
- **No YouTube video ids**, so `#watch` on Podcast links to the channel.
- **The Free page has no preview image.** The export has none.
- **No Notify me list for the Workbook**, so it shows "Coming 1 January 2027". Adding `notify_workbook` to `site.json › mailerlite.groups` is enough to turn it on.
- **The deck listing:**
  - `ways` holds feature lines, not the five ways to use the deck;
  - there's no annotation data for "how a card works";
  - there's no delivery or gift note (`deck_shipping` is `null`).
- **Text fixes:**
  - American spellings in about 25 teasers (behavior, favor, organization, recognize…);
  - straight apostrophes in 175 teasers and one-liners;
  - the American slug `in-group-favoritism`. Slugs are permanent, so change it before launch or add a redirect.
- **Still `null`, waiting on you:** prices are drafts, plus the Amazon links, the Shopify checkout, the MailerLite form and groups, the Associates tags, the contact email, Apple Podcasts and RSS. The schedule is still in book order.

### Decisions asked in the pull requests

- **#2:** should sentences with unfilled placeholders render as they do now ("Write to us at . We read everything."), or be hidden until filled?
- **#2:** `**bold**` in the copy is set as small capitals, because Goudy has no bold. Keep that?
- **#4:** should draft prices be hidden until confirmed?
- **#5:** do Today and the daily email share the printable list?
- **#6:** should model pages get a direct *Buy the Almanac* button once it's on sale?

## Going live (planned for the soft launch, 13 December)

1. **Fill the soft-launch gaps:** the MailerLite form action and groups, the contact email, and `draft: false` on the copy pages. Once `launch_mode` is `"live"`, the build fails while any page is still a draft.
2. **Point the domain at Cloudflare.** In the Pages project, under Custom domains, add `mentalmodelsdaily.com` and then `www.mentalmodelsdaily.com`, and let Cloudflare replace the GitHub Pages DNS records.
3. **Redirect `www` to the apex** with a Redirect Rule: `www.mentalmodelsdaily.com/*` → `https://mentalmodelsdaily.com/${1}`, 301.
4. **Unpublish GitHub Pages** under Settings → Pages. GitHub Pages currently tries to build `master` as Jekyll and fails on every merge; the last good deployment of the old site stays up until the switch.
5. **Remove `CNAME`** in a pull request.
6. **Check on the live domain:**
   - securityheaders.com and Mozilla Observatory grade A+;
   - the short links (`/today`, `/listen`, `/watch`, `/free`, `/book`, `/buy/*`) redirect;
   - `www` redirects to the apex;
   - Lighthouse passes on a phone;
   - Safari on iOS and Firefox both work.
7. **Submit `https://mentalmodelsdaily.com/sitemap-index.xml`** in Google Search Console.
8. **On 1 January 2027:** set `launch_mode: "live"` and the buy links in the export; the Buy buttons switch on in one rebuild.
