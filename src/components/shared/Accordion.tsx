"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function Accordion({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-paper/10 rounded-2xl border border-paper/10 bg-anthracite">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-paper"
            >
              <span className="font-display text-base uppercase tracking-wide">{item.question}</span>
              <ChevronDown
                size={18}
                className={`shrink-0 text-paper/50 transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>
            {open ? <p className="px-5 pb-4 text-sm text-paper/70">{item.answer}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
