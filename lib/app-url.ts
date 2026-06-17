/** React app (login, signup, dashboard) — separate from this marketing site. */
const APP_URL = "https://app.leadnator.com";

export const APP_LOGIN_URL = `${APP_URL}/login`;
export const APP_SIGNUP_URL = `${APP_URL}/signup`;

export function appBaseUrl(): string {
  return APP_URL;
}

export function appPath(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${APP_URL}${p}`;
}

export const AUTH_APP_PATHS = ["/login", "/signup", "/reset-password"] as const;

export function isAuthAppPath(path: string): boolean {
  const base = path.split("?")[0].split("#")[0];
  return AUTH_APP_PATHS.some((p) => base === p || base.startsWith(`${p}/`));
}
