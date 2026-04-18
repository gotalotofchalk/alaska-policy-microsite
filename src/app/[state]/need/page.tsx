"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useParams } from "next/navigation";

import { STATE_CONFIGS, RHTP_PROGRAM, type ValidState } from "@/config/states";

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
/*  Cited stat component                                               */
/* ------------------------------------------------------------------ */

function CitedStat({ text, source }: { text: string; source: string }) {
  return (
    <div className="rounded-xl border border-[color:var(--line)] bg-white/75 p-4">
      <p className="text-sm text-[color:var(--foreground)]">{text}</p>
      <p className="mt-1 text-xs text-[color:var(--muted)]">Source: {source}</p>
    </div>
  );
}

function DataPlaceholder({ source, field }: { source: string; field: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[color:var(--line)] bg-white/40 p-4">
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[color:#c49a2e]" />
        <div>
          <p className="text-sm font-medium text-[color:var(--foreground)]">Data coming soon</p>
          <p className="mt-0.5 text-xs text-[color:var(--muted)]">{field} — will pull from {source}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function NeedPage() {
  const { state } = useParams<{ state: string }>();
  const validState = state as ValidState;
  const config = STATE_CONFIGS[validState];

  return (
    <div className="p-6 lg:p-10">
      <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-6 max-w-5xl">
        <motion.div variants={fadeUp}>
          <p className="text-xs uppercase tracking-wider text-[color:var(--muted)]">Need Assessment</p>
          <h1 className="mt-2 font-display text-3xl text-[color:var(--foreground)] md:text-4xl">
            {config.name} Need Assessment
          </h1>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            County-level view of health deserts, physician shortages, chronic disease burden, and maternity access gaps.
          </p>
        </motion.div>

        {/* National context */}
        <motion.div variants={fadeUp}>
          <CitedStat
            text={`${RHTP_PROGRAM.nationalHospitalClosures} rural hospitals have completely closed since 2005.`}
            source={RHTP_PROGRAM.nationalClosuresSource}
          />
        </motion.div>

        {/* Kentucky */}
        {validState === "kentucky" && (
          <motion.div variants={fadeUp} className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Validated State Data</p>
            <CitedStat
              text="1 in 6 Kentucky women of childbearing age lives in a maternity care desert, more than 4x the national average."
              source='Kentucky RHTP application narrative, "PoWERing Maternal and Infant Health" initiative'
            />
            <CitedStat
              text="Nearly half of Kentucky paramedics are concentrated in just 5 counties."
              source='Kentucky RHTP application, "Crisis to Care" initiative'
            />
            <CitedStat
              text="Kentucky BEAD allocation $1.086B, targeting 86,400 unserved and underserved locations."
              source="NTIA BEAD Final Proposal approval, late 2025"
            />
          </motion.div>
        )}

        {/* Alaska */}
        {validState === "alaska" && (
          <motion.div variants={fadeUp} className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Validated State Data</p>
            <CitedStat
              text="Alaska BEAD allocation $1.017B total, with $629M in initial deployment awards across 29 projects and 15 providers. First connections expected June 2026; approximately 70% of BEAD-funded Alaska locations connected by end of year 3."
              source="NTIA BEAD Final Proposal approval, January 6, 2026"
            />
            <CitedStat
              text='Alaska RHTP plan funds "flexible, phased and voluntary" initiatives focused on cybersecurity, data interoperability, and consumer-facing remote modalities.'
              source="Alaska DHSS RHTP application"
            />
          </motion.div>
        )}

        {/* Texas */}
        {validState === "texas" && (
          <motion.div variants={fadeUp} className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Validated State Data</p>
            <CitedStat
              text="Texas led the nation in rural hospital closures 2010–2020."
              source="Cecil G. Sheps Center for Health Services Research"
            />
            <CitedStat
              text="Mid Coast Medical Center in Trinity, TX closed April 25, 2025, 14 months after reopening the former East Texas Medical Center site (originally shuttered 2017). Trinity County residents now drive 30 miles to the nearest hospital."
              source="Cecil G. Sheps Center closure tracking"
            />
            <CitedStat
              text='"Rural Texas Strong: Supporting Health and Wellness" allocates $968M across 6 initiatives, including $150M Lone Star Advanced AI and Telehealth targeting maternal health, behavioral health, and preventive screening; $150M for remote patient monitoring; $200M workforce pipeline.'
              source="Texas HHSC RHTP application, finalized after 300+ public comments"
            />
          </motion.div>
        )}

        {/* Pending data */}
        <motion.div variants={fadeUp} className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Pending Data</p>
          <DataPlaceholder source="HRSA Data Warehouse" field="County-level HPSA designations (primary care shortage areas)" />
          <DataPlaceholder source="CDC PLACES data portal" field="County-level chronic disease prevalence (diabetes, heart disease, obesity)" />
          <DataPlaceholder source="US Census ACS" field="County-level demographics, insurance coverage, median income" />
          <DataPlaceholder source="HRSA AHRF" field="Maternity access — counties without obstetric services" />
        </motion.div>
      </motion.div>
    </div>
  );
}
