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
  Eye,
  Stethoscope,
  Video,
  Brain,
  ClipboardList,
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

const SOLUTION_ICONS: Record<string, React.ElementType> = {
  healthy_again: Eye,
  sustainable_access: Video,
  innovative_care: Activity,
  workforce: Brain,
  tech_innovation: ClipboardList,
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
          <p className="mt-0.5 text-xs text-[color:var(--muted)] leading-snug">
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
            <span className="text-xs font-medium text-white">Pending</span>
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

  // Active modules first
  const sorted = [...sections].sort((a, b) => {
    const aActive = a.content === "broadband" || a.content === "cyber" ? 0 : 1;
    const bActive = b.content === "broadband" || b.content === "cyber" ? 0 : 1;
    return aActive - bActive;
  });

  const activeSections = sorted.filter((s) => s.content === "broadband" || s.content === "cyber");
  const pendingSections = sorted.filter((s) => s.content !== "broadband" && s.content !== "cyber");

  return (
    <div className="space-y-4">
    <div className="grid gap-4 sm:grid-cols-2">
      {activeSections.map((section) => {
        const Icon = INFRA_ICONS[section.content] ?? Wifi;

        return (
          <ModuleCard
            key={section.category}
            title={section.content === "broadband" ? "Broadband Map" : section.label}
            subtitle={section.statusSummary}
            icon={Icon}
            accentColor={
              section.content === "broadband" ? "#0f7c86" : "#2b7ab8"
            }
            active={true}
            href={section.hasInteractiveTool ? section.toolRoute : undefined}
          >
            {section.content === "broadband" && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1 rounded-lg bg-[color:rgba(15,124,134,0.08)] px-2.5 py-2 text-center">
                    <p className="font-display text-lg font-semibold text-[color:var(--teal)]">{bdcSummary.pctServed}%</p>
                    <p className="text-xs text-[color:var(--muted)]">Served</p>
                  </div>
                  <div className="flex-1 rounded-lg bg-[color:rgba(196,161,42,0.08)] px-2.5 py-2 text-center">
                    <p className="font-display text-lg font-semibold text-[color:#c49a2e]">
                      {Math.round((bdcSummary.underserved / bdcSummary.totalBSLs) * 1000) / 10}%
                    </p>
                    <p className="text-xs text-[color:var(--muted)]">Underserved</p>
                  </div>
                  <div className="flex-1 rounded-lg bg-[color:rgba(196,97,42,0.08)] px-2.5 py-2 text-center">
                    <p className="font-display text-lg font-semibold text-[color:var(--accent)]">{pctUnserved}%</p>
                    <p className="text-xs text-[color:var(--muted)]">Unserved</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-[color:var(--muted)]">
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
                <p className="text-xs text-[color:var(--muted)]">
                  {usNum(fSummary.total)} facilities · {usNum(bdcSummary.totalBSLs)} BSLs tracked
                </p>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--foreground)] px-3 py-1.5 text-xs font-medium text-white">
                  Open Broadband Map <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            )}

            {section.content === "cyber" && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1 rounded-lg bg-[color:rgba(43,122,184,0.08)] px-2.5 py-2 text-center">
                    <p className="font-display text-lg font-semibold text-[color:var(--foreground)]">0</p>
                    <p className="text-xs text-[color:var(--muted)]">Assessed</p>
                  </div>
                  <div className="flex-1 rounded-lg bg-[color:rgba(43,122,184,0.08)] px-2.5 py-2 text-center">
                    <p className="font-display text-lg font-semibold text-[color:#2b7ab8]">{usNum(fSummary.total)}</p>
                    <p className="text-xs text-[color:var(--muted)]">Total Facilities</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs text-[color:var(--muted)]">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--teal)]" />
                    <span>Microsoft Azure Security</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:#2b7ab8]" />
                    <span>Anthropic Project Glasswing</span>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--foreground)] px-3 py-1.5 text-xs font-medium text-white">
                  View Program <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            )}
          </ModuleCard>
        );
      })}
    </div>

    {/* Collapsed pending modules */}
    {pendingSections.length > 0 && (
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-[color:var(--line)] bg-white/40 px-4 py-3">
        <div className="flex gap-1">
          {pendingSections.map((s) => {
            const PIcon = INFRA_ICONS[s.content] ?? Wifi;
            return <PIcon key={s.category} className="h-3.5 w-3.5 text-[color:var(--muted)] opacity-40" />;
          })}
        </div>
        <p className="text-xs text-[color:var(--muted)]">
          {pendingSections.length} more modules pending — {pendingSections.map((s) => s.label).join(", ")}
        </p>
      </div>
    )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Ecosystem Grid                                                     */
/* ------------------------------------------------------------------ */

interface EcoModule {
  name: string;
  tagline: string;
  icon: React.ElementType;
  color: string;
  active: boolean;
  href?: string;
}

const ECO_MODULES: EcoModule[] = [
  { name: "Microsoft", tagline: "Cloud, AI & cybersecurity platform", icon: Cloud, color: "#0078d4", active: true },
  { name: "BioIntelliSense", tagline: "Remote patient monitoring wearables", icon: Activity, color: "#00b4d8", active: true, href: "/kentucky/biointellisense" },
  { name: "Accenture", tagline: "System integration & advisory", icon: Users, color: "#a100ff", active: false },
  { name: "eClinicalWorks", tagline: "Electronic health records", icon: FileText, color: "#e11d48", active: false },
  { name: "Avel eCare", tagline: "Telehealth services", icon: Heart, color: "#059669", active: false },
  { name: "KPMG / PwC", tagline: "Advisory services", icon: Users, color: "#6b7280", active: false },
];

function EcoGrid() {
  const activeModules = ECO_MODULES.filter((m) => m.active);
  const pendingModules = ECO_MODULES.filter((m) => !m.active);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {activeModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <ModuleCard
              key={mod.name}
              title={mod.name}
              subtitle={mod.tagline}
              icon={Icon}
              accentColor={mod.color}
              active={true}
              href={mod.href}
            >
              {mod.name === "Microsoft" && (
                <div className="space-y-1.5">
                  {["Azure Cloud Infrastructure", "AI/ML Health Analytics", "Cybersecurity for 700+ Rural Hospitals", "Teams Telehealth Integration"].map((cap) => (
                    <div key={cap} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0078d4]" />
                      <span className="text-xs text-[color:var(--foreground)]">{cap}</span>
                    </div>
                  ))}
                </div>
              )}
              {mod.name === "BioIntelliSense" && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    {["BioButton Continuous Monitoring", "FDA-Cleared Vital Signs", "AI Early Warning System", "Clinical Dashboard Integration"].map((cap) => (
                      <div key={cap} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#00b4d8]" />
                        <span className="text-xs text-[color:var(--foreground)]">{cap}</span>
                      </div>
                    ))}
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--foreground)] px-3 py-1.5 text-xs font-medium text-white">
                    Explore BioButton <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              )}
            </ModuleCard>
          );
        })}
      </div>
      {pendingModules.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-dashed border-[color:var(--line)] bg-white/40 px-4 py-3">
          <div className="flex gap-1">
            {pendingModules.map((m) => {
              const PIcon = m.icon;
              return <PIcon key={m.name} className="h-3.5 w-3.5 text-[color:var(--muted)] opacity-40" />;
            })}
          </div>
          <p className="text-xs text-[color:var(--muted)]">
            {pendingModules.length} more partners pending — {pendingModules.map((m) => m.name).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Solutions Grid                                                     */
/* ------------------------------------------------------------------ */

function SolutionsGrid({ sections }: { sections: SolutionSection[] }) {
  const activeSections = sections.filter((s) => s.interventions?.some((i) => i.status === "planned" || i.status === "available"));
  const pendingSections = sections.filter((s) => !s.interventions?.some((i) => i.status === "planned" || i.status === "available"));

  return (
    <div className="space-y-4">
      <p className="text-xs text-[color:var(--muted)]">
        Once infrastructure is assessed and connectivity established, these clinical technologies and programs deliver measurable health outcomes — fewer ER visits, earlier diagnoses, reduced travel burden, and physician time saved.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activeSections.map((section) => {
          const Icon = SOLUTION_ICONS[section.goal] ?? Lightbulb;

          return (
            <ModuleCard
              key={section.goal}
              title={section.label}
              subtitle={section.statusSummary}
              icon={Icon}
              accentColor="var(--accent)"
              active={true}
            >
              {section.interventions && (
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
                        <span className="text-xs text-[color:var(--foreground)]">
                          {intervention.name}
                        </span>
                        <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize", statusColors[intervention.status])}>
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
      {pendingSections.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-dashed border-[color:var(--line)] bg-white/40 px-4 py-3">
          <div className="flex gap-1">
            {pendingSections.map((s) => {
              const PIcon = SOLUTION_ICONS[s.goal] ?? Lightbulb;
              return <PIcon key={s.goal} className="h-3.5 w-3.5 text-[color:var(--muted)] opacity-40" />;
            })}
          </div>
          <p className="text-xs text-[color:var(--muted)]">
            {pendingSections.length} more solution{pendingSections.length > 1 ? "s" : ""} pending — {pendingSections.map((s) => s.label).join(", ")}
          </p>
        </div>
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
