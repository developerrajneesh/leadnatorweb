"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  FiArrowLeft, FiBarChart2, FiEdit3, FiExternalLink, FiEye, FiGrid, FiList, FiLogIn, FiLogOut, FiPlus, FiUsers,
} from "react-icons/fi";
import { EXIT_SITE_LABEL, EXIT_SITE_URL, STUDIO_NAV } from "@/lib/blog/nav";

const ICONS = {
  grid: FiGrid,
  plus: FiPlus,
  eye: FiEye,
  list: FiList,
};

function headerSubtitle(pathname: string | null): string {
  if (!pathname) return "Create, publish & track your content";
  if (pathname === "/studio/dashboard") return "Manage vlog posts and jump to analytics";
  if (pathname.startsWith("/studio/traffic")) return "Know who visits, from where, and how long they stay";
  if (pathname.startsWith("/studio/leads")) return "Contact form submissions — view and forward to webhook";
  if (pathname.includes("/posts/new")) return "Write your next article with the editor";
  if (pathname.includes("/edit")) return "Update content, cover & publish settings";
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
      router.push("/studio/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  function isActive(href: string) {
    if (href === "/studio/dashboard") return pathname === href;
    if (href === "/studio/traffic") return pathname === href || pathname?.startsWith("/studio/traffic");
    if (href === "/studio/leads") return pathname === href || pathname?.startsWith("/studio/leads");
    if (href === "/studio/posts/new") return pathname?.includes("/posts/new");
    if (href === "/blog") return pathname === "/blog";
    if (href === "/blog#posts") return pathname?.startsWith("/blog/");
    return pathname === href;
  }

  const tagline = subtitle ?? headerSubtitle(pathname);

  return (
    <div className="studio">
      <aside className="studio-sidebar">
        <div className="studio-sidebar-scroll">
          <Link href="/studio/dashboard" className="studio-brand">
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
              <span className="studio-brand-sub">All in One CRM</span>
            </span>
          </Link>

          <p className="studio-sidebar-label">Content</p>
          <nav className="studio-nav" aria-label="Studio navigation">
            {STUDIO_NAV.map((item) => {
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
            <Link href="/studio/posts/new" className={pathname?.includes("/edit") ? "active" : ""}>
              <FiEdit3 aria-hidden /> Edit posts
            </Link>
          </nav>

          <p className="studio-sidebar-label">Analytics</p>
          <nav className="studio-nav studio-nav-analytics">
            <Link href="/studio/traffic" className={isActive("/studio/traffic") ? "active" : ""}>
              <FiBarChart2 aria-hidden /> Visitors &amp; sources
            </Link>
            <Link href="/studio/leads" className={isActive("/studio/leads") ? "active" : ""}>
              <FiUsers aria-hidden /> Leads
            </Link>
          </nav>

          <p className="studio-sidebar-label">Public</p>
          <nav className="studio-nav studio-nav-secondary">
            <Link href="/blog" target="_blank" rel="noopener noreferrer">
              <FiEye aria-hidden /> Open blog
            </Link>
          </nav>
        </div>

        <div className="studio-sidebar-foot">
          {userEmail ? (
            <div className="studio-sidebar-user" title={userEmail}>
              <span className="studio-sidebar-avatar" aria-hidden>
                {userEmail.charAt(0).toUpperCase()}
              </span>
              <span className="studio-sidebar-user-email">{userEmail}</span>
            </div>
          ) : null}

          {userEmail ? (
            <button type="button" onClick={logout} className="studio-logout" disabled={loggingOut}>
              <FiLogOut aria-hidden /> {loggingOut ? "Signing out…" : "Logout"}
            </button>
          ) : (
            <Link href="/studio/login" className="studio-sidebar-login">
              <FiLogIn aria-hidden /> Login
            </Link>
          )}

          <a href={EXIT_SITE_URL} className="studio-exit-btn">
            <FiArrowLeft aria-hidden />
            {EXIT_SITE_LABEL}
            <FiExternalLink aria-hidden />
          </a>
        </div>
      </aside>

      <div className="studio-body">
        <header className="studio-topbar">
          <div className="studio-topbar-inner">
            {title ? <h1>{title}</h1> : null}
            <p className="studio-topbar-sub">{tagline}</p>
          </div>
        </header>
        <main className="studio-main">{children}</main>
      </div>
    </div>
  );
}
