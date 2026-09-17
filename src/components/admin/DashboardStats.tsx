import { Users, LogIn, UserPlus, Activity } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { getDashboardStats } from "@/lib/admin/dashboard";

function trendFor(delta: number, suffix: string): { label: string; tone: "positive" | "negative" | "neutral" } {
  if (delta > 0) return { label: `+${delta} ${suffix}`, tone: "positive" };
  if (delta < 0) return { label: `${delta} ${suffix}`, tone: "negative" };
  return { label: `±0 ${suffix}`, tone: "neutral" };
}

export async function DashboardStats() {
  const stats = await getDashboardStats();

  return (
    <div className="grid grid-cols-2 gap-3.5 min-[1200px]:grid-cols-4">
      <StatCard icon={Users} label="Aktive Mitglieder" value={String(stats.activeMembers)} trend={trendFor(stats.activeMembersDelta, "diesen Monat")} href="/trainer/mitglieder" />
      <StatCard icon={LogIn} label="Check-ins heute" value={String(stats.checkInsToday)} trend={trendFor(stats.checkInsTodayDelta, "vs. gestern")} />
      <StatCard icon={UserPlus} label="Neue Mitglieder" value={String(stats.newMembersThisMonth)} trend={trendFor(stats.newMembersDelta, "vs. Vormonat")} href="/trainer/mitglieder" />
      <StatCard icon={Activity} label="Aktivität" value={`${stats.activityPct}%`} />
    </div>
  );
}
