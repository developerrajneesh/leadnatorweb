import { NextResponse } from "next/server";
import { requireSession } from "@/lib/blog/auth";
import { formatUploadError, uploadBlogImage } from "@/lib/db/storage";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export async function POST(req: Request) {
  try {
    await requireSession();
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadBlogImage(buffer, file.type, ext);

    return NextResponse.json({ success: 1, file: { url } });
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Upload failed:", e);
    const message = await formatUploadError(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
