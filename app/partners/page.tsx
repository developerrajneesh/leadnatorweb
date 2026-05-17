import Partners from "@/components/landing/Partners";
import MarketingPage from "@/components/landing/MarketingPage";
import { buildPageMetadata } from "@/lib/marketing-seo";

export const metadata = buildPageMetadata("/partners");

export default function Page() {
  return <MarketingPage component={Partners} path="/partners" />;
}
