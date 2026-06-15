import Partners from "@/components/landing/Partners";
import MarketingPageShell from "@/components/landing/MarketingPageShell";
import { buildPageMetadata } from "@/lib/marketing-seo";

export const metadata = buildPageMetadata("/partners");

export default function Page() {
  return <MarketingPageShell component={Partners} path="/partners" />;
}
