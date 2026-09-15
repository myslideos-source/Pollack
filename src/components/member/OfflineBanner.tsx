"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

/** Registers the member-portal service worker (makes /mitglied installable) and shows a small
 *  banner while offline — the active workout keeps working from its local draft (see
 *  ActiveWorkout's localStorage autosave) until the connection returns. */
export function OfflineBanner() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    function syncOnlineState() {
      setOnline(navigator.onLine);
    }
    syncOnlineState();
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/mitglied/sw.js", { scope: "/mitglied" }).catch(() => {});
    }

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div className="flex items-center justify-center gap-2 bg-sand px-4 py-2 text-center text-xs font-medium text-ink">
      <WifiOff size={14} /> Du bist offline — dein aktuelles Training wird lokal gespeichert und synchronisiert sich, sobald du wieder online bist.
    </div>
  );
}
