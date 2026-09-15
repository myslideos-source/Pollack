import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentProfile, roleHomePath } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Anmelden",
  robots: { index: false, follow: false },
};

/** One shared login for every role (Mitglied, Trainer, Admin/Redakteur) — signInSharedAction
 *  looks up the signed-in profile's role and sends each to its own area. Already signed in?
 *  Skip the form and go straight there. */
export default async function LoginPage() {
  const profile = await getCurrentProfile();
  if (profile) redirect(roleHomePath(profile.role));

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Image
            src="/logo/sportpark-pollack-logo-white.webp"
            alt="Sportpark Pollack"
            width={220}
            height={76}
            priority
            className="h-14 w-auto"
          />
          <p className="font-display text-xs uppercase tracking-[0.3em] text-paper/50">
            Anmelden
          </p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
