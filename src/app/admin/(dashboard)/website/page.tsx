import Link from "next/link";
import type { Metadata } from "next";
import { Eye, EyeOff } from "lucide-react";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ReorderButtons } from "./ReorderButtons";

export const metadata: Metadata = { title: "Website bearbeiten" };

const PAGE_LABELS: Record<string, string> = {
  home: "Startseite",
  training: "Training",
  gesundheit: "Gesundheit",
  kampfkunst: "Kampfkunst",
  regeneration: "Regeneration",
  kontakt: "Kontakt",
};

export default async function WebsitePage() {
  await requireStaff();
  const supabase = await createClient();

  const [{ data: sections }, { data: drafts }] = await Promise.all([
    supabase.from("website_sections").select("*").order("page").order("sort_order"),
    supabase.from("website_drafts").select("section_id"),
  ]);

  const draftIds = new Set((drafts ?? []).map((d) => d.section_id));
  const grouped = new Map<string, typeof sections>();
  (sections ?? []).forEach((s) => {
    const list = grouped.get(s.page) ?? [];
    list.push(s);
    grouped.set(s.page, list as never);
  });

  return (
    <div className="mx-auto max-w-4xl">
      <div>
        <h1 className="font-display text-3xl font-semibold text-paper">Website bearbeiten</h1>
        <p className="text-sm text-paper/60">
          Inhalte einfach selbst anpassen — Änderungen werden erst nach &bdquo;Veröffentlichen&ldquo; live sichtbar.
        </p>
      </div>

      <div className="mt-6 space-y-8">
        {Array.from(grouped.entries()).map(([page, items]) => (
          <div key={page}>
            <h2 className="font-display text-lg text-paper">{PAGE_LABELS[page] ?? page}</h2>
            <div className="mt-3 overflow-hidden rounded-2xl border border-paper/10 bg-anthracite">
              {items?.map((s, i) => (
                <Link
                  key={s.id}
                  href={`/admin/website/${s.id}`}
                  className="flex items-center gap-3 border-b border-paper/5 px-4 py-3 last:border-b-0 hover:bg-paper/[0.03]"
                >
                  <ReorderButtons
                    sectionId={s.id}
                    prevId={items[i - 1]?.id ?? null}
                    nextId={items[i + 1]?.id ?? null}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-paper">{s.title}</p>
                  </div>
                  {draftIds.has(s.id) ? (
                    <span className="rounded-full border border-sand/30 bg-sand/10 px-2.5 py-1 text-xs text-sand">
                      Entwurf
                    </span>
                  ) : null}
                  {s.visible ? (
                    <Eye size={16} className="text-paper/30" />
                  ) : (
                    <EyeOff size={16} className="text-paper/30" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
