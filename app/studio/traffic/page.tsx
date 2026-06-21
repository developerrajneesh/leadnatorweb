"use client";

import StudioShell from "@/components/studio/StudioShell";
import StudioAnalytics from "@/components/analytics/StudioAnalytics";

export default function StudioTrafficPage() {
  return (
    <StudioShell title="Traffic & analytics" subtitle="Instagram, Google, WhatsApp & more — live visitor insights">
      <StudioAnalytics fullPage />
    </StudioShell>
  );
}
