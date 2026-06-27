"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  FiBarChart2, FiGrid, FiList, FiLogIn, FiLogOut, FiMapPin, FiPlus, FiUser, FiUsers,
} from "react-icons/fi";
import { ADMIN_ROUTES } from "@/lib/blog/admin-paths";
import { ADMIN_NAV } from "@/lib/blog/nav";

const ICONS = {
  grid: FiGrid,
  list: FiList,
  plus: FiPlus,
};

function headerSubtitle(pathname: string | null): string {
  if (!pathname) return "Create content, track visitors, and manage leads — all in one place";
  if (pathname === ADMIN_ROUTES.dashboard) return "Quick overview — vlogs, traffic and leads";
  if (pathname.startsWith(ADMIN_ROUTES.traffic)) return "See who's visiting your site and where they come from";
  if (pathname.startsWith(ADMIN_ROUTES.leads)) return "Contact form messages — reply, export or forward to your CRM";
  if (pathname.startsWith(ADMIN_ROUTES.profile)) return "Your photo and name on every blog post";
  if (pathname.startsWith(ADMIN_ROUTES.vlogs)) return "Your full content library — search, filter, preview and edit";
  if (pathname.includes("/posts/new")) return "Start writing — your next article begins here";
  if (pathname.includes("/edit")) return "Update your article, cover image and publish settings";
  return "Leadnator — All in One CRM";
}

export default function StudioShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch("/api/studio/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.email) setUserEmail(data.email);
      })
      .catch(() => setUserEmail(null));
  }, [pathname]);

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/studio/auth/logout", { method: "POST" });
      router.push(ADMIN_ROUTES.login);
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  function isActive(href: string) {
    if (href === ADMIN_ROUTES.dashboard) return pathname === href;
    if (href === ADMIN_ROUTES.traffic) return pathname === href || pathname?.startsWith(ADMIN_ROUTES.traffic);
    if (href === ADMIN_ROUTES.visitors) return pathname === href || pathname?.startsWith(ADMIN_ROUTES.visitors);
    if (href === ADMIN_ROUTES.leads) return pathname === href || pathname?.startsWith(ADMIN_ROUTES.leads);
    if (href === ADMIN_ROUTES.profile) return pathname === href || pathname?.startsWith(ADMIN_ROUTES.profile);
    if (href === ADMIN_ROUTES.newPost) return pathname?.includes("/posts/new");
    if (href === ADMIN_ROUTES.vlogs) return pathname === href || pathname?.startsWith(ADMIN_ROUTES.vlogs);
    return pathname === href;
  }

  const tagline = subtitle ?? headerSubtitle(pathname);

  return (
    <div className="studio">
      <aside className="studio-sidebar">
        <div className="studio-sidebar-scroll">
          <Link href={ADMIN_ROUTES.dashboard} className="studio-brand">
            <Image
              src="/leadnator_logo.png"
              alt="Leadnator"
              width={40}
              height={40}
              className="studio-brand-logo"
              priority
            />
            <span className="studio-brand-copy">
              <span className="studio-brand-name">Leadnator</span>
              <span className="studio-brand-sub">Admin</span>
            </span>
          </Link>

          <p className="studio-sidebar-label">Content</p>
          <nav className="studio-nav" aria-label="Admin navigation">
            {ADMIN_NAV.map((item) => {
              const Icon = ICONS[item.icon];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive(item.href) ? "active" : ""}
                >
                  <Icon aria-hidden /> {item.label}
                </Link>
              );
            })}
          </nav>

          <p className="studio-sidebar-label">Analytics</p>
          <nav className="studio-nav studio-nav-analytics">
            <Link href={ADMIN_ROUTES.traffic} className={isActive(ADMIN_ROUTES.traffic) ? "active" : ""}>
              <FiBarChart2 aria-hidden /> Website visitors
            </Link>
            <Link href={ADMIN_ROUTES.visitors} className={isActive(ADMIN_ROUTES.visitors) ? "active" : ""}>
              <FiMapPin aria-hidden /> Visitor locations
            </Link>
            <Link href={ADMIN_ROUTES.leads} className={isActive(ADMIN_ROUTES.leads) ? "active" : ""}>
              <FiUsers aria-hidden /> Your leads
            </Link>
          </nav>

          <p className="studio-sidebar-label">Account</p>
          <nav className="studio-nav studio-nav-secondary">
            <Link href={ADMIN_ROUTES.profile} className={isActive(ADMIN_ROUTES.profile) ? "active" : ""}>
              <FiUser aria-hidden /> Author profile
            </Link>
          </nav>
        </div>
      </aside>

      <div className="studio-body">
        <header className="studio-topbar">
          <div className="studio-topbar-inner">
            {title ? <h1>{title}</h1> : null}
            <p className="studio-topbar-sub">{tagline}</p>
          </div>
          <div className="studio-topbar-actions">
            {userEmail ? (
              <button type="button" onClick={logout} className="studio-topbar-logout" disabled={loggingOut}>
                <FiLogOut aria-hidden /> {loggingOut ? "Signing out…" : "Sign out"}
              </button>
            ) : (
              <Link href={ADMIN_ROUTES.login} className="studio-topbar-logout">
                <FiLogIn aria-hidden /> Login
              </Link>
            )}
          </div>
        </header>
        <main className="studio-main">{children}</main>
      </div>
    </div>
  );
}
