"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, DollarSign, Link2, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { STATE_CONFIGS, type ValidState } from "@/config/states";
import { INTERVENTION_CATALOG } from "@/data/intervention-catalog";
import { CMS_CATEGORY_LABELS, type CMSCategory } from "@/types/rht-nav";
import { cn } from "@/lib/utils";
import { ModuleSources } from "@/components/module-sources";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const EVIDENCE_COLORS: Record<string, string> = {
  "source-backed": "bg-[color:rgba(15,124,134,0.1)] text-[color:var(--teal)]",
  "literature-backed": "bg-[color:rgba(43,122,184,0.1)] text-[color:#2b7ab8]",
  synthetic: "bg-[color:rgba(196,161,42,0.1)] text-[color:#c49a2e]",
};

const PORTFOLIO_SOURCES = [
  { name: "RHT Collaborative", detail: "10-intervention framework" },
  { name: "CMS RHTP Categories", detail: "6 required investment categories" },
  { name: "Cost/outcome data", detail: "Pending peer-reviewed validation" },
];

export default function PortfolioPage() {
  const { state } = useParams<{ state: string }>();
  const validState = state as ValidState;
  const config = STATE_CONFIGS[validState];

  return (
    <div className="p-6 lg:p-10">
      <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-6 max-w-5xl">

        <motion.div variants={fadeUp}>
          <p className="text-xs uppercase tracking-wider text-[color:var(--muted)]">Intervention Portfolio</p>
          <h1 className="mt-2 font-display text-3xl text-[color:var(--foreground)] md:text-4xl">
            {config.name} Intervention Portfolio
          </h1>
        </motion.div>

        {/* CMS Category Legend */}
        <motion.div variants={fadeUp} className="rounded-xl border border-[color:var(--line)] bg-white/75 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">CMS RHTP Categories (minimum 3 required)</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(Object.entries(CMS_CATEGORY_LABELS) as [CMSCategory, string][]).map(([key, label]) => (
              <span key={key} className="rounded-full bg-[color:rgba(15,124,134,0.08)] px-2.5 py-1 text-xs text-[color:var(--teal)]">
                {label.split("&")[0].trim()}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Intervention Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {INTERVENTION_CATALOG.map((intervention, i) => (
            <motion.div
              key={intervention.type}
              variants={fadeUp}
              className="rounded-2xl border border-[color:var(--line)] bg-white/90 p-5 shadow-[var(--shadow-soft)]"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-medium text-[color:var(--muted)]">#{i + 1}</span>
                  <h3 className="mt-0.5 text-sm font-semibold text-[color:var(--foreground)]">
                    {intervention.label}
                  </h3>
                </div>
                <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs font-medium", EVIDENCE_COLORS[intervention.evidenceTier])}>
                  {intervention.evidenceTier}
                </span>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-[color:var(--muted)]">
                {intervention.description}
              </p>

              {/* Metadata */}
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[color:var(--muted)]">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {intervention.estimatedTimeToSignalMonths}mo to signal
                </span>
                {intervention.estimatedCostRange && (
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    ${(intervention.estimatedCostRange.low / 1000).toFixed(0)}K–${(intervention.estimatedCostRange.high / 1000).toFixed(0)}K
                  </span>
                )}
              </div>

              {/* CMS Categories */}
              <div className="mt-3 flex flex-wrap gap-1">
                {intervention.cmsCategories.map((cat) => (
                  <span key={cat} className="rounded-full bg-[color:rgba(15,124,134,0.06)] px-2 py-0.5 text-xs text-[color:var(--teal)]">
                    {CMS_CATEGORY_LABELS[cat].split("&")[0].trim()}
                  </span>
                ))}
              </div>

              {/* Prerequisites */}
              {intervention.prerequisites.length > 0 && (
                <div className="mt-2 flex items-center gap-1 text-xs text-[color:var(--muted)]">
                  <Link2 className="h-3 w-3" />
                  Requires: {intervention.prerequisites.map((p) => {
                    const prereq = INTERVENTION_CATALOG.find((x) => x.type === p);
                    return prereq?.label ?? p;
                  }).join(", ")}
                </div>
              )}

              {/* Partner */}
              {intervention.rhtCollaborativePartner && (
                <div className="mt-2 flex items-center gap-1 text-xs text-[color:var(--muted)]">
                  <Users className="h-3 w-3" />
                  {intervention.rhtCollaborativePartner}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Implementation Playbook link */}
        <motion.div variants={fadeUp}>
          <Link
            href={`/${validState}/portfolio/implementation-playbook`}
            className="group flex items-center justify-between rounded-2xl border border-dashed border-[color:var(--line)] bg-white/50 p-5 transition-all hover:border-[color:var(--foreground)]/20 hover:shadow-md"
          >
            <div>
              <p className="text-sm font-medium text-[color:var(--foreground)]">Implementation Playbook</p>
              <p className="mt-0.5 text-xs text-[color:var(--muted)]">Staged rollout checklist tied to selected interventions</p>
            </div>
            <ArrowRight className="h-4 w-4 text-[color:var(--muted)] transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* ── Sources (collapsed at bottom) ───────────────────── */}
        <ModuleSources sources={PORTFOLIO_SOURCES} module="Intervention Portfolio" />

      </motion.div>
    </div>
  );
}
