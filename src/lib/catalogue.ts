// The models, parts, themes and fields, cross-checked once per build.
import { getCollection, getEntry } from "astro:content";

export async function getCatalogue() {
  const models = (await getCollection("models")).map((m) => ({ ...m.data, id: m.data.model_id })).sort((a, b) => a.no - b.no);
  const parts = (await getCollection("parts")).map((p) => p.data).sort((a, b) => a.sort - b.sort);
  const themes = (await getCollection("themes")).map((t) => t.data);
  const fields = (await getCollection("fields")).map((f) => f.data).sort((a, b) => a.sort - b.sort);

  const byId = new Map(models.map((m) => [m.id, m]));
  const partByCode = new Map(parts.map((p) => [p.code, p]));
  const themeById = new Map(themes.map((t) => [t.id, t]));
  const fieldBySlug = new Map(fields.map((f) => [f.slug, f]));

  // Broken references fail the build rather than ship a broken page.
  const problems: string[] = [];
  for (const m of models) {
    if (!partByCode.has(m.part)) problems.push(`model ${m.id}: unknown part ${m.part}`);
    if (!themeById.has(m.theme)) problems.push(`model ${m.id}: unknown theme ${m.theme}`);
    if (!fieldBySlug.has(m.field)) problems.push(`model ${m.id}: unknown field ${m.field}`);
    for (const r of m.related) if (!byId.has(r)) problems.push(`model ${m.id}: related model ${r} does not exist`);
  }
  for (const t of themes) {
    if (!partByCode.has(t.part)) problems.push(`theme ${t.id}: unknown part ${t.part}`);
    for (const id of t.models) if (!byId.has(id)) problems.push(`theme ${t.id}: model ${id} does not exist`);
  }
  if (problems.length) throw new Error(`Data references are broken:\n${problems.join("\n")}`);

  const model = (id: number) => byId.get(id)!;
  const part = (code: string) => partByCode.get(code as (typeof parts)[number]["code"])!;
  const field = (slug: string) => fieldBySlug.get(slug)!;
  const themesOf = (code: string) => themes.filter((t) => t.part === code).sort((a, b) => a.sort - b.sort);

  return { models, parts, themes, fields, model, part, field, themesOf };
}

export type Catalogue = Awaited<ReturnType<typeof getCatalogue>>;
export type Model = Catalogue["models"][number];
export type Part = Catalogue["parts"][number];
export type Field = Catalogue["fields"][number];

export async function getProducts() {
  const entry = await getEntry("products", "main");
  if (!entry) throw new Error("src/data/products.json is missing");
  return entry.data;
}
