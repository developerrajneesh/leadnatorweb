import ApiDocs from "@/components/landing/ApiDocs";
import MarketingPage from "@/components/landing/MarketingPage";
import { buildPageMetadata } from "@/lib/marketing-seo";

export const metadata = buildPageMetadata("/api-docs");

export default function Page() {
  return <MarketingPage component={ApiDocs} path="/api-docs" />;
}
