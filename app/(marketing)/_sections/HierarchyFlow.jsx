"use client";

import Link from "next/link";
import { APP_SIGNUP_URL } from "@/lib/app-url";
import {
  FiMessageSquare, FiPhoneCall, FiMail, FiCheck, FiArrowRight,
  FiZap, FiTarget, FiTrendingUp,
} from "react-icons/fi";
import { FaFacebook, FaInstagram, FaWhatsapp, FaGoogle } from "react-icons/fa";
import { SiMeta } from "react-icons/si";

/* ==========================================================
   5X revenue hierarchy flow.

   Layout uses a container with fixed aspect-ratio 900:850 and
   the SVG viewBox matches (0 0 900 850). All DOM elements are
   placed absolutely using % coordinates derived from the SAME
   numbers the SVG uses — so boxes and connector lines stay
   aligned at every screen size.
   ========================================================== */

// Element Y centers (in SVG units) ---------------------------
const Y = {
  channels: 55,
  capture:  175,
  core:     265,
  actions:  360,
  qualify:  450,
  nurture:  540,
  branch:   640,
  outcomes: 740,
};

// Half-heights so we know where each connector should attach.
const H = {
  channels: 22,   // 44px circle
  capture:  32,   // 64px trapezoid
  core:     20,   // 40px pill
  actions:  22,   // 44px boxes
  qualify:  20,   // 40px pill
  nurture:  20,   // 40px pill
  branch:   19,   // 38px nodes
  outcomes: 19,   // 38px nodes
};

// Horizontal centers (SVG units) ------------------------------
const CH_X = [270, 360, 450, 540, 630];  // 5 channel icons
const AC_X = [180, 315, 450, 585, 720];  // 5 action boxes
const CENTER_X = 450;
const BRANCH_L = 260;  // x of Positive / Lead Won column
const BRANCH_R = 640;  // x of Negative / Long Nurture column

// Helpers: turn SVG coords into CSS % for absolute positioning.
// Container height matches the `/780` denominator below — so 780 = bottom
// of the dark panel. Keeping Y values unchanged inside the flow while
// trimming empty bottom space gives us balanced vertical padding.
const px = (x) => `${(x / 900) * 100}%`;

const MOBILE_V = 1560;
const MOBILE_STRETCH = MOBILE_V / 780;
const YM = Object.fromEntries(
  Object.entries(Y).map(([k, v]) => [k, Math.round(Number(v) * MOBILE_STRETCH)])
);

function FlowDiagram({
  className,
  viewH,
  yMap,
  hMap,
  chX,
  acX,
  cx,
  bL,
  bR,
  grad,
  channels,
  actions,
  days,
}) {
  const pctY = (yy) => `${(yy / viewH) * 100}%`;
  const rowTop = (row) => yMap[row] - hMap[row];
  const rowBottom = (row) => yMap[row] + hMap[row];

  return (
    <div className={className}>
      <svg
        className="ln-hier-svg"
        viewBox={`0 0 900 ${viewH}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={grad.line} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id={grad.pos} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
          <linearGradient id={grad.neg} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
          <filter id={grad.glow} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {chX.map((x, i) => (
          <path
            key={`ch-${i}`}
            d={`M ${x} ${rowBottom("channels")} C ${x} ${rowBottom("channels") + 30}, ${cx} ${rowTop("capture") - 30}, ${cx} ${rowTop("capture")}`}
            stroke={`url(#${grad.line})`} strokeWidth="2" fill="none"
            filter={`url(#${grad.glow})`} className="lh-flow"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}

        <line
          x1={cx} y1={rowBottom("capture")} x2={cx} y2={rowTop("core")}
          stroke={`url(#${grad.line})`} strokeWidth="2.5"
          filter={`url(#${grad.glow})`} className="lh-flow"
        />

        {acX.map((x, i) => (
          <path
            key={`ac-${i}`}
            d={`M ${cx} ${rowBottom("core")} C ${cx} ${rowBottom("core") + 25}, ${x} ${rowTop("actions") - 25}, ${x} ${rowTop("actions")}`}
            stroke={`url(#${grad.line})`} strokeWidth="2" fill="none"
            filter={`url(#${grad.glow})`} className="lh-flow"
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ))}

        {acX.map((x, i) => (
          <path
            key={`aq-${i}`}
            d={`M ${x} ${rowBottom("actions")} C ${x} ${rowBottom("actions") + 20}, ${cx} ${rowTop("qualify") - 20}, ${cx} ${rowTop("qualify")}`}
            stroke={`url(#${grad.line})`} strokeWidth="2" fill="none"
            filter={`url(#${grad.glow})`} className="lh-flow"
            style={{ animationDelay: `${i * 0.1 + 0.3}s` }}
          />
        ))}

        <line
          x1={cx} y1={rowBottom("qualify")} x2={cx} y2={rowTop("nurture")}
          stroke={`url(#${grad.line})`} strokeWidth="2.5"
          filter={`url(#${grad.glow})`} className="lh-flow"
        />

        <path
          d={`M ${cx} ${rowBottom("nurture")} C ${cx} ${rowBottom("nurture") + 30}, ${bL} ${rowTop("branch") - 30}, ${bL} ${rowTop("branch")}`}
          stroke={`url(#${grad.pos})`} strokeWidth="2.5" fill="none"
          filter={`url(#${grad.glow})`} className="lh-flow"
        />
        <path
          d={`M ${cx} ${rowBottom("nurture")} C ${cx} ${rowBottom("nurture") + 30}, ${bR} ${rowTop("branch") - 30}, ${bR} ${rowTop("branch")}`}
          stroke={`url(#${grad.neg})`} strokeWidth="2.5" fill="none"
          filter={`url(#${grad.glow})`} className="lh-flow"
        />

        <line
          x1={bL} y1={rowBottom("branch")} x2={bL} y2={rowTop("outcomes")}
          stroke={`url(#${grad.pos})`} strokeWidth="2.5"
          filter={`url(#${grad.glow})`} className="lh-flow"
        />
        <line
          x1={bR} y1={rowBottom("branch")} x2={bR} y2={rowTop("outcomes")}
          stroke={`url(#${grad.neg})`} strokeWidth="2.5"
          filter={`url(#${grad.glow})`} className="lh-flow"
        />
      </svg>

      <div className="lh-abs lh-channels-row" style={{ left: "50%", top: pctY(yMap.channels) }}>
        {channels.map((c, i) => (
          <div key={i} className="lh-channel" style={{ boxShadow: `0 0 20px ${c.color}55` }}>
            <c.Icon style={{ color: c.color }} />
          </div>
        ))}
      </div>

      <div className="lh-abs lh-capture" style={{ left: "50%", top: pctY(yMap.capture) }}>
        <span>Lead Capture</span>
      </div>

      <div className="lh-abs lh-core" style={{ left: "50%", top: pctY(yMap.core) }}>
        <span className="lh-core-dot" />
        Leadnator API Automation
      </div>

      {actions.map((a, i) => (
        <div
          key={a.label}
          className="lh-abs lh-action"
          style={{ left: px(acX[i]), top: pctY(yMap.actions), background: a.color }}
        >
          <a.Icon />
          <span>{a.label}</span>
        </div>
      ))}

      <div className="lh-abs lh-pill lh-qualify" style={{ left: "50%", top: pctY(yMap.qualify) }}>
        <FiCheck /> Auto Qualify Lead
      </div>

      <div className="lh-abs lh-nurture-wrap" style={{ left: "50%", top: pctY(yMap.nurture) }}>
        <div className="lh-days">
          {days.slice(0, 2).map((d) => (
            <span key={d} className="lh-day"><FaWhatsapp /> {d}</span>
          ))}
        </div>
        <div className="lh-pill lh-nurture">Auto Nurture</div>
        <div className="lh-days">
          {days.slice(2).map((d) => (
            <span key={d} className="lh-day"><FaWhatsapp /> {d}</span>
          ))}
        </div>
      </div>

      <div className="lh-abs lh-branch-node pos" style={{ left: px(bL), top: pctY(yMap.branch) }}>Positive</div>
      <div className="lh-abs lh-branch-node neg" style={{ left: px(bR), top: pctY(yMap.branch) }}>Negative</div>

      <div className="lh-abs lh-outcome pos" style={{ left: px(bL), top: pctY(yMap.outcomes) }}>Lead Won</div>
      <div className="lh-abs lh-outcome neg" style={{ left: px(bR), top: pctY(yMap.outcomes) }}>Long Nurture</div>
    </div>
  );
}

export default function HierarchyFlow() {
  const CHANNELS_TOP = [
    { Icon: FaFacebook,   color: "#1877f2" },
    { Icon: FaInstagram,  color: "#e1306c" },
    { Icon: FaGoogle,     color: "#fbbc05" },
    { Icon: FaWhatsapp,   color: "#25d366" },
    { Icon: FiMail,       color: "#ea4335" },
  ];
  const ACTIONS = [
    { Icon: FiMessageSquare, label: "AI Chat",    color: "#3b82f6" },
    { Icon: FiPhoneCall,     label: "AI Calling", color: "#22c55e" },
    { Icon: SiMeta,          label: "Chatbot",    color: "#a855f7" },
    { Icon: FaWhatsapp,      label: "WhatsApp",   color: "#14b8a6" },
    { Icon: FiMail,          label: "Email",      color: "#ef4444" },
  ];
  const DAYS = ["Day 01", "Day 03", "Day 05", "Day 07"];

  return (
    <section className="ln-hier-section">
      <div className="ln-container ln-hier-grid">
        {/* ===== LEFT: narrative ===== */}
        <div className="ln-hier-copy">
          <span className="ln-eyebrow">End-to-end revenue flow</span>
          <h2>
            <span className="ln-hier-5x">5X</span> your revenue with the power of
            <b className="ln-hier-ai"> AI</b> &amp;
            <b className="ln-hier-wa"> WhatsApp</b>
          </h2>
          <p className="ln-hier-lead">
            Leadnator compresses your entire sales funnel — from the first Meta ad
            click to a closed deal — into one automated pipeline. Every channel,
            every touchpoint, every follow-up runs for you.
          </p>

          <div className="ln-hier-points">
            <div className="ln-hier-point">
              <div className="ln-hier-point-ic" style={{ background: "#ede9fe", color: "#7c3aed" }}>
                <FiTarget />
              </div>
              <div>
                <h4>Capture leads from every channel</h4>
                <p>
                  Facebook, Instagram, Google, WhatsApp and email flow into a single
                  Lead Capture queue — no tool-switching, no duplicates.
                </p>
              </div>
            </div>

            <div className="ln-hier-point">
              <div className="ln-hier-point-ic" style={{ background: "#dbeafe", color: "#2563eb" }}>
                <FiZap />
              </div>
              <div>
                <h4>Automate with the Leadnator engine</h4>
                <p>
                  AI Chat, AI Calling, Chatbot, WhatsApp and Email engage each lead
                  within seconds. Pre-built flows qualify and route them to the
                  right agent automatically.
                </p>
              </div>
            </div>

            <div className="ln-hier-point">
              <div className="ln-hier-point-ic" style={{ background: "#fef3c7", color: "#f97316" }}>
                <FiMessageSquare />
              </div>
              <div>
                <h4>7-day WhatsApp nurture sequence</h4>
                <p>
                  Every qualified lead drops into a 4-touch WhatsApp nurture
                  (Day 01 → 03 → 05 → 07). No response? They move to long-term
                  nurture. Positive intent? Straight to close.
                </p>
              </div>
            </div>

            <div className="ln-hier-point">
              <div className="ln-hier-point-ic" style={{ background: "#dcfce7", color: "#16a34a" }}>
                <FiTrendingUp />
              </div>
              <div>
                <h4>Measurable 5× revenue lift</h4>
                <p>
                  Our best-performing teams report 3-5× higher conversion after
                  moving to this model — because leads never go cold and every
                  stage is tracked, scored and attributed.
                </p>
              </div>
            </div>
          </div>

          <div className="ln-hier-cta-row">
            <a href={APP_SIGNUP_URL} className="ln-btn ln-btn-primary">
              Start your flow <FiArrowRight />
            </a>
            <Link href="/features" className="ln-link-arrow">
              See every step <FiArrowRight />
            </Link>
          </div>
        </div>

        {/* ===== Flow diagram ===== */}
        <div className="ln-hier-viewport">
          <FlowDiagram
            className="ln-hier ln-hier-diagram ln-hier-diagram--desktop"
            viewH={780}
            yMap={Y}
            hMap={H}
            chX={CH_X}
            acX={AC_X}
            cx={CENTER_X}
            bL={BRANCH_L}
            bR={BRANCH_R}
            grad={{ line: "lh-line", pos: "lh-pos", neg: "lh-neg", glow: "lh-glow" }}
            channels={CHANNELS_TOP}
            actions={ACTIONS}
            days={DAYS}
          />
          <FlowDiagram
            className="ln-hier ln-hier-diagram ln-hier-diagram--mobile"
            viewH={MOBILE_V}
            yMap={YM}
            hMap={H}
            chX={CH_X}
            acX={AC_X}
            cx={CENTER_X}
            bL={BRANCH_L}
            bR={BRANCH_R}
            grad={{ line: "lh-m-line", pos: "lh-m-pos", neg: "lh-m-neg", glow: "lh-m-glow" }}
            channels={CHANNELS_TOP}
            actions={ACTIONS}
            days={DAYS}
          />
        </div>
      </div>
    </section>
  );
}
