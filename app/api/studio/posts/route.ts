import { NextResponse } from "next/server";
import { requireSession } from "@/lib/blog/auth";
import { hasPostContent } from "@/lib/blog/content";
import { createPost, listPosts, listPostsPaginated } from "@/lib/blog/store";
import type { PostStatus } from "@/lib/blog/types";

export async function GET(req: Request) {
  try {
    await requireSession();
    const { searchParams } = new URL(req.url);
    const pageParam = searchParams.get("page");

    if (pageParam) {
      const page = Number(pageParam) || 1;
      const limit = Number(searchParams.get("limit")) || 10;
      const status = (searchParams.get("status") || "all") as PostStatus | "all";
      const search = searchParams.get("q") || undefined;
      const result = await listPostsPaginated({ page, limit, status, search });
      return NextResponse.json(result);
    }

    const posts = await listPosts();
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireSession();
    const body = await req.json();
    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!hasPostContent(body.content)) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }
    const post = await createPost(body, session.email);
    return NextResponse.json(post, { status: 201 });
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
