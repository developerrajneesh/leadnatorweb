"use client";

import {
  FiArrowRight, FiCheck, FiClock, FiGlobe, FiHeart, FiMapPin, FiShield, FiZap,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { SignupLink } from "@/components/site/AppLinks";

export default function AboutPage({ onGoto }) {

  return (
    <>
<Hero />
      <Mission />
      <StatsBar />
      <Values />
      <Offices />
      <Cta onGoto={onGoto} />
    </>
  );
}

function Hero() {
  return (
    <section className="ln-sub-hero">
      <div className="ln-container">
        <span className="ln-eyebrow">About Us</span>
        <h1>Building the growth stack Indian businesses deserve</h1>
        <p>
          Leadnator unifies WhatsApp Business API, Meta Ads, email marketing, CRM and
          AI automation — so teams can grow without juggling a dozen tools.
        </p>
      </div>
    </section>
  );
}

function Mission() {
  return (
    <section className="ln-section">
      <div className="ln-container ln-form-grid">
        <div>
          <div className="ln-head">
            <span className="ln-eyebrow">Our mission</span>
            <h2>One login. Every growth channel.</h2>
            <p>
              Every growing business in India deserves enterprise-grade marketing tools
              without enterprise complexity or cost. We built Leadnator to replace
              fragmented WhatsApp tools, ad managers and CRMs with one platform that
              works in minutes — not months.
            </p>
          </div>
          <p className="ln-legal-intro">
            From D2C brands and agencies to SaaS startups and local enterprises, we
            help teams capture leads from Meta, nurture them on WhatsApp, follow up
            over email and close deals in a single pipeline.
          </p>
        </div>

        <div className="ln-form">
          <h3 className="ln-form-card-title">Why teams choose us</h3>
          <ul className="ln-form-trust">
            <li><FiCheck /> Official WhatsApp Cloud API — zero markup on Meta rates</li>
            <li><FiCheck /> Meta Ads + Lead Ads synced to your CRM pipeline</li>
            <li><FiCheck /> Email marketing on your own SMTP</li>
            <li><FiCheck /> 20+ AI tools, chatbots and automations included</li>
            <li><FiCheck /> Setup in ~12 minutes with Embedded Signup</li>
            <li><FiCheck /> GST-ready billing and support in English &amp; Hindi</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const STATS = [
    { value: "20+", label: "Growth modules on one login" },
    { value: "12 min", label: "Average setup time" },
    { value: "4", label: "Regions — India, SG, UAE, USA" },
    { value: "24/7", label: "WhatsApp support for customers" },
  ];

  return (
    <section className="ln-stats">
      <div className="ln-container ln-stats-grid">
        {STATS.map(({ value, label }) => (
          <div key={label}>
            <div className="ln-stat-value">{value}</div>
            <div className="ln-stat-label">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Values() {
  const VALUES = [
    {
      Icon: FiZap,
      title: "Speed to value",
      text: "Embedded Signup, one-click Meta OAuth and pre-built templates get you live fast.",
    },
    {
      Icon: FiShield,
      title: "Trust by design",
      text: "Official WhatsApp Cloud API, SOC-2 ready infrastructure and transparent billing in INR.",
    },
    {
      Icon: FiGlobe,
      title: "Built for India, ready globally",
      text: "GST-ready invoicing, local payment methods and offices across India, Singapore, UAE and USA.",
    },
    {
      Icon: FiHeart,
      title: "Customer-first support",
      text: "Real humans on WhatsApp and phone — not ticket black holes. We reply in minutes.",
    },
  ];

  return (
    <section className="ln-section ln-section-tint">
      <div className="ln-container">
        <div className="ln-head">
          <span className="ln-eyebrow">Our values</span>
          <h2>What we stand for</h2>
          <p>Principles that guide every feature we ship and every conversation we have with customers.</p>
        </div>
        <div className="ln-feat-grid">
          {VALUES.map(({ Icon, title, text }) => (
            <div key={title} className="ln-feat">
              <div className="ln-feat-ic"><Icon /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Offices() {
  const OFFICES = [
    { flag: "🇮🇳", country: "India", city: "Mumbai", line: "WeWork Chromium, Powai", tz: "IST (UTC+5:30)" },
    { flag: "🇸🇬", country: "Singapore", city: "Singapore", line: "WeWork, Marina One", tz: "SGT (UTC+8)" },
    { flag: "🇦🇪", country: "UAE", city: "Dubai", line: "DIFC Innovation Hub", tz: "GST (UTC+4)" },
    { flag: "🇺🇸", country: "USA", city: "San Francisco", line: "WeWork, Salesforce Tower", tz: "PST (UTC-8)" },
  ];

  return (
    <section className="ln-section">
      <div className="ln-container">
        <div className="ln-head">
          <span className="ln-eyebrow">Global offices</span>
          <h2>Four cities, one team</h2>
          <p>Follow-the-sun support coverage across India, South-East Asia, Middle East and North America.</p>
        </div>
        <div className="ln-offices">
          {OFFICES.map((o) => (
            <div key={o.country} className="ln-office">
              <div className="ln-office-flag">{o.flag}</div>
              <h3>{o.country}</h3>
              <div className="ln-office-city"><FiMapPin /> {o.city}</div>
              <div className="ln-office-line">{o.line}</div>
              <div className="ln-office-tz"><FiClock /> {o.tz}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cta({ onGoto }) {
  return (
    <section className="ln-cta">
      <div className="ln-container">
        <div className="ln-cta-card">
          <div className="ln-cta-copy">
            <h2>Ready to grow with Leadnator?</h2>
            <p>Start your free trial or talk to our team on WhatsApp — we reply within minutes during business hours.</p>
            <ul className="ln-cta-list">
              <li><FiCheck /> 2-day free trial, no credit card</li>
              <li><FiCheck /> Zero-fee WhatsApp setup</li>
              <li><FiCheck /> Cancel anytime on monthly plans</li>
            </ul>
          </div>
          <div className="ln-cta-actions">
            <SignupLink className="ln-btn ln-btn-primary ln-btn-lg ln-btn-block">
              Start FREE Trial <FiArrowRight />
            </SignupLink>
            <a className="ln-btn ln-btn-outline-dark ln-btn-lg ln-btn-block" href="https://wa.me/917888341096">
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
