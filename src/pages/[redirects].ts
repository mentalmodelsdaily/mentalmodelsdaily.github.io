// Cloudflare Pages _redirects, generated from products.json, site.json and legacy_redirects.json
// (SPEC.md §4, §10). Printed QR codes use these, so they must never 404.
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getProducts } from "../lib/catalogue";
import { getSite } from "../lib/data";
import { buyTarget, productOf, type BuyKey } from "../lib/buy";

const BUY_KEYS: BuyKey[] = ["deck", "workbook", "almanac", "kindle-workbook", "kindle-almanac"];
// Amazon Associates tags differ per placement (home, model page, product page), so each placement has
// its own short link; the plain one (for print) carries no placement.
const PLACEMENTS = ["home", "model", "product"] as const;

const withTag = (url: string, tag: string | null) => {
  if (!tag || !/(^|\.)amazon\./.test(new URL(url).hostname)) return url;
  const u = new URL(url);
  u.searchParams.set("tag", tag);
  return u.href;
};

// Astro skips files whose names start with "_", so the route is a parameter that only ever builds /_redirects.
export function getStaticPaths() {
  return [{ params: { redirects: "_redirects" } }];
}

export const GET: APIRoute = async () => {
  const products = await getProducts();
  const site = await getSite();
  const legacy = (await getCollection("legacyRedirects")).map((r) => r.data);
  const lines: string[] = [];
  const add = (from: string, to: string, status: number) => {
    lines.push(`${from} ${to} ${status}`);
    // Match with and without the trailing slash, unless the slashed form is the destination itself.
    if (!from.endsWith("/") && !from.endsWith("*") && `${from}/` !== to) lines.push(`${from}/ ${to} ${status}`);
  };

  lines.push("# Short links");
  add("/today", "/today/", 301);
  add("/listen", "/podcast/", 302);
  add("/watch", "/podcast/#watch", 302);
  add("/free", "/free/", 301);
  add("/book", "/almanac/", 301);
  lines.push("/book/* /almanac/ 301");

  lines.push("", "# Buy links: the product's checkout or Amazon page, or its Notify me form until it has one");
  for (const key of BUY_KEYS) {
    const target = products.launch_mode === "live" ? buyTarget(products, key) : null;
    // Products with a notify list go to its form; the others to their page.
    const product = productOf(key);
    const fallback = Object.hasOwn(site.mailerlite.groups, `notify_${product}`) ? `/${product}/#notify` : `/${product}/`;
    add(`/buy/${key}`, target ?? fallback, 302);
    for (const placement of PLACEMENTS) {
      add(`/buy/${key}/${placement}`, target ? withTag(target, site.associates_tags[placement] ?? null) : fallback, 302);
    }
  }

  if (legacy.length) {
    lines.push("", "# The 2020 blog's addresses");
    for (const r of legacy) add(r.from.replace(/\/$/, ""), r.to, 301);
  }

  return new Response(lines.join("\n") + "\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
