// Opens a look-inside page large in a <dialog> (SPEC.md §7). Without this script the link opens the image.
const links = document.querySelectorAll<HTMLAnchorElement>("[data-zoom]");
if (links.length) {
  const dialog = document.createElement("dialog");
  dialog.className = "zoom-dialog";
  const close = document.createElement("button");
  close.type = "button";
  close.className = "button zoom-dialog__close";
  const img = document.createElement("img");
  img.decoding = "async";
  dialog.append(close, img);
  document.body.append(dialog);

  let opener: HTMLElement | null = null;
  close.addEventListener("click", () => dialog.close());
  // A click on the backdrop closes it too.
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => opener?.focus());

  for (const link of links) {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      opener = link;
      img.src = link.href;
      img.alt = link.dataset.alt ?? "";
      close.textContent = link.dataset.close ?? "Close";
      dialog.showModal();
      close.focus();
    });
  }
}
