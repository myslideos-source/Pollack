"use client";

import { useTransition } from "react";
import { updateAppointmentStatusAction } from "@/app/admin/actions/appointments";

const STATUS_OPTIONS = [
  { value: "geplant", label: "Geplant" },
  { value: "bestaetigt", label: "Bestätigt" },
  { value: "abgeschlossen", label: "Abgeschlossen" },
  { value: "abgesagt", label: "Abgesagt" },
];

export function AppointmentStatusSelect({ appointmentId, status }: { appointmentId: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => {
        const fd = new FormData();
        fd.set("appointmentId", appointmentId);
        fd.set("status", e.target.value);
        startTransition(async () => {
          await updateAppointmentStatusAction(fd);
        });
      }}
      className="rounded-full border border-paper/15 bg-ink px-3 py-1.5 text-xs text-paper"
    >
      {STATUS_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
