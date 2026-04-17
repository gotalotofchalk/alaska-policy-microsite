"use client";

import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Wifi, Shield } from "lucide-react";
import Link from "next/link";

import { PyramidTabs } from "@/components/pyramid-tabs";
import { useView } from "@/components/view-context";
import { KENTUCKY_PYRAMID } from "@/data/kentucky-pyramid-config";
import { KY_CONTEXT, KY_RHTP } from "@/data/kentucky-config";
import { getKYBDCSummary } from "@/data/kentucky-broadband-availability";
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

const ROLE_SUMMARIES: Record<string, string> = {
  administrator: "Kentucky has $213M in annual RHTP funding to close broadband gaps across 120 counties, secure 124 healthcare facilities, and deploy clinical solutions that reduce ER visits and expand telehealth access for 1.9M rural residents.",
  clinical: "124 rural healthcare facilities serving 1.9M patients need reliable broadband for telehealth, remote monitoring, and AI-assisted screening. Infrastructure assessment and clinical solution planning start here.",
  partner: "Kentucky represents a $213M annual investment opportunity across broadband infrastructure, cybersecurity, remote patient monitoring, and telehealth platforms serving 124 facilities and 120 counties.",
  executive: "Kentucky's RHTP investment targets broadband coverage, cybersecurity, and clinical technology deployment across 120 counties — the infrastructure foundation for measurable rural health transformation.",
};

export default function KentuckyPage() {
  const { role } = useView();
  const bdcSummary = getKYBDCSummary();
  const fSummary = getKYFacilitySummary();
  const pctUnserved = Math.round((bdcSummary.unserved / bdcSummary.totalBSLs) * 1000) / 10;

  const statPills = [
    { label: "RHTP / year", value: `$${Math.round(KY_RHTP.annualAllocation / 1e6)}M` },
    { label: "Counties", value: String(KY_CONTEXT.totalCounties) },
    { label: "Population", value: KY_CONTEXT.totalPopulation.toLocaleString("en-US") },
    { label: "sq mi", value: KY_CONTEXT.totalSquareMiles.toLocaleString("en-US") },
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
          State hub for Rural Health Transformation — infrastructure, ecosystem, and solutions planning.
        </p>
      </motion.div>

      {/* ── Executive Summary ────────────────────────────────── */}
      <motion.div variants={fadeUp} className="rounded-2xl border border-[color:var(--line)] bg-white/90 p-5 shadow-[var(--shadow-soft)]">
        <p className="text-sm leading-relaxed text-[color:var(--foreground)]">
          {ROLE_SUMMARIES[role]}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/kentucky/satellite-planner"
            className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--foreground)] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[color:#223a54]"
          >
            <Wifi className="h-3.5 w-3.5" />
            Broadband Map
            <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            href="/kentucky/cybersecurity"
            className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--line)] bg-white px-4 py-2 text-xs font-medium text-[color:var(--foreground)] transition-colors hover:bg-[color:var(--surface-soft)]"
          >
            <Shield className="h-3.5 w-3.5" />
            Cybersecurity
          </Link>
          <span className="flex items-center gap-2 text-xs text-[color:var(--muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
            {pctUnserved}% BSLs unserved · {fSummary.unserved + fSummary.underserved} facilities need coverage
          </span>
        </div>
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
      </motion.div>
    </motion.div>
  );
}
