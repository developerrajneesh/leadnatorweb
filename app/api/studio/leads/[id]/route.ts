import { NextResponse } from "next/server";
import { requireSession } from "@/lib/blog/auth";
import { deleteContactLead } from "@/lib/leads/store";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await requireSession();
    const { id } = await params;
    const ok = await deleteContactLead(id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
