import type { MetadataRoute } from "next";
import { SITE_NAME, THEME_COLOR } from "@/lib/marketing-seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — AI Growth Platform`,
    short_name: SITE_NAME,
    description:
      "WhatsApp CRM, Meta Ads, email marketing and AI automation for Indian businesses.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: THEME_COLOR,
    lang: "en-IN",
    categories: ["business", "productivity", "marketing"],
    icons: [
      { src: "/fev.png", sizes: "192x192", type: "image/png" },
      { src: "/fev.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
