"use client";

import {
  buildDashboardCharts,
  SourceBarsChart,
  TopReadsChart,
  WeekViewsChart,
} from "@/components/studio/DashboardMiniCharts";
import type { AnalyticsSummary } from "@/lib/analytics/types";
import { FiActivity, FiShare2, FiUsers } from "react-icons/fi";

type Props = {
  analytics: AnalyticsSummary;
};

export default function DashboardSiteActivity({ analytics }: Props) {
  const topSource = analytics.byPlatform[0];
  const { vlogs } = buildDashboardCharts(analytics);

  return (
    <div className="sd-activity sd-activity-compact">
      <div className="sd-activity-metrics">
        <article className="sd-activity-metric">
          <span className="sd-dash-icon sd-dash-icon-green">
            <FiActivity aria-hidden strokeWidth={2.25} />
          </span>
          <div className="sd-activity-metric-copy">
            <strong>{analytics.viewsToday.toLocaleString()}</strong>
            <span>Views today</span>
          </div>
        </article>
        <article className="sd-activity-metric">
          <span className="sd-dash-icon sd-dash-icon-blue">
            <FiUsers aria-hidden strokeWidth={2.25} />
          </span>
          <div className="sd-activity-metric-copy">
            <strong>{analytics.uniqueVisitors.toLocaleString()}</strong>
            <span>Unique visitors · 30d</span>
          </div>
        </article>
        <article className="sd-activity-metric">
          <span className="sd-dash-icon sd-dash-icon-violet">
            <FiShare2 aria-hidden strokeWidth={2.25} />
          </span>
          <div className="sd-activity-metric-copy">
            <strong title={topSource?.platform}>{topSource?.platform || "—"}</strong>
            <span>{topSource?.pct ?? 0}% top source</span>
          </div>
        </article>
      </div>

      <div className="dm-grid">
        <WeekViewsChart byDay={analytics.byDay} />
        <SourceBarsChart rows={analytics.byPlatform} limit={4} />
        <TopReadsChart vlogs={vlogs} />
      </div>
    </div>
  );
}
