import Image from "next/image";
import { FiLock, FiTrendingUp, FiZap, FiBarChart2 } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { SiMeta } from "react-icons/si";

const PILLS = ["Leads CRM", "WhatsApp Inbox", "Meta Ads", "Email", "Automation", "Analytics"];

const FLOATS = [
  { cls: "l", Icon: FaWhatsapp, color: "#22c55e", label: "Live WhatsApp inbox", value: "2.4k chats" },
  { cls: "r", Icon: SiMeta, color: "#1877f2", label: "Meta Ads CPL", value: "↓ 38%" },
];

export default function ProductPreview() {
  return (
    <section className="ln-preview" aria-labelledby="ln-preview-title">
      <div className="ln-preview-bg" aria-hidden>
        <span className="ln-preview-orb ln-preview-orb-1" />
        <span className="ln-preview-orb ln-preview-orb-2" />
        <span className="ln-preview-grid" />
      </div>

      <div className="ln-container">
        <header className="ln-preview-head">
          <span className="ln-preview-badge">✦ PRODUCT PREVIEW</span>
          <h2 id="ln-preview-title" className="ln-preview-title">
            See your entire{" "}
            <span className="ln-preview-grad">growth stack</span>
            {" "}on one screen
          </h2>
          <p className="ln-preview-sub">
            Leads, WhatsApp chats, Meta ads, email performance and storage usage —
            unified in a dashboard your whole team can live in.
          </p>
          <div className="ln-preview-pills">
            {PILLS.map((pill) => (
              <span key={pill} className="ln-preview-pill">{pill}</span>
            ))}
          </div>
        </header>

        <div className="ln-preview-stage">
          <div className="ln-preview-glow" aria-hidden />

          {FLOATS.map(({ cls, Icon, color, label, value }) => (
            <div key={label} className={`ln-preview-float ln-preview-float-${cls}`}>
              <span className="ln-preview-float-ic" style={{ background: `${color}18`, color }}>
                <Icon />
              </span>
              <div>
                <span className="ln-preview-float-label">{label}</span>
                <strong className="ln-preview-float-value">{value}</strong>
              </div>
            </div>
          ))}

          <div className="ln-preview-frame">
            <div className="ln-preview-chrome">
              <div className="ln-preview-dots">
                <span className="ln-preview-dot r" />
                <span className="ln-preview-dot y" />
                <span className="ln-preview-dot g" />
              </div>
              <div className="ln-preview-urlbar">
                <FiLock aria-hidden />
                <span>app.leadnator.com/dashboard</span>
              </div>
            </div>
            <Image
              src="/hero_dashboard.png"
              alt="Leadnator dashboard showing WhatsApp automation, Meta Ads and team inbox on a single screen"
              className="ln-preview-img"
              width={1200}
              height={675}
              priority
              sizes="(max-width: 768px) 100vw, 1100px"
            />
          </div>
        </div>

        <div className="ln-preview-stats">
          <div className="ln-preview-stat">
            <FiZap />
            <span><strong>12 min</strong> average setup</span>
          </div>
          <div className="ln-preview-stat">
            <FiBarChart2 />
            <span><strong>1 dashboard</strong> for every channel</span>
          </div>
          <div className="ln-preview-stat">
            <FiTrendingUp />
            <span><strong>Real-time</strong> lead attribution</span>
          </div>
        </div>
      </div>
    </section>
  );
}
