"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FiExternalLink, FiMail, FiPhone, FiRefreshCw, FiSearch, FiTrash2, FiUsers,
} from "react-icons/fi";
import StudioShell from "@/components/studio/StudioShell";
import type { PartnerApplication, PartnerApplicationStatus } from "@/lib/partners/types";

const STATUS_LABELS: Record<PartnerApplicationStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  approved: "Approved",
  declined: "Declined",
};

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function AdminPartnersPage() {
  const [rows, setRows] = useState<PartnerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PartnerApplicationStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/studio/partners")
      .then((r) => (r.ok ? r.json() : []))
      .then(setRows)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (!q) return true;
      const hay = [row.name, row.email, row.phone, row.company, row.reason].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [rows, query, statusFilter]);

  async function remove(id: string) {
    if (!confirm("Remove this partner application?")) return;
    const res = await fetch(`/api/studio/partners/${id}`, { method: "DELETE" });
    if (res.ok) {
      setRows((prev) => prev.filter((r) => r.id !== id));
      if (expandedId === id) setExpandedId(null);
    }
  }

  async function setStatus(id: string, status: PartnerApplicationStatus) {
    const res = await fetch(`/api/studio/partners/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setRows((prev) => prev.map((r) => (r.id === id ? updated : r)));
    }
  }

  function applySearch(e: React.FormEvent) {
    e.preventDefault();
    setQuery(search.trim());
  }

  return (
    <StudioShell
      title="Partner applications"
      subtitle="Partnership requests from the Become a Partner form"
    >
      <header className="sl-hero">
        <div className="sl-hero-grid">
          <div className="sl-hero-copy">
            <span className="sl-hero-eyebrow"><FiUsers aria-hidden /> Partnerships</span>
            <h2 className="sl-hero-title">Partner applications</h2>
            <p className="sl-hero-lead">
              Every Apply for Partnership submission from the partners page is saved here.
              Review, update status and follow up by email or phone.
            </p>
          </div>
          <div className="sl-hero-actions">
            <button type="button" className="ln-btn ln-btn-outline" onClick={load} disabled={loading}>
              <FiRefreshCw aria-hidden /> Refresh
            </button>
            <Link
              href="/partners#become"
              target="_blank"
              rel="noopener noreferrer"
              className="ln-btn ln-btn-ghost sl-hero-ghost"
            >
              <FiExternalLink aria-hidden /> Partners page
            </Link>
          </div>
        </div>
      </header>

      <div className="sl-stats" aria-label="Application counts">
        <div className="sl-stat-card">
          <span className="sl-stat-ic sl-stat-ic-blue"><FiUsers aria-hidden /></span>
          <div className="sl-stat-card-body">
            <strong>{rows.length}</strong>
            <span>Total applications</span>
          </div>
        </div>
        <div className="sl-stat-card">
          <span className="sl-stat-ic sl-stat-ic-green"><FiUsers aria-hidden /></span>
          <div className="sl-stat-card-body">
            <strong>{rows.filter((r) => r.status === "new").length}</strong>
            <span>New</span>
          </div>
        </div>
      </div>

      <div className="sl-toolbar-card">
        <form className="sv-search" onSubmit={applySearch}>
          <FiSearch aria-hidden />
          <input
            type="search"
            placeholder="Search name, email, company or reason…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search applications"
          />
          <button type="submit" className="ln-btn ln-btn-primary ln-btn-sm">Search</button>
        </form>
        <div className="sv-filters" role="tablist" aria-label="Filter by status">
          <button type="button" className={statusFilter === "all" ? "active" : ""} onClick={() => setStatusFilter("all")}>All</button>
          {(Object.keys(STATUS_LABELS) as PartnerApplicationStatus[]).map((s) => (
            <button key={s} type="button" className={statusFilter === s ? "active" : ""} onClick={() => setStatusFilter(s)}>
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="studio-loading">Loading applications…</p>
      ) : rows.length === 0 ? (
        <div className="sl-empty">
          <h2>No applications yet</h2>
          <p>When someone applies via the partners page, their details will appear here.</p>
          <Link href="/partners#become" target="_blank" rel="noopener noreferrer" className="ln-btn ln-btn-primary">
            <FiExternalLink aria-hidden /> Open partners page
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="sl-empty sl-empty-filtered">
          <h2>No matches</h2>
          <p>Try a different search or clear your filters.</p>
        </div>
      ) : (
        <div className="sl-table-wrap">
          <table className="sl-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Contact</th>
                <th>Company</th>
                <th>Status</th>
                <th>Reason</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const expanded = expandedId === row.id;
                const longReason = row.reason.length > 100;
                return (
                  <tr key={row.id}>
                    <td className="sl-date">
                      <time dateTime={row.createdAt}>{formatDate(row.createdAt)}</time>
                    </td>
                    <td className="sl-contact">
                      <strong>{row.name}</strong>
                      <a href={`mailto:${row.email}`} className="sl-email">
                        <FiMail aria-hidden /> {row.email}
                      </a>
                      <a href={`tel:${row.phone}`} className="sl-email">
                        <FiPhone aria-hidden /> {row.phone}
                      </a>
                    </td>
                    <td className="sl-company">{row.company}</td>
                    <td>
                      <select
                        className="sl-status-select"
                        value={row.status}
                        onChange={(e) => setStatus(row.id, e.target.value as PartnerApplicationStatus)}
                        aria-label={`Status for ${row.name}`}
                      >
                        {(Object.keys(STATUS_LABELS) as PartnerApplicationStatus[]).map((s) => (
                          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="sl-message">
                      {longReason ? (
                        <button
                          type="button"
                          className="sl-message-btn"
                          onClick={() => setExpandedId(expanded ? null : row.id)}
                          aria-expanded={expanded}
                        >
                          {expanded ? row.reason : `${row.reason.slice(0, 100)}…`}
                        </button>
                      ) : (
                        <span className="sl-message-text">{row.reason}</span>
                      )}
                    </td>
                    <td className="sl-actions">
                      <a href={`mailto:${row.email}`} className="studio-icon-btn" title={`Email ${row.name}`}>
                        <FiMail aria-hidden />
                      </a>
                      <button type="button" className="studio-icon-btn danger" onClick={() => remove(row.id)} title="Delete">
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
    </StudioShell>
  );
}
