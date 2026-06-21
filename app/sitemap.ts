import type { MetadataRoute } from "next";
import { MARKETING_PAGES, absoluteUrl } from "@/lib/marketing-seo";
import { listPosts } from "@/lib/blog/store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPages = MARKETING_PAGES.map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: now,
    changeFrequency: page.changefreq,
    priority: page.priority,
  }));

  const posts = await listPosts("published");
  const blogPages = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}
