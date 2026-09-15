"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function MemberListFilter({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const q = new FormData(e.currentTarget).get("q");
        router.push(`/trainer/mitglieder${q ? `?q=${encodeURIComponent(String(q))}` : ""}`);
      }}
      className="mt-4"
    >
      <label className="relative block max-w-sm">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-paper/40" />
        <input
          name="q"
          type="search"
          defaultValue={initialQuery}
          placeholder="Nach Name oder Ziel suchen …"
          className="w-full rounded-full border border-paper/15 bg-anthracite py-2.5 pl-9 pr-4 text-sm text-paper placeholder:text-paper/40 outline-none focus:border-red"
        />
      </label>
    </form>
  );
}
