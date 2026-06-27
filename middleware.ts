import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ADMIN_PREFIX, ADMIN_ROUTES } from "@/lib/blog/admin-paths";

const SESSION_COOKIE = "leadnator_blog_session";
const PUBLIC_ADMIN = [ADMIN_PREFIX, ADMIN_ROUTES.login];
const PUBLIC_ADMIN_API = ["/api/studio/auth/login", "/api/studio/auth/logout"];

function secretKey() {
  const secret = process.env.BLOG_JWT_SECRET || "dev-blog-secret-change-in-production";
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith(ADMIN_PREFIX);
  const isAdminApi = pathname.startsWith("/api/studio");

  if (!isAdminPage && !isAdminApi) return NextResponse.next();
  if (PUBLIC_ADMIN.includes(pathname)) return NextResponse.next();
  if (PUBLIC_ADMIN_API.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const login = new URL(ADMIN_ROUTES.login, request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  try {
    await jwtVerify(token, secretKey());
    return NextResponse.next();
  } catch {
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const login = new URL(ADMIN_ROUTES.login, request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/studio/:path*"],
};
