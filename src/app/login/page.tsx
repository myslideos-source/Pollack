import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentProfile, roleHomePath } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Anmelden",
  robots: { index: false, follow: false },
};

/**
 * One shared login for every role (Mitglied, Trainer, Admin/Redakteur) — signInSharedAction
 * looks up the signed-in profile's role and sends each to its own area. Already signed in?
 * Skip the form and go straight there.
 *
 * Visual redesign only (per the supplied gym-login mockup) — the auth flow itself lives
 * entirely in LoginForm/member-auth actions, untouched here.
 */
export default async function LoginPage() {
  const profile = await getCurrentProfile();
  if (profile) redirect(roleHomePath(profile.role));

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-[#050606]">
      {/* Full-bleed background: portrait photo below 900px, real 16:9 desktop photo from 900px up. */}
      <div
        className="absolute inset-0 bg-cover bg-[position:center_top] min-[900px]:hidden"
        style={{ backgroundImage: "url(/assets/login/gym-login-bg.png)" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 hidden bg-cover bg-[position:center_center] min-[900px]:block"
        style={{ backgroundImage: "url(/assets/login/gym-login-bg-desktop.png)" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,.10) 0%, rgba(0,0,0,.20) 50%, rgba(0,0,0,.72) 100%)" }}
        aria-hidden="true"
      />

      <div
        className="relative z-10 mx-auto flex min-h-[100svh] w-[calc(100%-32px)] max-w-[420px] flex-col items-center justify-center gap-5 py-8 lg:w-[min(92vw,1200px)] lg:max-w-none lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.95fr)] lg:items-center lg:gap-x-[clamp(40px,5vw,90px)] lg:gap-y-0 lg:py-12"
        style={{
          paddingTop: "max(env(safe-area-inset-top), 24px)",
          paddingBottom: "max(env(safe-area-inset-bottom), 24px)",
        }}
      >
        <div className="flex animate-login-logo-in flex-col items-center text-center motion-reduce:animate-none lg:items-start lg:text-left">
          <Image
            src="/logo/sportpark-pollack-logo-white.webp"
            alt="Sportpark Pollack"
            width={1868}
            height={647}
            priority
            className="h-auto w-[min(56vw,240px)] drop-shadow-[0_8px_30px_rgba(0,0,0,.45)] lg:w-[min(100%,400px)]"
          />
          <div className="mt-4 flex items-center gap-2.5">
            <span className="h-px w-[24px] bg-white/25" aria-hidden="true" />
            <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-white/58">Member Login</span>
            <span className="h-px w-[24px] bg-white/25" aria-hidden="true" />
          </div>
          <p className="mt-2 hidden text-[15px] text-white/70 lg:block">Dein Training. Dein Fortschritt. Dein Sportpark.</p>
        </div>

        <div className="w-full lg:flex lg:justify-center">
          <div className="w-full lg:max-w-[400px]">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[13px] text-white/40 lg:fixed lg:inset-x-0 lg:bottom-8 lg:justify-center">
          <Link href="/impressum" className="rounded transition-colors hover:text-white/70 focus-visible:text-white/70">
            Impressum
          </Link>
          <span className="h-3 w-px bg-[#ef3d36]/70" aria-hidden="true" />
          <Link href="/datenschutz" className="rounded transition-colors hover:text-white/70 focus-visible:text-white/70">
            Datenschutz
          </Link>
        </div>
      </div>
    </div>
  );
}
