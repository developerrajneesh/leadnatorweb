"use client";

import { useState } from "react";
import Link from "next/link";
import { FiArrowRight, FiPhone, FiChevronDown } from "react-icons/fi";
import { FaWhatsapp, FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";
import { APP_LOGIN_URL, APP_SIGNUP_URL } from "@/lib/app-url";
import "./Landing.css";

export default function MarketingLayout({ currentPath, children }) {
  return (
    <div className="ln">
      <Topbar />
      <Nav currentPath={currentPath} />
      {children}
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

function Topbar() {
  return (
    <div className="ln-topbar">
      <div className="ln-container ln-topbar-inner">
        <span className="ln-topbar-badge">
          <span className="ln-topbar-dot" /> Powered by Official WhatsApp APIs, Meta Ads & AI ⚡
        </span>
        <div className="ln-topbar-right">
          <a href="tel:+917888341096"><FiPhone /> Sales: +917888341096</a>
          <a href="https://wa.me/917888341096" className="ln-topbar-wa"><FaWhatsapp /> Chat on WhatsApp</a>
        </div>
      </div>
    </div>
  );
}

function Nav({ currentPath }) {
  const [open, setOpen] = useState(false);
  const LINKS = [
    { to: "/",         label: "Home" },
    { to: "/features", label: "Features" },
    { to: "/pricing",  label: "Pricing" },
    { to: "/partners", label: "Partners" },
    { to: "/compare",  label: "Compare" },
    { to: "/api-docs", label: "Developer API" },
    { to: "/contact",  label: "Contact" },
  ];
  return (
    <header className="ln-nav">
      <div className="ln-container ln-nav-inner">
        <Link href="/" className="ln-brand" onClick={() => setOpen(false)}>
          <span className="ln-brand-lead">Lead</span><span className="ln-brand-nator">nator</span>
        </Link>

        <nav className={`ln-links ${open ? "open" : ""}`} aria-label="Main navigation">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              href={l.to}
              className={currentPath === l.to ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ln-nav-cta">
          <a className="ln-btn ln-btn-ghost" href={APP_LOGIN_URL} rel="nofollow">
            Sign in
          </a>
          <a className="ln-btn ln-btn-primary" href={APP_SIGNUP_URL} rel="nofollow">
            Start FREE Trial <FiArrowRight />
          </a>
        </div>

        <button className="ln-nav-toggle" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          <FiChevronDown />
        </button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="ln-footer">
      <nav className="ln-container ln-footer-grid" aria-label="Site links">
        <div className="ln-footer-brand">
          <Link href="/" className="ln-brand ln-brand-light">
            <span className="ln-brand-lead">Lead</span><span className="ln-brand-nator">nator</span>
          </Link>
          <p className="ln-footer-mission">
            The all-in-one AI growth platform — WhatsApp Cloud API, Meta Ads, Email
            Marketing, Leads CRM, File Storage, Calendar and 20+ AI tools on one login.
          </p>
          <div className="ln-footer-social">
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="YouTube"><FaYoutube /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="https://wa.me/917888341096" aria-label="WhatsApp"><FaWhatsapp /></a>
          </div>
          <div className="ln-footer-badges">
            <span>🏆 Meta Business Partner</span>
            <span>✨ Featured in The Indian Express</span>
            <span>🔐 SOC-2 ready infrastructure</span>
          </div>
        </div>

        <div className="ln-footer-links">
          <FooterCol
            className="ln-footer-col-product"
            title="Product"
            items={[
              { label: "Features",        to: "/features" },
              { label: "Pricing",         to: "/pricing" },
              { label: "Compare",         to: "/compare" },
              { label: "WhatsApp API",    to: "/features#whatsapp" },
              { label: "Meta Ads",        to: "/features#meta" },
              { label: "Email Marketing", to: "/features#email" },
              { label: "AI Studio",       to: "/features#ai" },
            ]}
          />
          <FooterCol
            className="ln-footer-col-resources"
            title="Resources"
            items={[
              { label: "Documentation", to: "/api-docs" },
              { label: "API Reference", to: "/api-docs" },
              { label: "FAQ",           to: "/faq" },
              { label: "Partners",      to: "/partners" },
              { label: "Support",       to: "/contact" },
            ]}
          />
          <FooterCol
            className="ln-footer-col-company"
            title="Company"
            items={[
              { label: "Home",                      to: "/" },
              { label: "About Us",                  to: "/about" },
              { label: "Contact Us",                to: "/contact" },
              { label: "Sign in",                   href: APP_LOGIN_URL, external: true },
              { label: "Sign up",                   href: APP_SIGNUP_URL, external: true },
              { label: "Privacy Policy",            to: "/privacy-policy" },
              { label: "Terms & Conditions",        to: "/terms" },
              { label: "Refund & Cancellation",     to: "/refund-policy" },
            ]}
          />
        </div>
      </nav>

      <div className="ln-container ln-footer-bottom">
        <span suppressHydrationWarning>© {new Date().getFullYear()} Leadnator. Made with ❤️ in India.</span>
        <span className="ln-footer-regions">India · Singapore · UAE · USA</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, items, className = "" }) {
  return (
    <div className={`ln-footer-col ${className}`.trim()}>
      <h4>{title}</h4>
      <ul>
        {items.map((i) => (
          <li key={i.label}>
            {i.external ? (
              <a href={i.href} rel="nofollow">{i.label}</a>
            ) : (
              <Link href={i.to}>{i.label}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FloatingWhatsApp() {
  return (
    <a className="ln-float-wa" href="https://wa.me/917888341096" aria-label="Chat on WhatsApp">
      <FaWhatsapp />
    </a>
  );
}
