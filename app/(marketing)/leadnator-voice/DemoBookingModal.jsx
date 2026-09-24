"use client";

import { useEffect, useRef, useState } from "react";
import { FiCalendar, FiCheck, FiLoader, FiX } from "react-icons/fi";

const PRODUCTS = ["AI Voice Agents", "VoIP Calling", "Both"];
const INDUSTRIES = [
  "Real estate", "Education", "Clinics & wellness", "E-commerce",
  "Finance & insurance", "Agency", "Other",
];
const TIME_SLOTS = [
  "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM",
];

function todayYmd() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const EMPTY = {
  name: "", phone: "", email: "", company: "", industry: "", product: "Both",
  preferredDate: "", preferredTime: "", message: "", website: "",
};

/** Book-a-demo form in a modal. Submissions land in Admin → Demo bookings. */
export default function DemoBookingModal({ open, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [state, setState] = useState("idle"); // idle | sending | done
  const [error, setError] = useState("");
  const firstFieldRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => firstFieldRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  if (!open) return null;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  function close() {
    onClose();
    if (state === "done") {
      setForm(EMPTY);
      setState("idle");
    }
    setError("");
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setState("sending");
    try {
      const res = await fetch("/api/public/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "leadnator-voice" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setState("idle");
        return;
      }
      setState("done");
    } catch {
      setError("Network error — please check your connection and try again.");
      setState("idle");
    }
  }

  return (
    <div className="lv-modal" role="dialog" aria-modal="true" aria-labelledby="lv-demo-title">
      <button type="button" className="lv-modal-backdrop" aria-label="Close" onClick={close} />
      <div className="lv-modal-card">
        <button type="button" className="lv-modal-close" onClick={close} aria-label="Close">
          <FiX />
        </button>

        {state === "done" ? (
          <div className="lv-modal-done">
            <span className="lv-modal-done-ic"><FiCheck /></span>
            <h2 id="lv-demo-title">Demo request received!</h2>
            <p>
              Thanks {form.name.split(" ")[0] || "there"} — our team will call you on{" "}
              <strong>{form.phone}</strong> to confirm your slot on{" "}
              <strong>{form.preferredDate}</strong> at <strong>{form.preferredTime}</strong>.
            </p>
            <button type="button" className="lv-btn lv-btn-primary" onClick={close}>Done</button>
          </div>
        ) : (
          <>
            <div className="lv-modal-head">
              <span className="lv-modal-ic"><FiCalendar /></span>
              <div>
                <h2 id="lv-demo-title">Book a live demo</h2>
                <p>See Leadnator Voice on a real call — 30 minutes, tailored to your business.</p>
              </div>
            </div>

            <form className="lv-form" onSubmit={submit}>
              <div className="lv-form-grid">
                <label>
                  <span>Full name *</span>
                  <input ref={firstFieldRef} required value={form.name} onChange={set("name")} placeholder="Priya Sharma" autoComplete="name" />
                </label>
                <label>
                  <span>Phone / WhatsApp *</span>
                  <input required type="tel" value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210" autoComplete="tel" />
                </label>
                <label>
                  <span>Work email *</span>
                  <input required type="email" value={form.email} onChange={set("email")} placeholder="priya@company.com" autoComplete="email" />
                </label>
                <label>
                  <span>Company *</span>
                  <input required value={form.company} onChange={set("company")} placeholder="Sunrise Realty" autoComplete="organization" />
                </label>
                <label>
                  <span>Industry</span>
                  <select value={form.industry} onChange={set("industry")}>
                    <option value="">Select industry</option>
                    {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </label>
                <div className="lv-form-field">
                  <span>Interested in</span>
                  <div className="lv-seg" role="radiogroup" aria-label="Interested in">
                    {PRODUCTS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        role="radio"
                        aria-checked={form.product === p}
                        className={form.product === p ? "on" : ""}
                        onClick={() => setForm((f) => ({ ...f, product: p }))}
                      >
                        {p === "AI Voice Agents" ? "AI Voice" : p === "VoIP Calling" ? "VoIP" : p}
                      </button>
                    ))}
                  </div>
                </div>
                <label>
                  <span>Preferred date *</span>
                  <input required type="date" min={todayYmd()} value={form.preferredDate} onChange={set("preferredDate")} />
                </label>
                <label>
                  <span>Preferred time (IST) *</span>
                  <select required value={form.preferredTime} onChange={set("preferredTime")}>
                    <option value="">Select a slot</option>
                    {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </label>
                <label className="lv-form-full">
                  <span>What would you like to see? (optional)</span>
                  <textarea rows={3} value={form.message} onChange={set("message")} placeholder="e.g. Auto-calling Meta leads in Hindi for our real estate projects" />
                </label>
              </div>

              {/* Honeypot — hidden from people, filled by bots. */}
              <input
                type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
                className="lv-hp" value={form.website} onChange={set("website")}
              />

              {error ? <p className="lv-form-error" role="alert">{error}</p> : null}

              <button type="submit" className="lv-btn lv-btn-primary lv-form-submit" disabled={state === "sending"}>
                {state === "sending" ? <><FiLoader className="lv-spin" /> Booking…</> : <>Book my demo <FiCalendar /></>}
              </button>
              <p className="lv-form-note">No spam. We&apos;ll only contact you about your demo.</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
