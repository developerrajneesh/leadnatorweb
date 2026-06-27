"use client";

import Link from "next/link";
import { FiBarChart2, FiFileText, FiLayers } from "react-icons/fi";
import { buildDaySeries } from "@/components/analytics/charts/TrafficAreaChart";
import { platformColor } from "@/lib/analytics/platform-colors";
import { ADMIN_ROUTES } from "@/lib/blog/admin-paths";
import type { AnalyticsSummary, PageStat, PlatformStat } from "@/lib/analytics/types";

function ChartHead({
  icon: Icon,
  label,
  extra,
}: {
  icon: typeof FiBarChart2;
  label: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="dm-chart-head">
      <span className="dm-chart-title">
        <span className="dm-chart-icon" aria-hidden>
          <Icon strokeWidth={2.25} />
        </span>
        {label}
      </span>
      {extra}
    </div>
  );
}

function dayShort(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "short" });
}

export function WeekViewsChart({ byDay }: { byDay: { date: string; count: number }[] }) {
  const series = buildDaySeries(byDay, 7);
  const max = Math.max(...series.map((d) => d.count), 1);
  const total = series.reduce((s, d) => s + d.count, 0);
  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <div className="dm-chart">
      <ChartHead
        icon={FiBarChart2}
        label="Daily views"
        extra={<strong>{total.toLocaleString()} · 7d</strong>}
      />
      <div className="dm-week" role="img" aria-label="Daily views for the last 7 days">
        {series.map((d) => {
          const isToday = d.date === todayIso;
          return (
            <div
              key={d.date}
              className={`dm-week-col${isToday ? " dm-week-col-today" : ""}`}
              title={`${dayShort(d.date)}: ${d.count} views`}
            >
              <span className="dm-week-val">{d.count > 0 ? d.count : ""}</span>
              <div className="dm-week-track">
                <span
                  style={{ height: `${d.count > 0 ? Math.max(10, (d.count / max) * 100) : 0}%` }}
                />
              </div>
              <span className="dm-week-day">{isToday ? "Today" : dayShort(d.date)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SourceBarsChart({ rows, limit = 4 }: { rows: PlatformStat[]; limit?: number }) {
  const top = rows.slice(0, limit);
  const max = Math.max(...top.map((r) => r.views), 1);

  if (!top.length) {
    return <p className="dm-empty">No source data yet.</p>;
  }

  return (
    <div className="dm-chart">
      <ChartHead icon={FiLayers} label="Traffic sources" />
      <ul className="dm-sources">
        {top.map((row) => {
          const color = platformColor(row.platform);
          return (
          <li key={row.platform} title={`${row.platform}: ${row.views} views (${row.pct}%)`}>
            <span className="dm-sources-name">
              <span className="dm-sources-dot" style={{ background: color }} aria-hidden />
              {row.platform}
            </span>
            <div className="dm-sources-track">
              <span
                style={{
                  width: `${Math.max(6, (row.views / max) * 100)}%`,
                  background: color,
                }}
              />
            </div>
            <span className="dm-sources-meta">{row.pct}%</span>
          </li>
          );
        })}
      </ul>
    </div>
  );
}

export function TopReadsChart({
  vlogs,
  allHref = `${ADMIN_ROUTES.traffic}#blog-analytics`,
}: {
  vlogs: PageStat[];
  allHref?: string;
}) {
  const max = Math.max(...vlogs.map((v) => v.views), 1);

  if (!vlogs.length) {
    return <p className="dm-empty">No vlog views yet.</p>;
  }

  return (
    <div className="dm-chart">
      <ChartHead
        icon={FiFileText}
        label="Top reads"
        extra={<Link href={allHref} className="sd-home-panel-link">All</Link>}
      />
      <ul className="dm-reads">
        {vlogs.map((v, i) => (
          <li key={v.path}>
            <span className="dm-reads-rank">{i + 1}</span>
            <div className="dm-reads-body">
              <p title={v.title}>{v.title || v.path}</p>
              <div className="dm-reads-track" aria-hidden>
                <span style={{ width: `${Math.max(8, (v.views / max) * 100)}%` }} />
              </div>
            </div>
            <strong>{v.views}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function buildDashboardCharts(analytics: AnalyticsSummary) {
  const vlogs = analytics.blogPosts
    .filter((p) => p.path.startsWith("/blog/") && p.path !== "/blog" && p.views > 0)
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  return { vlogs };
}
