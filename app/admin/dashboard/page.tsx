"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FiArrowRight, FiBarChart2, FiEdit3, FiEye, FiList, FiPlus, FiUsers,
} from "react-icons/fi";
import { ADMIN_ROUTES } from "@/lib/blog/admin-paths";
import DashboardSiteActivity from "@/components/studio/DashboardSiteActivity";
import StudioShell from "@/components/studio/StudioShell";
import type { AnalyticsSummary } from "@/lib/analytics/types";
import type { BlogPostSummary } from "@/lib/blog/types";

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function StudioDashboard() {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/studio/posts").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/studio/analytics?days=30").then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([postList, analyticsData]) => {
        setPosts(postList);
        setAnalytics(analyticsData);
      })
      .catch(() => {
        setPosts([]);
        setAnalytics(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;

  const recentPosts = useMemo(
    () =>
      [...posts]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5),
    [posts],
  );

  return (
    <StudioShell title="Dashboard">
      <div className="studio-welcome sd-home-welcome">
        <div className="studio-welcome-copy">
          <span className="studio-welcome-badge">All in One CRM</span>
          <h2>Welcome back!</h2>
          <p>
            Write vlogs, track visitors and manage leads — everything you need at a glance.
          </p>
        </div>
        <div className="studio-welcome-actions">
          <Link href={ADMIN_ROUTES.newPost} className="ln-btn ln-btn-primary">
            <FiPlus aria-hidden /> Write vlog
          </Link>
          <Link href={ADMIN_ROUTES.vlogs} className="ln-btn ln-btn-outline">
            <FiList aria-hidden /> All vlogs
          </Link>
          <Link href={ADMIN_ROUTES.traffic} className="ln-btn ln-btn-outline">
            <FiBarChart2 aria-hidden /> Visitors
          </Link>
        </div>
      </div>

      <div className="studio-stats studio-stats-4 sd-home-stats">
        <div className="studio-stat">
          <strong>{posts.length}</strong>
          <span>Total vlogs</span>
        </div>
        <div className="studio-stat">
          <strong>{published}</strong>
          <span>Published</span>
        </div>
        <div className="studio-stat">
          <strong>{drafts}</strong>
          <span>Drafts</span>
        </div>
        <div className="studio-stat">
          <strong>{analytics ? analytics.totalViews.toLocaleString() : "—"}</strong>
          <span>Site views · 30d</span>
        </div>
      </div>

      <section className="sd-home-panel sd-home-panel-wide">
        <div className="sd-home-panel-head">
          <div>
            <h3>Recent vlogs</h3>
            <p>Latest updates — edit or publish from here</p>
          </div>
          <Link href={ADMIN_ROUTES.vlogs} className="sd-home-panel-link">View all</Link>
        </div>

        {loading ? (
          <p className="sd-home-panel-empty">Loading vlogs…</p>
        ) : recentPosts.length === 0 ? (
          <div className="sd-home-panel-empty">
            <p>No vlogs yet.</p>
            <Link href={ADMIN_ROUTES.newPost} className="ln-btn ln-btn-primary ln-btn-sm">
              <FiPlus aria-hidden /> Write your first vlog
            </Link>
          </div>
        ) : (
          <ul className="sd-home-recent">
            {recentPosts.map((post) => (
              <li key={post.id}>
                <div className="sd-home-recent-main">
                  <strong title={post.title}>{post.title}</strong>
                  <span className="sd-home-recent-meta">
                    Updated {formatDate(post.updatedAt)}
                  </span>
                </div>
                <span className={`studio-status studio-status-${post.status}`}>{post.status}</span>
                <div className="sd-home-recent-actions">
                  {post.status === "published" && (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="studio-icon-btn"
                      title="View on blog"
                    >
                      <FiEye aria-hidden strokeWidth={2.25} />
                    </Link>
                  )}
                  <Link
                    href={ADMIN_ROUTES.editPost(post.id)}
                    className="studio-icon-btn"
                    title="Edit vlog"
                  >
                      <FiEdit3 aria-hidden strokeWidth={2.25} />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="sd-home-panel sd-home-panel-wide">
        <div className="sd-home-panel-head">
          <div>
            <h3>Site activity</h3>
            <p>Compact charts — full analytics on the traffic page</p>
          </div>
          <Link href={ADMIN_ROUTES.traffic} className="sd-home-panel-link">Full report</Link>
        </div>

        {loading ? (
          <p className="sd-home-panel-empty">Loading stats…</p>
        ) : !analytics || analytics.totalViews === 0 ? (
          <div className="sd-home-panel-empty">
            <p>No visitor data yet. Share your site — stats will show up here.</p>
            <Link href={ADMIN_ROUTES.traffic} className="ln-btn ln-btn-outline ln-btn-sm">
              Open analytics
            </Link>
          </div>
        ) : (
          <DashboardSiteActivity analytics={analytics} />
        )}
      </section>

      <div className="sd-home-links">
        <Link href={ADMIN_ROUTES.vlogs} className="sd-home-link">
          <span className="sd-dash-icon sd-dash-icon-green">
            <FiList aria-hidden strokeWidth={2.25} />
          </span>
          <span className="sd-home-link-copy">
            <strong>All vlogs</strong>
            <span>Manage every article</span>
          </span>
          <FiArrowRight className="sd-home-link-arrow" aria-hidden strokeWidth={2.25} />
        </Link>

        <Link href={ADMIN_ROUTES.leads} className="sd-home-link">
          <span className="sd-dash-icon sd-dash-icon-blue">
            <FiUsers aria-hidden strokeWidth={2.25} />
          </span>
          <span className="sd-home-link-copy">
            <strong>Your leads</strong>
            <span>Contact form messages</span>
          </span>
          <FiArrowRight className="sd-home-link-arrow" aria-hidden strokeWidth={2.25} />
        </Link>

        <Link href={ADMIN_ROUTES.newPost} className="sd-home-link">
          <span className="sd-dash-icon sd-dash-icon-violet">
            <FiEdit3 aria-hidden strokeWidth={2.25} />
          </span>
          <span className="sd-home-link-copy">
            <strong>New vlog</strong>
            <span>Start writing an article</span>
          </span>
          <FiArrowRight className="sd-home-link-arrow" aria-hidden strokeWidth={2.25} />
        </Link>
      </div>
    </StudioShell>
  );
}
