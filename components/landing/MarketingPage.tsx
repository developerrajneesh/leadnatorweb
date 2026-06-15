"use client";

import type { ComponentType } from "react";
import { useMarketingGoto } from "./useMarketingGoto";

type MarketingComponent = ComponentType<{ onGoto: (path: string) => void }>;

export default function MarketingPage({
  component: Page,
}: {
  component: MarketingComponent;
}) {
  const onGoto = useMarketingGoto();
  return <Page onGoto={onGoto} />;
}
