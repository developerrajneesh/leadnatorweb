"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FiSearch, FiChevronDown, FiHelpCircle, FiArrowRight } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import MarketingLayout from "./MarketingLayout";
import { FAQ_ITEMS } from "@/lib/faq-data";
import { useSeo } from "./seo";

export default function Faq({ onGoto }) {
  const searchParams = useSearchParams();

  useSeo({
    title: "FAQ — WhatsApp API, Pricing, Meta Ads & Security Questions",
    description:
      "Leadnator FAQ: WhatsApp Business API setup, blue tick, Meta Ads, email SMTP, billing in INR, data security, integrations and support — 30+ detailed answers.",
    canonical: "https://leadnator.com/faq",
    keywords: "WhatsApp Business API FAQ, WhatsApp CRM setup India, Meta Ads CRM FAQ",
  });

  const [q, setQ] = useState("");

  useEffect(() => {
    const fromUrl = searchParams.get("q");
    if (fromUrl) setQ(fromUrl);
  }, [searchParams]);

  const cats = Array.from(new Set(FAQ_ITEMS.map((f) => f.cat)));
  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    if (!ql) return FAQ_ITEMS;
    return FAQ_ITEMS.filter(
      (f) => f.q.toLowerCase().includes(ql) || f.a.toLowerCase().includes(ql),
    );
  }, [q]);

  return (
    <MarketingLayout onGoto={onGoto} currentPath="/faq">
      <Hero q={q} setQ={setQ} />

      <section className="ln-section">
        <div className="ln-container ln-faq-wrap">
          {cats.map((cat) => {
            const items = filtered.filter((f) => f.cat === cat);
            if (!items.length) return null;
            return (
              <div key={cat} className="ln-faq-cat">
                <h2>{cat}</h2>
                <div className="ln-faq">
                  {items.map((f, i) => (
                    <details key={`${cat}-${i}`} className="ln-faq-item">
                      <summary className="ln-faq-q">
                        <span>
                          <FiHelpCircle style={{ color: "var(--ln-green-600)", marginRight: 8 }} />
                          {f.q}
                        </span>
                        <FiChevronDown aria-hidden />
                      </summary>
                      <div className="ln-faq-a">{f.a}</div>
                    </details>
                  ))}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div style={{ padding: 60, textAlign: "center", color: "var(--ln-muted)" }}>
              No FAQs match &quot;{q}&quot;. Try a different keyword or{" "}
              <button
                type="button"
                onClick={() => onGoto("/contact")}
                style={{
                  color: "var(--ln-green-600)",
                  cursor: "pointer",
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  padding: 0,
                  font: "inherit",
                }}
              >
                ask us directly
              </button>
              .
            </div>
          )}
        </div>
      </section>

      <StillHave onGoto={onGoto} />
    </MarketingLayout>
  );
}

function Hero({ q, setQ }) {
  return (
    <section className="ln-sub-hero">
      <div className="ln-container">
        <span className="ln-eyebrow">FAQs</span>
        <h1>Answers, not fluff</h1>
        <p>Everything you might ask before signing up — and a lot of what customers ask after.</p>
        <div className="ln-faq-search">
          <FiSearch />
          <input
            type="search"
            name="q"
            aria-label="Search FAQs"
            placeholder="Search questions…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}

function StillHave({ onGoto }) {
  return (
    <section className="ln-cta">
      <div className="ln-container">
        <div className="ln-cta-card">
          <div className="ln-cta-copy">
            <h2>Still have a question?</h2>
            <p>Our team replies within minutes during business hours (10am–8pm IST, Mon–Sat).</p>
          </div>
          <div className="ln-cta-actions">
            <a className="ln-btn ln-btn-primary ln-btn-lg ln-btn-block" href="https://wa.me/917888341096">
              <FaWhatsapp /> Chat on WhatsApp
            </a>
            <button
              type="button"
              className="ln-btn ln-btn-outline-dark ln-btn-lg ln-btn-block"
              onClick={() => onGoto("/contact")}
            >
              Contact sales <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
