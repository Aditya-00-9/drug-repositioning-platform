/**
 * URL-safe slug from a display name (e.g. "Type 2 Diabetes" → "type-2-diabetes").
 * Used for disease profile routes so any disease name can be used in the URL.
 */
export function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "disease";
}

/**
 * Human-readable label from a slug (e.g. "type-2-diabetes" → "Type 2 diabetes").
 */
export function humanize(slug: string): string {
  return slug
    .trim()
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
