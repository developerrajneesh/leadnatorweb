"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiArrowLeft, FiBarChart2, FiEdit3, FiExternalLink, FiEye, FiImage, FiPlus, FiTrash2,
} from "react-icons/fi";
import StudioShell from "@/components/studio/StudioShell";
import { EXIT_SITE_LABEL, EXIT_SITE_URL } from "@/lib/blog/nav";
import { shouldUnoptimizeImage } from "@/lib/blog/media";
import type { BlogPostSummary } from "@/lib/blog/types";

export default function StudioDashboard() {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/studio/posts")
      .then((r) => r.json())
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this post permanently?")) return;
    await fetch(`/api/studio/posts/${id}`, { method: "DELETE" });
    setPosts((p) => p.filter((x) => x.id !== id));
  }

  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;

  return (
    <StudioShell title="Studio Dashboard">
      <div className="studio-welcome">
        <div className="studio-welcome-copy">
          <span className="studio-welcome-badge">All in One CRM</span>
          <h2>Website &amp; blog control panel</h2>
          <p>
            Publish vlogs, track real visitors, and see which channels — Instagram, Google,
            WhatsApp or ads — actually bring people to your site.
          </p>
        </div>
        <div className="studio-welcome-actions">
          <Link href="/studio/traffic" className="ln-btn ln-btn-primary">
            <FiBarChart2 /> Traffic
          </Link>
          <Link href="/studio/posts/new" className="ln-btn ln-btn-outline">
            <FiPlus /> New post
          </Link>
          <Link href="/blog" className="ln-btn ln-btn-outline">
            <FiEye /> View blog
          </Link>
          <a href={EXIT_SITE_URL} className="ln-btn ln-btn-ghost studio-welcome-exit">
            <FiArrowLeft /> {EXIT_SITE_LABEL}
          </a>
        </div>
      </div>

      <Link href="/studio/traffic" className="studio-traffic-teaser">
        <span className="studio-traffic-teaser-icon"><FiBarChart2 aria-hidden /></span>
        <span className="studio-traffic-teaser-copy">
          <strong>Traffic &amp; analytics</strong>
          <span>Who visited, from which platform, how long they stayed, and top vlog posts</span>
        </span>
        <span className="studio-traffic-teaser-arrow">→</span>
      </Link>

      <div className="studio-section-divider">
        <h2>Blog posts</h2>
        <p>Vlog articles — write, publish and manage your content library.</p>
      </div>

      <div className="studio-stats">
        <div className="studio-stat"><strong>{posts.length}</strong><span>Total posts</span></div>
        <div className="studio-stat"><strong>{published}</strong><span>Published</span></div>
        <div className="studio-stat"><strong>{drafts}</strong><span>Drafts</span></div>
      </div>

      <div className="studio-dash-head">
        <p>All posts</p>
        <Link href="/studio/posts/new" className="ln-btn ln-btn-primary ln-btn-sm">
          <FiPlus /> New post
        </Link>
      </div>

      {loading ? (
        <p className="studio-loading">Loading posts…</p>
      ) : posts.length === 0 ? (
        <div className="studio-empty">
          <h2>No posts yet</h2>
          <p>Create your first vlog post with Editor.js — text, images, embeds and more.</p>
          <Link href="/studio/posts/new" className="ln-btn ln-btn-primary ln-btn-lg">
            <FiPlus /> Write first post
          </Link>
        </div>
      ) : (
        <div className="studio-posts-table">
          {posts.map((post) => (
            <article key={post.id} className="studio-post-row">
              <div className="studio-post-row-thumb">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt=""
                    width={80}
                    height={54}
                    className="studio-post-row-thumb-img"
                    unoptimized={shouldUnoptimizeImage(post.coverImage)}
                  />
                ) : (
                  <span className="studio-post-row-thumb-empty" aria-hidden>
                    <FiImage />
                  </span>
                )}
              </div>
              <div className="studio-post-row-main">
                <h3>{post.title}</h3>
                <p>/blog/{post.slug}</p>
                <span className={`studio-status studio-status-${post.status}`}>{post.status}</span>
              </div>
              <div className="studio-post-row-actions">
                {post.status === "published" && (
                  <Link href={`/blog/${post.slug}`} target="_blank" className="studio-icon-btn" title="View">
                    <FiExternalLink />
                  </Link>
                )}
                <Link href={`/studio/posts/${post.id}/edit`} className="studio-icon-btn" title="Edit">
                  <FiEdit3 />
                </Link>
                <button type="button" className="studio-icon-btn danger" onClick={() => remove(post.id)} title="Delete">
                  <FiTrash2 />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </StudioShell>
  );
}
