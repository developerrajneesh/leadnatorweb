export type PageViewRecord = {
  id: string;
  path: string;
  blogSlug?: string;
  referrer: string;
  /** Resolved channel — from UTM (dynamic) or referrer */
  platform: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  visitorId: string;
  /** Browser localStorage UUID (may change after cache clear) */
  clientVisitorId?: string;
  /** Server hash from IP + user-agent */
  fingerprint?: string;
  durationSec?: number;
  createdAt: string;
  endedAt?: string;
};

export type PageStat = {
  path: string;
  title?: string;
  slug?: string;
  views: number;
  uniqueVisitors: number;
  totalDurationSec: number;
  avgDurationSec: number;
};

export type PlatformStat = {
  platform: string;
  views: number;
  uniqueVisitors: number;
  pct: number;
};

export type AnalyticsSummary = {
  rangeDays: number;
  totalViews: number;
  uniqueVisitors: number;
  viewsToday: number;
  totalDurationSec: number;
  avgDurationSec: number;
  byPlatform: PlatformStat[];
  topPages: { path: string; count: number }[];
  byDay: { date: string; count: number }[];
  topReferrers: { label: string; count: number }[];
  blogPosts: PageStat[];
  allPages: PageStat[];
};
