// One play/pause button per film, replacing the browser's controls (SPEC.md §8.4).
for (const figure of document.querySelectorAll<HTMLElement>("[data-film]")) {
  const video = figure.querySelector("video");
  const button = figure.querySelector<HTMLButtonElement>(".film__toggle");
  if (!video || !button) continue;
  video.controls = false;
  button.hidden = false;
  const sync = () => {
    const playing = !video.paused;
    button.setAttribute("aria-pressed", String(playing));
    button.textContent = (playing ? figure.dataset.pause : figure.dataset.play) ?? "";
  };
  button.addEventListener("click", () => (video.paused ? video.play() : video.pause()));
  video.addEventListener("play", sync);
  video.addEventListener("pause", sync);
  sync();
}
