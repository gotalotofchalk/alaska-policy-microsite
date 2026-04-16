"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Wifi,
  Shield,
  FileText,
  Network,
  Cloud,
  ArrowRight,
  Lock,
  Activity,
  Heart,
  Zap,
  Users,
  Lightbulb,
  Satellite,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { getKYBDCSummary } from "@/data/kentucky-broadband-availability";
import { getKYFacilitySummary } from "@/data/kentucky-facilities";
import { cn, usNum } from "@/lib/utils";
import type {
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
/*  Icon mappings                                                      */
/* ------------------------------------------------------------------ */

const INFRA_ICONS: Record<string, React.ElementType> = {
  broadband: Wifi,
  cyber: Shield,
  ehr: FileText,
  interop: Network,
  cloud: Cloud,
};

const SOLUTION_ICONS: Record<number, React.ElementType> = {
  1: Heart,
  2: Activity,
  3: Users,
  4: Lightbulb,
  5: Zap,
};

/* ------------------------------------------------------------------ */
/*  Module Card                                                        */
/* ------------------------------------------------------------------ */

function ModuleCard({
  title,
  subtitle,
  icon: Icon,
  accentColor,
  active,
  href,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  accentColor: string;
  active: boolean;
  href?: string;
  children?: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  const card = (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={active ? { scale: 1.02, y: -2 } : { scale: 1 }}
      whileTap={active ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl border p-5 transition-all duration-300",
        active
          ? "cursor-pointer border-[color:var(--line)] bg-white/90 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)] hover:border-transparent"
          : "border-[color:var(--line)] bg-white/50",
      )}
      style={active && hovered ? { borderColor: `${accentColor}40` } : {}}
    >
      {/* Accent bar */}
      <div
        className="absolute left-0 top-0 h-1 w-full transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, ${accentColor}, ${accentColor}80)`,
          opacity: active ? (hovered ? 1 : 0.6) : 0.15,
        }}
      />

      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
            active ? "" : "grayscale",
          )}
          style={{
            backgroundColor: `${accentColor}15`,
            color: active ? accentColor : "var(--muted)",
          }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "text-sm font-semibold leading-tight transition-colors",
            active ? "text-[color:var(--foreground)]" : "text-[color:var(--muted)]",
          )}>
            {title}
          </h3>
          <p className="mt-0.5 text-[11px] text-[color:var(--muted)] leading-snug">
            {subtitle}
          </p>
        </div>
        {active && href && (
          <ArrowRight
            className="h-4 w-4 shrink-0 text-[color:var(--muted)] transition-all duration-300"
            style={hovered ? { color: accentColor, transform: "translateX(2px)" } : {}}
          />
        )}
      </div>

      {/* Content */}
      {active && children && (
        <div className="mt-4 flex-1">
          {children}
        </div>
      )}

      {/* Coming Soon overlay for inactive cards */}
      {!active && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-[1px] transition-all duration-300",
          hovered ? "opacity-100" : "opacity-0",
        )}>
          <div className="flex items-center gap-2 rounded-full bg-[color:var(--foreground)]/80 px-4 py-2">
            <Lock className="h-3.5 w-3.5 text-white/80" />
            <span className="text-xs font-medium text-white">Coming Soon</span>
          </div>
        </div>
      )}
    </motion.div>
  );

  if (active && href) {
    return <Link href={href} className="block">{card}</Link>;
  }
  return card;
}

/* ------------------------------------------------------------------ */
/*  Infrastructure Grid                                                */
/* ------------------------------------------------------------------ */

function InfraGrid({ sections }: { sections: InfraSection[] }) {
  const bdcSummary = getKYBDCSummary();
  const fSummary = getKYFacilitySummary();
  const pctUnserved = Math.round((bdcSummary.unserved / bdcSummary.totalBSLs) * 1000) / 10;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sections.map((section) => {
        const Icon = INFRA_ICONS[section.content] ?? Wifi;
        const isActive = section.content === "broadband" || section.content === "cyber";

        return (
          <ModuleCard
            key={section.category}
            title={section.content === "broadband" ? "Broadband Map" : section.label}
            subtitle={section.statusSummary}
            icon={Icon}
            accentColor={
              section.content === "broadband" ? "#0f7c86"
              : section.content === "cyber" ? "#2b7ab8"
              : "#8899a6"
            }
            active={isActive}
            href={section.hasInteractiveTool ? section.toolRoute : undefined}
          >
            {section.content === "broadband" && (
              <div className="space-y-3">
                {/* Mini stat row */}
                <div className="flex gap-2">
                  <div className="flex-1 rounded-lg bg-[color:rgba(15,124,134,0.08)] px-2.5 py-2 text-center">
                    <p className="font-display text-lg font-semibold text-[color:var(--teal)]">{bdcSummary.pctServed}%</p>
                    <p className="text-[9px] text-[color:var(--muted)]">Served</p>
                  </div>
                  <div className="flex-1 rounded-lg bg-[color:rgba(196,161,42,0.08)] px-2.5 py-2 text-center">
                    <p className="font-display text-lg font-semibold text-[color:#c49a2e]">
                      {Math.round((bdcSummary.underserved / bdcSummary.totalBSLs) * 1000) / 10}%
                    </p>
                    <p className="text-[9px] text-[color:var(--muted)]">Underserved</p>
                  </div>
                  <div className="flex-1 rounded-lg bg-[color:rgba(196,97,42,0.08)] px-2.5 py-2 text-center">
                    <p className="font-display text-lg font-semibold text-[color:var(--accent)]">{pctUnserved}%</p>
                    <p className="text-[9px] text-[color:var(--muted)]">Unserved</p>
                  </div>
                </div>
                {/* Partner attribution */}
                <div className="flex items-center gap-3 text-[10px] text-[color:var(--muted)]">
                  <div className="flex items-center gap-1">
                    <Satellite className="h-3 w-3" />
                    <span>Starlink LEO</span>
                  </div>
                  <span className="text-[color:var(--line)]">·</span>
                  <div className="flex items-center gap-1">
                    <Cloud className="h-3 w-3" />
                    <span>Microsoft Azure</span>
                  </div>
                </div>
                <p className="text-[10px] text-[color:var(--muted)]">
                  {usNum(fSummary.total)} facilities · {usNum(bdcSummary.totalBSLs)} BSLs tracked
                </p>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--foreground)] px-3 py-1.5 text-[11px] font-medium text-white">
                  Open Broadband Map <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            )}

            {section.content === "cyber" && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1 rounded-lg bg-[color:rgba(43,122,184,0.08)] px-2.5 py-2 text-center">
                    <p className="font-display text-lg font-semibold text-[color:var(--foreground)]">0</p>
                    <p className="text-[9px] text-[color:var(--muted)]">Assessed</p>
                  </div>
                  <div className="flex-1 rounded-lg bg-[color:rgba(43,122,184,0.08)] px-2.5 py-2 text-center">
                    <p className="font-display text-lg font-semibold text-[color:#2b7ab8]">{usNum(fSummary.total)}</p>
                    <p className="text-[9px] text-[color:var(--muted)]">Total Facilities</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-[10px] text-[color:var(--muted)]">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--teal)]" />
                    <span>Rural Health Resiliency Program</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:#2b7ab8]" />
                    <span>Anthropic Project Glasswing</span>
                  </div>
                </div>
                <span className="inline-block rounded-full bg-[color:rgba(196,161,42,0.1)] px-2.5 py-0.5 text-[10px] font-medium text-[color:#c49a2e]">
                  Enrollment in progress
                </span>
              </div>
            )}
          </ModuleCard>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Ecosystem Grid — mostly coming-soon                                */
/* ------------------------------------------------------------------ */

interface EcoModule {
  name: string;
  tagline: string;
  icon: React.ElementType;
  color: string;
  active: boolean;
}

const ECO_MODULES: EcoModule[] = [
  { name: "Microsoft", tagline: "Cloud, AI & cybersecurity platform", icon: Cloud, color: "#0078d4", active: true },
  { name: "BioIntelliSense", tagline: "Remote patient monitoring wearables", icon: Activity, color: "#00b4d8", active: false },
  { name: "Accenture", tagline: "System integration & advisory", icon: Users, color: "#a100ff", active: false },
  { name: "eClinicalWorks", tagline: "Electronic health records", icon: FileText, color: "#e11d48", active: false },
  { name: "Avel eCare", tagline: "Telehealth services", icon: Heart, color: "#059669", active: false },
  { name: "KPMG / PwC", tagline: "Advisory services", icon: Users, color: "#6b7280", active: false },
];

function EcoGrid() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ECO_MODULES.map((mod) => {
          const Icon = mod.icon;
          return (
            <ModuleCard
              key={mod.name}
              title={mod.name}
              subtitle={mod.tagline}
              icon={Icon}
              accentColor={mod.color}
              active={mod.active}
            >
              {mod.active && mod.name === "Microsoft" && (
                <div className="space-y-1.5">
                  {["Azure Cloud Infrastructure", "AI/ML Health Analytics", "Cybersecurity for 700+ Rural Hospitals", "Teams Telehealth Integration"].map((cap) => (
                    <div key={cap} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0078d4]" />
                      <span className="text-[11px] text-[color:var(--foreground)]">{cap}</span>
                    </div>
                  ))}
                </div>
              )}
            </ModuleCard>
          );
        })}
      </div>
      <p className="text-[10px] text-[color:var(--muted)]">
        Partner profiles will be populated as engagement agreements are finalized. Technology partners enabling infrastructure (e.g. Starlink) appear within their respective infrastructure modules.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Solutions Grid — mostly coming-soon                                */
/* ------------------------------------------------------------------ */

function SolutionsGrid({ sections }: { sections: SolutionSection[] }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => {
          const Icon = SOLUTION_ICONS[section.goalNumber] ?? Heart;
          const hasAvailableItems = section.interventions?.some((i) => i.status === "available");

          return (
            <ModuleCard
              key={section.goal}
              title={`${section.goalNumber}. ${section.label}`}
              subtitle={section.statusSummary}
              icon={Icon}
              accentColor={hasAvailableItems ? "var(--accent)" : "#8899a6"}
              active={!!hasAvailableItems}
            >
              {hasAvailableItems && section.interventions && (
                <div className="space-y-1.5">
                  {section.interventions.map((intervention) => {
                    const statusColors: Record<string, string> = {
                      available: "text-[color:var(--teal)] bg-[color:rgba(15,124,134,0.08)]",
                      planned: "text-[color:#c49a2e] bg-[color:rgba(196,161,42,0.08)]",
                      future: "text-[color:var(--muted)] bg-[color:var(--surface-soft)]",
                    };
                    return (
                      <div
                        key={intervention.name}
                        className="flex items-center justify-between gap-2 rounded-lg bg-white/60 px-2.5 py-1.5"
                      >
                        <span className="text-[11px] text-[color:var(--foreground)]">
                          {intervention.name}
                        </span>
                        <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[9px] font-medium capitalize", statusColors[intervention.status])}>
                          {intervention.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </ModuleCard>
          );
        })}
      </div>
      <p className="text-[10px] text-[color:var(--muted)]">
        Solution modules map to the 5 CMS RHT goals. Active modules reflect interventions with available infrastructure tooling.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function PyramidTabs({
  config,
  defaultTab = "infrastructure",
}: {
  config: StatePyramidConfig;
  defaultTab?: TabKey;
  defaultOpenSections?: string[];
}) {
  const [activeTab, setActiveTab] = useState<TabKey>(defaultTab);

  return (
    <div className="space-y-5">
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
        >
          {activeTab === "infrastructure" && (
            <InfraGrid sections={config.infrastructure} />
          )}

          {activeTab === "ecosystem" && (
            <EcoGrid />
          )}

          {activeTab === "solutions" && (
            <SolutionsGrid sections={config.solutions} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
