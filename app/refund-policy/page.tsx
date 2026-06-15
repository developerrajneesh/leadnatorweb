import RefundPolicy from "@/components/landing/RefundPolicy";
import MarketingPageShell from "@/components/landing/MarketingPageShell";
import { buildPageMetadata } from "@/lib/marketing-seo";

export const metadata = buildPageMetadata("/refund-policy");

export default function Page() {
  return <MarketingPageShell component={RefundPolicy} path="/refund-policy" />;
}
