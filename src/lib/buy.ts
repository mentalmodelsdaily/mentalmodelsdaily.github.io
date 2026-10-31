// What a Buy button does for each product and format (SPEC.md §10).
import type { getProducts } from "./catalogue";

type Products = Awaited<ReturnType<typeof getProducts>>;
export type BuyKey = "deck" | "workbook" | "almanac" | "kindle-workbook" | "kindle-almanac";

/** The destination of a /buy/* short link, or null while it is not on sale. */
export function buyTarget(products: Products, key: BuyKey): string | null {
  switch (key) {
    case "deck": return products.deck.buy_url;
    case "workbook": return products.workbook.amazon.paperback;
    case "almanac": return products.almanac.amazon.paperback;
    case "kindle-workbook": return products.workbook.amazon.kindle;
    case "kindle-almanac": return products.almanac.amazon.kindle;
  }
}

/** The product page a /buy/* link falls back to (its Notify me form) while it has no destination. */
export function productOf(key: BuyKey): "deck" | "workbook" | "almanac" {
  return key === "deck" ? "deck" : key.endsWith("workbook") ? "workbook" : "almanac";
}

/** "live" with a link: buy. Otherwise Notify me where the product has a notify list, else "coming". */
export function buyState(products: Products, key: BuyKey, notifyGroups: Record<string, string | null>) {
  const product = productOf(key);
  if (products.launch_mode === "live" && buyTarget(products, key)) return "buy" as const;
  return Object.hasOwn(notifyGroups, `notify_${product}`) ? ("notify" as const) : ("coming" as const);
}

export function formatPrice(price: { GBP: number } | null) {
  return price ? new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(price.GBP) : null;
}
