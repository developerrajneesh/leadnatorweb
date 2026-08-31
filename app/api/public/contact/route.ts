import { NextResponse } from "next/server";
import { createContactLead, dispatchLeadsWebhook } from "@/lib/leads/store";
import { checkContactSubmission, logBlocked } from "@/lib/security/abuse-guard";
import { isRateLimited } from "@/lib/security/rate-limit";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    // Same idea as the app's signup limiter: public forms get their own tight
    // per-IP cap on top of the content/Tor checks below.
    if (await isRateLimited(req, "contact", { max: 5, windowMs: 60 * 60 * 1000 })) {
      return NextResponse.json(
        { error: "Too many submissions from this network. Please try again later." },
        { status: 429 },
      );
    }

    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const company = typeof body.company === "string" ? body.company.trim() : "";
    const interest = typeof body.interest === "string" ? body.interest.trim() : "Other";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Please fill in your name, email and message." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "That email doesn't look right — please double-check it." }, { status: 400 });
    }

    // Abuse guard: Tor exit relays, honeypot, and the bot-signature content
    // patterns. Answers with the normal success shape so a bot can't tell it
    // was filtered and start probing for what tripped it.
    const verdict = await checkContactSubmission(req, {
      name, company, message,
      website: typeof body.website === "string" ? body.website : "",
    });
    if (verdict.blocked) {
      console.warn(`[contact] blocked ${email} from ${verdict.ip} — ${verdict.reason}`);
      await logBlocked(verdict, { name, email, message }, req);
      return NextResponse.json({ ok: true });
    }

    const lead = await createContactLead({ name, email, company, interest, message });
    await dispatchLeadsWebhook(lead);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] submit failed:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again in a moment." }, { status: 500 });
  }
}
