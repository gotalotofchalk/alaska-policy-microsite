"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  State configuration                                                */
/* ------------------------------------------------------------------ */

interface StateEntry {
  slug: string;
  name: string;
  abbr: string;
  status: "active" | "demo" | "coming-soon";
  allocation?: string;
  highlight?: string;
}

const STATES: StateEntry[] = [
  { slug: "alaska", name: "Alaska", abbr: "AK", status: "active", allocation: "$272M/yr", highlight: "Full-stack demo" },
  { slug: "kentucky", name: "Kentucky", abbr: "KY", status: "demo", allocation: "$213M/yr", highlight: "Infrastructure demo" },
  { slug: "west-virginia", name: "West Virginia", abbr: "WV", status: "coming-soon" },
  { slug: "texas", name: "Texas", abbr: "TX", status: "coming-soon" },
  { slug: "nebraska", name: "Nebraska", abbr: "NE", status: "coming-soon" },
  { slug: "california", name: "California", abbr: "CA", status: "coming-soon" },
  { slug: "mississippi", name: "Mississippi", abbr: "MS", status: "coming-soon" },
  { slug: "montana", name: "Montana", abbr: "MT", status: "coming-soon" },
];

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

export default function LandingPage() {
  const activeStates = STATES.filter((s) => s.status !== "coming-soon");
  const comingSoon = STATES.filter((s) => s.status === "coming-soon");

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
          Rural Health Technology Investment Framework
        </p>
      </motion.section>

      {/* ── State Cards ──────────────────────────────────────── */}
      <motion.section variants={stagger} initial="hidden" animate="show">
        <p className="mb-4 text-[0.72rem] uppercase tracking-[0.28em] text-[color:var(--muted)]">
          Select a state
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {activeStates.map((state) => (
            <motion.div key={state.slug} variants={fadeUp}>
              <Link
                href={state.slug === "alaska" ? "/assess" : `/${state.slug}`}
                className="group flex items-center justify-between rounded-[2rem] border border-[color:var(--line)] bg-white/80 p-6 transition-all hover:border-[color:var(--foreground)] hover:shadow-lg hover:scale-[1.01] md:p-8"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:#102235]">
                    <span className="text-lg font-bold text-white">{state.abbr}</span>
                  </div>
                  <div>
                    <p className="font-display text-2xl text-[color:var(--foreground)]">{state.name}</p>
                    <div className="mt-1 flex items-center gap-2">
                      {state.highlight && (
                        <span className="rounded-full bg-[color:rgba(15,124,134,0.12)] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[color:var(--teal)]">
                          {state.highlight}
                        </span>
                      )}
                      {state.allocation && (
                        <span className="text-xs text-[color:var(--muted)]">{state.allocation}</span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--foreground)] text-white transition-transform group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Coming Soon ──────────────────────────────────────── */}
      <motion.section variants={stagger} initial="hidden" animate="show">
        <p className="mb-3 text-[0.72rem] uppercase tracking-[0.28em] text-[color:var(--muted)]">
          In development
        </p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {comingSoon.map((state) => (
            <motion.div
              key={state.slug}
              variants={fadeUp}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-[color:var(--line)] bg-white/40 p-3 opacity-50"
            >
              <span className="text-sm font-semibold text-[color:var(--foreground)]">{state.abbr}</span>
              <span className="text-[10px] text-[color:var(--muted)]">{state.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </>
  );
}
