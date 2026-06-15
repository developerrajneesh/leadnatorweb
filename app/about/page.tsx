import About from "@/components/landing/About";
import MarketingPageShell from "@/components/landing/MarketingPageShell";
import { buildPageMetadata } from "@/lib/marketing-seo";

export const metadata = buildPageMetadata("/about");

export default function Page() {
  return <MarketingPageShell component={About} path="/about" />;
}
