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
  /** Salted hash of the client IP — unique visitors are counted per IP */
  visitorId: string;
  /** Browser localStorage UUID (kept for reference only, not used for counting) */
  clientVisitorId?: string;
  /** Salted hash of the client IP (same as visitorId) */
  fingerprint?: string;
  // ---- IP geolocation (from ipapi.co) ----
  country?: string;       // ISO code, e.g. "IN"
  countryName?: string;   // "India"
  region?: string;        // "Delhi"
  city?: string;          // "New Delhi"
  org?: string;           // ISP / organisation
  latitude?: number;
  longitude?: number;
  durationSec?: number;
  createdAt: string;
  endedAt?: string;
};

/** Aggregated visitor with their resolved location, for the admin Visitors page. */
export type VisitorLocation = {
  visitorId: string;
  country?: string;
  countryName?: string;
  region?: string;
  city?: string;
  org?: string;
  latitude?: number;
  longitude?: number;
  views: number;
  firstSeen: string;
  lastSeen: string;
  lastPath?: string;
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
