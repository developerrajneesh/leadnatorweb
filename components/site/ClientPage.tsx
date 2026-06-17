"use client";

import type { ComponentType } from "react";
import { useSiteNav } from "./useSiteNav";

type MarketingComponent = ComponentType<{ onGoto: (path: string) => void }>;

export default function ClientPage({
  component: Page,
}: {
  component: MarketingComponent;
}) {
  const onGoto = useSiteNav();
  return <Page onGoto={onGoto} />;
}
