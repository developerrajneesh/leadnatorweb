import Features from "@/components/landing/Features";
import MarketingPageShell from "@/components/landing/MarketingPageShell";
import { buildPageMetadata } from "@/lib/marketing-seo";

export const metadata = buildPageMetadata("/features");

export default function Page() {
  return <MarketingPageShell component={Features} path="/features" />;
}
