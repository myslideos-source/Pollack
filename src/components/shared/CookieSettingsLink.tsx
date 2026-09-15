"use client";

import { useCookieConsent } from "./CookieConsentProvider";

/** Reopens the cookie settings panel — used by the Footer link so the choice always stays
 *  revocable, not just on first visit. */
export function CookieSettingsLink({ className }: { className?: string }) {
  const { openSettings } = useCookieConsent();
  return (
    <button type="button" onClick={openSettings} className={className}>
      Cookie-Einstellungen
    </button>
  );
}
