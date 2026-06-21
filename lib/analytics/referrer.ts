import type { UtmParams } from "./utm";

/** Known platforms — matched against utm + referrer (case-insensitive). */
const PLATFORM_RULES: { name: string; patterns: RegExp[] }[] = [
  { name: "Instagram", patterns: [/instagram/i, /\big\b/, /\binsta\b/, /\big_ads\b/] },
  { name: "Facebook", patterns: [/facebook/i, /\bfb\b/, /\bmeta\b/, /\bfb_ads\b/] },
  { name: "WhatsApp", patterns: [/whatsapp/i, /\bwa\b/, /wa\.me/i] },
  { name: "LinkedIn", patterns: [/linkedin/i, /\blnkd\b/, /\bli_ads\b/] },
  { name: "YouTube", patterns: [/youtube/i, /\byt\b/, /youtu\.be/i] },
  { name: "Twitter", patterns: [/twitter/i, /\bx\.com\b/, /\btweet\b/] },
  { name: "Google", patterns: [/google/i, /\bgads\b/, /\bgoogleads\b/, /\bgoog\b/] },
  { name: "TikTok", patterns: [/tiktok/i, /\btt\b/] },
  { name: "Telegram", patterns: [/telegram/i, /\bt\.me\b/] },
  { name: "Pinterest", patterns: [/pinterest/i, /\bpin\b/] },
  { name: "Snapchat", patterns: [/snapchat/i, /\bsnap\b/] },
  { name: "Email", patterns: [/email/i, /newsletter/i, /\bmail\b/, /\besp\b/] },
];

const REFERRER_HOST_RULES: { name: string; patterns: RegExp[] }[] = [
  { name: "Instagram", patterns: [/instagram\.com/i, /l\.instagram\.com/i] },
  { name: "Facebook", patterns: [/facebook\.com/i, /fb\.com/i, /m\.facebook\.com/i] },
  { name: "WhatsApp", patterns: [/whatsapp\.com/i, /wa\.me/i, /api\.whatsapp\.com/i] },
  { name: "LinkedIn", patterns: [/linkedin\.com/i, /lnkd\.in/i] },
  { name: "YouTube", patterns: [/youtube\.com/i, /youtu\.be/i] },
  { name: "Twitter", patterns: [/twitter\.com/i, /x\.com/i, /t\.co/i] },
  { name: "Google", patterns: [/google\./i, /googleadservices\.com/i] },
  { name: "TikTok", patterns: [/tiktok\.com/i] },
  { name: "Email", patterns: [/mail\./i, /outlook\./i, /yahoo\./i] },
];

function norm(value?: string): string {
  return (value || "").trim().toLowerCase();
}

export function formatUtmLabel(raw: string): string {
  const cleaned = raw.trim().replace(/[-_+]+/g, " ");
  if (!cleaned) return "Unknown";
  return cleaned
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function matchRules(text: string, rules: { name: string; patterns: RegExp[] }[]): string | null {
  if (!text) return null;
  for (const { name, patterns } of rules) {
    if (patterns.some((p) => p.test(text))) return name;
  }
  return null;
}

function utmBlob(utm: UtmParams): string {
  return [utm.utmSource, utm.utmMedium, utm.utmCampaign, utm.utmTerm, utm.utmContent]
    .filter(Boolean)
    .join(" ");
}

/**
 * Resolve traffic source — UTM first (dynamic), then referrer hostname.
 * Unknown utm_source values become readable labels (e.g. "my_campaign" → "My Campaign").
 */
export function resolveTrafficSource(referrer: string, utm: UtmParams = {}): string {
  const source = norm(utm.utmSource);
  const medium = norm(utm.utmMedium);
  const campaign = norm(utm.utmCampaign);
  const blob = utmBlob(utm);

  if (blob) {
    const fromBlob = matchRules(blob, PLATFORM_RULES);
    if (fromBlob) return fromBlob;

    if (medium === "cpc" || medium === "ppc" || medium === "paid" || medium === "paid_social") {
      if (source) return `${formatUtmLabel(source)} Ads`;
      return "Paid Ads";
    }
    if (medium === "organic" && source) return `${formatUtmLabel(source)} Organic`;
    if (medium === "social" || medium === "sm") {
      if (source) return formatUtmLabel(source);
      return "Social";
    }
    if (medium === "referral" && source) return formatUtmLabel(source);

    if (source) return formatUtmLabel(source);
    if (campaign) return formatUtmLabel(campaign);
    if (medium) return formatUtmLabel(medium);
  }

  if (!referrer?.trim()) return "Direct";

  try {
    const host = new URL(referrer).hostname.toLowerCase();
    const fromHost = matchRules(host, REFERRER_HOST_RULES);
    if (fromHost) return fromHost;
    return formatUtmLabel(host.replace(/^www\./, "").split(".")[0] || host);
  } catch {
    return "Other";
  }
}

/** @deprecated use resolveTrafficSource */
export function classifyPlatform(referrer: string, utmSource?: string): string {
  return resolveTrafficSource(referrer, { utmSource });
}

export function referrerLabel(
  referrer: string,
  platform: string,
  utm?: UtmParams,
): string {
  if (hasUtmLabel(utm)) {
    const parts = [utm?.utmSource, utm?.utmMedium, utm?.utmCampaign].filter(Boolean);
    return parts.join(" / ");
  }
  if (platform === "Direct") return "Direct / no referrer";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return referrer.slice(0, 80) || "Unknown";
  }
}

function hasUtmLabel(utm?: UtmParams): boolean {
  return Boolean(utm?.utmSource || utm?.utmMedium || utm?.utmCampaign);
}
