/** React app (login, signup, dashboard) — separate from this marketing site. */
export function appBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5173";
  return base.replace(/\/$/, "");
}

export function appPath(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${appBaseUrl()}${p}`;
}

export const AUTH_APP_PATHS = ["/login", "/signup", "/reset-password"] as const;

export function isAuthAppPath(path: string): boolean {
  const base = path.split("?")[0].split("#")[0];
  return AUTH_APP_PATHS.some((p) => base === p || base.startsWith(`${p}/`));
}
