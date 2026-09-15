"use client";

import { useRef, useState, useTransition } from "react";
import { Send, AlertCircle } from "lucide-react";

export type ThreadMessage = {
  id: string;
  senderRole: string;
  senderName: string;
  body: string;
  createdAt: string;
  mine: boolean;
};

/** Shared chat UI for both the member's own thread (/mitglied/nachrichten) and a trainer's view
 *  of one member's thread (/trainer/mitglieder/[id]) — only the send action differs. */
export function MessageThread({
  messages,
  sendAction,
}: {
  messages: ThreadMessage[];
  sendAction: (formData: FormData) => Promise<{ error?: string }>;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await sendAction(formData);
      if (res.error) setError(res.error);
      else {
        setError(null);
        formRef.current?.reset();
      }
    });
  }

  return (
    <div className="mt-4 flex flex-1 flex-col overflow-hidden rounded-2xl border border-paper/10 bg-anthracite">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="py-10 text-center text-sm text-paper/40">Noch keine Nachrichten.</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.mine ? "bg-red text-paper" : "bg-ink text-paper/90"}`}>
                {!m.mine ? <p className="mb-0.5 text-xs font-medium text-paper/50">{m.senderName}</p> : null}
                <p className="whitespace-pre-wrap">{m.body}</p>
                <p className={`mt-1 text-[10px] ${m.mine ? "text-paper/70" : "text-paper/40"}`}>
                  {new Date(m.createdAt).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {error ? (
        <p className="flex items-center gap-1.5 border-t border-paper/10 px-4 pt-2 text-xs text-red">
          <AlertCircle size={13} /> {error}
        </p>
      ) : null}

      <form ref={formRef} action={handleSubmit} className="flex items-center gap-2 border-t border-paper/10 p-3">
        <input
          name="body"
          required
          placeholder="Nachricht schreiben …"
          autoComplete="off"
          className="flex-1 rounded-full border border-paper/15 bg-ink px-4 py-2.5 text-sm text-paper placeholder:text-paper/30 outline-none focus:border-red focus:ring-1 focus:ring-red"
        />
        <button
          type="submit"
          disabled={isPending}
          aria-label="Senden"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red text-paper hover:bg-red-dark disabled:opacity-60"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
