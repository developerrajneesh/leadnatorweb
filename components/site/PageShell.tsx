import type { ComponentType } from "react";
import { PageStructuredData } from "@/components/seo/StructuredData";
import type { MarketingPath } from "@/lib/marketing-seo";
import ClientPage from "./ClientPage";

type MarketingComponent = ComponentType<{ onGoto: (path: string) => void }>;

export default function PageShell({
  component,
  path,
}: {
  component: MarketingComponent;
  path: MarketingPath;
}) {
  return (
    <>
      <PageStructuredData path={path} />
      <ClientPage component={component} />
    </>
  );
}
