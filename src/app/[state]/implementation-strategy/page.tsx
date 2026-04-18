"use client";

import { motion } from "framer-motion";
import { FlaskConical } from "lucide-react";
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
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ImplementationStrategyPage() {
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
            Implementation Strategy
          </h1>
        </motion.div>

        {/* ── Placeholder Card ───────────────────────────────── */}
        <motion.div variants={fadeUp}>
          <div className="rounded-2xl border border-[color:var(--line)] bg-white/90 p-8 text-center shadow-[var(--shadow-soft)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--surface-soft)]">
              <FlaskConical className="h-6 w-6 text-[color:var(--muted)]" />
            </div>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-[color:var(--muted)]">
              Coming soon. This module will house the population health implementation strategy
              developed in collaboration with the RHT/GIS Solutions team led by
              Dr.&nbsp;Andrea&nbsp;Cooley (UT&nbsp;Tyler) and Pablo&nbsp;Gazmuri (Microsoft).
            </p>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
