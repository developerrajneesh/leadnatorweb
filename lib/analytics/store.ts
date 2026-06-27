import { v4 as uuidv4 } from "uuid";
import { getDb } from "@/lib/db/mongodb";
import { listPosts } from "@/lib/blog/store";
import { referrerLabel, resolveTrafficSource } from "./referrer";
import { extractBlogSlug } from "./format";
import type { AnalyticsSummary, PageStat, PageViewRecord, VisitorLocation } from "./types";
import { resolvePageLabel } from "./page-labels";

const COLLECTION = "site_page_views";

async function viewsCollection() {
  const db = await getDb();
  const col = db.collection<PageViewRecord>(COLLECTION);
  await col.createIndex({ createdAt: -1 });
  await col.createIndex({ platform: 1, createdAt: -1 });
  await col.createIndex({ path: 1, createdAt: -1 });
  await col.createIndex({ visitorId: 1 });
  await col.createIndex({ fingerprint: 1 });
  await col.createIndex({ id: 1 }, { unique: true });
  await col.createIndex({ blogSlug: 1, createdAt: -1 });
  return col;
}

export async function recordPageView(input: {
  path: string;
  referrer?: string;
  visitorId: string;
  clientVisitorId?: string;
  fingerprint?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  country?: string;
  countryName?: string;
  region?: string;
  city?: string;
  org?: string;
  latitude?: number;
  longitude?: number;
}): Promise<string> {
  const col = await viewsCollection();
  const referrer = (input.referrer || "").trim();
  const utm = {
    utmSource: input.utmSource,
    utmMedium: input.utmMedium,
    utmCampaign: input.utmCampaign,
    utmTerm: input.utmTerm,
    utmContent: input.utmContent,
  };
  const platform = resolveTrafficSource(referrer, utm);
  const rawPath = input.path.slice(0, 500);
  const path = rawPath.length > 1 && rawPath.endsWith("/") ? rawPath.slice(0, -1) : rawPath;
  const blogSlug = extractBlogSlug(path);

  const id = uuidv4();
  const record: PageViewRecord = {
    id,
    path,
    blogSlug: blogSlug && blogSlug !== "__index__" ? blogSlug : blogSlug === "__index__" ? "__index__" : undefined,
    referrer: referrer.slice(0, 500),
    platform,
    utmSource: input.utmSource?.slice(0, 120),
    utmMedium: input.utmMedium?.slice(0, 120),
    utmCampaign: input.utmCampaign?.slice(0, 120),
    utmTerm: input.utmTerm?.slice(0, 120),
    utmContent: input.utmContent?.slice(0, 120),
    visitorId: input.visitorId.slice(0, 64),
    clientVisitorId: input.clientVisitorId?.slice(0, 64),
    fingerprint: input.fingerprint?.slice(0, 64),
    country: input.country?.slice(0, 8),
    countryName: input.countryName?.slice(0, 80),
    region: input.region?.slice(0, 120),
    city: input.city?.slice(0, 120),
    org: input.org?.slice(0, 160),
    latitude: typeof input.latitude === "number" ? input.latitude : undefined,
    longitude: typeof input.longitude === "number" ? input.longitude : undefined,
    createdAt: new Date().toISOString(),
  };

  await col.insertOne(record);
  return id;
}

/** One row per visitor (IP) with their resolved location, for the admin Visitors page. */
export async function getVisitorLocations(days = 30): Promise<VisitorLocation[]> {
  const col = await viewsCollection();
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const rows = await col
    .aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: "$visitorId",
          views: { $sum: 1 },
          firstSeen: { $first: "$createdAt" },
          lastSeen: { $last: "$createdAt" },
          lastPath: { $last: "$path" },
          country: { $last: "$country" },
          countryName: { $last: "$countryName" },
          region: { $last: "$region" },
          city: { $last: "$city" },
          org: { $last: "$org" },
          latitude: { $last: "$latitude" },
          longitude: { $last: "$longitude" },
        },
      },
      { $sort: { lastSeen: -1 } },
      { $limit: 500 },
    ])
    .toArray();

  return rows.map((r) => ({
    visitorId: String(r._id || ""),
    views: r.views as number,
    firstSeen: r.firstSeen as string,
    lastSeen: r.lastSeen as string,
    lastPath: r.lastPath as string | undefined,
    country: r.country as string | undefined,
    countryName: r.countryName as string | undefined,
    region: r.region as string | undefined,
    city: r.city as string | undefined,
    org: r.org as string | undefined,
    latitude: r.latitude as number | undefined,
    longitude: r.longitude as number | undefined,
  }));
}

export async function updateViewDuration(viewId: string, durationSec: number): Promise<void> {
  if (!viewId) return;
  const col = await viewsCollection();
  const sec = Math.min(1800, Math.max(1, Math.round(durationSec)));
  await col.updateOne(
    { id: viewId, durationSec: { $exists: false } },
    { $set: { durationSec: sec, endedAt: new Date().toISOString() } },
  );
}

function sinceIso(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

function todayStartIso(): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

type AggRow = {
  _id: string;
  views: number;
  visitors: string[];
  totalDurationSec: number;
  timedViews: number;
};

function toPageStat(row: AggRow, title?: string, slug?: string): PageStat {
  const avgDurationSec =
    row.timedViews > 0 ? Math.round(row.totalDurationSec / row.timedViews) : 0;
  const inferredSlug = extractBlogSlug(row._id);
  const resolvedSlug = slug ?? (inferredSlug === "__index__" ? undefined : inferredSlug);
  return {
    path: row._id,
    title,
    slug: resolvedSlug,
    views: row.views,
    uniqueVisitors: row.visitors.length,
    totalDurationSec: row.totalDurationSec,
    avgDurationSec,
  };
}

function emptyStat(path: string, title?: string, slug?: string): PageStat {
  return {
    path,
    title,
    slug,
    views: 0,
    uniqueVisitors: 0,
    totalDurationSec: 0,
    avgDurationSec: 0,
  };
}

export async function getAnalyticsSummary(rangeDays = 30): Promise<AnalyticsSummary> {
  const col = await viewsCollection();
  const since = sinceIso(rangeDays);
  const todayStart = todayStartIso();

  const pageAgg = col
    .aggregate<AggRow>([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: "$path",
          views: { $sum: 1 },
          visitors: { $addToSet: "$visitorId" },
          totalDurationSec: { $sum: { $ifNull: ["$durationSec", 0] } },
          timedViews: {
            $sum: { $cond: [{ $gt: [{ $ifNull: ["$durationSec", 0] }, 0] }, 1, 0] },
          },
        },
      },
      { $sort: { views: -1 } },
    ])
    .toArray();

  const [
    totalViews,
    uniqueVisitors,
    viewsToday,
    platformRows,
    dayRows,
    referrerRows,
    durationAgg,
    pageRows,
    cmsPosts,
  ] = await Promise.all([
    col.countDocuments({ createdAt: { $gte: since } }),
    col.distinct("visitorId", { createdAt: { $gte: since } }),
    col.countDocuments({ createdAt: { $gte: todayStart } }),
    col
      .aggregate<{ _id: string; views: number; visitors: string[] }>([
        { $match: { createdAt: { $gte: since } } },
        {
          $group: {
            _id: "$platform",
            views: { $sum: 1 },
            visitors: { $addToSet: "$visitorId" },
          },
        },
        { $sort: { views: -1 } },
      ])
      .toArray(),
    col
      .aggregate<{ _id: string; count: number }>([
        { $match: { createdAt: { $gte: since } } },
        {
          $group: {
            _id: { $substr: ["$createdAt", 0, 10] },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray(),
    col
      .find({ createdAt: { $gte: since } })
      .project({ referrer: 1, platform: 1, utmSource: 1, utmMedium: 1, utmCampaign: 1 })
      .limit(5000)
      .toArray(),
    col
      .aggregate<{ total: number; timed: number }>([
        { $match: { createdAt: { $gte: since } } },
        {
          $group: {
            _id: null,
            total: { $sum: { $ifNull: ["$durationSec", 0] } },
            timed: { $sum: { $cond: [{ $gt: [{ $ifNull: ["$durationSec", 0] }, 0] }, 1, 0] } },
          },
        },
      ])
      .toArray(),
    pageAgg,
    listPosts(),
  ]);

  const total = totalViews || 1;
  const byPlatform = platformRows.map((row) => ({
    platform: row._id,
    views: row.views,
    uniqueVisitors: row.visitors.length,
    pct: Math.round((row.views / total) * 100),
  }));

  const referrerMap = new Map<string, number>();
  for (const row of referrerRows) {
    const label = referrerLabel(row.referrer, row.platform, {
      utmSource: row.utmSource,
      utmMedium: row.utmMedium,
      utmCampaign: row.utmCampaign,
    });
    referrerMap.set(label, (referrerMap.get(label) || 0) + 1);
  }
  const topReferrers = [...referrerMap.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const pageMap = new Map(pageRows.map((r) => [r._id, toPageStat(r)]));

  const published = cmsPosts.filter((p) => p.status === "published");
  const cmsTitleByPath = new Map(
    published.map((post) => [`/blog/${post.slug}`, post.title] as const),
  );

  const blogPosts: PageStat[] = published
    .map((post) => {
      const path = `/blog/${post.slug}`;
      const fromViews = pageMap.get(path);
      if (fromViews) {
        return { ...fromViews, title: post.title, slug: post.slug };
      }
      return emptyStat(path, post.title, post.slug);
    })
    .sort((a, b) => b.views - a.views);

  const knownBlogPaths = new Set(blogPosts.map((p) => p.path));
  for (const row of pageRows) {
    if (!row._id.startsWith("/blog/") || row._id === "/blog" || knownBlogPaths.has(row._id)) {
      continue;
    }
    const slug = extractBlogSlug(row._id);
    blogPosts.push({
      ...toPageStat(row),
      title: resolvePageLabel(row._id, cmsTitleByPath),
      slug: slug === "__index__" ? undefined : slug,
    });
    knownBlogPaths.add(row._id);
  }
  blogPosts.sort((a, b) => b.views - a.views);

  const blogIndex = pageMap.get("/blog");
  if (blogIndex) {
    blogPosts.unshift({ ...blogIndex, title: "Blog", slug: undefined });
  } else {
    blogPosts.unshift(emptyStat("/blog", "Blog"));
  }

  const allPages: PageStat[] = pageRows
    .map((r) => {
      const stat = toPageStat(r);
      stat.title = resolvePageLabel(r._id, cmsTitleByPath);
      return stat;
    })
    .sort((a, b) => b.views - a.views);

  const dur = durationAgg[0];
  const totalDurationSec = dur?.total ?? 0;
  const avgDurationSec = dur?.timed ? Math.round(totalDurationSec / dur.timed) : 0;

  return {
    rangeDays,
    totalViews,
    uniqueVisitors: uniqueVisitors.length,
    viewsToday,
    totalDurationSec,
    avgDurationSec,
    byPlatform,
    topPages: pageRows.slice(0, 8).map((r) => ({ path: r._id, count: r.views })),
    byDay: dayRows.map((r) => ({ date: r._id, count: r.count })),
    topReferrers,
    blogPosts,
    allPages,
  };
}
