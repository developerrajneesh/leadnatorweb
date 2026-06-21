import type { PlatformStat } from "./types";

export const DONUT_TOP_N = 5;
export const BARS_VISIBLE = 8;

export function groupPlatformRows(rows: PlatformStat[], topN: number): PlatformStat[] {
  if (rows.length <= topN) return rows;

  const top = rows.slice(0, topN);
  const rest = rows.slice(topN);
  const restViews = rest.reduce((s, r) => s + r.views, 0);
  const restUnique = rest.reduce((s, r) => s + r.uniqueVisitors, 0);
  const totalViews = rows.reduce((s, r) => s + r.views, 0) || 1;

  const others: PlatformStat = {
    platform: `Other (${rest.length} sources)`,
    views: restViews,
    uniqueVisitors: restUnique,
    pct: Math.round((restViews / totalViews) * 100),
  };

  return [...top, others];
}

export function truncateLabel(label: string, max = 22): string {
  if (label.length <= max) return label;
  return `${label.slice(0, max - 1)}…`;
}
