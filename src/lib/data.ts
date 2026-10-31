// The only place pages read the exported data; components take props.
import { getCollection, getEntry } from "astro:content";
import { makeUi } from "./ui";

export async function getSite() {
  const entry = await getEntry("site", "main");
  if (!entry) throw new Error("src/data/site.json is missing");
  return entry.data;
}

export async function getSocials() {
  // Show only the accounts that have a URL, in the export's order.
  return (await getCollection("socials"))
    .map((s) => s.data)
    .sort((a, b) => a.order - b.order)
    .filter((s): s is typeof s & { url: string } => Boolean(s.url));
}

// The small print, in the footer's order (SPEC.md §6.11).
export const SMALL_PRINT = ["privacy", "cookies", "terms", "shipping-returns", "affiliate-disclosure", "accessibility"];

export async function getChrome() {
  const site = await getSite();
  const socials = await getSocials();
  const pages = await getCollection("pages");
  const smallPrint = SMALL_PRINT.flatMap((id) => {
    const page = pages.find((p) => p.id === id);
    return page ? [{ href: `/${id}/`, title: page.data.title }] : [];
  });
  return { site, socials, smallPrint, ui: makeUi(site.ui) };
}
