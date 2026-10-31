# mentalmodelsdaily.com

The website for Mental Models Daily: Astro, static, deployed on Cloudflare Pages.

- `SPEC.md`: how it is built (stack, data contract, routes, checks, order of work)
- `BLUEPRINT.md`: what the site is and why
- `BRAND.md`: the look
- `HANDOVER.md`: what the exported data and assets are, and how they are refreshed

Everything a reader sees comes from `src/data/`, `src/content/` and `src/assets/`, which are generated on the owner's Mac. Do not edit them here.

```
npm ci
npm run dev       # local server
npm run build     # static site in dist/
npm install --no-save @astrojs/check@0.9.12 typescript@5
npm run check     # astro check + scripts/verify.mjs over dist/
```

The 2020 Jekyll blog is kept on the `legacy-2020-blog` branch.
