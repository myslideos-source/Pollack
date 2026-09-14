"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Save, RotateCcw, Eye, EyeOff } from "lucide-react";
import { SECTION_FIELD_SCHEMAS, type FieldDef } from "@/lib/website-sections-schema";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { ListEditor } from "@/components/admin/ListEditor";
import { saveSectionDraftAction, discardSectionDraftAction, restoreLastPublishedAction } from "@/app/admin/actions/website";

type Section = {
  id: string;
  slug: string;
  section_key: string;
  page: string;
  title: string;
  content: Record<string, unknown>;
  sort_order: number;
  visible: boolean;
};

function FieldInput({ field, value, onChange }: { field: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  switch (field.type) {
    case "text":
      return (
        <input
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2.5 text-sm text-paper"
        />
      );
    case "link":
      return (
        <input
          type="url"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://…"
          className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2.5 text-sm text-paper"
        />
      );
    case "textarea":
      return (
        <textarea
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2.5 text-sm text-paper"
        />
      );
    case "richtext":
      return (
        <textarea
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={8}
          className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2.5 text-sm text-paper"
        />
      );
    case "list":
      return <ListEditor value={(value as string[]) ?? []} onChange={onChange} />;
    case "boolean":
      return (
        <label className="flex items-center gap-2 text-sm text-paper">
          <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} /> Aktiv
        </label>
      );
    case "media":
      return <MediaPicker value={(value as string) ?? null} onChange={onChange} />;
    default:
      return null;
  }
}

export function SectionEditor({ section, hasDraft }: { section: Section; hasDraft: boolean }) {
  const schema = SECTION_FIELD_SCHEMAS[section.section_key] ?? [];
  const [content, setContent] = useState<Record<string, unknown>>(section.content ?? {});
  const [visible, setVisible] = useState(section.visible);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField(key: string, v: unknown) {
    setContent((c) => ({ ...c, [key]: v }));
    setSaved(false);
  }

  function handleSave() {
    startTransition(async () => {
      const res = await saveSectionDraftAction(section.id, content, visible, section.sort_order);
      if (res.error) setError(res.error);
      else {
        setError(null);
        setSaved(true);
      }
    });
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/website" className="flex items-center gap-1.5 text-sm text-paper/60 hover:text-paper">
        <ArrowLeft size={15} /> Zurück zur Übersicht
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-paper">{section.title}</h1>
          <p className="text-sm text-paper/50">{section.page}</p>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs ${
            hasDraft ? "border-sand/30 bg-sand/10 text-sand" : "border-moss/30 bg-moss/10 text-moss"
          }`}
        >
          {hasDraft ? "Entwurf (unveröffentlicht)" : "Veröffentlicht"}
        </span>
      </div>

      <div className="mt-6 rounded-2xl border border-paper/10 bg-anthracite p-6">
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="mb-5 flex items-center gap-2 text-sm text-paper/70 hover:text-paper"
        >
          {visible ? <Eye size={16} className="text-moss" /> : <EyeOff size={16} className="text-paper/40" />}
          {visible ? "Bereich ist sichtbar" : "Bereich ist ausgeblendet"}
        </button>

        <div className="flex flex-col gap-5">
          {schema.map((field) => (
            <div key={field.key}>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-paper/50">
                {field.label}
              </label>
              <FieldInput field={field} value={content[field.key]} onChange={(v) => setField(field.key, v)} />
            </div>
          ))}
        </div>

        {error ? <p className="mt-4 text-sm text-red">{error}</p> : null}

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-paper/10 pt-5">
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-full bg-red px-5 py-2.5 text-sm font-medium text-paper hover:bg-red-dark disabled:opacity-60"
          >
            <Save size={15} /> {isPending ? "Speichert …" : saved ? "Gespeichert" : "Als Entwurf speichern"}
          </button>
          {hasDraft ? (
            <button
              type="button"
              onClick={() =>
                startTransition(async () => {
                  await discardSectionDraftAction(section.id);
                  setContent(section.content ?? {});
                  setVisible(section.visible);
                })
              }
              className="text-sm text-paper/50 hover:text-paper"
            >
              Entwurf verwerfen
            </button>
          ) : (
            <button
              type="button"
              onClick={() => startTransition(async () => { await restoreLastPublishedAction(section.id); })}
              className="flex items-center gap-1.5 text-sm text-paper/50 hover:text-paper"
            >
              <RotateCcw size={14} /> Letzte Version wiederherstellen
            </button>
          )}
        </div>
        <p className="mt-3 text-xs text-paper/40">
          Änderungen werden zunächst als Entwurf gespeichert. Erst über &bdquo;Veröffentlichen&ldquo; oben rechts werden
          sie live auf der Website sichtbar.
        </p>
      </div>
    </div>
  );
}
