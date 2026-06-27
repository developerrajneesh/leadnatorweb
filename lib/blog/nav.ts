import { ADMIN_ROUTES } from "@/lib/blog/admin-paths";

/** Public blog navigation — no admin links (admin uses /admin directly). */
export const BLOG_PUBLIC_NAV = [
  { href: "/blog", label: "All articles", desc: "Published posts" },
  { href: "/", label: "Home", desc: "Leadnator website" },
  { href: "/contact", label: "Contact", desc: "Get in touch" },
] as const;

export const ADMIN_NAV = [
  { href: ADMIN_ROUTES.dashboard, label: "Dashboard", icon: "grid" as const },
  { href: ADMIN_ROUTES.vlogs, label: "All vlogs", icon: "list" as const },
  { href: ADMIN_ROUTES.newPost, label: "New post", icon: "plus" as const },
] as const;

/** @deprecated Use ADMIN_NAV */
export const STUDIO_NAV = ADMIN_NAV;

export const EXIT_SITE_URL = "/";
export const EXIT_SITE_LABEL = "Back to Leadnator";
