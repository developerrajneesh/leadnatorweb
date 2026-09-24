"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FiCalendar, FiExternalLink, FiMail, FiPhone, FiRefreshCw, FiSearch, FiTrash2,
} from "react-icons/fi";
import StudioShell from "@/components/studio/StudioShell";
import type { DemoBooking, DemoBookingStatus } from "@/lib/demos/types";

const STATUS_LABELS: Record<DemoBookingStatus, string> = {
  new: "New",
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
};

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/** preferredDate is a plain YYYY-MM-DD from the form — format it without a timezone shift. */
function formatDay(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  if (!y || !m || !d) return ymd;
  return new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
    .format(new Date(y, m - 1, d));
}

export default function AdminDemosPage() {
  const [rows, setRows] = useState<DemoBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DemoBookingStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/studio/demos")
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
      const hay = [row.name, row.email, row.phone, row.company, row.industry, row.product, row.message ?? ""]
        .join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [rows, query, statusFilter]);

  async function remove(id: string) {
    if (!confirm("Remove this demo booking?")) return;
    const res = await fetch(`/api/studio/demos/${id}`, { method: "DELETE" });
    if (res.ok) {
      setRows((prev) => prev.filter((r) => r.id !== id));
      if (expandedId === id) setExpandedId(null);
    }
  }

  async function setStatus(id: string, status: DemoBookingStatus) {
    const res = await fetch(`/api/studio/demos/${id}`, {
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
      title="Demo bookings"
      subtitle="Demo requests from the Leadnator Voice page"
    >
      <header className="sl-hero">
        <div className="sl-hero-grid">
          <div className="sl-hero-copy">
            <span className="sl-hero-eyebrow"><FiCalendar aria-hidden /> Demos</span>
            <h2 className="sl-hero-title">Demo bookings</h2>
            <p className="sl-hero-lead">
              Every Book a demo request from the Leadnator Voice page lands here with the
              visitor&apos;s preferred date and time. Call them, then mark it scheduled or completed.
            </p>
          </div>
          <div className="sl-hero-actions">
            <button type="button" className="ln-btn ln-btn-outline" onClick={load} disabled={loading}>
              <FiRefreshCw aria-hidden /> Refresh
            </button>
            <Link
              href="/leadnator-voice"
              target="_blank"
              rel="noopener noreferrer"
              className="ln-btn ln-btn-ghost sl-hero-ghost"
            >
              <FiExternalLink aria-hidden /> Voice page
            </Link>
          </div>
        </div>
      </header>

      <div className="sl-stats" aria-label="Booking counts">
        <div className="sl-stat-card">
          <span className="sl-stat-ic sl-stat-ic-blue"><FiCalendar aria-hidden /></span>
          <div className="sl-stat-card-body">
            <strong>{rows.length}</strong>
            <span>Total bookings</span>
          </div>
        </div>
        <div className="sl-stat-card">
          <span className="sl-stat-ic sl-stat-ic-green"><FiCalendar aria-hidden /></span>
          <div className="sl-stat-card-body">
            <strong>{rows.filter((r) => r.status === "new").length}</strong>
            <span>New</span>
          </div>
        </div>
        <div className="sl-stat-card">
          <span className="sl-stat-ic sl-stat-ic-blue"><FiCalendar aria-hidden /></span>
          <div className="sl-stat-card-body">
            <strong>{rows.filter((r) => r.status === "scheduled").length}</strong>
            <span>Scheduled</span>
          </div>
        </div>
      </div>

      <div className="sl-toolbar-card">
        <form className="sv-search" onSubmit={applySearch}>
          <FiSearch aria-hidden />
          <input
            type="search"
            placeholder="Search name, email, company, industry…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search demo bookings"
          />
          <button type="submit" className="ln-btn ln-btn-primary ln-btn-sm">Search</button>
        </form>
        <div className="sv-filters" role="tablist" aria-label="Filter by status">
          <button type="button" className={statusFilter === "all" ? "active" : ""} onClick={() => setStatusFilter("all")}>All</button>
          {(Object.keys(STATUS_LABELS) as DemoBookingStatus[]).map((s) => (
            <button key={s} type="button" className={statusFilter === s ? "active" : ""} onClick={() => setStatusFilter(s)}>
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="studio-loading">Loading demo bookings…</p>
      ) : rows.length === 0 ? (
        <div className="sl-empty">
          <h2>No demo bookings yet</h2>
          <p>When someone books a demo on the Leadnator Voice page, their details will appear here.</p>
          <Link href="/leadnator-voice" target="_blank" rel="noopener noreferrer" className="ln-btn ln-btn-primary">
            <FiExternalLink aria-hidden /> Open Leadnator Voice
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
                <th>Preferred slot</th>
                <th>Contact</th>
                <th>Company</th>
                <th>Interested in</th>
                <th>Status</th>
                <th>Message</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const expanded = expandedId === row.id;
                const msg = row.message ?? "";
                const longMsg = msg.length > 90;
                return (
                  <tr key={row.id}>
                    <td className="sl-date">
                      <strong>{formatDay(row.preferredDate)}</strong>
                      <div>{row.preferredTime}</div>
                      <small>Booked {formatDate(row.createdAt)}</small>
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
                    <td className="sl-company">
                      {row.company}
                      <div><small>{row.industry}</small></div>
                    </td>
                    <td>{row.product}</td>
                    <td>
                      <select
                        className="sl-status-select"
                        value={row.status}
                        onChange={(e) => setStatus(row.id, e.target.value as DemoBookingStatus)}
                        aria-label={`Status for ${row.name}`}
                      >
                        {(Object.keys(STATUS_LABELS) as DemoBookingStatus[]).map((s) => (
                          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="sl-message">
                      {!msg ? (
                        <span className="sl-message-text">—</span>
                      ) : longMsg ? (
                        <button
                          type="button"
                          className="sl-message-btn"
                          onClick={() => setExpandedId(expanded ? null : row.id)}
                          aria-expanded={expanded}
                        >
                          {expanded ? msg : `${msg.slice(0, 90)}…`}
                        </button>
                      ) : (
                        <span className="sl-message-text">{msg}</span>
                      )}
                    </td>
                    <td className="sl-actions">
                      <a href={`tel:${row.phone}`} className="studio-icon-btn" title={`Call ${row.name}`}>
                        <FiPhone aria-hidden />
                      </a>
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
