"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Info, Radio, Satellite, Wifi, WifiOff, Zap } from "lucide-react";
import Link from "next/link";

import { COVERAGE_MODEL, KY_CONTEXT, KY_RHTP, STARLINK_PRICING } from "@/data/kentucky-config";
import { getKYFacilitySummary } from "@/data/kentucky-facilities";
import { getKYBDCSummary } from "@/data/kentucky-broadband-availability";
import { PricingDisclaimer } from "@/components/kentucky/pricing-disclaimer";

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
/*  Connectivity Budget data                                           */
/* ------------------------------------------------------------------ */

const BANDWIDTH_TIERS = [
  { speed: "100+ Mbps", label: "Full family", detail: "Telehealth + streaming + multiple devices + remote monitoring", color: "#0f7c86" },
  { speed: "25–100 Mbps", label: "Clinical", detail: "Telehealth visits + EHR access + basic remote monitoring", color: "#3a9ca5" },
  { speed: "10–25 Mbps", label: "Minimal", detail: "Single telehealth session OR remote patient monitoring", color: "#c49a2e" },
  { speed: "<10 Mbps", label: "Insufficient", detail: "Unreliable for clinical use", color: "#c46128" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function KentuckyOverview() {
  const fSummary = getKYFacilitySummary();
  const bdcSummary = getKYBDCSummary();
  const costs = STARLINK_PRICING.getEffectiveCosts();

  /* Phase 2: cost to connect all unserved facilities */
  const phase2TotalYearOne =
    fSummary.unserved * costs.yearOneTotalPerUnit +
    fSummary.unserved * COVERAGE_MODEL.communityDistributionModel.localDistributionCostPerSite;
  const phase2PctOfRhtp = ((phase2TotalYearOne / KY_RHTP.annualAllocation) * 100).toFixed(2);

  const pctUnderserved = Math.round((bdcSummary.underserved / bdcSummary.totalBSLs) * 1000) / 10;
  const pctUnserved = Math.round((bdcSummary.unserved / bdcSummary.totalBSLs) * 1000) / 10;

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <motion.section
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex flex-col"
      >
        <motion.div variants={fadeUp}>
          <p className="text-[0.72rem] uppercase tracking-[0.34em] text-[color:var(--muted)]">
            Kentucky Broadband Infrastructure
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.1] text-[color:var(--foreground)] md:text-5xl">
            Map the gap. Close it.
          </h1>
        </motion.div>

        {/* ── Hero Stats — big display numbers ────────────────── */}
        <motion.div
          variants={stagger}
          className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          <motion.div variants={fadeUp}>
            <StatCard label="RHTP / year" value={`$${Math.round(KY_RHTP.annualAllocation / 1e6)}M`} />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatCard label="Facilities tracked" value={String(fSummary.total)} />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatCard label="Without broadband" value={String(fSummary.unserved)} accent />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatCard label="Rural population" value={`${(KY_CONTEXT.ruralPopulation / 1e6).toFixed(1)}M`} />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ── BDC Summary — three big percentages ───────────────── */}
      <motion.section
        className="surface-card rounded-[2rem] p-6 md:p-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
      >
        <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
          Broadband availability
        </p>
        <div className="mt-5 grid grid-cols-3 gap-4 text-center">
          <BigPct value={bdcSummary.pctServed} label="Served" sub="100/20+ Mbps" color="#0f7c86" />
          <BigPct value={pctUnderserved} label="Underserved" sub="25/3 – 100/20" color="#c49a2e" />
          <BigPct value={pctUnserved} label="Unserved" sub="< 25/3 Mbps" color="#c46128" />
        </div>
        <p className="mt-4 text-center text-[10px] text-[color:var(--muted)]">
          FCC BDC Dec 2024 · {bdcSummary.totalBSLs.toLocaleString()} locations across {bdcSummary.totalCounties} counties
        </p>
      </motion.section>

      {/* ── Phase Cards ───────────────────────────────────────── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-3"
      >
        {/* Phase 1: Facility Coverage */}
        <motion.div variants={fadeUp}>
          <PhaseCard
            phase={1}
            color="var(--foreground)"
            label="Healthcare Facility Coverage"
            stat={
              <>
                <span className="text-[color:var(--accent)]">{fSummary.unserved}</span>
                <span className="text-[color:var(--muted)]"> of {fSummary.total} offline</span>
              </>
            }
          >
            <div className="mt-4 space-y-1.5">
              <FacilityBar label="Hospitals" served={fSummary.byType.hospital.served} unserved={fSummary.byType.hospital.unserved} />
              <FacilityBar label="CAHs" served={fSummary.byType.cah.served} unserved={fSummary.byType.cah.unserved} />
              <FacilityBar label="FQHCs" served={fSummary.byType.fqhc.served} unserved={fSummary.byType.fqhc.unserved} />
              <FacilityBar label="RHCs" served={fSummary.byType.rhc.served} unserved={fSummary.byType.rhc.unserved} />
            </div>
          </PhaseCard>
        </motion.div>

        {/* Phase 2: Satellite Cost Modeling */}
        <motion.div variants={fadeUp}>
          <PhaseCard
            phase={2}
            color="var(--teal)"
            label="Satellite Cost Modeling"
            stat={
              <>
                <span>${Math.round(phase2TotalYearOne).toLocaleString()}</span>
                <span className="text-sm font-normal text-[color:var(--muted)]"> year-one</span>
              </>
            }
            info={`Deploy Starlink to ${fSummary.unserved} facilities + local Wi-Fi. ${phase2PctOfRhtp}% of RHTP allocation.`}
          >
            <div className="mt-4 space-y-2">
              <CostBreakdown
                label="Starlink terminals"
                count={fSummary.unserved}
                perUnit={costs.yearOneTotalPerUnit}
                total={fSummary.unserved * costs.yearOneTotalPerUnit}
                icon={<Satellite className="h-3.5 w-3.5" />}
              />
              <CostBreakdown
                label="Distribution equipment"
                count={fSummary.unserved}
                perUnit={COVERAGE_MODEL.communityDistributionModel.localDistributionCostPerSite}
                total={fSummary.unserved * COVERAGE_MODEL.communityDistributionModel.localDistributionCostPerSite}
                icon={<Radio className="h-3.5 w-3.5" />}
              />
              <PricingDisclaimer
                discountPct={costs.discountPct}
                planName={costs.planName}
                retailHardware={costs.retailHardware}
                retailMonthly={costs.retailMonthly}
                compact
              />
            </div>
          </PhaseCard>
        </motion.div>

        {/* Phase 3: Full Household Coverage */}
        <motion.div variants={fadeUp}>
          <Link href="/kentucky/satellite-planner" className="block h-full">
            <PhaseCard
              phase={3}
              color="var(--accent)"
              label="Full Household Coverage"
              stat={
                <>
                  <span>{bdcSummary.beadEligible.toLocaleString()}</span>
                  <span className="text-sm font-normal text-[color:var(--muted)]"> BSLs remaining</span>
                </>
              }
              clickable
            >
              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[color:var(--foreground)]">
                Open Satellite Planner
                <ArrowRight className="h-4 w-4" />
              </div>
            </PhaseCard>
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Connectivity Budget Translator ─────────────────────── */}
      <ConnectivityBudget />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-[1.4rem] border border-[color:var(--line)] bg-white/75 p-4">
      <p className="text-[10px] uppercase tracking-wider text-[color:var(--muted)]">{label}</p>
      <p className={`mt-1 font-display text-3xl ${accent ? "text-[color:var(--accent)]" : "text-[color:var(--foreground)]"}`}>
        {value}
      </p>
    </div>
  );
}

function BigPct({ value, label, sub, color }: { value: number; label: string; sub: string; color: string }) {
  return (
    <div>
      <p className="font-display text-4xl font-semibold md:text-5xl" style={{ color }}>{value}%</p>
      <p className="mt-1 text-sm font-medium text-[color:var(--foreground)]">{label}</p>
      <p className="text-[10px] text-[color:var(--muted)]">{sub}</p>
    </div>
  );
}

function PhaseCard({
  phase, color, label, stat, info, clickable, children,
}: {
  phase: number;
  color: string;
  label: string;
  stat: React.ReactNode;
  info?: string;
  clickable?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={`surface-card flex h-full flex-col rounded-[1.6rem] border p-5 transition-all ${clickable ? "cursor-pointer hover:shadow-lg hover:scale-[1.01]" : ""}`}>
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: color }}>
          <span className="text-xs font-bold text-white">{phase}</span>
        </div>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--foreground)]">{label}</p>
        {info && (
          <span title={info} className="ml-auto cursor-help text-[color:var(--muted)] hover:text-[color:var(--foreground)]">
            <Info className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-2xl font-semibold text-[color:var(--foreground)]">{stat}</p>
      {children}
    </div>
  );
}

function FacilityBar({ label, served, unserved }: { label: string; served: number; unserved: number }) {
  const total = served + unserved;
  const servedPct = total > 0 ? (served / total) * 100 : 0;

  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-[color:var(--foreground)]">{label}</span>
        <span className="text-[10px] text-[color:var(--muted)]">
          <Wifi className="mr-0.5 inline h-3 w-3 text-[color:var(--teal)]" />{served}
          <span className="mx-1 text-[color:var(--line)]">/</span>
          <WifiOff className="mr-0.5 inline h-3 w-3 text-[color:var(--accent)]" />{unserved}
        </span>
      </div>
      <div className="mt-0.5 flex h-1.5 overflow-hidden rounded-full bg-[color:#efe8db]">
        <div className="h-full rounded-full bg-[color:var(--teal)]" style={{ width: `${servedPct}%` }} />
        <div className="h-full bg-[color:var(--accent)]" style={{ width: `${100 - servedPct}%` }} />
      </div>
    </div>
  );
}

function CostBreakdown({
  label, count, perUnit, total, icon,
}: {
  label: string; count: number; perUnit: number; total: number; icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-[color:var(--line)] bg-white/75 p-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[color:var(--foreground)] text-white">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-[color:var(--foreground)]">{label}</p>
        <p className="text-[10px] text-[color:var(--muted)]">
          {count} × ${perUnit.toLocaleString()} = ${Math.round(total).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function ConnectivityBudget() {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="surface-card rounded-[2rem] border p-5 md:p-6"
    >
      <button
        type="button"
        onClick={() => setExpanded((p) => !p)}
        className="flex w-full items-center gap-2 text-left"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[color:var(--foreground)]">
          <Zap className="h-3.5 w-3.5 text-white" />
        </div>
        <p className="flex-1 text-xs font-medium uppercase tracking-wider text-[color:var(--foreground)]">
          Connectivity budget
        </p>
        <span className="text-[10px] text-[color:var(--muted)]">
          {expanded ? "Collapse" : "What does bandwidth mean in practice?"}
        </span>
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 grid gap-2 sm:grid-cols-2"
        >
          {BANDWIDTH_TIERS.map((tier) => (
            <div key={tier.speed} className="flex items-start gap-3 rounded-xl border border-[color:var(--line)] bg-white/75 p-3">
              <span className="mt-0.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: tier.color }} />
              <div>
                <p className="text-sm font-semibold text-[color:var(--foreground)]">{tier.speed}</p>
                <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: tier.color }}>{tier.label}</p>
                <p className="mt-0.5 text-xs text-[color:var(--muted)]">{tier.detail}</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </motion.section>
  );
}
