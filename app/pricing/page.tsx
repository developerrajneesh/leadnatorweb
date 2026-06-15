import Pricing from "@/components/landing/Pricing";
import MarketingPageShell from "@/components/landing/MarketingPageShell";
import { buildPageMetadata } from "@/lib/marketing-seo";

export const metadata = buildPageMetadata("/pricing");

export default function Page() {
  return <MarketingPageShell component={Pricing} path="/pricing" />;
}
