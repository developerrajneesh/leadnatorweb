import { NextResponse } from "next/server";
import { requireSession } from "@/lib/blog/auth";
import { getBlogAuthorProfile, setBlogAuthorProfile } from "@/lib/blog/author-profile";

export async function GET() {
  try {
    await requireSession();
    const profile = await getBlogAuthorProfile();
    return NextResponse.json(profile);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireSession();
    const body = await req.json();
    const profile = await setBlogAuthorProfile({
      displayName: typeof body.displayName === "string" ? body.displayName : undefined,
      role: typeof body.role === "string" ? body.role : undefined,
      bio: typeof body.bio === "string" ? body.bio : undefined,
      avatarUrl: typeof body.avatarUrl === "string" ? body.avatarUrl : undefined,
      initials: typeof body.initials === "string" ? body.initials : undefined,
    });
    return NextResponse.json(profile);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
