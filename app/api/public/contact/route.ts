import { NextResponse } from "next/server";
import { createContactLead, dispatchLeadsWebhook } from "@/lib/leads/store";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const company = typeof body.company === "string" ? body.company.trim() : "";
    const interest = typeof body.interest === "string" ? body.interest.trim() : "Other";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const lead = await createContactLead({ name, email, company, interest, message });
    await dispatchLeadsWebhook(lead);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] submit failed:", err);
    return NextResponse.json({ error: "Could not submit your message. Please try again." }, { status: 500 });
  }
}
