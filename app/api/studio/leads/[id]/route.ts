import { NextResponse } from "next/server";
import { requireSession } from "@/lib/blog/auth";
import { deleteContactLead, getContactLead, updateContactLead } from "@/lib/leads/store";
import type { ContactLeadUpdate } from "@/lib/leads/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    await requireSession();
    const { id } = await params;
    const lead = await getContactLead(id);
    if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(lead);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    await requireSession();
    const { id } = await params;
    const body = (await req.json()) as ContactLeadUpdate;
    const lead = await updateContactLead(id, body);
    if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(lead);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

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
