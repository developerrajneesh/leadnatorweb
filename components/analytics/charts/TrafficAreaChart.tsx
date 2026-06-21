"use client";

import { useMemo, useState } from "react";

type DayPoint = { date: string; count: number };

const W = 640;
const H = 248;
const PAD = { top: 22, right: 16, bottom: 48, left: 52 };
const MIN_LABEL_GAP = 68;

function formatLabel(iso: string, compact = false) {
  const d = new Date(iso + "T12:00:00");
  if (compact) {
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }
  return d.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
}

/** Pick x-axis indices with enough pixel gap — avoids overlapping date labels. */
function pickXTickIndices(count: number, innerW: number): number[] {
  if (count <= 0) return [];
  if (count === 1) return [0];

  const maxLabels = Math.max(
    2,
    Math.min(
      count,
      Math.floor(innerW / MIN_LABEL_GAP),
      count <= 8 ? count : count <= 14 ? 6 : 8,
    ),
  );
  if (count <= maxLabels) {
    return Array.from({ length: count }, (_, i) => i);
  }

  const indices: number[] = [0];
  for (let k = 1; k < maxLabels - 1; k++) {
    indices.push(Math.round((k / (maxLabels - 1)) * (count - 1)));
  }

  const last = count - 1;
  const prev = indices[indices.length - 1];
  const gapPx = ((last - prev) / (count - 1)) * innerW;
  if (gapPx < MIN_LABEL_GAP && indices.length > 1) {
    indices.pop();
  }
  if (indices[indices.length - 1] !== last) {
    indices.push(last);
  }

  return [...new Set(indices)].sort((a, b) => a - b);
}

function xLabelAnchor(i: number, count: number): "start" | "middle" | "end" {
  if (i === 0) return "start";
  if (i === count - 1) return "end";
  return "middle";
}

function niceMax(value: number) {
  const v = Math.max(1, value);
  if (v <= 5) return 5;
  const exp = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / exp;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * exp;
}

/** Fill every day in the selected range (zeros for quiet days). */
export function buildDaySeries(data: DayPoint[], rangeDays: number): DayPoint[] {
  const map = new Map(data.map((d) => [d.date, d.count]));
  const out: DayPoint[] = [];
  const end = new Date();
  end.setUTCHours(0, 0, 0, 0);

  for (let i = rangeDays - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setUTCDate(d.getUTCDate() - i);
    const iso = d.toISOString().slice(0, 10);
    out.push({ date: iso, count: map.get(iso) ?? 0 });
  }
  return out;
}

export default function TrafficAreaChart({
  data,
  rangeDays = 30,
}: {
  data: DayPoint[];
  rangeDays?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);

  const series = useMemo(() => buildDaySeries(data, rangeDays), [data, rangeDays]);

  const chart = useMemo(() => {
    if (!series.length) return null;

    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const peak = Math.max(...series.map((d) => d.count), 1);
    const maxY = niceMax(Math.ceil(peak * 1.12));
    const count = series.length;
    const xAt = (i: number) =>
      count === 1
        ? PAD.left + innerW / 2
        : PAD.left + (i / (count - 1)) * innerW;

    const points = series.map((d, i) => ({
      ...d,
      x: xAt(i),
      y: PAD.top + innerH - (d.count / maxY) * innerH,
    }));

    const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
    const area = `${line} L ${points[points.length - 1].x.toFixed(1)} ${(PAD.top + innerH).toFixed(1)} L ${points[0].x.toFixed(1)} ${(PAD.top + innerH).toFixed(1)} Z`;

    const yTickValues = maxY <= 5
      ? [0, Math.round(maxY / 2), maxY]
      : [0, Math.round(maxY / 2), maxY];

    const yTicks = yTickValues.map((value) => ({
      value,
      y: PAD.top + innerH - (value / maxY) * innerH,
    }));

    const hitW = Math.max(8, innerW / Math.max(count, 1));
    const xTickIndices = pickXTickIndices(count, innerW);
    const compactLabels = count > 12 || xTickIndices.length > 6;

    return { points, line, area, yTicks, innerH, maxY, hitW, xTickIndices, compactLabels };
  }, [series]);

  if (!chart || !series.length) {
    return <p className="sa-chart-empty">No daily data to show yet — check back once you have visitors.</p>;
  }

  const active = hover !== null ? chart.points[hover] : null;
  const total = series.reduce((s, d) => s + d.count, 0);
  const activeDays = series.filter((d) => d.count > 0).length;
  const clipId = "sa-area-clip";

  return (
    <div className="sa-viz sa-viz-area">
      <div className="sa-viz-summary">
        <div>
          <strong>{total.toLocaleString()}</strong>
          <span>views over {activeDays} active day{activeDays === 1 ? "" : "s"}</span>
        </div>
        {active && (
          <div className="sa-viz-tooltip-inline">
            <strong>{active.count.toLocaleString()}</strong>
            <span>{formatLabel(active.date)}</span>
          </div>
        )}
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="sa-viz-svg sa-viz-area-svg"
        role="img"
        aria-label="Views per day area chart"
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={PAD.left} y={PAD.top} width={W - PAD.left - PAD.right} height={chart.innerH} />
          </clipPath>
          <linearGradient id="saAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#4ade80" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="saLineStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {chart.yTicks.map((tick) => (
          <g key={tick.value}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={tick.y}
              y2={tick.y}
              className="sa-viz-grid"
            />
            <text
              x={PAD.left - 10}
              y={tick.y + 4}
              className="sa-viz-axis-y"
              textAnchor="end"
            >
              {tick.value}
            </text>
          </g>
        ))}

        <g clipPath={`url(#${clipId})`}>
          <path d={chart.area} fill="url(#saAreaFill)" />
          <path
            d={chart.line}
            fill="none"
            stroke="url(#saLineStroke)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {chart.points.map((p, i) =>
            p.count > 0 && hover === i ? (
              <g key={`dot-${p.date}`}>
                <line
                  x1={p.x}
                  x2={p.x}
                  y1={PAD.top}
                  y2={PAD.top + chart.innerH}
                  className="sa-viz-cursor"
                />
                <circle cx={p.x} cy={p.y} r="5" className="sa-viz-dot" />
                <circle cx={p.x} cy={p.y} r="9" className="sa-viz-dot-ring" />
              </g>
            ) : null,
          )}
        </g>

        {chart.points.map((p, i) => (
          <rect
            key={`hit-${p.date}`}
            x={p.x - chart.hitW / 2}
            y={PAD.top}
            width={chart.hitW}
            height={chart.innerH}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
          />
        ))}

        {chart.xTickIndices.map((i) => {
          const p = chart.points[i];
          const anchor = xLabelAnchor(i, series.length);
          const x =
            anchor === "start"
              ? Math.max(PAD.left, p.x)
              : anchor === "end"
                ? Math.min(W - PAD.right, p.x)
                : p.x;
          return (
            <text
              key={`${p.date}-x`}
              x={x}
              y={H - 14}
              className="sa-viz-axis-x"
              textAnchor={anchor}
            >
              {formatLabel(p.date, chart.compactLabels)}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
