import type { Metadata } from "next";
import { requireStaff } from "@/lib/auth";
import { getMemberActivitySeries, getLiveStudioData, getRecentActivities } from "@/lib/admin/dashboard";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { MemberActivityChart } from "@/components/admin/MemberActivityChart";
import { LiveStudioCard } from "@/components/admin/LiveStudioCard";
import { RecentActivities } from "@/components/admin/RecentActivities";
import { QuickActions } from "@/components/admin/QuickActions";

export const metadata: Metadata = { title: "Übersicht" };

export default async function AdminDashboardPage() {
  await requireStaff();

  const [activitySeries, liveStudio, recentActivities] = await Promise.all([
    getMemberActivitySeries(),
    getLiveStudioData(),
    getRecentActivities(5),
  ]);

  return (
    <div className="admin-scope mx-auto flex max-w-[1400px] flex-col gap-3.5">
      <h1 className="sr-only">Übersicht</h1>

      <DashboardStats />

      <div className="dashboard-grid">
        <div className="dashboard-grid-livestudio">
          <LiveStudioCard initial={liveStudio} />
        </div>
        <div className="dashboard-grid-chart">
          <MemberActivityChart points={activitySeries} />
        </div>
        <div className="dashboard-grid-quickactions">
          <QuickActions />
        </div>
        <div className="dashboard-grid-activities">
          <RecentActivities activities={recentActivities} />
        </div>
      </div>
    </div>
  );
}
