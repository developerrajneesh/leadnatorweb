import { NextResponse } from "next/server";
import { listPosts } from "@/lib/blog/store";

export async function GET() {
  const posts = await listPosts("published");
  return NextResponse.json(posts);
}
