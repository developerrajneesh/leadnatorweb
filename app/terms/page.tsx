import Terms from "@/components/landing/Terms";
import MarketingPageShell from "@/components/landing/MarketingPageShell";
import { buildPageMetadata } from "@/lib/marketing-seo";

export const metadata = buildPageMetadata("/terms");

export default function Page() {
  return <MarketingPageShell component={Terms} path="/terms" />;
}
