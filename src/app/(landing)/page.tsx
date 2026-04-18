"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { STATE_CONFIGS, COMING_SOON_STATES, RHTP_PROGRAM, type ValidState } from "@/config/states";

/* ------------------------------------------------------------------ */
/*  Animation                                                          */
/* ------------------------------------------------------------------ */

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const ACTIVE_STATES: ValidState[] = ["kentucky", "alaska", "texas"];

export default function LandingPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <motion.section
        className="flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <h1 className="font-display text-5xl text-[color:var(--foreground)] md:text-7xl">
          RHT-NAV
        </h1>
        <p className="mt-3 text-base text-[color:var(--muted)]">
          Rural Health Transformation Navigator
        </p>
        <p className="mt-2 max-w-lg text-sm text-[color:var(--muted)]">
          {RHTP_PROGRAM.totalFunding} under {RHTP_PROGRAM.statutoryBasis}, administered by the {RHTP_PROGRAM.adminBody}.
        </p>
      </motion.section>

      {/* ── State Cards ──────────────────────────────────────── */}
      <motion.section variants={stagger} initial="hidden" animate="show">
        <p className="mb-4 text-[0.72rem] uppercase tracking-[0.28em] text-[color:var(--muted)]">
          Select a state
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          {ACTIVE_STATES.map((slug) => {
            const config = STATE_CONFIGS[slug];
            const allocation = `$${Math.round(config.rhtpAllocation / 1e6)}M`;
            return (
              <motion.div key={slug} variants={fadeUp}>
                <Link
                  href={`/${slug}/overview`}
                  className="group flex items-center justify-between rounded-[2rem] border border-[color:var(--line)] bg-white/80 p-6 transition-all hover:border-[color:var(--foreground)] hover:shadow-lg hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: config.accentColor }}
                    >
                      <span className="text-lg font-bold text-white">{config.abbreviation}</span>
                    </div>
                    <div>
                      <p className="font-display text-2xl text-[color:var(--foreground)]">{config.name}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-[color:var(--muted)]">RHTP {allocation}/yr</span>
                      </div>
                    </div>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--foreground)] text-white transition-transform group-hover:translate-x-1">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* ── Coming Soon ──────────────────────────────────────── */}
      <motion.section variants={stagger} initial="hidden" animate="show">
        <p className="mb-3 text-[0.72rem] uppercase tracking-[0.28em] text-[color:var(--muted)]">
          In development
        </p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {COMING_SOON_STATES.map((state) => (
            <motion.div
              key={state.abbreviation}
              variants={fadeUp}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-[color:var(--line)] bg-white/40 p-3 opacity-50"
            >
              <span className="text-sm font-semibold text-[color:var(--foreground)]">{state.abbreviation}</span>
              <span className="text-xs text-[color:var(--muted)]">{state.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Program context ──────────────────────────────────── */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="rounded-2xl border border-[color:var(--line)] bg-white/60 p-5 text-xs text-[color:var(--muted)]"
      >
        <p className="font-medium text-[color:var(--foreground)]">About the RHTP</p>
        <p className="mt-1">
          {RHTP_PROGRAM.totalFunding} across FY2026–2030 under {RHTP_PROGRAM.statutoryBasis}.
          Allocation formula: {RHTP_PROGRAM.formulaBreakdown}.
          Source: {RHTP_PROGRAM.formulaSource}.
        </p>
        <p className="mt-1">
          {RHTP_PROGRAM.nationalHospitalClosures} rural hospitals have completely closed since 2005.
          Source: {RHTP_PROGRAM.nationalClosuresSource}.
        </p>
      </motion.section>
    </>
  );
}
