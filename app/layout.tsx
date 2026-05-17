import type { Metadata, Viewport } from "next";
import { GlobalStructuredData } from "@/components/seo/StructuredData";
import "@/components/landing/Landing.css";
import "./globals.css";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, THEME_COLOR } from "@/lib/marketing-seo";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: THEME_COLOR,
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — AI Growth Platform`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "All-in-one AI growth CRM — WhatsApp Cloud API, Meta Ads, Email, leads pipeline, AI tools and more.",
  applicationName: SITE_NAME,
  icons: {
    icon: "/leadnator_logo.png",
    apple: "/leadnator_logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
  verification: {
    // Add tokens from Google Search Console when ready:
    // google: "your-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body>
        <GlobalStructuredData />
        {children}
      </body>
    </html>
  );
}
