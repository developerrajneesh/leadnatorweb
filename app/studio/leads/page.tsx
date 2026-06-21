"use client";

import { useCallback, useEffect, useState } from "react";
import { FiLink, FiRefreshCw, FiTrash2, FiUsers, FiX } from "react-icons/fi";
import StudioShell from "@/components/studio/StudioShell";
import type { ContactLead } from "@/lib/leads/types";

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function StudioLeadsPage() {
  const [leads, setLeads] = useState<ContactLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookSaved, setWebhookSaved] = useState("");
  const [webhookBusy, setWebhookBusy] = useState(false);
  const [webhookError, setWebhookError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadLeads = useCallback(() => {
    setLoading(true);
    fetch("/api/studio/leads")
      .then((r) => (r.ok ? r.json() : []))
      .then(setLeads)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  async function openWebhookModal() {
    setWebhookError("");
    setModalOpen(true);
    const res = await fetch("/api/studio/leads/webhook");
    if (res.ok) {
      const data = await res.json();
      setWebhookUrl(data.url ?? "");
      setWebhookSaved(data.url ?? "");
    }
  }

  async function saveWebhook(e: React.FormEvent) {
    e.preventDefault();
    setWebhookBusy(true);
    setWebhookError("");
    try {
      const res = await fetch("/api/studio/leads/webhook", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: webhookUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setWebhookError(data.error || "We couldn't save that link. Please try again.");
        return;
      }
      setWebhookSaved(data.url ?? "");
      setModalOpen(false);
    } catch {
      setWebhookError("Something went wrong. Please check your connection and try again.");
    } finally {
      setWebhookBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this message? This can't be undone.")) return;
    const res = await fetch(`/api/studio/leads/${id}`, { method: "DELETE" });
    if (res.ok) {
      setLeads((prev) => prev.filter((l) => l.id !== id));
      if (expandedId === id) setExpandedId(null);
    }
  }

  return (
    <StudioShell
      title="Your leads"
      subtitle="Everyone who reached out through your contact page — all in one place"
    >
      <div className="sl-head">
        <div className="sl-head-copy">
          <span className="sl-head-badge">
            <FiUsers aria-hidden /> {leads.length} {leads.length === 1 ? "person" : "people"} reached out
          </span>
          <p>When someone fills in your contact form, you'll see their details here right away.</p>
        </div>
        <div className="sl-head-actions">
          <button type="button" className="ln-btn ln-btn-outline ln-btn-sm" onClick={loadLeads} disabled={loading}>
            <FiRefreshCw aria-hidden /> Refresh list
          </button>
          <button type="button" className="ln-btn ln-btn-primary ln-btn-sm" onClick={openWebhookModal}>
            <FiLink aria-hidden /> Connect your tools
          </button>
        </div>
      </div>

      {webhookSaved ? (
        <p className="sl-webhook-status">
          You're all set — new messages are automatically sent to your connected app.
        </p>
      ) : (
        <p className="sl-webhook-status sl-webhook-status-muted">
          Want leads in Zapier, Make or your CRM? Tap <strong>Connect your tools</strong> to set it up in seconds.
        </p>
      )}

      {loading ? (
        <p className="studio-loading">Getting your leads ready…</p>
      ) : leads.length === 0 ? (
        <div className="studio-empty">
          <h2>No messages yet</h2>
          <p>When someone submits your contact form, their details will appear here. Share your contact page to get started!</p>
        </div>
      ) : (
        <div className="sl-table-wrap">
          <table className="sl-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Topic</th>
                <th>Message</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const expanded = expandedId === lead.id;
                return (
                  <tr key={lead.id}>
                    <td className="sl-date">{formatDate(lead.createdAt)}</td>
                    <td><strong>{lead.name}</strong></td>
                    <td><a href={`mailto:${lead.email}`}>{lead.email}</a></td>
                    <td>{lead.company || "—"}</td>
                    <td><span className="sl-tag">{lead.interest}</span></td>
                    <td className="sl-message">
                      <button
                        type="button"
                        className="sl-message-btn"
                        onClick={() => setExpandedId(expanded ? null : lead.id)}
                        title={expanded ? "Show less" : "Read full message"}
                      >
                        {expanded ? lead.message : lead.message.slice(0, 80) + (lead.message.length > 80 ? "…" : "")}
                      </button>
                    </td>
                    <td className="sl-actions">
                      <button
                        type="button"
                        className="studio-icon-btn danger"
                        onClick={() => remove(lead.id)}
                        title="Remove this message"
                        aria-label={`Remove message from ${lead.name}`}
                      >
                        <FiTrash2 aria-hidden />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="sl-modal-backdrop" onClick={() => setModalOpen(false)} role="presentation">
          <div
            className="sl-modal"
            role="dialog"
            aria-labelledby="sl-modal-title"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sl-modal-head">
              <div>
                <h2 id="sl-modal-title">Send leads to your app</h2>
                <p>
                  Paste a link from Zapier, Make, or your CRM — we'll send every new contact form
                  submission there automatically. No emails involved.
                </p>
              </div>
              <button type="button" className="sl-modal-close" onClick={() => setModalOpen(false)} aria-label="Close">
                <FiX aria-hidden />
              </button>
            </div>

            <form onSubmit={saveWebhook} className="sl-modal-form">
              <label>
                <span>Your app link</span>
                <textarea
                  rows={2}
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://hooks.zapier.com/hooks/catch/..."
                  spellCheck={false}
                  autoComplete="off"
                />
              </label>
              <p className="sl-modal-hint">
                We'll send their name, email, company, topic and message. Clear this field anytime to turn it off.
              </p>
              {webhookError ? <p className="studio-error">{webhookError}</p> : null}
              <div className="sl-modal-actions">
                <button type="button" className="ln-btn ln-btn-outline" onClick={() => setModalOpen(false)}>
                  Not now
                </button>
                <button type="submit" className="ln-btn ln-btn-primary" disabled={webhookBusy}>
                  {webhookBusy ? "Saving…" : "Save connection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </StudioShell>
  );
}
