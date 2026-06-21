import { redirect } from "next/navigation";
import { getSession } from "@/lib/blog/auth";

/** /studio → login (or dashboard if already signed in) */
export default async function StudioPage() {
  const session = await getSession();
  if (session) redirect("/studio/dashboard");
  redirect("/studio/login");
}
