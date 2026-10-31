/** Plain-text paragraphs, split on a blank line (the export's convention). */
export function paragraphs(text: string) {
  return text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

/** Letter for an A–Z group: accents folded, anything else under "#". */
export function initial(name: string) {
  const c = name.normalize("NFKD").replace(/[^A-Za-z0-9]/g, "").charAt(0).toUpperCase();
  return /[A-Z]/.test(c) ? c : "#";
}
