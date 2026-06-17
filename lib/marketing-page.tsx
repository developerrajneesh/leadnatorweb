import type { ComponentType } from "react";
import PageShell from "@/components/site/PageShell";
import { buildPageMetadata, type MarketingPath } from "@/lib/marketing-seo";

type PageComponent = ComponentType<{ onGoto: (path: string) => void }>;

export function defineMarketingPage(path: MarketingPath, component: PageComponent) {
  return {
    metadata: buildPageMetadata(path),
    Page() {
      return <PageShell component={component} path={path} />;
    },
  };
}
