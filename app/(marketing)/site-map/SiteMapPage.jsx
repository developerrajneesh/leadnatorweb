import Link from "next/link";
import { MARKETING_PAGES, absoluteUrl } from "@/lib/marketing-seo";

export default function SiteMapPage() {
  return (
    <>
      <section className="ln-sub-hero">
        <div className="ln-container">
          <span className="ln-eyebrow">Navigation</span>
          <h1>Sitemap</h1>
          <p>All public pages on leadnator.com — for visitors and search engines.</p>
        </div>
      </section>

      <section className="ln-section">
        <div className="ln-container">
          <ul className="ln-sitemap-list">
            {MARKETING_PAGES.filter((p) => p.path !== "/site-map").map((page) => (
              <li key={page.path}>
                <Link href={page.path === "/" ? "/" : page.path}>
                  {page.path === "/" ? "Home" : page.title.split(" · ")[0].split(" — ")[0]}
                </Link>
                <p>{page.description}</p>
                <span>{absoluteUrl(page.path)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
