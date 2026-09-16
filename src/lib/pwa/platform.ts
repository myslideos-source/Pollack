"use client";

/** Client-only device/browser detection for the install prompt — never called during SSR. */

export function isStandalone(): boolean {
  const mql = window.matchMedia?.("(display-mode: standalone)").matches;
  const iosStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return Boolean(mql || iosStandalone);
}

export function isIOS(): boolean {
  const ua = window.navigator.userAgent;
  const isAppleTouch = /iPad|iPhone|iPod/.test(ua);
  // iPadOS 13+ reports as "MacIntel" with touch support — the one reliable way to tell it apart
  // from an actual Mac.
  const isIPadOS13Plus = window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1;
  return isAppleTouch || isIPadOS13Plus;
}

export function isSafariBrowser(): boolean {
  const ua = window.navigator.userAgent;
  const isOtherIOSBrowser = /CriOS|FxiOS|EdgiOS|OPiOS|mercury/.test(ua);
  return /Safari/.test(ua) && !isOtherIOSBrowser;
}

export function isAndroid(): boolean {
  return /Android/.test(window.navigator.userAgent);
}

/** Coarse-pointer, narrow-viewport heuristic — good enough to keep the mobile-only install
 *  prompt off desktops and laptops, including touch-capable ones. */
export function isMobileDevice(): boolean {
  const coarsePointer = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const narrowViewport = window.matchMedia?.("(max-width: 900px)").matches ?? window.innerWidth <= 900;
  return (coarsePointer && narrowViewport) || isIOS() || isAndroid();
}

export type InstallPlatform = "ios" | "android" | "other";

export function detectPlatform(): InstallPlatform {
  if (isIOS()) return "ios";
  if (isAndroid()) return "android";
  return "other";
}
