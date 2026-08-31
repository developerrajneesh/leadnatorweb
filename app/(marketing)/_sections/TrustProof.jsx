import { FiShield, FiCheckCircle } from "react-icons/fi";
import { SiMeta } from "react-icons/si";
import { FaWhatsapp } from "react-icons/fa";

const ITEMS = [
  {
    key: "ban-proof",
    Icon: FiShield,
    accent: "#16a34a",
    badge: "Official Cloud API",
    title: "100% Ban Proof",
    text: "Built on Meta's official WhatsApp Cloud API — no grey-area hacks, no unofficial gateways. Compliant opt-in flows, approved templates and Business Partner infrastructure keep your number safe.",
    points: ["GREEN quality rating support", "Template & opt-in compliance", "Zero unofficial API risk"],
  },
  {
    key: "meta-verified",
    Icon: SiMeta,
    accent: "#0668e1",
    badge: "Meta Business Partner",
    title: "Meta Verified API",
    text: "Direct Meta integration with verified WABA onboarding, Embedded Signup and native Marketing API access. Your WhatsApp, Instagram and Facebook assets — officially connected.",
    points: ["Verified WABA onboarding", "WhatsApp + Meta Ads in one stack", "Official Meta Business Partner"],
  },
];

export default function TrustProof() {
  return (
    <section className="ln-trust-proof" aria-label="Platform trust and compliance">
      <div className="ln-container">
        <div className="ln-trust-proof-grid">
          {ITEMS.map(({ key, Icon, accent, badge, title, text, points }) => (
            <article key={key} className="ln-trust-proof-card">
              <div className="ln-trust-proof-accent" style={{ background: accent }} aria-hidden />
              <div className="ln-trust-proof-top">
                <span className="ln-trust-proof-ic" style={{ background: `${accent}14`, color: accent }}>
                  <Icon />
                </span>
                <span className="ln-trust-proof-badge" style={{ color: accent, borderColor: `${accent}33`, background: `${accent}0d` }}>
                  {badge}
                </span>
              </div>
              <h2 className="ln-trust-proof-title">{title}</h2>
              <p className="ln-trust-proof-text">{text}</p>
              <ul className="ln-trust-proof-points">
                {points.map((point) => (
                  <li key={point}>
                    <FiCheckCircle style={{ color: accent }} aria-hidden />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="ln-trust-proof-strip">
          <FaWhatsapp className="ln-trust-proof-strip-icon wa" aria-hidden />
          <span>Official WhatsApp Cloud API</span>
          <span className="ln-trust-proof-strip-dot" aria-hidden />
          <SiMeta className="ln-trust-proof-strip-icon meta" aria-hidden />
          <span>Meta Verified Integration</span>
          <span className="ln-trust-proof-strip-dot" aria-hidden />
          <FiShield className="ln-trust-proof-strip-icon shield" aria-hidden />
          <span>Enterprise-grade compliance</span>
        </div>
      </div>
    </section>
  );
}
