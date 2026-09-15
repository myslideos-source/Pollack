"use client";

import { useRouter } from "next/navigation";

const OPTIONS: { key: string; label: string }[] = [
  { key: "4w", label: "4 Wochen" },
  { key: "3m", label: "3 Monate" },
  { key: "6m", label: "6 Monate" },
  { key: "1y", label: "1 Jahr" },
];

export function FilterTabs({ active }: { active: string }) {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-1.5">
      {OPTIONS.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => router.push(`/mitglied/fortschritt?zeitraum=${o.key}`)}
          className={`rounded-full px-3 py-1.5 text-xs ${
            active === o.key ? "bg-red text-paper" : "border border-paper/15 text-paper/60 hover:text-paper"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
