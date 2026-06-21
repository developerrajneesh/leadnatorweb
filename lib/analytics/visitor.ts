import { createHash } from "crypto";

export const VISITOR_COOKIE = "ln_vid";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "0.0.0.0";
  return req.headers.get("x-real-ip")?.trim() || "0.0.0.0";
}

/** Stable device hash — same IP + browser ≈ same person (even after cache clear). */
export function buildFingerprint(ip: string, userAgent: string): string {
  const salt = process.env.ANALYTICS_VISITOR_SALT || "leadnator";
  return createHash("sha256")
    .update(`${salt}|${ip}|${userAgent}`)
    .digest("hex")
    .slice(0, 32);
}

function parseCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function isValidVisitorId(id: string): boolean {
  return /^[a-f0-9]{32}$/i.test(id) || /^[0-9a-f-]{36}$/i.test(id);
}

/**
 * Resolve a stable visitor ID for unique counts.
 * Priority: cookie → fingerprint (IP+UA hash) → client localStorage UUID.
 * Fingerprint is preferred over a fresh client UUID so cache clears don't inflate uniques.
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
  const ua = req.headers.get("user-agent") || "";
  const fingerprint = buildFingerprint(ip, ua);
  const cookieId = parseCookie(req.headers.get("cookie"), VISITOR_COOKIE);
  const trimmedClient = clientId?.trim().slice(0, 64);

  if (cookieId && isValidVisitorId(cookieId)) {
    return {
      visitorId: cookieId,
      clientVisitorId: trimmedClient,
      fingerprint,
      shouldSetCookie: false,
    };
  }

  const visitorId = fingerprint || trimmedClient || "unknown";
  return {
    visitorId,
    clientVisitorId: trimmedClient,
    fingerprint,
    shouldSetCookie: true,
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
