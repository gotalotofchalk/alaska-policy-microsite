"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

import { PyramidTabs } from "@/components/pyramid-tabs";
import { KENTUCKY_PYRAMID } from "@/data/kentucky-pyramid-config";
import { KY_CONTEXT, KY_RHTP } from "@/data/kentucky-config";
import { getKYFacilitySummary } from "@/data/kentucky-facilities";

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

export default function KentuckyPage() {
  const fSummary = getKYFacilitySummary();

  const statPills = [
    { label: "RHTP / year", value: `$${Math.round(KY_RHTP.annualAllocation / 1e6)}M` },
    { label: "Counties", value: String(KY_CONTEXT.totalCounties) },
    { label: "Facilities tracked", value: String(fSummary.total) },
  ];

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8"
    >
      {/* ── Header ───────────────────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <h1 className="font-display text-4xl leading-[1.1] text-[color:var(--foreground)] md:text-5xl">
          Kentucky
        </h1>

        <div className="mt-4 flex flex-wrap gap-2">
          {statPills.map((pill) => (
            <span
              key={pill.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--line)] bg-white/75 px-3 py-1.5 text-xs"
            >
              <span className="text-[color:var(--muted)]">{pill.label}</span>
              <span className="font-semibold text-[color:var(--foreground)]">{pill.value}</span>
            </span>
          ))}
        </div>

        <p className="mt-3 max-w-2xl text-sm text-[color:var(--muted)]">
          Infrastructure-first assessment and planning for Kentucky&apos;s RHTP investment.
        </p>
      </motion.div>

      {/* ── Pyramid Tabs ─────────────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <PyramidTabs
          config={KENTUCKY_PYRAMID}
          defaultTab="infrastructure"
        />
      </motion.div>

      {/* ── Footer ───────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 border-t border-[color:var(--line)] pt-6 text-xs text-[color:var(--muted)]">
        <Link
          href="/kentucky/data"
          className="inline-flex items-center gap-1 text-[color:var(--teal)] underline decoration-[color:var(--teal)]/30 underline-offset-2 hover:decoration-[color:var(--teal)]"
        >
          Data Sources &amp; Methodology
          <ExternalLink className="h-3 w-3" />
        </Link>
        <span className="hidden sm:inline">·</span>
        <a
          href="mailto:data-issues@rht-nav.org?subject=Kentucky%20data%20issue"
          className="text-[color:var(--teal)] underline decoration-[color:var(--teal)]/30 underline-offset-2 hover:decoration-[color:var(--teal)]"
        >
          Report a data issue
        </a>
        <span className="hidden sm:inline">·</span>
        <span>FCC broadband data may underestimate rural coverage gaps.</span>
      </motion.div>
    </motion.div>
  );
}
