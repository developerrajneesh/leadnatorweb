"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ADMIN_ROUTES } from "@/lib/blog/admin-paths";
import DashboardTrafficPanel from "@/components/studio/DashboardTrafficPanel";
import type { AnalyticsSummary } from "@/lib/analytics/types";
import type { BlogPostSummary } from "@/lib/blog/types";

function buildMonthlyPublished(posts: BlogPostSummary[], months = 6) {
  const buckets: { label: string; count: number; key: string }[] = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
    buckets.push({ label, count: 0, key });
  }

  for (const post of posts) {
    if (post.status !== "published") continue;
    const d = new Date(post.publishedAt || post.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const bucket = buckets.find((b) => b.key === key);
    if (bucket) bucket.count += 1;
  }

  return buckets;
}

function vlogSlugFromPath(path: string): string | undefined {
  const slug = path.replace(/^\/blog\//, "").split(/[?#]/)[0];
  return slug || undefined;
}

function buildVlogViewRows(
  analytics: AnalyticsSummary | null,
  posts: BlogPostSummary[],
): { path: string; title?: string; slug?: string; views: number }[] {
  const titleBySlug = new Map(
    posts.filter((p) => p.status === "published").map((p) => [p.slug, p.title] as const),
  );

  const fromAnalytics = (analytics?.blogPosts ?? [])
    .filter((p) => p.path.startsWith("/blog/") && p.path !== "/blog")
    .map((p) => {
      const slug = p.slug || vlogSlugFromPath(p.path);
      return {
        path: p.path,
        slug,
        title: p.title || (slug ? titleBySlug.get(slug) : undefined),
        views: p.views,
      };
    });

  if (fromAnalytics.length > 0) {
    return [...fromAnalytics].sort((a, b) => b.views - a.views).slice(0, 5);
  }

  return posts
    .filter((p) => p.status === "published")
    .slice(0, 5)
    .map((p) => ({
      path: `/blog/${p.slug}`,
      slug: p.slug,
      title: p.title,
      views: 0,
    }));
}

function shortVlogLabel(title?: string, maxLen = 14): string {
  if (!title) return "—";
  const words = title.trim().split(/\s+/);
  let label = words.slice(0, 2).join(" ");
  if (label.length > maxLen) label = `${label.slice(0, maxLen - 1)}…`;
  else if (words.length > 2) label += "…";
  return label;
}

export default function VlogsDashboardCharts({ posts }: { posts: BlogPostSummary[] }) {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState<"unauthorized" | "failed" | null>(null);

  useEffect(() => {
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    fetch("/api/studio/analytics?days=30")
      .then((r) => {
        if (r.status === 401) {
          setAnalyticsError("unauthorized");
          return null;
        }
        if (!r.ok) {
          setAnalyticsError("failed");
          return null;
        }
        return r.json();
      })
      .then(setAnalytics)
      .catch(() => {
        setAnalytics(null);
        setAnalyticsError("failed");
      })
      .finally(() => setAnalyticsLoading(false));
  }, []);

  const monthly = useMemo(() => buildMonthlyPublished(posts), [posts]);
  const maxMonthly = Math.max(...monthly.map((m) => m.count), 1);

  const vlogViews = useMemo(() => {
    const rows = buildVlogViewRows(analytics, posts);
    const withViews = rows.filter((v) => v.views > 0);
    return withViews.length > 0 ? withViews : rows;
  }, [analytics, posts]);

  const hasViewData = vlogViews.some((v) => v.views > 0);

  const maxVlogViews = Math.max(...vlogViews.map((v) => v.views), 1);
  const totalVlogViews = useMemo(() => {
    if (!analytics?.blogPosts) {
      return vlogViews.reduce((s, v) => s + v.views, 0);
    }
    return analytics.blogPosts
      .filter((p) => p.path.startsWith("/blog/") && p.path !== "/blog")
      .reduce((s, p) => s + p.views, 0);
  }, [analytics, vlogViews]);
  const topVlogViews = hasViewData ? vlogViews.filter((v) => v.views > 0) : vlogViews;

  return (
    <div className="sd-charts">
      <div className="sd-chart-card">
        <div className="sd-chart-head">
          <div>
            <h3>Published vlogs</h3>
            <p>How many vlogs you published each month</p>
          </div>
          <span className="sd-chart-badge">{posts.filter((p) => p.status === "published").length} live</span>
        </div>
        <div className="sd-bar-chart" role="img" aria-label="Monthly published vlogs bar chart">
          {monthly.map((m) => (
            <div key={m.key} className="sd-bar-col">
              <div className="sd-bar-track">
                <div
                  className="sd-bar-fill"
                  style={{ height: `${Math.max(4, (m.count / maxMonthly) * 100)}%` }}
                  title={`${m.count} vlog${m.count === 1 ? "" : "s"}`}
                />
              </div>
              <span className="sd-bar-value">{m.count}</span>
              <span className="sd-bar-label">{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sd-chart-card">
        <div className="sd-chart-head">
          <div>
            <h3>Vlog views</h3>
            <p>Top 5 articles · last 30 days</p>
          </div>
          {hasViewData && (
            <span className="sd-chart-badge">{totalVlogViews.toLocaleString()} views</span>
          )}
        </div>
        {topVlogViews.length === 0 ? (
          <p className="sd-chart-empty">
            No published vlogs yet. Publish a vlog and share it — views will show up here.
          </p>
        ) : !hasViewData ? (
          <p className="sd-chart-empty">
            No views in the last 30 days yet. Share a vlog link to start tracking reads.
          </p>
        ) : (
          <div
            className="sd-vlog-bar-chart"
            role="img"
            aria-label="Top vlog views bar chart for the last 30 days"
          >
            {topVlogViews.map((v) => (
              <div
                key={v.path}
                className="sd-vlog-bar-col"
                title={v.title || v.slug}
              >
                <span className="sd-vlog-bar-value">{v.views}</span>
                <div className="sd-vlog-bar-track">
                  <div
                    className="sd-vlog-bar-fill"
                    style={{ height: `${Math.max(8, (v.views / maxVlogViews) * 100)}%` }}
                  />
                </div>
                <span className="sd-vlog-bar-label">{shortVlogLabel(v.title || v.slug)}</span>
              </div>
            ))}
          </div>
        )}
        {hasViewData && (
          <Link href={`${ADMIN_ROUTES.traffic}#blog-analytics`} className="sd-chart-foot-link">
            Full article stats →
          </Link>
        )}
      </div>

      <DashboardTrafficPanel
        analytics={analytics}
        loading={analyticsLoading}
        error={analyticsError}
      />
    </div>
  );
}
