// Search box behaviour (SPEC.md §9.1): fetches /search.json on first focus, filters by name, then
// one-liner, then field (ignoring case and accents), shows up to 12 results; ↑ ↓ Enter, Esc clears.
type Row = [number, string, string, string, string, string];

const fold = (s: string) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();
let index: Promise<Row[]> | null = null;
const load = () => (index ??= fetch("/search.json").then((r) => r.json() as Promise<Row[]>));

for (const form of document.querySelectorAll<HTMLFormElement>("[data-search]")) {
  const input = form.querySelector<HTMLInputElement>("input[type=search]")!;
  const list = form.querySelector<HTMLOListElement>(".search__results")!;
  const status = form.querySelector<HTMLElement>(".search__status")!;
  let active = -1;

  input.setAttribute("role", "combobox");
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-expanded", "false");
  list.setAttribute("role", "listbox");

  const links = () => [...list.querySelectorAll<HTMLAnchorElement>("a")];
  const highlight = (i: number) => {
    const items = links();
    active = Math.max(-1, Math.min(i, items.length - 1));
    items.forEach((a, n) => a.setAttribute("aria-selected", String(n === active)));
    if (active >= 0) input.setAttribute("aria-activedescendant", items[active].id);
    else input.removeAttribute("aria-activedescendant");
  };

  let run = 0;
  const render = async () => {
    const q = fold(input.value.trim());
    const mine = ++run;
    const rows = q ? await load() : [];
    if (mine !== run) return; // a newer keystroke has taken over
    list.replaceChildren();
    active = -1;
    if (!q) {
      list.hidden = true;
      input.setAttribute("aria-expanded", "false");
      status.textContent = "";
      return;
    }
    const score = (r: Row) => (fold(r[2]).includes(q) ? 0 : fold(r[3]).includes(q) ? 1 : fold(r[4]).includes(q) ? 2 : 3);
    const hits = rows.map((r) => [score(r), r] as const).filter(([s]) => s < 3).sort((a, b) => a[0] - b[0]);
    for (const [, [id, slug, name, line, field, part]] of hits.slice(0, 12)) {
      const li = document.createElement("li");
      li.dataset.part = part;
      const a = document.createElement("a");
      a.id = `${list.id}-${id}`;
      a.href = `/models/${slug}/`;
      a.setAttribute("role", "option");
      const meta = document.createElement("span");
      meta.className = "label";
      meta.textContent = `${form.dataset.no ?? "No."} ${rows.findIndex((r) => r[0] === id) + 1} · ${field}`;
      const title = document.createElement("span");
      title.className = "search__name";
      title.textContent = name;
      const sub = document.createElement("span");
      sub.textContent = line;
      a.append(meta, title, sub);
      li.append(a);
      list.append(li);
    }
    list.hidden = hits.length === 0;
    input.setAttribute("aria-expanded", String(hits.length > 0));
    const label = hits.length === 1 ? form.dataset.countOne : form.dataset.count;
    status.textContent = hits.length ? (label ?? "{n}").replace("{n}", String(hits.length)) : (form.dataset.none ?? "");
  };

  input.addEventListener("focus", () => void load(), { once: true });
  input.addEventListener("input", () => void render());
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); highlight(active + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); highlight(active - 1); }
    else if (e.key === "Enter" && active >= 0) { e.preventDefault(); links()[active].click(); }
    else if (e.key === "Escape") { input.value = ""; void render(); }
  });
  // No reload while scripting: the results appear as you type.
  form.addEventListener("submit", (e) => { e.preventDefault(); void render(); });

  const q = new URLSearchParams(location.search).get("q");
  if (q) { input.value = q; void render(); }
}
