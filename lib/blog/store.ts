import { v4 as uuidv4 } from "uuid";
import { getDb } from "@/lib/db/mongodb";
import type { BlogPost, BlogPostInput, BlogPostSummary, PostStatus } from "./types";
import { uniqueSlug } from "./slug";
import { getFirstImageFromContent, resolvePostCoverImage } from "./images";

const COLLECTION = "blog_posts";
const POST_PROJECTION = { _id: 0 } as const;

async function postsCollection() {
  const db = await getDb();
  const col = db.collection<BlogPost>(COLLECTION);
  await col.createIndex({ id: 1 }, { unique: true });
  await col.createIndex({ slug: 1 }, { unique: true });
  await col.createIndex({ status: 1, updatedAt: -1 });
  return col;
}

function toIso(value: unknown): string {
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  return new Date(String(value)).toISOString();
}

/** Strip MongoDB fields — safe for Server → Client Component props */
export function toPlainPost(raw: unknown): BlogPost | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  return {
    id: String(obj.id),
    slug: String(obj.slug),
    title: String(obj.title),
    excerpt: String(obj.excerpt ?? ""),
    coverImage: obj.coverImage ? String(obj.coverImage) : undefined,
    content: structuredClone(obj.content) as BlogPost["content"],
    status: obj.status as PostStatus,
    author: String(obj.author),
    tags: Array.isArray(obj.tags) ? obj.tags.map(String) : [],
    createdAt: toIso(obj.createdAt),
    updatedAt: toIso(obj.updatedAt),
    publishedAt: obj.publishedAt ? toIso(obj.publishedAt) : undefined,
  };
}

function toSummary(raw: unknown): BlogPostSummary {
  const post = toPlainPost(raw)!;
  const { content: _, ...rest } = post;
  return {
    ...rest,
    coverImage: resolvePostCoverImage(post),
  };
}

async function allSlugs(excludeId?: string): Promise<string[]> {
  const col = await postsCollection();
  const query = excludeId ? { id: { $ne: excludeId } } : {};
  const rows = await col.find(query, { projection: { slug: 1, _id: 0 } }).toArray();
  return rows.map((r) => r.slug);
}

export async function listPosts(status?: PostStatus): Promise<BlogPostSummary[]> {
  const col = await postsCollection();
  const query = status ? { status } : {};
  const posts = await col.find(query, { projection: POST_PROJECTION }).sort({ updatedAt: -1 }).toArray();
  return posts.map(toSummary);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const col = await postsCollection();
  const doc = await col.findOne({ slug, status: "published" }, { projection: POST_PROJECTION });
  return toPlainPost(doc);
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  const col = await postsCollection();
  const doc = await col.findOne({ id }, { projection: POST_PROJECTION });
  return toPlainPost(doc);
}

export async function createPost(input: BlogPostInput, author: string): Promise<BlogPost> {
  const col = await postsCollection();
  const now = new Date().toISOString();
  const slugs = await allSlugs();
  const slug = uniqueSlug(input.slug || input.title, slugs);
  const status = input.status ?? "draft";

  const post: BlogPost = {
    id: uuidv4(),
    slug,
    title: input.title.trim(),
    excerpt: input.excerpt?.trim() || "",
    coverImage: input.coverImage || getFirstImageFromContent(input.content),
    content: input.content,
    status,
    author,
    tags: input.tags ?? [],
    createdAt: now,
    updatedAt: now,
    publishedAt: status === "published" ? now : undefined,
  };

  await col.insertOne(post);
  return toPlainPost(post)!;
}

export async function updatePost(id: string, input: Partial<BlogPostInput>): Promise<BlogPost | null> {
  const col = await postsCollection();
  const existing = await toPlainPost(await col.findOne({ id }, { projection: POST_PROJECTION }));
  if (!existing) return null;

  const now = new Date().toISOString();
  let slug = existing.slug;

  if (input.slug && input.slug !== existing.slug) {
    const slugs = await allSlugs(id);
    slug = uniqueSlug(input.slug, slugs);
  } else if (input.title && input.title !== existing.title && !input.slug) {
    const slugs = await allSlugs(id);
    slug = uniqueSlug(input.title, slugs);
  }

  const status = input.status ?? existing.status;
  const wasPublished = existing.status === "published";
  const isPublished = status === "published";

  const content = input.content ?? existing.content;
  const coverImage =
    input.coverImage !== undefined
      ? input.coverImage || getFirstImageFromContent(content)
      : existing.coverImage || getFirstImageFromContent(content);

  const updated: BlogPost = {
    id: existing.id,
    slug,
    title: input.title?.trim() ?? existing.title,
    excerpt: input.excerpt?.trim() ?? existing.excerpt,
    coverImage,
    content,
    status,
    author: existing.author,
    tags: input.tags ?? existing.tags,
    createdAt: existing.createdAt,
    updatedAt: now,
    publishedAt: isPublished ? (existing.publishedAt || now) : wasPublished && !isPublished ? undefined : existing.publishedAt,
  };

  await col.replaceOne({ id }, updated);
  return toPlainPost(updated);
}

export async function deletePost(id: string): Promise<boolean> {
  const col = await postsCollection();
  const result = await col.deleteOne({ id });
  return result.deletedCount === 1;
}

export async function getAllSlugs(): Promise<string[]> {
  const col = await postsCollection();
  const rows = await col
    .find({ status: "published" }, { projection: { slug: 1, _id: 0 } })
    .toArray();
  return rows.map((r) => r.slug);
}

/** One-time import helper for migration scripts */
export async function importPosts(posts: BlogPost[]) {
  if (!posts.length) return;
  const col = await postsCollection();
  for (const post of posts) {
    await col.updateOne({ id: post.id }, { $set: toPlainPost(post)! }, { upsert: true });
  }
}

export async function getRelatedPosts(
  currentId: string,
  tags: string[],
  limit = 2
): Promise<BlogPostSummary[]> {
  const all = await listPosts("published");
  const others = all.filter((p) => p.id !== currentId);
  const tagSet = new Set(tags.map((t) => t.toLowerCase()));

  const scored = others
    .map((post) => ({
      post,
      score: post.tags.filter((t) => tagSet.has(t.toLowerCase())).length,
    }))
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((row) => row.post);
}

export async function countPosts(): Promise<number> {
  const col = await postsCollection();
  return col.countDocuments();
}
