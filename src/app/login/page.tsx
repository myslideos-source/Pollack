import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Mitglieder-Login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
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
            Mitgliederportal
          </p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
