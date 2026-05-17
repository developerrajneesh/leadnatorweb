import {
  buildGlobalJsonLd,
  buildPageJsonLdGraph,
  type MarketingPath,
} from "@/lib/marketing-seo";

function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function GlobalStructuredData() {
  return <JsonLdScript data={buildGlobalJsonLd()} />;
}

export function PageStructuredData({ path }: { path: MarketingPath }) {
  return <JsonLdScript data={buildPageJsonLdGraph(path)} />;
}
