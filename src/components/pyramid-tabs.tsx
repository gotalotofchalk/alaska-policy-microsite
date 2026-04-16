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
  Monitor,
  Activity,
  Heart,
  Zap,
  Users,
  Lightbulb,
  Satellite,
  Eye,
  Stethoscope,
  Pill,
  Brain,
} from "lucide-react";
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
/*  Featured Partner Data                                              */
/* ------------------------------------------------------------------ */

interface FeaturedPartner {
  name: string;
  tagline: string;
  icon: React.ElementType;
  color: string;
  bgGradient: string;
  capabilities: string[];
  active: boolean;
}

const FEATURED_PARTNERS: FeaturedPartner[] = [
  {
    name: "Microsoft",
    tagline: "Cloud, AI & Cybersecurity",
    icon: Cloud,
    color: "#0078d4",
    bgGradient: "from-[#0078d4]/10 to-[#0078d4]/5",
    capabilities: ["Azure Cloud Infrastructure", "AI/ML Health Analytics", "Cybersecurity for 700+ Rural Hospitals", "Teams Telehealth Integration"],
    active: true,
  },
  {
    name: "BioIntelliSense",
    tagline: "Remote Patient Monitoring",
    icon: Activity,
    color: "#00b4d8",
    bgGradient: "from-[#00b4d8]/10 to-[#00b4d8]/5",
    capabilities: ["BioButton Wearable Sensors", "Continuous Vital Sign Monitoring", "AI-Powered Early Warning", "Clinical Dashboard Integration"],
    active: true,
  },
  {
    name: "Starlink",
    tagline: "Satellite Broadband",
    icon: Satellite,
    color: "#1a1a2e",
    bgGradient: "from-[#1a1a2e]/10 to-[#1a1a2e]/5",
    capabilities: ["LEO Satellite Internet", "100+ Mbps Rural Coverage", "Telehealth-Grade Connectivity", "Rapid Deployment for Facilities"],
    active: true,
  },
  {
    name: "Viz.ai",
    tagline: "AI Diagnostic Detection",
    icon: Eye,
    color: "#6366f1",
    bgGradient: "from-[#6366f1]/10 to-[#6366f1]/5",
    capabilities: ["AI Stroke Detection", "Real-Time CT Analysis", "Care Coordination Alerts"],
    active: false,
  },
  {
    name: "Avel eCare",
    tagline: "Telehealth Services",
    icon: Monitor,
    color: "#059669",
    bgGradient: "from-[#059669]/10 to-[#059669]/5",
    capabilities: ["24/7 Virtual Specialty Care", "Emergency Telehealth", "Behavioral Health Support"],
    active: false,
  },
  {
    name: "eClinicalWorks",
    tagline: "Electronic Health Records",
    icon: Stethoscope,
    color: "#e11d48",
    bgGradient: "from-[#e11d48]/10 to-[#e11d48]/5",
    capabilities: ["Cloud-Based EHR Platform", "Patient Portal", "Interoperability Suite"],
    active: false,
  },
];

/* ------------------------------------------------------------------ */
/*  Module Card (Infrastructure & Solutions)                           */
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
/*  Partner Card                                                       */
/* ------------------------------------------------------------------ */

function PartnerCard({ partner }: { partner: FeaturedPartner }) {
  const [hovered, setHovered] = useState(false);
  const Icon = partner.icon;

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={partner.active ? { scale: 1.02, y: -2 } : { scale: 1 }}
      whileTap={partner.active ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl border p-5 transition-all duration-300",
        partner.active
          ? "border-[color:var(--line)] bg-white/90 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)] hover:border-transparent"
          : "border-[color:var(--line)] bg-white/50",
      )}
      style={partner.active && hovered ? { borderColor: `${partner.color}40` } : {}}
    >
      {/* Background gradient on hover */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br transition-opacity duration-300",
          partner.bgGradient,
          partner.active && hovered ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon + Name */}
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
              partner.active ? "" : "grayscale opacity-50",
            )}
            style={{
              backgroundColor: `${partner.color}12`,
              color: partner.active ? partner.color : "var(--muted)",
            }}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className={cn(
              "text-sm font-semibold",
              partner.active ? "text-[color:var(--foreground)]" : "text-[color:var(--muted)]",
            )}>
              {partner.name}
            </h3>
            <p className="text-[11px] text-[color:var(--muted)]">{partner.tagline}</p>
          </div>
        </div>

        {/* Capabilities */}
        {partner.active && (
          <div className="mt-4 space-y-1.5">
            {partner.capabilities.map((cap) => (
              <div key={cap} className="flex items-center gap-2">
                <div
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: partner.color }}
                />
                <span className="text-[11px] text-[color:var(--foreground)]">{cap}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Coming Soon overlay for inactive */}
      {!partner.active && (
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
                <p className="text-[10px] text-[color:var(--muted)]">
                  {fSummary.total} facilities · {bdcSummary.totalBSLs.toLocaleString()} BSLs tracked
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
                    <p className="font-display text-lg font-semibold text-[color:#2b7ab8]">{fSummary.total}</p>
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
/*  Ecosystem Grid                                                     */
/* ------------------------------------------------------------------ */

function EcoGrid() {
  return (
    <div className="space-y-6">
      {/* Featured Partners */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_PARTNERS.map((partner) => (
          <PartnerCard key={partner.name} partner={partner} />
        ))}
      </div>
      {/* Advisory footer */}
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-[color:var(--line)] bg-white/40 px-4 py-3">
        <Users className="h-4 w-4 text-[color:var(--muted)]" />
        <p className="text-[11px] text-[color:var(--muted)]">
          Additional partners including Accenture, KPMG, PwC, CVS Health, American Heart Association, and others support the RHT ecosystem through advisory, clinical, and integration services.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Solutions Grid                                                     */
/* ------------------------------------------------------------------ */

function SolutionsGrid({ sections }: { sections: SolutionSection[] }) {
  return (
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
