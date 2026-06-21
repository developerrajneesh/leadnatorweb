import { NextResponse } from "next/server";
import { requireSession } from "@/lib/blog/auth";
import { getAnalyticsSummary } from "@/lib/analytics/store";

export async function GET(req: Request) {
  try {
    await requireSession();
    const { searchParams } = new URL(req.url);
    const days = Math.min(90, Math.max(7, Number(searchParams.get("days") || 30)));
    const summary = await getAnalyticsSummary(days);
    return NextResponse.json(summary);
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
