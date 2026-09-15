"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 rounded-full border border-paper/25 px-4 py-2 text-sm text-paper hover:border-paper/50"
    >
      <Printer size={15} /> Druckansicht
    </button>
  );
}
