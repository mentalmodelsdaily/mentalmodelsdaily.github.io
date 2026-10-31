// Films (SPEC.md §8.4): one play/pause button replaces the browser's controls. A film plays by itself
// only while in view, never when the visitor prefers reduced motion or saves data, and on a slow
// connection only the poster shows.
type Connection = { saveData?: boolean; effectiveType?: string };
const connection = (navigator as Navigator & { connection?: Connection }).connection;
const slow = Boolean(connection?.saveData) || /(^|-)2g$/.test(connection?.effectiveType ?? "");
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

for (const figure of document.querySelectorAll<HTMLElement>("[data-film]")) {
  const video = figure.querySelector("video");
  const button = figure.querySelector<HTMLButtonElement>(".film__toggle");
  if (!video || !button) continue;
  video.controls = false;
  button.hidden = false;
  let chosen = false; // once the visitor presses the button, scrolling no longer starts or stops it
  const sync = () => {
    const playing = !video.paused;
    button.setAttribute("aria-pressed", String(playing));
    button.textContent = (playing ? figure.dataset.pause : figure.dataset.play) ?? "";
  };
  button.addEventListener("click", () => {
    chosen = true;
    if (video.paused) void video.play();
    else video.pause();
  });
  video.addEventListener("play", sync);
  video.addEventListener("pause", sync);
  sync();

  if (!slow && !calm && "IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      if (chosen) return;
      if (entry.isIntersecting) void video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.5 }).observe(video);
  }
}
