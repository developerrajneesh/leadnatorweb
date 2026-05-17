import Contact from "@/components/landing/Contact";
import MarketingPage from "@/components/landing/MarketingPage";
import { buildPageMetadata } from "@/lib/marketing-seo";

export const metadata = buildPageMetadata("/contact");

export default function Page() {
  return <MarketingPage component={Contact} path="/contact" />;
}
