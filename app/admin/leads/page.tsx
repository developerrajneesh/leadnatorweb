"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiExternalLink,
  FiLink,
  FiMail,
  FiRefreshCw,
  FiSearch,
  FiTag,
  FiTrash2,
  FiUsers,
  FiX,
} from "react-icons/fi";
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

function formatDay(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function isWithinDays(iso: string, days: number): boolean {
  const then = new Date(iso).getTime();
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return then >= cutoff;
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
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

  const loadLeads = useCallback(() => {
    setLoading(true);
    fetch("/api/studio/leads")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: ContactLead[]) => {
        setLeads(data);
        setSelected(new Set());
      })
      .finally(() => setLoading(false));
  }, []);

  const loadWebhook = useCallback(() => {
    fetch("/api/studio/leads/webhook")
      .then((r) => (r.ok ? r.json() : { url: "" }))
      .then((data) => {
        const url = data.url ?? "";
        setWebhookUrl(url);
        setWebhookSaved(url);
      })
      .catch(() => {
        setWebhookUrl("");
        setWebhookSaved("");
      });
  }, []);

  useEffect(() => {
    loadLeads();
    loadWebhook();
  }, [loadLeads, loadWebhook]);

  const topics = useMemo(() => {
    const set = new Set(leads.map((l) => l.interest).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [leads]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((lead) => {
      if (topic !== "all" && lead.interest !== topic) return false;
      if (!q) return true;
      const hay = [lead.name, lead.email, lead.company ?? "", lead.interest, lead.message]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [leads, query, topic]);

  const weekCount = useMemo(
    () => leads.filter((l) => isWithinDays(l.createdAt, 7)).length,
    [leads],
  );

  async function openWebhookModal() {
    setWebhookError("");
    setModalOpen(true);
    await loadWebhook();
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
      setSelected((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      if (expandedId === id) setExpandedId(null);
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((l) => selected.has(l.id));
  const someFilteredSelected = filtered.some((l) => selected.has(l.id));

  function toggleSelectAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) filtered.forEach((l) => next.delete(l.id));
      else filtered.forEach((l) => next.add(l.id));
      return next;
    });
  }

  async function removeSelected() {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    const label = ids.length === 1 ? "1 selected lead" : `${ids.length} selected leads`;
    if (!confirm(`Delete ${label}? This can't be undone.`)) return;
    setBulkBusy(true);
    try {
      const res = await fetch("/api/studio/leads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => !selected.has(l.id)));
        if (expandedId && selected.has(expandedId)) setExpandedId(null);
        setSelected(new Set());
      }
    } finally {
      setBulkBusy(false);
    }
  }

  function applySearch(e: React.FormEvent) {
    e.preventDefault();
    setQuery(search.trim());
  }

  function clearSearch() {
    setSearch("");
    setQuery("");
  }

  return (
    <StudioShell
      title="Your leads"
      subtitle="Contact form messages — reply, export or forward to your CRM"
    >
      <header className="sl-hero">
        <div className="sl-hero-grid">
          <div className="sl-hero-copy">
            <span className="sl-hero-eyebrow">
              <FiUsers aria-hidden strokeWidth={2.25} /> Inbox
            </span>
            <h2 className="sl-hero-title">Your leads</h2>
            <p className="sl-hero-lead">
              Every message from your contact page lands here. Search by name or email,
              filter by topic, and connect Zapier or Make to push new leads into your stack.
            </p>
          </div>

          <div className="sl-hero-actions">
            <button
              type="button"
              className="ln-btn ln-btn-primary"
              onClick={openWebhookModal}
            >
              <FiLink aria-hidden strokeWidth={2.25} /> Connect tools
            </button>
            <button
              type="button"
              className="ln-btn ln-btn-outline"
              onClick={loadLeads}
              disabled={loading}
            >
              <FiRefreshCw aria-hidden strokeWidth={2.25} /> Refresh
            </button>
            <Link
              href="/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="ln-btn ln-btn-ghost sl-hero-ghost"
            >
              <FiExternalLink aria-hidden strokeWidth={2.25} /> Contact page
            </Link>
          </div>
        </div>

      </header>

      <div className="sl-stats" aria-label="Lead counts">
        <div className="sl-stat-card">
          <span className="sl-stat-ic sl-stat-ic-blue"><FiUsers aria-hidden /></span>
          <div className="sl-stat-card-body">
            <strong>{leads.length}</strong>
            <span>Total leads</span>
          </div>
        </div>
        <div className="sl-stat-card">
          <span className="sl-stat-ic sl-stat-ic-green"><FiClock aria-hidden /></span>
          <div className="sl-stat-card-body">
            <strong>{weekCount}</strong>
            <span>Last 7 days</span>
          </div>
        </div>
        <div className="sl-stat-card">
          <span className={`sl-stat-ic ${webhookSaved ? "sl-stat-ic-green" : "sl-stat-ic-gray"}`}><FiLink aria-hidden /></span>
          <div className="sl-stat-card-body">
            <strong>{webhookSaved ? "On" : "Off"}</strong>
            <span>Webhook</span>
          </div>
        </div>
        {topics.length > 0 && (
          <div className="sl-stat-card">
            <span className="sl-stat-ic sl-stat-ic-violet"><FiTag aria-hidden /></span>
            <div className="sl-stat-card-body">
              <strong>{topics.length}</strong>
              <span>Topics</span>
            </div>
          </div>
        )}
      </div>

      {webhookSaved ? (
        <div className="sl-banner sl-banner-success">
          <FiCheckCircle aria-hidden strokeWidth={2.25} />
          <p>New messages are automatically forwarded to your connected app.</p>
          <button type="button" className="sl-banner-link" onClick={openWebhookModal}>
            Manage
          </button>
        </div>
      ) : (
        <div className="sl-banner sl-banner-hint">
          <FiAlertCircle aria-hidden strokeWidth={2.25} />
          <p>
            Send leads to Zapier, Make or your CRM — tap <strong>Connect tools</strong> to paste your webhook URL.
          </p>
        </div>
      )}

      <div className="sl-toolbar-card">
        <form className="sv-search" onSubmit={applySearch}>
          <FiSearch aria-hidden strokeWidth={2.25} />
          <input
            type="search"
            placeholder="Search by name, email, company or message…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search leads"
          />
          <button type="submit" className="ln-btn ln-btn-primary ln-btn-sm">Search</button>
          {query && (
            <button type="button" className="ln-btn ln-btn-ghost ln-btn-sm" onClick={clearSearch}>
              Clear
            </button>
          )}
        </form>

        <div className="sl-toolbar-meta">
          <p className="sv-result-line">
            {loading ? (
              "Loading…"
            ) : query || topic !== "all" ? (
              <>
                <strong>{filtered.length}</strong> of <strong>{leads.length}</strong> lead
                {leads.length === 1 ? "" : "s"}
                {query ? <> matching &ldquo;{query}&rdquo;</> : null}
              </>
            ) : (
              <>
                <strong>{leads.length}</strong> lead{leads.length === 1 ? "" : "s"} in your inbox
              </>
            )}
          </p>

          {topics.length > 0 && (
            <div className="sv-filters" role="tablist" aria-label="Filter by topic">
              <button
                type="button"
                role="tab"
                aria-selected={topic === "all"}
                className={topic === "all" ? "active" : ""}
                onClick={() => setTopic("all")}
              >
                All topics
              </button>
              {topics.map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={topic === t}
                  className={topic === t ? "active" : ""}
                  onClick={() => setTopic(t)}
                  title={t}
                >
                  {t.length > 22 ? `${t.slice(0, 20)}…` : t}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <p className="studio-loading">Getting your leads ready…</p>
      ) : leads.length === 0 ? (
        <div className="sl-empty">
          <span className="sd-dash-icon sd-dash-icon-blue">
            <FiUsers aria-hidden strokeWidth={2.25} />
          </span>
          <h2>No messages yet</h2>
          <p>
            When someone submits your contact form, their name, email and message will show up here.
            Share your contact page to start collecting leads.
          </p>
          <Link href="/contact" target="_blank" rel="noopener noreferrer" className="ln-btn ln-btn-primary">
            <FiExternalLink aria-hidden strokeWidth={2.25} /> Open contact page
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="sl-empty sl-empty-filtered">
          <h2>No matches</h2>
          <p>Try a different search or clear your filters.</p>
          <button
            type="button"
            className="ln-btn ln-btn-outline"
            onClick={() => { clearSearch(); setTopic("all"); }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="sl-table-wrap">
          {selected.size > 0 && (
            <div className="sl-bulkbar" role="status">
              <span className="sl-bulkbar-count">
                <strong>{selected.size}</strong> selected
              </span>
              <div className="sl-bulkbar-actions">
                <button
                  type="button"
                  className="ln-btn ln-btn-ghost ln-btn-sm"
                  onClick={() => setSelected(new Set())}
                  disabled={bulkBusy}
                >
                  Clear selection
                </button>
                <button
                  type="button"
                  className="ln-btn ln-btn-sm sl-bulk-delete"
                  onClick={removeSelected}
                  disabled={bulkBusy}
                >
                  <FiTrash2 aria-hidden strokeWidth={2.25} />
                  {bulkBusy ? "Deleting…" : "Delete selected"}
                </button>
              </div>
            </div>
          )}
          <table className="sl-table">
            <thead>
              <tr>
                <th className="sl-check">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someFilteredSelected && !allFilteredSelected;
                    }}
                    onChange={toggleSelectAll}
                    aria-label="Select all visible leads"
                  />
                </th>
                <th>When</th>
                <th>Contact</th>
                <th>Company</th>
                <th>Topic</th>
                <th>Message</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => {
                const expanded = expandedId === lead.id;
                const longMessage = lead.message.length > 100;
                const isSelected = selected.has(lead.id);
                return (
                  <tr key={lead.id} className={isSelected ? "sl-row-selected" : undefined}>
                    <td className="sl-check">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(lead.id)}
                        aria-label={`Select message from ${lead.name}`}
                      />
                    </td>
                    <td className="sl-date">
                      <time dateTime={lead.createdAt} title={formatDate(lead.createdAt)}>
                        {formatDay(lead.createdAt)}
                      </time>
                    </td>
                    <td className="sl-contact">
                      <strong>{lead.name}</strong>
                      <a href={`mailto:${lead.email}`} className="sl-email">
                        <FiMail aria-hidden strokeWidth={2.25} />
                        {lead.email}
                      </a>
                    </td>
                    <td className="sl-company">{lead.company || "—"}</td>
                    <td>
                      <span className="sl-tag">{lead.interest}</span>
                    </td>
                    <td className="sl-message">
                      {longMessage ? (
                        <button
                          type="button"
                          className="sl-message-btn"
                          onClick={() => setExpandedId(expanded ? null : lead.id)}
                          aria-expanded={expanded}
                        >
                          {expanded ? lead.message : `${lead.message.slice(0, 100)}…`}
                        </button>
                      ) : (
                        <span className="sl-message-text">{lead.message}</span>
                      )}
                    </td>
                    <td className="sl-actions">
                      <a
                        href={`mailto:${lead.email}`}
                        className="studio-icon-btn"
                        title={`Email ${lead.name}`}
                        aria-label={`Email ${lead.name}`}
                      >
                        <FiMail aria-hidden strokeWidth={2.25} />
                      </a>
                      <button
                        type="button"
                        className="studio-icon-btn danger"
                        onClick={() => remove(lead.id)}
                        title="Remove this message"
                        aria-label={`Remove message from ${lead.name}`}
                      >
                        <FiTrash2 aria-hidden strokeWidth={2.25} />
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
              <span className="sd-dash-icon sd-dash-icon-blue">
                <FiLink aria-hidden strokeWidth={2.25} />
              </span>
              <div className="sl-modal-head-copy">
                <h2 id="sl-modal-title">Send leads to your app</h2>
                <p>
                  Paste a webhook from Zapier, Make, or your CRM — every new contact form
                  submission is sent there automatically.
                </p>
              </div>
              <button
                type="button"
                className="sl-modal-close"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
              >
                <FiX aria-hidden strokeWidth={2.25} />
              </button>
            </div>

            <form onSubmit={saveWebhook} className="sl-modal-form">
              <label>
                <span>Webhook URL</span>
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
                We send name, email, company, topic and message. Clear the field and save to turn off forwarding.
              </p>
              {webhookError ? <p className="studio-error">{webhookError}</p> : null}
              <div className="sl-modal-actions">
                <button type="button" className="ln-btn ln-btn-outline" onClick={() => setModalOpen(false)}>
                  Cancel
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
