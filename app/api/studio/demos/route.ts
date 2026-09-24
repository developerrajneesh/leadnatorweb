import { NextResponse } from "next/server";
import { requireSession } from "@/lib/blog/auth";
import { listDemoBookings } from "@/lib/demos/store";

export async function GET() {
  try {
    await requireSession();
    const bookings = await listDemoBookings();
    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
