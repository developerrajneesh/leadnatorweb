import { NextResponse } from "next/server";
import { requireSession } from "@/lib/blog/auth";
import { listContactLeads } from "@/lib/leads/store";

export async function GET() {
  try {
    await requireSession();
    const leads = await listContactLeads();
    return NextResponse.json(leads);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
