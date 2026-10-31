import type { APIRoute } from "astro";
import { getSite } from "../lib/data";
import { CREAM, TERRACOTTA } from "../lib/icons";

export const GET: APIRoute = async () => {
  const site = await getSite();
  const manifest = {
    name: site.name,
    short_name: site.name,
    start_url: "/",
    display: "browser",
    background_color: CREAM,
    theme_color: TERRACOTTA,
    icons: [
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
  return new Response(JSON.stringify(manifest, null, 2), { headers: { "Content-Type": "application/manifest+json" } });
};
