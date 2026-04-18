"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  DollarSign,
  Hospital,
  MapPin,
  Network,
  Shield,
  Stethoscope,
  Users,
  Wifi,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { STATE_CONFIGS, RHTP_PROGRAM, type ValidState } from "@/config/states";
import { KY_CONTEXT } from "@/data/kentucky-config";
import { getKYBDCSummary } from "@/data/kentucky-broadband-availability";
import { getKYFacilitySummary } from "@/data/kentucky-facilities";
import { ModuleSources } from "@/components/module-sources";

/* ------------------------------------------------------------------ */
/*  Animation                                                          */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

/* ------------------------------------------------------------------ */
/*  Stat card                                                          */
/* ------------------------------------------------------------------ */

function StatCard({
  icon: Icon,
  value,
  label,
  accent,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--line)] bg-white/90 p-5 shadow-[var(--shadow-soft)]">
      <Icon className="h-5 w-5" style={{ color: accent ?? "var(--muted)" }} />
      <p className="mt-3 font-display text-2xl font-semibold text-[color:var(--foreground)]">{value}</p>
      <p className="mt-1 text-xs text-[color:var(--muted)]">{label}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Progress ring (SVG donut)                                          */
/* ------------------------------------------------------------------ */

function ProgressRing({ pct, label, color }: { pct: number; label: string; color: string }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} fill="none" stroke="var(--line)" strokeWidth="6" />
        <circle
          cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 44 44)"
          className="transition-all duration-700"
        />
        <text x="44" y="44" textAnchor="middle" dominantBaseline="central"
          className="font-display text-lg font-semibold" fill="var(--foreground)">
          {pct}%
        </text>
      </svg>
      <span className="text-xs text-[color:var(--muted)]">{label}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Highlight chip (short fact, no inline source)                      */
/* ------------------------------------------------------------------ */

function Highlight({ icon: Icon, text, color }: { icon: React.ElementType; text: string; color: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[color:var(--line)] bg-white/80 px-4 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}15` }}>
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <p className="text-sm text-[color:var(--foreground)]">{text}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Module link card                                                   */
/* ------------------------------------------------------------------ */

function ModuleLink({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl border border-[color:var(--line)] bg-white/80 p-4 transition-all hover:border-[color:var(--foreground)]/20 hover:shadow-md"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color:var(--surface-soft)]">
        <Icon className="h-4 w-4 text-[color:var(--muted)]" />
      </div>
      <span className="flex-1 text-sm font-medium text-[color:var(--foreground)]">{label}</span>
      <ArrowRight className="h-4 w-4 text-[color:var(--muted)] transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Sources per state                                                  */
/* ------------------------------------------------------------------ */

const OVERVIEW_SOURCES = {
  kentucky: [
    { name: "CMS RHTP Awards", url: "https://www.cms.gov/rural-health-transformation", detail: "RHTP allocation $212.9M, Dec 29, 2025" },
    { name: "NTIA BEAD Program", url: "https://broadbandusa.ntia.gov/", detail: "KY BEAD $1.086B, targeting 86,400 locations" },
    { name: "KY RHTP Application", detail: "Maternity desert data, paramedic concentration" },
    { name: "FCC Broadband Data Collection", url: "https://broadbandmap.fcc.gov/", detail: "County-level BSL served/underserved/unserved" },
    { name: "Cecil G. Sheps Center", url: "https://www.shepscenter.unc.edu/programs-projects/rural-health/rural-hospital-closures/", detail: "109 rural hospital closures since 2005" },
  ],
  alaska: [
    { name: "CMS RHTP Awards", url: "https://www.cms.gov/rural-health-transformation", detail: "RHTP allocation $272.17M, Dec 29, 2025" },
    { name: "NTIA BEAD Program", url: "https://broadbandusa.ntia.gov/", detail: "AK BEAD $1.017B, 29 projects" },
    { name: "Alaska DHSS RHTP Application", detail: "Cybersecurity, interoperability, remote modalities focus" },
  ],
  texas: [
    { name: "CMS RHTP Awards", url: "https://www.cms.gov/rural-health-transformation", detail: "RHTP allocation $281.32M, Dec 29, 2025" },
    { name: "Texas HHSC RHTP Application", detail: "Rural Texas Strong, $968M across 6 initiatives" },
    { name: "Cecil G. Sheps Center", url: "https://www.shepscenter.unc.edu/programs-projects/rural-health/rural-hospital-closures/", detail: "TX led nation in rural closures 2010–2020; Trinity County closure 2025" },
  ],
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function OverviewPage() {
  const { state } = useParams<{ state: string }>();
  const s = state as ValidState;
  const config = STATE_CONFIGS[s];
  const alloc = `$${Math.round(config.rhtpAllocation / 1e6)}M`;
  const base = `/${s}`;

  // Kentucky data
  const ky = s === "kentucky" ? (() => {
    const bdc = getKYBDCSummary();
    const f = getKYFacilitySummary();
    return {
      pctServed: bdc.pctServed,
      pctUnserved: Math.round((bdc.unserved / bdc.totalBSLs) * 1000) / 10,
      facilities: f.total,
      needCoverage: f.unserved + f.underserved,
      counties: KY_CONTEXT.totalCounties,
      pop: KY_CONTEXT.totalPopulation,
      sqmi: KY_CONTEXT.totalSquareMiles,
    };
  })() : null;

  return (
    <div className="py-6 lg:py-10">
      <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-8 max-w-6xl">

        {/* ── Title ──────────────────────────────────────────── */}
        <motion.div variants={fadeUp}>
          <h1 className="font-display text-4xl text-[color:var(--foreground)] md:text-5xl">{config.name}</h1>
        </motion.div>

        {/* ── Key metrics row ────────────────────────────────── */}
        <motion.div variants={fadeUp} className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatCard icon={DollarSign} value={alloc} label="RHTP annual allocation" accent="var(--teal)" />
          {s === "kentucky" && ky && (
            <>
              <StatCard icon={MapPin} value={String(ky.counties)} label="Counties" accent="var(--accent)" />
              <StatCard icon={Users} value={ky.pop.toLocaleString("en-US")} label="Population" />
              <StatCard icon={Hospital} value={String(ky.facilities)} label="Healthcare facilities" accent="#2b7ab8" />
            </>
          )}
          {s !== "kentucky" && (
            <>
              <StatCard icon={Hospital} value="—" label="Facilities — data pending" />
              <StatCard icon={Users} value="—" label="Population — data pending" />
              <StatCard icon={MapPin} value="—" label="Counties — data pending" />
            </>
          )}
        </motion.div>

        {/* ── Visual indicators (Kentucky broadband rings) ──── */}
        {s === "kentucky" && ky && (
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-8 rounded-2xl border border-[color:var(--line)] bg-white/90 px-6 py-8 shadow-[var(--shadow-soft)]">
            <ProgressRing pct={ky.pctServed} label="BSLs served" color="var(--teal)" />
            <ProgressRing pct={100 - ky.pctServed - ky.pctUnserved} label="Underserved" color="#c49a2e" />
            <ProgressRing pct={ky.pctUnserved} label="Unserved" color="var(--accent)" />
            <div className="flex flex-col items-center gap-1">
              <span className="font-display text-3xl font-semibold text-[color:var(--foreground)]">{ky.needCoverage}</span>
              <span className="text-xs text-[color:var(--muted)]">Facilities need coverage</span>
            </div>
          </motion.div>
        )}

        {/* ── National context ───────────────────────────────── */}
        <motion.div variants={fadeUp} className="flex items-center gap-4 rounded-xl border border-[color:var(--line)] bg-white/80 px-5 py-4">
          <span className="font-display text-3xl font-semibold text-[color:var(--accent)]">{RHTP_PROGRAM.nationalHospitalClosures}</span>
          <span className="text-sm text-[color:var(--foreground)]">Rural hospitals closed since 2005</span>
        </motion.div>

        {/* ── State highlights (short chips, no inline sources) ── */}
        <motion.div variants={fadeUp} className="space-y-2">
          {s === "kentucky" && (
            <>
              <Highlight icon={Stethoscope} text="1 in 6 women of childbearing age in a maternity desert — 4x national average" color="var(--accent)" />
              <Highlight icon={Users} text="Nearly half of paramedics concentrated in just 5 counties" color="#2b7ab8" />
              <Highlight icon={Wifi} text="BEAD allocation: $1.086B targeting 86,400 locations" color="var(--teal)" />
            </>
          )}
          {s === "alaska" && (
            <>
              <Highlight icon={Wifi} text="BEAD: $1.017B — 29 projects, 70% connected by year 3" color="var(--teal)" />
              <Highlight icon={Shield} text="RHTP focus: cybersecurity, interoperability, remote modalities" color="#2b7ab8" />
            </>
          )}
          {s === "texas" && (
            <>
              <Highlight icon={Hospital} text="Led nation in rural hospital closures 2010–2020" color="var(--accent)" />
              <Highlight icon={Hospital} text="Trinity County: nearest hospital now 30 miles away (2025 closure)" color="#c46128" />
              <Highlight icon={DollarSign} text="Rural Texas Strong: $968M across 6 initiatives" color="var(--teal)" />
            </>
          )}
        </motion.div>

        {/* ── Module links ───────────────────────────────────── */}
        <motion.div variants={fadeUp}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <ModuleLink href={`${base}/need`} label="Need Assessment" icon={Stethoscope} />
            <ModuleLink href={`${base}/connectivity`} label="Connectivity" icon={Wifi} />
            <ModuleLink href={`${base}/capacity`} label="Capacity & Readiness" icon={Shield} />
            <ModuleLink href={`${base}/portfolio`} label="Interventions" icon={Network} />
            <ModuleLink href={`${base}/benchmarks`} label="Benchmarks" icon={BarChart3} />
          </div>
        </motion.div>

        {/* ── Sources (collapsed at bottom) ───────────────────── */}
        <ModuleSources sources={OVERVIEW_SOURCES[s]} module="State Overview" />

      </motion.div>
    </div>
  );
}
