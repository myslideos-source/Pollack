"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X, Check, Share, Download } from "lucide-react";
import { useInstallPrompt } from "./InstallPromptProvider";

const BENEFITS = ["Direkter Zugriff auf dein Training", "Start wie eine echte App", "Immer schnell erreichbar"];

function FocusTrap({ active, children }: { active: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const container = ref.current;
    const focusable = container?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusable?.[0]?.focus();

    function onKeydown(e: KeyboardEvent) {
      if (e.key !== "Tab" || !container) return;
      const items = Array.from(
        container.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
      ).filter((el) => !el.hasAttribute("disabled"));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeydown);
    return () => {
      document.removeEventListener("keydown", onKeydown);
      previouslyFocused.current?.focus();
    };
  }, [active]);

  return <div ref={ref}>{children}</div>;
}

/**
 * Post-login install sheet for the member area — Android/Chrome gets the real
 * beforeinstallprompt flow, iOS gets a static Share-sheet walkthrough (there is no installable
 * prompt API there), everything else about the dialog (a11y, animation, throttling) is shared.
 */
export function InstallPromptDialog() {
  const { open, platform, isSafari, closePrompt, triggerAndroidInstall } = useInstallPrompt();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    function onKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") closePrompt("dismiss");
    }
    document.addEventListener("keydown", onKeydown);
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeydown);
    };
  }, [open, closePrompt]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm motion-safe:animate-[login-logo-in_250ms_ease-out] sm:items-center"
      onClick={() => closePrompt("dismiss")}
    >
      <FocusTrap active={open}>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-prompt-title"
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[400px] overflow-hidden rounded-t-[24px] border border-[rgba(239,61,54,.5)] bg-[rgba(12,13,13,.94)] p-6 pb-[max(env(safe-area-inset-bottom),24px)] text-[#f7f7f5] shadow-[0_18px_50px_rgba(0,0,0,.5),0_0_28px_rgba(239,61,54,.08)] backdrop-blur-[22px] motion-safe:animate-[login-card-in_320ms_ease-out] motion-reduce:animate-none sm:rounded-[24px] sm:pb-6"
        >
          <button
            type="button"
            onClick={() => closePrompt("dismiss")}
            aria-label="Schließen"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-white/50 transition-colors hover:text-white"
          >
            <X size={18} />
          </button>

          <div className="relative mx-auto h-14 w-14 overflow-hidden rounded-2xl">
            <Image src="/icons/pwa/icon-192.png" alt="" fill sizes="56px" />
          </div>

          {platform === "ios" ? (
            <>
              <h2 id="install-prompt-title" className="mt-4 text-center text-[19px] font-semibold text-[#f7f7f5]">
                Sportpark App installieren
              </h2>
              <p className="mt-2 text-center text-[13px] leading-relaxed text-white/62">
                Speichere deinen Mitgliederbereich auf dem Home-Bildschirm und starte dein Training künftig direkt
                wie mit einer App.
              </p>

              <ol className="mt-5 flex flex-col gap-3">
                <li className="flex items-start gap-3 text-[13px] text-white/80">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ef3d36]/15 text-[11px] font-semibold text-[#ef3d36]">
                    1
                  </span>
                  <span className="flex flex-wrap items-center gap-1.5">
                    Tippe unten im Browser auf das Teilen-Symbol
                    <Share size={16} className="text-[#ef3d36]" aria-hidden="true" />
                  </span>
                </li>
                <li className="flex items-start gap-3 text-[13px] text-white/80">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ef3d36]/15 text-[11px] font-semibold text-[#ef3d36]">
                    2
                  </span>
                  Wähle „Zum Home-Bildschirm“.
                </li>
                <li className="flex items-start gap-3 text-[13px] text-white/80">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ef3d36]/15 text-[11px] font-semibold text-[#ef3d36]">
                    3
                  </span>
                  Tippe oben rechts auf „Hinzufügen“.
                </li>
              </ol>

              {!isSafari ? (
                <p className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-[12px] text-white/55">
                  Falls „Zum Home-Bildschirm“ nicht angezeigt wird, öffne die Seite bitte in Safari.
                </p>
              ) : null}

              <button
                type="button"
                onClick={() => closePrompt("dismiss")}
                className="mt-6 flex h-11 w-full items-center justify-center rounded-full bg-[linear-gradient(90deg,#FF433B_0%,#EF332F_52%,#C9161D_100%)] text-[13px] font-semibold uppercase tracking-[.03em] text-white"
              >
                Verstanden
              </button>
              <div className="mt-3 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => closePrompt("never")}
                  className="rounded text-[12px] text-white/38 underline underline-offset-2 hover:text-white/60"
                >
                  Nicht mehr anzeigen
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 id="install-prompt-title" className="mt-4 text-center text-[19px] font-semibold text-[#f7f7f5]">
                Sportpark immer dabei
              </h2>
              <p className="mt-2 text-center text-[13px] leading-relaxed text-white/62">
                Installiere deinen Mitgliederbereich auf deinem Smartphone und starte dein Training künftig direkt
                vom Home-Bildschirm.
              </p>

              <ul className="mt-5 flex flex-col gap-2.5">
                {BENEFITS.map((b) => (
                  <li key={b} className="flex items-center gap-2.5 text-[13px] text-white/80">
                    <Check size={15} className="shrink-0 text-[#ef3d36]" />
                    {b}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={async () => {
                  await triggerAndroidInstall();
                }}
                className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,#FF433B_0%,#EF332F_52%,#C9161D_100%)] text-[13px] font-semibold uppercase tracking-[.03em] text-white shadow-[0_10px_24px_rgba(239,61,54,.22)]"
              >
                <Download size={16} />
                Jetzt installieren
              </button>

              <div className="mt-3 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => closePrompt("later")}
                  className="rounded text-[13px] text-white/62 underline underline-offset-2 hover:text-white"
                >
                  Später
                </button>
                <button
                  type="button"
                  onClick={() => closePrompt("never")}
                  className="rounded text-[12px] text-white/38 underline underline-offset-2 hover:text-white/60"
                >
                  Nicht mehr anzeigen
                </button>
              </div>
            </>
          )}
        </div>
      </FocusTrap>
    </div>
  );
}
