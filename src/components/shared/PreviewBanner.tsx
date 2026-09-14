"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { togglePreviewModeAction } from "@/app/admin/actions/publish";

export function PreviewBanner() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function exitPreview() {
    startTransition(async () => {
      await togglePreviewModeAction(false);
      router.refresh();
    });
  }

  return (
    <div className="sticky top-0 z-[60] flex flex-wrap items-center justify-center gap-3 bg-sand px-4 py-2 text-center text-sm font-medium text-ink">
      Vorschau-Modus aktiv — du siehst unveröffentlichte Entwürfe.
      <button
        type="button"
        onClick={exitPreview}
        disabled={isPending}
        className="rounded-full bg-ink px-3 py-1 text-xs text-paper hover:bg-ink/80 disabled:opacity-60"
      >
        {isPending ? "Verlässt …" : "Vorschau verlassen"}
      </button>
    </div>
  );
}
