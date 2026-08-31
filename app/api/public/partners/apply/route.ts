import { NextResponse } from "next/server";
import { createPartnerApplication } from "@/lib/partners/store";
import { checkContactSubmission, logBlocked } from "@/lib/security/abuse-guard";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const company = typeof body.company === "string" ? body.company.trim() : "";
    const reason = typeof body.reason === "string" ? body.reason.trim() : "";

    if (!name || !phone || !email || !company || !reason) {
      return NextResponse.json(
        { error: "Please fill in your name, phone, email, company and partnership reason." },
        { status: 400 },
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "That email doesn't look right — please double-check it." }, { status: 400 });
    }
    if (!isValidPhone(phone)) {
      return NextResponse.json({ error: "Please enter a valid phone number (at least 10 digits)." }, { status: 400 });
    }

    const verdict = await checkContactSubmission(req, {
      name,
      company,
      message: reason,
      website: typeof body.website === "string" ? body.website : "",
    });
    if (verdict.blocked) {
      console.warn(`[partners] blocked ${email} from ${verdict.ip} — ${verdict.reason}`);
      await logBlocked(verdict, { name, email, message: reason }, req);
      return NextResponse.json({ ok: true });
    }

    const application = await createPartnerApplication({ name, phone, email, company, reason });
    return NextResponse.json({ ok: true, id: application.id });
  } catch (err) {
    console.error("[partners] apply failed:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again in a moment." }, { status: 500 });
  }
}
