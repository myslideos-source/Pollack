import Link from "next/link";
import type { Metadata } from "next";
import { Mail, CalendarCheck, PhoneCall, CheckCircle2, BarChart3, CalendarClock, ArrowRight, Users, ClipboardCheck, Dumbbell, MessageCircle } from "lucide-react";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { inquiryAreaLabels } from "@/lib/validation/inquiry";
import { inquiryStatusLabels, type InquiryStatus } from "@/lib/inquiry-labels";

export const metadata: Metadata = { title: "Dashboard" };

function greeting(hour: number): string {
  if (hour < 11) return "Guten Morgen";
  if (hour < 18) return "Guten Tag";
  return "Guten Abend";
}

export default async function AdminDashboardPage() {
  const profile = await requireStaff();
  const supabase = await createClient();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  const [
    { count: newTotal },
    { count: newToday },
    { count: trialUpcoming },
    { count: trialThisWeek },
    { count: callbacksOpen },
    { count: callbacksOverdue },
    { count: doneTotal },
    { count: draftCount },
    { data: recentInquiries },
    { data: upcomingAppointments },
    { data: recentSections },
    { data: weeklyVisitors },
    { count: activeMembers },
    { count: activePlans },
    { count: pendingPlans },
    { count: trainingsToday },
    { count: newMessages },
  ] = await Promise.all([
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "neu"),
    supabase
      .from("inquiries")
      .select("id", { count: "exact", head: true })
      .eq("status", "neu")
      .gte("created_at", todayStart.toISOString()),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("appointment_type", "probetraining")
      .in("status", ["geplant", "bestaetigt"]),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("appointment_type", "probetraining")
      .in("status", ["geplant", "bestaetigt"])
      .gte("starts_at", weekStart.toISOString()),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "rueckruf_geplant"),
    supabase
      .from("inquiries")
      .select("id", { count: "exact", head: true })
      .eq("status", "rueckruf_geplant")
      .lt("callback_date", new Date().toISOString()),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "erledigt"),
    supabase.from("website_drafts").select("id", { count: "exact", head: true }),
    supabase
      .from("inquiries")
      .select("id, first_name, last_name, area, source, status, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("appointments")
      .select("id, title, starts_at, appointment_type, status")
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true })
      .limit(5),
    supabase
      .from("website_sections")
      .select("id, title, page, updated_at")
      .order("updated_at", { ascending: false })
      .limit(5),
    supabase.rpc("get_weekly_visitor_count"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "mitglied"),
    supabase.from("training_plans").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("training_plans").select("id", { count: "exact", head: true }).eq("status", "pending_review"),
    supabase.from("workout_sessions").select("id", { count: "exact", head: true }).gte("started_at", todayStart.toISOString()),
    supabase.from("coach_messages").select("id", { count: "exact", head: true }).eq("sender_role", "member").is("read_at", null),
  ]);

  const firstName = profile.full_name.split(" ")[0];

  const stats = [
    { label: "Neue Anfragen", value: newTotal ?? 0, hint: `+${newToday ?? 0} heute`, icon: Mail, href: "/admin/anfragen?status=neu" },
    {
      label: "Probetrainings",
      value: trialUpcoming ?? 0,
      hint: `+${trialThisWeek ?? 0} diese Woche`,
      icon: CalendarCheck,
      href: "/admin/termine",
    },
    {
      label: "Offene Rückrufe",
      value: callbacksOpen ?? 0,
      hint: (callbacksOverdue ?? 0) > 0 ? `${callbacksOverdue} überfällig` : "alles im Zeitplan",
      icon: PhoneCall,
      href: "/admin/anfragen?status=rueckruf_geplant",
    },
    { label: "Erledigte Anfragen", value: doneTotal ?? 0, hint: "gesamt", icon: CheckCircle2, href: "/admin/anfragen?status=erledigt" },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-semibold text-paper">
          {greeting(new Date().getHours())}, {firstName}
        </h1>
        <p className="text-sm text-paper/60">Sportpark Verwaltung</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-paper/10 bg-anthracite p-5 transition-colors hover:border-paper/25"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red/15 text-red">
                <s.icon size={20} />
              </span>
              <ArrowRight size={16} className="text-paper/30" />
            </div>
            <p className="mt-4 text-sm text-paper/60">{s.label}</p>
            <p className="font-display text-3xl font-semibold text-paper">{s.value}</p>
            <p className="mt-1 text-xs text-paper/40">{s.hint}</p>
          </Link>
        ))}

        <div className="rounded-2xl border border-paper/10 bg-anthracite p-5 lg:col-span-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red/15 text-red">
              <BarChart3 size={20} />
            </span>
            <div>
              <p className="text-sm text-paper/60">Besucher diese Woche</p>
              <p className="font-display text-2xl font-semibold text-paper">{weeklyVisitors ?? 0}</p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="mt-8 font-display text-lg text-paper">Mitgliederportal</h2>
      <div className="mt-3 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Link href="/trainer/mitglieder" className="rounded-2xl border border-paper/10 bg-anthracite p-4 transition-colors hover:border-paper/25">
          <Users size={18} className="text-red" />
          <p className="mt-3 font-display text-2xl font-semibold text-paper">{activeMembers ?? 0}</p>
          <p className="text-xs text-paper/50">Aktive Mitglieder</p>
        </Link>
        <Link href="/trainer/mitglieder" className="rounded-2xl border border-paper/10 bg-anthracite p-4 transition-colors hover:border-paper/25">
          <Dumbbell size={18} className="text-red" />
          <p className="mt-3 font-display text-2xl font-semibold text-paper">{activePlans ?? 0}</p>
          <p className="text-xs text-paper/50">Aktive Trainingspläne</p>
        </Link>
        <Link href="/trainer" className="rounded-2xl border border-paper/10 bg-anthracite p-4 transition-colors hover:border-paper/25">
          <ClipboardCheck size={18} className="text-red" />
          <p className="mt-3 font-display text-2xl font-semibold text-paper">{pendingPlans ?? 0}</p>
          <p className="text-xs text-paper/50">Offene Freigaben</p>
        </Link>
        <div className="rounded-2xl border border-paper/10 bg-anthracite p-4">
          <CalendarCheck size={18} className="text-red" />
          <p className="mt-3 font-display text-2xl font-semibold text-paper">{trainingsToday ?? 0}</p>
          <p className="text-xs text-paper/50">Trainings heute</p>
        </div>
        <Link href="/trainer" className="rounded-2xl border border-paper/10 bg-anthracite p-4 transition-colors hover:border-paper/25">
          <MessageCircle size={18} className="text-red" />
          <p className="mt-3 font-display text-2xl font-semibold text-paper">{newMessages ?? 0}</p>
          <p className="text-xs text-paper/50">Neue Nachrichten</p>
        </Link>
      </div>

      {(draftCount ?? 0) > 0 ? (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-sand/30 bg-sand/10 px-5 py-4 text-sm text-sand">
          <CalendarClock size={18} />
          {draftCount} unveröffentlichte Änderung{(draftCount ?? 0) === 1 ? "" : "en"} — über &bdquo;Veröffentlichen&ldquo;
          oben rechts live schalten.
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-paper/10 bg-anthracite p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-paper">Neueste Anfragen</h2>
            <Link href="/admin/anfragen" className="text-xs text-red hover:text-red-dark">
              Alle ansehen
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-paper/5">
            {recentInquiries && recentInquiries.length > 0 ? (
              recentInquiries.map((i) => (
                <li key={i.id}>
                  <Link href={`/admin/anfragen?open=${i.id}`} className="flex items-center justify-between gap-3 py-3 hover:bg-paper/[0.03]">
                    <div>
                      <p className="text-sm text-paper">
                        {i.first_name} {i.last_name}
                      </p>
                      <p className="text-xs text-paper/50">
                        {inquiryAreaLabels[i.area as keyof typeof inquiryAreaLabels] ?? i.area} ·{" "}
                        {new Date(i.created_at).toLocaleDateString("de-DE")}
                      </p>
                    </div>
                    <span className="rounded-full border border-paper/15 px-2.5 py-1 text-xs text-paper/70">
                      {inquiryStatusLabels[i.status as InquiryStatus] ?? i.status}
                    </span>
                  </Link>
                </li>
              ))
            ) : (
              <li className="py-6 text-center text-sm text-paper/40">Noch keine Anfragen eingegangen.</li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-paper/10 bg-anthracite p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-paper">Anstehende Termine</h2>
            <Link href="/admin/termine" className="text-xs text-red hover:text-red-dark">
              Alle ansehen
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-paper/5">
            {upcomingAppointments && upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm text-paper">{a.title}</p>
                    <p className="text-xs text-paper/50">
                      {new Date(a.starts_at).toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                  <span className="rounded-full border border-paper/15 px-2.5 py-1 text-xs text-paper/70">{a.status}</span>
                </li>
              ))
            ) : (
              <li className="py-6 text-center text-sm text-paper/40">Keine anstehenden Termine.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-paper/10 bg-anthracite p-6">
        <h2 className="font-display text-lg text-paper">Zuletzt bearbeitete Inhalte</h2>
        <ul className="mt-4 divide-y divide-paper/5">
          {recentSections && recentSections.length > 0 ? (
            recentSections.map((s) => (
              <li key={s.id}>
                <Link href={`/admin/website?section=${s.id}`} className="flex items-center justify-between gap-3 py-3 hover:bg-paper/[0.03]">
                  <div>
                    <p className="text-sm text-paper">{s.title}</p>
                    <p className="text-xs text-paper/50">{s.page}</p>
                  </div>
                  <span className="text-xs text-paper/40">{new Date(s.updated_at).toLocaleDateString("de-DE")}</span>
                </Link>
              </li>
            ))
          ) : (
            <li className="py-6 text-center text-sm text-paper/40">Noch keine Inhalte bearbeitet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
