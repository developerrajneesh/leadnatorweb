/** Public blog navigation — no studio links (admin uses /studio directly). */
export const BLOG_PUBLIC_NAV = [
  { href: "/blog", label: "All articles", desc: "Published posts" },
  { href: "/", label: "Home", desc: "Leadnator website" },
  { href: "/contact", label: "Contact", desc: "Get in touch" },
] as const;

export const STUDIO_NAV = [
  { href: "/studio/dashboard", label: "Dashboard", icon: "grid" as const },
  { href: "/studio/posts/new", label: "New post", icon: "plus" as const },
  { href: "/blog", label: "View blog", icon: "eye" as const },
  { href: "/blog#posts", label: "All posts", icon: "list" as const },
] as const;

export const EXIT_SITE_URL = "/";
export const EXIT_SITE_LABEL = "Back to Leadnator";
