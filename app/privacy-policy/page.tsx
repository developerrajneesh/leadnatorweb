import PrivacyPolicy from "@/components/landing/PrivacyPolicy";
import MarketingPageShell from "@/components/landing/MarketingPageShell";
import { buildPageMetadata } from "@/lib/marketing-seo";

export const metadata = buildPageMetadata("/privacy-policy");

export default function Page() {
  return <MarketingPageShell component={PrivacyPolicy} path="/privacy-policy" />;
}
