import { FiCalendar, FiCpu } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { SiMeta } from "react-icons/si";

const TAGS = [
  "WhatsApp Marketing", "Meta Ads", "Instagram Automation",
  "Leads CRM", "Email Marketing", "Booking Calendar", "AI Studio",
];

const BLOCKS = [
  {
    Icon: FaWhatsapp,
    color: "#22c55e",
    title: "WhatsApp marketing that scales with you",
    body: "Leadnator runs on the official WhatsApp Business Cloud API — template broadcasts, live team inbox, drag-and-drop chatbot builder, catalog, payments and Click-to-WhatsApp ads. Meta bills you at cost; we never markup your template sends. Your WABA, your number, your data.",
  },
  {
    Icon: SiMeta,
    color: "#1877f2",
    title: "Meta Ads & Instagram automation",
    body: "Create Facebook and Instagram campaigns, sync lead forms in real time and track CPL beside your chats. Instagram DM inbox, comment auto-replies, keyword triggers and story mentions — every social touchpoint lands in the same CRM with full source attribution.",
  },
  {
    Icon: FiCalendar,
    color: "#4285f4",
    title: "Calendar, email & pipeline in one place",
    body: "Public booking links with availability rules for sales calls. Bring-your-own SMTP email for drips and newsletters. Kanban CRM with hot stages, tags, CSV import and automations — so WhatsApp replies, ad leads and calendar bookings never fall through the cracks.",
  },
  {
    Icon: FiCpu,
    color: "#f59e0b",
    title: "AI tools & 25+ integrations",
    body: "AI Studio writes ad copy, emails and WhatsApp replies in seconds. Connect Shopify, Razorpay, Google Sheets, Zapier or your own S3 bucket — then automate with visual no-code flows. One affordable login replaces five separate subscriptions.",
  },
];

export default function SeoIntro() {
  return (
    <section className="ln-seo-intro" aria-labelledby="ln-seo-intro-title">
      <div className="ln-seo-intro-glow" aria-hidden />

      <div className="ln-container">
        <header className="ln-seo-intro-head">
          <span className="ln-seo-intro-badge">✦ ALL-IN-ONE GROWTH CRM</span>
          <h2 id="ln-seo-intro-title" className="ln-seo-intro-title">
            One platform for{" "}
            <span className="ln-seo-hl ln-seo-hl-green">WhatsApp</span>,{" "}
            <span className="ln-seo-hl ln-seo-hl-blue">Meta Ads</span> &amp;{" "}
            <span className="ln-seo-hl ln-seo-hl-pink">Instagram</span>
          </h2>
          <p className="ln-seo-intro-lead">
            <strong>Leadnator</strong> unifies the entire growth stack Indian D2C brands actually
            use — from your first broadcast to your hundredth campaign. No duct-taped Zapier
            flows. No CSV exports between dashboards.
          </p>
        </header>

        <div className="ln-seo-intro-tags" aria-label="Platform capabilities">
          {TAGS.map((tag) => (
            <span key={tag} className="ln-seo-tag">{tag}</span>
          ))}
        </div>

        <div className="ln-seo-intro-grid">
          {BLOCKS.map(({ Icon, color, title, body }) => (
            <article key={title} className="ln-seo-block">
              <div className="ln-seo-block-accent" style={{ background: color }} aria-hidden />
              <div className="ln-seo-block-ic" style={{ background: `${color}14`, color }}>
                <Icon />
              </div>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
