import { getDb } from "@/lib/db/mongodb";
import { getClientIp } from "@/lib/analytics/visitor";

/**
 * Contact-form abuse guard.
 *
 * Aug 2026: a bot crawled the whole site over Tor in ~90 seconds, submitted the
 * contact form, then created a SaaS account with the same address — 25 times.
 * It used a fresh Tor exit IP per request, so per-IP limits alone did nothing.
 * The layers below each catch it independently:
 *
 *   1. Tor exit blocklist (refreshed 6-hourly, cached in Mongo so serverless
 *      instances share one copy instead of each fetching the list)
 *   2. Content heuristics — its names/companies were random letter strings and
 *      every message body was nothing but a 10-digit number
 *   3. Honeypot field
 */

const TOR_LIST_URL = "https://check.torproject.org/torbulkexitlist";
const CACHE_COLLECTION = "site_tor_exits";
const REFRESH_MS = 6 * 60 * 60 * 1000;

type TorCacheDoc = { _id: string; ips: string[]; fetchedAt: string };

let memoryCache: { ips: Set<string>; at: number } | null = null;

function normalizeIp(ip: string): string {
  const s = String(ip || "").trim();
  const m = s.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
  return m ? m[1] : s;
}

/** Tor exit relay IPs, memory-cached per instance and Mongo-cached across them. */
async function getTorExits(): Promise<Set<string>> {
  if (memoryCache && Date.now() - memoryCache.at < REFRESH_MS) return memoryCache.ips;

  try {
    const db = await getDb();
    const col = db.collection<TorCacheDoc>(CACHE_COLLECTION);
    const cached = await col.findOne({ _id: "exits" });
    const cachedAge = cached ? Date.now() - new Date(cached.fetchedAt).getTime() : Infinity;

    if (cached && cachedAge < REFRESH_MS) {
      memoryCache = { ips: new Set(cached.ips), at: Date.now() };
      return memoryCache.ips;
    }

    const res = await fetch(TOR_LIST_URL, {
      headers: { "User-Agent": "Leadnator/1.0 (abuse-prevention)" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const ips = (await res.text())
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#"));
    if (!ips.length) throw new Error("empty list");

    await col.updateOne(
      { _id: "exits" },
      { $set: { ips, fetchedAt: new Date().toISOString() } },
      { upsert: true },
    );
    memoryCache = { ips: new Set(ips), at: Date.now() };
    return memoryCache.ips;
  } catch {
    // Never fail closed on a fetch blip — serve whatever we already had.
    if (memoryCache) return memoryCache.ips;
    try {
      const db = await getDb();
      const cached = await db.collection<TorCacheDoc>(CACHE_COLLECTION).findOne({ _id: "exits" });
      if (cached) {
        memoryCache = { ips: new Set(cached.ips), at: Date.now() };
        return memoryCache.ips;
      }
    } catch { /* fall through */ }
    return new Set();
  }
}

/**
 * A machine-generated token: one long word, letters only, with the case
 * flipping all over ("kFWTOUFIKyUvVumUnjWl"). A real name or company never
 * looks like this — "Rajneesh" is short, "Digidot India" has a space.
 */
export function looksGenerated(value: string): boolean {
  const n = String(value || "").trim();
  if (n.includes(" ")) return false;
  if (n.length < 14) return false;
  if (!/^[A-Za-z]+$/.test(n)) return false;
  if (!/[A-Z]/.test(n) || !/[a-z]/.test(n)) return false;
  // Signal 1 — runs of consecutive capitals. NOT a plain case-flip count:
  // "AnilKumarSharma" flips 5 times and is a real name typed without spaces.
  // Capitals bunched mid-word ("DPD", "BRMY") only happen when each letter's
  // case was rolled independently.
  let upperRun = 0;
  for (const ch of n) {
    if (ch >= "A" && ch <= "Z") { upperRun++; if (upperRun >= 3) return true; }
    else upperRun = 0;
  }

  // Signal 2 — unpronounceable. Real names spread their vowels out; even
  // "Schwarzenegger" and "Krishnamurthy" never exceed 4 consonants in a row.
  let run = 0;
  let maxRun = 0;
  for (const ch of n.toLowerCase()) {
    if ("aeiou".includes(ch)) run = 0;
    else { run++; if (run > maxRun) maxRun = run; }
  }
  return maxRun >= 5;
}

export type GuardVerdict = { blocked: boolean; reason: string; ip: string };

export async function checkContactSubmission(
  req: Request,
  fields: { name?: string; company?: string; message?: string; website?: string },
): Promise<GuardVerdict> {
  const ip = normalizeIp(getClientIp(req));

  // Honeypot — a field hidden with CSS that only an automated filler touches.
  if (String(fields.website || "").trim()) {
    return { blocked: true, reason: "honeypot", ip };
  }

  // Every bot message was a bare phone number and nothing else.
  const msg = String(fields.message || "").trim();
  if (/^[\d\s+()-]{6,20}$/.test(msg)) {
    return { blocked: true, reason: "digits_only_message", ip };
  }

  if (looksGenerated(fields.name || "") || looksGenerated(fields.company || "")) {
    return { blocked: true, reason: "generated_name", ip };
  }

  const exits = await getTorExits();
  if (exits.has(ip)) {
    return { blocked: true, reason: "tor_exit", ip };
  }

  return { blocked: false, reason: "", ip };
}

/** Persist a rejected submission so false positives stay auditable. */
export async function logBlocked(v: GuardVerdict, fields: Record<string, unknown>, req: Request) {
  try {
    const db = await getDb();
    await db.collection("site_blocked_submissions").insertOne({
      ...v,
      name: String(fields.name || "").slice(0, 120),
      email: String(fields.email || "").slice(0, 160),
      message: String(fields.message || "").slice(0, 300),
      userAgent: req.headers.get("user-agent")?.slice(0, 300) || "",
      createdAt: new Date().toISOString(),
    });
  } catch { /* logging must never break the response */ }
}
