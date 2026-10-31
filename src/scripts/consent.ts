// Media consent and click-to-load players (SPEC.md §9.4). Stored as { media: true|false } under "mmd-consent".
const KEY = "mmd-consent";
const dialog = document.querySelector<HTMLDialogElement>("#consent");

const stored = (): boolean | null => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "null");
    return typeof v?.media === "boolean" ? v.media : null;
  } catch { return null; }
};
const store = (media: boolean) => {
  try { localStorage.setItem(KEY, JSON.stringify({ media })); } catch { /* private mode: ask again next time */ }
};

/** Opens the dialog for a provider and resolves true on Accept, false on Reject or Esc. */
const ask = (provider: string) =>
  new Promise<boolean>((resolve) => {
    if (!dialog) return resolve(false);
    const fill = (s: string) => s.replaceAll("{provider}", provider);
    dialog.querySelector("#consent-title")!.textContent = fill(dialog.dataset.title ?? "");
    dialog.querySelector("#consent-text")!.textContent = fill(dialog.dataset.text ?? "");
    dialog.returnValue = "";
    dialog.addEventListener("close", () => resolve(dialog.returnValue === "accept"), { once: true });
    dialog.showModal();
  });

const play = (facade: HTMLElement) => {
  const frame = document.createElement("iframe");
  frame.src = facade.dataset.embed!;
  frame.title = facade.dataset.title ?? "";
  frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
  frame.loading = "lazy";
  frame.className = "facade__frame";
  facade.replaceChildren(frame);
  facade.classList.add("is-playing");
  frame.focus();
};

for (const facade of document.querySelectorAll<HTMLElement>("[data-facade][data-embed]")) {
  const link = facade.querySelector<HTMLAnchorElement>(".facade__play");
  link?.addEventListener("click", async (e) => {
    const consent = stored();
    if (consent === false) return; // Rejected before: follow the link out.
    e.preventDefault();
    if (consent === true || (await ask(facade.dataset.provider ?? ""))) {
      store(true);
      play(facade);
    } else {
      store(false);
      location.href = link.href;
    }
  });
}

// Cookie settings in the footer reopens the choice, and can withdraw it.
for (const link of document.querySelectorAll<HTMLAnchorElement>("[data-cookie-settings]")) {
  link.addEventListener("click", async (e) => {
    if (!dialog) return;
    e.preventDefault();
    store(await ask(dialog.dataset.providers ?? ""));
    link.focus();
  });
}
