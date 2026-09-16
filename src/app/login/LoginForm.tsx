"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { signInSharedAction, requestPasswordResetSharedAction, type AuthActionState } from "@/app/actions/member-auth";
import { LoginMail, LoginLock, LoginEye, LoginEyeOff, LoginArrowRight, LoginFaceId } from "@/components/icons/login";

const inputClass =
  "h-[46px] w-full rounded-[13px] border border-[rgba(255,255,255,.24)] bg-[rgba(3,4,4,.78)] pl-11 pr-4 text-[14px] text-[#f7f7f5] outline-none transition-colors placeholder:text-white/30 focus:border-[#ef3d36] focus:ring-[3px] focus:ring-[rgba(239,61,54,.14)] sm:h-[50px]";

/** Sign-in card for every role (Mitglied, Trainer, Admin/Redakteur) — visual redesign only, the
 *  underlying signInSharedAction/requestPasswordResetSharedAction and their redirect/error
 *  handling are unchanged from before this restyle. */
export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";
  const linkError = searchParams.get("error") === "invalid_link";
  const forbidden = searchParams.get("error") === "forbidden";

  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loginState, loginFormAction, loginPending] = useActionState<AuthActionState, FormData>(
    signInSharedAction,
    null,
  );
  const [forgotState, forgotFormAction, forgotPending] = useActionState<AuthActionState, FormData>(
    requestPasswordResetSharedAction,
    null,
  );
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  return (
    <div
      className="relative animate-login-card-in overflow-hidden rounded-[20px] border border-[rgba(239,61,54,.55)] bg-[linear-gradient(145deg,rgba(18,18,18,.88),rgba(8,8,8,.82))] p-[20px_18px_22px] text-[#f7f7f5] backdrop-blur-[22px] backdrop-saturate-[1.15] shadow-[0_18px_50px_rgba(0,0,0,.5),inset_0_1px_0_rgba(255,255,255,.055),0_0_28px_rgba(239,61,54,.07)] motion-reduce:animate-none sm:rounded-[24px] sm:p-[28px_32px]"
    >
      <span
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#ef3d36]/10 blur-3xl"
        aria-hidden="true"
      />

      {mode === "login" ? (
        <div className="relative">
          <h1 className="text-[21px] font-semibold leading-tight tracking-tight text-[#f7f7f5] sm:text-[25px]">Willkommen zurück</h1>
          <p className="mt-1 text-[13px] text-white/62 sm:text-[14px]">Melde dich an und starte dein Training.</p>

          {linkError ? (
            <p role="alert" className="mt-5 flex items-start gap-2 rounded-xl border border-[#ef3d36]/30 bg-[#ef3d36]/10 p-3 text-sm text-[#ff6b64]">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              Der Link ist abgelaufen oder ungültig. Bitte fordere einen neuen an.
            </p>
          ) : null}
          {forbidden ? (
            <p role="alert" className="mt-5 flex items-start gap-2 rounded-xl border border-[#ef3d36]/30 bg-[#ef3d36]/10 p-3 text-sm text-[#ff6b64]">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              Dieser Bereich ist für dein Konto nicht zugänglich.
            </p>
          ) : null}

          <form action={loginFormAction} className="mt-5 flex flex-col gap-3.5">
            <input type="hidden" name="next" value={next} />
            <div>
              <label htmlFor="email" className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[.05em] text-white/72">
                E-Mail-Adresse
              </label>
              <div className="relative">
                <LoginMail size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ef3d36]" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={inputClass}
                  placeholder="name@beispiel.de"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <label htmlFor="password" className="block text-[10px] font-semibold uppercase tracking-[.05em] text-white/72">
                  Passwort
                </label>
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="rounded text-[12px] text-white/72 underline underline-offset-2 transition-colors hover:text-white focus-visible:text-white"
                >
                  Passwort vergessen?
                </button>
              </div>
              <div className="relative">
                <LoginLock size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ef3d36]" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                  className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-white/60 transition-colors hover:text-white focus-visible:text-white"
                >
                  {showPassword ? <LoginEyeOff size={17} /> : <LoginEye size={17} />}
                </button>
              </div>
            </div>

            {loginState?.error ? (
              <p role="alert" className="flex items-start gap-2 text-[13px] text-[#ff6b64]">
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                {loginState.error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loginPending}
              className="group relative mt-1 flex h-[46px] w-full items-center justify-center rounded-full bg-[linear-gradient(90deg,#FF433B_0%,#EF332F_52%,#C9161D_100%)] text-[13px] font-semibold uppercase tracking-[.03em] text-white shadow-[0_10px_24px_rgba(239,61,54,.22),inset_0_1px_0_rgba(255,255,255,.25)] transition-transform duration-150 hover:brightness-110 hover:-translate-y-px active:translate-y-0 active:scale-[.995] disabled:opacity-60 disabled:hover:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:h-[48px]"
            >
              {loginPending ? "Anmelden …" : "Anmelden"}
              <LoginArrowRight size={16} className="absolute right-5 top-1/2 -translate-y-1/2" />
            </button>
          </form>

          <div className="mt-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/15" aria-hidden="true" />
            <button
              type="button"
              aria-label="Mit Face ID anmelden (aktuell nicht verfügbar)"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#ef3d36] transition-transform hover:scale-105 focus-visible:scale-105 motion-reduce:hover:scale-100"
            >
              <LoginFaceId size={30} />
            </button>
            <span className="h-px flex-1 bg-white/15" aria-hidden="true" />
          </div>
          <p className="mt-1.5 text-center text-[12px] text-white/42">Mit Face ID anmelden</p>
        </div>
      ) : (
        <div className="relative">
          <h1 className="text-[21px] font-semibold leading-tight tracking-tight text-[#f7f7f5] sm:text-[25px]">Passwort vergessen</h1>
          <p className="mt-1 text-[13px] text-white/62 sm:text-[14px]">
            Wir schicken dir einen Link, mit dem du ein neues Passwort vergeben kannst.
          </p>

          {forgotSubmitted ? (
            <p role="alert" className="mt-5 flex items-start gap-2 rounded-xl border border-moss/30 bg-moss/10 p-3 text-[13px] text-moss">
              <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
              Falls diese E-Mail-Adresse ein Konto hat, ist eine Nachricht mit einem Link unterwegs.
            </p>
          ) : (
            <form
              action={(fd) => {
                setForgotSubmitted(true);
                return forgotFormAction(fd);
              }}
              className="mt-5 flex flex-col gap-3.5"
            >
              <div>
                <label htmlFor="forgot-email" className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[.05em] text-white/72">
                  E-Mail-Adresse
                </label>
                <div className="relative">
                  <LoginMail size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ef3d36]" />
                  <input
                    id="forgot-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={inputClass}
                    placeholder="name@beispiel.de"
                  />
                </div>
              </div>
              {forgotState?.error ? (
                <p role="alert" className="flex items-start gap-2 text-[13px] text-[#ff6b64]">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  {forgotState.error}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={forgotPending}
                className="group relative mt-1 flex h-[46px] w-full items-center justify-center rounded-full bg-[linear-gradient(90deg,#FF433B_0%,#EF332F_52%,#C9161D_100%)] text-[13px] font-semibold uppercase tracking-[.03em] text-white shadow-[0_10px_24px_rgba(239,61,54,.22),inset_0_1px_0_rgba(255,255,255,.25)] transition-transform duration-150 hover:brightness-110 hover:-translate-y-px active:translate-y-0 active:scale-[.995] disabled:opacity-60 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:h-[48px]"
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
            className="mt-5 rounded text-[13px] text-white/62 underline underline-offset-2 transition-colors hover:text-white focus-visible:text-white"
          >
            Zurück zur Anmeldung
          </button>
        </div>
      )}
    </div>
  );
}
