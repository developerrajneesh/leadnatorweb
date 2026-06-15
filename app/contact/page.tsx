import Contact from "@/components/landing/Contact";
import MarketingPageShell from "@/components/landing/MarketingPageShell";
import { buildPageMetadata } from "@/lib/marketing-seo";

export const metadata = buildPageMetadata("/contact");

export default function Page() {
  return <MarketingPageShell component={Contact} path="/contact" />;
}
