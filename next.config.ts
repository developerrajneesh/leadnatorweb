import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  // Blocking metadata for all agents — avoids MetadataWrapper hydration
  // mismatch (hidden div vs whitespace) in dev with streaming metadata.
  htmlLimitedBots: /.*/,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
