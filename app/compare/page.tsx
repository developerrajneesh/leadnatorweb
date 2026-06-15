import Compare from "@/components/landing/Compare";
import MarketingPageShell from "@/components/landing/MarketingPageShell";
import { buildPageMetadata } from "@/lib/marketing-seo";

export const metadata = buildPageMetadata("/compare");

export default function Page() {
  return <MarketingPageShell component={Compare} path="/compare" />;
}
