import { redirect } from "next/navigation";
import { getSession } from "@/lib/blog/auth";
import { ADMIN_ROUTES } from "@/lib/blog/admin-paths";

/** /admin → login (or dashboard if already signed in) */
export default async function AdminPage() {
  const session = await getSession();
  if (session) redirect(ADMIN_ROUTES.dashboard);
  redirect(ADMIN_ROUTES.login);
}
