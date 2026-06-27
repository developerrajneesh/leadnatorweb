import type { Metadata } from "next";
import { FAQ_ITEMS } from "./faq-data";

export const SITE_NAME = "Leadnator";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://leadnator.com").replace(/\/$/, "");
export const DEFAULT_OG_IMAGE = `${SITE_URL}/hero_dashboard.png`;
export const DEFAULT_LOGO = `${SITE_URL}/leadnator_logo.png`;
export const THEME_COLOR = "#7c3aed";

const SOCIAL_LINKS = [
  process.env.NEXT_PUBLIC_FACEBOOK_URL,
  process.env.NEXT_PUBLIC_INSTAGRAM_URL,
  process.env.NEXT_PUBLIC_LINKEDIN_URL,
  process.env.NEXT_PUBLIC_YOUTUBE_URL,
].filter(Boolean) as string[];

/** Primary nav — Google uses site structure + these signals for sitelinks. */
export const SITELINK_NAV = [
  {
    path: "/features",
    name: "Features",
    description:
      "WhatsApp Cloud API, Meta Ads, email marketing, CRM pipeline, AI Studio and 20+ growth tools in one platform.",
  },
  {
    path: "/pricing",
    name: "Pricing",
    description:
      "Simple plans with zero setup fees. Monthly, quarterly and yearly billing for WhatsApp CRM and marketing automation.",
  },
  {
    path: "/partners",
    name: "Partners",
    description:
      "Official integrations with Meta, Stripe, Google Cloud, HubSpot, Zapier and more for your growth stack.",
  },
  {
    path: "/compare",
    name: "Compare",
    description:
      "See how Leadnator compares to other WhatsApp CRMs and marketing platforms — features and cost savings.",
  },
  {
    path: "/faq",
    name: "FAQ",
    description:
      "Answers about WhatsApp Business API setup, Meta Ads, email SMTP, billing, security and integrations.",
  },
  {
    path: "/blog",
    name: "Blog",
    description:
      "WhatsApp CRM tips, Meta Ads playbooks, product updates and growth stories from the Leadnator team.",
  },
  {
    path: "/api-docs",
    name: "Developer API",
    description:
      "Full REST API reference for WhatsApp, Meta Ads, email, leads CRM, calendar, storage, AI and webhooks.",
  },
  {
    path: "/contact",
    name: "Contact",
    description:
      "Talk to sales or support. WhatsApp, phone and offices in India, Singapore, UAE and USA.",
  },
  {
    path: "/about",
    name: "About Us",
    description:
      "Our mission, team and global offices — building the all-in-one growth CRM for Indian businesses.",
  },
  {
    path: "/privacy-policy",
    name: "Privacy Policy",
    description:
      "How Leadnator collects, uses, stores and protects your personal and business data.",
  },
  {
    path: "/terms",
    name: "Terms & Conditions",
    description:
      "Subscription terms, acceptable use, WhatsApp API obligations and service agreements.",
  },
  {
    path: "/refund-policy",
    name: "Refund & Cancellation",
    description:
      "Refund eligibility, cancellation steps and billing policy for Leadnator subscriptions.",
  },
] as const;

/** Main pages Google typically shows as sitelinks (excludes legal). */
export const PRIMARY_SITELINKS = SITELINK_NAV.filter(
  (item) => !["/privacy-policy", "/terms", "/refund-policy"].includes(item.path),
);

const LEGAL_PATHS = [
  "/about",
  "/privacy-policy",
  "/terms",
  "/refund-policy",
] as const;

export type MarketingPath =
  | "/"
  | "/site-map"
  | "/blog"
  | (typeof SITELINK_NAV)[number]["path"]
  | (typeof LEGAL_PATHS)[number];

const BREADCRUMB_LABELS: Record<MarketingPath, string> = {
  "/": "Home",
  "/site-map": "Sitemap",
  "/blog": "Blog",
  "/features": "Features",
  "/pricing": "Pricing",
  "/partners": "Partners",
  "/compare": "Compare",
  "/faq": "FAQ",
  "/api-docs": "Developer API",
  "/contact": "Contact",
  "/about": "About Us",
  "/privacy-policy": "Privacy Policy",
  "/terms": "Terms & Conditions",
  "/refund-policy": "Refund & Cancellation Policy",
};

export const MARKETING_PAGES: Array<{
  path: MarketingPath;
  title: string;
  description: string;
  keywords?: string;
  priority: number;
  changefreq: "weekly" | "monthly" | "yearly";
}> = [
  {
    path: "/",
    title: "Leadnator — WhatsApp CRM, Meta Ads & Email Marketing Platform India",
    description:
      "Leadnator: India's all-in-one WhatsApp Business API CRM. Run Meta Ads, email campaigns, AI chatbots, lead pipelines and 20+ growth tools from one dashboard. Free trial, no setup fees.",
    keywords:
      "WhatsApp CRM India, WhatsApp Business API, Meta Ads manager, email marketing CRM, lead management software, AI chatbot WhatsApp, AiSensy alternative, Gallabox alternative",
    priority: 1,
    changefreq: "weekly",
  },
  {
    path: "/features",
    title: "Features — WhatsApp Broadcast, Meta Ads, Email CRM & AI Tools",
    description:
      "Explore Leadnator features: WhatsApp Cloud API broadcasts, chatbot builder, Meta Lead Ads sync, SMTP email marketing, CRM pipeline, S3 storage, booking calendar and AI Studio.",
    keywords:
      "WhatsApp broadcast India, WhatsApp chatbot builder, Meta Lead Ads CRM, email marketing automation, lead pipeline CRM",
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/pricing",
    title: "Pricing — WhatsApp CRM Plans from ₹299/mo, Zero Setup Fee",
    description:
      "Leadnator pricing: Starter ₹299, Growth ₹499, Pro ₹999. WhatsApp API wallet, Meta Ads, email and CRM included. Monthly to yearly billing with up to 15% off. Free tier available.",
    keywords:
      "WhatsApp API pricing India, CRM pricing INR, Leadnator plans, WhatsApp marketing cost",
    priority: 0.9,
    changefreq: "weekly",
  },
  {
    path: "/partners",
    title: "Partners — Meta, Stripe, Zapier & 25+ Integrations",
    description:
      "Leadnator integration partners: Meta Business, Stripe, Google Cloud, HubSpot, Zapier, Shopify, Razorpay and enterprise-ready APIs for your growth stack.",
    keywords: "WhatsApp API integrations, CRM Zapier integration, Meta Business Partner CRM",
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/compare",
    title: "Compare — Leadnator vs AiSensy, Gallabox, Interakt & Others",
    description:
      "Compare Leadnator with top WhatsApp CRMs in India. Feature matrix, pricing savings and why teams switch for Meta Ads, email and AI automation in one platform.",
    keywords:
      "AiSensy vs Leadnator, Gallabox alternative, Interakt alternative, best WhatsApp CRM India 2026",
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/faq",
    title: "FAQ — WhatsApp API, Pricing, Meta Ads & Security Questions",
    description:
      "Leadnator FAQ: WhatsApp Business API setup, blue tick, Meta Ads, email SMTP, billing in INR, data security, integrations and support — 30+ detailed answers.",
    keywords: "WhatsApp Business API FAQ, WhatsApp CRM setup India, Meta Ads CRM FAQ",
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/blog",
    title: "Blog — WhatsApp CRM, Meta Ads & Growth Tips",
    description:
      "Leadnator blog: WhatsApp Business API guides, Meta Ads playbooks, CRM tips, product updates and growth stories for Indian businesses.",
    keywords: "WhatsApp CRM blog, Meta Ads tips India, lead generation blog, Leadnator updates",
    priority: 0.8,
    changefreq: "weekly",
  },
  {
    path: "/api-docs",
    title: "API Docs — REST API for WhatsApp, Meta, Email & CRM Webhooks",
    description:
      "Leadnator developer documentation. REST endpoints for WhatsApp Cloud API, Meta Ads, email, leads, calendar, storage, AI and inbound webhooks with curl examples.",
    keywords: "WhatsApp API documentation, CRM REST API, Meta webhook API, Leadnator developer",
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/contact",
    title: "Contact Sales & Support — WhatsApp +91 7888341096",
    description:
      "Contact Leadnator for demos, sales and support. WhatsApp +917888341096, phone support, offices in India, Singapore, UAE and USA. Enterprise onboarding available.",
    keywords: "Leadnator contact, WhatsApp CRM demo India, enterprise CRM sales",
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/site-map",
    title: "Sitemap — All Leadnator Pages",
    description:
      "Complete sitemap of Leadnator marketing pages: features, pricing, FAQ, API docs, partners, compare, contact and legal policies.",
    keywords: "Leadnator sitemap, site navigation",
    priority: 0.2,
    changefreq: "monthly",
  },
  {
    path: "/about",
    title: "About Us — India's AI Growth CRM for WhatsApp & Meta Ads",
    description:
      "About Leadnator: our mission to unify WhatsApp Business API, Meta Ads, email marketing and CRM for Indian businesses. Offices in India, Singapore, UAE and USA.",
    keywords: "About Leadnator, WhatsApp CRM company India, AI growth platform",
    priority: 0.5,
    changefreq: "yearly",
  },
  {
    path: "/privacy-policy",
    title: "Privacy Policy — How Leadnator Protects Your Data",
    description:
      "Leadnator Privacy Policy: data collection, WhatsApp & Meta processing, security, retention and your rights. Contact privacy@leadnator.com for requests.",
    keywords: "Leadnator privacy policy, WhatsApp CRM data privacy",
    priority: 0.3,
    changefreq: "yearly",
  },
  {
    path: "/terms",
    title: "Terms & Conditions — Leadnator Service Agreement",
    description:
      "Leadnator Terms & Conditions: subscriptions, acceptable use, WhatsApp API obligations, liability limits and governing law for our CRM platform.",
    keywords: "Leadnator terms of service, WhatsApp CRM terms India",
    priority: 0.3,
    changefreq: "yearly",
  },
  {
    path: "/refund-policy",
    title: "Refund & Cancellation Policy — Leadnator Billing",
    description:
      "Leadnator refund policy: cancel monthly plans anytime, pro-rata yearly refunds within 14 days, WhatsApp wallet credits and how to request billing support.",
    keywords: "Leadnator refund policy, CRM cancellation India",
    priority: 0.3,
    changefreq: "yearly",
  },
];

export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return p === "/" ? `${SITE_URL}/` : `${SITE_URL}${p}`;
}

function googleVerification(): Metadata["verification"] {
  const google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  return google ? { google } : undefined;
}

export function buildPageMetadata(path: MarketingPath): Metadata {
  const page = MARKETING_PAGES.find((p) => p.path === path)!;
  const url = absoluteUrl(path);
  const fullTitle = `${page.title} · ${SITE_NAME}`;

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "technology",
    alternates: {
      canonical: url,
      languages: {
        "en-IN": url,
        "x-default": url,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: fullTitle,
      description: page.description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_IN",
      alternateLocale: ["en_US"],
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "Leadnator — WhatsApp CRM and marketing dashboard",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: page.description,
      images: [DEFAULT_OG_IMAGE],
    },
    verification: googleVerification(),
  };
}

export function buildBreadcrumbJsonLd(path: MarketingPath) {
  const items = [
    { name: "Home", path: "/" as MarketingPath },
    ...(path !== "/" ? [{ name: BREADCRUMB_LABELS[path], path }] : []),
  ];

  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(path)}#breadcrumb`,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildWebPageJsonLd(path: MarketingPath) {
  const page = MARKETING_PAGES.find((p) => p.path === path)!;
  return {
    "@type": "WebPage",
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name: page.title,
    description: page.description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-IN",
    ...(path !== "/"
      ? { breadcrumb: { "@id": `${absoluteUrl(path)}#breadcrumb` } }
      : {}),
  };
}

export function buildSoftwareApplicationJsonLd() {
  return {
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#software`,
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    description:
      "All-in-one WhatsApp CRM with Meta Ads, email marketing, AI automation and lead management for Indian businesses.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      description: "Free Starter plan available",
      url: absoluteUrl("/pricing"),
    },
    featureList: [
      "WhatsApp Business Cloud API",
      "Meta Ads & Lead Ads",
      "Email marketing with SMTP",
      "CRM lead pipeline",
      "AI chatbot & automation",
      "Calendar booking",
      "File storage (S3)",
    ],
    provider: { "@id": `${SITE_URL}/#organization` },
  };
}

export function buildPricingProductJsonLd() {
  return {
    "@type": "Product",
    "@id": `${SITE_URL}/pricing#product`,
    name: "Leadnator — AI Growth CRM",
    description:
      "Subscription plans for WhatsApp CRM, Meta Ads, email marketing and automation.",
    brand: { "@type": "Brand", name: SITE_NAME },
    url: absoluteUrl("/pricing"),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: "0",
      highPrice: "999",
      offerCount: "3",
      url: absoluteUrl("/pricing"),
      availability: "https://schema.org/InStock",
    },
  };
}

export function buildFaqPageJsonLd() {
  return {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/faq#faqpage`,
    mainEntity: FAQ_ITEMS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Per-page JSON-LD @graph (server-rendered — best for Google). */
export function buildPageJsonLdGraph(path: MarketingPath) {
  const graph: Record<string, unknown>[] = [
    buildWebPageJsonLd(path),
    ...(path !== "/" ? [buildBreadcrumbJsonLd(path)] : []),
  ];

  if (path === "/") graph.push(buildSoftwareApplicationJsonLd());
  if (path === "/pricing") graph.push(buildPricingProductJsonLd());
  if (path === "/faq") graph.push(buildFaqPageJsonLd());

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

/** Global JSON-LD — Organization, WebSite, navigation. */
export function buildGlobalJsonLd() {
  const organization: Record<string, unknown> = {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: DEFAULT_LOGO,
      width: 512,
      height: 512,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91-7888341096",
        contactType: "sales",
        areaServed: ["IN", "SG", "AE", "US"],
        availableLanguage: ["English", "Hindi"],
      },
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: "+91-7888341096",
        availableLanguage: ["English", "Hindi"],
      },
    ],
  };

  if (SOCIAL_LINKS.length) organization.sameAs = SOCIAL_LINKS;

  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        description:
          "All-in-one AI growth CRM — WhatsApp Cloud API, Meta Ads, email marketing and lead management.",
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-IN",
        hasPart: PRIMARY_SITELINKS.map((item) => ({
          "@type": "WebPage",
          "@id": `${absoluteUrl(item.path)}#webpage`,
          name: item.name,
          description: item.description,
          url: absoluteUrl(item.path),
        })),
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/faq?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/#sitelinks`,
        name: `${SITE_NAME} — Main pages`,
        numberOfItems: SITELINK_NAV.length,
        itemListElement: SITELINK_NAV.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          description: item.description,
          url: absoluteUrl(item.path),
        })),
      },
      ...SITELINK_NAV.map((item) => ({
        "@type": "SiteNavigationElement",
        name: item.name,
        description: item.description,
        url: absoluteUrl(item.path),
      })),
    ],
  };
}
