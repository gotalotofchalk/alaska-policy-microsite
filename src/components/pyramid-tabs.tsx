"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, ExternalLink, Info, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { getKYBDCSummary } from "@/data/kentucky-broadband-availability";
import { getKYFacilitySummary } from "@/data/kentucky-facilities";
import { cn } from "@/lib/utils";
import type {
  EcosystemSection,
  InfraSection,
  SolutionSection,
  StatePyramidConfig,
} from "@/types/state-pyramid";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const TAB_COLORS = {
  infrastructure: "#2b7ab8",
  ecosystem: "#4a8c3f",
  solutions: "var(--accent)",
} as const;

type TabKey = keyof typeof TAB_COLORS;

const TABS: { key: TabKey; label: string }[] = [
  { key: "infrastructure", label: "Infrastructure" },
  { key: "ecosystem", label: "Ecosystem" },
  { key: "solutions", label: "Solutions" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

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

function StatusPill({ text, variant = "default" }: { text: string; variant?: "default" | "active" | "pending" }) {
  const colors = {
    default: "bg-[color:var(--surface-soft)] text-[color:var(--muted)]",
    active: "bg-[color:rgba(15,124,134,0.1)] text-[color:var(--teal)]",
    pending: "bg-[color:rgba(196,161,42,0.1)] text-[color:#c49a2e]",
  };
  return (
    <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium", colors[variant])}>
      {text}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Collapsible Section                                                */
/* ------------------------------------------------------------------ */

function CollapsibleSection({
  title,
  statusSummary,
  defaultOpen = false,
  children,
}: {
  title: string;
  statusSummary: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[color:var(--line)] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/50 md:px-5"
      >
        <motion.div
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex h-5 w-5 shrink-0 items-center justify-center"
        >
          <ChevronRight className="h-4 w-4 text-[color:var(--muted)]" />
        </motion.div>
        <span className="flex-1 text-sm font-medium text-[color:var(--foreground)]">
          {title}
        </span>
        <span className="hidden text-[11px] text-[color:var(--muted)] sm:block">
          {statusSummary}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 pt-1 md:px-5 md:pl-12">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Infrastructure Content Renderers                                   */
/* ------------------------------------------------------------------ */

function BroadbandContent({ section }: { section: InfraSection }) {
  const bdcSummary = getKYBDCSummary();
  const fSummary = getKYFacilitySummary();

  const pctUnderserved = Math.round((bdcSummary.underserved / bdcSummary.totalBSLs) * 1000) / 10;
  const pctUnserved = Math.round((bdcSummary.unserved / bdcSummary.totalBSLs) * 1000) / 10;

  return (
    <div className="space-y-4">
      {/* BDC stat cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-[color:var(--line)] bg-white/75 p-3 text-center">
          <p className="font-display text-2xl font-semibold text-[color:var(--teal)] md:text-3xl">
            {bdcSummary.pctServed}%
          </p>
          <p className="mt-0.5 text-[10px] font-medium text-[color:var(--foreground)]">Served</p>
          <p className="text-[10px] text-[color:var(--muted)]">{bdcSummary.served.toLocaleString()} BSLs</p>
        </div>
        <div className="rounded-xl border border-[color:var(--line)] bg-white/75 p-3 text-center">
          <p className="font-display text-2xl font-semibold text-[color:#c49a2e] md:text-3xl">
            {pctUnderserved}%
          </p>
          <p className="mt-0.5 text-[10px] font-medium text-[color:var(--foreground)]">Underserved</p>
          <p className="text-[10px] text-[color:var(--muted)]">{bdcSummary.underserved.toLocaleString()} BSLs</p>
        </div>
        <div className="rounded-xl border border-[color:var(--line)] bg-white/75 p-3 text-center">
          <p className="font-display text-2xl font-semibold text-[color:var(--accent)] md:text-3xl">
            {pctUnserved}%
          </p>
          <p className="mt-0.5 text-[10px] font-medium text-[color:var(--foreground)]">Unserved</p>
          <p className="text-[10px] text-[color:var(--muted)]">{bdcSummary.unserved.toLocaleString()} BSLs</p>
        </div>
      </div>

      {/* Facility summary */}
      <div className="rounded-xl border border-[color:var(--line)] bg-white/75 p-3">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-medium text-[color:var(--foreground)]">
            Healthcare Facilities
          </p>
          <InfoTip text="Broadband status is estimated from county-level FCC BDC data. Facility-level verification is planned." />
        </div>
        <p className="mt-1 text-[11px] text-[color:var(--muted)]">
          {fSummary.served} served · {fSummary.underserved} underserved · {fSummary.unserved} unserved of {fSummary.total} total
        </p>
      </div>

      {/* Source */}
      <p className="text-[10px] text-[color:var(--muted)]">
        Source: FCC Broadband Data Collection, Dec 2024 · {bdcSummary.totalCounties} counties · {bdcSummary.totalBSLs.toLocaleString()} BSLs
      </p>

      {/* Tool button */}
      {section.hasInteractiveTool && section.toolRoute && (
        <Link
          href={section.toolRoute}
          className="inline-flex items-center gap-2 rounded-full bg-[color:var(--foreground)] px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[color:#223a54]"
        >
          {section.toolLabel ?? "Open Tool"}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

function CybersecurityContent() {
  const fSummary = getKYFacilitySummary();

  return (
    <div className="space-y-3">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[color:var(--line)] bg-white/75 p-3">
          <p className="font-display text-2xl font-semibold text-[color:var(--foreground)]">0</p>
          <p className="text-[10px] text-[color:var(--muted)]">KY facilities assessed</p>
        </div>
        <div className="rounded-xl border border-[color:var(--line)] bg-white/75 p-3">
          <p className="font-display text-2xl font-semibold text-[color:var(--foreground)]">{fSummary.total}</p>
          <p className="text-[10px] text-[color:var(--muted)]">Total facilities</p>
        </div>
        <div className="rounded-xl border border-[color:var(--line)] bg-white/75 p-3">
          <p className="font-display text-2xl font-semibold text-[color:var(--teal)]">700+</p>
          <p className="text-[10px] text-[color:var(--muted)]">Rural hospitals nationally on Azure cybersecurity</p>
        </div>
      </div>

      {/* Program info */}
      <div className="space-y-2 text-[11px] text-[color:var(--muted)]">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--teal)]" />
          <p>
            <span className="font-medium text-[color:var(--foreground)]">Rural Health Resiliency Program</span> provides cybersecurity risk assessments, incident response planning, and compliance monitoring for rural healthcare facilities.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:#2b7ab8]" />
          <p>
            <span className="font-medium text-[color:var(--foreground)]">Anthropic Project Glasswing</span> adds AI-powered vulnerability detection and threat analysis for enrolled facilities.
          </p>
        </div>
      </div>

      <StatusPill text="Enrollment in progress" variant="pending" />
    </div>
  );
}

function PlaceholderContent({ description }: { description: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-dashed border-[color:var(--line)] bg-white/50 p-4">
      <div className="h-2 w-2 rounded-full bg-[color:#c49a2e]" />
      <p className="text-xs text-[color:var(--muted)]">{description}</p>
    </div>
  );
}

function InfraContent({ section }: { section: InfraSection }) {
  switch (section.content) {
    case "broadband":
      return <BroadbandContent section={section} />;
    case "cyber":
      return <CybersecurityContent />;
    case "ehr":
      return <PlaceholderContent description="EHR landscape data collection is planned. Assessment will evaluate current EHR penetration, vendor distribution, and interoperability readiness across rural facilities." />;
    case "interop":
      return <PlaceholderContent description="FHIR and HIE readiness evaluation is planned. Assessment will map current health information exchange capabilities and identify interoperability gaps." />;
    case "cloud":
      return <PlaceholderContent description="Azure cloud readiness assessment is planned. Evaluation will cover current IT infrastructure, migration complexity, and AI-ready workloads across facilities." />;
    default:
      return <PlaceholderContent description="Assessment coming soon." />;
  }
}

/* ------------------------------------------------------------------ */
/*  Ecosystem Content Renderer                                         */
/* ------------------------------------------------------------------ */

function EcosystemContent({ section }: { section: EcosystemSection }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {section.partners.map((partner) => (
        <div
          key={partner.name}
          className="flex items-start gap-2.5 rounded-lg border border-[color:var(--line)] bg-white/75 p-2.5"
        >
          <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[color:#4a8c3f]" />
          <div>
            <p className="text-xs font-medium text-[color:var(--foreground)]">{partner.name}</p>
            <p className="text-[10px] text-[color:var(--muted)]">{partner.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Solutions Content Renderer                                         */
/* ------------------------------------------------------------------ */

function SolutionContent({ section }: { section: SolutionSection }) {
  const statusColors: Record<string, string> = {
    available: "bg-[color:rgba(15,124,134,0.1)] text-[color:var(--teal)]",
    planned: "bg-[color:rgba(196,161,42,0.1)] text-[color:#c49a2e]",
    future: "bg-[color:var(--surface-soft)] text-[color:var(--muted)]",
  };

  return (
    <div className="space-y-2">
      {section.interventions?.map((intervention) => (
        <div
          key={intervention.name}
          className="flex items-center justify-between rounded-lg border border-[color:var(--line)] bg-white/75 px-3 py-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs text-[color:var(--foreground)]">{intervention.name}</span>
            {intervention.partner && (
              <span className="text-[10px] text-[color:var(--muted)]">{intervention.partner}</span>
            )}
          </div>
          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium capitalize", statusColors[intervention.status])}>
            {intervention.status}
          </span>
        </div>
      ))}
      {(!section.interventions || section.interventions.length === 0) && (
        <PlaceholderContent description="Interventions to be defined." />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function PyramidTabs({
  config,
  defaultTab = "infrastructure",
  defaultOpenSections = ["broadband_satellite"],
}: {
  config: StatePyramidConfig;
  defaultTab?: TabKey;
  defaultOpenSections?: string[];
}) {
  const [activeTab, setActiveTab] = useState<TabKey>(defaultTab);

  return (
    <div className="space-y-4">
      {/* ── Tab bar ──────────────────────────────────────────── */}
      <div className="flex gap-1 overflow-x-auto rounded-2xl bg-[color:var(--surface-soft)] p-1 scrollbar-none">
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "relative flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-white text-[color:var(--foreground)] shadow-sm"
                  : "text-[color:var(--muted)] hover:text-[color:var(--foreground)]",
              )}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: TAB_COLORS[tab.key] }}
              />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab content ──────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="surface-card overflow-hidden rounded-[1.6rem] border border-[color:var(--line)]"
        >
          {activeTab === "infrastructure" &&
            config.infrastructure.map((section) => (
              <CollapsibleSection
                key={section.category}
                title={section.label}
                statusSummary={section.statusSummary}
                defaultOpen={defaultOpenSections.includes(section.category)}
              >
                <InfraContent section={section} />
              </CollapsibleSection>
            ))}

          {activeTab === "ecosystem" &&
            config.ecosystem.map((section) => (
              <CollapsibleSection
                key={section.category}
                title={section.label}
                statusSummary={`${section.partners.length} partners`}
                defaultOpen={section.category === "technology"}
              >
                <EcosystemContent section={section} />
              </CollapsibleSection>
            ))}

          {activeTab === "solutions" &&
            config.solutions.map((section) => (
              <CollapsibleSection
                key={section.goal}
                title={`${section.goalNumber}. ${section.label}`}
                statusSummary={section.statusSummary}
              >
                <SolutionContent section={section} />
              </CollapsibleSection>
            ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
