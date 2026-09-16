"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { AchievementIcon, type AchievementTier } from "./AchievementIcon";
import type { UnlockedAchievement } from "@/lib/achievements/engine";

/**
 * The unlock moment: darken the screen, light up the badge with a brief metallic sweep, then
 * fade in the title/name/description and the two actions. Steps through one achievement at a
 * time when several unlock at once (e.g. finishing a session can trigger both a session-count
 * milestone and a personal record). No confetti, no sound — prefers-reduced-motion collapses
 * every step straight to its end state instead of skipping the moment entirely, so it stays
 * informative without the motion.
 */
export function AchievementUnlockOverlay({ achievements, onClose }: { achievements: UnlockedAchievement[]; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const current = achievements[index];
  if (!current) return null;

  function advance() {
    if (index + 1 < achievements.length) setIndex((i) => i + 1);
    else onClose();
  }

  const dur = (seconds: number) => (reduceMotion ? 0 : seconds);

  return (
    <AnimatePresence>
      <motion.div
        key={current.slug}
        className="fixed inset-0 z-[60] flex items-center justify-center p-6"
        initial={{ backgroundColor: "rgba(9,10,10,0)" }}
        animate={{ backgroundColor: "rgba(9,10,10,0.88)" }}
        exit={{ backgroundColor: "rgba(9,10,10,0)" }}
        transition={{ duration: dur(0.35) }}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Neuer Meilenstein erreicht"
          className="flex w-full max-w-sm flex-col items-center rounded-3xl border border-paper/10 bg-anthracite p-8 text-center"
          initial={{ opacity: 0, y: dur(16) ? 16 : 0, scale: reduceMotion ? 1 : 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: dur(0.4), delay: dur(0.15) }}
        >
          <motion.div
            className="relative"
            initial={{ opacity: reduceMotion ? 1 : 0.2, scale: reduceMotion ? 1 : 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: dur(0.55), delay: dur(0.25), ease: [0.16, 1, 0.3, 1] }}
          >
            <AchievementIcon iconKey={current.iconKey} tier={current.tier as AchievementTier} size="lg" />
            {!reduceMotion ? (
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  clipPath: "polygon(29% 0%, 71% 0%, 100% 29%, 100% 71%, 71% 100%, 29% 100%, 0% 71%, 0% 29%)",
                  background: "conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.6) 6%, transparent 14%)",
                }}
                initial={{ rotate: 0, opacity: 0 }}
                animate={{ rotate: 360, opacity: [0, 1, 0] }}
                transition={{ duration: 0.9, delay: 0.6, ease: "easeInOut" }}
              />
            ) : null}
          </motion.div>

          <motion.p
            className="mt-5 font-display text-xs uppercase tracking-[0.2em] text-red"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: dur(0.3), delay: dur(0.5) }}
          >
            Neuer Meilenstein erreicht
          </motion.p>
          <motion.h2
            className="mt-1 font-display text-2xl font-bold text-paper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: dur(0.3), delay: dur(0.6) }}
          >
            {current.title}
          </motion.h2>
          <motion.p
            className="mt-2 text-sm text-paper/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: dur(0.3), delay: dur(0.7) }}
          >
            {current.description}
          </motion.p>

          <motion.div
            className="mt-6 flex w-full gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: dur(0.25), delay: dur(0.85) }}
          >
            <Link
              href="/mitglied/erfolge"
              className="flex-1 rounded-full border border-paper/20 px-4 py-2.5 text-center text-sm text-paper hover:border-paper/40"
            >
              Ansehen
            </Link>
            <button
              type="button"
              onClick={advance}
              className="flex-1 rounded-full bg-red px-4 py-2.5 text-sm font-medium text-paper hover:bg-red-dark"
            >
              Schließen
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
