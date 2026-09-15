import { Loader2 } from "lucide-react";

/** Shown by Next.js (via loading.tsx Suspense boundaries) while a new tab/page's server data is
 *  still loading — so switching tabs in the member/trainer/admin areas never looks frozen. */
export function RouteLoading() {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center">
      <Loader2 size={28} className="animate-spin text-red" aria-label="Lädt …" />
    </div>
  );
}
