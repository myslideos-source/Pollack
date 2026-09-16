import Link from "next/link";
import type { Metadata } from "next";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { resolveMedia } from "@/lib/content/media";
import { defaultCoverForTitle } from "@/lib/member/training-cover";
import { todayWeekday } from "@/lib/member/weekday";
import { StatCard, PremiumCard, StatusBadge, MemberAvatar, EmptyState, PrimaryButton } from "@/components/sportpark/ui";
import { TrainingHeroCard } from "@/components/member/TrainingHeroCard";
import {
  SpUsers,
  SpMessageCircle,
  SpDumbbell,
  SpCalendar,
  SpArrowRight,
  SpPlus,
  SpActivity,
  SpClock,
} from "@/components/icons/sportpark";

export const metadata: Metadata = { title: "Übersicht" };

const APPOINTMENT_TYPE_LABEL: Record<string, string> = {
  probetraining: "Probetraining",
  beratung: "Beratung",
  rueckruf: "Rückruf",
  sonstiges: "Termin",
};

export default async function AdminDashboardPage() {
  await requireStaff();
  const supabase = await createClient();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    { count: activeMembers },
    { count: newMembersThisMonth },
    { count: openInquiries },
    { count: newInquiries },
    { count: activePlans },
    { count: plansUpdatedRecently },
    { data: appointmentsToday },
    { data: recentInquiries },
    { data: recentLogs },
    { data: topActivePlan },
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "mitglied"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "mitglied").gte("created_at", monthStart.toISOString()),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).in("status", ["neu", "rueckruf_geplant"]),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "neu"),
    supabase.from("training_plans").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase
      .from("training_plans")
      .select("id", { count: "exact", head: true })
      .eq("status", "active")
      .gte("updated_at", sevenDaysAgo.toISOString()),
    supabase
      .from("appointments")
      .select("id, title, appointment_type, starts_at, status")
      .gte("starts_at", todayStart.toISOString())
      .lt("starts_at", todayEnd.toISOString())
      .neq("status", "abgesagt")
      .order("starts_at", { ascending: true }),
    supabase
      .from("inquiries")
      .select("id, first_name, last_name, area, status, created_at")
      .in("status", ["neu", "rueckruf_geplant"])
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("audit_logs")
      .select("id, summary, created_at, actor:profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("training_plans")
      .select("id, member_id, updated_at, member:profiles!training_plans_member_id_fkey(full_name)")
      .eq("status", "active")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  let planOfWeek: {
    memberName: string;
    memberId: string;
    dayTitle: string;
    exerciseCount: number;
    durationMin: number | null;
    coverSrc: string;
    coverAlt: string;
    focalX: number;
    focalY: number;
  } | null = null;

  if (topActivePlan) {
    const [{ data: day }, { data: memberProfile }] = await Promise.all([
      supabase
        .from("training_plan_days")
        .select("id, title, cover_media_id, cover_alt")
        .eq("plan_id", topActivePlan.id)
        .eq("weekday", todayWeekday())
        .maybeSingle(),
      supabase.from("member_profiles").select("session_duration_min").eq("id", topActivePlan.member_id).maybeSingle(),
    ]);

    if (day) {
      const { count: exerciseCount } = await supabase
        .from("training_plan_exercises")
        .select("id", { count: "exact", head: true })
        .eq("plan_day_id", day.id);

      const resolved = day.cover_media_id ? await resolveMedia(day.cover_media_id) : null;
      const fallback = defaultCoverForTitle(day.title);
      planOfWeek = {
        memberName: (topActivePlan.member as unknown as { full_name: string } | null)?.full_name ?? "Mitglied",
        memberId: topActivePlan.member_id,
        dayTitle: day.title,
        exerciseCount: exerciseCount ?? 0,
        durationMin: memberProfile?.session_duration_min ?? null,
        coverSrc: resolved?.src ?? fallback.src,
        coverAlt: day.cover_alt ?? fallback.alt,
        focalX: resolved?.focalX ?? fallback.focalX,
        focalY: resolved?.focalY ?? fallback.focalY,
      };
    }
  }

  return (
    <div className="sp-scope mx-auto max-w-7xl">
      <h1 className="sr-only">Übersicht</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={SpUsers}
          label="Aktive Mitglieder"
          value={activeMembers ?? 0}
          hint={`+${newMembersThisMonth ?? 0} diesen Monat`}
          hintTone="positive"
          href="/trainer/mitglieder"
        />
        <StatCard
          icon={SpMessageCircle}
          label="Neue Anfragen"
          value={openInquiries ?? 0}
          hint={`${newInquiries ?? 0} offen`}
          hintTone="attention"
          href="/admin/anfragen"
        />
        <StatCard
          icon={SpDumbbell}
          label="Trainingspläne"
          value={activePlans ?? 0}
          hint={`${plansUpdatedRecently ?? 0} aktualisiert`}
          href="/trainer"
        />
        <StatCard
          icon={SpCalendar}
          label="Termine heute"
          value={(appointmentsToday ?? []).length}
          hint={
            appointmentsToday && appointmentsToday.length > 0
              ? `Nächster um ${new Date(appointmentsToday[0].starts_at).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}`
              : "Keine Termine"
          }
          href="/admin/termine"
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <PremiumCard className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="sp-headline text-xl font-bold text-sp-text">Neue Anfragen</h2>
              <p className="text-xs text-sp-text-muted">Noch nicht bearbeitet</p>
            </div>
            <StatusBadge tone="attention">{newInquiries ?? 0} offen</StatusBadge>
          </div>

          {recentInquiries && recentInquiries.length > 0 ? (
            <ul className="mt-4 divide-y divide-sp-border">
              {recentInquiries.map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <MemberAvatar fullName={`${i.first_name} ${i.last_name}`} size={34} />
                    <div className="min-w-0">
                      <p className="truncate text-sm text-sp-text">
                        {i.first_name} {i.last_name}
                      </p>
                      <p className="truncate text-xs text-sp-text-muted">
                        {i.area} · {new Date(i.created_at).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/admin/anfragen?open=${i.id}`}
                    className="shrink-0 rounded-full border border-sp-border px-3 py-1.5 text-xs text-sp-text-secondary hover:border-sp-border-strong hover:text-sp-text"
                  >
                    Öffnen
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-6">
              <EmptyState icon={SpMessageCircle} title="Keine offenen Anfragen" />
            </div>
          )}

          <Link href="/admin/anfragen" className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-sp-red hover:text-sp-red-light">
            Alle Anfragen ansehen <SpArrowRight size={14} />
          </Link>
        </PremiumCard>

        <PremiumCard className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="sp-headline text-xl font-bold text-sp-text">Heutige Termine</h2>
            <PrimaryButton href="/admin/termine" icon={SpPlus} className="!h-9 !px-3.5 !text-[11px]">
              Termin hinzufügen
            </PrimaryButton>
          </div>

          {appointmentsToday && appointmentsToday.length > 0 ? (
            <ol className="relative mt-5 ml-1 space-y-5 border-l-2 border-sp-red/40 pl-5">
              {appointmentsToday.map((a) => (
                <li key={a.id} className="relative">
                  <span className="absolute -left-[26px] top-1 h-2.5 w-2.5 rounded-full bg-sp-red" aria-hidden="true" />
                  <p className="text-sm font-medium text-sp-text">
                    {new Date(a.starts_at).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}{" "}
                    <span className="font-normal text-sp-text-secondary">{a.title || APPOINTMENT_TYPE_LABEL[a.appointment_type]}</span>
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            <div className="py-6">
              <EmptyState icon={SpClock} title="Keine Termine heute" />
            </div>
          )}
        </PremiumCard>
      </div>

      <div className="mt-5">
        <h2 className="sp-headline text-xl font-bold text-sp-text">Aktiver Plan der Woche</h2>
        <div className="mt-3">
          {planOfWeek ? (
            <Link href={`/trainer/mitglieder/${planOfWeek.memberId}`} className="block">
              <TrainingHeroCard
                trainerFirstName={null}
                dayTitle={planOfWeek.dayTitle}
                durationMin={planOfWeek.durationMin}
                exerciseCount={planOfWeek.exerciseCount}
                approved
                imageSrc={planOfWeek.coverSrc}
                imageAlt={planOfWeek.coverAlt}
                focalX={planOfWeek.focalX}
                focalY={planOfWeek.focalY}
                href={`/trainer/mitglieder/${planOfWeek.memberId}`}
              />
            </Link>
          ) : (
            <PremiumCard className="p-6">
              <EmptyState icon={SpDumbbell} title="Noch kein aktiver Trainingsplan" />
            </PremiumCard>
          )}
        </div>
      </div>

      <PremiumCard className="mt-5 p-5">
        <h2 className="sp-headline text-xl font-bold text-sp-text">Letzte Aktivitäten</h2>
        {recentLogs && recentLogs.length > 0 ? (
          <ul className="mt-4 divide-y divide-sp-border">
            {recentLogs.map((log) => (
              <li key={log.id} className="flex items-start justify-between gap-4 py-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sp-surface-2 text-sp-text-secondary">
                    <SpActivity size={15} strokeWidth={1.8} />
                  </span>
                  <p className="text-sm text-sp-text-secondary">{log.summary}</p>
                </div>
                <p className="shrink-0 text-xs text-sp-text-muted">
                  {new Date(log.created_at).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-6">
            <EmptyState icon={SpActivity} title="Noch keine Aktivitäten" />
          </div>
        )}
      </PremiumCard>
    </div>
  );
}
