"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { LiveStudioData } from "@/lib/admin/dashboard";
import { EmptyState } from "@/components/admin/EmptyState";

type StatusBucket = { label: string; colorClass: string; ringColor: string };

function statusFor(pct: number): StatusBucket {
  if (pct >= 90) return { label: "Sehr voll", colorClass: "text-admin-red", ringColor: "var(--admin-red)" };
  if (pct >= 75) return { label: "Gut besucht", colorClass: "text-[#f5a524]", ringColor: "#f5a524" };
  if (pct >= 50) return { label: "Normal ausgelastet", colorClass: "text-[#2dd4bf]", ringColor: "#2dd4bf" };
  return { label: "Ruhig", colorClass: "text-admin-green", ringColor: "var(--admin-green)" };
}

export function LiveStudioCard({ initial }: { initial: LiveStudioData }) {
  const [current, setCurrent] = useState(initial.current);

  useEffect(() => {
    function refresh() {
      const supabase = createClient();
      supabase
        .from("studio_visits")
        .select("id", { count: "exact", head: true })
        .is("checked_out_at", null)
        .eq("auto_closed", false)
        .then(({ count }) => {
          if (typeof count === "number") setCurrent(count);
        });
    }

    const supabase = createClient();
    const channel = supabase
      .channel("admin-live-studio")
      .on("postgres_changes", { event: "*", schema: "public", table: "studio_visits" }, refresh)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!initial.hasData) {
    return (
      <div className="admin-card p-5 sm:p-6">
        <h2 className="text-base font-semibold text-admin-text">Live im Studio</h2>
        <EmptyState icon={Users} title="Noch keine Live-Daten verfügbar" />
      </div>
    );
  }

  const capacity = initial.capacity ?? null;
  const pct = capacity && capacity > 0 ? Math.min(100, Math.round((current / capacity) * 100)) : 0;
  const status = statusFor(pct);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dash = capacity ? (pct / 100) * circumference : 0;

  return (
    <div className="admin-card p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-admin-text">Live im Studio</h2>
        <span className="flex items-center gap-1.5 text-xs text-admin-text-muted">
          <span className="h-1.5 w-1.5 animate-admin-live-pulse rounded-full bg-admin-red motion-reduce:animate-none" aria-hidden="true" />
          Live
        </span>
      </div>

      <div className="mt-5 flex items-center gap-6">
        <div className="relative flex h-[132px] w-[132px] shrink-0 items-center justify-center">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--admin-border)" strokeWidth="9" />
            {capacity ? (
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={status.ringColor}
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference - dash}`}
              />
            ) : null}
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-semibold leading-none text-admin-text">{current}</span>
            <span className="mt-1 text-[11px] text-admin-text-muted">von {capacity ?? "?"}</span>
          </div>
        </div>

        <div className="min-w-0">
          <p className={`text-sm font-medium ${status.colorClass}`}>{status.label}</p>
          <p className="mt-1 text-xs text-admin-text-muted">
            {capacity ? `${pct}% der Kapazität belegt` : "Kapazität noch nicht festgelegt"}
          </p>
          {!capacity ? (
            <a href="/admin/einstellungen" className="mt-2 inline-block text-xs font-medium text-admin-red hover:text-admin-red-dark">
              Kapazität festlegen
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
