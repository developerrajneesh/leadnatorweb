import Home from "@/components/landing/Home";
import MarketingPage from "@/components/landing/MarketingPage";
import { buildPageMetadata } from "@/lib/marketing-seo";

export const metadata = buildPageMetadata("/");

export default function Page() {
  return <MarketingPage component={Home} path="/" />;
}
