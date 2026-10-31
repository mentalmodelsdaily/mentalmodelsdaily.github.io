// What the product rooms, the pair and Home share: prices, buy states and covers.
import { getProducts } from "./catalogue";
import { getSite } from "./data";
import { asset } from "./assets";
import { buyState, formatPrice, type BuyKey } from "./buy";
import { makeUi } from "./ui";

export async function getShop() {
  const products = await getProducts();
  const site = await getSite();
  const ui = makeUi(site.ui);
  const groups = site.mailerlite.groups;
  const state = (key: BuyKey) => buyState(products, key, groups);
  // Before launch prices carry "Coming 1 January 2027" (SPEC.md §10).
  const priceNote = products.launch_mode === "soft" ? ui("coming") : null;

  const pairBooks = (["workbook", "almanac"] as const).map((key) => ({
    key,
    title: products[key].title,
    line: key === "workbook" ? products.pair.workbook_line : products.pair.almanac_line,
    cover: asset(`products/${key}-front.png`),
    price: formatPrice(products[key].price),
    paperback: state(key),
    kindle: state(`kindle-${key}`),
  }));

  return { products, site, ui, groups, state, priceNote, pairBooks, formAction: site.mailerlite.form_action };
}
