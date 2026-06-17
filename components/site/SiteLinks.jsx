import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import { PRIMARY_SITELINKS } from "@/lib/marketing-seo";

/** Visible internal links — helps Google discover sitelink candidates. */
export default function SiteLinks() {
  return (
    <section className="ln-sitelinks-section" aria-labelledby="site-links-heading">
      <div className="ln-container ln-sitelinks-wrap">
        <div className="ln-sitelinks-header">
          <span className="ln-eyebrow">Explore Leadnator</span>
          <h2 id="site-links-heading">Popular pages</h2>
          <p>Features, pricing, docs and more — each page covers one part of the platform.</p>
        </div>

        <div className="ln-sitelinks-card">
          <ul className="ln-sitelinks-list">
            {PRIMARY_SITELINKS.map((item) => (
              <li key={item.path}>
                <Link href={item.path} className="ln-sitelinks-item">
                  <span className="ln-sitelinks-text">
                    <span className="ln-sitelinks-title">{item.name}</span>
                    <span className="ln-sitelinks-desc">{item.description}</span>
                  </span>
                  <FiChevronRight className="ln-sitelinks-chevron" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/site-map" className="ln-sitelinks-more">
            View full sitemap →
          </Link>
        </div>
      </div>
    </section>
  );
}
