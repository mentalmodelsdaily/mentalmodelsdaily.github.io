// Collections over the exported data (SPEC.md §3). A schema failure fails the build.
import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

// Single-object files become a one-entry collection with the id "main".
const one = (path: string) => file(path, { parser: (text) => [{ id: "main", ...JSON.parse(text) }] });

const url = z.url();

const site = defineCollection({
  loader: one("src/data/site.json"),
  schema: z.object({
    name: z.string(),
    url: url,
    hero_line: z.string(),
    ai_note: z.string(),
    ui: z.record(z.string(), z.string()),
    mailerlite: z.object({
      form_action: url.nullable(),
      groups: z.record(z.string(), z.string().nullable()),
    }),
    associates_tags: z.record(z.string(), z.string().nullable()),
    analytics_token: z.string().nullable(),
    contact_email: z.email().nullable(),
    deck_shipping: z.string().nullable(),
  }),
});

const socials = defineCollection({
  loader: file("src/data/socials.json", {
    // Keep the export's order: entries are otherwise sorted by id.
    parser: (text) => JSON.parse(text).map((s: { name: string }, i: number) => ({ id: s.name, order: i, ...s })),
  }),
  schema: z.object({
    name: z.string(),
    handle: z.string(),
    url: url.nullable(),
    order: z.number(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "*.md", base: "src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    updated: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

const partCode = z.enum(["D", "R", "P", "W", "S", "E", "M", "X"]);
const hex = z.string().regex(/^#[0-9A-Fa-f]{6}$/);
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const assetPath = z.string().regex(/^[A-Za-z0-9/_-]+\.(png|jpg|svg)$/);

const models = defineCollection({
  loader: file("src/data/models.json", {
    parser: (text) => JSON.parse(text).map((m: { id: number }) => ({ ...m, id: String(m.id), model_id: m.id })),
  }),
  schema: z.object({
    model_id: z.number().int().positive(),
    no: z.number().int().min(1).max(365),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    name: z.string().min(1),
    part: partCode,
    theme: z.string().regex(/^[DRPWSEMX]\d+$/),
    field: z.string(),
    one_liner: z.string().min(1),
    teaser: z.string().min(1),
    stories: z.array(z.object({ kind: z.enum(["history", "business"]), title: z.string(), year: z.string() })),
    related: z.array(z.number().int()),
    deck: z.string().regex(/^C\d{2}$/).nullable(),
    workbook: z.string().regex(/^M\d{2}$/).nullable(),
    episode: z.object({ title: z.string(), url: url, date: isoDate }).nullable(),
    video: z.object({ youtube_id: z.string().nullable() }).nullable(),
    drawing: assetPath.nullable(),
  }),
});

const parts = defineCollection({
  loader: file("src/data/parts.json", {
    parser: (text) => JSON.parse(text).map((p: { code: string }, i: number) => ({ id: p.code, sort: i, ...p })),
  }),
  schema: z.object({
    code: partCode,
    sort: z.number(),
    numeral: z.string(),
    title: z.string(),
    slug: z.string(),
    question: z.string(),
    idea: z.string(),
    drawing: assetPath.nullable(),
    colours: z.object({ bg: hex, fg: hex, accent: hex }),
    count: z.number().int(),
  }),
});

const themes = defineCollection({
  loader: file("src/data/themes.json"),
  schema: z.object({
    id: z.string(),
    part: partCode,
    sort: z.number().int(),
    title: z.string(),
    idea: z.string(),
    models: z.array(z.number().int()),
  }),
});

const fields = defineCollection({
  loader: file("src/data/fields.json", {
    parser: (text) => JSON.parse(text).map((f: { slug: string }, i: number) => ({ id: f.slug, sort: i, ...f })),
  }),
  schema: z.object({ slug: z.string(), sort: z.number(), label: z.string(), drawing: assetPath.nullable() }),
});

const price = z.object({ GBP: z.number().positive() }).nullable();
const amazon = z.object({ paperback: url.nullable(), kindle: url.nullable() });

const products = defineCollection({
  loader: one("src/data/products.json"),
  schema: z.object({
    launch_mode: z.enum(["soft", "live"]),
    deck: z.object({
      title: z.string(),
      line: z.string(),
      subtitle: z.string().optional(),
      role: z.string(),
      price,
      price_is_draft: z.boolean().optional(),
      buy_url: url.nullable(),
      meta_description: z.string().optional(),
      listing: z.object({
        short: z.string(),
        description: z.array(z.string()),
        ways: z.array(z.union([z.string(), z.object({ title: z.string(), text: z.string() })])),
        in_the_box: z.union([z.string(), z.array(z.string())]),
        specs: z.array(z.tuple([z.string(), z.string()])),
        for_whom: z.string(),
        closing: z.string().optional(),
      }),
      public_cards: z.array(z.string().regex(/^C\d{2}$/)).max(6),
      fan_cards: z.array(z.string().regex(/^C\d{2}$/)).max(3),
    }),
    workbook: z.object({
      title: z.string(),
      tagline: z.string(),
      features: z.string(),
      role: z.string(),
      pages: z.number().int(),
      trim: z.string().optional(),
      price,
      price_is_draft: z.boolean().optional(),
      amazon,
      description: z.array(z.string()),
      inside: z.array(z.string()).optional(),
    }),
    almanac: z.object({
      title: z.string(),
      tagline: z.string(),
      features: z.string(),
      role: z.string(),
      pages: z.number().int(),
      stories: z.number().int().optional(),
      trim: z.string().optional(),
      price,
      price_is_draft: z.boolean().optional(),
      amazon,
      description: z.array(z.string()),
      inside: z.array(z.string()).optional(),
      wall: z.array(z.number().int()),
      wall_lit: z.array(z.number().int()),
    }),
    pair: z.object({ workbook_line: z.string(), almanac_line: z.string() }),
  }),
});

const schedule = defineCollection({
  loader: one("src/data/schedule.json"),
  schema: z.object({ start: isoDate, order: z.array(z.number().int()).length(365) }),
});

const episodes = defineCollection({
  loader: file("src/data/episodes.json", {
    parser: (text) => JSON.parse(text).map((e: object, i: number) => ({ id: String(i), sort: i, ...e })),
  }),
  schema: z.object({
    sort: z.number(),
    title: z.string(),
    date: isoDate,
    url: url,
    youtube_id: z.string().nullable(),
    model: z.number().int().nullable(),
  }),
});

const legacyRedirects = defineCollection({
  loader: file("src/data/legacy_redirects.json", {
    parser: (text) => JSON.parse(text).map((r: [string, string], i: number) => ({ id: String(i), from: r[0], to: r[1] })),
  }),
  schema: z.object({ from: z.string().startsWith("/"), to: z.string().startsWith("/") }),
});

export const collections = { site, socials, pages, models, parts, themes, fields, products, schedule, episodes, legacyRedirects };
