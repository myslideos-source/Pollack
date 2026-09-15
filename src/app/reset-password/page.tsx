import type { Metadata } from "next";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Neues Passwort vergeben",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-paper/50">
            Mitgliederportal
          </p>
        </div>
        <div className="rounded-2xl border border-paper/10 bg-anthracite p-8 shadow-2xl">
          <h1 className="font-display text-2xl font-semibold text-paper">Neues Passwort vergeben</h1>
          <p className="mt-1 text-sm text-paper/60">Wähle ein neues Passwort für dein Konto.</p>
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
