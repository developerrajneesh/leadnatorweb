"use client";

import { useEffect, useRef, useState } from "react";
import {
  FiArrowRight, FiCheck, FiMessageCircle, FiMail, FiUsers, FiCpu,
  FiLayers, FiBarChart2, FiFolder, FiCalendar, FiTool, FiLifeBuoy,
  FiLink, FiZap, FiSend, FiTarget, FiShoppingBag, FiCreditCard,
  FiClock, FiPhone, FiFileText, FiInbox, FiPlus, FiTrendingUp, FiLock, FiStar,
} from "react-icons/fi";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { SiMeta } from "react-icons/si";
import { SignupLink } from "@/components/site/AppLinks";
import ModuleVisual from "./FeatureVisuals";

/**
 * Every marketing section here is semantically an <article> with a deep-link
 * id (#whatsapp, #meta, #email, …) so we can deep-link from the Home page
 * module tiles and from SEO landing sitemaps.
 */
const MODULES = [
  {
    id: "whatsapp", Icon: FaWhatsapp, color: "#22c55e", short: "WhatsApp",
    eyebrow: "WhatsApp Marketing",
    title: "Official WhatsApp Business Cloud API — full stack",
    sub: "Everything you need to run WhatsApp-first growth: broadcasts, templates, live inbox, AI chatbot, CTWA ads, catalog and payments.",
    features: [
      { Icon: FiSend,         title: "Unlimited broadcasting",   text: "Reach thousands with a single click. Schedule campaigns, track opens and read rates, and segment by tags." },
      { Icon: FiCpu,          title: "AI no-code chatbot",       text: "Drag-and-drop flow builder with branching, API calls, conditionals, and GPT-powered replies." },
      { Icon: FiInbox,        title: "Multi-agent shared inbox", text: "Role-based / round-robin routing, quick replies, labels, ticketing, mark-as-important, agent analytics." },
      { Icon: FiTarget,       title: "Click-to-WhatsApp ads",    text: "Launch CTWA campaigns from Meta Ads Manager and capture every click into your Leadnator CRM." },
      { Icon: FiShoppingBag,  title: "Catalog & e-commerce",     text: "Product catalog, cart, checkout. Native Shopify + WooCommerce sync for inventory and orders." },
      { Icon: FiCreditCard,   title: "WhatsApp Payments",        text: "Accept UPI & card payments inside the chat. Auto-collect + reminders + retry logic." },
    ],
  },
  {
    id: "meta", Icon: SiMeta, color: "#1877f2", short: "Meta Ads",
    eyebrow: "Meta Ads",
    title: "Full Meta Marketing API — campaigns, adsets, ads, audiences",
    sub: "Create, run and analyze Facebook + Instagram campaigns without leaving the CRM. Lead forms sync into your pipeline instantly.",
    features: [
      { Icon: FiPlus,         title: "Campaign creator wizard",  text: "Step-by-step wizard for Lead Gen, Traffic, Conversions, Engagement and Messages objectives." },
      { Icon: FiFileText,     title: "Lead form sync",           text: "Every Meta Lead Ads submission flows into your CRM via webhook — with full lead metadata and ad attribution." },
      { Icon: FiBarChart2,    title: "Real-time ad analytics",   text: "Live spend, CPC, CPM, CTR, conversions and CPL for every ad, adset and campaign." },
      { Icon: FiUsers,        title: "Custom audiences",         text: "Build lookalikes from your CRM leads. Retarget WhatsApp contacts. Sync audiences to Meta." },
      { Icon: FiTrendingUp,   title: "A/B creative testing",     text: "Run split-test campaigns with auto-budget shifting. Identify winners with statistical significance." },
      { Icon: FiLink,         title: "Lead webhook capture",     text: "Page-level Meta webhook auto-discovery — add a page once and every new lead flows in forever." },
    ],
  },
  {
    id: "instagram", Icon: FaInstagram, color: "#e1306c", short: "Instagram",
    eyebrow: "Instagram Automations",
    title: "Turn every comment, DM and story mention into a lead",
    sub: "DM inbox, comment auto-replies, keyword triggers, story mentions and lead capture — all from one place.",
    features: [
      { Icon: FiMessageCircle,title: "Comment auto-replies",     text: "Reply to every comment on posts and reels instantly — and follow up in DMs automatically." },
      { Icon: FiInbox,        title: "Unified DM inbox",         text: "All Instagram DMs beside WhatsApp in one multi-agent inbox with labels, assignment and quick replies." },
      { Icon: FiZap,          title: "Keyword triggers",         text: "\"PRICE\", \"LINK\", \"DEMO\" — keywords in comments or DMs fire instant automated flows." },
      { Icon: FiStar,         title: "Story mentions & replies", text: "Auto-thank story mentions and turn story replies into full conversations." },
      { Icon: FiTarget,       title: "DM lead capture",          text: "Every conversation becomes a CRM lead with full source attribution — zero manual entry." },
      { Icon: FaWhatsapp,     title: "Instagram → WhatsApp handoff", text: "Move hot IG conversations to WhatsApp in one tap for payments, catalogs and follow-ups." },
    ],
  },
  {
    id: "email", Icon: FiMail, color: "#ea4335", short: "Email",
    eyebrow: "Email Marketing",
    title: "Bring-your-own-SMTP email that actually delivers",
    sub: "Route email through your Amazon SES, Gmail, SendGrid or any SMTP. Zero markups. Full delivery analytics.",
    features: [
      { Icon: FiSend,         title: "Campaign composer",        text: "Visual email builder with templates, merge fields, subject-line A/B testing and scheduled sends." },
      { Icon: FiZap,          title: "Drip automations",         text: "Trigger-based sequences for onboarding, abandoned cart, re-engagement and upsells." },
      { Icon: FiBarChart2,    title: "Delivery analytics",       text: "Opens, clicks, bounces, unsubscribes — per campaign and per subscriber." },
      { Icon: FiFileText,     title: "Signature designer",       text: "Personal signature with social links, brand colors and avatar — used across all team members." },
      { Icon: FiUsers,        title: "Subscriber management",    text: "Import CSV, segment by tag, honor unsubscribes globally across campaigns." },
      { Icon: FiMessageCircle,title: "Own SMTP, zero markup",    text: "Pay what Amazon SES / Gmail charges. No per-email surcharge from us." },
    ],
  },
  {
    id: "crm", Icon: FiUsers, color: "#7c3aed", short: "CRM",
    eyebrow: "Leads CRM",
    title: "A CRM designed for marketers, not for data entry",
    sub: "Kanban pipeline, hot-lead filters, source attribution, tags and automations — wired into WhatsApp and Meta for zero-touch capture.",
    features: [
      { Icon: FiLayers,       title: "Kanban pipeline",          text: "Drag leads across stages: New → Contacted → Hot → Qualified. Multi-pipeline support for different products." },
      { Icon: FiTrendingUp,   title: "Lead scoring & funnel",    text: "AI-powered lead scoring, visual funnel analytics, conversion-rate-by-source breakdown." },
      { Icon: FiTarget,       title: "Auto-capture toggles",     text: "Decide per source whether WhatsApp inbounds / Meta form fills create leads — with defaults for status, value, tags." },
      { Icon: FiZap,          title: "Visual automations",       text: "Flow builder: trigger on new_lead / status_changed, call webhooks, send WhatsApp/email, update fields." },
      { Icon: FiFileText,     title: "CSV import & export",      text: "Bring existing leads in with column mapping. Export any filtered view to CSV in one click." },
      { Icon: FiLink,         title: "Webhooks + Zapier",        text: "Send every lead event to any URL. Native Zapier / Make integration for no-code workflows." },
    ],
  },
  {
    id: "ai", Icon: FiCpu, color: "#f59e0b", short: "AI Studio",
    eyebrow: "AI Studio",
    title: "20+ specialized AI tools, wired into every workflow",
    sub: "Skip the blank page. Generate, rewrite, translate, score — all powered by GPT-4 and your own OpenAI key if you prefer.",
    features: [
      { Icon: FiZap,          title: "AI Ad copy",               text: "Generate Meta, Google and LinkedIn ad copy tuned for your offer and audience." },
      { Icon: FiMail,         title: "AI Email writer",          text: "Write cold outreach, follow-ups, newsletters and drip sequences in seconds." },
      { Icon: FiMessageCircle,title: "AI Rewriter",              text: "Shorten, lengthen, formalize or casualize any copy. Tone slider from CEO to TikTok." },
      { Icon: FiLink,         title: "AI Translator",            text: "40+ languages with brand-voice preservation. One-click translation across campaigns." },
      { Icon: FiTrendingUp,   title: "AI Lead scorer",           text: "Rank leads 0–100 on conversion likelihood. Trainable on your closed-deal data." },
      { Icon: FiTool,         title: "Generators galore",        text: "Hashtag generator, form generator, invoice generator, UTM builder, QR code, slug, OG tag preview." },
    ],
  },
  {
    id: "dashboard", Icon: FiBarChart2, color: "#0ea5e9", short: "Dashboard",
    eyebrow: "Dashboard",
    title: "Real-time metrics that actually drive decisions",
    sub: "A single overview that shows every channel. Funnel, source attribution, revenue-by-source, exports — no more Excel juggling.",
    features: [
      { Icon: FiBarChart2,    title: "Live overview",            text: "Total leads, pipeline value, conversion rate, emails sent, WhatsApp messages — refreshed in real-time." },
      { Icon: FiLayers,       title: "Lead funnel",              text: "New → Contacted → Hot → Qualified visualization with percentage drop-off per stage." },
      { Icon: FiTarget,       title: "Source attribution",       text: "Which source (Meta, WhatsApp, referral, manual) is generating your highest-LTV leads." },
      { Icon: FiCreditCard,   title: "Revenue by source",        text: "Actual pipeline ₹ mapped back to its origin channel. Prove ROI, not vanity." },
      { Icon: FiClock,        title: "Activity feed",            text: "Real-time stream of lead_created, status_changed and campaign events across the whole team." },
      { Icon: FiFileText,     title: "Exports & reports",        text: "One-click CSV export for leads and email campaigns. Reports emailed on schedule." },
    ],
  },
  {
    id: "storage", Icon: FiFolder, color: "#eab308", short: "Storage",
    eyebrow: "File Storage",
    title: "Your S3 bucket, your files, your rules",
    sub: "Every doc, image and video lives in a bucket you own. Leadnator never hosts your media by default.",
    features: [
      { Icon: FiFolder,       title: "Any S3-compatible provider", text: "AWS S3, Cloudflare R2, Wasabi, Supabase Storage, MinIO — plug in your credentials and go." },
      { Icon: FiLink,         title: "Shared links",             text: "Public or signed share URLs. Expiry times, download counters, per-link analytics." },
      { Icon: FiClock,        title: "Version history",          text: "Every upload is versioned. Roll back or diff file contents on demand." },
      { Icon: FiUsers,        title: "Per-user quota",           text: "Cap storage usage per team member. Cost control without hand-holding." },
      { Icon: FiZap,          title: "Drag-drop upload",         text: "Browser upload, Gmail-style progress, parallel uploads. Automatic thumbnails." },
    ],
  },
  {
    id: "calendar", Icon: FiCalendar, color: "#4285f4", short: "Calendar",
    eyebrow: "Calendar & Booking",
    title: "Calendly-style booking built into the CRM",
    sub: "Public booking pages, availability rules, and reminders over WhatsApp + email — all threading back to the lead record.",
    features: [
      { Icon: FiCalendar,     title: "Month / week / agenda",    text: "Three views of the same schedule. Drag-and-drop to reschedule. Color-coded by event type." },
      { Icon: FiLink,         title: "Public booking links",     text: "Share a URL (book.leadnator.com/you/sales-call) — leads pick a slot, no back-and-forth." },
      { Icon: FiClock,        title: "Availability rules",       text: "Per-day hours, buffer times, daily caps, blackout dates. Timezone-aware." },
      { Icon: FiUsers,        title: "Team round-robin",         text: "Assign bookings to whoever has capacity. Weight by seniority or geography." },
      { Icon: FaWhatsapp,     title: "WhatsApp reminders",       text: "Auto-send 24h and 1h reminders via WhatsApp + email. Reduce no-shows by 62%." },
    ],
  },
  {
    id: "tools", Icon: FiTool, color: "#f97316", short: "Tools",
    eyebrow: "Growth Tools",
    title: "20+ free utilities for everyday marketing",
    sub: "Because great marketers need ten tools every day. We ship them with your account — no extra charge.",
    features: [
      { Icon: FiFileText,     title: "Form generator",           text: "Build embeddable forms with custom fields. Post to any webhook or straight into your CRM." },
      { Icon: FiCreditCard,   title: "Invoice generator",        text: "Professional invoices with GST. Export PDF, email direct, mark paid." },
      { Icon: FiLink,         title: "UTM builder & shortener",  text: "Consistent UTM tags + branded short links with click analytics." },
      { Icon: FiTool,         title: "QR + OG + slug",           text: "QR codes, Open Graph preview, URL slug generator — all the internet plumbing." },
      { Icon: FiMail,         title: "Email validator",          text: "Bulk-validate emails before sending. SPF/DKIM/MX check + disposable detection." },
      { Icon: FiTrendingUp,   title: "A/B + ROI calculators",    text: "Statistical significance calculator for A/B tests. ROI calculator for ad campaigns." },
    ],
  },
  {
    id: "support", Icon: FiLifeBuoy, color: "#ef4444", short: "Support",
    eyebrow: "In-app Support",
    title: "Support that lives inside your product",
    sub: "No external helpdesk. Tickets, live chat, FAQs and docs are all inside Leadnator — Socket-powered and real-time.",
    features: [
      { Icon: FiMessageCircle,title: "Ticket threads",           text: "Open tickets, reply with attachments, change priority / status / category. Admin answers pop up live." },
      { Icon: FiPhone,        title: "Live chat",                text: "Dedicated live-chat thread with the Leadnator team. Socket-powered, typing indicators, delivered receipts." },
      { Icon: FiFileText,     title: "FAQs & docs",              text: "Admin-authored FAQ + documentation library. Searchable, categorized, always up-to-date." },
      { Icon: FiZap,          title: "Priority escalation",      text: "Pro plans get <2h first-reply SLA. Starter gets <24h. All plans get human responses." },
    ],
  },
  {
    id: "automation", Icon: FiZap, color: "#ec4899", short: "Automation",
    eyebrow: "Automation",
    title: "Visual flow builder across every module",
    sub: "Triggers from any channel, actions into any channel. Branch, wait, call APIs — no code, no Zapier.",
    features: [
      { Icon: FiLayers,       title: "Cross-module triggers",    text: "new_lead, status_changed, message_received, form_submitted, booking_created — trigger on anything." },
      { Icon: FiLink,         title: "Any-channel actions",      text: "Send WhatsApp, email, SMS; call webhook; update field; assign owner; add tag; schedule follow-up." },
      { Icon: FiTool,         title: "Branching + conditionals", text: "If/else, switch-case, wait-for-event, wait-X-days. Build flows as complex as you need." },
      { Icon: FiMessageCircle,title: "Testable & versioned",     text: "Dry-run flows before enabling. Full event logs. Revert to any past version in one click." },
    ],
  },
];

const MODULE_IDS = MODULES.map((m) => m.id);

/* Nav dropdown + PlatformShowcase also link to /features#integrations —
   an invisible alias so those links land sensibly. */
const ANCHOR_ALIASES = { automation: "integrations" };

/* Scrollspy: a ~5%-tall detection band at mid-viewport — exactly one
   section intersects it at a time. SSR-safe (runs only in useEffect). */
function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids]);
  return active;
}

/* One-shot reveal: adds .is-in to each module the first time it scrolls in. */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".lnf-mod");
    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.18 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function FeaturesPage({ onGoto }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useReveal();
  const activeId = useScrollSpy(MODULE_IDS);

  return (
    <div className={mounted ? "lnf lnf-js" : "lnf"}>
      <Hero />
      <ModuleRail activeId={activeId} />
      {MODULES.map((m, i) => (
        <ModuleSection key={m.id} index={i} {...m} />
      ))}
      <CtaBanner onGoto={onGoto} />
    </div>
  );
}

function Hero() {
  return (
    <section className="lnf-hero">
      <div className="ln-container">
        <div className="lnf-hero-grid">
          <div className="lnf-hero-copy">
            <span className="lnf-badge">
              <FiZap /> {MODULES.length} powerful modules · one platform
            </span>
            <h1>
              Every tool you need to <span className="lnf-grad">10× your growth</span>
            </h1>
            <p>
              Leadnator replaces WhatsApp tools, email platforms, ad managers, CRMs,
              storage, and calendar apps — all under one login, one bill, one team.
            </p>
            <div className="lnf-hero-cta">
              <SignupLink className="ln-btn ln-btn-primary ln-btn-lg">
                Start FREE trial <FiArrowRight />
              </SignupLink>
              <a href="#whatsapp" className="ln-btn ln-btn-outline ln-btn-lg">
                Explore modules
              </a>
            </div>
            <ul className="lnf-hero-stats">
              <li><strong>{MODULES.length}</strong><span>Modules</span></li>
              <li><strong>20+</strong><span>AI tools</span></li>
              <li><strong>40+</strong><span>Integrations</span></li>
              <li><strong>1</strong><span>Login &amp; bill</span></li>
            </ul>
          </div>
          <HeroStage />
        </div>
      </div>
    </section>
  );
}

function HeroStage() {
  return (
    <div className="lnf-hero-stage" aria-hidden="true">
      <div className="lnf-shell" style={{ "--mx": "#22c55e", maxWidth: 430 }}>
        <div className="lnf-shell-bar">
          <span className="lnf-dots"><i /><i /><i /></span>
          <span className="lnf-urlbar"><FiLock /> app.leadnator.com/dashboard</span>
        </div>
        <div className="lnf-shell-body">
          <div className="lnf-kpis">
            <div className="lnf-stat">
              <div className="lnf-stat-l">Leads</div>
              <div className="lnf-stat-v">1,284</div>
              <div className="lnf-stat-d up">↑ 12%</div>
            </div>
            <div className="lnf-stat">
              <div className="lnf-stat-l">Pipeline</div>
              <div className="lnf-stat-v">₹8.6L</div>
              <div className="lnf-stat-d up">↑ 9%</div>
            </div>
            <div className="lnf-stat">
              <div className="lnf-stat-l">Msgs sent</div>
              <div className="lnf-stat-v">42k</div>
              <div className="lnf-stat-d up">↑ 26%</div>
            </div>
          </div>
          <div className="lnf-bars">
            <i className="lnf-bar" style={{ "--h": "34%" }} />
            <i className="lnf-bar" style={{ "--h": "52%" }} />
            <i className="lnf-bar" style={{ "--h": "44%" }} />
            <i className="lnf-bar" style={{ "--h": "68%" }} />
            <i className="lnf-bar" style={{ "--h": "58%" }} />
            <i className="lnf-bar" style={{ "--h": "80%" }} />
            <i className="lnf-bar" style={{ "--h": "94%" }} />
          </div>
        </div>
      </div>
      <div className="lnf-hero-wa" style={{ "--mx": "#22c55e" }}>
        <div className="lnf-shell sm">
          <div className="lnf-shell-bar">
            <FaWhatsapp color="#22c55e" />
            <span className="lnf-shell-title">WhatsApp inbox</span>
          </div>
          <div className="lnf-shell-body">
            <div className="lnf-thread">
              <div className="lnf-msg in">Hi! Is the Growth plan available?</div>
              <div className="lnf-msg out">Yes — want a payment link?</div>
              <div className="lnf-typing"><i /><i /><i /></div>
            </div>
          </div>
        </div>
      </div>
      <div className="lnf-float" style={{ top: 8, right: -4, "--mx": "#1877f2" }}>
        <SiMeta /> New lead · Meta form
      </div>
      <div className="lnf-hero-tile" style={{ top: "22%", left: "-2%", color: "#f59e0b", animationDelay: ".6s" }}><FiCpu /></div>
      <div className="lnf-hero-tile" style={{ bottom: "6%", right: "4%", color: "#ea4335", animationDelay: "1.2s" }}><FiMail /></div>
    </div>
  );
}

function ModuleRail({ activeId }) {
  const trackRef = useRef(null);
  useEffect(() => {
    trackRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [activeId]);

  return (
    <nav className="lnf-rail" aria-label="Feature modules">
      <div className="ln-container">
        <div className="lnf-rail-track" ref={trackRef}>
          {MODULES.map(({ id, Icon, color, short }) => (
            <a
              key={id}
              href={`#${id}`}
              className="lnf-rail-pill"
              data-active={activeId === id ? "true" : undefined}
              aria-current={activeId === id ? "true" : undefined}
              style={{ "--mx": color }}
            >
              <Icon /> {short}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

function ModuleSection({ index, id, Icon, color, eyebrow, title, sub, features }) {
  return (
    <article id={id} className="lnf-mod" style={{ "--mx": color }}>
      {ANCHOR_ALIASES[id] ? (
        <span id={ANCHOR_ALIASES[id]} className="lnf-alias" aria-hidden="true" />
      ) : null}
      <div className="ln-container">
        <div className="lnf-split">
          <div className="lnf-copy">
            <div className="lnf-eyebrow-row">
              <span className="lnf-chip-eyebrow"><Icon /> {eyebrow}</span>
              <span className="lnf-num">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h2>{title}</h2>
            <p className="lnf-sub">{sub}</p>
            <ul className="lnf-list">
              {features.map(({ Icon: FI, title: t, text }) => (
                <li key={t} className="lnf-item">
                  <span className="lnf-item-ic"><FI /></span>
                  <div className="lnf-item-body">
                    <h3>{t}</h3>
                    <p>{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="lnf-visual">
            <ModuleVisual id={id} />
          </div>
        </div>
      </div>
    </article>
  );
}

function CtaBanner({ onGoto }) {
  return (
    <section className="lnf-cta">
      <div className="ln-container">
        <div className="lnf-cta-card">
          <div className="lnf-cta-copy">
            <div className="lnf-cta-icons" aria-hidden="true">
              {MODULES.map(({ id, Icon, color }) => (
                <Icon key={id} style={{ "--ic": color }} />
              ))}
            </div>
            <h2>Try every module free for 2 days</h2>
            <p>All features unlocked. No credit card. Setup in 12 minutes.</p>
            <ul>
              <li><FiCheck /> All {MODULES.length} modules unlocked</li>
              <li><FiCheck /> No credit card required</li>
              <li><FiCheck /> Human onboarding support</li>
            </ul>
          </div>
          <div className="lnf-cta-actions">
            <SignupLink className="ln-btn ln-btn-primary ln-btn-lg ln-btn-block">
              Start FREE Trial <FiArrowRight />
            </SignupLink>
            <button className="ln-btn ln-btn-outline-dark ln-btn-lg ln-btn-block" onClick={() => onGoto("/pricing")}>
              See pricing
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
