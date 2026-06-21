import type { NextConfig } from "next";

const endpoint = process.env.ENDPOINT_URL?.trim() || "";
const projectMatch = endpoint.match(/https:\/\/([^.]+)\.storage\.supabase\.co/);
const envHost = process.env.SUPABASE_PUBLIC_HOST?.trim();

const supabaseHosts = new Set<string>();
if (envHost) supabaseHosts.add(envHost);
if (projectMatch) supabaseHosts.add(`${projectMatch[1]}.supabase.co`);

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  htmlLimitedBots: /.*/,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Any Supabase project (storage public URLs)
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      ...[...supabaseHosts].map((hostname) => ({
        protocol: "https" as const,
        hostname,
        pathname: "/storage/v1/object/public/**",
      })),
    ],
  },
};

export default nextConfig;
