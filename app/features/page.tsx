import Features from "@/components/landing/Features";
import MarketingPage from "@/components/landing/MarketingPage";
import { buildPageMetadata } from "@/lib/marketing-seo";

export const metadata = buildPageMetadata("/features");

export default function Page() {
  return <MarketingPage component={Features} path="/features" />;
}
