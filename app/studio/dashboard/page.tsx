"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiArrowLeft, FiBarChart2, FiEdit3, FiExternalLink, FiEye, FiImage, FiPlus, FiTrash2, FiUsers,
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
    if (!confirm("Delete this post? You won't be able to get it back.")) return;
    await fetch(`/api/studio/posts/${id}`, { method: "DELETE" });
    setPosts((p) => p.filter((x) => x.id !== id));
  }

  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;

  return (
    <StudioShell title="Dashboard">
      <div className="studio-welcome">
        <div className="studio-welcome-copy">
          <span className="studio-welcome-badge">All in One CRM</span>
          <h2>Welcome back!</h2>
          <p>
            Write and publish vlogs, see who's visiting your site, and catch every message
            from your contact page — all from here.
          </p>
        </div>
        <div className="studio-welcome-actions">
          <Link href="/studio/traffic" className="ln-btn ln-btn-primary">
            <FiBarChart2 /> See visitors
          </Link>
          <Link href="/studio/leads" className="ln-btn ln-btn-outline">
            <FiUsers /> View leads
          </Link>
          <Link href="/studio/posts/new" className="ln-btn ln-btn-outline">
            <FiPlus /> Write a post
          </Link>
          <Link href="/blog" className="ln-btn ln-btn-outline">
            <FiEye /> Open blog
          </Link>
          <a href={EXIT_SITE_URL} className="ln-btn ln-btn-ghost studio-welcome-exit">
            <FiArrowLeft /> {EXIT_SITE_LABEL}
          </a>
        </div>
      </div>

      <Link href="/studio/traffic" className="studio-traffic-teaser">
        <span className="studio-traffic-teaser-icon"><FiBarChart2 aria-hidden /></span>
        <span className="studio-traffic-teaser-copy">
          <strong>Website visitors</strong>
          <span>See who came to your site, where they found you, and what they read</span>
        </span>
        <span className="studio-traffic-teaser-arrow">→</span>
      </Link>

      <div className="studio-section-divider">
        <h2>Your blog posts</h2>
        <p>Write, edit and publish vlog articles for your audience.</p>
      </div>

      <div className="studio-stats">
        <div className="studio-stat"><strong>{posts.length}</strong><span>Total posts</span></div>
        <div className="studio-stat"><strong>{published}</strong><span>Published</span></div>
        <div className="studio-stat"><strong>{drafts}</strong><span>Drafts</span></div>
      </div>

      <div className="studio-dash-head">
        <p>Your articles</p>
        <Link href="/studio/posts/new" className="ln-btn ln-btn-primary ln-btn-sm">
          <FiPlus /> New post
        </Link>
      </div>

      {loading ? (
        <p className="studio-loading">Loading your posts…</p>
      ) : posts.length === 0 ? (
        <div className="studio-empty">
          <h2>Ready to write your first post?</h2>
          <p>Share your ideas with the world — add text, images, tables, video and more.</p>
          <Link href="/studio/posts/new" className="ln-btn ln-btn-primary ln-btn-lg">
            <FiPlus /> Write your first post
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
