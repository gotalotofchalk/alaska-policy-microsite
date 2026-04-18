"use client";

import { motion } from "framer-motion";
import { ArrowRight, Wifi, Shield, Stethoscope, Network, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { STATE_CONFIGS, RHTP_PROGRAM, type ValidState } from "@/config/states";
import { KY_CONTEXT } from "@/data/kentucky-config";
import { getKYBDCSummary } from "@/data/kentucky-broadband-availability";
import { getKYFacilitySummary } from "@/data/kentucky-facilities";
import { usNum } from "@/lib/utils";

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
/*  Validated state-specific data                                      */
/* ------------------------------------------------------------------ */

const KY_STATS = {
  beadAllocation: "$1.086B",
  beadLocations: "86,400 unserved and underserved locations",
  beadSource: "NTIA BEAD Final Proposal approval, late 2025",
  maternityDesert: "1 in 6 Kentucky women of childbearing age lives in a maternity care desert, more than 4x the national average",
  maternitySource: 'Kentucky RHTP application narrative, "PoWERing Maternal and Infant Health" initiative',
  paramedicConcentration: "Nearly half of Kentucky paramedics are concentrated in just 5 counties",
  paramedicSource: 'Kentucky RHTP application, "Crisis to Care" initiative',
};

const AK_STATS = {
  rhtpPlanFocus: "Flexible, phased and voluntary initiatives focused on cybersecurity, data interoperability, and consumer-facing remote modalities",
  rhtpSource: "Alaska DHSS RHTP application",
  beadAllocation: "$1.017B total, with $629M in initial deployment awards across 29 projects and 15 providers",
  beadTimeline: "First connections expected June 2026; approximately 70% of BEAD-funded Alaska locations connected by end of year 3",
  beadSource: "NTIA BEAD Final Proposal approval, January 6, 2026",
};

const TX_STATS = {
  hospitalClosures: "Texas led the nation in rural hospital closures 2010–2020",
  closuresSource: "Cecil G. Sheps Center for Health Services Research",
  rhtpPlan: '"Rural Texas Strong: Supporting Health and Wellness" allocates $968M across 6 initiatives',
  rhtpInitiatives: "$150M Lone Star Advanced AI and Telehealth (maternal, behavioral, preventive); $150M remote patient monitoring; $200M workforce pipeline",
  rhtpSource: "Texas HHSC RHTP application, finalized after 300+ public comments",
  trinityCounty: "Mid Coast Medical Center in Trinity, TX closed April 25, 2025, 14 months after reopening. Trinity County residents now drive 30 miles to the nearest hospital.",
  trinitySource: "Cecil G. Sheps Center closure tracking",
};

/* ------------------------------------------------------------------ */
/*  Quick-link cards                                                   */
/* ------------------------------------------------------------------ */

interface QuickLink {
  href: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

function getQuickLinks(state: ValidState): QuickLink[] {
  const base = `/${state}`;
  return [
    { href: `${base}/need`, label: "Need Assessment", description: "Health deserts, shortages, chronic disease burden", icon: Stethoscope },
    { href: `${base}/connectivity`, label: "Connectivity & Infrastructure", description: "Broadband coverage map and satellite planner", icon: Wifi },
    { href: `${base}/capacity`, label: "Capacity & Readiness", description: "Facilities, workforce, cybersecurity", icon: Shield },
    { href: `${base}/portfolio`, label: "Intervention Portfolio", description: "Clinical solutions and technology deployment", icon: Network },
    { href: `${base}/benchmarks`, label: "Benchmarks & Tracking", description: "Before/after metrics and outcomes", icon: BarChart3 },
  ];
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function OverviewPage() {
  const { state } = useParams<{ state: string }>();
  const validState = state as ValidState;
  const config = STATE_CONFIGS[validState];
  const allocation = `$${Math.round(config.rhtpAllocation / 1e6)}M`;
  const quickLinks = getQuickLinks(validState);

  // Kentucky-specific data (only load when state is Kentucky)
  const kyData = validState === "kentucky" ? (() => {
    const bdcSummary = getKYBDCSummary();
    const fSummary = getKYFacilitySummary();
    const pctUnserved = Math.round((bdcSummary.unserved / bdcSummary.totalBSLs) * 1000) / 10;
    return {
      pills: [
        { label: "RHTP / year", value: allocation },
        { label: "Counties", value: String(KY_CONTEXT.totalCounties) },
        { label: "Population", value: KY_CONTEXT.totalPopulation.toLocaleString("en-US") },
        { label: "sq mi", value: KY_CONTEXT.totalSquareMiles.toLocaleString("en-US") },
      ],
      pctUnserved,
      facilitiesNeedCoverage: fSummary.unserved + fSummary.underserved,
    };
  })() : null;

  return (
    <div className="p-6 lg:p-10">
      <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-8 max-w-5xl">

        {/* ── Header ─────────────────────────────────────────── */}
        <motion.div variants={fadeUp}>
          <p className="text-xs uppercase tracking-wider text-[color:var(--muted)]">State Overview</p>
          <h1 className="mt-2 font-display text-4xl leading-[1.1] text-[color:var(--foreground)] md:text-5xl">
            {config.name}
          </h1>

          {/* Stat pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--line)] bg-white/75 px-3 py-1.5 text-xs">
              <span className="text-[color:var(--muted)]">RHTP / year</span>
              <span className="font-semibold text-[color:var(--foreground)]">{allocation}</span>
            </span>
            {kyData?.pills.slice(1).map((pill) => (
              <span key={pill.label} className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--line)] bg-white/75 px-3 py-1.5 text-xs">
                <span className="text-[color:var(--muted)]">{pill.label}</span>
                <span className="font-semibold text-[color:var(--foreground)]">{pill.value}</span>
              </span>
            ))}
            {validState !== "kentucky" && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--line)] bg-white/75 px-3 py-1.5 text-xs">
                <span className="text-[color:var(--muted)]">Source</span>
                <span className="font-semibold text-[color:var(--foreground)]">{config.rhtpSource}</span>
              </span>
            )}
          </div>
        </motion.div>

        {/* ── RHTP Program Context ───────────────────────────── */}
        <motion.div variants={fadeUp} className="rounded-2xl border border-[color:var(--line)] bg-white/90 p-5 shadow-[var(--shadow-soft)]">
          <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">RHTP Program</p>
          <p className="mt-2 text-sm leading-relaxed text-[color:var(--foreground)]">
            {config.name} received a first-year RHTP allocation of {allocation} (CMS, Dec 29, 2025).
            The program provides {RHTP_PROGRAM.totalFunding} under {RHTP_PROGRAM.statutoryBasis}, administered by the {RHTP_PROGRAM.adminBody}.
          </p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">
            {RHTP_PROGRAM.nationalHospitalClosures} rural hospitals have completely closed since 2005
            ({RHTP_PROGRAM.nationalClosuresSource}).
          </p>
        </motion.div>

        {/* ── State-specific validated stats ──────────────────── */}
        {validState === "kentucky" && (
          <motion.div variants={fadeUp} className="space-y-3">
            <div className="rounded-xl border border-[color:var(--line)] bg-white/75 p-4">
              <p className="text-sm text-[color:var(--foreground)]">{KY_STATS.maternityDesert}</p>
              <p className="mt-1 text-xs text-[color:var(--muted)]">Source: {KY_STATS.maternitySource}</p>
            </div>
            <div className="rounded-xl border border-[color:var(--line)] bg-white/75 p-4">
              <p className="text-sm text-[color:var(--foreground)]">{KY_STATS.paramedicConcentration}</p>
              <p className="mt-1 text-xs text-[color:var(--muted)]">Source: {KY_STATS.paramedicSource}</p>
            </div>
            <div className="rounded-xl border border-[color:var(--line)] bg-white/75 p-4">
              <p className="text-sm text-[color:var(--foreground)]">BEAD allocation: {KY_STATS.beadAllocation}, targeting {KY_STATS.beadLocations}</p>
              <p className="mt-1 text-xs text-[color:var(--muted)]">Source: {KY_STATS.beadSource}</p>
            </div>
          </motion.div>
        )}

        {validState === "alaska" && (
          <motion.div variants={fadeUp} className="space-y-3">
            <div className="rounded-xl border border-[color:var(--line)] bg-white/75 p-4">
              <p className="text-sm text-[color:var(--foreground)]">{AK_STATS.rhtpPlanFocus}</p>
              <p className="mt-1 text-xs text-[color:var(--muted)]">Source: {AK_STATS.rhtpSource}</p>
            </div>
            <div className="rounded-xl border border-[color:var(--line)] bg-white/75 p-4">
              <p className="text-sm text-[color:var(--foreground)]">BEAD allocation: {AK_STATS.beadAllocation}</p>
              <p className="text-sm text-[color:var(--foreground)]">{AK_STATS.beadTimeline}</p>
              <p className="mt-1 text-xs text-[color:var(--muted)]">Source: {AK_STATS.beadSource}</p>
            </div>
          </motion.div>
        )}

        {validState === "texas" && (
          <motion.div variants={fadeUp} className="space-y-3">
            <div className="rounded-xl border border-[color:var(--line)] bg-white/75 p-4">
              <p className="text-sm text-[color:var(--foreground)]">{TX_STATS.hospitalClosures}</p>
              <p className="mt-1 text-xs text-[color:var(--muted)]">Source: {TX_STATS.closuresSource}</p>
            </div>
            <div className="rounded-xl border border-[color:var(--line)] bg-white/75 p-4">
              <p className="text-sm text-[color:var(--foreground)]">{TX_STATS.rhtpPlan}</p>
              <p className="text-sm text-[color:var(--foreground)]">{TX_STATS.rhtpInitiatives}</p>
              <p className="mt-1 text-xs text-[color:var(--muted)]">Source: {TX_STATS.rhtpSource}</p>
            </div>
            <div className="rounded-xl border border-[color:var(--line)] bg-white/75 p-4">
              <p className="text-sm text-[color:var(--foreground)]">{TX_STATS.trinityCounty}</p>
              <p className="mt-1 text-xs text-[color:var(--muted)]">Source: {TX_STATS.trinitySource}</p>
            </div>
          </motion.div>
        )}

        {/* ── Quick Links ────────────────────────────────────── */}
        <motion.div variants={fadeUp}>
          <p className="mb-3 text-xs uppercase tracking-wider text-[color:var(--muted)]">Modules</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-start gap-3 rounded-2xl border border-[color:var(--line)] bg-white/80 p-4 transition-all hover:border-[color:var(--foreground)]/20 hover:shadow-md"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color:var(--surface-soft)]">
                    <Icon className="h-4 w-4 text-[color:var(--muted)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[color:var(--foreground)]">{link.label}</p>
                    <p className="mt-0.5 text-xs text-[color:var(--muted)]">{link.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[color:var(--muted)] transition-transform group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
