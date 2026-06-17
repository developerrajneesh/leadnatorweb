"use client";

import Link from "next/link";
import { FiArrowRight, FiChevronDown, FiFileText, FiHelpCircle } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
export default function LegalDocument({ eyebrow,
  title,
  subtitle,
  lastUpdated,
  children,
}) {

  return (
    <><section className="ln-sub-hero">
        <div className="ln-container">
          <span className="ln-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </section>

      <section className="ln-section">
        <div className="ln-container ln-faq-wrap">
          <div className="ln-legal-meta">
            <span className="ln-hero-pill">
              <FiFileText /> Last updated: {lastUpdated}
            </span>
          </div>
          <div className="ln-faq">{children}</div>
        </div>
      </section>

      <LegalCta />
    </>
  );
}

export function LegalSection({ title, children, defaultOpen = false }) {
  return (
    <details className="ln-faq-item" open={defaultOpen}>
      <summary className="ln-faq-q">
        <span>
          <FiHelpCircle style={{ color: "var(--ln-green-600)", marginRight: 8 }} />
          {title}
        </span>
        <FiChevronDown aria-hidden />
      </summary>
      <div className="ln-faq-a ln-legal-prose">{children}</div>
    </details>
  );
}

function LegalCta() {
  return (
    <section className="ln-cta">
      <div className="ln-container">
        <div className="ln-cta-card">
          <div className="ln-cta-copy">
            <h2>Questions about this policy?</h2>
            <p>Our team is happy to clarify anything before you sign up or upgrade your plan.</p>
          </div>
          <div className="ln-cta-actions">
            <a className="ln-btn ln-btn-primary ln-btn-lg ln-btn-block" href="https://wa.me/917888341096">
              <FaWhatsapp /> Chat on WhatsApp
            </a>
            <Link
              href="/contact"
              className="ln-btn ln-btn-outline-dark ln-btn-lg ln-btn-block"
            >
              Contact us <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LegalLink({ href, children }) {
  if (href.startsWith("/")) {
    return <Link href={href}>{children}</Link>;
  }
  return <a href={href}>{children}</a>;
}
