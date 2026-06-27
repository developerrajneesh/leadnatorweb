"use client";

import { useMemo, useState } from "react";
import type { PlatformStat } from "@/lib/analytics/types";
import { DONUT_TOP_N, groupPlatformRows, truncateLabel } from "@/lib/analytics/platform-chart";

type Props = {
  rows: PlatformStat[];
  colorFor: (name: string) => string;
  compact?: boolean;
};

const DEFAULT = { size: 200, r: 72, stroke: 22 };
const COMPACT = { size: 148, r: 52, stroke: 16 };
const OTHERS_COLOR = "#94a3b8";

function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const x1 = cx + r * Math.cos(start);
  const y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(end);
  const y2 = cy + r * Math.sin(end);
  const large = end - start > Math.PI ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

export default function PlatformDonutChart({ rows, colorFor, compact = false }: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const hiddenCount = Math.max(0, rows.length - DONUT_TOP_N);
  const dims = compact ? COMPACT : DEFAULT;
  const { size: SIZE, r: R, stroke: STROKE } = dims;

  const chart = useMemo(() => {
    const grouped = groupPlatformRows(rows, DONUT_TOP_N);
    const total = rows.reduce((s, r) => s + r.views, 0) || 1;
    let angle = -Math.PI / 2;
    const segments = grouped.map((row) => {
      const sweep = (row.views / total) * Math.PI * 2;
      const start = angle;
      const end = angle + sweep;
      angle = end;
      const isOthers = row.platform.startsWith("Other (");
      return {
        ...row,
        start,
        end,
        color: isOthers ? OTHERS_COLOR : colorFor(row.platform),
        isOthers,
      };
    });
    return { segments, total, groupedCount: grouped.length };
  }, [rows, colorFor]);

  if (!rows.length) {
    return <p className="sa-chart-empty">No source data yet.</p>;
  }

  const active = hover !== null ? chart.segments[hover] : null;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const centerLabel = active ? truncateLabel(active.platform, 16) : "Total views";

  return (
    <div className={`sa-viz sa-viz-donut${compact ? " sa-viz-donut-compact" : ""}`}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="sa-viz-svg sa-viz-donut-svg" role="img" aria-label="Traffic share donut chart">
        <circle cx={cx} cy={cy} r={R} fill="#f1f5f9" />
        {chart.segments.map((seg, i) => (
          <path
            key={seg.platform}
            d={arcPath(cx, cy, R, seg.start, Math.max(seg.start + 0.01, seg.end - 0.02))}
            fill="none"
            stroke={seg.color}
            strokeWidth={hover === i ? STROKE + 4 : STROKE}
            strokeLinecap="butt"
            opacity={hover === null || hover === i ? 1 : 0.35}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            style={{ cursor: "pointer", transition: "opacity 0.15s, stroke-width 0.15s" }}
          />
        ))}
        <circle cx={cx} cy={cy} r={R - STROKE / 2 - 4} fill="#fff" />
        <text x={cx} y={cy - 6} textAnchor="middle" className="sa-viz-donut-value">
          {(active?.views ?? chart.total).toLocaleString()}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" className="sa-viz-donut-label">
          {centerLabel}
        </text>
      </svg>

      <div className="sa-viz-legend-wrap">
        <ul className="sa-viz-legend">
          {chart.segments.map((seg, i) => (
            <li
              key={seg.platform}
              className={hover === i ? "active" : ""}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              title={seg.platform}
            >
              <span className="sa-viz-legend-dot" style={{ background: seg.color }} />
              <span className="sa-viz-legend-name">
                {compact ? seg.platform : truncateLabel(seg.platform)}
              </span>
              <span className="sa-viz-legend-meta">
                {compact
                  ? `${seg.views.toLocaleString()} views · ${seg.pct}%`
                  : `${seg.views.toLocaleString()} · ${seg.uniqueVisitors} unique · ${seg.pct}%`}
              </span>
            </li>
          ))}
        </ul>
        {hiddenCount > 0 && !compact && (
          <p className="sa-viz-legend-note">
            Top {DONUT_TOP_N} in the chart · {hiddenCount} more in the list below
          </p>
        )}
      </div>
    </div>
  );
}
