"use client";

import { useState } from "react";
import type { PlatformStat } from "@/lib/analytics/types";
import { BARS_VISIBLE, truncateLabel } from "@/lib/analytics/platform-chart";

type Props = {
  rows: PlatformStat[];
  colorFor: (name: string) => string;
};

export default function PlatformBarsChart({ rows, colorFor }: Props) {
  const [expanded, setExpanded] = useState(false);
  const maxViews = Math.max(1, ...rows.map((r) => r.views));
  const hasMore = rows.length > BARS_VISIBLE;
  const visible = expanded ? rows : rows.slice(0, BARS_VISIBLE);

  if (!rows.length) return null;

  return (
    <div className="sa-viz sa-viz-bars">
      <div className="sa-viz-bars-head" aria-hidden>
        <span>Source</span>
        <span>Total vs unique</span>
      </div>
      <div className={`sa-viz-bars-scroll${expanded ? " expanded" : ""}`}>
        <ul className="sa-viz-bars-list">
          {visible.map((row) => {
            const color = colorFor(row.platform);
            const totalW = Math.max(4, (row.views / maxViews) * 100);
            const uniqueW = Math.max(2, (row.uniqueVisitors / maxViews) * 100);
            return (
              <li key={row.platform}>
                <div className="sa-viz-bars-label">
                  <strong title={row.platform}>{truncateLabel(row.platform, 28)}</strong>
                  <span>{row.views.toLocaleString()} total · {row.uniqueVisitors.toLocaleString()} unique</span>
                </div>
                <div className="sa-viz-bars-track" title={`${row.views} views, ${row.uniqueVisitors} unique`}>
                  <span
                    className="sa-viz-bars-total"
                    style={{ width: `${totalW}%`, background: `${color}30` }}
                  />
                  <span
                    className="sa-viz-bars-unique"
                    style={{ width: `${uniqueW}%`, background: color }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      {hasMore && (
        <button
          type="button"
          className="sa-viz-expand"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Show less" : `Show all ${rows.length} sources`}
        </button>
      )}
      <p className="sa-viz-bars-note">Light = total visits · Solid = unique people from that source</p>
    </div>
  );
}
