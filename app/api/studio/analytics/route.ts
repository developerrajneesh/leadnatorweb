import { NextResponse } from "next/server";
import { requireSession } from "@/lib/blog/auth";
import { getAnalyticsSummary, type AnalyticsRange } from "@/lib/analytics/store";

const DAY_MS = 24 * 60 * 60 * 1000;

function isDay(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`));
}

function todayStartUtc(): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/**
 * Supported ranges:
 *   ?range=today            — current day only
 *   ?range=7|30|90          — trailing N days (also legacy ?days=N)
 *   ?range=all              — everything ever recorded
 *   ?range=custom&from=YYYY-MM-DD&to=YYYY-MM-DD — inclusive day range
 */
export async function GET(req: Request) {
  try {
    await requireSession();
    const { searchParams } = new URL(req.url);
    const rangeParam = (searchParams.get("range") || "").toLowerCase();

    let range: number | AnalyticsRange;

    if (rangeParam === "today") {
      const start = todayStartUtc();
      range = {
        since: start.toISOString(),
        rangeDays: 1,
        rangeEnd: start.toISOString().slice(0, 10),
      };
    } else if (rangeParam === "all") {
      range = {};
    } else if (rangeParam === "custom") {
      const from = searchParams.get("from") || "";
      const to = searchParams.get("to") || "";
      if (!isDay(from) || !isDay(to)) {
        return NextResponse.json(
          { error: "Custom range needs from and to as YYYY-MM-DD dates." },
          { status: 400 },
        );
      }
      const fromMs = Date.parse(`${from}T00:00:00Z`);
      const toMs = Date.parse(`${to}T00:00:00Z`);
      if (fromMs > toMs) {
        return NextResponse.json(
          { error: "The start date must be on or before the end date." },
          { status: 400 },
        );
      }
      range = {
        since: new Date(fromMs).toISOString(),
        until: new Date(toMs + DAY_MS).toISOString(),
        rangeDays: Math.round((toMs - fromMs) / DAY_MS) + 1,
        rangeEnd: to,
      };
    } else {
      const raw = rangeParam || searchParams.get("days") || "30";
      range = Math.min(90, Math.max(7, Number(raw) || 30));
    }

    const summary = await getAnalyticsSummary(range);
    return NextResponse.json(summary);
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
