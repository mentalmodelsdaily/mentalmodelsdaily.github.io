// {{key}} placeholders in copy pages take the value of that key in src/data/site.json (SPEC.md §6.11).
const PLACEHOLDER = /\{\{\s*([a-z_]+)\s*\}\}/g;

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function placeholderKeys(text: string) {
  return [...text.matchAll(PLACEHOLDER)].map((m) => m[1]);
}

/**
 * Fills the placeholders in rendered HTML. A key without a value renders nothing in production
 * and a marked TODO in development; `unfilled` lists those keys either way.
 */
export function fillPlaceholders(html: string, values: Record<string, unknown>, dev: boolean) {
  const unfilled: string[] = [];
  const out = html.replace(PLACEHOLDER, (_, key: string) => {
    const value = values[key];
    if (typeof value === "string" && value) {
      // An email address becomes a mail link.
      return /^[^@\s]+@[^@\s]+$/.test(value) ? `<a href="mailto:${escape(value)}">${escape(value)}</a>` : escape(value);
    }
    unfilled.push(key);
    return dev ? `<mark class="todo">TODO: ${key}</mark>` : "";
  });
  return { html: out, unfilled };
}
