"use client";

import { useCallback, useState } from "react";
import {
  FiArrowRight, FiCheck, FiMic, FiPhone, FiPhoneCall, FiPhoneForwarded,
  FiPhoneIncoming, FiPhoneMissed, FiCalendar, FiGlobe, FiFileText, FiUsers,
  FiHeadphones, FiBarChart2, FiZap, FiHome, FiBookOpen, FiHeart,
  FiShoppingBag, FiBriefcase, FiTrendingUp, FiPlay, FiShield, FiLink,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { SignupLink } from "@/components/site/AppLinks";
import DemoBookingModal from "./DemoBookingModal";

/**
 * Leadnator Voice — standalone product page for AI voice agents + VoIP calling.
 * Everything lives under the .lv scope (styles/marketing-voice.css) so it
 * reads as its own product while sharing the site header and footer.
 */
export default function LeadnatorVoicePage() {
  const [demoOpen, setDemoOpen] = useState(false);
  const openDemo = useCallback(() => setDemoOpen(true), []);
  const closeDemo = useCallback(() => setDemoOpen(false), []);

  return (
    <div className="lv">
      <Hero onBookDemo={openDemo} />
      <ProviderStrip />
      <Products />
      <HowItWorks />
      <DemoCall />
      <UseCases />
      <FinalCta onBookDemo={openDemo} />
      <DemoBookingModal open={demoOpen} onClose={closeDemo} />
    </div>
  );
}

/* ---------------- HERO ---------------- */
const HERO_CAPTION = ["Namaste", "Priya!", "Aapka", "demo", "Tuesday", "11", "baje", "book", "ho", "gaya", "hai."];

function Hero({ onBookDemo }) {
  return (
    <section className="lv-hero">
      <div className="lv-aurora" aria-hidden="true"><i /><i /><i /></div>
      <div className="lv-grid-bg" aria-hidden="true" />
      <div className="ln-container lv-hero-grid">
        <div className="lv-hero-copy">
          <span className="lv-pill">
            <span className="lv-pill-new">NEW</span> Leadnator Voice · AI calling + VoIP
          </span>
          <h1>
            Your business,<br />
            now with a <span className="lv-grad">voice.</span>
          </h1>
          <p>
            AI voice agents that answer every call, dial every new lead in seconds and book
            meetings on their own — plus a full cloud phone system for your team. All inside
            your Leadnator CRM.
          </p>
          <div className="lv-hero-cta">
            <SignupLink className="lv-btn lv-btn-primary">
              Start FREE Trial <FiArrowRight />
            </SignupLink>
            <button type="button" className="lv-btn lv-btn-ghost" onClick={onBookDemo}>
              <FiCalendar /> Book a demo
            </button>
            <a href="#demo" className="lv-btn lv-btn-link">
              <FiPlay /> Hear a demo call
            </a>
          </div>
          <ul className="lv-hero-stats">
            <li><strong>24/7</strong><span>Always answering</span></li>
            <li><strong>&lt; 60s</strong><span>New-lead callback</span></li>
            <li><strong>10+</strong><span>Languages</span></li>
            <li><strong>100%</strong><span>Calls logged</span></li>
          </ul>
        </div>

        <div className="lv-hero-stage" aria-hidden="true">
          <div className="lv-orbit lv-orbit-1"><span><FaWhatsapp /></span></div>
          <div className="lv-orbit lv-orbit-2"><span><FiCalendar /></span></div>
          <div className="lv-orbit lv-orbit-3"><span><FiUsers /></span></div>

          <div className="lv-core">
            <span className="lv-core-ring r1" />
            <span className="lv-core-ring r2" />
            <span className="lv-core-ring r3" />
            <div className="lv-core-orb"><FiMic /></div>
          </div>

          <div className="lv-bars">
            {Array.from({ length: 28 }, (_, i) => (
              <i key={i} style={{ animationDelay: `${(i % 7) * 0.11}s`, "--h": `${30 + ((i * 37) % 70)}%` }} />
            ))}
          </div>

          <div className="lv-caption">
            <span className="lv-caption-who"><i /> Aria · AI agent</span>
            <p>
              {HERO_CAPTION.map((w, i) => (
                <span key={i} style={{ animationDelay: `${i * 0.3}s` }}>{w} </span>
              ))}
            </p>
          </div>

          <div className="lv-chip lv-chip-a"><FiPhoneIncoming /> Inbound · answered in 1 ring</div>
          <div className="lv-chip lv-chip-b"><FiTrendingUp /> Lead score 86 · Hot</div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- PROVIDERS ---------------- */
function ProviderStrip() {
  const items = ["Twilio", "Exotel", "Plivo", "SIP trunks", "Virtual numbers", "WhatsApp", "Leadnator CRM"];
  return (
    <section className="lv-strip">
      <div className="ln-container">
        <p>Bring your own telephony — or get a number from us</p>
        <div className="lv-strip-track">
          {[...items, ...items].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- TWO PRODUCTS (bento) ---------------- */
const VOICE_FEATURES = [
  { Icon: FiPhoneIncoming, title: "Inbound AI receptionist", text: "Answers FAQs, pricing and bookings at 2 AM, on Sundays, on Diwali." },
  { Icon: FiPhoneForwarded, title: "Outbound lead calling", text: "New Meta or website lead? The agent calls back in under a minute." },
  { Icon: FiGlobe, title: "Hindi, English, Hinglish +", text: "Natural voices with your brand's script, tone and pronunciations." },
  { Icon: FiUsers, title: "Warm handoff", text: "Hot lead or tricky question — transfers live to the right human." },
];
const VOIP_FEATURES = [
  { Icon: FiPhoneCall, title: "Click-to-call", text: "Dial any lead from CRM, inbox or the mobile app in one tap." },
  { Icon: FiHeadphones, title: "Call recording", text: "Every call recorded and attached to the lead timeline." },
  { Icon: FiZap, title: "IVR & routing", text: "Menus, round-robin and missed-call WhatsApp follow-ups." },
  { Icon: FiBarChart2, title: "Team analytics", text: "Connect rate, talk time and conversions per agent." },
];

function Products() {
  return (
    <section className="lv-section" id="products">
      <div className="ln-container">
        <header className="lv-head">
          <span className="lv-eyebrow">Two products · one platform</span>
          <h2>AI that talks. <span className="lv-grad">Phones that sell.</span></h2>
          <p>Let AI handle the volume and your team handle the closing, with every word landing in the same CRM.</p>
        </header>

        <div className="lv-bento">
          <article className="lv-card lv-card-voice">
            <div className="lv-card-top">
              <span className="lv-card-ic"><FiMic /></span>
              <span className="lv-tag">AI Voice Agents</span>
            </div>
            <h3>An AI agent on every line, around the clock</h3>
            <p>Train it on your script, FAQs and offers. It qualifies, books and summarizes. You just read the results.</p>
            <ul className="lv-feat">
              {VOICE_FEATURES.map(({ Icon, title, text }) => (
                <li key={title}>
                  <span><Icon /></span>
                  <div><strong>{title}</strong><small>{text}</small></div>
                </li>
              ))}
            </ul>
          </article>

          <article className="lv-card lv-card-voip">
            <div className="lv-card-top">
              <span className="lv-card-ic"><FiPhone /></span>
              <span className="lv-tag">VoIP Calling</span>
            </div>
            <h3>A cloud phone system built into your CRM</h3>
            <p>No separate dialer, no spreadsheets. Calls, recordings and notes sit right on the lead.</p>
            <ul className="lv-feat">
              {VOIP_FEATURES.map(({ Icon, title, text }) => (
                <li key={title}>
                  <span><Icon /></span>
                  <div><strong>{title}</strong><small>{text}</small></div>
                </li>
              ))}
            </ul>
          </article>

          <article className="lv-card lv-card-mini">
            <FiFileText />
            <strong>Auto transcripts</strong>
            <small>Every call transcribed + summarized by AI.</small>
          </article>
          <article className="lv-card lv-card-mini">
            <FiCalendar />
            <strong>Books on the call</strong>
            <small>Checks your calendar and confirms live.</small>
          </article>
          <article className="lv-card lv-card-mini">
            <FaWhatsapp />
            <strong>WhatsApp follow-up</strong>
            <small>Missed call? A WhatsApp goes out instantly.</small>
          </article>
          <article className="lv-card lv-card-mini">
            <FiShield />
            <strong>Consent & DND aware</strong>
            <small>Calling hours, opt-outs and DND respected.</small>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ---------------- HOW IT WORKS ---------------- */
const STEPS = [
  { Icon: FiLink, title: "Connect a number", text: "Get a virtual number from Leadnator or plug in Twilio, Exotel or Plivo in two minutes." },
  { Icon: FiBookOpen, title: "Train your agent", text: "Paste your script, FAQs and pricing. Pick a voice and language. Test it by calling yourself." },
  { Icon: FiZap, title: "Go live", text: "Route inbound calls to the agent and trigger outbound calls from new leads or automations." },
];

function HowItWorks() {
  return (
    <section className="lv-section lv-section-alt">
      <div className="ln-container">
        <header className="lv-head">
          <span className="lv-eyebrow">Setup in minutes</span>
          <h2>From zero to talking in <span className="lv-grad">three steps</span></h2>
        </header>
        <ol className="lv-steps">
          {STEPS.map(({ Icon, title, text }, i) => (
            <li key={title} className="lv-step">
              <span className="lv-step-num">0{i + 1}</span>
              <span className="lv-step-ic"><Icon /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- DEMO CALL ---------------- */
const TRANSCRIPT = [
  { who: "ai", text: "Hi Rahul, this is Aria from Sunrise Realty. You enquired about 2BHK flats in Pune. Is now a good time?" },
  { who: "lead", text: "Haan, bataiye. Budget around 80 lakh hai." },
  { who: "ai", text: "Great, we have three options under ₹80L in Baner. Would you like a site visit this weekend?" },
  { who: "lead", text: "Sunday morning chalega." },
  { who: "ai", text: "Done! Sunday 11 AM is booked. I'm sending the location on WhatsApp now." },
];

function DemoCall() {
  return (
    <section className="lv-section" id="demo">
      <div className="ln-container lv-demo">
        <div className="lv-demo-copy">
          <span className="lv-eyebrow">See it in action</span>
          <h2>A real estate lead, <span className="lv-grad">called in 42 seconds</span></h2>
          <p>
            A Meta Lead Ad form comes in. Before your team has even seen it, Leadnator Voice
            has called, qualified the budget, booked a site visit and sent the location on WhatsApp.
          </p>
          <ul className="lv-checks">
            <li><FiCheck /> Lead captured from Meta form</li>
            <li><FiCheck /> Called back automatically</li>
            <li><FiCheck /> Budget + intent qualified</li>
            <li><FiCheck /> Site visit booked on calendar</li>
            <li><FiCheck /> WhatsApp location sent</li>
          </ul>
        </div>

        <div className="lv-call" aria-hidden="true">
          <div className="lv-call-head">
            <span className="lv-call-av">RK</span>
            <div>
              <strong>Rahul Kumar</strong>
              <small><i /> AI call in progress · 00:42</small>
            </div>
            <span className="lv-call-end"><FiPhone /></span>
          </div>
          <div className="lv-call-body">
            {TRANSCRIPT.map((line, i) => (
              <div key={i} className={`lv-line ${line.who}`} style={{ animationDelay: `${i * 0.5}s` }}>
                {line.who === "ai" ? <span className="lv-line-av"><FiMic /></span> : null}
                <p>{line.text}</p>
              </div>
            ))}
          </div>
          <div className="lv-call-summary">
            <div><small>Intent</small><strong>Site visit</strong></div>
            <div><small>Budget</small><strong>₹80L</strong></div>
            <div><small>Score</small><strong className="hot">92 · Hot</strong></div>
            <div><small>Next</small><strong>Sun 11 AM</strong></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- USE CASES ---------------- */
const USE_CASES = [
  { Icon: FiHome, color: "#22d3ee", title: "Real estate", text: "Call every portal & Meta lead instantly, qualify budget, book site visits." },
  { Icon: FiBookOpen, color: "#a78bfa", title: "Education", text: "Counsel admission enquiries, share fee details, book campus tours." },
  { Icon: FiHeart, color: "#f472b6", title: "Clinics & wellness", text: "Book, confirm and reschedule appointments — reduce no-shows." },
  { Icon: FiShoppingBag, color: "#fbbf24", title: "E-commerce", text: "COD confirmation calls, abandoned-cart nudges, delivery updates." },
  { Icon: FiBriefcase, color: "#34d399", title: "Finance & insurance", text: "Renewal reminders, loan eligibility checks and callback scheduling." },
  { Icon: FiUsers, color: "#60a5fa", title: "Agencies", text: "Run voice campaigns for every client from one white-label dashboard." },
];

function UseCases() {
  return (
    <section className="lv-section lv-section-alt">
      <div className="ln-container">
        <header className="lv-head">
          <span className="lv-eyebrow">Built for Indian businesses</span>
          <h2>One voice platform, <span className="lv-grad">every industry</span></h2>
        </header>
        <div className="lv-cases">
          {USE_CASES.map(({ Icon, color, title, text }) => (
            <article key={title} className="lv-case" style={{ "--c": color }}>
              <span className="lv-case-ic"><Icon /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FINAL CTA ---------------- */
function FinalCta({ onBookDemo }) {
  return (
    <section className="lv-final">
      <div className="ln-container">
        <div className="lv-final-card">
          <div className="lv-final-orb" aria-hidden="true"><FiMic /></div>
          <h2>Give your business a voice today</h2>
          <p>Try Leadnator Voice free for 2 days. No credit card, human onboarding included.</p>
          <div className="lv-hero-cta lv-final-cta">
            <SignupLink className="lv-btn lv-btn-primary">
              Start FREE Trial <FiArrowRight />
            </SignupLink>
            <button type="button" className="lv-btn lv-btn-ghost" onClick={onBookDemo}>
              <FiCalendar /> Book a demo
            </button>
          </div>
          <ul className="lv-final-meta">
            <li><FiCheck /> 2-day free trial</li>
            <li><FiCheck /> No credit card</li>
            <li><FiPhoneMissed /> Never miss a call again</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
