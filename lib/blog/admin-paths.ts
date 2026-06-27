/** Browser routes for the admin panel (formerly /studio). */
export const ADMIN_PREFIX = "/admin";

export const ADMIN_ROUTES = {
  home: ADMIN_PREFIX,
  login: `${ADMIN_PREFIX}/login`,
  dashboard: `${ADMIN_PREFIX}/dashboard`,
  vlogs: `${ADMIN_PREFIX}/vlogs`,
  leads: `${ADMIN_PREFIX}/leads`,
  traffic: `${ADMIN_PREFIX}/traffic`,
  profile: `${ADMIN_PREFIX}/profile`,
  newPost: `${ADMIN_PREFIX}/posts/new`,
  editPost: (id: string) => `${ADMIN_PREFIX}/posts/${id}/edit`,
} as const;

export function isAdminPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`);
}
