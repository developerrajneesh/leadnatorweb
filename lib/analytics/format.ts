export function formatDuration(totalSec: number): string {
  if (!totalSec || totalSec < 1) return "—";
  if (totalSec < 60) return `${totalSec}s`;
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (m < 60) return s > 0 ? `${m}m ${s}s` : `${m}m`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return rm > 0 ? `${h}h ${rm}m` : `${h}h`;
}

export function extractBlogSlug(path: string): string | undefined {
  if (path === "/blog") return "__index__";
  const match = path.match(/^\/blog\/([^/?#]+)/);
  return match?.[1];
}

export function isBlogPath(path: string): boolean {
  return path === "/blog" || path.startsWith("/blog/");
}
