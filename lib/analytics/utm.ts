export type UtmParams = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
};

export const UTM_STORAGE_KEY = "ln_utm_attribution";
export const UTM_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export type StoredUtm = UtmParams & { capturedAt: number };

export function utmFromSearchParams(params: URLSearchParams): UtmParams | null {
  const utmSource = params.get("utm_source")?.trim();
  const utmMedium = params.get("utm_medium")?.trim();
  const utmCampaign = params.get("utm_campaign")?.trim();
  const utmTerm = params.get("utm_term")?.trim();
  const utmContent = params.get("utm_content")?.trim();

  if (!utmSource && !utmMedium && !utmCampaign && !utmTerm && !utmContent) {
    return null;
  }

  return {
    utmSource: utmSource || undefined,
    utmMedium: utmMedium || undefined,
    utmCampaign: utmCampaign || undefined,
    utmTerm: utmTerm || undefined,
    utmContent: utmContent || undefined,
  };
}

export function hasUtmParams(utm: UtmParams | null | undefined): boolean {
  if (!utm) return false;
  return Boolean(
    utm.utmSource || utm.utmMedium || utm.utmCampaign || utm.utmTerm || utm.utmContent,
  );
}

export function readStoredUtm(): StoredUtm | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as StoredUtm;
    if (!stored.capturedAt || Date.now() - stored.capturedAt > UTM_TTL_MS) {
      localStorage.removeItem(UTM_STORAGE_KEY);
      return null;
    }
    return stored;
  } catch {
    return null;
  }
}

export function saveStoredUtm(utm: UtmParams): void {
  if (typeof window === "undefined") return;
  const payload: StoredUtm = { ...utm, capturedAt: Date.now() };
  localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(payload));
}

/** URL UTM wins; otherwise reuse last captured UTM (30-day window). */
export function resolveClientUtm(searchParams: URLSearchParams): UtmParams {
  const fromUrl = utmFromSearchParams(searchParams);
  if (fromUrl) {
    saveStoredUtm(fromUrl);
    return fromUrl;
  }
  const stored = readStoredUtm();
  if (stored) {
    const { capturedAt: _, ...utm } = stored;
    return utm;
  }
  return {};
}
