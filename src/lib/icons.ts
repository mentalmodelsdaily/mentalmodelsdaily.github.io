// Favicons and app icons, made at build time from the brain mark (src/assets/brand/brain-mark.svg).
import sharp from "sharp";
import MARK from "../assets/brand/brain-mark.svg?raw";
export const TERRACOTTA = "#935F4C";
export const CREAM = "#FFFAE5";

/** The mark in one colour, keeping its viewBox. */
export function markSvg(colour: string) {
  return MARK.replace(/fill:#(?:111111|000000)/g, `fill:${colour}`);
}

/** A square PNG: the mark in terracotta on cream, with some breathing room. */
export async function markPng(size: number) {
  const inner = Math.round(size * 0.78);
  const mark = await sharp(Buffer.from(markSvg(TERRACOTTA))).resize(inner, inner).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: CREAM } })
    .composite([{ input: mark, gravity: "centre" }])
    .png()
    .toBuffer();
}
