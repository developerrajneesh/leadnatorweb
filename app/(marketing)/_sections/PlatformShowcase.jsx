"use client";

import Image from "next/image";
import {
  FiArrowRight, FiMail, FiZap, FiBarChart2, FiUsers, FiCpu,
  FiTool, FiCalendar, FiFolder, FiLifeBuoy, FiLink, FiStar,
} from "react-icons/fi";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { SiMeta } from "react-icons/si";
import { MarketingLink } from "@/components/site/AppLinks";

const MODULES = [
  {
    key: "whatsapp", color: "#22c55e", Icon: FaWhatsapp,
    title: "WhatsApp Cloud API",
    blurb: "Broadcasts, templates, live inbox, drag-drop chatbot, Click-to-WhatsApp ads, catalog + payments.",
  },
  {
    key: "meta", color: "#1877f2", Icon: SiMeta,
    title: "Meta Ads Manager",
    blurb: "Create, run and analyze Facebook & Instagram campaigns with native Meta Marketing API integration.",
  },
  {
    key: "email", color: "#ea4335", Icon: FiMail,
    title: "Email Marketing",
    blurb: "Bring-your-own SMTP. Drip automations, templates, subscribers, delivery analytics, signature designer.",
  },
  {
    key: "instagram", color: "#e1306c", Icon: FaInstagram,
    title: "Instagram Automations",
    blurb: "DM inbox, comment auto-replies, keyword triggers, story mentions and lead capture — all from one place.",
  },
  {
    key: "crm", color: "#7c3aed", Icon: FiUsers,
    title: "Leads CRM",
    blurb: "Kanban pipeline, hot/qualified stages, CSV import, source attribution, tags, automations.",
  },
  {
    key: "ai", color: "#f59e0b", Icon: FiCpu,
    title: "AI Studio",
    blurb: "20+ AI tools — ad copy, email writer, rewriter, translator, lead scorer, hashtags and more.",
  },
  {
    key: "storage", color: "#eab308", Icon: FiFolder,
    title: "File Storage",
    blurb: "Your own S3 / R2 / Wasabi / Supabase bucket. Upload, share, versioning and per-user quota.",
  },
  {
    key: "calendar", color: "#4285f4", Icon: FiCalendar,
    title: "Calendar & Booking",
    blurb: "Month/week/agenda views, availability rules, and public booking links for sales calls.",
  },
  {
    key: "tools", color: "#f97316", Icon: FiTool,
    title: "Growth Tools",
    blurb: "Form builder, invoice generator, UTM builder, link shortener, QR code, email validator, A/B calc.",
  },
  {
    key: "support", color: "#ef4444", Icon: FiLifeBuoy,
    title: "In-app Support",
    blurb: "Ticket threads, live chat with the team, FAQs and documentation — no external helpdesk needed.",
  },
  {
    key: "integrations", color: "#06b6d4", Icon: FiLink,
    title: "Integrations",
    blurb: "Shopify, WooCommerce, Razorpay, Google Sheets, Zapier, webhooks and 25+ native connectors.",
  },
  {
    key: "automation", color: "#ec4899", Icon: FiZap,
    title: "Visual Automations",
    blurb: "Trigger-based flows across every module. Branch, wait, call APIs, send messages — all no-code.",
  },
];

const SIDE_ROWS = 6;

const ORBIT_ICONS = [
  { cls: "o1", Icon: FaWhatsapp, color: "#22c55e" },
  { cls: "o2", Icon: SiMeta, color: "#1877f2" },
  { cls: "o3", Icon: FiMail, color: "#ea4335" },
  { cls: "o4", Icon: FiCalendar, color: "#4285f4" },
  { cls: "o5", Icon: FiFolder, color: "#eab308" },
  { cls: "o6", Icon: FiBarChart2, color: "#0ea5e9" },
  { cls: "o7", Icon: FiZap, color: "#ec4899" },
  { cls: "o8", Icon: FiUsers, color: "#7c3aed" },
];

function SideCard({ mod, index }) {
  const { key, color, Icon, title, blurb } = mod;
  const num = String(index + 1).padStart(2, "0");

  return (
    <article className="ln-plat-side">
      <div className="ln-plat-side-ic" style={{ background: `${color}14`, color }}>
        <Icon />
      </div>
      <div className="ln-plat-side-body">
        <h3>
          <span className="ln-plat-side-num" style={{ color }}>{num}</span>
          {title}
        </h3>
        <p>{blurb}</p>
        <MarketingLink href={`/features#${key}`} className="ln-plat-side-link" style={{ color }}>
          Learn more <FiArrowRight />
        </MarketingLink>
      </div>
    </article>
  );
}

export default function PlatformShowcase() {
  const left = MODULES.slice(0, SIDE_ROWS);
  const right = MODULES.slice(SIDE_ROWS, SIDE_ROWS * 2);

  return (
    <section id="modules" className="ln-platform">
      <div className="ln-container">
        <div className="ln-platform-layout">
          <div className="ln-platform-col ln-platform-col-left">
            {left.map((mod, i) => (
              <SideCard key={mod.key} mod={mod} index={i} />
            ))}
          </div>

          <div className="ln-platform-col ln-platform-col-center">
            <header className="ln-platform-head">
              <span className="ln-platform-eyebrow">ALL-IN-ONE PLATFORM</span>
              <h2>
                Everything You Need to{" "}
                <span className="ln-plat-word ln-plat-grow">Grow</span>,{" "}
                <span className="ln-plat-word ln-plat-auto">Automate</span> &amp;{" "}
                <span className="ln-plat-word ln-plat-scale">Scale</span>
              </h2>
              <p>
                Powerful tools. Seamless integrations. Smarter automation. All in one place.
              </p>
            </header>

            <div className="ln-platform-hero" aria-hidden>
              <div className="ln-platform-orbit ln-platform-orbit-outer" />
              <div className="ln-platform-orbit ln-platform-orbit-inner" />
              <div className="ln-platform-hero-glow" />
              {ORBIT_ICONS.map(({ cls, Icon, color }) => (
                <span key={cls} className={`ln-platform-orbit-icon ${cls}`} style={{ color }}>
                  <Icon />
                </span>
              ))}
              <Image
                src="/hero2.png"
                alt=""
                className="ln-platform-hero-img"
                width={900}
                height={900}
                sizes="(max-width: 720px) 92vw, 620px"
              />
            </div>

            <div className="ln-platform-bar">
              <div className="ln-platform-bar-copy">
                <span className="ln-platform-bar-spark"><FiStar /></span>
                <div>
                  <p className="ln-platform-bar-title">
                    <strong>One platform.</strong> Unlimited possibilities.
                  </p>
                  <p className="ln-platform-bar-sub">
                    Everything you need to attract, engage, convert &amp; delight your customers.
                  </p>
                </div>
              </div>
              <MarketingLink href="/features" className="ln-btn ln-btn-lg ln-platform-bar-btn">
                Explore All Features <FiArrowRight />
              </MarketingLink>
            </div>
          </div>

          <div className="ln-platform-col ln-platform-col-right">
            {right.map((mod, i) => (
              <SideCard key={mod.key} mod={mod} index={i + SIDE_ROWS} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
