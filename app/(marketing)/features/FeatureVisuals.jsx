"use client";

import {
  FiCheck, FiLock, FiUsers, FiTrendingUp, FiZap, FiLink, FiLifeBuoy,
  FiFileText, FiCreditCard, FiTool, FiMail, FiClock, FiSend, FiCpu,
} from "react-icons/fi";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { SiMeta } from "react-icons/si";

/**
 * Pure-CSS product visualizations for each feature module.
 * All numbers / names are decorative mockup chrome (aria-hidden),
 * built from the shared lnf-* kit in styles/marketing-features.css.
 * The WhatsApp visual reuses the global .ln-phone* mockup classes.
 */
export default function ModuleVisual({ id }) {
  const V = VISUALS[id];
  return V ? <V /> : null;
}

const VISUALS = {
  whatsapp: WhatsAppVisual,
  meta: MetaVisual,
  instagram: InstagramVisual,
  email: EmailVisual,
  crm: CrmVisual,
  ai: AiVisual,
  dashboard: DashboardVisual,
  storage: StorageVisual,
  calendar: CalendarVisual,
  tools: ToolsVisual,
  support: SupportVisual,
  automation: AutomationVisual,
};

/* ---------- 1. WhatsApp — phone chat (reuses .ln-phone*) ---------- */
function WhatsAppVisual() {
  return (
    <div className="lnf-stage" aria-hidden="true">
      <div className="lnf-phone-fit">
        <div className="ln-phone-wrap">
          <div className="ln-phone">
            <div className="ln-phone-notch" />
            <div className="ln-phone-screen">
              <div className="ln-phone-header">
                <div className="ln-phone-avatar">L</div>
                <div>
                  <div className="ln-phone-name">Leadnator Store</div>
                  <div className="ln-phone-status">online</div>
                </div>
              </div>
              <div className="ln-phone-chat">
                <div className="ln-bubble out">🚀 Festive Sale — 40% off, today only!</div>
                <div className="ln-bubble in">How do I order?</div>
                <div className="ln-bubble out">
                  <div className="ln-phone-card">
                    <div className="ln-phone-card-title">Growth Plan</div>
                    <div className="ln-phone-card-price">₹1,499 <small>/ month</small></div>
                    <div className="ln-phone-card-btn">Pay via UPI</div>
                  </div>
                </div>
                <div className="ln-bubble in typing"><span /><span /><span /></div>
              </div>
              <div className="ln-phone-input">Type a message… <FiSend /></div>
            </div>
          </div>
          <div className="ln-phone-badge ln-phone-badge-1"><FiCheck /> 98.4% delivered</div>
          <div className="ln-phone-badge ln-phone-badge-2"><FiCpu /> AI bot replying…</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 2. Meta — Ads Manager ---------- */
function MetaVisual() {
  return (
    <div className="lnf-stage" aria-hidden="true">
      <div className="lnf-shell">
        <div className="lnf-shell-bar">
          <span className="lnf-dots"><i /><i /><i /></span>
          <span className="lnf-shell-title">Ads Manager · Lead Gen campaign</span>
          <span className="lnf-shell-badge"><SiMeta /> Active</span>
        </div>
        <div className="lnf-shell-body">
          <div className="lnf-adgrid">
            <div className="lnf-adcard">
              <div className="lnf-adimg" />
              <div className="lnf-skel w80" />
              <div className="lnf-skel w60" />
              <span className="lnf-chip tint">Learn more</span>
            </div>
            <div className="lnf-statstack">
              <div className="lnf-stat">
                <div className="lnf-stat-l">CPL</div>
                <div className="lnf-stat-v">₹42</div>
                <div className="lnf-stat-d up">↓ 18% cheaper</div>
              </div>
              <div className="lnf-stat">
                <div className="lnf-stat-l">CTR</div>
                <div className="lnf-stat-v">3.2%</div>
                <div className="lnf-stat-d up">↑ 0.8%</div>
              </div>
              <div className="lnf-stat">
                <div className="lnf-stat-l">Spend</div>
                <div className="lnf-stat-v">₹12.4k</div>
                <div className="lnf-stat-d up">on budget</div>
              </div>
            </div>
          </div>
          <div className="lnf-bars">
            <i className="lnf-bar" style={{ "--h": "35%" }} />
            <i className="lnf-bar" style={{ "--h": "55%" }} />
            <i className="lnf-bar" style={{ "--h": "42%" }} />
            <i className="lnf-bar" style={{ "--h": "70%" }} />
            <i className="lnf-bar" style={{ "--h": "58%" }} />
            <i className="lnf-bar" style={{ "--h": "88%" }} />
          </div>
        </div>
      </div>
      <div className="lnf-float" style={{ bottom: -14, right: -6 }}>
        <FiUsers /> Lead synced → CRM
      </div>
    </div>
  );
}

/* ---------- Instagram — comment → keyword → auto-DM ---------- */
const IG_GRAD = "linear-gradient(45deg, #f58529, #dd2a7b 55%, #8134af)";
function InstagramVisual() {
  return (
    <div className="lnf-stage" aria-hidden="true">
      <div className="lnf-shell">
        <div className="lnf-shell-bar">
          <span className="lnf-dots"><i /><i /><i /></span>
          <span className="lnf-shell-title">Instagram · @leadnator</span>
          <span className="lnf-shell-badge"><span className="lnf-pulse" /> Automation on</span>
        </div>
        <div className="lnf-shell-body">
          <div className="lnf-thread">
            <div className="lnf-msgline">
              <span className="lnf-avatar" style={{ background: "#64748b" }}>RA</span>
              <div className="lnf-msg in">Price? 😍</div>
            </div>
            <div className="lnf-mailrow" style={{ justifyContent: "center" }}>
              <span className="lnf-chip tint"><FiZap /> Keyword matched · &quot;PRICE&quot;</span>
            </div>
            <div className="lnf-msgline right">
              <span className="lnf-avatar" style={{ background: IG_GRAD }}>L</span>
              <div className="lnf-msg out">Replied to the comment + DM sent 🛍️ Here&apos;s the catalog &amp; checkout link</div>
            </div>
            <div className="lnf-msgline">
              <span className="lnf-avatar" style={{ background: "#64748b" }}>RA</span>
              <div className="lnf-msg in lnf-typing"><i /><i /><i /></div>
            </div>
          </div>
          <div className="lnf-ticket-meta">
            <FaInstagram /> Story mention auto-thanked · 2m ago
          </div>
        </div>
      </div>
      <div className="lnf-float" style={{ bottom: -14, right: -6 }}>
        <FaInstagram /> New lead · IG DM
      </div>
    </div>
  );
}
/* ---------- 3. Email — campaign composer ---------- */
function EmailVisual() {
  return (
    <div className="lnf-stage" aria-hidden="true">
      <div className="lnf-shell">
        <div className="lnf-shell-bar">
          <span className="lnf-dots"><i /><i /><i /></span>
          <span className="lnf-shell-title">New campaign — October newsletter</span>
        </div>
        <div className="lnf-shell-body">
          <div className="lnf-mailrow">
            To: <span className="lnf-chip"><FiUsers /> All subscribers · 12,480</span>
          </div>
          <div className="lnf-mailrow">
            Subject:
            <span className="lnf-chip solid">A · 47% opens</span>
            <span className="lnf-chip">B · 31% opens</span>
          </div>
          <div className="lnf-mailbody">
            <div className="lnf-skel w80" />
            <div className="lnf-skel" style={{ width: "92%" }} />
            <div className="lnf-skel w60" />
          </div>
          <div className="lnf-mailfoot">
            <span className="lnf-chip tint"><FiSend /> Send via your SMTP</span>
            <span><FiClock style={{ verticalAlign: "-2px" }} /> Scheduled · Tue 10:00</span>
          </div>
        </div>
      </div>
      <div className="lnf-float" style={{ top: -14, right: 6 }}>
        <FiCheck /> 99.2% delivered · SES
      </div>
    </div>
  );
}

/* ---------- 4. CRM — kanban pipeline ---------- */
function KCard({ name, color, tag, value, dragging }) {
  return (
    <div className={`lnf-kcard${dragging ? " dragging" : ""}`}>
      <div className="lnf-kcard-top">
        <span className="lnf-avatar" style={{ background: color }}>{name}</span>
        <span className="lnf-skel" />
      </div>
      <div className="lnf-kcard-foot">
        {tag}
        <span>{value}</span>
      </div>
    </div>
  );
}
function CrmVisual() {
  return (
    <div className="lnf-stage" aria-hidden="true">
      <div className="lnf-shell">
        <div className="lnf-shell-bar">
          <span className="lnf-dots"><i /><i /><i /></span>
          <span className="lnf-shell-title">Pipeline · Q4</span>
          <span className="lnf-shell-badge">23 leads</span>
        </div>
        <div className="lnf-shell-body">
          <div className="lnf-kanban">
            <div className="lnf-kcol">
              <div className="lnf-kcol-h" style={{ "--kc": "#94a3b8" }}><i />New · 14</div>
              <div className="lnf-kcards">
                <KCard name="AR" color="#0ea5e9" tag={<SiMeta color="#1877f2" />} value="₹40k" />
                <KCard name="PS" color="#f59e0b" tag={<FaWhatsapp color="#22c55e" />} value="₹12k" />
              </div>
            </div>
            <div className="lnf-kcol">
              <div className="lnf-kcol-h" style={{ "--kc": "#f59e0b" }}><i />Hot · 6</div>
              <div className="lnf-kcards">
                <KCard name="VK" color="#7c3aed" tag={<FaWhatsapp color="#22c55e" />} value="₹85k" dragging />
                <KCard name="MJ" color="#ec4899" tag={<SiMeta color="#1877f2" />} value="₹28k" />
              </div>
            </div>
            <div className="lnf-kcol">
              <div className="lnf-kcol-h" style={{ "--kc": "#22c55e" }}><i />Won · 3</div>
              <div className="lnf-kcards">
                <KCard name="SG" color="#22c55e" tag={<FiCheck color="#16a34a" />} value="₹1.2L" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lnf-float" style={{ bottom: -14, left: -8 }}>
        <FiTrendingUp /> Score 87 · Hot lead
      </div>
    </div>
  );
}

/* ---------- 5. AI Studio — dark generator window ---------- */
function AiVisual() {
  return (
    <div className="lnf-stage" aria-hidden="true">
      <div className="lnf-shell dark">
        <div className="lnf-shell-bar">
          <span className="lnf-dots"><i /><i /><i /></span>
          <span className="lnf-shell-title">AI Studio</span>
          <span className="lnf-shell-badge"><span className="lnf-pulse" /> Running</span>
        </div>
        <div className="lnf-shell-body">
          <div className="lnf-thread">
            <div className="lnf-msg in">Write ad copy for a festive jewellery sale ✨</div>
          </div>
          <div className="lnf-ai-out">
            <div className="lnf-ai-line"><FiZap size={12} color="#f59e0b" /><span className="lnf-skel w80" /></div>
            <div className="lnf-ai-line"><FiZap size={12} color="#f59e0b" /><span className="lnf-skel" style={{ width: "70%" }} /></div>
            <div className="lnf-ai-line"><FiZap size={12} color="#f59e0b" /><span className="lnf-skel w40" /></div>
          </div>
          <div className="lnf-ai-chips">
            <span className="lnf-chip tint">Ad copy</span>
            <span className="lnf-chip tint">Email</span>
            <span className="lnf-chip tint">Rewriter</span>
            <span className="lnf-chip tint">Translator</span>
            <span className="lnf-chip tint">+16 more</span>
          </div>
          <div className="lnf-ai-foot">
            <FiZap /> Generated in 1.24s <span className="lnf-caret" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 6. Dashboard — live analytics ---------- */
function DashboardVisual() {
  return (
    <div className="lnf-stage" aria-hidden="true">
      <div className="lnf-shell">
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
              <div className="lnf-stat-l">Conv.</div>
              <div className="lnf-stat-v">24%</div>
              <div className="lnf-stat-d up">↑ 3%</div>
            </div>
          </div>
          <div className="lnf-bars">
            <i className="lnf-bar" style={{ "--h": "30%" }} />
            <i className="lnf-bar" style={{ "--h": "48%" }} />
            <i className="lnf-bar" style={{ "--h": "40%" }} />
            <i className="lnf-bar" style={{ "--h": "64%" }} />
            <i className="lnf-bar" style={{ "--h": "52%" }} />
            <i className="lnf-bar" style={{ "--h": "78%" }} />
            <i className="lnf-bar" style={{ "--h": "92%" }} />
          </div>
          <div className="lnf-funnel">
            <div className="lnf-funnel-row">New <i className="lnf-funnel-bar" style={{ "--w": "100%" }} /> <b>512</b></div>
            <div className="lnf-funnel-row">Contacted <i className="lnf-funnel-bar" style={{ "--w": "64%" }} /> <b>328</b></div>
            <div className="lnf-funnel-row">Hot <i className="lnf-funnel-bar" style={{ "--w": "38%" }} /> <b>194</b></div>
            <div className="lnf-funnel-row">Qualified <i className="lnf-funnel-bar" style={{ "--w": "22%" }} /> <b>112</b></div>
          </div>
        </div>
      </div>
      <div className="lnf-float" style={{ top: -14, right: -8 }}>
        <span className="lnf-pulse" /> Live · updated now
      </div>
    </div>
  );
}

/* ---------- 7. Storage — bucket browser ---------- */
function FileRow({ ext, color, name, size, meta }) {
  return (
    <div className="lnf-row">
      <span className="lnf-row-ic" style={{ background: `${color}18`, color }}>{ext}</span>
      <div>
        <div className="lnf-row-t">{name}</div>
        <div className="lnf-row-s">{size}</div>
      </div>
      <span className="lnf-row-meta">{meta}</span>
    </div>
  );
}
function StorageVisual() {
  return (
    <div className="lnf-stage" aria-hidden="true">
      <div className="lnf-shell">
        <div className="lnf-shell-bar">
          <span className="lnf-dots"><i /><i /><i /></span>
          <span className="lnf-shell-title mono">my-bucket / assets</span>
          <span className="lnf-shell-badge">2.1 GB used</span>
        </div>
        <div className="lnf-shell-body">
          <FileRow ext="PDF" color="#ef4444" name="brochure.pdf" size="2.4 MB" meta="v3" />
          <FileRow ext="IMG" color="#0ea5e9" name="hero.png" size="840 KB" meta={<FiLink />} />
          <FileRow ext="MP4" color="#7c3aed" name="demo.mp4" size="18 MB" meta="v1" />
          <FileRow ext="CSV" color="#22c55e" name="leads.csv" size="96 KB" meta="v7" />
          <div className="lnf-row">
            <span className="lnf-row-ic" style={{ background: "#eab30818", color: "#a16207" }}>ZIP</span>
            <div className="lnf-uprow">
              <div className="lnf-row-t">campaign.zip</div>
              <span className="lnf-progress"><i /></span>
            </div>
            <span className="lnf-row-meta">uploading…</span>
          </div>
          <div className="lnf-provrow">
            <span className="lnf-chip">AWS S3</span>
            <span className="lnf-chip">R2</span>
            <span className="lnf-chip">Wasabi</span>
            <span className="lnf-chip">Supabase</span>
            <span className="lnf-chip">MinIO</span>
          </div>
        </div>
      </div>
      <div className="lnf-float" style={{ bottom: -14, right: -6 }}>
        <FiLink /> Signed link · expires 24h
      </div>
    </div>
  );
}

/* ---------- 8. Calendar — month + booking card ---------- */
const CAL_DOTS = { 4: "#22c55e", 9: "#1877f2", 12: "#4285f4", 18: "#f97316", 24: "#7c3aed" };
function CalendarVisual() {
  return (
    <div className="lnf-stage lnf-cal-stage" aria-hidden="true">
      <div className="lnf-shell" style={{ maxWidth: 340 }}>
        <div className="lnf-shell-bar">
          <span className="lnf-dots"><i /><i /><i /></span>
          <span className="lnf-shell-title">September</span>
          <span className="lnf-shell-badge">12 bookings</span>
        </div>
        <div className="lnf-shell-body">
          <div className="lnf-cal">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <span key={i} className="lnf-cal-d">{d}</span>
            ))}
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 1;
              const out = day < 1 || day > 30;
              return (
                <span
                  key={i}
                  className={`lnf-cal-c${out ? " mute" : ""}${day === 16 ? " today" : ""}`}
                >
                  {out ? "" : day}
                  {!out && CAL_DOTS[day] ? <em style={{ "--dot": CAL_DOTS[day] }} /> : null}
                </span>
              );
            })}
          </div>
        </div>
      </div>
      <div className="lnf-book">
        <div className="lnf-book-t">
          <span className="lnf-avatar" style={{ background: "#4285f4" }}>RS</span>
          Sales call · 30 min
        </div>
        <div className="lnf-book-slots">
          <span className="lnf-chip">10:00</span>
          <span className="lnf-chip solid">10:30</span>
          <span className="lnf-chip">11:00</span>
        </div>
        <div className="lnf-book-foot">
          <FaWhatsapp /> Reminder scheduled <FiCheck />
        </div>
      </div>
    </div>
  );
}

/* ---------- 9. Tools — staggered tool cloud ---------- */
function ToolsVisual() {
  return (
    <div className="lnf-stage" aria-hidden="true">
      <div className="lnf-toolcloud">
        <span className="lnf-tool"><FiFileText /> Forms</span>
        <span className="lnf-tool"><FiCreditCard /> Invoices</span>
        <span className="lnf-tool"><FiLink /> UTM links</span>
        <span className="lnf-tool"><FiTool /> QR codes</span>
        <span className="lnf-tool hero"><FiZap /> 20+ free tools</span>
        <span className="lnf-tool"><FiMail /> Email check</span>
        <span className="lnf-tool"><FiTrendingUp /> A/B calc</span>
        <span className="lnf-tool"><FiFileText /> OG tags</span>
        <span className="lnf-tool"><FiTrendingUp /> ROI calc</span>
      </div>
    </div>
  );
}

/* ---------- 10. Support — live ticket thread ---------- */
function SupportVisual() {
  return (
    <div className="lnf-stage" aria-hidden="true">
      <div className="lnf-shell">
        <div className="lnf-shell-bar">
          <span className="lnf-dots"><i /><i /><i /></span>
          <span className="lnf-shell-title">Ticket #4821 — SMTP setup</span>
          <span className="lnf-shell-badge"><span className="lnf-pulse" /> Live</span>
        </div>
        <div className="lnf-shell-body">
          <div className="lnf-thread">
            <div className="lnf-msgline">
              <span className="lnf-avatar" style={{ background: "#64748b" }}>DK</span>
              <div className="lnf-msg in">How do I connect Amazon SES?</div>
            </div>
            <div className="lnf-msgline right">
              <span className="lnf-avatar" style={{ background: "#ef4444" }}>L</span>
              <div className="lnf-msg out">Settings → Email → SMTP — here&apos;s the step-by-step guide 📎</div>
            </div>
            <div className="lnf-msgline">
              <span className="lnf-avatar" style={{ background: "#64748b" }}>DK</span>
              <div className="lnf-msg in lnf-typing"><i /><i /><i /></div>
            </div>
          </div>
          <div className="lnf-ticket-meta">
            <FiLifeBuoy /> First reply in 14m · SLA &lt; 2h
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 11. Automation — flow canvas ---------- */
function AutomationVisual() {
  return (
    <div className="lnf-stage" aria-hidden="true">
      <div className="lnf-flowmap">
        <svg className="lnf-flow-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M50 18 C50 26, 50 30, 50 37" />
          <path d="M45 47 C37 54, 31 58, 28 65" />
          <path d="M55 47 C63 54, 69 58, 72 65" />
          <path d="M29 77 C35 84, 42 88, 46 89" />
          <path d="M71 77 C65 84, 58 88, 54 89" />
        </svg>
        <span className="lnf-node" style={{ left: "50%", top: "13%" }}>
          <span className="lnf-node-ic" style={{ "--nc": "#ec4899" }}><FiZap /></span> New lead
        </span>
        <span className="lnf-node cond" style={{ left: "50%", top: "42%" }}>
          <span className="lnf-node-ic" style={{ "--nc": "#f59e0b" }}><FiTrendingUp /></span> Score &gt; 70?
        </span>
        <span className="lnf-node" style={{ left: "26%", top: "71%" }}>
          <span className="lnf-node-ic" style={{ "--nc": "#22c55e" }}><FaWhatsapp /></span> Send WhatsApp
        </span>
        <span className="lnf-node" style={{ left: "75%", top: "71%" }}>
          <span className="lnf-node-ic" style={{ "--nc": "#0ea5e9" }}><FiClock /></span> Wait 2d → Email
        </span>
        <span className="lnf-node" style={{ left: "50%", top: "91%" }}>
          <span className="lnf-node-ic" style={{ "--nc": "#16a34a" }}><FiCheck /></span> Deal won
        </span>
      </div>
      <div className="lnf-float" style={{ top: -14, right: -6 }}>
        <FiCheck /> Dry run passed
      </div>
    </div>
  );
}
