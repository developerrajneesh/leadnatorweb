import { Suspense } from "react";
import Faq from "@/components/landing/Faq";
import MarketingPage from "@/components/landing/MarketingPage";
import { buildPageMetadata } from "@/lib/marketing-seo";

export const metadata = buildPageMetadata("/faq");

export default function Page() {
  return (
    <Suspense fallback={null}>
      <MarketingPage component={Faq} path="/faq" />
    </Suspense>
  );
}
