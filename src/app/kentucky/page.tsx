"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowRight, Info, Radio, Satellite, Shield, ShieldCheck, Wifi, WifiOff, Zap } from "lucide-react";
import Link from "next/link";

import { COVERAGE_MODEL, KY_CONTEXT, KY_RHTP, STARLINK_PRICING } from "@/data/kentucky-config";
import { getKYFacilitySummary } from "@/data/kentucky-facilities";
import { getKYBDCSummary } from "@/data/kentucky-broadband-availability";
import { AnimatedNumber, parseStatValue } from "@/components/animated-number";
import { ScrollReveal } from "@/components/scroll-reveal";

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
  { speed: "100+ Mbps", label: "Full family", detail: "Telehealth + streaming + multiple devices + remote monitoring", color: "#0f7c86", barPct: 100 },
  { speed: "25–100 Mbps", label: "Clinical", detail: "Telehealth visits + EHR access + basic remote monitoring", color: "#3a9ca5", barPct: 62 },
  { speed: "10–25 Mbps", label: "Minimal", detail: "Single telehealth session OR remote patient monitoring", color: "#c49a2e", barPct: 25 },
  { speed: "<10 Mbps", label: "Insufficient", detail: "Unreliable for clinical use", color: "#c46128", barPct: 10 },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function KentuckyOverview() {
  const fSummary = getKYFacilitySummary();
  const bdcSummary = getKYBDCSummary();
  const costs = STARLINK_PRICING.getEffectiveCosts();

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
            Kentucky Broadband &amp; Satellite Planning
          </h1>
        </motion.div>

        {/* ── Hero Stats — animated count-up numbers ───────────── */}
        <motion.div
          variants={stagger}
          className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {[
            { label: "State allocation / year", value: `$${Math.round(KY_RHTP.annualAllocation / 1e6)}M`, tip: "Kentucky's annual Rural Health Transformation Program (RHTP) allocation from CMS. Funds telehealth, remote monitoring, and clinical AI." },
            { label: "Facilities tracked", value: String(fSummary.total), tip: "Hospitals, critical access hospitals, federally qualified health centers, and rural health clinics across Kentucky." },
            { label: "Need coverage", value: String(fSummary.needsCoverage), accent: true, tip: "Healthcare facilities classified as underserved or unserved — lacking reliable broadband for telehealth and electronic health records." },
            { label: "Rural population", value: `${(KY_CONTEXT.ruralPopulation / 1e6).toFixed(1)}M` },
          ].map((card, i) => (
            <motion.div key={card.label} variants={fadeUp}>
              <AnimatedStatCard label={card.label} value={card.value} accent={card.accent} delay={i * 0.1} tip={card.tip} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ── Statewide Broadband Coverage ─────────────────────── */}
      <ScrollReveal scaleFrom={0.94}>
        <div className="surface-card rounded-[2rem] p-6 md:p-8">
          <div className="flex items-center gap-1.5">
            <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
              Statewide broadband coverage
            </p>
            <InfoTip text="Percentage of all homes and businesses in Kentucky where broadband internet at the given speed is available from at least one provider. Source: FCC Broadband Data Collection, December 2024." />
          </div>
          <p className="mt-1 text-[10px] text-[color:var(--muted)]">
            {bdcSummary.totalBSLs.toLocaleString()} homes &amp; businesses across {bdcSummary.totalCounties} counties
          </p>
          <div className="mt-5 grid grid-cols-3 gap-4 text-center">
            <BigPct
              value={bdcSummary.pctServed}
              count={bdcSummary.served}
              label="Served"
              sub="Reliable broadband (100/20+ Mbps)"
              color="#0f7c86"
              delay={0}
            />
            <BigPct
              value={pctUnderserved}
              count={bdcSummary.underserved}
              label="Underserved"
              sub="Slow broadband (25/3 – 100/20 Mbps)"
              color="#c49a2e"
              delay={0.15}
            />
            <BigPct
              value={pctUnserved}
              count={bdcSummary.unserved}
              label="Unserved"
              sub="No reliable internet (< 25/3 Mbps)"
              color="#c46128"
              delay={0.3}
            />
          </div>
        </div>
      </ScrollReveal>

      {/* ── Infrastructure Readiness ─────────────────────────── */}
      <ScrollReveal>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Broadband readiness */}
          <div className="surface-card flex items-start gap-4 rounded-[1.6rem] border p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:rgba(15,124,134,0.1)]">
              <Wifi className="h-5 w-5 text-[color:var(--teal)]" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Broadband</p>
              <p className="mt-1 font-display text-2xl font-semibold text-[color:var(--foreground)]">
                {fSummary.servedPct}%
                <span className="ml-1 text-sm font-normal text-[color:var(--muted)]">of facilities connected</span>
              </p>
              <p className="mt-1 text-[10px] text-[color:var(--muted)]">
                {fSummary.served} served · {fSummary.underserved} underserved · {fSummary.unserved} unserved
              </p>
            </div>
          </div>

          {/* Cybersecurity readiness */}
          <div className="surface-card flex items-start gap-4 rounded-[1.6rem] border p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:rgba(156,163,175,0.12)]">
              <Shield className="h-5 w-5 text-[color:#9ca3af]" />
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
                Cybersecurity
                <InfoTip text="Tracks facility enrollment in the Rural Health Resiliency Program — cybersecurity risk assessments, incident response planning, and compliance monitoring. Assessment enrollment is in progress." />
              </p>
              <p className="mt-1 font-display text-2xl font-semibold text-[color:var(--foreground)]">
                {fSummary.cyber.assessed}
                <span className="ml-1 text-sm font-normal text-[color:var(--muted)]">of {fSummary.total} assessed</span>
              </p>
              <p className="mt-1 text-[10px] text-[color:#c49a2e]">
                Assessment enrollment in progress
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* ── Phase Cards — with hover tilt ─────────────────────── */}
      <ScrollReveal>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Phase 1: Facility Coverage */}
          <TiltCard>
            <PhaseCard
              phase={1}
              color="var(--foreground)"
              label="Healthcare Facility Coverage"
              stat={
                <>
                  <span className="text-[color:var(--accent)]">{fSummary.needsCoverage}</span>
                  <span className="text-[color:var(--muted)]"> of {fSummary.total} need coverage</span>
                </>
              }
            >
              <div className="mt-3 flex gap-3 text-center text-[10px]">
                <div><span className="font-display text-lg font-semibold text-[color:var(--teal)]">{fSummary.served}</span><p className="text-[color:var(--muted)]">Served</p></div>
                <div><span className="font-display text-lg font-semibold text-[color:#c49a2e]">{fSummary.underserved}</span><p className="text-[color:var(--muted)]">Underserved</p></div>
                <div><span className="font-display text-lg font-semibold text-[color:var(--accent)]">{fSummary.unserved}</span><p className="text-[color:var(--muted)]">Unserved</p></div>
              </div>
              <div className="mt-3 space-y-1.5">
                <FacilityBar label="Hospitals" served={fSummary.byType.hospital.served} underserved={fSummary.byType.hospital.underserved} unserved={fSummary.byType.hospital.unserved} delay={0} />
                <FacilityBar label="Critical Access" served={fSummary.byType.cah.served} underserved={fSummary.byType.cah.underserved} unserved={fSummary.byType.cah.unserved} delay={0.1} />
                <FacilityBar label="Health Centers" served={fSummary.byType.fqhc.served} underserved={fSummary.byType.fqhc.underserved} unserved={fSummary.byType.fqhc.unserved} delay={0.2} />
                <FacilityBar label="Rural Clinics" served={fSummary.byType.rhc.served} underserved={fSummary.byType.rhc.underserved} unserved={fSummary.byType.rhc.unserved} delay={0.3} />
              </div>
            </PhaseCard>
          </TiltCard>

          {/* Phase 2: Satellite Cost Modeling */}
          <TiltCard>
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
              sub={`${fSummary.unserved} facilities · ${phase2PctOfRhtp}% of annual state allocation`}
            >
              <div className="mt-4 space-y-2">
                <CostBreakdown label="Starlink terminals" count={fSummary.unserved} perUnit={costs.yearOneTotalPerUnit} total={fSummary.unserved * costs.yearOneTotalPerUnit} icon={<Satellite className="h-3.5 w-3.5" />} />
                <CostBreakdown label="Distribution equipment" count={fSummary.unserved} perUnit={COVERAGE_MODEL.communityDistributionModel.localDistributionCostPerSite} total={fSummary.unserved * COVERAGE_MODEL.communityDistributionModel.localDistributionCostPerSite} icon={<Radio className="h-3.5 w-3.5" />} />
              </div>
            </PhaseCard>
          </TiltCard>

          {/* Phase 3: Remaining Coverage Gap */}
          <TiltCard>
            <Link href="/kentucky/satellite-planner" className="block h-full">
              <PhaseCard
                phase={3}
                color="var(--accent)"
                label="Remaining Coverage Gap"
                stat={
                  <>
                    <span>{(bdcSummary.underserved + bdcSummary.unserved).toLocaleString()}</span>
                    <span className="text-sm font-normal text-[color:var(--muted)]"> locations without reliable internet</span>
                  </>
                }
                clickable
              >
                <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
                  <div className="rounded-lg bg-[color:var(--surface-soft)] p-2">
                    <p className="font-display text-lg font-semibold text-[color:#c49a2e]">{bdcSummary.underserved.toLocaleString()}</p>
                    <p className="text-[color:var(--muted)]">Slow internet</p>
                  </div>
                  <div className="rounded-lg bg-[color:var(--surface-soft)] p-2">
                    <p className="font-display text-lg font-semibold text-[color:var(--accent)]">{bdcSummary.unserved.toLocaleString()}</p>
                    <p className="text-[color:var(--muted)]">No internet</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-full bg-[color:var(--foreground)] px-4 py-2 text-xs font-medium text-white transition-transform group-hover:translate-x-1">
                  Plan satellite coverage
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </PhaseCard>
            </Link>
          </TiltCard>
        </div>
      </ScrollReveal>

      {/* ── Connectivity Budget Translator ─────────────────────── */}
      <ScrollReveal>
        <ConnectivityBudget />
      </ScrollReveal>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

/** StatCard with animated count-up */
function AnimatedStatCard({ label, value, accent, delay = 0, tip }: { label: string; value: string; accent?: boolean; delay?: number; tip?: string }) {
  const { prefix, number, suffix } = parseStatValue(value);
  return (
    <div className="rounded-[1.4rem] border border-[color:var(--line)] bg-white/75 p-4">
      <p className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-[color:var(--muted)]">
        {label}
        {tip && <InfoTip text={tip} />}
      </p>
      <p className={`mt-1 font-display text-3xl ${accent ? "text-[color:var(--accent)]" : "text-[color:var(--foreground)]"}`}>
        {prefix}
        <AnimatedNumber
          value={number}
          delay={delay}
          formatFn={(n) => suffix === "M" ? n.toFixed(1) : Math.round(n).toLocaleString()}
        />
        {suffix}
      </p>
    </div>
  );
}

/** BDC percentage with animated count-up and real count */
function BigPct({ value, count, label, sub, color, delay = 0 }: { value: number; count: number; label: string; sub: string; color: string; delay?: number }) {
  return (
    <div>
      <p className="font-display text-4xl font-semibold md:text-5xl" style={{ color }}>
        <AnimatedNumber value={value} delay={delay} formatFn={(n) => n.toFixed(1)} />%
      </p>
      <p className="mt-1 text-sm font-medium text-[color:var(--foreground)]">{label}</p>
      <p className="text-[10px] font-medium" style={{ color }}>{count.toLocaleString()} locations</p>
      <p className="mt-0.5 text-[10px] text-[color:var(--muted)]">{sub}</p>
    </div>
  );
}

/** Inline info tooltip — hover/tap to reveal explanation */
function InfoTip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex cursor-help">
      <Info className="h-3.5 w-3.5 text-[color:var(--muted)] transition-colors group-hover:text-[color:var(--foreground)]" />
      <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-xl bg-[color:var(--foreground)] px-3 py-2 text-[11px] leading-4 text-white opacity-0 shadow-lg transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
        {text}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[color:var(--foreground)]" />
      </span>
    </span>
  );
}

/** Tilt card wrapper — tracks mouse for 3D rotation */
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(0, { stiffness: 300, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 30 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    rotateX.set(Math.max(-5, Math.min(5, (e.clientY - centerY) / 20)));
    rotateY.set(Math.max(-5, Math.min(5, (centerX - e.clientX) / 20)));
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="h-full will-change-transform"
    >
      {children}
    </motion.div>
  );
}

function PhaseCard({
  phase, color, label, stat, sub, clickable, children,
}: {
  phase: number;
  color: string;
  label: string;
  stat: React.ReactNode;
  sub?: string;
  clickable?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={`surface-card flex h-full flex-col rounded-[1.6rem] border p-5 transition-shadow ${clickable ? "cursor-pointer hover:shadow-lg" : ""}`}>
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: color }}>
          <span className="text-xs font-bold text-white">{phase}</span>
        </div>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--foreground)]">{label}</p>
      </div>
      <p className="mt-3 font-display text-2xl font-semibold text-[color:var(--foreground)]">{stat}</p>
      {sub && <p className="mt-0.5 text-[10px] text-[color:var(--muted)]">{sub}</p>}
      {children}
    </div>
  );
}

/** Facility bar with animated three-tier segments */
function FacilityBar({ label, served, underserved, unserved, delay = 0 }: { label: string; served: number; underserved: number; unserved: number; delay?: number }) {
  const total = served + underserved + unserved;
  const servedPct = total > 0 ? (served / total) * 100 : 0;
  const underservedPct = total > 0 ? (underserved / total) * 100 : 0;
  const unservedPct = total > 0 ? (unserved / total) * 100 : 0;

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-[color:var(--foreground)]">{label}</span>
        <span className="text-[10px] text-[color:var(--muted)]">
          {served}<span className="mx-0.5 text-[color:var(--line)]">/</span>{underserved}<span className="mx-0.5 text-[color:var(--line)]">/</span>{unserved}
        </span>
      </div>
      <div className="mt-0.5 flex h-1.5 overflow-hidden rounded-full bg-[color:#efe8db]">
        <motion.div
          className="h-full rounded-l-full bg-[color:var(--teal)]"
          initial={{ width: 0 }}
          animate={{ width: isInView ? `${servedPct}%` : 0 }}
          transition={{ duration: 0.6, delay: delay, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          className="h-full bg-[color:#c49a2e]"
          initial={{ width: 0 }}
          animate={{ width: isInView ? `${underservedPct}%` : 0 }}
          transition={{ duration: 0.6, delay: delay + 0.15, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          className="h-full rounded-r-full bg-[color:var(--accent)]"
          initial={{ width: 0 }}
          animate={{ width: isInView ? `${unservedPct}%` : 0 }}
          transition={{ duration: 0.6, delay: delay + 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
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
    <div className="surface-card rounded-[2rem] border p-5 md:p-6">
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

      <AnimatePresence>
        {expanded && (
          <motion.div
            key="budget-tiers"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {BANDWIDTH_TIERS.map((tier, i) => (
                <motion.div
                  key={tier.speed}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                  className="flex flex-col gap-2 rounded-xl border border-[color:var(--line)] bg-white/75 p-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: tier.color }} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[color:var(--foreground)]">{tier.speed}</p>
                      <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: tier.color }}>{tier.label}</p>
                      <p className="mt-0.5 text-xs text-[color:var(--muted)]">{tier.detail}</p>
                    </div>
                  </div>
                  {/* Speed bar */}
                  <div className="h-1 overflow-hidden rounded-full bg-[color:#efe8db]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: tier.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${tier.barPct}%` }}
                      transition={{ duration: 0.6, delay: i * 0.08 + 0.2, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
