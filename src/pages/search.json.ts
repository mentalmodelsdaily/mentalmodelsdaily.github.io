// The search index (SPEC.md §9.1): [[id, slug, name, one_liner, field, part], …] in book order.
import type { APIRoute } from "astro";
import { getCatalogue } from "../lib/catalogue";

export const GET: APIRoute = async () => {
  const { models, field } = await getCatalogue();
  const rows = models.map((m) => [m.id, m.slug, m.name, m.one_liner, field(m.field).label, m.part]);
  return new Response(JSON.stringify(rows), { headers: { "Content-Type": "application/json; charset=utf-8" } });
};
