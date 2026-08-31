import { NextResponse } from "next/server";
import { requireSession } from "@/lib/blog/auth";
import { listPartnerApplications } from "@/lib/partners/store";

export async function GET() {
  try {
    await requireSession();
    const applications = await listPartnerApplications();
    return NextResponse.json(applications);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
