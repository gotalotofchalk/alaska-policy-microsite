"use client";

import { motion } from "framer-motion";
import { ArrowRight, Globe, Lock, MapPin } from "lucide-react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  State configuration                                                */
/* ------------------------------------------------------------------ */

interface StateEntry {
  slug: string;
  name: string;
  abbr: string;
  status: "active" | "demo" | "coming-soon";
  description?: string;
  allocation?: string;
  highlight?: string;
}

const STATES: StateEntry[] = [
  {
    slug: "alaska",
    name: "Alaska",
    abbr: "AK",
    status: "active",
    description: "Full assessment, portfolio builder, and investment calculator.",
    allocation: "$272M/yr",
    highlight: "Pilot state",
  },
  {
    slug: "kentucky",
    name: "Kentucky",
    abbr: "KY",
    status: "demo",
    description: "Broadband coverage analysis and satellite deployment planner.",
    allocation: "$213M/yr",
    highlight: "Infrastructure demo",
  },
  { slug: "west-virginia", name: "West Virginia", abbr: "WV", status: "coming-soon" },
  { slug: "texas", name: "Texas", abbr: "TX", status: "coming-soon" },
  { slug: "nebraska", name: "Nebraska", abbr: "NE", status: "coming-soon" },
  { slug: "california", name: "California", abbr: "CA", status: "coming-soon" },
  { slug: "mississippi", name: "Mississippi", abbr: "MS", status: "coming-soon" },
  { slug: "montana", name: "Montana", abbr: "MT", status: "coming-soon" },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
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
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-[0.72rem] uppercase tracking-[0.34em] text-[color:var(--muted)]">
          Rural Health Transformation Program
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.15] text-[color:var(--foreground)] md:text-5xl lg:text-[3.4rem]">
          A state decision framework for sequencing technology&#8209;enabled rural health investments.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--muted)]">
          RHT-NAV helps state administrators identify infrastructure gaps, sequence
          technology deployments, and build CMS-compliant investment portfolios that
          demonstrate measurable outcomes within 12 months.
        </p>
        <div className="mt-6 flex items-center gap-4 text-sm text-[color:var(--muted)]">
          <span className="flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5" />
            $50B over 5 years
          </span>
          <span className="h-3.5 w-px bg-[color:var(--line)]" />
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            50 states eligible
          </span>
        </div>
      </motion.section>

      {/* ── Active States ─────────────────────────────────────── */}
      <motion.section
        className="mt-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <p className="mb-4 text-[0.72rem] uppercase tracking-[0.28em] text-[color:var(--muted)]">
          Select a state to explore
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {activeStates.map((state) => (
            <motion.div key={state.slug} variants={itemVariants}>
              <Link
                href={state.slug === "alaska" ? "/alaska" : `/${state.slug}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-[color:var(--line)] bg-white/80 p-6 transition-all hover:border-[color:var(--foreground)] hover:shadow-[0_12px_40px_rgba(16,34,53,0.08)] md:p-8"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:#102235]">
                      <span className="text-base font-bold text-white">{state.abbr}</span>
                    </div>
                    <div>
                      <p className="font-display text-2xl text-[color:var(--foreground)]">
                        {state.name}
                      </p>
                      {state.highlight && (
                        <span className="rounded-full bg-[color:rgba(15,124,134,0.12)] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[color:var(--teal)]">
                          {state.highlight}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
                    {state.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  {state.allocation && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[color:var(--muted)]">RHTP allocation</p>
                      <p className="font-display text-xl text-[color:var(--foreground)]">{state.allocation}</p>
                    </div>
                  )}
                  <span className="flex items-center gap-1.5 rounded-full bg-[color:var(--foreground)] px-4 py-2.5 text-sm text-white transition-transform group-hover:translate-x-1">
                    Explore
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Coming Soon States ────────────────────────────────── */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <p className="mb-4 text-[0.72rem] uppercase tracking-[0.28em] text-[color:var(--muted)]">
          Additional states in development
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {comingSoon.map((state) => (
            <motion.div
              key={state.slug}
              variants={itemVariants}
              className="flex flex-col items-center gap-2 rounded-2xl border border-[color:var(--line)] bg-white/50 p-4 opacity-60"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:#102235]/10">
                <span className="text-sm font-semibold text-[color:var(--foreground)]">{state.abbr}</span>
              </div>
              <p className="text-sm font-medium text-[color:var(--foreground)]">{state.name}</p>
              <span className="text-[10px] uppercase tracking-wider text-[color:var(--muted)]">Coming soon</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Framework Overview ────────────────────────────────── */}
      <motion.section
        className="surface-card rounded-[2rem] p-6 md:p-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[color:var(--muted)]">The RHT-NAV framework</p>
            <h2 className="mt-2 font-display text-2xl text-[color:var(--foreground)]">
              Infrastructure first. Interventions second.
            </h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
              States receive RHTP funds and must deploy technology that produces
              measurable outcomes within 12 months. RHT-NAV ensures foundational
              infrastructure is in place before intervention spending begins.
            </p>
          </div>
          <div className="space-y-4">
            <FrameworkStep number="1" title="Map infrastructure gaps" desc="Identify which facilities and communities lack broadband, connectivity, and digital infrastructure." />
            <FrameworkStep number="2" title="Model coverage solutions" desc="Calculate satellite or broadband deployment costs, coverage, and population impact." />
          </div>
          <div className="space-y-4">
            <FrameworkStep number="3" title="Sequence interventions" desc="Once infrastructure is in place, layer telehealth, RPM, EHR integration, and clinical AI tools." />
            <FrameworkStep number="4" title="Demonstrate outcomes" desc="Track CMS-required metrics within the 12-month accountability window." />
          </div>
        </div>
      </motion.section>

      {/* ── Future: Access Tiers Teaser ───────────────────────── */}
      <motion.div
        className="flex items-center gap-4 rounded-2xl border border-dashed border-[color:var(--line)] bg-white/40 p-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Lock className="h-5 w-5 shrink-0 text-[color:var(--muted)]" />
        <div>
          <p className="text-sm font-medium text-[color:var(--foreground)]">
            Full-stack access coming soon
          </p>
          <p className="text-xs leading-5 text-[color:var(--muted)]">
            Basic broadband and infrastructure analysis is freely available. Registered
            state accounts will unlock full portfolio building, intervention sequencing,
            and CMS compliance tools.
          </p>
        </div>
      </motion.div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function FrameworkStep({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[color:var(--foreground)]">
        <span className="text-xs font-bold text-white">{number}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-[color:var(--foreground)]">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-[color:var(--muted)]">{desc}</p>
      </div>
    </div>
  );
}
