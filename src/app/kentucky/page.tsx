"use client";

import { motion } from "framer-motion";
import { ArrowRight, Radio, Satellite, Wifi, WifiOff } from "lucide-react";
import Link from "next/link";

import { COVERAGE_MODEL, KY_CONTEXT, KY_RHTP, STARLINK_PRICING } from "@/data/kentucky-config";
import { getKYFacilitySummary } from "@/data/kentucky-facilities";
import { getKYBroadbandSummary } from "@/data/kentucky-broadband-data";
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
  const bSummary = getKYBroadbandSummary();
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
          <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--muted)]">
            Kentucky&apos;s $212.9M annual RHTP allocation funds telehealth, RPM,
            and clinical AI tools. But none of these work without broadband.
            This analysis maps the gap and models what it costs to close it.
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
            <p className="text-sm leading-7 text-[color:var(--muted)]">
              Of {fSummary.total} tracked healthcare facilities in Kentucky,{" "}
              <span className="font-medium text-[color:var(--accent)]">
                {fSummary.unserved} ({fSummary.unservedPct}%)
              </span>{" "}
              lack adequate broadband at the {COVERAGE_MODEL.broadbandThreshold.label} threshold.
              These facilities cannot support telehealth, remote patient monitoring,
              or electronic health record integration.
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

          {/* County broadband summary */}
          <div className="rounded-[1.4rem] border border-[color:var(--line)] bg-white/75 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
              County-level broadband coverage
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <MiniStat label="Counties tracked" value={String(bSummary.countiesTracked)} />
              <MiniStat label="Avg served rate" value={`${bSummary.avgServedPct}%`} />
              <MiniStat label="Unserved households" value={bSummary.totalUnserved.toLocaleString()} />
              <MiniStat label="Population affected" value={bSummary.totalPop.toLocaleString()} />
            </div>
            <p className="mt-4 text-xs leading-5 text-[color:var(--muted)]">
              Source: U.S. Census Bureau, ACS 2023 5-Year Estimates (Table B28002).
              Measures broadband adoption; actual availability gaps may be larger.
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
            <p className="text-sm leading-7 text-[color:var(--muted)]">
              Deploying Starlink terminals to all {fSummary.unserved} unserved
              facilities provides immediate broadband access for telehealth and RPM.
              When paired with local Wi-Fi distribution equipment, each facility
              also extends coverage to surrounding households within a{" "}
              {COVERAGE_MODEL.communityDistributionModel.coverageRadiusMiles}-mile radius.
            </p>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
              Estimated year-one cost:{" "}
              <span className="font-display text-lg font-semibold text-[color:var(--foreground)]">
                ${Math.round(phase2TotalYearOne).toLocaleString()}
              </span>{" "}
              ({phase2PctOfRhtp}% of Kentucky&apos;s annual RHTP allocation).
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
            After connecting all healthcare facilities, an estimated{" "}
            {bSummary.totalUnserved.toLocaleString()} households across{" "}
            {bSummary.countiesTracked} counties remain without adequate broadband.
            The interactive satellite planner lets you model additional terminal
            placements to extend coverage to remaining population clusters.
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

      {/* ── BEAD Context ──────────────────────────────────────── */}
      <motion.section
        className="grid gap-4 sm:grid-cols-3"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeUp}>
          <ContextCard
            label="BEAD allocation"
            value="$1.1B"
            note="Kentucky's federal broadband investment. 25% designated for LEO satellite covering ~21,600 locations."
          />
        </motion.div>
        <motion.div variants={fadeUp}>
          <ContextCard
            label="Starlink pilot"
            value="95%"
            note="Satisfaction rating from 2022 Bell/Martin County pilot (60 households, 12 months free service)."
          />
        </motion.div>
        <motion.div variants={fadeUp}>
          <ContextCard
            label="Maternity deserts"
            value="40"
            note="Kentucky counties without adequate maternity care. Telehealth requires broadband first."
          />
        </motion.div>
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

function ContextCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <article className="surface-card rounded-[1.7rem] border p-5">
      <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[color:var(--muted)]">{label}</p>
      <p className="mt-3 font-display text-[2.2rem] leading-none text-[color:var(--foreground)]">{value}</p>
      <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{note}</p>
    </article>
  );
}
