import { NextResponse } from "next/server";
import { requireSession } from "@/lib/blog/auth";
import { deleteDemoBooking, getDemoBooking, updateDemoBooking } from "@/lib/demos/store";
import type { DemoBookingUpdate } from "@/lib/demos/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    await requireSession();
    const { id } = await params;
    const row = await getDemoBooking(id);
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
    const body = (await req.json()) as DemoBookingUpdate;
    const row = await updateDemoBooking(id, body);
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
    const ok = await deleteDemoBooking(id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
