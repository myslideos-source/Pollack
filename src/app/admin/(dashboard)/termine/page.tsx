import type { Metadata } from "next";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { NewAppointmentForm } from "./NewAppointmentForm";
import { AppointmentStatusSelect } from "./AppointmentStatusSelect";

export const metadata: Metadata = { title: "Termine" };

const TYPE_LABEL: Record<string, string> = {
  probetraining: "Probetraining",
  beratung: "Beratung",
  rueckruf: "Rückruf",
  sonstiges: "Sonstiges",
};

export default async function TerminePage() {
  await requireStaff();
  const supabase = await createClient();

  const { data: appointments } = await supabase
    .from("appointments")
    .select("id, title, appointment_type, starts_at, status, notes, inquiry_id, inquiries(first_name, last_name, email, phone)")
    .order("starts_at", { ascending: true })
    .limit(200);

  const now = new Date();
  const upcoming = (appointments ?? []).filter((a) => new Date(a.starts_at) >= now);
  const past = (appointments ?? []).filter((a) => new Date(a.starts_at) < now);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-paper">Termine</h1>
          <p className="text-sm text-paper/60">Probetrainings, Beratungen und Rückrufe im Überblick.</p>
        </div>
      </div>

      <div className="mt-6">
        <NewAppointmentForm />
      </div>

      <section className="mt-8">
        <h2 className="font-display text-lg text-paper">Anstehend</h2>
        <div className="mt-3 space-y-2">
          {upcoming.length > 0 ? (
            upcoming.map((a) => {
              const inquiry = a.inquiries as unknown as { first_name: string; last_name: string; email: string; phone: string | null } | null;
              return (
                <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-paper/10 bg-anthracite p-4">
                  <div>
                    <p className="text-sm text-paper">{a.title}</p>
                    <p className="text-xs text-paper/50">
                      {TYPE_LABEL[a.appointment_type] ?? a.appointment_type} ·{" "}
                      {new Date(a.starts_at).toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" })}
                      {inquiry ? ` · ${inquiry.email}` : ""}
                    </p>
                  </div>
                  <AppointmentStatusSelect appointmentId={a.id} status={a.status} />
                </div>
              );
            })
          ) : (
            <p className="rounded-xl border border-paper/10 bg-anthracite p-6 text-center text-sm text-paper/40">
              Keine anstehenden Termine.
            </p>
          )}
        </div>
      </section>

      {past.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-display text-lg text-paper">Vergangen</h2>
          <div className="mt-3 space-y-2">
            {past
              .slice()
              .reverse()
              .slice(0, 20)
              .map((a) => (
                <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-paper/10 bg-anthracite/60 p-4 opacity-70">
                  <div>
                    <p className="text-sm text-paper">{a.title}</p>
                    <p className="text-xs text-paper/50">
                      {TYPE_LABEL[a.appointment_type] ?? a.appointment_type} ·{" "}
                      {new Date(a.starts_at).toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                  <span className="rounded-full border border-paper/15 px-2.5 py-1 text-xs text-paper/60">{a.status}</span>
                </div>
              ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
