"use client";

import Link from "next/link";
import { FiActivity, FiArrowRight, FiGlobe, FiTrendingUp, FiUsers } from "react-icons/fi";
import TrafficAreaChart, { buildDaySeries } from "@/components/analytics/charts/TrafficAreaChart";
import PlatformDonutChart from "@/components/analytics/charts/PlatformDonutChart";
import { platformColor } from "@/lib/analytics/platform-colors";
import type { AnalyticsSummary } from "@/lib/analytics/types";
import { ADMIN_ROUTES } from "@/lib/blog/admin-paths";

type Props = {
  analytics: AnalyticsSummary | null;
  loading: boolean;
  error?: "unauthorized" | "failed" | null;
};

function dayLabel(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "short" });
}

export default function DashboardTrafficPanel({ analytics, loading, error }: Props) {
  const weekSeries = analytics ? buildDaySeries(analytics.byDay, 7) : [];
  const maxWeek = Math.max(...weekSeries.map((d) => d.count), 1);
  const weekTotal = weekSeries.reduce((s, d) => s + d.count, 0);
  const topSource = analytics?.byPlatform[0];

  return (
    <section className="sd-traffic">
      <div className="sd-traffic-head">
        <div className="sd-traffic-copy">
          <span className="sd-traffic-eyebrow">
            <FiGlobe aria-hidden /> Site visitors
          </span>
          <h3>Website traffic</h3>
          <p>Daily views, visitor sources and weekly trends — last 30 days</p>
        </div>
        <Link href={ADMIN_ROUTES.traffic} className="ln-btn ln-btn-outline sd-traffic-cta">
          Full report <FiArrowRight aria-hidden />
        </Link>
      </div>

      {loading ? (
        <p className="sd-traffic-state">Loading graph data…</p>
      ) : error === "unauthorized" ? (
        <p className="sd-traffic-state sd-traffic-state-warn">
          Sign in again to view traffic graphs.
        </p>
      ) : error === "failed" || !analytics ? (
        <p className="sd-traffic-state sd-traffic-state-warn">
          Could not load traffic graphs. Refresh the page or open the visitor report.
        </p>
      ) : analytics.totalViews === 0 ? (
        <div className="sd-traffic-empty">
          <FiActivity aria-hidden />
          <div>
            <strong>No visitor data yet</strong>
            <p>Share your site or open a few public pages — graphs will fill in within minutes.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="sd-traffic-stats">
            <article className="sd-traffic-stat sd-traffic-stat-main">
              <FiTrendingUp aria-hidden />
              <div>
                <strong>{analytics.totalViews.toLocaleString()}</strong>
                <span>Page views · 30 days</span>
              </div>
            </article>
            <article className="sd-traffic-stat">
              <FiUsers aria-hidden />
              <div>
                <strong>{analytics.uniqueVisitors.toLocaleString()}</strong>
                <span>Unique visitors</span>
              </div>
            </article>
            <article className="sd-traffic-stat">
              <FiActivity aria-hidden />
              <div>
                <strong>{analytics.viewsToday.toLocaleString()}</strong>
                <span>Views today</span>
              </div>
            </article>
            <article className="sd-traffic-stat">
              <span className="sd-traffic-source-dot" aria-hidden />
              <div>
                <strong>{topSource?.platform || "—"}</strong>
                <span>Top source{topSource ? ` · ${topSource.pct}%` : ""}</span>
              </div>
            </article>
          </div>

          <div className="sd-traffic-graph sd-traffic-graph-wide">
            <div className="sd-traffic-graph-head">
              <h4>Daily page views</h4>
              <span>Last {analytics.rangeDays} days</span>
            </div>
            <TrafficAreaChart data={analytics.byDay} rangeDays={analytics.rangeDays} />
          </div>

          <div className="sd-traffic-graph-row">
            <div className="sd-traffic-graph">
              <div className="sd-traffic-graph-head">
                <h4>Visitor sources</h4>
                <span>Where traffic comes from</span>
              </div>
              <PlatformDonutChart rows={analytics.byPlatform} colorFor={platformColor} />
            </div>

            <div className="sd-traffic-graph">
              <div className="sd-traffic-graph-head">
                <h4>Last 7 days</h4>
                <span>{weekTotal.toLocaleString()} views this week</span>
              </div>
              <div className="sd-traffic-week-chart" role="img" aria-label="Daily views for the last 7 days">
                {weekSeries.map((d) => (
                  <div key={d.date} className="sd-traffic-day" title={`${dayLabel(d.date)}: ${d.count} views`}>
                    <span className="sd-traffic-day-value">{d.count > 0 ? d.count : ""}</span>
                    <div className="sd-traffic-day-track">
                      <div
                        className="sd-traffic-day-fill"
                        style={{ height: `${d.count > 0 ? Math.max(10, (d.count / maxWeek) * 100) : 0}%` }}
                      />
                    </div>
                    <span className="sd-traffic-day-label">{dayLabel(d.date)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
