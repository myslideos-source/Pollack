"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { detectPlatform, isMobileDevice, isSafariBrowser, isStandalone, type InstallPlatform } from "@/lib/pwa/platform";
import {
  getInstalledFlag,
  isAutoPromptEligible,
  incrementPromptCount,
  setDismissedNow,
  setInstalledFlag,
  setNeverShow,
} from "@/lib/pwa/storage";

/** Not yet in lib.dom.d.ts — the event Chromium/Android fires instead of an automatic prompt. */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

// Pages where a member is mid-task (health onboarding) — showing an install sheet on top would
// compete with a form the spec itself calls "important", so the auto-popup skips them. The
// manual "App installieren" entry point (Profil page) still works everywhere.
const AUTO_PROMPT_EXCLUDED_PATH_PREFIXES = ["/mitglied/onboarding"];
const AUTO_PROMPT_DELAY_MS = 1200;

type InstallPromptContextValue = {
  open: boolean;
  platform: InstallPlatform;
  mobile: boolean;
  canInstall: boolean;
  installed: boolean;
  isSafari: boolean;
  openPrompt: () => void;
  closePrompt: (reason: "later" | "never" | "dismiss" | "installed") => void;
  triggerAndroidInstall: () => Promise<void>;
};

const InstallPromptContext = createContext<InstallPromptContextValue | null>(null);

export function useInstallPrompt(): InstallPromptContextValue {
  const ctx = useContext(InstallPromptContext);
  if (!ctx) throw new Error("useInstallPrompt must be used within InstallPromptProvider");
  return ctx;
}

export function InstallPromptProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const autoShownRef = useRef(false);

  const [open, setOpen] = useState(false);
  const [{ platform, mobile, isSafari, installed }, setClientInfo] = useState<{
    platform: InstallPlatform;
    mobile: boolean;
    isSafari: boolean;
    installed: boolean;
  }>({ platform: "other", mobile: false, isSafari: true, installed: false });
  const [androidPromptReady, setAndroidPromptReady] = useState(false);

  // Initial client-only detection — SSR renders nothing platform-specific, so this only ever
  // runs after mount. Batched into one setState call rather than four.
  useEffect(() => {
    function detectClientInfo() {
      setClientInfo({
        platform: detectPlatform(),
        mobile: isMobileDevice(),
        isSafari: isSafariBrowser(),
        installed: isStandalone() || getInstalledFlag(),
      });
      document.documentElement.classList.toggle("is-standalone", isStandalone());
    }
    detectClientInfo();
  }, []);

  useEffect(() => {
    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      deferredPromptRef.current = event as BeforeInstallPromptEvent;
      setAndroidPromptReady(true);
    }
    function onAppInstalled() {
      deferredPromptRef.current = null;
      setClientInfo((prev) => ({ ...prev, installed: true }));
      setInstalledFlag();
      setOpen(false);
      document.documentElement.classList.add("is-standalone");
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const canInstall = platform === "ios" ? true : androidPromptReady;

  // Automatic post-login popup — fires once per mount of the member shell (i.e. once per fresh
  // visit/session, since this provider lives in the layout and survives client-side navigation
  // within /mitglied), 1.2s after the gating conditions are first all true.
  useEffect(() => {
    if (autoShownRef.current) return;
    if (installed || !mobile) return;
    if (!canInstall) return;
    if (AUTO_PROMPT_EXCLUDED_PATH_PREFIXES.some((p) => pathname?.startsWith(p))) return;
    if (!isAutoPromptEligible()) return;

    const timer = window.setTimeout(() => {
      autoShownRef.current = true;
      setOpen(true);
    }, AUTO_PROMPT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [installed, mobile, canInstall, pathname]);

  const openPrompt = useCallback(() => {
    if (installed) return;
    setOpen(true);
  }, [installed]);

  const closePrompt = useCallback((reason: "later" | "never" | "dismiss" | "installed") => {
    setOpen(false);
    if (reason === "never") {
      setNeverShow();
    } else if (reason === "later" || reason === "dismiss") {
      setDismissedNow();
      incrementPromptCount();
    }
  }, []);

  const triggerAndroidInstall = useCallback(async () => {
    const deferred = deferredPromptRef.current;
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    deferredPromptRef.current = null;
    setAndroidPromptReady(false);
    if (choice.outcome === "accepted") {
      setClientInfo((prev) => ({ ...prev, installed: true }));
      setInstalledFlag();
      setOpen(false);
    } else {
      closePrompt("dismiss");
    }
  }, [closePrompt]);

  return (
    <InstallPromptContext.Provider
      value={{ open, platform, mobile, canInstall, installed, isSafari, openPrompt, closePrompt, triggerAndroidInstall }}
    >
      {children}
    </InstallPromptContext.Provider>
  );
}
