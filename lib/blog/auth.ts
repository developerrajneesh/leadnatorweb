import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { verifyStudioAdmin } from "@/lib/blog/admins";

export const SESSION_COOKIE = "leadnator_blog_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secretKey() {
  const secret = process.env.BLOG_JWT_SECRET?.trim() || "dev-blog-secret-change-in-production";
  return new TextEncoder().encode(secret);
}

export async function verifyAdmin(email: string, password: string): Promise<boolean> {
  return verifyStudioAdmin(email, password);
}

export async function createSession(email: string) {
  return new SignJWT({ email: email.trim().toLowerCase(), role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey());
}

export async function getSession(): Promise<{ email: string; role: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return { email: String(payload.email), role: String(payload.role) };
  } catch {
    return null;
  }
}

export async function requireSession() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

export function sessionCookieOptions(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}
