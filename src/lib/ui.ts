// UI strings. site.json › ui is the source; the defaults below cover labels the export
// does not carry yet (listed in the pull request so they can be added there).
const defaults: Record<string, string> = {
  skip: "Skip to content",
  menu: "Menu",
  nav_label: "Main",
  nav_explore: "Explore",
  nav_deck: "Deck",
  nav_workbook: "Workbook",
  nav_almanac: "Almanac",
  nav_podcast: "Podcast",
  nav_free: "Free",
  nav_about: "About",
  footer_follow: "Follow",
  footer_products: "The products",
  footer_small_print: "Small print",
  product_deck: "Core Deck",
  product_workbook: "Workbook",
  product_almanac: "Almanac",
  draft: "Draft",
  updated: "Updated",
};

export function makeUi(fromData: Record<string, string>) {
  return (key: string): string => fromData[key] ?? defaults[key] ?? key;
}
