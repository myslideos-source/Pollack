"use client";

import { useTransition } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { reorderSectionAction } from "@/app/admin/actions/website";

export function ReorderButtons({
  sectionId,
  prevId,
  nextId,
}: {
  sectionId: string;
  prevId: string | null;
  nextId: string | null;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col">
      <button
        type="button"
        disabled={!prevId || isPending}
        onClick={() => prevId && startTransition(async () => { await reorderSectionAction(sectionId, prevId); })}
        className="text-paper/40 hover:text-paper disabled:opacity-20"
        aria-label="Nach oben verschieben"
      >
        <ChevronUp size={16} />
      </button>
      <button
        type="button"
        disabled={!nextId || isPending}
        onClick={() => nextId && startTransition(async () => { await reorderSectionAction(sectionId, nextId); })}
        className="text-paper/40 hover:text-paper disabled:opacity-20"
        aria-label="Nach unten verschieben"
      >
        <ChevronDown size={16} />
      </button>
    </div>
  );
}
