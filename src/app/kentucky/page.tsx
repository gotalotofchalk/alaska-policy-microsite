"use client";

import { motion } from "framer-motion";
import { ArrowRight, Info, Radio, Satellite, Wifi, WifiOff } from "lucide-react";
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
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function KentuckyOverview() {
  const fSummary = getKYFacilitySummary();
  const bdcSummary = getKYBDCSummary();
  const costs = STARLINK_PRICING.getEffectiveCosts();

  /* Phase 2: cost to connect all unserved facilities */
  const facilityTerminalCost =
    fSummary.unserved * costs.yearOneTotalPerUnit;
  const facilityCommunityEquipCost =
    fSummary.unserved * COVERAGE_MODEL.communityDistributionModel.localDistributionCostPerSite;
  const phase2TotalYearOne = facilityTerminalCost + facilityCommunityEquipCost;
  const phase2PctOfRhtp = ((phase2TotalYearOne / KY_RHTP.annualAllocation) * 100).toFixed(2);

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
            Kentucky Broadband Infrastructure Analysis
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.15] text-[color:var(--foreground)] md:text-5xl">
            Before interventions work, infrastructure must exist.
          </h1>
          <p className="mt-4 flex items-center gap-1.5 text-base text-[color:var(--muted)]">
            Map the broadband gap. Model what it costs to close it.
            <span title="Kentucky's $212.9M RHTP allocation funds telehealth, RPM, and clinical AI — none of which work without broadband." className="cursor-help text-[color:var(--muted)] hover:text-[color:var(--foreground)]">
              <Info className="h-3.5 w-3.5" />
            </span>
          </p>
        </motion.div>

        {/* ── Key Stats Row ──────────────────────────────────── */}
        <motion.div
          variants={stagger}
          className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          <motion.div variants={fadeUp}>
            <StatCard label="RHTP/year" value={`$${Math.round(KY_RHTP.annualAllocation / 1e6)}M`} />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatCard label="Healthcare facilities" value={String(fSummary.total)} />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatCard label="Without broadband" value={String(fSummary.unserved)} accent />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatCard label="Rural population" value={`${(KY_CONTEXT.ruralPopulation / 1e6).toFixed(1)}M`} />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ── Phase 1: Current State ────────────────────────────── */}
      <motion.section
        className="surface-card rounded-[2rem] p-6 md:p-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[color:var(--foreground)]">
            <span className="text-xs font-bold text-white">1</span>
          </div>
          <p className="text-sm font-medium uppercase tracking-wider text-[color:var(--foreground)]">
            Current state: who has broadband?
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Facility breakdown */}
          <div className="space-y-4">
            <p className="text-sm text-[color:var(--muted)]">
              <span className="font-medium text-[color:var(--accent)]">{fSummary.unserved}</span> of {fSummary.total} facilities lack broadband at {COVERAGE_MODEL.broadbandThreshold.label}.
            </p>

            <div className="space-y-2">
              <FacilityBar
                label="Hospitals"
                served={fSummary.byType.hospital.served}
                unserved={fSummary.byType.hospital.unserved}
              />
              <FacilityBar
                label="Critical Access Hospitals"
                served={fSummary.byType.cah.served}
                unserved={fSummary.byType.cah.unserved}
              />
              <FacilityBar
                label="FQHCs"
                served={fSummary.byType.fqhc.served}
                unserved={fSummary.byType.fqhc.unserved}
              />
              <FacilityBar
                label="Rural Health Clinics"
                served={fSummary.byType.rhc.served}
                unserved={fSummary.byType.rhc.unserved}
              />
            </div>
          </div>

          {/* County broadband summary (FCC BDC) */}
          <div className="rounded-[1.4rem] border border-[color:var(--line)] bg-white/75 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
              Broadband availability (FCC BDC)
            </p>
            <div className="mt-4 space-y-2">
              <BDCBar label="Served (100/20+)" count={bdcSummary.served} total={bdcSummary.totalBSLs} pct={bdcSummary.pctServed} color="#0f7c86" />
              <BDCBar label="Underserved (25/3–100/20)" count={bdcSummary.underserved} total={bdcSummary.totalBSLs} pct={Math.round(((bdcSummary.underserved) / bdcSummary.totalBSLs) * 1000) / 10} color="#c49a2e" />
              <BDCBar label="Unserved (<25/3)" count={bdcSummary.unserved} total={bdcSummary.totalBSLs} pct={Math.round(((bdcSummary.unserved) / bdcSummary.totalBSLs) * 1000) / 10} color="#c46128" />
            </div>
            <p className="mt-3 text-[10px] text-[color:var(--muted)]">
              {bdcSummary.totalBSLs.toLocaleString()} BSLs across {bdcSummary.totalCounties} counties. Source: FCC BDC Dec 2024.
            </p>
          </div>
        </div>
      </motion.section>

      {/* ── Phase 2: Connect Facilities ───────────────────────── */}
      <motion.section
        className="surface-card rounded-[2rem] p-6 md:p-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[color:var(--teal)]">
            <span className="text-xs font-bold text-white">2</span>
          </div>
          <p className="text-sm font-medium uppercase tracking-wider text-[color:var(--foreground)]">
            Quick win: connect every healthcare facility
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm text-[color:var(--muted)]">
              Deploy Starlink to {fSummary.unserved} unserved facilities + {COVERAGE_MODEL.communityDistributionModel.coverageRadiusMiles}-mile local Wi-Fi distribution.
            </p>
            <p className="mt-3 text-sm text-[color:var(--muted)]">
              Year-one cost:{" "}
              <span className="font-display text-lg font-semibold text-[color:var(--foreground)]">
                ${Math.round(phase2TotalYearOne).toLocaleString()}
              </span>{" "}
              <span className="text-xs">({phase2PctOfRhtp}% of RHTP allocation)</span>
            </p>
          </div>

          <div className="space-y-3">
            <CostBreakdown
              label="Starlink terminals"
              count={fSummary.unserved}
              perUnit={costs.yearOneTotalPerUnit}
              total={facilityTerminalCost}
              icon={<Satellite className="h-4 w-4" />}
            />
            <CostBreakdown
              label="Local distribution equipment"
              count={fSummary.unserved}
              perUnit={COVERAGE_MODEL.communityDistributionModel.localDistributionCostPerSite}
              total={facilityCommunityEquipCost}
              icon={<Radio className="h-4 w-4" />}
            />
            <PricingDisclaimer
              discountPct={costs.discountPct}
              planName={costs.planName}
              retailHardware={costs.retailHardware}
              retailMonthly={costs.retailMonthly}
              compact
            />
          </div>
        </div>
      </motion.section>

      {/* ── Phase 3: Full Coverage ────────────────────────────── */}
      <motion.section
        className="surface-card rounded-[2rem] p-6 md:p-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[color:var(--accent)]">
            <span className="text-xs font-bold text-white">3</span>
          </div>
          <p className="text-sm font-medium uppercase tracking-wider text-[color:var(--foreground)]">
            Full coverage: reaching every unserved household
          </p>
        </div>

        <div className="mt-6">
          <p className="max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
            {bdcSummary.beadEligible.toLocaleString()} BEAD-eligible BSLs remain across {bdcSummary.totalCounties} counties.
            Model additional terminal placements in the satellite planner.
          </p>

          <Link
            href="/kentucky/satellite-planner"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[color:var(--foreground)] px-6 py-3 text-sm text-white transition-colors hover:bg-[color:#223a54]"
          >
            Open Satellite Planner
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.section>

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
      <p className={`mt-1 font-display text-2xl ${accent ? "text-[color:var(--accent)]" : "text-[color:var(--foreground)]"}`}>
        {value}
      </p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-[color:var(--muted)]">{label}</p>
      <p className="mt-0.5 font-display text-lg text-[color:var(--foreground)]">{value}</p>
    </div>
  );
}

function FacilityBar({ label, served, unserved }: { label: string; served: number; unserved: number }) {
  const total = served + unserved;
  const servedPct = total > 0 ? (served / total) * 100 : 0;

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-[color:var(--foreground)]">{label}</span>
        <span className="text-xs text-[color:var(--muted)]">
          <Wifi className="mr-1 inline h-3 w-3 text-[color:var(--teal)]" />
          {served}
          <span className="mx-1.5 text-[color:var(--line)]">/</span>
          <WifiOff className="mr-1 inline h-3 w-3 text-[color:var(--accent)]" />
          {unserved}
        </span>
      </div>
      <div className="mt-1 flex h-2 overflow-hidden rounded-full bg-[color:#efe8db]">
        <div
          className="h-full rounded-full bg-[color:var(--teal)] transition-all duration-500"
          style={{ width: `${servedPct}%` }}
        />
        <div
          className="h-full bg-[color:var(--accent)] transition-all duration-500"
          style={{ width: `${100 - servedPct}%` }}
        />
      </div>
    </div>
  );
}

function CostBreakdown({
  label,
  count,
  perUnit,
  total,
  icon,
}: {
  label: string;
  count: number;
  perUnit: number;
  total: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[color:var(--line)] bg-white/75 p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[color:var(--foreground)] text-white">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[color:var(--foreground)]">{label}</p>
        <p className="text-xs text-[color:var(--muted)]">
          {count} units &times; ${perUnit.toLocaleString()} = ${Math.round(total).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function BDCBar({ label, count, total, pct, color }: { label: string; count: number; total: number; pct: number; color: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="text-[color:var(--foreground)]">{label}</span>
        <span className="font-display text-sm font-semibold" style={{ color }}>{pct}%</span>
      </div>
      <div className="mt-1 flex h-2 overflow-hidden rounded-full bg-[color:#efe8db]">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <p className="mt-0.5 text-[10px] text-[color:var(--muted)]">{count.toLocaleString()} BSLs</p>
    </div>
  );
}
