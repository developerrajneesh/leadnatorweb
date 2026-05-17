import Pricing from "@/components/landing/Pricing";
import MarketingPage from "@/components/landing/MarketingPage";
import { buildPageMetadata } from "@/lib/marketing-seo";

export const metadata = buildPageMetadata("/pricing");

export default function Page() {
  return <MarketingPage component={Pricing} path="/pricing" />;
}
