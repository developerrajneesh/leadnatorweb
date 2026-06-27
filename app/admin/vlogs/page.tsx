"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiChevronLeft, FiChevronRight, FiEdit3, FiExternalLink, FiEye, FiFileText, FiGlobe,
  FiImage, FiPlus, FiRefreshCw, FiSearch, FiTrash2,
} from "react-icons/fi";
import { ADMIN_ROUTES } from "@/lib/blog/admin-paths";
import StudioShell from "@/components/studio/StudioShell";
import { shouldUnoptimizeImage } from "@/lib/blog/media";
import type { BlogPostSummary, PaginatedPosts, PostStatus } from "@/lib/blog/types";

const PAGE_SIZE = 10;

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

type StatusFilter = PostStatus | "all";

type VlogStats = { total: number; published: number; drafts: number };

export default function StudioVlogsPage() {
  const [data, setData] = useState<PaginatedPosts | null>(null);
  const [stats, setStats] = useState<VlogStats>({ total: 0, published: 0, drafts: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  const loadStats = useCallback(() => {
    fetch("/api/studio/posts")
      .then((r) => (r.ok ? r.json() : []))
      .then((posts: BlogPostSummary[]) => {
        setStats({
          total: posts.length,
          published: posts.filter((p) => p.status === "published").length,
          drafts: posts.filter((p) => p.status === "draft").length,
        });
      })
      .catch(() => setStats({ total: 0, published: 0, drafts: 0 }));
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: String(PAGE_SIZE),
      status,
    });
    if (query) params.set("q", query);

    fetch(`/api/studio/posts?${params}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => setData(json))
      .finally(() => setLoading(false));
  }, [page, status, query]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    load();
  }, [load]);

  function applySearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setQuery(search.trim());
  }

  function clearSearch() {
    setSearch("");
    setQuery("");
    setPage(1);
  }

  async function remove(id: string) {
    if (!confirm("Delete this vlog? You won't be able to get it back.")) return;
    const res = await fetch(`/api/studio/posts/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    loadStats();
    if (data && data.items.length === 1 && page > 1) {
      setPage((p) => p - 1);
    } else {
      load();
    }
  }

  function refreshAll() {
    loadStats();
    load();
  }

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;
  const showingFrom = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(page * PAGE_SIZE, total);

  return (
    <StudioShell
      title="All vlogs"
      subtitle="Your full content library — search, filter, preview and edit every article"
    >
      <header className="sv-hero">
        <div className="sv-hero-grid">
          <div className="sv-hero-copy">
            <span className="sv-hero-eyebrow">
              <FiFileText aria-hidden /> Content library
            </span>
            <h2 className="sv-hero-title">All your vlogs</h2>
            <p className="sv-hero-lead">
              One place for every article you&apos;ve written. Find a post quickly, open it on the
              public blog, or jump into the editor — published and drafts together.
            </p>
          </div>

          <div className="sv-hero-actions">
            <Link href={ADMIN_ROUTES.newPost} className="ln-btn ln-btn-primary">
              <FiPlus aria-hidden /> Write new vlog
            </Link>
            <button type="button" className="ln-btn ln-btn-outline" onClick={refreshAll} disabled={loading}>
              <FiRefreshCw aria-hidden /> Refresh
            </button>
            <Link href="/blog" target="_blank" rel="noopener noreferrer" className="ln-btn ln-btn-ghost sv-hero-ghost">
              <FiGlobe aria-hidden /> Open blog
            </Link>
          </div>
        </div>

        <div className="sv-hero-stats" aria-label="Vlog counts">
          <div className="sv-stat">
            <strong>{stats.total}</strong>
            <span>Total vlogs</span>
          </div>
          <div className="sv-stat sv-stat-published">
            <strong>{stats.published}</strong>
            <span>Published</span>
          </div>
          <div className="sv-stat sv-stat-draft">
            <strong>{stats.drafts}</strong>
            <span>Drafts</span>
          </div>
          {total > 0 && (
            <div className="sv-stat sv-stat-muted">
              <strong>{showingFrom}–{showingTo}</strong>
              <span>Showing now</span>
            </div>
          )}
        </div>
      </header>

      <div className="sv-toolbar-card">
        <form className="sv-search" onSubmit={applySearch}>
          <FiSearch aria-hidden />
          <input
            type="search"
            placeholder="Search by title, URL slug, or excerpt…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search vlogs"
          />
          <button type="submit" className="ln-btn ln-btn-primary ln-btn-sm">Search</button>
          {query && (
            <button type="button" className="ln-btn ln-btn-ghost ln-btn-sm" onClick={clearSearch}>
              Clear
            </button>
          )}
        </form>

        <div className="sv-toolbar-meta">
          <p className="sv-result-line">
            {loading ? (
              "Loading…"
            ) : query ? (
              <>
                <strong>{total}</strong> result{total === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
              </>
            ) : status === "all" ? (
              <>
                <strong>{total}</strong> vlog{total === 1 ? "" : "s"} in your library
              </>
            ) : (
              <>
                <strong>{total}</strong> {status} vlog{total === 1 ? "" : "s"}
              </>
            )}
          </p>
          <div className="sv-filters" role="tablist" aria-label="Filter by status">
            {(["all", "published", "draft"] as const).map((s) => (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={status === s}
                className={status === s ? "active" : ""}
                onClick={() => { setStatus(s); setPage(1); }}
              >
                {s === "all" ? "All" : s === "published" ? "Published" : "Drafts"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <p className="studio-loading">Loading your vlogs…</p>
      ) : items.length === 0 ? (
        <div className="studio-empty">
          <h2>{query ? "No vlogs match your search" : status !== "all" ? `No ${status} vlogs yet` : "No vlogs yet"}</h2>
          <p>
            {query
              ? "Try another keyword or clear the search to see everything again."
              : status !== "all"
                ? `Switch to All or write a new vlog and save it as ${status}.`
                : "Your first article goes live here once you write and publish it."}
          </p>
          {!query && (
            <Link href={ADMIN_ROUTES.newPost} className="ln-btn ln-btn-primary ln-btn-lg">
              <FiPlus aria-hidden /> Write your first vlog
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="sl-table-wrap sv-table-wrap">
            <table className="sl-table sv-table">
              <thead>
                <tr>
                  <th aria-label="Cover" />
                  <th>Title</th>
                  <th>Status</th>
                  <th>Last updated</th>
                  <th>Public URL</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {items.map((post) => (
                  <tr key={post.id}>
                    <td className="sv-thumb-cell">
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt=""
                          width={64}
                          height={42}
                          className="sv-thumb"
                          unoptimized={shouldUnoptimizeImage(post.coverImage)}
                        />
                      ) : (
                        <span className="sv-thumb-empty" aria-hidden><FiImage /></span>
                      )}
                    </td>
                    <td className="sv-title-cell">
                      <strong>{post.title}</strong>
                      {post.excerpt && <span className="sv-excerpt">{post.excerpt}</span>}
                    </td>
                    <td>
                      <span className={`studio-status studio-status-${post.status}`}>{post.status}</span>
                    </td>
                    <td className="sl-date">{formatDate(post.updatedAt)}</td>
                    <td className="sv-slug-cell">/blog/{post.slug}</td>
                    <td className="sl-actions">
                      <div className="sv-row-actions">
                        {post.status === "published" && (
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="studio-icon-btn"
                            title="View on blog"
                          >
                            <FiExternalLink aria-hidden />
                          </Link>
                        )}
                        <Link
                          href={ADMIN_ROUTES.editPost(post.id)}
                          className="studio-icon-btn"
                          title="Edit vlog"
                        >
                          <FiEdit3 aria-hidden />
                        </Link>
                        <button
                          type="button"
                          className="studio-icon-btn danger"
                          onClick={() => remove(post.id)}
                          title="Delete vlog"
                          aria-label={`Delete ${post.title}`}
                        >
                          <FiTrash2 aria-hidden />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <nav className="sv-pagination" aria-label="Vlog pages">
              <button
                type="button"
                className="sv-page-btn"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <FiChevronLeft aria-hidden /> Previous
              </button>
              <span className="sv-page-info">
                Page {page} of {totalPages}
                <small>{total} vlog{total === 1 ? "" : "s"} total</small>
              </span>
              <button
                type="button"
                className="sv-page-btn"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next <FiChevronRight aria-hidden />
              </button>
            </nav>
          )}
        </>
      )}
    </StudioShell>
  );
}
