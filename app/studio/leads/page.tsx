"use client";

import { useCallback, useEffect, useState } from "react";
import { FiLink, FiRefreshCw, FiUsers, FiX } from "react-icons/fi";
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
        setWebhookError(data.error || "Could not save webhook URL.");
        return;
      }
      setWebhookSaved(data.url ?? "");
      setModalOpen(false);
    } catch {
      setWebhookError("Could not save webhook URL.");
    } finally {
      setWebhookBusy(false);
    }
  }

  return (
    <StudioShell
      title="Leads"
      subtitle="Contact form submissions from your website — stored here and forwarded to your webhook"
    >
      <div className="sl-head">
        <div className="sl-head-copy">
          <span className="sl-head-badge"><FiUsers aria-hidden /> {leads.length} total</span>
          <p>Every message from the public contact form appears here in real time.</p>
        </div>
        <div className="sl-head-actions">
          <button type="button" className="ln-btn ln-btn-outline ln-btn-sm" onClick={loadLeads} disabled={loading}>
            <FiRefreshCw aria-hidden /> Refresh
          </button>
          <button type="button" className="ln-btn ln-btn-primary ln-btn-sm" onClick={openWebhookModal}>
            <FiLink aria-hidden /> Leads Webhook
          </button>
        </div>
      </div>

      {webhookSaved ? (
        <p className="sl-webhook-status">
          Webhook active — new form submissions are POSTed to your configured URL.
        </p>
      ) : (
        <p className="sl-webhook-status sl-webhook-status-muted">
          No webhook configured — leads are saved here only. Click <strong>Leads Webhook</strong> to add one.
        </p>
      )}

      {loading ? (
        <p className="studio-loading">Loading leads…</p>
      ) : leads.length === 0 ? (
        <div className="studio-empty">
          <h2>No leads yet</h2>
          <p>Submissions from the contact page will show up here automatically.</p>
        </div>
      ) : (
        <div className="sl-table-wrap">
          <table className="sl-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Reason</th>
                <th>Message</th>
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
                      >
                        {expanded ? lead.message : lead.message.slice(0, 80) + (lead.message.length > 80 ? "…" : "")}
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
                <h2 id="sl-modal-title">Leads Webhook</h2>
                <p>Paste a URL — every contact form submission will be sent there as JSON. No email is sent.</p>
              </div>
              <button type="button" className="sl-modal-close" onClick={() => setModalOpen(false)} aria-label="Close">
                <FiX aria-hidden />
              </button>
            </div>

            <form onSubmit={saveWebhook} className="sl-modal-form">
              <label>
                <span>Webhook URL</span>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://hooks.zapier.com/hooks/catch/..."
                  autoFocus
                />
              </label>
              <p className="sl-modal-hint">
                Payload includes name, email, company, reason, message and timestamp. Leave empty to disable.
              </p>
              {webhookError ? <p className="studio-error">{webhookError}</p> : null}
              <div className="sl-modal-actions">
                <button type="button" className="ln-btn ln-btn-outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="ln-btn ln-btn-primary" disabled={webhookBusy}>
                  {webhookBusy ? "Saving…" : "Save webhook"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </StudioShell>
  );
}
