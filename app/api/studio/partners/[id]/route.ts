import { NextResponse } from "next/server";
import { requireSession } from "@/lib/blog/auth";
import {
  deletePartnerApplication,
  getPartnerApplication,
  updatePartnerApplication,
} from "@/lib/partners/store";
import type { PartnerApplicationUpdate } from "@/lib/partners/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    await requireSession();
    const { id } = await params;
    const row = await getPartnerApplication(id);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(row);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    await requireSession();
    const { id } = await params;
    const body = (await req.json()) as PartnerApplicationUpdate;
    const row = await updatePartnerApplication(id, body);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(row);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await requireSession();
    const { id } = await params;
    const ok = await deletePartnerApplication(id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
