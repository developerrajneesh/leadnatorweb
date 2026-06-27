import { createHash } from "crypto";

export const VISITOR_COOKIE = "ln_vid";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

/**
 * Real client IP. Behind a proxy/CDN the original IP is the first entry of
 * x-forwarded-for; otherwise fall back to x-real-ip.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  // Common platform-specific fallbacks.
  return (
    req.headers.get("cf-connecting-ip")?.trim() ||
    req.headers.get("x-vercel-forwarded-for")?.trim() ||
    "0.0.0.0"
  );
}

/** Stable, salted hash of the IP address — one hash per IP. */
export function buildIpHash(ip: string): string {
  const salt = process.env.ANALYTICS_VISITOR_SALT || "leadnator";
  return createHash("sha256").update(`${salt}|${ip}`).digest("hex").slice(0, 32);
}

/**
 * Resolve a visitor identity purely from the client IP address.
 * Same IP = same visitor, so unique visitors are counted per IP
 * (independent of cookies, cache clears, or browser).
 */
export function resolveVisitorId(
  req: Request,
  clientId?: string,
): {
  visitorId: string;
  clientVisitorId?: string;
  fingerprint: string;
  shouldSetCookie: boolean;
} {
  const ip = getClientIp(req);
  const ipHash = buildIpHash(ip);
  const trimmedClient = clientId?.trim().slice(0, 64);

  return {
    visitorId: ipHash,
    clientVisitorId: trimmedClient,
    fingerprint: ipHash,
    shouldSetCookie: false,
  };
}

export function applyVisitorCookie(
  res: import("next/server").NextResponse,
  visitorId: string,
): void {
  res.cookies.set(VISITOR_COOKIE, visitorId, {
    maxAge: COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });
}
