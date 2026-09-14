"use client";

import { useActionState } from "react";
import { AlertCircle } from "lucide-react";
import { resetPasswordAction, type AuthActionState } from "@/app/admin/actions/auth";

const inputClass =
  "w-full rounded-xl border border-paper/15 bg-ink px-4 py-3 text-paper placeholder:text-paper/30 outline-none transition-colors focus:border-red focus:ring-1 focus:ring-red";

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState<AuthActionState, FormData>(resetPasswordAction, null);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <div>
        <label htmlFor="password" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-paper/50">
          Neues Passwort
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="passwordConfirm" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-paper/50">
          Passwort bestätigen
        </label>
        <input
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className={inputClass}
        />
      </div>

      {state?.error ? (
        <p className="flex items-start gap-2 text-sm text-red">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-full bg-red px-6 py-3 font-display text-sm uppercase tracking-wide text-paper transition-colors hover:bg-red-dark disabled:opacity-60"
      >
        {pending ? "Wird gespeichert …" : "Passwort speichern"}
      </button>
    </form>
  );
}
