import type { BlogPostContent } from "./content";

export type PostStatus = "draft" | "published";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  content: BlogPostContent;
  status: PostStatus;
  author: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
};

export type BlogPostInput = {
  title: string;
  slug?: string;
  excerpt?: string;
  coverImage?: string;
  content: BlogPostContent;
  status?: PostStatus;
  tags?: string[];
};

export type BlogPostSummary = Pick<
  BlogPost,
  "id" | "slug" | "title" | "excerpt" | "coverImage" | "status" | "author" | "tags" | "createdAt" | "updatedAt" | "publishedAt"
>;

export type PaginatedPosts = {
  items: BlogPostSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
