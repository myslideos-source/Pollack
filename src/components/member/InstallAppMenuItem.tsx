"use client";

import { Smartphone, ChevronRight } from "lucide-react";
import { useInstallPrompt } from "./InstallPromptProvider";

/** Manual "Sportpark App installieren" entry for the Profil page — stays reachable even after
 *  the automatic post-login popup was dismissed, but only where installing is actually possible
 *  (mobile, not already installed, and — on Android — only once the browser has actually made
 *  the native prompt available, so this never renders a button that can't do anything). */
export function InstallAppMenuItem() {
  const { mobile, canInstall, installed, openPrompt } = useInstallPrompt();

  if (!mobile || installed || !canInstall) return null;

  return (
    <button
      type="button"
      onClick={openPrompt}
      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-paper/10 bg-anthracite p-4 text-left hover:border-paper/25"
    >
      <span className="flex items-center gap-3">
        <Smartphone size={18} className="text-red" />
        <span className="text-sm text-paper">Sportpark App installieren</span>
      </span>
      <ChevronRight size={16} className="text-paper/30" />
    </button>
  );
}
