import { NextResponse } from "next/server";
import { createDemoBooking } from "@/lib/demos/store";
import { DEMO_PRODUCTS, type DemoProduct } from "@/lib/demos/types";
import { checkContactSubmission, logBlocked } from "@/lib/security/abuse-guard";
import { isRateLimited } from "@/lib/security/rate-limit";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(req: Request) {
  try {
    if (await isRateLimited(req, "demo_booking", { max: 5, windowMs: 60 * 60 * 1000 })) {
      return NextResponse.json(
        { error: "Too many submissions from this network. Please try again later." },
        { status: 429 },
      );
    }

    const body = await req.json();
    const name = str(body.name);
    const phone = str(body.phone);
    const email = str(body.email);
    const company = str(body.company);
    const industry = str(body.industry) || "Other";
    const rawProduct = str(body.product);
    const product: DemoProduct = (DEMO_PRODUCTS as readonly string[]).includes(rawProduct)
      ? (rawProduct as DemoProduct)
      : "Both";
    const preferredDate = str(body.preferredDate);
    const preferredTime = str(body.preferredTime);
    const message = str(body.message);
    const source = str(body.source) || "leadnator-voice";

    if (!name || !phone || !email || !company || !preferredDate || !preferredTime) {
      return NextResponse.json(
        { error: "Please fill in your name, phone, email, company and a preferred date & time." },
        { status: 400 },
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "That email doesn't look right — please double-check it." }, { status: 400 });
    }
    if (!isValidPhone(phone)) {
      return NextResponse.json({ error: "Please enter a valid phone number (at least 10 digits)." }, { status: 400 });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) {
      return NextResponse.json({ error: "Please pick a valid date." }, { status: 400 });
    }

    const verdict = await checkContactSubmission(req, {
      name,
      company,
      message: message || `${product} demo`,
      website: typeof body.website === "string" ? body.website : "",
    });
    if (verdict.blocked) {
      console.warn(`[demo] blocked ${email} from ${verdict.ip} — ${verdict.reason}`);
      await logBlocked(verdict, { name, email, message }, req);
      return NextResponse.json({ ok: true });
    }

    const booking = await createDemoBooking({
      name, phone, email, company, industry, product,
      preferredDate, preferredTime, message, source,
    });
    return NextResponse.json({ ok: true, id: booking.id });
  } catch (err) {
    console.error("[demo] booking failed:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again in a moment." }, { status: 500 });
  }
}
