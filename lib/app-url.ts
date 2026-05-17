/** React app (login, signup, dashboard) — separate from this marketing site. */
const PRODUCTION_APP_URL = "https://leadnatorapp.codelatentlabs.com";

export function appBaseUrl(): string {
  const fallback =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5173"
      : PRODUCTION_APP_URL;
  const base = process.env.NEXT_PUBLIC_APP_URL || fallback;
  return base.replace(/\/$/, "");
}

export const APP_LOGIN_URL = () => appPath("/login");
export const APP_SIGNUP_URL = () => appPath("/signup");

export function appPath(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${appBaseUrl()}${p}`;
}

export const AUTH_APP_PATHS = ["/login", "/signup", "/reset-password"] as const;

export function isAuthAppPath(path: string): boolean {
  const base = path.split("?")[0].split("#")[0];
  return AUTH_APP_PATHS.some((p) => base === p || base.startsWith(`${p}/`));
}
