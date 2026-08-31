import { getDb } from "@/lib/db/mongodb";
import { getClientIp } from "@/lib/analytics/visitor";

/**
 * Fixed-window per-IP rate limit for the public forms, backed by Mongo so all
 * serverless instances share one counter (same reasoning as the Tor-exit cache
 * in abuse-guard.ts). One upsert per request; docs expire via TTL index.
 *
 * Fails open on any DB hiccup — a rate-limit outage must never block a person.
 */

const COLLECTION = "site_rate_limits";

type RateDoc = { key: string; count: number; expiresAt: Date };

let indexReady = false;

async function collection() {
  const db = await getDb();
  const col = db.collection<RateDoc>(COLLECTION);
  if (!indexReady) {
    await col.createIndex({ key: 1 }, { unique: true });
    await col.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    indexReady = true;
  }
  return col;
}

export async function isRateLimited(
  req: Request,
  scope: string,
  { max, windowMs }: { max: number; windowMs: number },
): Promise<boolean> {
  const ip = getClientIp(req);
  if (!ip || ip === "0.0.0.0") return false;

  try {
    const col = await collection();
    const windowStart = Math.floor(Date.now() / windowMs) * windowMs;
    const key = `${scope}:${ip}:${windowStart}`;
    const doc = await col.findOneAndUpdate(
      { key },
      {
        $inc: { count: 1 },
        // Keep the doc a full extra window past its own, so a clock-skewed
        // TTL sweep never deletes a window that is still being counted.
        $setOnInsert: { key, expiresAt: new Date(windowStart + windowMs * 2) },
      },
      { upsert: true, returnDocument: "after" },
    );
    return (doc?.count ?? 1) > max;
  } catch {
    return false;
  }
}
