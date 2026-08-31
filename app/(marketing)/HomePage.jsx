"use client";

import { useState } from "react";
import {
  FiArrowRight, FiCheck, FiMessageCircle, FiMail, FiTarget, FiZap,
  FiBarChart2, FiLayers, FiUsers, FiCpu, FiTool, FiCalendar,
  FiFolder, FiPhone, FiSend, FiLink,
  FiChevronDown, FiLifeBuoy, FiTrendingUp, FiStar, FiShield, FiPlay,
} from "react-icons/fi";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { SiMeta } from "react-icons/si";
import MarketingArt from "./_sections/MarketingArt";
import IntegrationsHub from "./_sections/IntegrationsHub";
import AIShowcase from "./_sections/AIShowcase";
import PlatformShowcase from "./_sections/PlatformShowcase";
import SeoIntro from "./_sections/SeoIntro";
import ProductPreview from "./_sections/ProductPreview";
import WhyLeadnator from "./_sections/WhyLeadnator";
import TrustProof from "./_sections/TrustProof";
import HierarchyFlow from "./_sections/HierarchyFlow";
import { MarketingLink, SignupLink } from "@/components/site/AppLinks";

export default function HomePage({ onGoto }) {

  return (
    <>
      <Hero onGoto={onGoto} />
      <TrustProof />
      <LogosStrip />
      <SeoIntro />
      <PlatformShowcase />
      <ProductPreview />
      <WhyLeadnator />
      <AiSection onGoto={onGoto} />
      <HierarchyFlow />
      <IntegrationsHub />
      <Testimonials />
      <CtaBanner onGoto={onGoto} />
    </>
  );
}

/* ---------------- PROOF BAND ----------------
   The three proof points used to sit inside the hero copy, where they competed
   with the CTAs for the same corner of the page. On their own full-width band
   they get room to breathe and act as the hand-off into the page. */
function ProofBand() {
  const items = [
    {
      Icon: FiUsers,
      tone: "green",
      body: (
        <>
          <strong className="ln-proof-value">5,000+</strong>{" "}
          <span className="ln-proof-label">businesses across 20+ countries</span>
        </>
      ),
    },
    {
      Icon: FiStar,
      tone: "amber",
      body: (
        <>
          <strong className="ln-proof-value">4.9 / 5</strong>{" "}
          <span className="ln-proof-label">average rating</span>
          <span className="ln-proof-stars">{"★".repeat(5)}</span>
        </>
      ),
    },
    {
      Icon: FiZap,
      tone: "violet",
      body: (
        <>
          <span className="ln-proof-label">Live in </span>
          <strong className="ln-proof-value">12 minutes</strong>{" "}
          <span className="ln-proof-label">no engineering needed</span>
        </>
      ),
    },
  ];
  return (
    <div className="ln-proof-bar">
      {items.map(({ Icon, tone, body }, i) => (
        <div key={i} className="ln-proof-item">
          <span className={`ln-proof-icon ${tone}`}><Icon /></span>
          <div className="ln-proof-copy">{body}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- HERO ---------------- */
const HERO_CHANNELS = [
  { key: "wa",   Icon: FaWhatsapp,  name: "WhatsApp",  note: "Business API" },
  { key: "ig",   Icon: FaInstagram, name: "Instagram", note: "DMs & Comments" },
  { key: "meta", Icon: SiMeta,      name: "Meta Ads",  note: "Lead Ads" },
  { key: "mail", Icon: FiMail,      name: "Email",     note: "Campaigns" },
];

function Hero({ onGoto }) {
  return (
    <section className="ln-hero">
      <div className="ln-hero-grain" />
      <div className="ln-container">
        <div className="ln-hero-grid">
          <div className="ln-hero-copy">
          <span className="ln-hero-pill">
            <FiShield className="ln-hero-pill-icon" />
            <span className="ln-hero-pill-brand">Meta Business Partner</span>
            <span className="ln-hero-pill-sep">•</span>
            <span className="ln-hero-pill-rest">AI-Powered CRM</span>
          </span>

          {/* The channels moved out of this sentence and into the strip below.
              Naming four products mid-headline forced every one of them to be
              styled, which is what kept turning the line into confetti. */}
          <h1 className="ln-hero-title">
            Every lead, chat and campaign —{" "}
            <span className="ln-hero-accent">in one AI-powered CRM.</span>
          </h1>

          <p className="ln-hero-sub">
            Leadnator brings your whole growth stack under one login: WhatsApp Business
            API, Instagram DMs and comments, Meta Lead Ads, email campaigns, a full CRM
            pipeline, 20+ AI tools, file storage and a booking calendar. Set it up in
            12 minutes — no developers, no separate subscriptions.
          </p>

          {/* Every channel gets equal billing here, where there's room to say
              what each one actually connects to. */}
          <div className="ln-hero-channels">
            {HERO_CHANNELS.map(({ key, Icon, name, note }) => (
              <div key={key} className="ln-hero-channel">
                <span className={`ln-hero-channel-icon ${key}`}><Icon /></span>
                <div>
                  <strong>{name}</strong>
                  <span>{note}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="ln-hero-cta">
            <SignupLink className="ln-btn ln-btn-lg ln-btn-hero">
              Start FREE Trial <FiArrowRight />
            </SignupLink>
            <MarketingLink href="/features" className="ln-btn ln-btn-outline ln-btn-lg">
              <FiPlay /> See all features
            </MarketingLink>
          </div>

          <ul className="ln-hero-meta">
            <li><FiCheck /> 2-day free trial</li>
            <li><FiCheck /> No credit card required</li>
            <li><FiCheck /> Zero-fee WhatsApp setup</li>
            <li><FiCheck /> Cancel anytime</li>
          </ul>
          </div>

          <MarketingArt />
        </div>

        <ProofBand />
      </div>
    </section>
  );
}

// eslint-disable-next-line no-unused-vars -- kept for reference, no longer rendered
function PhoneMock() {
  return (
    <div className="ln-phone-wrap">
      <div className="ln-phone">
        <div className="ln-phone-notch" />
        <div className="ln-phone-screen">
          <div className="ln-phone-header">
            <div className="ln-phone-avatar">L</div>
            <div>
              <div className="ln-phone-name">Leadnator <FiCheck style={{ fontSize: 12, color: "#22c55e", verticalAlign: "middle" }} /></div>
              <div className="ln-phone-status">● online</div>
            </div>
          </div>
          <div className="ln-phone-chat">
            <Bubble side="in">👋 Hi! I saw your Meta ad.</Bubble>
            <Bubble side="out">Awesome! Welcome 🎉</Bubble>
            <Bubble side="out">
              <div className="ln-phone-card">
                <div className="ln-phone-card-title">📦 Growth Plan</div>
                <div className="ln-phone-card-price">₹1,499 <small>/ month</small></div>
                <div className="ln-phone-card-btn">View details</div>
              </div>
            </Bubble>
            <Bubble side="in">Show me a demo 🚀</Bubble>
            <Bubble side="out typing"><span /><span /><span /></Bubble>
          </div>
          <div className="ln-phone-input">
            <span>Type a message</span>
            <FiSend style={{ color: "#22c55e" }} />
          </div>
        </div>
      </div>
      <div className="ln-phone-badge ln-phone-badge-1">
        <FiTrendingUp /> +384% reply rate
      </div>
      <div className="ln-phone-badge ln-phone-badge-2">
        <FaWhatsapp style={{ color: "#22c55e" }} /> 98.7% delivered
      </div>
    </div>
  );
}
function Bubble({ side, children }) { return <div className={`ln-bubble ${side}`}>{children}</div>; }

/* ---------------- LOGOS ---------------- */
const LOGO_BRANDS = [
  "Acme Retail", "Kira Labs", "Nova Capital", "Finchly", "Looma",
  "Zenith BPO", "Blueprint", "OneMore", "Veda Foods", "Urban Crate",
  "Spark Commerce", "Helix Health", "Crown Realty", "Swift Logistics",
  "Pixel Mart", "Bloom Skincare", "Craft Studio", "Delta Finance",
  "Everest Edu", "Arjun Textiles", "Nimbus SaaS", "Orbit Media",
];

function LogosStrip() {
  const track = [...LOGO_BRANDS, ...LOGO_BRANDS];

  return (
    <section className="ln-logos" aria-label="Trusted by growing teams">
      <div className="ln-container">
        <p className="ln-logos-sub">Trusted by fast-growing teams across 20+ countries</p>
      </div>
      <div className="ln-logos-marquee" aria-hidden>
        <div className="ln-logos-track">
          {track.map((name, i) => (
            <span key={`${name}-${i}`} className="ln-logo-chip">{name}</span>
          ))}
        </div>
      </div>
      <span className="ln-sr-only">{LOGO_BRANDS.join(", ")}</span>
    </section>
  );
}


/* ---------------- STATS ---------------- */
function Stats() {
  return (
    <section className="ln-stats">
      <div className="ln-container ln-stats-grid">
        <Stat value="5,000+" label="Businesses trust us" />
        <Stat value="2.4B+"   label="Messages delivered" />
        <Stat value="20+"     label="Countries supported" />
        <Stat value="98.7%"   label="Deliverability rate" />
      </div>
    </section>
  );
}
function Stat({ value, label }) {
  return (
    <div className="ln-stat">
      <div className="ln-stat-value">{value}</div>
      <div className="ln-stat-label">{label}</div>
    </div>
  );
}

/* ---------------- WHY US — see _sections/WhyLeadnator.jsx ---------------- */

/* ---------------- AI ---------------- */
function AiSection({ onGoto }) {
  return (
    <section className="ln-ai">
      <div className="ln-container ln-ai-grid">
        <div>
          <span className="ln-eyebrow">AI inside every module</span>
          <h2>Write, score, translate, classify — at the speed of thought</h2>
          <p className="ln-ai-sub">
            Leadnator's AI Studio ships 20+ specialized tools. Write ad copy, craft
            emails, rewrite tone, translate into 40 languages, score lead quality,
            generate hashtags — all powered by GPT-4 and wired into the workflows
            you already run.
          </p>
          <ul className="ln-ai-list">
            <li><FiCheck /> AI ad-copy generator for Meta &amp; Google</li>
            <li><FiCheck /> Email writer with subject-line A/B tester</li>
            <li><FiCheck /> Lead scorer with trainable signals</li>
            <li><FiCheck /> Multi-language translator &amp; rewriter</li>
            <li><FiCheck /> Bring-your-own OpenAI key (bill it to yourself)</li>
          </ul>
          <button className="ln-btn ln-btn-primary" onClick={() => onGoto("/features#ai")}>
            Explore AI Studio <FiArrowRight />
          </button>
        </div>
        <AIShowcase />
      </div>
    </section>
  );
}

/* ---------------- INTEGRATIONS ---------------- */
function Integrations() {
  const INT = [
    "Shopify", "WooCommerce", "Google Sheets", "Razorpay", "Stripe", "Zapier", "Make",
    "Facebook", "Instagram", "Indiamart", "JustDial", "Zoom", "HubSpot", "Salesforce",
    "Calendly", "Tradelindia", "AWS S3", "Cloudflare R2", "Wasabi", "25+ more",
  ];
  return (
    <section className="ln-section">
      <div className="ln-container">
        <SectionHead
          eyebrow="Smooth integrations"
          title="Plug into the stack you already use"
          sub="Native apps for e-commerce, CRMs, payments, storage and no-code tools — or build your own with our REST APIs and webhooks."
        />
        <div className="ln-int-grid">
          {INT.map((n) => <div key={n} className="ln-int">{n}</div>)}
        </div>
      </div>
    </section>
  );
}

/* ---------------- TESTIMONIALS ---------------- */
function Testimonials() {
  const T = [
    { name: "Anita Desai",  role: "Founder · Kira Labs",   quote: "Replaced three tools with Leadnator in a weekend. The WhatsApp chatbot paid for a year of subscription in its first week." },
    { name: "Mohit Khanna", role: "Growth · Nova Capital", quote: "Seeing Meta ads, WhatsApp chats and email campaigns on one dashboard is unreal. Our CPL dropped 38%." },
    { name: "Priya Kapoor", role: "CEO · Finchly",         quote: "Support is embarrassingly fast. Feels like having our own team. I recommend Leadnator to every founder I meet." },
  ];
  return (
    <section className="ln-section ln-section-tint">
      <div className="ln-container">
        <SectionHead eyebrow="Loved by operators" title="Teams ship faster on Leadnator" />
        <div className="ln-test-grid">
          {T.map((t) => (
            <div key={t.name} className="ln-test">
              <div className="ln-test-stars">{"★".repeat(5)}</div>
              <p>"{t.quote}"</p>
              <div className="ln-test-who">
                <div className="ln-test-avatar">{t.name.split(" ").map((w) => w[0]).join("")}</div>
                <div><b>{t.name}</b><span>{t.role}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- PRICING PREVIEW ---------------- */
function PricingPreview({ onGoto }) {
  const plans = [
    { name: "Starter", price: "₹0",     period: "Free forever",  desc: "For solo founders validating an offer.",
      features: ["500 leads", "WhatsApp Cloud API", "Email 500/mo"], highlight: false, cta: "Start free" },
    { name: "Growth",  price: "₹1,499", period: "/ month",       desc: "For teams scaling past product-market fit.",
      features: ["25,000 leads", "All modules included", "AI Studio (GPT-4)"], highlight: true, cta: "Start 2-day trial" },
    { name: "Pro",     price: "₹3,999", period: "/ month",       desc: "For revenue teams living in the CRM.",
      features: ["Unlimited leads", "API + webhooks", "Dedicated CSM"], highlight: false, cta: "Talk to sales" },
  ];
  return (
    <section className="ln-section">
      <div className="ln-container">
        <SectionHead
          eyebrow="Simple pricing"
          title="Pay only when you grow"
          sub="Start free. Upgrade the day you hit a limit. Downgrade anytime."
        />
        <div className="ln-price-grid">
          {plans.map((p) => (
            <div key={p.name} className={`ln-price ${p.highlight ? "pop" : ""}`}>
              {p.highlight && <span className="ln-price-tag">Most popular</span>}
              <h3>{p.name}</h3>
              <p className="ln-price-desc">{p.desc}</p>
              <div className="ln-price-amount">
                <span className="num">{p.price}</span>
                <span className="per">{p.period}</span>
              </div>
              <SignupLink className={`ln-btn ${p.highlight ? "ln-btn-primary" : "ln-btn-outline"} ln-btn-block`}>
                {p.cta}
              </SignupLink>
              <ul>{p.features.map((f) => <li key={f}><FiCheck /> {f}</li>)}</ul>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <MarketingLink href="/pricing" className="ln-link-arrow">See full pricing & feature matrix <FiArrowRight /></MarketingLink>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ PREVIEW ---------------- */
function FaqPreview({ onGoto }) {
  const F = [
    { q: "What does Leadnator do?",                          a: "Leadnator is an all-in-one growth CRM that ships WhatsApp Cloud API, Meta Ads, Email marketing, lead pipeline, AI Studio, file storage and booking calendar behind one login." },
    { q: "Do I need a Meta developer account?",              a: "No. Our Embedded Signup creates your WhatsApp Business Account, registers your number and issues a permanent token in one popup." },
    { q: "Can I bring my own SMTP and S3 bucket?",           a: "Yes — Email uses your SMTP (SES, Gmail, SendGrid). Files live in your S3/R2/Supabase bucket. We never host your data by default." },
    { q: "Is there a free plan?",                            a: "Yes. Starter is free forever for up to 500 leads. No card required to sign up." },
    { q: "How do I talk to support?",                        a: "Open a ticket or live-chat the team from inside the app. Replies in minutes during business hours." },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="ln-section ln-section-soft">
      <div className="ln-container ln-faq-wrap">
        <SectionHead eyebrow="FAQ" title="Frequently asked questions" sub="Quick answers. See the full list on the FAQ page." />
        <div className="ln-faq">
          {F.map((f, i) => (
            <div key={i} className={`ln-faq-item ${open === i ? "open" : ""}`} onClick={() => setOpen(open === i ? -1 : i)}>
              <div className="ln-faq-q">{f.q}<FiChevronDown /></div>
              {open === i && <div className="ln-faq-a">{f.a}</div>}
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <MarketingLink href="/faq" className="ln-link-arrow">View all FAQs <FiArrowRight /></MarketingLink>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA BANNER ---------------- */
function CtaBanner({ onGoto }) {
  return (
    <section className="ln-cta">
      <div className="ln-container">
        <div className="ln-cta-card">
          <div className="ln-cta-copy">
            <h2>Ready to 10× your sales?</h2>
            <p>Start your 2-day free trial. No credit card. Cancel anytime. Setup in under 12 minutes.</p>
            <ul className="ln-cta-list">
              <li><FiCheck /> All modules unlocked in the trial</li>
              <li><FiCheck /> Personalised onboarding</li>
              <li><FiCheck /> Blue-tick verification help</li>
            </ul>
          </div>
          <div className="ln-cta-actions">
            <SignupLink className="ln-btn ln-btn-primary ln-btn-lg ln-btn-block">
              Start FREE Trial <FiArrowRight />
            </SignupLink>
            <a className="ln-btn ln-btn-outline-dark ln-btn-lg ln-btn-block" href="https://wa.me/917888341096">
              <FaWhatsapp /> Chat on WhatsApp
            </a>
            <div className="ln-cta-call">
              <FiPhone /> Sales: <a href="tel:+917888341096">+917888341096</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title, sub }) {
  return (
    <div className="ln-head">
      {eyebrow && <div className="ln-eyebrow">{eyebrow}</div>}
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </div>
  );
}
