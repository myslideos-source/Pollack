"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { inquiryAreaLabels, inquiryAreas } from "@/lib/validation/inquiry";

export function AreaFilterSelect({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <select
      defaultValue={defaultValue}
      onChange={(e) => {
        const next = new URLSearchParams(searchParams.toString());
        if (e.target.value) next.set("area", e.target.value);
        else next.delete("area");
        router.push(`/admin/anfragen?${next.toString()}`);
      }}
      className="rounded-full border border-paper/15 bg-anthracite px-3 py-2 text-sm text-paper"
    >
      <option value="">Alle Bereiche</option>
      {inquiryAreas.map((a) => (
        <option key={a} value={a}>
          {inquiryAreaLabels[a]}
        </option>
      ))}
    </select>
  );
}
