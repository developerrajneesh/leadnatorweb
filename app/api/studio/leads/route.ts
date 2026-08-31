import { NextResponse } from "next/server";
import { requireSession } from "@/lib/blog/auth";
import { deleteContactLeads, listContactLeads } from "@/lib/leads/store";

const BULK_DELETE_LIMIT = 500;

export async function GET() {
  try {
    await requireSession();
    const leads = await listContactLeads();
    return NextResponse.json(leads);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let ids: unknown;
  try {
    ({ ids } = (await req.json()) as { ids?: unknown });
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    !Array.isArray(ids) ||
    ids.length === 0 ||
    ids.length > BULK_DELETE_LIMIT ||
    !ids.every((id) => typeof id === "string" && id.length > 0)
  ) {
    return NextResponse.json(
      { error: `Expected { ids: string[] } with 1–${BULK_DELETE_LIMIT} ids` },
      { status: 400 },
    );
  }

  const deleted = await deleteContactLeads(ids as string[]);
  return NextResponse.json({ ok: true, deleted });
}
