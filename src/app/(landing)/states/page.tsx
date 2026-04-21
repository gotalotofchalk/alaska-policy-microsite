"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { COMING_SOON_STATES } from "@/config/states";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const ACTIVE_STATES = [
  {
    slug: "kentucky",
    name: "Kentucky",
    abbr: "KY",
    badge: "Live demo",
    badgeStyle: "demo" as const,
    foot: "120 counties",
    isDemo: true,
  },
  {
    slug: "alaska",
    name: "Alaska",
    abbr: "AK",
    badge: "Framework",
    badgeStyle: "framework" as const,
    foot: "29 boroughs",
    isDemo: false,
  },
  {
    slug: "texas",
    name: "Texas",
    abbr: "TX",
    badge: "Framework",
    badgeStyle: "framework" as const,
    foot: "254 counties",
    isDemo: false,
  },
];

export default function StatesPage() {
  return (
    <div className="mx-auto max-w-[1320px] px-12">
      {/* Header */}
      <motion.section
        className="pt-16 pb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="font-mono mb-5 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.14em]"
          style={{ color: "var(--muted)" }}
        >
          <span style={{ color: "var(--accent)" }}>RHT-NAV</span>
          <span>State selection</span>
          <span
            style={{
              flex: 1,
              height: 1,
              background: "var(--line)",
              width: 320,
            }}
          />
        </div>
        <h1
          className="font-display text-[72px] leading-none tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          Select your state.
        </h1>
      </motion.section>

      {/* Active states */}
      <motion.section
        className="pt-2 pb-6"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <p
          className="font-mono mb-4 text-[10.5px] uppercase tracking-[0.14em]"
          style={{ color: "var(--muted)" }}
        >
          Active states
        </p>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {ACTIVE_STATES.map((state) => (
            <motion.div key={state.slug} variants={fadeUp}>
              <Link
                href={`/${state.slug}/overview`}
                className="group relative flex min-h-[200px] flex-col justify-between overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: state.isDemo
                    ? "linear-gradient(180deg, #fbf6ee 0%, #fffdfa 55%, white 100%)"
                    : "white",
                  border: state.isDemo
                    ? "1px solid var(--accent-soft)"
                    : "1px solid var(--line)",
                  borderRadius: "var(--r-xl)",
                  padding: "24px 26px 22px",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {/* Demo top-rail gradient */}
                {state.isDemo && (
                  <span
                    className="absolute left-0 top-0 right-0"
                    style={{
                      height: 3,
                      background:
                        "linear-gradient(90deg, var(--accent) 0%, var(--amber-flag) 55%, transparent 100%)",
                    }}
                  />
                )}

                {/* Top: badge + abbreviation */}
                <div className="flex items-start justify-between">
                  <span
                    className="font-mono rounded-full px-2.5 py-1 text-[9.5px] tracking-[0.14em] uppercase"
                    style={{
                      background:
                        state.badgeStyle === "demo"
                          ? "var(--accent)"
                          : "var(--teal-soft)",
                      color:
                        state.badgeStyle === "demo"
                          ? "white"
                          : "var(--teal-deep)",
                      border:
                        state.badgeStyle === "demo"
                          ? "1px solid var(--accent)"
                          : "1px solid transparent",
                    }}
                  >
                    {state.badge}
                  </span>
                  <span
                    className="font-mono pt-1 text-xs tracking-[0.12em]"
                    style={{ color: "var(--muted)" }}
                  >
                    {state.abbr}
                  </span>
                </div>

                {/* State name */}
                <div
                  className="font-display mt-5 text-4xl leading-none tracking-tight"
                  style={{ color: "var(--foreground)" }}
                >
                  {state.name}
                </div>

                {/* Footer */}
                <div
                  className="font-mono mt-4 flex items-center justify-between border-t pt-3.5 text-[10.5px] uppercase tracking-[0.1em]"
                  style={{
                    borderColor: "var(--line)",
                    color: "var(--muted)",
                  }}
                >
                  <span>{state.foot}</span>
                  <span
                    className="text-base transition-transform duration-200 group-hover:translate-x-1"
                    style={{ color: "var(--foreground)" }}
                  >
                    &rarr;
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Coming soon */}
      <motion.section
        className="pt-12 pb-24"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <p
          className="font-mono mb-4 text-[10.5px] uppercase tracking-[0.14em]"
          style={{ color: "var(--muted)" }}
        >
          In development
        </p>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {COMING_SOON_STATES.map((state) => (
            <motion.div
              key={state.abbreviation}
              variants={fadeUp}
              className="relative flex min-h-[100px] cursor-not-allowed flex-col items-center justify-center gap-1.5 opacity-55 transition-all hover:opacity-80"
              style={{
                background: "white",
                border: "1px solid var(--line)",
                borderRadius: "var(--r-lg)",
                padding: "20px 16px 16px",
              }}
            >
              <span
                className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--muted-2)" }}
              />
              <span
                className="font-mono text-[15px] font-medium tracking-[0.06em]"
                style={{ color: "var(--foreground)" }}
              >
                {state.abbreviation}
              </span>
              <span
                className="text-center text-[11.5px]"
                style={{ color: "var(--muted)" }}
              >
                {state.name}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
