"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useParams } from "next/navigation";

import { STATE_CONFIGS, type ValidState } from "@/config/states";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

/* ------------------------------------------------------------------ */
/*  Source library                                                     */
/* ------------------------------------------------------------------ */

interface DataSource {
  name: string;
  url: string;
  scope: string;
  usage: string;
}

const PROGRAM_SOURCES: DataSource[] = [
  {
    name: "CMS Office of Rural Health Transformation",
    url: "https://www.cms.gov/rural-health-transformation",
    scope: "RHTP awards, Dec 29, 2025",
    usage: "State RHTP allocation figures on overview and need pages",
  },
  {
    name: "NTIA BEAD Program",
    url: "https://broadbandusa.ntia.gov/funding-programs/broadband-equity-access-and-deployment-bead-program",
    scope: "Broadband deployment tracker, state-by-state allocations",
    usage: "BEAD allocation figures, deployment timelines",
  },
  {
    name: "Cecil G. Sheps Center for Health Services Research",
    url: "https://www.shepscenter.unc.edu/programs-projects/rural-health/rural-hospital-closures/",
    scope: "Rural hospital closure tracking since 2005",
    usage: "National and state-level hospital closure counts",
  },
  {
    name: "KFF RHTP Allocation Analysis",
    url: "https://www.kff.org/",
    scope: "Analysis of CMS Dec 2025 allocation formula",
    usage: "Allocation formula breakdown on landing and overview pages",
  },
  {
    name: "FCC Rural Health Care Program",
    url: "https://www.fcc.gov/general/rural-health-care-program",
    scope: "$400M annual telecom subsidy for rural healthcare",
    usage: "Program context and policy background",
  },
  {
    name: "FCC Healthcare Bandwidth Guidance",
    url: "https://www.fcc.gov/health/hcf",
    scope: "Bandwidth requirements for healthcare applications",
    usage: "Connectivity Translator tier thresholds (Tiers 1–4)",
  },
  {
    name: "NTIA BEAD Statutory Requirements",
    url: "https://broadbandusa.ntia.gov/funding-programs/broadband-equity-access-and-deployment-bead-program",
    scope: "100/20 Mbps floor for BEAD-funded deployments",
    usage: "Connectivity Translator Tier 5 threshold",
  },
  {
    name: "Public Law 119-21 (OBBBA)",
    url: "https://www.congress.gov/bill/119th-congress/house-bill/1",
    scope: "Statutory basis for the RHTP ($50B FY2026–2030)",
    usage: "Program context on landing and overview pages",
  },
];

const CONNECTIVITY_SOURCES: DataSource[] = [
  {
    name: "FCC Broadband Data Collection (BDC)",
    url: "https://broadbandmap.fcc.gov/",
    scope: "County-level broadband availability, 100/20 Mbps threshold",
    usage: "Broadband map choropleth, facility broadband status, BSL counts",
  },
];

const NEED_SOURCES: DataSource[] = [
  {
    name: "HRSA Health Professional Shortage Area (HPSA)",
    url: "https://data.hrsa.gov/tools/shortage-area",
    scope: "Primary care, dental, and mental health shortage designations",
    usage: "Need Assessment — pending ingestion",
  },
  {
    name: "CDC PLACES",
    url: "https://www.cdc.gov/places/",
    scope: "County-level chronic disease prevalence estimates",
    usage: "Need Assessment — pending ingestion",
  },
  {
    name: "US Census ACS (American Community Survey)",
    url: "https://data.census.gov/",
    scope: "Demographics, income, insurance coverage, 2020–2024 5-year",
    usage: "Population, household counts, rural percentage",
  },
];

const CAPACITY_SOURCES: DataSource[] = [
  {
    name: "CMS Hospital Compare",
    url: "https://data.cms.gov/provider-data/",
    scope: "Hospital quality metrics, facility locations",
    usage: "Capacity & Readiness — pending ingestion",
  },
  {
    name: "HRSA Area Health Resources File (AHRF)",
    url: "https://data.hrsa.gov/topics/health-workforce/ahrf",
    scope: "County-level workforce and facility counts",
    usage: "Capacity & Readiness — pending ingestion",
  },
];

const KY_SPECIFIC_SOURCES: DataSource[] = [
  {
    name: "Kentucky RHTP Application Narrative",
    url: "https://www.cms.gov/rural-health-transformation",
    scope: "State plan details including maternity and EMS initiatives",
    usage: "Maternity desert stats, paramedic concentration data",
  },
  {
    name: "Kentucky BEAD Final Proposal (NTIA)",
    url: "https://broadbandusa.ntia.gov/",
    scope: "$1.086B allocation targeting 86,400 locations",
    usage: "BEAD context on need and connectivity pages",
  },
];

const AK_SPECIFIC_SOURCES: DataSource[] = [
  {
    name: "Alaska DHSS RHTP Application",
    url: "https://www.cms.gov/rural-health-transformation",
    scope: "State plan — cybersecurity, interoperability, remote modalities",
    usage: "RHTP plan focus on overview and need pages",
  },
  {
    name: "NTIA BEAD Alaska Deployment Awards",
    url: "https://broadbandusa.ntia.gov/",
    scope: "$1.017B total, $629M in initial awards, 29 projects",
    usage: "BEAD context on need and connectivity pages",
  },
];

const TX_SPECIFIC_SOURCES: DataSource[] = [
  {
    name: "Texas HHSC RHTP Application",
    url: "https://www.cms.gov/rural-health-transformation",
    scope: '"Rural Texas Strong" — $968M across 6 initiatives',
    usage: "RHTP plan details on overview and need pages",
  },
  {
    name: "Cecil G. Sheps Center — Texas Closures",
    url: "https://www.shepscenter.unc.edu/programs-projects/rural-health/rural-hospital-closures/",
    scope: "Texas led nation in rural hospital closures 2010–2020",
    usage: "Closure data on need and East Texas pilot pages",
  },
];

function SourceTable({ sources, title }: { sources: DataSource[]; title: string }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">{title}</p>
      <div className="space-y-2">
        {sources.map((s) => (
          <div key={s.name} className="rounded-xl border border-[color:var(--line)] bg-white/75 p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-[color:var(--foreground)]">{s.name}</p>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-[color:var(--teal)] transition-colors hover:text-[color:var(--foreground)]"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
            <p className="mt-1 text-xs text-[color:var(--muted)]">{s.scope}</p>
            <p className="mt-0.5 text-xs text-[color:var(--muted)]">Used for: {s.usage}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DataMethodologyPage() {
  const { state } = useParams<{ state: string }>();
  const validState = state as ValidState;
  const config = STATE_CONFIGS[validState];

  const stateSpecific =
    validState === "kentucky" ? KY_SPECIFIC_SOURCES
    : validState === "alaska" ? AK_SPECIFIC_SOURCES
    : TX_SPECIFIC_SOURCES;

  return (
    <div className="p-6 lg:p-10">
      <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-6 max-w-5xl">
        <motion.div variants={fadeUp}>
          <p className="text-xs uppercase tracking-wider text-[color:var(--muted)]">Data &amp; Methodology</p>
          <h1 className="mt-2 font-display text-3xl text-[color:var(--foreground)] md:text-4xl">
            {config.name} Data Sources
          </h1>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Every data point displayed across {config.name}&apos;s modules is sourced from the following federal and state datasets. This is the comprehensive data provenance reference for this state.
          </p>
        </motion.div>

        <motion.div variants={fadeUp}>
          <SourceTable sources={PROGRAM_SOURCES} title="Program Context" />
        </motion.div>
        <motion.div variants={fadeUp}>
          <SourceTable sources={stateSpecific} title={`${config.name}-Specific Sources`} />
        </motion.div>
        <motion.div variants={fadeUp}>
          <SourceTable sources={CONNECTIVITY_SOURCES} title="Connectivity & Infrastructure" />
        </motion.div>
        <motion.div variants={fadeUp}>
          <SourceTable sources={NEED_SOURCES} title="Need Assessment" />
        </motion.div>
        <motion.div variants={fadeUp}>
          <SourceTable sources={CAPACITY_SOURCES} title="Capacity & Readiness" />
        </motion.div>
      </motion.div>
    </div>
  );
}
