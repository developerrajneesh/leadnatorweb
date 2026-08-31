"use client";

import { FiZap, FiCreditCard, FiArchive, FiPhone, FiShield } from "react-icons/fi";

const CARDS = [
  {
    num: "01",
    Icon: FiZap,
    title: "Launch in 12 minutes",
    text: "Embedded Signup handles Meta's approval. Your number, your template, your ads — all wired in the first coffee.",
    art: "launch",
  },
  {
    num: "02",
    Icon: FiCreditCard,
    title: "Zero markup pricing",
    text: "Meta bills you at cost. We don't take a cut on every template send. Your WhatsApp wallet is yours.",
    art: "pricing",
  },
  {
    num: "03",
    Icon: FiArchive,
    title: "Own your data",
    text: "Leads sit in your DB. Files live in your S3 bucket. Templates on your WABA. You can export and leave any day.",
    art: "data",
  },
  {
    num: "04",
    Icon: FiPhone,
    title: "Real support",
    text: "Open tickets or live-chat the team from inside the app. Replies in minutes during business hours, not days.",
    art: "support",
  },
];

const AVATARS = [
  { bg: "#fbbf24", initials: "AD" },
  { bg: "#60a5fa", initials: "MK" },
  { bg: "#f472b6", initials: "PK" },
  { bg: "#34d399", initials: "RS" },
];

function CardArt({ type }) {
  if (type === "launch") {
    return (
      <svg viewBox="0 0 280 120" fill="none" aria-hidden className="ln-why-art-svg">
        <rect x="52" y="18" width="176" height="78" rx="10" fill="#fff" stroke="#e2e8f0" strokeWidth="1.5" />
        <rect x="52" y="18" width="176" height="18" rx="10" fill="#f8fafc" />
        <rect x="52" y="28" width="176" height="8" fill="#f8fafc" />
        <circle cx="64" cy="27" r="3" fill="#fca5a5" />
        <circle cx="74" cy="27" r="3" fill="#fde047" />
        <circle cx="84" cy="27" r="3" fill="#86efac" />
        <circle cx="140" cy="62" r="16" fill="#dcfce7" />
        <path d="M133 62l5 5 10-10" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="140" y="88" textAnchor="middle" fill="#16a34a" fontSize="10" fontWeight="700">Setup Complete</text>
        <path d="M218 28l14 8-14 8v-5h-10v-6h10v-5z" fill="#22c55e" opacity=".85" />
        <path d="M200 36c8-12 28-8 32 4" stroke="#bbf7d0" strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>
    );
  }
  if (type === "pricing") {
    return (
      <svg viewBox="0 0 280 120" fill="none" aria-hidden className="ln-why-art-svg">
        <rect x="36" y="42" width="88" height="44" rx="8" fill="#fff" stroke="#e2e8f0" strokeWidth="1.5" />
        <text x="80" y="58" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="600">Meta Charges</text>
        <text x="80" y="74" textAnchor="middle" fill="#16a34a" fontSize="11" fontWeight="800">At Cost</text>
        <rect x="156" y="42" width="88" height="44" rx="8" fill="#fff" stroke="#e2e8f0" strokeWidth="1.5" />
        <text x="200" y="58" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="600">No Markup</text>
        <text x="200" y="74" textAnchor="middle" fill="#16a34a" fontSize="11" fontWeight="800">₹0</text>
        <ellipse cx="128" cy="88" rx="10" ry="4" fill="#bbf7d0" />
        <circle cx="128" cy="78" r="12" fill="#fde047" stroke="#facc15" strokeWidth="1.5" />
        <circle cx="118" cy="86" r="10" fill="#fde047" stroke="#facc15" strokeWidth="1.5" />
        <circle cx="138" cy="86" r="10" fill="#fde047" stroke="#facc15" strokeWidth="1.5" />
        <circle cx="148" cy="52" r="10" fill="#dcfce7" />
        <path d="M144 52l3 3 6-6" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === "data") {
    return (
      <svg viewBox="0 0 280 120" fill="none" aria-hidden className="ln-why-art-svg">
        <path d="M90 52c0-12 16-20 32-20s32 8 32 20v6c0 12-16 20-32 20s-32-8-32-20v-6z" fill="#ecfdf5" stroke="#86efac" strokeWidth="1.5" />
        <path d="M106 48c6-4 14-4 20 0M106 58c6 4 14 4 20 0" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M154 58h28" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M182 58v14" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />
        <rect x="182" y="72" width="48" height="36" rx="8" fill="#fff" stroke="#e2e8f0" strokeWidth="1.5" />
        <path d="M194 82h24M194 90h16" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
        <rect x="200" y="96" width="12" height="8" rx="2" fill="#dcfce7" stroke="#86efac" strokeWidth="1" />
        <path d="M203 100h6v2h-6z" fill="#16a34a" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 280 120" fill="none" aria-hidden className="ln-why-art-svg">
      <rect x="48" y="36" width="108" height="52" rx="12" fill="#fff" stroke="#e2e8f0" strokeWidth="1.5" />
      <circle cx="68" cy="56" r="10" fill="#dbeafe" />
      <circle cx="68" cy="53" r="4" fill="#93c5fd" />
      <path d="M62 62c2 4 12 4 14 0" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" />
      <text x="86" y="58" fill="#475569" fontSize="9" fontWeight="600">How can we help?</text>
      <rect x="124" y="48" width="116" height="44" rx="12" fill="#ecfdf5" stroke="#bbf7d0" strokeWidth="1.5" />
      <circle cx="144" cy="66" r="10" fill="#dcfce7" />
      <circle cx="144" cy="63" r="4" fill="#86efac" />
      <path d="M138 72c2 4 12 4 14 0" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round" />
      <text x="162" y="64" fill="#16a34a" fontSize="8.5" fontWeight="600">We&apos;re here to</text>
      <text x="162" y="76" fill="#16a34a" fontSize="8.5" fontWeight="600">support you!</text>
    </svg>
  );
}

export default function WhyLeadnator() {
  return (
    <section className="ln-why" aria-labelledby="ln-why-title">
      <div className="ln-why-bg" aria-hidden>
        <span className="ln-why-arc ln-why-arc-l" />
        <span className="ln-why-arc ln-why-arc-r" />
        <span className="ln-why-spark ln-why-spark-1">✦</span>
        <span className="ln-why-spark ln-why-spark-2">+</span>
        <span className="ln-why-spark ln-why-spark-3">✦</span>
        <span className="ln-why-spark ln-why-spark-4">+</span>
      </div>

      <div className="ln-container">
        <header className="ln-why-head">
          <span className="ln-why-badge">✦ WHY LEADNATOR</span>
          <h2 id="ln-why-title" className="ln-why-title">
            Built by operators, for{" "}
            <span className="ln-why-accent">
              operators
              <svg className="ln-why-squiggle" viewBox="0 0 80 24" fill="none" aria-hidden>
                <path
                  d="M4 18c12-10 28-10 40 0s20 4 32-6"
                  stroke="#22c55e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path d="M68 8l8 4-8 4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </h2>
          <p className="ln-why-sub">
            Every feature is because we hit the pain ourselves running growth for D2C brands.
          </p>
        </header>

        <div className="ln-why-grid">
          {CARDS.map(({ num, Icon, title, text, art }) => (
            <article key={num} className="ln-why-card">
              <div className="ln-why-card-top">
                <div className="ln-why-card-ic">
                  <Icon />
                </div>
                <span className="ln-why-card-num" aria-hidden>{num}</span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
              <div className="ln-why-card-art">
                <CardArt type={art} />
              </div>
            </article>
          ))}
        </div>

        <div className="ln-why-trust">
          <span className="ln-why-trust-shield">
            <FiShield />
          </span>
          <span className="ln-why-trust-text">Trusted by growing D2C brands across India</span>
          <span className="ln-why-trust-avatars" aria-hidden>
            {AVATARS.map(({ bg, initials }, i) => (
              <span key={i} className="ln-why-avatar" style={{ background: bg, zIndex: 4 - i }}>
                {initials}
              </span>
            ))}
          </span>
          <span className="ln-why-trust-more">+3500</span>
        </div>
      </div>
    </section>
  );
}
