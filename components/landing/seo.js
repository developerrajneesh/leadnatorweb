"use client";

// SEO meta tags are set server-side via buildPageMetadata in each app route page.
// JSON-LD is rendered server-side via PageStructuredData and GlobalStructuredData.
// Client-side head mutation caused hydration conflicts with Next.js MetadataWrapper.
export function useSeo() {
  /* intentionally empty */
}
