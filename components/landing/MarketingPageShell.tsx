import type { ComponentType } from "react";
import { PageStructuredData } from "@/components/seo/StructuredData";
import type { MarketingPath } from "@/lib/marketing-seo";
import MarketingPage from "./MarketingPage";

type MarketingComponent = ComponentType<{ onGoto: (path: string) => void }>;

export default function MarketingPageShell({
  component,
  path,
}: {
  component: MarketingComponent;
  path: MarketingPath;
}) {
  return (
    <>
      <PageStructuredData path={path} />
      <MarketingPage component={component} />
    </>
  );
}
