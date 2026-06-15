import { Suspense } from "react";
import Faq from "@/components/landing/Faq";
import MarketingPageShell from "@/components/landing/MarketingPageShell";
import { buildPageMetadata } from "@/lib/marketing-seo";

export const metadata = buildPageMetadata("/faq");

export default function Page() {
  return (
    <Suspense fallback={null}>
      <MarketingPageShell component={Faq} path="/faq" />
    </Suspense>
  );
}
