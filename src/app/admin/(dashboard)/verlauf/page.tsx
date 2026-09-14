import type { Metadata } from "next";
import Link from "next/link";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Änderungsverlauf" };

const ENTITY_LABELS: Record<string, string> = {
  website_section: "Website",
  media: "Medien",
  offer: "Angebote",
  opening_hours: "Öffnungszeiten",
  special_opening_hours: "Öffnungszeiten",
  partner: "Partner",
  product: "Produkte",
  team_member: "Team",
  inquiry: "Anfragen",
  user: "Benutzer",
  website_sections: "Website",
};

export default async function VerlaufPage({ searchParams }: { searchParams: Promise<{ typ?: string }> }) {
  await requireStaff();
  const { typ } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("audit_logs")
    .select("id, action, entity_type, entity_id, summary, created_at, actor:profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(150);
  if (typ) query = query.eq("entity_type", typ);
  const { data: logs } = await query;

  const entityTypes = Object.keys(ENTITY_LABELS);

  return (
    <div className="mx-auto max-w-4xl">
      <div>
        <h1 className="font-display text-3xl font-semibold text-paper">Änderungsverlauf</h1>
        <p className="text-sm text-paper/60">
          Alle nachvollziehbaren Änderungen an Inhalten, Anfragen und Benutzern — inklusive Veröffentlichungen. Die
          letzte veröffentlichte Version eines Website-Bereichs kann direkt in der{" "}
          <Link href="/admin/website" className="text-red hover:text-red-dark">
            Website-Bearbeitung
          </Link>{" "}
          wiederhergestellt werden.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href="/admin/verlauf"
          className={`rounded-full px-3 py-1.5 text-xs ${!typ ? "bg-red text-paper" : "border border-paper/15 text-paper/60 hover:text-paper"}`}
        >
          Alle
        </Link>
        {entityTypes
          .filter((t) => t !== "website_sections")
          .map((t) => (
            <Link
              key={t}
              href={`/admin/verlauf?typ=${t}`}
              className={`rounded-full px-3 py-1.5 text-xs ${typ === t ? "bg-red text-paper" : "border border-paper/15 text-paper/60 hover:text-paper"}`}
            >
              {ENTITY_LABELS[t]}
            </Link>
          ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-paper/10 bg-anthracite">
        {(logs ?? []).map((log) => (
          <div key={log.id} className="flex flex-wrap items-start justify-between gap-3 border-b border-paper/5 px-4 py-3 last:border-b-0">
            <div>
              <p className="text-sm text-paper">{log.summary}</p>
              <p className="mt-0.5 text-xs text-paper/40">
                {log.actor?.full_name ?? "System"} · {ENTITY_LABELS[log.entity_type] ?? log.entity_type}
              </p>
            </div>
            <p className="shrink-0 text-xs text-paper/40">
              {new Date(log.created_at).toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" })}
            </p>
          </div>
        ))}
        {(logs ?? []).length === 0 ? <p className="p-4 text-sm text-paper/40">Noch keine Einträge vorhanden.</p> : null}
      </div>
    </div>
  );
}
