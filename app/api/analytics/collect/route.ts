import { NextResponse } from "next/server";
import { isAdminPath } from "@/lib/blog/admin-paths";
import { recordPageView, updateViewDuration } from "@/lib/analytics/store";
import { applyVisitorCookie, resolveVisitorId } from "@/lib/analytics/visitor";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const type = body.type === "duration" ? "duration" : "view";

    if (type === "duration") {
      const viewId = typeof body.viewId === "string" ? body.viewId : "";
      const durationSec = Number(body.durationSec);
      if (viewId && Number.isFinite(durationSec)) {
        await updateViewDuration(viewId, durationSec);
      }
      return NextResponse.json({ ok: true });
    }

    const path = typeof body.path === "string" ? body.path : "/";
    const clientVisitorId = typeof body.visitorId === "string" ? body.visitorId : "";

    if (isAdminPath(path) || path.startsWith("/api")) {
      return NextResponse.json({ ok: true });
    }

    const resolved = resolveVisitorId(req, clientVisitorId);

    const viewId = await recordPageView({
      path,
      referrer: typeof body.referrer === "string" ? body.referrer : "",
      visitorId: resolved.visitorId,
      clientVisitorId: resolved.clientVisitorId,
      fingerprint: resolved.fingerprint,
      utmSource: typeof body.utmSource === "string" ? body.utmSource : undefined,
      utmMedium: typeof body.utmMedium === "string" ? body.utmMedium : undefined,
      utmCampaign: typeof body.utmCampaign === "string" ? body.utmCampaign : undefined,
      utmTerm: typeof body.utmTerm === "string" ? body.utmTerm : undefined,
      utmContent: typeof body.utmContent === "string" ? body.utmContent : undefined,
    });

    const res = NextResponse.json({ ok: true, viewId });
    if (resolved.shouldSetCookie) {
      applyVisitorCookie(res, resolved.visitorId);
    }
    return res;
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
