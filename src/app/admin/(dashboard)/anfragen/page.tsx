import Link from "next/link";
import type { Metadata } from "next";
import { Download } from "lucide-react";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { inquiryAreaLabels, inquiryAreas } from "@/lib/validation/inquiry";
import { inquiryStatuses, inquiryStatusLabels, inquiryStatusColors, type InquiryStatus } from "@/lib/inquiry-labels";
import { InquiryDetailPanel } from "./InquiryDetailPanel";
import { AreaFilterSelect } from "./AreaFilterSelect";

export const metadata: Metadata = { title: "Anfragen" };

const TABS: { key: string; label: string }[] = [
  { key: "", label: "Alle" },
  { key: "neu", label: "Neu" },
  { key: "in_bearbeitung", label: "In Bearbeitung" },
  { key: "rueckruf_geplant", label: "Rückruf geplant" },
  { key: "termin_vereinbart", label: "Termin vereinbart" },
  { key: "erledigt", label: "Erledigt" },
];

export default async function AnfragenPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; area?: string; q?: string; open?: string }>;
}) {
  await requireStaff();
  const params = await searchParams;
  const supabase = await createClient();

  let listQuery = supabase
    .from("inquiries")
    .select("id, first_name, last_name, email, area, status, source, created_at, archived")
    .eq("archived", false)
    .order("created_at", { ascending: false });

  if (params.status && (inquiryStatuses as readonly string[]).includes(params.status)) {
    listQuery = listQuery.eq("status", params.status);
  }
  if (params.area && (inquiryAreas as readonly string[]).includes(params.area)) {
    listQuery = listQuery.eq("area", params.area);
  }
  if (params.q) {
    const q = params.q.replace(/[%,]/g, "");
    listQuery = listQuery.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%`);
  }

  const { data: inquiries } = await listQuery.limit(100);

  const openId = params.open ?? inquiries?.[0]?.id ?? null;

  const [{ data: openInquiry }, { data: notes }, { data: staff }] = await Promise.all([
    openId
      ? supabase.from("inquiries").select("*").eq("id", openId).maybeSingle()
      : Promise.resolve({ data: null }),
    openId
      ? supabase
          .from("inquiry_notes")
          .select("id, note, created_at, author_id, profiles(full_name)")
          .eq("inquiry_id", openId)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
    supabase.from("profiles").select("id, full_name"),
  ]);

  // Mark as "gelesen" the moment staff open a "neu" inquiry.
  if (openInquiry && openInquiry.status === "neu") {
    await supabase.from("inquiries").update({ status: "gelesen" }).eq("id", openInquiry.id);
    openInquiry.status = "gelesen";
  }

  const qs = (overrides: Record<string, string | undefined>) => {
    const next = new URLSearchParams();
    const merged = { status: params.status, area: params.area, q: params.q, ...overrides };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) next.set(k, v);
    });
    return next.toString();
  };

  return (
    <div className="mx-auto flex h-full max-w-[1600px] flex-col">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-paper">Anfragen</h1>
          <p className="text-sm text-paper/60">Kontakt- und Probetraining-Anfragen von der Website.</p>
        </div>
        <div className="flex items-center gap-2">
          <AreaFilterSelect defaultValue={params.area ?? ""} />
          <a
            href={`/admin/anfragen/export?${qs({})}`}
            className="flex items-center gap-1.5 rounded-full border border-paper/15 px-4 py-2 text-sm text-paper hover:border-paper/30"
          >
            <Download size={14} /> CSV-Export
          </a>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-b border-paper/10 pb-3">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/admin/anfragen?${qs({ status: t.key || undefined })}`}
            className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
              (params.status ?? "") === t.key ? "bg-red text-paper" : "text-paper/60 hover:bg-paper/5 hover:text-paper"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="mt-4 grid flex-1 gap-4 lg:overflow-hidden lg:grid-cols-[1.3fr_1fr]">
        <div className="overflow-auto rounded-2xl border border-paper/10 bg-anthracite lg:max-h-full">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-anthracite text-left text-xs uppercase tracking-wide text-paper/40">
              <tr className="border-b border-paper/10">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Anfrageart</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Datum</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {inquiries && inquiries.length > 0 ? (
                inquiries.map((i) => (
                  <tr
                    key={i.id}
                    className={`cursor-pointer border-b border-paper/5 hover:bg-paper/[0.03] ${
                      i.id === openId ? "bg-red/10" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <Link href={`/admin/anfragen?${qs({ open: i.id })}`} className="block text-paper">
                        {i.first_name} {i.last_name}
                        {i.status === "neu" ? <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-red align-middle" /> : null}
                      </Link>
                    </td>
                    <td className="hidden px-4 py-3 text-paper/60 sm:table-cell">
                      {inquiryAreaLabels[i.area as keyof typeof inquiryAreaLabels] ?? i.area}
                    </td>
                    <td className="hidden px-4 py-3 text-paper/60 sm:table-cell">
                      {new Date(i.created_at).toLocaleDateString("de-DE")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2.5 py-1 text-xs ${inquiryStatusColors[i.status as InquiryStatus]}`}>
                        {inquiryStatusLabels[i.status as InquiryStatus] ?? i.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-paper/40">
                    Keine Anfragen gefunden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="overflow-y-auto lg:max-h-full">
          {openInquiry ? (
            <InquiryDetailPanel
              inquiry={openInquiry}
              notes={
                (notes ?? []).map((n) => ({
                  id: n.id,
                  note: n.note,
                  created_at: n.created_at,
                  author_name: (n.profiles as unknown as { full_name: string } | null)?.full_name ?? "Unbekannt",
                })) as { id: string; note: string; created_at: string; author_name: string }[]
              }
              staff={staff ?? []}
            />
          ) : (
            <div className="flex h-full items-center justify-center rounded-2xl border border-paper/10 bg-anthracite p-8 text-center text-sm text-paper/40">
              Keine Anfrage ausgewählt.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
