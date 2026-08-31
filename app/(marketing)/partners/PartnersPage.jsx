"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiArrowRight, FiAward, FiBookOpen, FiCheck, FiCheckCircle,
  FiChevronDown, FiCode, FiDollarSign, FiGlobe, FiHeadphones, FiLayers,
  FiLifeBuoy, FiMail, FiMapPin, FiMonitor, FiPercent, FiShield, FiTarget,
  FiTrendingUp, FiUsers, FiX, FiZap,
} from "react-icons/fi";
import {
  PARTNER_APPLY_EVENT,
  PARTNER_BECOME_HASH,
  shouldOpenPartnerApplyForm,
} from "@/lib/partners/form-nav";

const PARTNERS = [
  { name: "Meta Business", desc: "Official WhatsApp & Facebook Ads integrations — embedded signup, lead sync, CTWA campaigns.", logo: "Ⓜ️", category: "Official" },
  { name: "Stripe", desc: "Secure global payment infrastructure for subscriptions, invoices and partner payouts.", logo: "💳", category: "Payments" },
  { name: "Twilio", desc: "Cloud communications backbone for SMS fallbacks and voice verification flows.", logo: "📞", category: "Telecom" },
  { name: "Google Cloud", desc: "Scalable infrastructure, AI services and enterprise-grade security compliance.", logo: "☁️", category: "Infrastructure" },
  { name: "HubSpot", desc: "CRM & marketing automation sync — bi-directional lead and deal updates.", logo: "🧡", category: "CRM" },
  { name: "Zapier", desc: "Connect 5,000+ apps without code. Trigger flows from any Leadnator event.", logo: "⚡", category: "Automation" },
  { name: "Shopify", desc: "E-commerce order sync, abandoned-cart WhatsApp nudges and catalog integration.", logo: "🛍️", category: "E-commerce" },
  { name: "Zendesk", desc: "Unified customer support — tickets from WhatsApp, email and Meta in one desk.", logo: "🤝", category: "Support" },
];

const PARTNER_TYPES = [
  {
    Icon: FiTarget,
    color: "#22c55e",
    bg: "#ecfdf5",
    title: "Marketing Agencies",
    text: "Offer WhatsApp + Meta growth as a managed service. White-label dashboards, client sub-accounts and recurring revenue on every seat.",
    tags: ["White-label", "Client billing", "Campaign mgmt"],
  },
  {
    Icon: FiCode,
    color: "#3b82f6",
    bg: "#eff6ff",
    title: "System Integrators",
    text: "Build custom workflows on our API. Connect ERPs, billing systems, inventory tools and bespoke automations for enterprise clients.",
    tags: ["REST API", "Webhooks", "Custom flows"],
  },
  {
    Icon: FiBookOpen,
    color: "#f59e0b",
    bg: "#fffbeb",
    title: "Consultants & Trainers",
    text: "Train teams on WhatsApp marketing, Meta ads and AI-powered CRM. Co-branded workshops, certification and referral commissions.",
    tags: ["Workshops", "Certification", "Referrals"],
  },
  {
    Icon: FiLayers,
    color: "#a855f7",
    bg: "#faf5ff",
    title: "Technology Partners",
    text: "SaaS products that complement Leadnator — payment gateways, analytics, HR tools. Joint GTM, marketplace listing and co-selling.",
    tags: ["Marketplace", "Co-sell", "Integration"],
  },
];

const BENEFITS = [
  { Icon: FiPercent, color: "#16a34a", bg: "#ecfdf5", title: "Recurring revenue share", text: "Earn on every client subscription you bring — monthly recurring commissions with transparent payout reports." },
  { Icon: FiMonitor, color: "#2563eb", bg: "#eff6ff", title: "White-label ready", text: "Your logo, your domain, your client experience. Agencies can resell under their own brand from day one." },
  { Icon: FiHeadphones, color: "#d97706", bg: "#fffbeb", title: "Priority partner support", text: "Dedicated partner desk, faster SLAs and direct access to our engineering team for escalations." },
  { Icon: FiZap, color: "#7c3aed", bg: "#f5f3ff", title: "Early feature access", text: "Beta APIs, new modules and AI tools before public launch — stay ahead of your competition." },
  { Icon: FiAward, color: "#db2777", bg: "#fdf2f8", title: "Co-marketing & events", text: "Joint webinars, case studies, event booths and featured placement on our website and newsletters." },
  { Icon: FiShield, color: "#0891b2", bg: "#ecfeff", title: "Enterprise-grade trust", text: "Meta Business Partner status, official WhatsApp Cloud API, GDPR-ready data handling — sell with confidence." },
];

const STEPS = [
  { num: "01", title: "Apply online", text: "Fill the partnership form with your company profile, audience and the type of collaboration you're looking for." },
  { num: "02", title: "Discovery call", text: "Our partner team reviews your application and schedules a 30-minute fit call within 2 business days." },
  { num: "03", title: "Onboarding", text: "Get partner credentials, sales collateral, demo environment access and technical documentation." },
  { num: "04", title: "Go live & earn", text: "Start onboarding clients, run campaigns and earn recurring revenue with monthly payout statements." },
];

const TIERS = [
  {
    badge: "Starter",
    name: "Referral Partner",
    desc: "Perfect for consultants, freelancers and influencers who recommend Leadnator to their network.",
    perks: ["15% recurring commission", "Unique referral link & tracking", "Partner portal access", "Email support"],
    featured: false,
  },
  {
    badge: "Most popular",
    name: "Solution Partner",
    desc: "For agencies and integrators who implement, manage and grow client accounts on the platform.",
    perks: ["25% recurring commission", "White-label client dashboards", "Priority partner desk", "Co-branded marketing kit", "Beta feature access"],
    featured: true,
  },
  {
    badge: "Enterprise",
    name: "Strategic Partner",
    desc: "For large agencies, SaaS platforms and regional distributors with volume commitments.",
    perks: ["Custom revenue share", "Dedicated account manager", "Joint GTM & events", "Custom SLA & integrations", "Marketplace listing"],
    featured: false,
  },
];

const STORIES = [
  {
    quote: "We moved 40+ clients from scattered tools to Leadnator in 3 months. WhatsApp + Meta in one CRM cut our ops time by half and doubled our retainer value.",
    name: "Rahul Mehta",
    role: "Founder, GrowthStack Agency · Mumbai",
    initials: "RM",
    bg: "#3b82f6",
    metric: "+112% avg. client retainer",
  },
  {
    quote: "As a Meta ads specialist, Leadnator's lead sync and CTWA integration sold itself. My referral commissions now cover my own subscription costs 3× over.",
    name: "Priya Sharma",
    role: "Performance Marketer · Delhi NCR",
    initials: "PS",
    bg: "#ec4899",
    metric: "₹45K+/mo partner earnings",
  },
  {
    quote: "We built a Shopify + WhatsApp automation practice on Leadnator's API. Enterprise clients love the custom flows — and we love the strategic partner terms.",
    name: "Arjun Patel",
    role: "CTO, Nexa Integrations · Bangalore",
    initials: "AP",
    bg: "#16a34a",
    metric: "12 enterprise deployments",
  },
];

const FAQ = [
  {
    q: "Who can become a Leadnator partner?",
    a: "Marketing agencies, digital consultants, system integrators, SaaS platforms, training institutes and anyone serving SMB or enterprise clients in India and abroad. If you help businesses grow with WhatsApp, Meta ads or CRM — you're a fit.",
  },
  {
    q: "How does the revenue share work?",
    a: "Referral Partners earn 15% recurring commission on every active subscription they refer. Solution Partners earn 25% on clients they onboard and manage. Strategic Partners negotiate custom terms based on volume. Payouts are processed monthly via bank transfer.",
  },
  {
    q: "Do I need technical skills to partner?",
    a: "Not for Referral or Solution Partner tiers — we provide sales decks, demo accounts and onboarding support. System Integrators and Technology Partners should be comfortable with APIs and webhooks; our docs and partner engineering team will help.",
  },
  {
    q: "Can I white-label Leadnator for my agency clients?",
    a: "Yes. Solution Partners and above get white-label client dashboards — your logo, your domain mapping options and client-facing branding. Your clients see your agency, powered by Leadnator under the hood.",
  },
  {
    q: "What support do partners get?",
    a: "All partners get access to the partner portal with collateral, tracking and training. Solution Partners get priority partner desk support. Strategic Partners get a dedicated account manager and custom SLAs.",
  },
  {
    q: "How long does the application process take?",
    a: "We review applications within 1–2 business days. After a short discovery call, approved partners are onboarded within a week with credentials, training and go-to-market materials.",
  },
];

const RESOURCES = [
  { Icon: FiBookOpen, title: "Partner Playbook", desc: "Sales scripts, objection handling and positioning guides.", href: "/contact" },
  { Icon: FiCode, title: "Developer API", desc: "REST endpoints, webhooks and integration examples.", href: "/api-docs" },
  { Icon: FiLayers, title: "Brand Kit", desc: "Logos, colours, screenshots and co-marketing templates.", href: "/contact" },
  { Icon: FiLifeBuoy, title: "Partner Desk", desc: "Dedicated support channel for active partners.", href: "/contact" },
];

const INDIA_FOCUS = [
  { Icon: FiDollarSign, color: "#16a34a", bg: "#ecfdf5", title: "INR billing via Razorpay", text: "Clients pay in rupees. UPI, cards, netbanking — no forex headaches for Indian SMBs." },
  { Icon: FiMapPin, color: "#2563eb", bg: "#eff6ff", title: "India-first support", text: "Partner desk in IST timezone. Hindi & English support. WhatsApp-first communication." },
  { Icon: FiUsers, color: "#d97706", bg: "#fffbeb", title: "SMB to enterprise", text: "From solo consultants to 500-seat agencies — plans from ₹299/mo to custom enterprise." },
  { Icon: FiTrendingUp, color: "#7c3aed", bg: "#f5f3ff", title: "Growing market", text: "WhatsApp has 500M+ users in India. Meta ads spend is booming. Ride the wave with us." },
];

const EMPTY_FORM = { name: "", phone: "", email: "", company: "", reason: "", website: "" };

function PartnerApplyForm({ open, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/public/partners/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "We couldn't submit your application. Please try again.");
        return;
      }
      setSent(true);
    } catch {
      setError("Something went wrong on our end. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function handleClose() {
    setSent(false);
    setForm(EMPTY_FORM);
    setError("");
    onClose();
  }

  return (
    <div className="sl-modal-backdrop" onClick={handleClose} role="presentation">
      <div
        className="sl-modal ln-partner-modal"
        role="dialog"
        aria-labelledby="partner-form-title"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sl-modal-head">
          <div className="sl-modal-head-copy">
            <h2 id="partner-form-title">Apply for Partnership</h2>
            <p>Tell us about your company and why you want to partner with Leadnator.</p>
          </div>
          <button type="button" className="sl-modal-close" onClick={handleClose} aria-label="Close">
            <FiX aria-hidden />
          </button>
        </div>

        {sent ? (
          <div className="ln-form-done ln-partner-form-done">
            <div className="ln-form-done-ic"><FiCheck /></div>
            <h3>Application received!</h3>
            <p>Thanks {form.name || ""} — our partner team will review your application and reach out at <b>{form.email}</b> soon.</p>
            <button type="button" className="ln-btn ln-btn-primary ln-btn-lg" onClick={handleClose}>
              Close
            </button>
          </div>
        ) : (
          <form className="ln-form sl-modal-form" onSubmit={submit}>
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
            />
            <div className="ln-form-row">
              <label>
                <span>Full name *</span>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
              <label>
                <span>Phone number *</span>
                <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
              </label>
            </div>
            <div className="ln-form-row">
              <label>
                <span>Work email *</span>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
              <label>
                <span>Company name *</span>
                <input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              </label>
            </div>
            <label>
              <span>Why do you want to partner with us? *</span>
              <textarea
                required
                rows={5}
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="Tell us about your business, audience, and what kind of partnership you're looking for…"
              />
            </label>
            {error ? <p className="ln-form-error">{error}</p> : null}
            <div className="sl-modal-actions">
              <button type="button" className="ln-btn ln-btn-outline" onClick={handleClose}>Cancel</button>
              <button type="submit" className="ln-btn ln-btn-primary" disabled={busy}>
                {busy ? "Submitting…" : "Submit application"} <FiArrowRight />
              </button>
            </div>
            <p className="ln-form-privacy"><FiGlobe /> We reply within 1–2 business days. No spam.</p>
          </form>
        )}
      </div>
    </div>
  );
}

function PartnerFaq() {
  const [open, setOpen] = useState(0);
  return (
    <div className="ln-faq">
      {FAQ.map((f, i) => (
        <div
          key={f.q}
          className={`ln-faq-item ${open === i ? "open" : ""}`}
          onClick={() => setOpen(open === i ? -1 : i)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setOpen(open === i ? -1 : i); }}
          role="button"
          tabIndex={0}
        >
          <div className="ln-faq-q">{f.q}<FiChevronDown /></div>
          {open === i && <div className="ln-faq-a">{f.a}</div>}
        </div>
      ))}
    </div>
  );
}

export default function PartnersPage() {
  const pathname = usePathname();
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    if (pathname !== "/partners") return;

    function openFromIntent() {
      if (!shouldOpenPartnerApplyForm()) return;
      setFormOpen(true);
      requestAnimationFrame(() => {
        document.getElementById("become")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    function openFromNav() {
      setFormOpen(true);
    }

    openFromIntent();
    const t = window.setTimeout(openFromIntent, 0);

    window.addEventListener("hashchange", openFromIntent);
    window.addEventListener(PARTNER_APPLY_EVENT, openFromNav);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("hashchange", openFromIntent);
      window.removeEventListener(PARTNER_APPLY_EVENT, openFromNav);
    };
  }, [pathname]);

  const openForm = () => {
    setFormOpen(true);
    if (typeof window !== "undefined" && window.location.hash !== PARTNER_BECOME_HASH) {
      window.history.replaceState(null, "", `${pathname}${PARTNER_BECOME_HASH}`);
    }
  };

  return (
    <>
      <div className="ln">
        <section className="ln-hero ln-section">
          <div className="ln-hero-grain" />
          <div className="ln-container ln-hero-grid">
            <div className="ln-hero-copy">
              <div className="ln-hero-pill">PARTNER PROGRAM · INDIA & GLOBAL</div>
              <h1>
                Grow your business with <span className="ln-hero-hl">India&apos;s #1</span> WhatsApp & Meta growth platform
              </h1>
              <p className="ln-hero-sub">
                Join 500+ agencies, consultants and integrators earning recurring revenue by
                helping clients automate WhatsApp, Meta ads, email and AI-powered CRM — all from one dashboard.
              </p>
              <div className="ln-partners-chips">
                <span className="ln-partners-chip">Meta Business Partner</span>
                <span className="ln-partners-chip">Official WhatsApp API</span>
                <span className="ln-partners-chip">White-label ready</span>
              </div>
              <div className="ln-hero-cta">
                <button type="button" className="ln-btn ln-btn-primary ln-btn-lg" onClick={openForm}>
                  Become a Partner <FiArrowRight />
                </button>
                <a href="#ecosystem" className="ln-btn ln-btn-outline ln-btn-lg">
                  View Ecosystem
                </a>
              </div>
              <div className="ln-partners-hero-stats">
                <div className="ln-partners-hero-stat">
                  <strong>500+</strong>
                  <span>Active partners</span>
                </div>
                <div className="ln-partners-hero-stat">
                  <strong>25%</strong>
                  <span>Max commission</span>
                </div>
                <div className="ln-partners-hero-stat">
                  <strong>5,000+</strong>
                  <span>Businesses served</span>
                </div>
                <div className="ln-partners-hero-stat">
                  <strong>12 min</strong>
                  <span>Avg. client setup</span>
                </div>
              </div>
            </div>
            <div className="ln-partners-art-wrap">
              <div className="ln-partners-art">
                <FiGlobe className="globe-icon" aria-hidden />
                <div className="node node-1" />
                <div className="node node-2" />
                <div className="node node-3" />
              </div>
            </div>
          </div>
        </section>

        <section className="ln-partners-intro">
          <div className="ln-partners-intro-glow" />
          <div className="ln-container ln-partners-intro-grid">
            <div className="ln-partners-intro-copy">
              <span className="ln-eyebrow">Why Leadnator Partners Win</span>
              <h2>
                The platform your clients <span style={{ color: "#16a34a" }}>actually need</span> — not another tool to juggle
              </h2>
              <p>
                Indian SMBs are drowning in disconnected apps: one for WhatsApp, another for Meta ads,
                a third for email, and spreadsheets for leads. <strong>Leadnator unifies everything</strong> —
                and partners who bring this stack to clients build stickier, higher-value relationships.
              </p>
              <p>
                Whether you run a 5-person agency in Jaipur or a 200-seat integrator in Bangalore,
                our partner program gives you the product, support and margins to scale without building from scratch.
              </p>
              <ul className="ln-partners-intro-list">
                <li><FiCheckCircle /> No markup on Meta & WhatsApp — clients pay platforms at cost</li>
                <li><FiCheckCircle /> Embedded Signup — onboard a client&apos;s WABA in under 12 minutes</li>
                <li><FiCheckCircle /> INR pricing from ₹299/mo — easy sell for Indian SMBs</li>
                <li><FiCheckCircle /> AI Studio, automations, CRM, calendar — 14 modules, one login</li>
              </ul>
            </div>
            <div className="ln-partners-intro-visual">
              <h3>Partner impact snapshot</h3>
              <div className="ln-partners-metric-row">
                <div className="ln-partners-metric">
                  <strong>₹2.4L</strong>
                  <span>Avg. annual partner earnings (Solution tier)</span>
                </div>
                <div className="ln-partners-metric">
                  <strong>18</strong>
                  <span>Avg. clients per agency partner</span>
                </div>
                <div className="ln-partners-metric">
                  <strong>94%</strong>
                  <span>Partner retention rate (2025)</span>
                </div>
                <div className="ln-partners-metric">
                  <strong>48h</strong>
                  <span>From application to onboarding</span>
                </div>
                <div className="ln-partners-metric ln-partners-metric--wide">
                  <strong>14 modules · 1 platform</strong>
                  <span>WhatsApp, Meta Ads, Instagram, Email, CRM, AI, Calendar, Storage & more</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ln-section">
          <div className="ln-container">
            <div className="ln-head">
              <span className="ln-eyebrow">Partner Tracks</span>
              <h2>Who can partner with Leadnator?</h2>
              <p>Four proven paths — pick the one that matches your business model and start earning.</p>
            </div>
            <div className="ln-partners-types-grid">
              {PARTNER_TYPES.map((t) => (
                <div key={t.title} className="ln-partners-type-card">
                  <div className="ln-partners-type-ic" style={{ background: t.bg, color: t.color }}>
                    <t.Icon aria-hidden />
                  </div>
                  <h3>{t.title}</h3>
                  <p>{t.text}</p>
                  <div className="ln-partners-type-tags">
                    {t.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ln-section ln-partners-benefits">
          <div className="ln-container">
            <div className="ln-head">
              <span className="ln-eyebrow">Partner Benefits</span>
              <h2>Everything you need to sell, deliver and scale</h2>
              <p>We don&apos;t just give you a login — we give you a growth engine with margins built in.</p>
            </div>
            <div className="ln-partners-benefits-grid">
              {BENEFITS.map((b) => (
                <div key={b.title} className="ln-partners-benefit">
                  <div className="ln-partners-benefit-ic" style={{ background: b.bg, color: b.color }}>
                    <b.Icon aria-hidden />
                  </div>
                  <h3>{b.title}</h3>
                  <p>{b.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ln-section ln-section-tint">
          <div className="ln-container">
            <div className="ln-head">
              <span className="ln-eyebrow">How It Works</span>
              <h2>From application to first payout in 4 steps</h2>
              <p>A streamlined onboarding process — no bureaucracy, no waiting weeks.</p>
            </div>
            <div className="ln-partners-steps">
              {STEPS.map((s) => (
                <div key={s.num} className="ln-partners-step">
                  <div className="ln-partners-step-num">{s.num}</div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <button type="button" className="ln-btn ln-btn-primary ln-btn-lg" onClick={openForm}>
                Start your application <FiArrowRight />
              </button>
            </div>
          </div>
        </section>

        <section className="ln-section ln-partners-tiers">
          <div className="ln-container">
            <div className="ln-head">
              <span className="ln-eyebrow">Partner Tiers</span>
              <h2>Choose the partnership level that fits you</h2>
              <p>Start as a Referral Partner and upgrade as you grow — no lock-in, no minimums on entry tier.</p>
            </div>
            <div className="ln-partners-tiers-grid">
              {TIERS.map((tier) => (
                <div
                  key={tier.name}
                  className={`ln-partners-tier${tier.featured ? " ln-partners-tier--featured" : ""}`}
                >
                  <span className="ln-partners-tier-badge">{tier.badge}</span>
                  <h3>{tier.name}</h3>
                  <p className="ln-partners-tier-desc">{tier.desc}</p>
                  <ul>
                    {tier.perks.map((perk) => (
                      <li key={perk}><FiCheck aria-hidden /> {perk}</li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className={`ln-btn ln-btn-lg${tier.featured ? " ln-btn-yellow" : " ln-btn-outline"}`}
                    onClick={openForm}
                  >
                    Apply now <FiArrowRight />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="ecosystem" className="ln-section ln-section-tint">
          <div className="ln-container">
            <div className="ln-head">
              <span className="ln-eyebrow">Technology Ecosystem</span>
              <h2>Built on the world&apos;s most trusted platforms</h2>
              <p>
                Leadnator integrates natively with the tools your clients already use —
                so you sell a complete stack, not a standalone app.
              </p>
            </div>
            <div className="ln-partners-grid">
              {PARTNERS.map((p) => (
                <div key={p.name} className="ln-partner-card">
                  <div className="ln-partner-badge">{p.category}</div>
                  <div className="ln-partner-logo">{p.logo}</div>
                  <h3>{p.name}</h3>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ln-stats">
          <div className="ln-container ln-stats-grid">
            <div>
              <div className="ln-stat-value">500+</div>
              <div className="ln-stat-label">Verified Partners</div>
            </div>
            <div>
              <div className="ln-stat-value">99.9%</div>
              <div className="ln-stat-label">Platform Uptime</div>
            </div>
            <div>
              <div className="ln-stat-value">5,000+</div>
              <div className="ln-stat-label">Businesses Onboarded</div>
            </div>
            <div>
              <div className="ln-stat-value">24/7</div>
              <div className="ln-stat-label">Partner Desk</div>
            </div>
          </div>
        </section>

        <section className="ln-section">
          <div className="ln-container">
            <div className="ln-head">
              <span className="ln-eyebrow">Partner Success</span>
              <h2>Real partners, real results</h2>
              <p>Hear from agencies and consultants who built recurring revenue on Leadnator.</p>
            </div>
            <div className="ln-partners-stories-grid">
              {STORIES.map((s) => (
                <div key={s.name} className="ln-partners-story">
                  <p className="ln-partners-story-quote">{s.quote}</p>
                  <div className="ln-partners-story-author">
                    <div className="ln-partners-story-avatar" style={{ background: s.bg }}>{s.initials}</div>
                    <div>
                      <strong>{s.name}</strong>
                      <span>{s.role}</span>
                    </div>
                  </div>
                  <div className="ln-partners-story-metric">{s.metric}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ln-section ln-section-tint">
          <div className="ln-container">
            <div className="ln-head">
              <span className="ln-eyebrow">Partner Resources</span>
              <h2>Tools to sell, onboard and support clients</h2>
              <p>Everything approved partners need — from sales collateral to API documentation.</p>
            </div>
            <div className="ln-partners-resources-grid">
              {RESOURCES.map((r) => (
                <Link key={r.title} href={r.href} className="ln-partners-resource">
                  <div className="ln-partners-resource-ic"><r.Icon aria-hidden /></div>
                  <strong>{r.title}</strong>
                  <span>{r.desc}</span>
                  <span className="ln-link-arrow">Explore <FiArrowRight /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="ln-section">
          <div className="ln-container ln-faq-wrap">
            <div className="ln-head">
              <span className="ln-eyebrow">FAQ</span>
              <h2>Partner program questions</h2>
              <p>Everything you need to know before applying.</p>
            </div>
            <PartnerFaq />
          </div>
        </section>

        <section className="ln-section ln-section-tint">
          <div className="ln-container">
            <div className="ln-head">
              <span className="ln-eyebrow">Built for India</span>
              <h2>Local pricing, global capabilities</h2>
            </div>
            <div className="ln-partners-benefits-grid" style={{ marginTop: 0 }}>
              {INDIA_FOCUS.map((item) => (
                <div key={item.title} className="ln-partners-benefit">
                  <div className="ln-partners-benefit-ic" style={{ background: item.bg, color: item.color }}>
                    <item.Icon aria-hidden />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="become" className="ln-cta ln-section">
          <div className="ln-container">
            <div className="ln-cta-card">
              <div className="ln-cta-copy">
                <h2>Ready to join our partner ecosystem?</h2>
                <p>
                  Apply today and start earning recurring revenue while helping businesses
                  grow with WhatsApp, Meta ads and AI-powered automation.
                </p>
                <ul className="ln-cta-list">
                  <li><FiCheckCircle /> Up to 25% recurring commission</li>
                  <li><FiCheckCircle /> White-label & co-marketing support</li>
                  <li><FiCheckCircle /> Priority partner desk & beta access</li>
                  <li><FiCheckCircle /> Onboarding within 48 hours</li>
                </ul>
              </div>
              <div className="ln-cta-actions">
                <button type="button" className="ln-btn ln-btn-yellow ln-btn-lg" onClick={openForm}>
                  Apply for Partnership
                </button>
                <div className="ln-cta-call">
                  Questions? <Link href="/contact">Contact Partner Desk</Link>
                  {" · "}
                  <a href="mailto:partners@leadnator.com"><FiMail style={{ verticalAlign: "-2px" }} /> partners@leadnator.com</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <PartnerApplyForm open={formOpen} onClose={() => setFormOpen(false)} />
    </>
  );
}
