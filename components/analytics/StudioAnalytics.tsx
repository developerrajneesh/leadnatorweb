"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiActivity,
  FiClock,
  FiEye,
  FiFileText,
  FiGlobe,
  FiLayers,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import type { AnalyticsSummary, PageStat } from "@/lib/analytics/types";
import { formatDuration } from "@/lib/analytics/format";
import TrafficAreaChart from "@/components/analytics/charts/TrafficAreaChart";
import PlatformDonutChart from "@/components/analytics/charts/PlatformDonutChart";
import PlatformBarsChart from "@/components/analytics/charts/PlatformBarsChart";
import PlatformSourcesTable from "@/components/analytics/charts/PlatformSourcesTable";

const KNOWN_PLATFORM_COLORS: Record<string, string> = {
  Direct: "#64748b",
  Google: "#4285f4",
  Instagram: "#e1306c",
  Facebook: "#1877f2",
  WhatsApp: "#25d366",
  LinkedIn: "#0a66c2",
  YouTube: "#ff0000",
  Twitter: "#1da1f2",
  TikTok: "#010101",
  Telegram: "#0088cc",
  Email: "#f59e0b",
  Social: "#8b5cf6",
  Other: "#94a3b8",
};

const KNOWN_PLATFORM_ICONS: Record<string, string> = {
  Google: "G",
  Instagram: "IG",
  Facebook: "f",
  WhatsApp: "WA",
  LinkedIn: "in",
  YouTube: "YT",
  Twitter: "X",
  TikTok: "TT",
  Telegram: "TG",
  Email: "@",
  Direct: "→",
  Social: "SM",
  Other: "•",
};

function platformColor(name: string): string {
  if (KNOWN_PLATFORM_COLORS[name]) return KNOWN_PLATFORM_COLORS[name];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 52%, 42%)`;
}

function platformIcon(name: string): string {
  if (KNOWN_PLATFORM_ICONS[name]) return KNOWN_PLATFORM_ICONS[name];
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase() || "•";
}

const PERIOD_OPTIONS = [
  { value: 7, label: "7 days" },
  { value: 30, label: "30 days" },
  { value: 90, label: "90 days" },
] as const;

const METRICS: {
  key: keyof AnalyticsSummary;
  label: string;
  icon: typeof FiEye;
  accent: string;
  format?: "duration";
}[] = [
  { key: "totalViews", label: "Total page views", icon: FiEye, accent: "green" },
  { key: "uniqueVisitors", label: "Unique people", icon: FiUsers, accent: "blue" },
  { key: "viewsToday", label: "Visits today", icon: FiActivity, accent: "violet" },
  { key: "totalDurationSec", label: "Time on site", icon: FiClock, accent: "amber", format: "duration" },
  { key: "avgDurationSec", label: "Avg time per visit", icon: FiTrendingUp, accent: "teal", format: "duration" },
];

function metricValue(data: AnalyticsSummary, key: string, format?: string) {
  const raw = data[key as keyof AnalyticsSummary];
  if (format === "duration" && typeof raw === "number") return formatDuration(raw);
  if (typeof raw === "number") return raw.toLocaleString();
  return "—";
}

function PageStatsTable({
  title,
  description,
  rows,
  showTitle = true,
  icon: Icon,
}: {
  title: string;
  description?: string;
  rows: PageStat[];
  showTitle?: boolean;
  icon: typeof FiFileText;
}) {
  return (
    <div className="sa-card sa-card-table">
      <div className="sa-card-head">
        <div className="sa-card-head-icon">
          <Icon aria-hidden />
        </div>
        <div>
          <h3>{title}</h3>
          {description && <p>{description}</p>}
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="sa-empty-inline">No visits in this period — share links or try a wider date range.</p>
      ) : (
        <div className="sa-table-wrap">
          <table className="sa-table">
            <thead>
              <tr>
                <th>#</th>
                {showTitle ? <th>Page / article</th> : <th>Path</th>}
                <th>Opens</th>
                <th>Unique</th>
                <th>Reading time</th>
                <th>Avg stay</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.path}>
                  <td className="sa-rank">{i + 1}</td>
                  <td>
                    <div className="sa-page-cell">
                      {showTitle && row.title ? (
                        <strong>{row.title}</strong>
                      ) : (
                        <strong>{row.path}</strong>
                      )}
                      <span>{row.path}</span>
                    </div>
                  </td>
                  <td><span className="sa-num">{row.views.toLocaleString()}</span></td>
                  <td><span className="sa-num">{row.uniqueVisitors.toLocaleString()}</span></td>
                  <td><span className="sa-time">{formatDuration(row.totalDurationSec)}</span></td>
                  <td><span className="sa-time">{formatDuration(row.avgDurationSec)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function StudioAnalytics({ fullPage = false }: { fullPage?: boolean }) {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/studio/analytics?days=${days}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .finally(() => setLoading(false));
  }, [days]);

  const topSource = data?.byPlatform[0];
  const daySeries = data?.byDay ?? [];

  return (
    <div className={`sa ${fullPage ? "sa-full" : ""}`}>
      <header className="sa-hero" id="traffic">
        <div className="sa-hero-glow" aria-hidden />
        <div className="sa-hero-inner">
          <div className="sa-hero-copy">
            <span className="sa-hero-badge">
              <FiGlobe aria-hidden /> Real-time insights
            </span>
            <h2>Website traffic</h2>
            <p>
              Understand your audience — which pages they open, how long they read, and whether
              they came from Instagram, Google, WhatsApp, email or a direct visit.
            </p>
          </div>
          <ul className="sa-hero-points">
            <li><FiLayers aria-hidden /> Auto-detects source from campaign links &amp; referrers</li>
            <li><FiClock aria-hidden /> Measures time on each page and full visit</li>
            <li><FiFileText aria-hidden /> Breaks down performance per vlog &amp; landing page</li>
          </ul>
          <div className="sa-hero-actions">
            <div className="sa-period" role="group" aria-label="Date range">
              <span className="sa-period-label">Period</span>
              <div className="sa-period-options">
                {PERIOD_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    className={`sa-period-btn${days === value ? " active" : ""}`}
                    onClick={() => setDays(value)}
                    aria-pressed={days === value}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {!fullPage && (
              <Link href="/studio/traffic" className="sa-hero-link">
                Full report <FiTrendingUp aria-hidden />
              </Link>
            )}
          </div>
        </div>
      </header>

      {loading ? (
        <div className="sa-loading">
          <span className="sa-loading-dot" />
          Loading analytics…
        </div>
      ) : !data ? (
        <div className="sa-empty">Could not load analytics. Check your connection and try again.</div>
      ) : (
        <>
          <div className="sa-metrics">
            {METRICS.map(({ key, label, icon: Icon, accent, format }) => (
              <article key={key} className={`sa-metric sa-metric-${accent}`}>
                <span className="sa-metric-icon">
                  <Icon aria-hidden />
                </span>
                <div className="sa-metric-body">
                  <strong>{metricValue(data, key, format)}</strong>
                  <span>{label}</span>
                </div>
              </article>
            ))}
            <article className="sa-metric sa-metric-source">
              <span
                className="sa-metric-icon sa-metric-icon-source"
                style={{ background: topSource ? `${platformColor(topSource.platform)}22` : undefined }}
              >
                {topSource ? platformIcon(topSource.platform) : "—"}
              </span>
              <div className="sa-metric-body">
                <strong>{topSource?.platform || "—"}</strong>
                <span>Top traffic source {topSource ? `· ${topSource.pct}% of visits` : ""}</span>
              </div>
            </article>
          </div>

          {data.totalViews === 0 ? (
            <div className="sa-empty sa-empty-guide">
              <FiActivity aria-hidden />
              <h3>No traffic recorded yet</h3>
              <p>
                Share your site or vlog links on Instagram, WhatsApp or ads — add{" "}
                <code>?utm_source=instagram</code> to links for clearer source tracking.
                Browse a few pages, then refresh here. Time is saved when visitors leave a page.
              </p>
            </div>
          ) : (
            <div className="sa-charts">
              <div className="sa-card sa-card-chart-wide">
                <div className="sa-card-head">
                  <div className="sa-card-head-icon sa-card-head-icon-green">
                    <FiTrendingUp aria-hidden />
                  </div>
                  <div>
                    <h3>Views over time</h3>
                    <p>Daily trend — spot spikes from campaigns, new vlogs or seasonal traffic</p>
                  </div>
                </div>
                <TrafficAreaChart data={daySeries} rangeDays={days} />
              </div>

              <div className="sa-grid sa-grid-charts">
                <div className="sa-card">
                  <div className="sa-card-head">
                    <div className="sa-card-head-icon sa-card-head-icon-violet">
                      <FiLayers aria-hidden />
                    </div>
                    <div>
                      <h3>Traffic share</h3>
                      <p>Which channel wins — social, search, ads, direct or referral</p>
                    </div>
                  </div>
                  <PlatformDonutChart rows={data.byPlatform} colorFor={platformColor} />
                </div>

                <div className="sa-card">
                  <div className="sa-card-head">
                    <div className="sa-card-head-icon sa-card-head-icon-violet">
                      <FiUsers aria-hidden />
                    </div>
                    <div>
                      <h3>Total vs unique</h3>
                      <p>Repeat visits vs new people — see engagement depth per source</p>
                    </div>
                  </div>
                  <PlatformBarsChart rows={data.byPlatform} colorFor={platformColor} />
                </div>
              </div>

              <PlatformSourcesTable rows={data.byPlatform} colorFor={platformColor} />
            </div>
          )}

          {data.totalViews > 0 && (
            <section className="sa-section" id="blog-analytics">
              <div className="sa-section-head">
                <h2>Vlog / blog performance</h2>
                <p>Which articles get the most reads, unique visitors and reading time.</p>
              </div>
              <PageStatsTable
                title="All blog articles"
                description="Compare every post — opens, unique readers, and how long people stay on the page"
                rows={data.blogPosts}
                icon={FiFileText}
              />
            </section>
          )}

          {data.allPages.length > 0 && (
            <section className="sa-section" id="page-analytics">
              <div className="sa-section-head">
                <h2>All pages</h2>
                <p>Home, pricing, features, blog &amp; contact — full site performance in one place.</p>
              </div>
              <PageStatsTable
                title="Site-wide page stats"
                description="Every tracked URL ranked by views, unique visitors and time on page"
                rows={data.allPages}
                showTitle={false}
                icon={FiGlobe}
              />
            </section>
          )}
        </>
      )}
    </div>
  );
}
