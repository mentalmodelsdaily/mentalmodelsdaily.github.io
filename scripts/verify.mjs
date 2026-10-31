// Post-build checks over dist/ (SPEC.md §13). Plain Node, no dependencies.
// Run after `astro build`: node scripts/verify.mjs
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";

const DIST = new URL("../dist/", import.meta.url).pathname;
const GUARD = new URL("./paid_guard.json", import.meta.url).pathname;

// Hosts a page may reference, matching the CSP in public/_headers.
const ALLOWED_HOSTS = [
  "mentalmodelsdaily.com",
  "i.ytimg.com",
  "static.cloudflareinsights.com",
  "cloudflareinsights.com",
  "www.youtube-nocookie.com",
  "open.spotify.com",
];
const BANNED_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];
const JS_BUDGET = 10 * 1024;

const failures = [];
const notes = [];
const fail = (msg) => failures.push(msg);

if (!existsSync(DIST)) {
  console.error("dist/ not found: run `npm run build` first.");
  process.exit(1);
}

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...walk(path));
    else out.push(path);
  }
  return out;
}

const files = walk(DIST);
const rel = (p) => "/" + relative(DIST, p);
const htmlFiles = files.filter((f) => f.endsWith(".html"));

// --- Paid content: files ----------------------------------------------------

for (const f of files) {
  const ext = extname(f).toLowerCase();
  if (ext === ".pdf" || ext === ".epub") fail(`paid: ${rel(f)} is a ${ext} file`);
}
// Card images keep their name through Astro's image pipeline (C01-front.<hash>.webp).
const cardFaces = (side) =>
  new Set(
    files
      .map((f) => f.split("/").pop().match(new RegExp(`^(C\\d{2})-${side}[._]`)))
      .filter(Boolean)
      .map((m) => m[1]),
  );
for (const side of ["front", "back"]) {
  const cards = cardFaces(side);
  if (cards.size > 6) fail(`paid: ${cards.size} different card ${side}s in dist/ (max 6): ${[...cards].join(", ")}`);
}

// --- Paid content: sentences ------------------------------------------------

const guard = JSON.parse(readFileSync(GUARD, "utf8"));
const paidHashes = new Set(guard.hashes);

// The normalisation rule is the export's (`_how` in paid_guard.json).
function normalise(sentence) {
  return sentence
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/ +/g, " ")
    .trim();
}
function sentencesOf(text) {
  return text
    .split(/(?<=[.!?]) /)
    .map(normalise)
    .filter((s) => s.split(" ").length >= 8);
}
function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ");
}
const sha = (s) => createHash("sha256").update(s).digest("hex");

// --- Per page ---------------------------------------------------------------

const assetSize = new Map();
const sizeOf = (url) => {
  if (!assetSize.has(url)) {
    const path = join(DIST, url.split("?")[0]);
    assetSize.set(url, existsSync(path) ? statSync(path).size : 0);
  }
  return assetSize.get(url);
};

let paidHits = 0;
for (const file of htmlFiles) {
  const page = rel(file);
  const html = readFileSync(file, "utf8");
  const noindex = /<meta name="robots" content="[^"]*noindex/i.test(html);

  // Inline code is not allowed by the CSP.
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const [, attrs, body] = m;
    const json = /type="application\/(ld\+)?json"/i.test(attrs);
    if (!/\bsrc=/.test(attrs) && body.trim() && !json) fail(`${page}: inline <script>`);
  }
  if (/<style\b/i.test(html)) fail(`${page}: inline <style>`);

  // Third-party hosts.
  for (const m of html.matchAll(/(?:src|href|action|srcset|poster)="(https?:)?\/\/([^/"]+)/gi)) {
    const host = m[2].toLowerCase();
    if (BANNED_HOSTS.includes(host)) fail(`${page}: request to ${host}`);
  }
  for (const m of html.matchAll(/<(?:script|img|iframe|video|source|link)\b[^>]*?(?:src|href)="https?:\/\/([^/"]+)/gi)) {
    const host = m[1].toLowerCase();
    if (!ALLOWED_HOSTS.includes(host)) fail(`${page}: loads from ${host}, which the CSP does not allow`);
  }

  // Our JavaScript per page.
  const scripts = [...html.matchAll(/<script\b[^>]*\bsrc="(\/[^"]+)"/gi)].map((m) => m[1]);
  const js = scripts.reduce((n, src) => n + sizeOf(src), 0);
  if (js > JS_BUDGET) fail(`${page}: ${(js / 1024).toFixed(1)} KB of JS (budget 10 KB)`);

  // Page basics.
  const h1s = (html.match(/<h1\b/gi) || []).length;
  if (h1s !== 1) fail(`${page}: ${h1s} <h1> elements`);
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(`${page}: no <title>`);
  if (!noindex) {
    if (!/<meta name="description" content="[^"]+"/i.test(html)) fail(`${page}: no meta description`);
    if (!/<link rel="canonical" href="[^"]+"/i.test(html)) fail(`${page}: no canonical`);
    if (!/<meta property="og:image" content="[^"]+"/i.test(html)) fail(`${page}: no og:image`);
  }
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt="/i.test(m[0])) fail(`${page}: <img> without alt`);
  }

  // Paid sentences.
  for (const s of sentencesOf(visibleText(html))) {
    if (paidHashes.has(sha(s))) {
      paidHits++;
      fail(`${page}: contains a sentence from the paid products: "${s.slice(0, 60)}…"`);
    }
  }
}

// --- Route counts and links, once the routes exist ---------------------------

const count = (re) => htmlFiles.filter((f) => re.test(rel(f))).length;
const models = count(/^\/models\/[^/]+\/index\.html$/);
const parts = count(/^\/explore\/[^/]+\/index\.html$/);
if (existsSync(join(DIST, "models"))) {
  if (models !== 365) fail(`${models} model pages (expected 365)`);
  if (parts !== 8) fail(`${parts} part pages (expected 8)`);
  // Every link to a model or part page (related, previous/next, the wall, rows, chips) must resolve.
  const broken = new Map();
  for (const file of htmlFiles) {
    const html = readFileSync(file, "utf8");
    for (const m of html.matchAll(/href="(\/(?:models|explore)\/[^"#?]*)/g)) {
      const target = join(DIST, m[1], m[1].endsWith("/") ? "index.html" : "");
      if (!existsSync(target)) broken.set(m[1], rel(file));
    }
  }
  for (const [href, page] of broken) fail(`${page}: links to ${href}, which does not exist`);
} else {
  notes.push("no /models/ yet: route counts skipped");
}

// --- Report -----------------------------------------------------------------

console.log(`verify: ${htmlFiles.length} pages, ${files.length} files, ${paidHashes.size} paid-sentence hashes, ${paidHits} hits`);
for (const n of notes) console.log(`  note: ${n}`);
if (failures.length) {
  for (const f of failures.slice(0, 200)) console.error(`  ✗ ${f}`);
  if (failures.length > 200) console.error(`  … and ${failures.length - 200} more`);
  console.error(`verify: ${failures.length} problem(s)`);
  process.exit(1);
}
console.log("verify: all checks passed");
