"use client";

import StudioShell from "@/components/studio/StudioShell";
import StudioAnalytics from "@/components/analytics/StudioAnalytics";

export default function StudioTrafficPage() {
  return (
    <StudioShell title="Traffic & analytics" subtitle="See who's visiting, where they come from, and what they read">
      <StudioAnalytics fullPage />
    </StudioShell>
  );
}
