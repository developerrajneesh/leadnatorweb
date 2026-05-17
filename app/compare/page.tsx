import Compare from "@/components/landing/Compare";
import MarketingPage from "@/components/landing/MarketingPage";
import { buildPageMetadata } from "@/lib/marketing-seo";

export const metadata = buildPageMetadata("/compare");

export default function Page() {
  return <MarketingPage component={Compare} path="/compare" />;
}
