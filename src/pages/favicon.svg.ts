import type { APIRoute } from "astro";
import { markSvg, TERRACOTTA } from "../lib/icons";

export const GET: APIRoute = () =>
  new Response(markSvg(TERRACOTTA), { headers: { "Content-Type": "image/svg+xml" } });
