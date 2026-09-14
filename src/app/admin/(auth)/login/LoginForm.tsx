"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { signInAction, requestPasswordResetAction, type AuthActionState } from "@/app/admin/actions/auth";

const inputClass =
  "w-full rounded-xl border border-paper/15 bg-ink px-4 py-3 text-paper placeholder:text-paper/30 outline-none transition-colors focus:border-red focus:ring-1 focus:ring-red";

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";
  const linkError = searchParams.get("error") === "invalid_link";

  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [loginState, loginFormAction, loginPending] = useActionState<AuthActionState, FormData>(
    signInAction,
    null,
  );
  const [forgotState, forgotFormAction, forgotPending] = useActionState<AuthActionState, FormData>(
    requestPasswordResetAction,
    null,
  );
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  return (
    <div className="rounded-2xl border border-paper/10 bg-anthracite p-8 shadow-2xl">
      {mode === "login" ? (
        <>
          <h1 className="font-display text-2xl font-semibold text-paper">Anmelden</h1>
          <p className="mt-1 text-sm text-paper/60">Melde dich mit deinem Admin-Konto an.</p>

          {linkError ? (
            <p className="mt-5 flex items-start gap-2 rounded-xl border border-red/30 bg-red/10 p-3 text-sm text-red">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              Der Link ist abgelaufen oder ungültig. Bitte fordere einen neuen an.
            </p>
          ) : null}

          <form action={loginFormAction} className="mt-6 flex flex-col gap-4">
            <input type="hidden" name="next" value={next} />
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-paper/50">
                E-Mail-Adresse
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={inputClass}
                placeholder="name@sportpark-pollack.de"
              />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wide text-paper/50">
                  Passwort
                </label>
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-xs text-paper/50 underline underline-offset-2 hover:text-paper"
                >
                  Passwort vergessen?
                </button>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={inputClass}
              />
            </div>

            {loginState?.error ? (
              <p className="flex items-start gap-2 text-sm text-red">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                {loginState.error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loginPending}
              className="mt-2 rounded-full bg-red px-6 py-3 font-display text-sm uppercase tracking-wide text-paper transition-colors hover:bg-red-dark disabled:opacity-60"
            >
              {loginPending ? "Anmelden …" : "Anmelden"}
            </button>
          </form>
        </>
      ) : (
        <>
          <h1 className="font-display text-2xl font-semibold text-paper">Passwort vergessen</h1>
          <p className="mt-1 text-sm text-paper/60">
            Wir schicken dir einen Link, mit dem du ein neues Passwort vergeben kannst.
          </p>

          {forgotSubmitted ? (
            <p className="mt-6 flex items-start gap-2 rounded-xl border border-moss/30 bg-moss/10 p-3 text-sm text-moss">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              Falls diese E-Mail-Adresse ein Konto hat, ist eine Nachricht mit einem Link unterwegs.
            </p>
          ) : (
            <form
              action={(fd) => {
                setForgotSubmitted(true);
                return forgotFormAction(fd);
              }}
              className="mt-6 flex flex-col gap-4"
            >
              <div>
                <label htmlFor="forgot-email" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-paper/50">
                  E-Mail-Adresse
                </label>
                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={inputClass}
                  placeholder="name@sportpark-pollack.de"
                />
              </div>
              {forgotState?.error ? (
                <p className="flex items-start gap-2 text-sm text-red">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  {forgotState.error}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={forgotPending}
                className="mt-2 rounded-full bg-red px-6 py-3 font-display text-sm uppercase tracking-wide text-paper transition-colors hover:bg-red-dark disabled:opacity-60"
              >
                {forgotPending ? "Wird gesendet …" : "Link anfordern"}
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={() => {
              setMode("login");
              setForgotSubmitted(false);
            }}
            className="mt-5 text-sm text-paper/50 underline underline-offset-2 hover:text-paper"
          >
            Zurück zur Anmeldung
          </button>
        </>
      )}
    </div>
  );
}
