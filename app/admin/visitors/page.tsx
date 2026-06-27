"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FiGlobe, FiMapPin, FiRefreshCw, FiUsers, FiEye } from "react-icons/fi";
import StudioShell from "@/components/studio/StudioShell";
import type { VisitorLocation } from "@/lib/analytics/types";

function flagEmoji(code?: string): string {
  if (!code || code.length !== 2) return "🌐";
  const base = 0x1f1e6;
  const cc = code.toUpperCase();
  return String.fromCodePoint(base + (cc.charCodeAt(0) - 65), base + (cc.charCodeAt(1) - 65));
}

function fmtDate(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function placeOf(v: VisitorLocation): string {
  const parts = [v.city, v.region].filter(Boolean);
  return parts.length ? parts.join(", ") : v.countryName || "Unknown";
}

export default function StudioVisitorsPage() {
  const [rows, setRows] = useState<VisitorLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/studio/locations?days=30")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const stats = useMemo(() => {
    const countries = new Set<string>();
    const cities = new Set<string>();
    let views = 0;
    rows.forEach((r) => {
      if (r.country) countries.add(r.country);
      if (r.city) cities.add(`${r.city}|${r.country}`);
      views += r.views || 0;
    });
    return { visitors: rows.length, countries: countries.size, cities: cities.size, views };
  }, [rows]);

  return (
    <StudioShell title="Visitor locations" subtitle="Where your visitors come from — resolved from their IP address (last 30 days)">
      <div className="sv-actionbar">
        <button type="button" className="ln-btn ln-btn-outline" onClick={load} disabled={loading}>
          <FiRefreshCw aria-hidden /> Refresh
        </button>
      </div>

      <div className="sd-stats">
        <div className="sd-stat">
          <span className="sd-stat-ic sd-stat-ic-blue"><FiUsers aria-hidden /></span>
          <div className="sd-stat-body"><strong>{stats.visitors}</strong><span>Visitors (by IP)</span></div>
        </div>
        <div className="sd-stat">
          <span className="sd-stat-ic sd-stat-ic-green"><FiGlobe aria-hidden /></span>
          <div className="sd-stat-body"><strong>{stats.countries}</strong><span>Countries</span></div>
        </div>
        <div className="sd-stat">
          <span className="sd-stat-ic sd-stat-ic-amber"><FiMapPin aria-hidden /></span>
          <div className="sd-stat-body"><strong>{stats.cities}</strong><span>Cities</span></div>
        </div>
        <div className="sd-stat">
          <span className="sd-stat-ic sd-stat-ic-violet"><FiEye aria-hidden /></span>
          <div className="sd-stat-body"><strong>{stats.views.toLocaleString()}</strong><span>Total views</span></div>
        </div>
      </div>

      {loading ? (
        <p className="studio-loading">Loading visitor locations…</p>
      ) : rows.length === 0 ? (
        <div className="studio-empty">
          <h2>No visitor data yet</h2>
          <p>Once people visit your public site, their location (resolved from IP) will appear here. On localhost, IPs can&apos;t be resolved.</p>
        </div>
      ) : (
        <div className="sl-table-wrap sv-table-wrap">
          <table className="sl-table sv-table">
            <thead>
              <tr>
                <th>Location</th>
                <th>Country</th>
                <th>ISP / Org</th>
                <th>Views</th>
                <th>First seen</th>
                <th>Last seen</th>
                <th>Last page</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((v) => (
                <tr key={v.visitorId}>
                  <td>
                    <strong style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 18 }}>{flagEmoji(v.country)}</span>
                      {placeOf(v)}
                    </strong>
                  </td>
                  <td>{v.countryName || v.country || "—"}</td>
                  <td style={{ color: "#475569" }}>{v.org || "—"}</td>
                  <td className="sv-metric-cell"><span className="sv-metric-val">{(v.views || 0).toLocaleString()}</span></td>
                  <td className="sl-date">{fmtDate(v.firstSeen)}</td>
                  <td className="sl-date">{fmtDate(v.lastSeen)}</td>
                  <td style={{ fontFamily: "ui-monospace, monospace", fontSize: 12, color: "#475569" }}>{v.lastPath || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </StudioShell>
  );
}
