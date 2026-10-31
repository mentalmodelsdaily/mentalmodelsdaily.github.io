// Turns deck cards over (SPEC.md §7, §8.5). Without this script both faces show side by side.
for (const card of document.querySelectorAll<HTMLElement>("[data-flip-card]")) {
  const button = card.querySelector<HTMLButtonElement>(".flip-card__button");
  const front = card.querySelector<HTMLElement>(".flip-card__face--front");
  const back = card.querySelector<HTMLElement>(".flip-card__face--back");
  if (!button || !front || !back) continue;
  card.classList.add("is-flippable");
  button.hidden = false;
  const show = (turned: boolean) => {
    button.setAttribute("aria-pressed", String(turned));
    front.setAttribute("aria-hidden", String(turned));
    back.setAttribute("aria-hidden", String(!turned));
  };
  show(false);
  button.addEventListener("click", () => show(button.getAttribute("aria-pressed") !== "true"));
}
