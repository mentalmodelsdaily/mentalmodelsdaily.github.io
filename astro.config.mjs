// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://mentalmodelsdaily.com",
  output: "static",
  trailingSlash: "always",
  integrations: [
    sitemap({
      // Pages that are noindex stay out of the sitemap.
      filter: (page) => !/\/(today|thanks)\/$/.test(page),
    }),
  ],
  build: {
    // The CSP forbids inline <style>, so every stylesheet ships as a file.
    inlineStylesheets: "never",
  },
  vite: {
    build: {
      // Never inline scripts or small assets as data: URLs either.
      assetsInlineLimit: 0,
    },
  },
});
