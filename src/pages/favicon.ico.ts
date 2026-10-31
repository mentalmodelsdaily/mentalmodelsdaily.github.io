import type { APIRoute } from "astro";
import { markPng } from "../lib/icons";

// An ICO file holding one 32 × 32 PNG image.
export const GET: APIRoute = async () => {
  const png = await markPng(32);
  const head = Buffer.alloc(22);
  head.writeUInt16LE(0, 0); // reserved
  head.writeUInt16LE(1, 2); // type: icon
  head.writeUInt16LE(1, 4); // one image
  head.writeUInt8(32, 6); // width
  head.writeUInt8(32, 7); // height
  head.writeUInt8(0, 8); // no palette
  head.writeUInt8(0, 9); // reserved
  head.writeUInt16LE(1, 10); // colour planes
  head.writeUInt16LE(32, 12); // bits per pixel
  head.writeUInt32LE(png.length, 14); // image size
  head.writeUInt32LE(22, 18); // image offset
  return new Response(new Uint8Array(Buffer.concat([head, png])), { headers: { "Content-Type": "image/x-icon" } });
};
