"use client";

import { motion } from "framer-motion";
import { BarChart3, Pencil } from "lucide-react";
import { useParams } from "next/navigation";

import { STATE_CONFIGS, type ValidState } from "@/config/states";

/* ------------------------------------------------------------------ */
/*  Animation                                                          */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

/* ------------------------------------------------------------------ */
/*  Metric rows                                                        */
/* ------------------------------------------------------------------ */

const METRIC_ROWS = [
  { label: "30-Day Readmission Rate", source: "CMS Hospital Compare" },
  { label: "Telehealth Utilization (%)", source: "CMS Medicare FFS claims" },
  { label: "Broadband Coverage (% at 100/20 Mbps)", source: "FCC Broadband Data Collection" },
  { label: "Primary Care HPSA Score", source: "HRSA HPSA designations" },
  { label: "Preventable Hospitalization Rate", source: "AHRQ PQI composites" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function BenchmarksPage() {
  const { state } = useParams<{ state: string }>();
  const validState = state as ValidState;
  const config = STATE_CONFIGS[validState];

  return (
    <div className="p-6 lg:p-10">
      <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-8 max-w-5xl">

        {/* ── Header ─────────────────────────────────────────── */}
        <motion.div variants={fadeUp}>
          <p className="text-xs uppercase tracking-wider text-[color:var(--muted)]">
            {config.name}
          </p>
          <h1 className="mt-2 font-display text-3xl text-[color:var(--foreground)] md:text-4xl">
            Benchmarks &amp; Tracking
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[color:var(--muted)]">
            Log in as admin to enter baseline metrics for this state.
          </p>
        </motion.div>

        {/* ── Metric Rows ────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="rounded-2xl border border-[color:var(--line)] bg-white/90 shadow-[var(--shadow-soft)] overflow-hidden">
          <div className="border-b border-[color:var(--line)] bg-[color:var(--surface-soft)] px-6 py-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[color:var(--muted)]" />
              <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Baseline Metrics</span>
            </div>
          </div>

          <div className="divide-y divide-[color:var(--line)]">
            {METRIC_ROWS.map((row) => (
              <div key={row.label} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-[color:var(--foreground)]">{row.label}</p>
                  <p className="mt-0.5 text-xs text-[color:var(--muted)]">Source: {row.source}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg font-semibold text-[color:var(--muted)]">&mdash;</span>
                  <Pencil className="h-4 w-4 text-[color:var(--line)]" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Explanation ────────────────────────────────────── */}
        <motion.div variants={fadeUp}>
          <div className="rounded-2xl border border-[color:var(--line)] bg-white/90 p-6 text-center shadow-[var(--shadow-soft)]">
            <p className="text-sm leading-relaxed text-[color:var(--muted)]">
              Once baseline data is entered by an admin, this module will compute and display deltas.
            </p>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
