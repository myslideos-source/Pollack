"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";

export function ListEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      {value.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <GripVertical size={14} className="shrink-0 text-paper/30" />
          <input
            value={item}
            onChange={(e) => {
              const next = [...value];
              next[i] = e.target.value;
              onChange(next);
            }}
            placeholder={placeholder}
            className="flex-1 rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
          />
          <button
            type="button"
            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            className="text-paper/40 hover:text-red"
            aria-label="Eintrag entfernen"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, ""])}
        className="flex items-center gap-1.5 self-start rounded-full border border-paper/20 px-3 py-1.5 text-xs text-paper/70 hover:border-paper/40 hover:text-paper"
      >
        <Plus size={13} /> Eintrag hinzufügen
      </button>
    </div>
  );
}
