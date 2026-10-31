// The mask files for a drawing at a given size, shared by <Drawing> and the pages that preload it.
import type { ImageMetadata } from "astro";
import { getImage } from "astro:assets";

export const DRAWING_WIDTHS = { sm: 240, md: 640, lg: 1200 } as const;

export async function drawingMasks(src: ImageMetadata, size: keyof typeof DRAWING_WIDTHS) {
  const width = Math.min(DRAWING_WIDTHS[size], src.width);
  // Only the alpha channel matters for a mask: AVIF keeps it about a third the size of WebP.
  const webp = await getImage({ src, width, format: "webp", quality: 80 });
  const avif = await getImage({ src, width, format: "avif", quality: 50 });
  return { webp: webp.src, avif: avif.src };
}
