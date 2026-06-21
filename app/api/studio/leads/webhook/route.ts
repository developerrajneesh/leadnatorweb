import { NextResponse } from "next/server";
import { requireSession } from "@/lib/blog/auth";
import { getLeadsWebhookUrl, setLeadsWebhookUrl } from "@/lib/leads/store";

function isValidWebhookUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    await requireSession();
    const url = await getLeadsWebhookUrl();
    return NextResponse.json({ url: url ?? "" });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireSession();
    const body = await req.json();
    const url = typeof body.url === "string" ? body.url.trim() : "";

    if (url && !isValidWebhookUrl(url)) {
      return NextResponse.json({ error: "Please enter a valid link starting with http:// or https://" }, { status: 400 });
    }

    const saved = await setLeadsWebhookUrl(url);
    return NextResponse.json({ url: saved ?? "" });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
