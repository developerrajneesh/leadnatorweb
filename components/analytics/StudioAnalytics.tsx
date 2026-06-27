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
import { ADMIN_ROUTES } from "@/lib/blog/admin-paths";
import { formatDuration } from "@/lib/analytics/format";
import { pageKindLabel, resolvePageKind, resolvePageLabel } from "@/lib/analytics/page-labels";
import TrafficAreaChart from "@/components/analytics/charts/TrafficAreaChart";
import PlatformDonutChart from "@/components/analytics/charts/PlatformDonutChart";
import PlatformBarsChart from "@/components/analytics/charts/PlatformBarsChart";
import PlatformSourcesTable from "@/components/analytics/charts/PlatformSourcesTable";
import { platformColor } from "@/lib/analytics/platform-colors";

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
  { key: "totalViews", label: "Page views", icon: FiEye, accent: "green" },
  { key: "uniqueVisitors", label: "Unique visitors", icon: FiUsers, accent: "blue" },
  { key: "viewsToday", label: "Today's visits", icon: FiActivity, accent: "violet" },
  { key: "totalDurationSec", label: "Total reading time", icon: FiClock, accent: "amber", format: "duration" },
  { key: "avgDurationSec", label: "Avg. time per visit", icon: FiTrendingUp, accent: "teal", format: "duration" },
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
  icon: Icon,
}: {
  title: string;
  description?: string;
  rows: PageStat[];
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
        <p className="sa-empty-inline">Nothing here for this time range yet — try sharing your links or pick a longer period.</p>
      ) : (
        <div className="sa-table-wrap">
          <table className="sa-table sa-table-pages">
            <thead>
              <tr>
                <th>#</th>
                <th>Page name</th>
                <th>Views</th>
                <th>Visitors</th>
                <th>Time spent</th>
                <th>Avg. stay</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const name = row.title || resolvePageLabel(row.path);
                const kind = resolvePageKind(row.path);
                return (
                  <tr key={row.path}>
                    <td className="sa-rank">{i + 1}</td>
                    <td>
                      <div className="sa-page-name">
                        <span className={`sa-page-kind sa-page-kind-${kind}`}>
                          {pageKindLabel(kind)}
                        </span>
                        <span className="sa-page-name-text" title={name}>
                          {name}
                        </span>
                      </div>
                    </td>
                    <td><span className="sa-num">{row.views.toLocaleString()}</span></td>
                    <td><span className="sa-num">{row.uniqueVisitors.toLocaleString()}</span></td>
                    <td><span className="sa-time">{formatDuration(row.totalDurationSec)}</span></td>
                    <td><span className="sa-time">{formatDuration(row.avgDurationSec)}</span></td>
                  </tr>
                );
              })}
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
              <FiGlobe aria-hidden /> Live updates
            </span>
            <h2>Your visitors</h2>
            <p>
              See who's coming to your site, how long they stay, and whether they found you
              on Instagram, Google, WhatsApp, or somewhere else.
            </p>
          </div>
          <ul className="sa-hero-points">
            <li><FiLayers aria-hidden /> We figure out where visitors came from — automatically</li>
            <li><FiClock aria-hidden /> Track how long people spend on each page</li>
            <li><FiFileText aria-hidden /> See which vlogs and pages perform best</li>
          </ul>
          <div className="sa-hero-actions">
            <div className="sa-period" role="group" aria-label="Time range">
              <span className="sa-period-label">Show data for</span>
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
              <Link href={ADMIN_ROUTES.traffic} className="sa-hero-link">
                See full report <FiTrendingUp aria-hidden />
              </Link>
            )}
          </div>
        </div>
      </header>

      {loading ? (
        <div className="sa-loading">
          <span className="sa-loading-dot" />
          Loading your stats…
        </div>
      ) : !data ? (
        <div className="sa-empty">We couldn't load your stats right now. Check your connection and try again.</div>
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
                <span>Top source {topSource ? `· ${topSource.pct}% of visits` : ""}</span>
              </div>
            </article>
          </div>

          {data.totalViews === 0 ? (
            <div className="sa-empty sa-empty-guide">
              <FiActivity aria-hidden />
              <h3>No visitors yet</h3>
              <p>
                Share your site on Instagram, WhatsApp or anywhere else — then come back here to see the results.
                Open a few pages yourself to test it out, then hit refresh.
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
                    <p>Watch your daily visits grow — great for spotting busy days and new campaigns</p>
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
                      <h3>Where visitors come from</h3>
                      <p>Instagram, Google, WhatsApp, direct visits — see what brings people in</p>
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
                      <h3>New vs returning</h3>
                      <p>See who's coming back and who's visiting for the first time</p>
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
                <h2>How your articles are doing</h2>
                <p>Find out which vlogs people love reading — and how long they stick around.</p>
              </div>
              <PageStatsTable
                title="All your articles"
                description="Every blog post ranked by views, readers and reading time"
                rows={data.blogPosts}
                icon={FiFileText}
              />
            </section>
          )}

          {data.allPages.length > 0 && (
            <section className="sa-section" id="page-analytics">
              <div className="sa-section-head">
                <h2>Every page on your site</h2>
                <p>Home, pricing, blog, contact — see how each page is performing.</p>
              </div>
              <PageStatsTable
                title="All pages"
                description="Your full site at a glance — views, visitors and time spent"
                rows={data.allPages}
                icon={FiGlobe}
              />
            </section>
          )}
        </>
      )}
    </div>
  );
}
