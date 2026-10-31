// Collections over the exported data (SPEC.md §3). A schema failure fails the build.
import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

// Single-object files become a one-entry collection with the id "main".
const one = (path: string) => file(path, { parser: (text) => [{ id: "main", ...JSON.parse(text) }] });

const url = z.string().url();

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
    contact_email: z.string().email().nullable(),
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

export const collections = { site, socials, pages };
