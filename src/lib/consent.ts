export type ConsentCategory = "necessary" | "externalMedia" | "statistics" | "marketing";

export type ConsentState = Record<ConsentCategory, boolean>;

export type StoredConsent = {
  version: number;
  decidedAt: string;
  categories: ConsentState;
};

/** Bump when the set of services/categories changes materially — a version mismatch makes
 *  readStoredConsent() treat the stored decision as stale, so visitors see the banner again
 *  instead of silently carrying forward a decision that no longer matches what's on the page. */
export const CONSENT_VERSION = 1;
export const CONSENT_STORAGE_KEY = "sp_cookie_consent";

export const NECESSARY_ONLY: ConsentState = {
  necessary: true,
  externalMedia: false,
  statistics: false,
  marketing: false,
};

export const ALL_ACCEPTED: ConsentState = {
  necessary: true,
  externalMedia: true,
  statistics: true,
  marketing: true,
};

export function readStoredConsent(): StoredConsent | null {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeStoredConsent(categories: ConsentState): StoredConsent {
  const stored: StoredConsent = { version: CONSENT_VERSION, decidedAt: new Date().toISOString(), categories };
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Private browsing / storage disabled — the choice just won't persist across reloads.
  }
  return stored;
}
