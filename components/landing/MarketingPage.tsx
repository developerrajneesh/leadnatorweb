"use client";

import type { ComponentType } from "react";
import { PageStructuredData } from "@/components/seo/StructuredData";
import type { MarketingPath } from "@/lib/marketing-seo";
import { useMarketingGoto } from "./useMarketingGoto";

type MarketingComponent = ComponentType<{ onGoto: (path: string) => void }>;

export default function MarketingPage({
  component: Page,
  path,
}: {
  component: MarketingComponent;
  path: MarketingPath;
}) {
  const onGoto = useMarketingGoto();
  return (
    <>
      <PageStructuredData path={path} />
      <Page onGoto={onGoto} />
    </>
  );
}
