import { getDb } from "@/lib/db/mongodb";

const COLLECTION = "site_ip_geo";
// Re-fetch a given IP at most once per 30 days (ipapi.co free tier is limited).
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

type IpGeoDoc = {
  ip: string;
  data: Record<string, unknown>;
  fetchedAt: string;
};

function isPrivateOrLocal(ip: string): boolean {
  if (!ip || ip === "0.0.0.0" || ip === "unknown") return true;
  if (ip === "::1" || ip.startsWith("127.") || ip.startsWith("::ffff:127.")) return true;
  if (ip.startsWith("10.") || ip.startsWith("192.168.")) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) return true;
  if (ip.startsWith("fe80:") || ip.startsWith("fc") || ip.startsWith("fd")) return true; // link-local / ULA
  return false;
}

/**
 * Look up an IP's geolocation from ipapi.co, caching the full response in
 * `site_ip_geo` so each IP is only fetched once per TTL. Returns the raw
 * ipapi.co JSON (or null for private/local IPs or on failure).
 */
export async function getIpGeo(ip: string): Promise<Record<string, unknown> | null> {
  if (isPrivateOrLocal(ip)) return null;

  try {
    const db = await getDb();
    const col = db.collection<IpGeoDoc>(COLLECTION);
    await col.createIndex({ ip: 1 }, { unique: true });

    const cached = await col.findOne({ ip });
    if (cached && Date.now() - new Date(cached.fetchedAt).getTime() < TTL_MS) {
      return cached.data;
    }

    const res = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, {
      headers: { "User-Agent": "Leadnator/1.0" },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return cached?.data ?? null;

    const data = (await res.json()) as Record<string, unknown>;
    // ipapi.co returns { error: true, reason } on rate-limit / bad IP.
    if (data?.error) return cached?.data ?? null;

    await col.updateOne(
      { ip },
      { $set: { ip, data, fetchedAt: new Date().toISOString() } },
      { upsert: true },
    );
    return data;
  } catch {
    return null;
  }
}

/** Pull the geo fields we store on each page view from a raw ipapi.co payload. */
export function geoFields(data: Record<string, unknown> | null) {
  if (!data) return {};
  const num = (v: unknown) => (typeof v === "number" ? v : typeof v === "string" && v.trim() !== "" ? Number(v) : undefined);
  const str = (v: unknown) => (typeof v === "string" && v.trim() !== "" ? v : undefined);
  return {
    country: str(data.country_code) || str(data.country),
    countryName: str(data.country_name),
    region: str(data.region),
    city: str(data.city),
    org: str(data.org) || str(data.asn),
    latitude: num(data.latitude),
    longitude: num(data.longitude),
  };
}
