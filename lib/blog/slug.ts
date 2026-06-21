export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function uniqueSlug(base: string, existing: string[]): string {
  let slug = slugify(base) || "post";
  let n = 1;
  while (existing.includes(slug)) {
    slug = `${slugify(base)}-${n++}`;
  }
  return slug;
}
