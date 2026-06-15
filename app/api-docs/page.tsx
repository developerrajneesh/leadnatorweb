import ApiDocs from "@/components/landing/ApiDocs";
import MarketingPageShell from "@/components/landing/MarketingPageShell";
import { buildPageMetadata } from "@/lib/marketing-seo";

export const metadata = buildPageMetadata("/api-docs");

export default function Page() {
  return <MarketingPageShell component={ApiDocs} path="/api-docs" />;
}
