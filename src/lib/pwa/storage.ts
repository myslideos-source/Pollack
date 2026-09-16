"use client";

/**
 * Small, explicitly-named localStorage keys for the member-portal install prompt's throttling
 * state — no personal data, just timestamps/counters/flags. Every read/write is wrapped so a
 * disabled or unavailable localStorage (private browsing, some in-app browsers) degrades to
 * "always eligible, never persisted" instead of throwing.
 */
const KEYS = {
  installed: "sportpark_pwa_installed",
  dismissedAt: "sportpark_pwa_prompt_dismissed_at",
  promptCount: "sportpark_pwa_prompt_count",
  neverShow: "sportpark_pwa_prompt_never_show",
} as const;

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeRaw(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage unavailable — the prompt just won't remember state across reloads.
  }
}

export function getInstalledFlag(): boolean {
  return readRaw(KEYS.installed) === "1";
}

export function setInstalledFlag(): void {
  writeRaw(KEYS.installed, "1");
}

export function getNeverShow(): boolean {
  return readRaw(KEYS.neverShow) === "1";
}

export function setNeverShow(): void {
  writeRaw(KEYS.neverShow, "1");
}

export function getPromptCount(): number {
  const raw = readRaw(KEYS.promptCount);
  const n = raw ? Number.parseInt(raw, 10) : 0;
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function incrementPromptCount(): void {
  writeRaw(KEYS.promptCount, String(getPromptCount() + 1));
}

export function getDismissedAt(): number | null {
  const raw = readRaw(KEYS.dismissedAt);
  const n = raw ? Number.parseInt(raw, 10) : NaN;
  return Number.isFinite(n) ? n : null;
}

export function setDismissedNow(): void {
  writeRaw(KEYS.dismissedAt, String(Date.now()));
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_AUTO_PROMPTS = 3;

/** Whether the automatic install prompt is allowed to show itself right now, per the stored
 *  dismissal history — independent of platform/standalone checks, which the caller does first. */
export function isAutoPromptEligible(): boolean {
  if (getNeverShow()) return false;
  if (getPromptCount() >= MAX_AUTO_PROMPTS) return false;
  const dismissedAt = getDismissedAt();
  if (dismissedAt && Date.now() - dismissedAt < SEVEN_DAYS_MS) return false;
  return true;
}
