import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { inquiryAreaLabels } from "@/lib/validation/inquiry";
import { inquiryStatusLabels, type InquiryStatus } from "@/lib/inquiry-labels";

function csvEscape(value: string): string {
  if (/[",\n;]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET(request: NextRequest) {
  await requireStaff();

  const status = request.nextUrl.searchParams.get("status");
  const area = request.nextUrl.searchParams.get("area");

  const supabase = await createClient();
  let query = supabase
    .from("inquiries")
    .select("created_at, first_name, last_name, email, phone, area, preferred_date, message, status, source")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (area) query = query.eq("area", area);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: "Export fehlgeschlagen." }, { status: 500 });
  }

  const header = [
    "Datum",
    "Vorname",
    "Nachname",
    "E-Mail",
    "Telefon",
    "Bereich",
    "Gewünschter Termin",
    "Nachricht",
    "Status",
    "Quelle",
  ];

  const rows = (data ?? []).map((r) =>
    [
      new Date(r.created_at).toLocaleString("de-DE"),
      r.first_name,
      r.last_name,
      r.email,
      r.phone ?? "",
      inquiryAreaLabels[r.area as keyof typeof inquiryAreaLabels] ?? r.area,
      r.preferred_date ?? "",
      (r.message ?? "").replace(/\r?\n/g, " "),
      inquiryStatusLabels[r.status as InquiryStatus] ?? r.status,
      r.source,
    ]
      .map((v) => csvEscape(String(v)))
      .join(";"),
  );

  const csv = ["﻿" + header.join(";"), ...rows].join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="anfragen-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
