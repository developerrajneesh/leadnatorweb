const STATIC_PAGE_LABELS: Record<string, string> = {
  "/": "Home",
  "/blog": "Blog",
  "/contact": "Contact Us",
  "/pricing": "Pricing",
  "/features": "Features",
  "/about": "About Us",
  "/partners": "Partners",
  "/compare": "Compare Plans",
  "/faq": "FAQ",
  "/api-docs": "API Docs",
  "/privacy-policy": "Privacy Policy",
  "/terms": "Terms of Service",
  "/refund-policy": "Refund Policy",
  "/site-map": "Site Map",
};

export function humanizeSlug(slug: string): string {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** Friendly page name — never shows raw URL paths in the UI. */
export function resolvePageLabel(path: string, cmsTitles?: Map<string, string>): string {
  const fromCms = cmsTitles?.get(path);
  if (fromCms) return fromCms;

  const staticLabel = STATIC_PAGE_LABELS[path];
  if (staticLabel) return staticLabel;

  if (path.startsWith("/blog/")) {
    return humanizeSlug(path.slice("/blog/".length));
  }

  const trimmed = path.replace(/^\/+|\/+$/g, "");
  if (!trimmed) return "Home";

  return humanizeSlug(trimmed.replace(/\//g, "-"));
}

export type PageKind = "home" | "blog" | "page";

export function resolvePageKind(path: string): PageKind {
  if (path === "/") return "home";
  if (path === "/blog" || path.startsWith("/blog/")) return "blog";
  return "page";
}

export function pageKindLabel(kind: PageKind): string {
  if (kind === "home") return "Home";
  if (kind === "blog") return "Blog";
  return "Page";
}
