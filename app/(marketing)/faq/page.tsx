import { Suspense } from "react";
import FaqPage from "./FaqPage";
import PageShell from "@/components/site/PageShell";
import { buildPageMetadata } from "@/lib/marketing-seo";

export const metadata = buildPageMetadata("/faq");

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PageShell component={FaqPage} path="/faq" />
    </Suspense>
  );
}
