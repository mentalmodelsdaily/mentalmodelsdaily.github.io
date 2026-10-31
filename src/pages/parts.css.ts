// Situation colours, emitted from parts.json (SPEC.md §5): [data-part="R"] { --part-bg; --part-fg; --part-accent; --part-ink }.
import type { APIRoute } from "astro";
import { getCatalogue } from "../lib/catalogue";
import { contrast } from "../lib/colour";

const CREAM = "#FFFAE5";

export const GET: APIRoute = async () => {
  const { parts } = await getCatalogue();
  const css = parts
    .map(({ code, colours }) => {
      // On cream, type and drawings use the part's darkest-reading colour that passes AA (BRAND.md).
      const ink = [colours.bg, colours.fg, colours.accent].find((c) => contrast(c, CREAM) >= 4.5) ?? "#111111";
      return `[data-part="${code}"]{--part-bg:${colours.bg};--part-fg:${colours.fg};--part-accent:${colours.accent};--part-ink:${ink}}`;
    })
    .join("\n");
  return new Response(css + "\n", { headers: { "Content-Type": "text/css; charset=utf-8" } });
};
