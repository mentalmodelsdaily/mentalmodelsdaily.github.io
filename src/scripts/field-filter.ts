// Field chips on part pages filter the model rows (SPEC.md §6.3). Without JS they are anchor links.
const nav = document.querySelector<HTMLElement>("[data-field-filter]");
if (nav) {
  const chips = [...nav.querySelectorAll<HTMLAnchorElement>("[data-field-chip]")];
  const rows = [...document.querySelectorAll<HTMLElement>(".model-row")];
  const sections = [...document.querySelectorAll<HTMLElement>(".theme")];
  const status = nav.querySelector<HTMLElement>("[data-field-status]");

  const apply = (slug: string) => {
    for (const chip of chips) chip.setAttribute("aria-pressed", String(chip.dataset.fieldChip === slug));
    let shown = 0;
    for (const row of rows) {
      const match = !slug || row.dataset.field === slug;
      row.hidden = !match;
      if (match) shown++;
    }
    for (const s of sections) s.hidden = !s.querySelector(".model-row:not([hidden])");
    if (status) status.textContent = (nav.dataset.status ?? "{n}").replace("{n}", String(shown)).replace("{total}", String(rows.length));
  };

  for (const chip of chips) {
    chip.hidden = false;
    chip.setAttribute("role", "button");
    chip.setAttribute("aria-pressed", String(chip.dataset.fieldChip === ""));
    chip.addEventListener("click", (e) => {
      e.preventDefault();
      const slug = chip.dataset.fieldChip ?? "";
      apply(chip.getAttribute("aria-pressed") === "true" && slug ? "" : slug);
    });
    chip.addEventListener("keydown", (e) => {
      if (e.key === " ") {
        e.preventDefault();
        chip.click();
      }
    });
  }
}
