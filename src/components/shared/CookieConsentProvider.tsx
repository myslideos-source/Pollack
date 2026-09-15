"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  type ConsentState,
  type ConsentCategory,
  NECESSARY_ONLY,
  ALL_ACCEPTED,
  readStoredConsent,
  writeStoredConsent,
} from "@/lib/consent";

type CookieConsentContextValue = {
  /** null until the first read from localStorage has happened (client-only) — used to keep
   *  the banner hidden during SSR/hydration instead of flashing it before we know the state. */
  categories: ConsentState | null;
  hasDecided: boolean;
  settingsOpen: boolean;
  acceptAll: () => void;
  acceptNecessaryOnly: () => void;
  saveSelection: (categories: ConsentState) => void;
  openSettings: () => void;
  closeSettings: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<ConsentState | null>(null);
  const [hasDecided, setHasDecided] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    function hydrateFromStorage() {
      const stored = readStoredConsent();
      if (stored) {
        setCategories(stored.categories);
        setHasDecided(true);
      } else {
        setCategories(NECESSARY_ONLY);
        setHasDecided(false);
      }
    }
    hydrateFromStorage();
  }, []);

  const saveSelection = useCallback((next: ConsentState) => {
    writeStoredConsent(next);
    setCategories(next);
    setHasDecided(true);
    setSettingsOpen(false);
  }, []);

  const acceptAll = useCallback(() => saveSelection(ALL_ACCEPTED), [saveSelection]);
  const acceptNecessaryOnly = useCallback(() => saveSelection(NECESSARY_ONLY), [saveSelection]);
  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  return (
    <CookieConsentContext.Provider
      value={{ categories, hasDecided, settingsOpen, acceptAll, acceptNecessaryOnly, saveSelection, openSettings, closeSettings }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent(): CookieConsentContextValue {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error("useCookieConsent must be used within CookieConsentProvider");
  return ctx;
}

/** Convenience hook for a single category, e.g. `useConsentGiven("externalMedia")` — used by
 *  ConsentMap and any future embed that should only load once that category is accepted. */
export function useConsentGiven(category: ConsentCategory): boolean {
  const { categories } = useCookieConsent();
  return categories?.[category] ?? false;
}
