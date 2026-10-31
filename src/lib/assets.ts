// Every image in src/assets, by its path relative to src/assets (as the data names them).
import type { ImageMetadata } from "astro";

const glob = (files: Record<string, { default: ImageMetadata }>) =>
  Object.fromEntries(Object.entries(files).map(([path, mod]) => [path.replace("/src/assets/", ""), mod.default]));

const images = glob(
  import.meta.glob<{ default: ImageMetadata }>("/src/assets/{drawings,products,cards,look-inside}/**/*.png", { eager: true }),
);
const og = glob(import.meta.glob<{ default: ImageMetadata }>("/src/assets/og/*.jpg", { eager: true }));

/** An image named in the data ("drawings/models/62.png"); throws if the file is missing. */
export function asset(path: string): ImageMetadata {
  const image = images[path];
  if (!image) throw new Error(`src/assets/${path} is named in the data but does not exist`);
  return image;
}

export function optionalAsset(path: string | null | undefined): ImageMetadata | null {
  return path ? (images[path] ?? null) : null;
}

/** The sharing image for a model slug or for home, deck, workbook, almanac. */
export function ogImage(name: string): string | undefined {
  return og[`og/${name}.jpg`]?.src;
}
