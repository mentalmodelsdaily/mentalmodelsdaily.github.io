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
  breadcrumbs: "Breadcrumb",
  explore_title: "Explore",
  explore_intro: "Eight situations, 365 models. Start from what you are facing.",
  a_to_z: "A to Z",
  jump_to_letter: "Jump to a letter",
  model_count: "{n} models",
  field_filter: "Filter by field",
  all_fields: "All",
  field_shown: "{n} of {total} models shown",
  previous: "Previous",
  next: "Next",
  no: "No.",
  listen: "Listen to the episode",
  card_ref: "Card {ref}",
  workbook_ref: "Workbook {ref}",
};

export function makeUi(fromData: Record<string, string>) {
  return (key: string): string => fromData[key] ?? defaults[key] ?? key;
}
