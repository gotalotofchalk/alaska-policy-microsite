"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Baby, Hospital, Stethoscope, Truck, Users } from "lucide-react";
import { useParams } from "next/navigation";

import { STATE_CONFIGS, RHTP_PROGRAM, type ValidState } from "@/config/states";
import { ModuleSources } from "@/components/module-sources";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

/* ------------------------------------------------------------------ */
/*  Visual components                                                  */
/* ------------------------------------------------------------------ */

function BigStat({ value, label, icon: Icon, color }: {
  value: string; label: string; icon: React.ElementType; color: string;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--line)] bg-white/90 p-5 shadow-[var(--shadow-soft)]">
      <Icon className="h-5 w-5" style={{ color }} />
      <p className="mt-3 font-display text-2xl font-semibold text-[color:var(--foreground)]">{value}</p>
      <p className="mt-1 text-xs text-[color:var(--muted)]">{label}</p>
    </div>
  );
}

function HighlightBar({ icon: Icon, text, color }: {
  icon: React.ElementType; text: string; color: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[color:var(--line)] bg-white/80 px-4 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}15` }}>
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <p className="text-sm text-[color:var(--foreground)]">{text}</p>
    </div>
  );
}

function PendingData({ field }: { field: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-dashed border-[color:var(--line)] bg-white/40 px-4 py-3">
      <AlertTriangle className="h-4 w-4 shrink-0 text-[color:#c49a2e]" />
      <p className="text-xs text-[color:var(--muted)]">{field}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sources                                                            */
/* ------------------------------------------------------------------ */

const NEED_SOURCES = {
  kentucky: [
    { name: "KY RHTP Application", detail: "Maternity desert data (PoWERing initiative), paramedic concentration (Crisis to Care)" },
    { name: "NTIA BEAD Program", url: "https://broadbandusa.ntia.gov/", detail: "KY BEAD $1.086B, 86,400 locations" },
    { name: "Cecil G. Sheps Center", url: "https://www.shepscenter.unc.edu/programs-projects/rural-health/rural-hospital-closures/", detail: "109 national rural closures since 2005" },
    { name: "HRSA HPSA (pending)", detail: "County-level shortage designations — next pass" },
    { name: "CDC PLACES (pending)", detail: "Chronic disease prevalence — next pass" },
  ],
  alaska: [
    { name: "NTIA BEAD Program", url: "https://broadbandusa.ntia.gov/", detail: "AK BEAD $1.017B, 29 projects, 15 providers" },
    { name: "Alaska DHSS RHTP Application", detail: "Initiative focus areas" },
    { name: "HRSA HPSA (pending)", detail: "County-level shortage designations — next pass" },
    { name: "CDC PLACES (pending)", detail: "Chronic disease prevalence — next pass" },
  ],
  texas: [
    { name: "Cecil G. Sheps Center", url: "https://www.shepscenter.unc.edu/programs-projects/rural-health/rural-hospital-closures/", detail: "TX rural closures 2010–2020, Trinity County closure 2025" },
    { name: "Texas HHSC RHTP Application", detail: "Rural Texas Strong, $968M program details" },
    { name: "HRSA HPSA (pending)", detail: "County-level shortage designations — next pass" },
    { name: "CDC PLACES (pending)", detail: "Chronic disease prevalence — next pass" },
  ],
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function NeedPage() {
  const { state } = useParams<{ state: string }>();
  const s = state as ValidState;
  const config = STATE_CONFIGS[s];

  return (
    <div className="py-6 lg:py-10">
      <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-6 max-w-6xl">

        <motion.div variants={fadeUp}>
          <h1 className="font-display text-3xl text-[color:var(--foreground)] md:text-4xl">
            {config.name} Need Assessment
          </h1>
        </motion.div>

        {/* ── National stat ──────────────────────────────────── */}
        <motion.div variants={fadeUp} className="flex items-center gap-4 rounded-xl border border-[color:var(--line)] bg-white/80 px-5 py-4">
          <span className="font-display text-3xl font-semibold text-[color:var(--accent)]">{RHTP_PROGRAM.nationalHospitalClosures}</span>
          <span className="text-sm text-[color:var(--foreground)]">Rural hospitals closed since 2005</span>
        </motion.div>

        {/* ── Kentucky validated highlights ────────────────────── */}
        {s === "kentucky" && (
          <motion.div variants={fadeUp} className="space-y-3">
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
              <BigStat icon={Baby} value="1 in 6" label="Women in maternity desert (4x national avg)" color="var(--accent)" />
              <BigStat icon={Truck} value="~50%" label="Paramedics in just 5 counties" color="#2b7ab8" />
              <BigStat icon={Hospital} value="$1.086B" label="BEAD — 86,400 locations" color="var(--teal)" />
            </div>
          </motion.div>
        )}

        {/* ── Alaska ──────────────────────────────────────────── */}
        {s === "alaska" && (
          <motion.div variants={fadeUp} className="space-y-3">
            <div className="grid gap-4 grid-cols-2">
              <BigStat icon={Hospital} value="$1.017B" label="BEAD — 29 projects, 15 providers" color="var(--teal)" />
              <BigStat icon={Users} value="70%" label="BEAD locations connected by year 3" color="#2b7ab8" />
            </div>
            <HighlightBar icon={Stethoscope} text="RHTP focus: cybersecurity, interoperability, remote modalities" color="var(--teal)" />
          </motion.div>
        )}

        {/* ── Texas ───────────────────────────────────────────── */}
        {s === "texas" && (
          <motion.div variants={fadeUp} className="space-y-3">
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
              <BigStat icon={Hospital} value="#1" label="State in rural closures 2010–2020" color="var(--accent)" />
              <BigStat icon={Hospital} value="30 mi" label="Nearest hospital — Trinity County" color="#c46128" />
              <BigStat icon={Users} value="$968M" label="Rural Texas Strong program" color="var(--teal)" />
            </div>
            <HighlightBar icon={Stethoscope} text="$150M AI/Telehealth · $150M RPM · $200M workforce" color="#2b7ab8" />
          </motion.div>
        )}

        {/* ── Pending data categories ─────────────────────────── */}
        <motion.div variants={fadeUp} className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-[color:var(--muted)]">Pending data</p>
          <PendingData field="County-level HPSA designations — HRSA Data Warehouse" />
          <PendingData field="Chronic disease prevalence — CDC PLACES" />
          <PendingData field="Demographics, insurance — US Census ACS" />
          <PendingData field="Maternity access gaps — HRSA AHRF" />
        </motion.div>

        {/* ── Sources ─────────────────────────────────────────── */}
        <ModuleSources sources={NEED_SOURCES[s]} module="Need Assessment" />

      </motion.div>
    </div>
  );
}
