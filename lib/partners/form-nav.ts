export const PARTNER_BECOME_HASH = "#become";
export const PARTNER_APPLY_EVENT = "ln:open-partner-form";
export const PARTNER_APPLY_STORAGE_KEY = "ln:open-partner-form";

export function shouldOpenPartnerFormFromHref(href: string): boolean {
  return href.includes(PARTNER_BECOME_HASH);
}

/** Nav click: persist intent and notify an already-mounted partners page. */
export function signalPartnerApplyForm(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(PARTNER_APPLY_STORAGE_KEY, "1");
  } catch {
    /* private mode / blocked storage */
  }
  window.dispatchEvent(new CustomEvent(PARTNER_APPLY_EVENT));
}

export function shouldOpenPartnerApplyForm(): boolean {
  if (typeof window === "undefined") return false;

  const fromHash = window.location.hash === PARTNER_BECOME_HASH;
  let fromStorage = false;
  try {
    fromStorage = sessionStorage.getItem(PARTNER_APPLY_STORAGE_KEY) === "1";
    if (fromStorage) sessionStorage.removeItem(PARTNER_APPLY_STORAGE_KEY);
  } catch {
    /* ignore */
  }

  return fromHash || fromStorage;
}
