import type { APIRoute } from "astro";
import { markPng } from "../lib/icons";

export const GET: APIRoute = async () =>
  new Response(new Uint8Array(await markPng(512)), { headers: { "Content-Type": "image/png" } });
