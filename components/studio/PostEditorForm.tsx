"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiEye,
  FiGlobe,
  FiImage,
  FiLink,
  FiSave,
  FiSend,
  FiTag,
  FiType,
  FiUpload,
  FiX,
} from "react-icons/fi";
import type { BlogPost, PostStatus } from "@/lib/blog/types";
import { contentHtmlForEditor, hasPostContent } from "@/lib/blog/content";
import { slugify } from "@/lib/blog/slug";

import type { BlogSunEditorHandle } from "@/components/blog/SunEditor";

const BlogSunEditor = dynamic(() => import("@/components/blog/SunEditor"), {
  ssr: false,
  loading: () => (
    <div className="blog-suneditor-wrap blog-suneditor-loading">
      <span className="studio-editor-loading-dot" />
      Loading editor…
    </div>
  ),
});

type Props = {
  post?: BlogPost;
  mode: "create" | "edit";
};

export default function PostEditorForm({ post, mode }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [tags, setTags] = useState(post?.tags?.join(", ") ?? "");
  const [status, setStatus] = useState<PostStatus>(post?.status ?? "draft");
  const [content, setContent] = useState(() => contentHtmlForEditor(post?.content));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugTouched, setSlugTouched] = useState(!!post?.slug);
  const editorKey = post?.id ?? "new";
  const editorRef = useRef<BlogSunEditorHandle>(null);

  const onTitleChange = (v: string) => {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  };

  const onContentChange = useCallback((html: string) => {
    setContent(html);
  }, []);

  async function uploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/studio/upload", { method: "POST", body: form });
    const data = await res.json();
    if (res.ok) setCoverImage(data.file.url);
    else setError(data.error || "Cover upload failed");
  }

  async function save(nextStatus?: PostStatus) {
    setError("");
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    const latestContent = editorRef.current?.getHtml() || content;
    if (!hasPostContent(latestContent)) {
      setError("Add some content in the editor");
      return;
    }

    setSaving(true);
    const payload = {
      title: title.trim(),
      slug: slug.trim() || slugify(title),
      excerpt: excerpt.trim(),
      coverImage: coverImage || undefined,
      content: latestContent,
      status: nextStatus ?? status,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const url = mode === "edit" && post ? `/api/studio/posts/${post.id}` : "/api/studio/posts";
      const method = mode === "edit" ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push("/studio/dashboard");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const slugPreview = slug.trim() || (title ? slugify(title) : "your-post");

  return (
    <div className="se">
      <div className="se-toolbar">
        <div className="se-toolbar-left">
          <Link href="/studio/dashboard" className="se-back">
            <FiArrowLeft aria-hidden /> Posts
          </Link>
          <span className={`se-status se-status-${status}`}>
            {status === "published" ? "Published" : "Draft"}
          </span>
        </div>
        <div className="se-toolbar-right">
          {post?.status === "published" && (
            <a
              href={`/blog/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="se-btn se-btn-ghost"
            >
              <FiEye aria-hidden /> Preview
            </a>
          )}
          <button
            type="button"
            className="se-btn se-btn-outline"
            disabled={saving}
            onClick={() => save("draft")}
          >
            <FiSave aria-hidden /> {saving ? "Saving…" : "Save draft"}
          </button>
          <button
            type="button"
            className="se-btn se-btn-primary"
            disabled={saving}
            onClick={() => save("published")}
          >
            <FiSend aria-hidden />
            {saving ? "Saving…" : status === "published" ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      {error && <div className="se-error">{error}</div>}

      <div className="se-layout">
        <main className="se-main">
          <section className="se-card se-card-title">
            <label className="se-label" htmlFor="post-title">
              <FiType aria-hidden /> Title
            </label>
            <input
              id="post-title"
              className="se-title"
              placeholder="Give your article a clear, compelling title…"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
            />
          </section>

          <section className="se-card se-card-editor">
            <div className="se-card-head">
              <h2>Content</h2>
              <p>Rich text editor — headings, images, tables, links, video embeds and more</p>
            </div>
            <div className="se-editor-wrap">
              <BlogSunEditor
                ref={editorRef}
                key={editorKey}
                initialHtml={contentHtmlForEditor(post?.content)}
                onChange={onContentChange}
              />
            </div>
          </section>
        </main>

        <aside className="se-sidebar">
          <div className="se-panel se-panel-accent">
            <div className="se-panel-head">
              <FiSend aria-hidden />
              <div>
                <h3>Publish</h3>
                <p>Control visibility on the public blog</p>
              </div>
            </div>
            <label className="se-field-label" htmlFor="post-status">
              Status
            </label>
            <select
              id="post-status"
              className="se-input"
              value={status}
              onChange={(e) => setStatus(e.target.value as PostStatus)}
            >
              <option value="draft">Draft — hidden from blog</option>
              <option value="published">Published — live on /blog</option>
            </select>
          </div>

          <div className="se-panel">
            <div className="se-panel-head">
              <FiLink aria-hidden />
              <div>
                <h3>URL &amp; SEO</h3>
                <p>Slug and summary for cards &amp; search</p>
              </div>
            </div>
            <label className="se-field-label" htmlFor="post-slug">
              Permalink
            </label>
            <div className="se-slug">
              <span>/blog/</span>
              <input
                id="post-slug"
                className="se-input"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                placeholder="my-post"
              />
            </div>
            <p className="se-url-preview">
              <FiGlobe aria-hidden /> leadnator.com/blog/{slugPreview}
            </p>
            <label className="se-field-label" htmlFor="post-excerpt">
              Excerpt
            </label>
            <textarea
              id="post-excerpt"
              className="se-textarea"
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short summary for blog cards and SEO…"
            />
          </div>

          <div className="se-panel">
            <div className="se-panel-head">
              <FiImage aria-hidden />
              <div>
                <h3>Cover image</h3>
                <p>Hero image on the article page</p>
              </div>
            </div>
            {coverImage ? (
              <div className="se-cover">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverImage} alt="Cover preview" />
                <button type="button" className="se-cover-remove" onClick={() => setCoverImage("")} aria-label="Remove cover">
                  <FiX aria-hidden />
                </button>
              </div>
            ) : (
              <label className="se-upload">
                <FiUpload aria-hidden />
                <span>Click to upload cover</span>
                <small>JPG, PNG or WebP · 16:9 works best</small>
                <input type="file" accept="image/*" hidden onChange={uploadCover} />
              </label>
            )}
          </div>

          <div className="se-panel">
            <div className="se-panel-head">
              <FiTag aria-hidden />
              <div>
                <h3>Tags</h3>
                <p>Organize topics for readers</p>
              </div>
            </div>
            <input
              className="se-input"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="whatsapp, crm, marketing"
            />
            <p className="se-hint">Separate tags with commas</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
