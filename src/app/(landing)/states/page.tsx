"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { STATE_CONFIGS, COMING_SOON_STATES, RHTP_PROGRAM, type ValidState } from "@/config/states";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

const ACTIVE_STATES: ValidState[] = ["kentucky", "alaska", "texas"];

const STATE_DETAIL: Record<ValidState, { badge: string; tagline: string; foot: string }> = {
  kentucky: {
    badge: "LIVE DEMO",
    tagline: "41.6% rural. Appalachia plus Delta overlap. Active Starlink modeling, BEAD alignment, and CMS reporting scaffold.",
    foot: "120 counties",
  },
  alaska: {
    badge: "FRAMEWORK",
    tagline: "Extreme geography and tribal health system. Tests the framework\u2019s ability to sequence connectivity where distance itself is the primary burden.",
    foot: "29 boroughs \u00B7 Tribal priority",
  },
  texas: {
    badge: "FRAMEWORK",
    tagline: "Scale and workforce shortage. East Texas maternal mortality measured against El Salvador analogs; 25,000 sq mi for 1.6M people.",
    foot: "254 counties",
  },
};

export default function StatesPage() {
  return (
    <div className="mx-auto max-w-[1320px] px-12 py-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-16"
      >
        <div
          className="font-mono mb-5 flex items-center gap-3 text-[11.5px] uppercase tracking-[0.14em]"
          style={{ color: "var(--muted)" }}
        >
          <span style={{ color: "var(--accent)" }}>RHT-NAV</span>
          <span>State selection</span>
          <span className="flex-1" style={{ height: 1, background: "var(--line)" }} />
        </div>
        <h1
          className="font-display text-5xl leading-[1.05] tracking-tight md:text-6xl"
          style={{ color: "var(--foreground)" }}
        >
          Select your{" "}
          <em style={{ color: "var(--accent)", fontWeight: 400, fontStyle: "italic" }}>
            state.
          </em>
        </h1>
        <p
          className="mt-6 max-w-[640px] text-[17px] leading-relaxed"
          style={{ color: "var(--ink-2)" }}
        >
          {RHTP_PROGRAM.totalFunding} under the Rural Health Transformation Program.
          Each state gets a tailored framework &mdash; scored on need, capacity, and
          readiness &mdash; with interventions sequenced in the order they can actually hold.
        </p>
      </motion.div>

      {/* Active states */}
      <motion.section variants={stagger} initial="hidden" animate="show">
        <p
          className="font-mono mb-4 text-[10.5px] uppercase tracking-[0.14em]"
          style={{ color: "var(--muted)" }}
        >
          Active states
        </p>

        <div className="grid gap-5 md:grid-cols-3">
          {ACTIVE_STATES.map((slug) => {
            const config = STATE_CONFIGS[slug];
            const detail = STATE_DETAIL[slug];
            const allocation = `$${Math.round(config.rhtpAllocation / 1e6)}M`;
            const isDemo = detail.badge === "LIVE DEMO";

            return (
              <motion.div key={slug} variants={fadeUp}>
                <Link
                  href={`/${slug}/overview`}
                  className="group flex min-h-[320px] flex-col justify-between rounded-sm p-8 transition-all hover:-translate-y-0.5"
                  style={{
                    border: isDemo
                      ? "1px solid var(--accent)"
                      : "1px solid var(--line)",
                    background: isDemo
                      ? "linear-gradient(180deg, var(--bg-soft) 0%, white 100%)"
                      : "white",
                    boxShadow: "var(--shadow-soft)",
                  }}
                >
                  {/* Top */}
                  <div>
                    <div className="flex items-start justify-between">
                      <span
                        className="font-mono rounded-sm px-2.5 py-1 text-[9.5px] tracking-[0.1em]"
                        style={{
                          background: isDemo ? "var(--accent)" : "var(--line)",
                          color: isDemo ? "white" : "var(--ink-2)",
                        }}
                      >
                        {detail.badge}
                      </span>
                      <span
                        className="font-mono text-[11px]"
                        style={{ color: "var(--muted)" }}
                      >
                        {config.abbreviation}
                      </span>
                    </div>

                    <h2
                      className="font-display mt-6 text-4xl tracking-tight"
                      style={{ color: "var(--foreground)" }}
                    >
                      {config.name}
                    </h2>

                    <p
                      className="mt-3 text-sm leading-relaxed"
                      style={{ color: "var(--ink-2)" }}
                    >
                      {detail.tagline}
                    </p>
                  </div>

                  {/* Bottom */}
                  <div
                    className="font-mono mt-8 flex items-center justify-between border-t pt-5 text-[11.5px]"
                    style={{ borderColor: "var(--line)", color: "var(--muted)" }}
                  >
                    <div className="flex items-center gap-4">
                      <span>{detail.foot}</span>
                      <span
                        className="rounded-sm px-2 py-0.5"
                        style={{
                          background: "rgba(12, 27, 42, 0.05)",
                          color: "var(--foreground)",
                          fontSize: "10px",
                        }}
                      >
                        RHTP {allocation}/yr
                      </span>
                    </div>
                    <span
                      className="text-base transition-transform group-hover:translate-x-1"
                      style={{ color: "var(--foreground)" }}
                    >
                      &rarr;
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Coming soon */}
      <motion.section
        variants={stagger}
        initial="hidden"
        animate="show"
        className="mt-16"
      >
        <p
          className="font-mono mb-4 text-[10.5px] uppercase tracking-[0.14em]"
          style={{ color: "var(--muted)" }}
        >
          In development
        </p>

        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
          {COMING_SOON_STATES.map((state) => (
            <motion.div
              key={state.abbreviation}
              variants={fadeUp}
              className="flex flex-col items-center gap-2 rounded-sm p-4 opacity-50"
              style={{ border: "1px solid var(--line)", background: "white" }}
            >
              <span
                className="font-mono text-sm font-medium"
                style={{ color: "var(--foreground)" }}
              >
                {state.abbreviation}
              </span>
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                {state.name}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Bottom context */}
      <div
        className="mt-16 border-t pt-8"
        style={{ borderColor: "var(--line)" }}
      >
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          The framework is state-agnostic by design. Adding a new state is a
          configuration change, not a rebuild. Architecture accommodates every
          state, every administration, every multi-year CMS cycle.{" "}
          <span className="font-mono text-[10px] tracking-wide">
            {RHTP_PROGRAM.statutoryBasis}
          </span>
        </p>
      </div>
    </div>
  );
}
