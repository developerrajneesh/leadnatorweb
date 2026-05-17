import type { MetadataRoute } from "next";
import { MARKETING_PAGES, SITE_URL, absoluteUrl } from "@/lib/marketing-seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return MARKETING_PAGES.map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: now,
    changeFrequency: page.changefreq,
    priority: page.priority,
    ...(page.path === "/"
      ? {
          images: [`${SITE_URL}/hero_dashboard.png`],
        }
      : {}),
  }));
}
