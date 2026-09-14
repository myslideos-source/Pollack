"use client";

import { useState, useTransition } from "react";
import { Mail, Phone, Trash2, Archive, ShieldAlert, CalendarPlus, MoreVertical, X } from "lucide-react";
import type { Tables } from "@/lib/supabase/database.types";
import { inquiryAreaLabels } from "@/lib/validation/inquiry";
import { inquiryStatuses, inquiryStatusLabels } from "@/lib/inquiry-labels";
import {
  updateInquiryStatusAction,
  addInquiryNoteAction,
  setCallbackDateAction,
  assignInquiryAction,
  archiveInquiryAction,
  markSpamAction,
  deleteInquiryAction,
  createAppointmentFromInquiryAction,
} from "@/app/admin/actions/inquiries";

type Inquiry = Tables<"inquiries">;
type Note = { id: string; note: string; created_at: string; author_name: string };
type StaffMember = { id: string; full_name: string };

export function InquiryDetailPanel({
  inquiry,
  notes,
  staff,
}: {
  inquiry: Inquiry;
  notes: Note[];
  staff: StaffMember[];
}) {
  const [isPending, startTransition] = useTransition();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [noteText, setNoteText] = useState("");

  function runAction(action: (fd: FormData) => Promise<{ error?: string }>, formData: FormData) {
    startTransition(async () => {
      await action(formData);
    });
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-paper/10 bg-anthracite p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl text-paper">
              {inquiry.first_name} {inquiry.last_name}
            </h2>
            {inquiry.status === "neu" ? (
              <span className="rounded-full bg-red px-2 py-0.5 text-xs font-medium text-paper">Neu</span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-paper/50">
            {inquiry.source === "probetraining" ? "Probetraining" : "Allgemeine Anfrage"} ·{" "}
            {new Date(inquiry.created_at).toLocaleString("de-DE")}
          </p>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-paper/60 hover:bg-paper/5 hover:text-paper"
            aria-label="Weitere Aktionen"
          >
            <MoreVertical size={18} />
          </button>
          {menuOpen ? (
            <div className="absolute right-0 top-10 z-10 w-52 rounded-xl border border-paper/10 bg-ink p-1.5 shadow-xl">
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  const fd = new FormData();
                  fd.set("inquiryId", inquiry.id);
                  runAction(archiveInquiryAction, fd);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-paper/80 hover:bg-paper/5"
              >
                <Archive size={15} /> Archivieren
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  const fd = new FormData();
                  fd.set("inquiryId", inquiry.id);
                  runAction(markSpamAction, fd);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-paper/80 hover:bg-paper/5"
              >
                <ShieldAlert size={15} /> Als Spam markieren
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmDelete(true);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red hover:bg-red/10"
              >
                <Trash2 size={15} /> Datenschutzkonform löschen
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {confirmDelete ? (
        <div className="mt-4 rounded-xl border border-red/30 bg-red/10 p-4 text-sm text-paper">
          <p>
            Diese Anfrage inkl. aller personenbezogenen Daten wird unwiderruflich gelöscht. Diese Aktion kann
            nicht rückgängig gemacht werden.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                const fd = new FormData();
                fd.set("inquiryId", inquiry.id);
                runAction(deleteInquiryAction, fd);
              }}
              className="rounded-full bg-red px-4 py-2 text-xs font-medium text-paper hover:bg-red-dark"
            >
              Endgültig löschen
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="rounded-full border border-paper/20 px-4 py-2 text-xs text-paper hover:border-paper/40"
            >
              Abbrechen
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-4 space-y-1.5 text-sm">
        <a href={`mailto:${inquiry.email}`} className="flex items-center gap-2 text-paper/80 hover:text-paper">
          <Mail size={14} className="text-red" /> {inquiry.email}
        </a>
        {inquiry.phone ? (
          <a href={`tel:${inquiry.phone}`} className="flex items-center gap-2 text-paper/80 hover:text-paper">
            <Phone size={14} className="text-red" /> {inquiry.phone}
          </a>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-paper/15 px-3 py-1 text-xs text-paper/70">
          {inquiryAreaLabels[inquiry.area as keyof typeof inquiryAreaLabels] ?? inquiry.area}
        </span>
        {inquiry.preferred_date ? (
          <span className="rounded-full border border-paper/15 px-3 py-1 text-xs text-paper/70">
            Wunschtermin: {inquiry.preferred_date}
          </span>
        ) : null}
      </div>

      {inquiry.message ? (
        <div className="mt-4 rounded-xl bg-ink p-4 text-sm text-paper/85 whitespace-pre-wrap">{inquiry.message}</div>
      ) : null}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-xs text-paper/50">
          Status
          <select
            defaultValue={inquiry.status}
            disabled={isPending}
            onChange={(e) => {
              const fd = new FormData();
              fd.set("inquiryId", inquiry.id);
              fd.set("status", e.target.value);
              runAction(updateInquiryStatusAction, fd);
            }}
            className="rounded-lg border border-paper/15 bg-ink px-2.5 py-2 text-sm text-paper"
          >
            {inquiryStatuses.map((s) => (
              <option key={s} value={s}>
                {inquiryStatusLabels[s]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-paper/50">
          Zuständig
          <select
            defaultValue={inquiry.assigned_to ?? ""}
            disabled={isPending}
            onChange={(e) => {
              const fd = new FormData();
              fd.set("inquiryId", inquiry.id);
              fd.set("assignedTo", e.target.value);
              runAction(assignInquiryAction, fd);
            }}
            className="rounded-lg border border-paper/15 bg-ink px-2.5 py-2 text-sm text-paper"
          >
            <option value="">Niemand</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.full_name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-3 flex flex-col gap-1 text-xs text-paper/50">
        Rückrufdatum
        <div className="flex gap-2">
          <input
            type="datetime-local"
            defaultValue={inquiry.callback_date ? inquiry.callback_date.slice(0, 16) : ""}
            id={`callback-${inquiry.id}`}
            className="flex-1 rounded-lg border border-paper/15 bg-ink px-2.5 py-2 text-sm text-paper"
          />
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              const input = document.getElementById(`callback-${inquiry.id}`) as HTMLInputElement;
              if (!input.value) return;
              const fd = new FormData();
              fd.set("inquiryId", inquiry.id);
              fd.set("callbackDate", input.value);
              runAction(setCallbackDateAction, fd);
            }}
            className="rounded-lg border border-paper/20 px-3 text-xs text-paper hover:border-paper/40"
          >
            Speichern
          </button>
        </div>
      </div>

      <div className="mt-4">
        {showAppointmentForm ? (
          <form
            action={(fd) => {
              runAction(createAppointmentFromInquiryAction, fd);
              setShowAppointmentForm(false);
            }}
            className="rounded-xl border border-paper/15 bg-ink p-4"
          >
            <input type="hidden" name="inquiryId" value={inquiry.id} />
            <div className="flex items-center justify-between">
              <p className="text-sm text-paper">Termin anlegen</p>
              <button type="button" onClick={() => setShowAppointmentForm(false)} className="text-paper/50 hover:text-paper">
                <X size={16} />
              </button>
            </div>
            <div className="mt-3 grid gap-3">
              <input
                name="title"
                placeholder="Titel, z. B. Probetraining"
                defaultValue={`Probetraining – ${inquiry.first_name} ${inquiry.last_name}`}
                required
                className="rounded-lg border border-paper/15 bg-anthracite px-3 py-2 text-sm text-paper"
              />
              <select name="appointmentType" defaultValue="probetraining" className="rounded-lg border border-paper/15 bg-anthracite px-3 py-2 text-sm text-paper">
                <option value="probetraining">Probetraining</option>
                <option value="beratung">Beratung</option>
                <option value="rueckruf">Rückruf</option>
                <option value="sonstiges">Sonstiges</option>
              </select>
              <input
                type="datetime-local"
                name="startsAt"
                required
                className="rounded-lg border border-paper/15 bg-anthracite px-3 py-2 text-sm text-paper"
              />
            </div>
            <button type="submit" className="mt-3 rounded-full bg-red px-4 py-2 text-xs font-medium text-paper hover:bg-red-dark">
              Termin speichern
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setShowAppointmentForm(true)}
            className="flex items-center gap-1.5 rounded-full border border-paper/20 px-4 py-2 text-sm text-paper hover:border-paper/40"
          >
            <CalendarPlus size={15} /> Probetraining als Termin anlegen
          </button>
        )}
      </div>

      <div className="mt-6 flex-1 overflow-y-auto">
        <h3 className="text-xs font-medium uppercase tracking-wide text-paper/40">Interne Notizen</h3>
        <form
          action={(fd) => {
            runAction(addInquiryNoteAction, fd);
            setNoteText("");
          }}
          className="mt-2 flex gap-2"
        >
          <input type="hidden" name="inquiryId" value={inquiry.id} />
          <input
            name="note"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Notiz hinzufügen …"
            className="flex-1 rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
          />
          <button type="submit" className="rounded-lg border border-paper/20 px-3 text-xs text-paper hover:border-paper/40">
            Hinzufügen
          </button>
        </form>
        <ul className="mt-3 space-y-2">
          {notes.map((n) => (
            <li key={n.id} className="rounded-lg bg-ink p-3 text-sm text-paper/80">
              <p>{n.note}</p>
              <p className="mt-1 text-xs text-paper/40">
                {n.author_name} · {new Date(n.created_at).toLocaleString("de-DE")}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
