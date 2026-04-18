"use client";

import { motion } from "framer-motion";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Database,
  Brain,
  Lock,
  Server,
  Eye,
  FileWarning,
  CheckCircle2,
  Building2,
  Users,
} from "lucide-react";
import { useParams } from "next/navigation";

import { STATE_CONFIGS, type ValidState } from "@/config/states";
import { getKYFacilitySummary } from "@/data/kentucky-facilities";
import { usNum } from "@/lib/utils";
import { ModuleSources } from "@/components/module-sources";

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
/*  Placeholder Card                                                   */
/* ------------------------------------------------------------------ */

function PlaceholderCard({ icon: Icon, title, source }: { icon: React.ElementType; title: string; source: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[color:var(--line)] bg-white/60 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--surface-soft)]">
          <Icon className="h-5 w-5 text-[color:var(--muted)]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[color:var(--foreground)]">{title}</h3>
          <p className="text-xs text-[color:var(--muted)]">Data coming soon &mdash; {source}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Kentucky Cybersecurity Content                                     */
/* ------------------------------------------------------------------ */

function KentuckyCybersecurity() {
  const fSummary = getKYFacilitySummary();

  return (
    <>
      {/* ── Status Overview ───────────────────────────────────── */}
      <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[color:var(--line)] bg-white/90 p-5 shadow-[var(--shadow-soft)]">
          <ShieldAlert className="h-6 w-6 text-[color:var(--accent)]" />
          <p className="mt-3 font-display text-3xl font-semibold text-[color:var(--foreground)]">{usNum(fSummary.total)}</p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">Facilities requiring assessment</p>
        </div>
        <div className="rounded-2xl border border-[color:var(--line)] bg-white/90 p-5 shadow-[var(--shadow-soft)]">
          <ShieldCheck className="h-6 w-6 text-[color:var(--teal)]" />
          <p className="mt-3 font-display text-3xl font-semibold text-[color:var(--foreground)]">0</p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">Currently assessed</p>
        </div>
        <div className="rounded-2xl border border-[color:var(--line)] bg-white/90 p-5 shadow-[var(--shadow-soft)]">
          <Shield className="h-6 w-6 text-[color:#2b7ab8]" />
          <p className="mt-3 font-display text-3xl font-semibold text-[color:var(--foreground)]">700+</p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">Rural hospitals nationally on Azure cybersecurity</p>
        </div>
      </motion.div>

      {/* ── Microsoft Azure Section ───────────────────────────── */}
      <motion.div variants={fadeUp} className="rounded-2xl border border-[color:var(--line)] bg-white/90 p-6 shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0078d4]/10">
            <Shield className="h-5 w-5 text-[#0078d4]" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-[color:var(--foreground)]">Microsoft Azure for Healthcare</h2>
            <p className="text-xs text-[color:var(--muted)]">Enterprise-grade security for rural health infrastructure</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-[#0078d4]" />
              <h3 className="text-sm font-semibold text-[color:var(--foreground)]">Azure SQL &amp; Cosmos DB</h3>
            </div>
            <p className="mt-1 text-xs text-[color:var(--muted)]">HIPAA-compliant, encrypted, geo-redundant</p>
          </div>

          <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-[#0078d4]" />
              <h3 className="text-sm font-semibold text-[color:var(--foreground)]">Microsoft Defender for Cloud</h3>
            </div>
            <p className="mt-1 text-xs text-[color:var(--muted)]">Threat detection, vulnerability scanning, compliance</p>
          </div>

          <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-[#0078d4]" />
              <h3 className="text-sm font-semibold text-[color:var(--foreground)]">Azure Sentinel (SIEM)</h3>
            </div>
            <p className="mt-1 text-xs text-[color:var(--muted)]">Real-time SIEM, incident detection, response playbooks</p>
          </div>

          <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
            <div className="flex items-center gap-2">
              <FileWarning className="h-4 w-4 text-[#0078d4]" />
              <h3 className="text-sm font-semibold text-[color:var(--foreground)]">Compliance Manager</h3>
            </div>
            <p className="mt-1 text-xs text-[color:var(--muted)]">HIPAA, HITECH, NIST CSF templates and scoring</p>
          </div>
        </div>
      </motion.div>

      {/* ── Anthropic Section ─────────────────────────────────── */}
      <motion.div variants={fadeUp} className="rounded-2xl border border-[color:var(--line)] bg-white/90 p-6 shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--teal)]/10">
            <Brain className="h-5 w-5 text-[color:var(--teal)]" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-[color:var(--foreground)]">Anthropic Project Glasswing</h2>
            <p className="text-xs text-[color:var(--muted)]">AI-powered threat intelligence for rural healthcare</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-[color:var(--teal)]" />
              <h3 className="text-sm font-semibold text-[color:var(--foreground)]">AI Vulnerability Detection</h3>
            </div>
            <p className="mt-1 text-xs text-[color:var(--muted)]">Network, access, and log analysis for healthcare IT</p>
          </div>

          <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[color:var(--teal)]" />
              <h3 className="text-sm font-semibold text-[color:var(--foreground)]">Threat Analysis &amp; Response</h3>
            </div>
            <p className="mt-1 text-xs text-[color:var(--muted)]">Actionable threat briefings, reduced response time</p>
          </div>
        </div>
      </motion.div>

      {/* ── Assessment Process ────────────────────────────────── */}
      <motion.div variants={fadeUp} className="rounded-2xl border border-[color:var(--line)] bg-white/90 p-6 shadow-[var(--shadow-soft)]">
        <h2 className="font-display text-lg font-semibold text-[color:var(--foreground)]">Assessment Process</h2>
        <p className="mt-1 text-xs text-[color:var(--muted)]">Three-phase cybersecurity onboarding for rural facilities</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            { step: 1, title: "Risk Assessment", desc: "NIST CSF baseline evaluation", icon: FileWarning },
            { step: 2, title: "Enrollment", desc: "Azure security suite deployment", icon: Server },
            { step: 3, title: "Monitoring", desc: "24/7 AI-powered threat detection", icon: CheckCircle2 },
          ].map(({ step, title, desc, icon: StepIcon }) => (
            <div key={step} className="relative rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--foreground)] text-xs font-bold text-white">
                  {step}
                </span>
                <StepIcon className="h-4 w-4 text-[color:#2b7ab8]" />
              </div>
              <h3 className="mt-2 text-sm font-semibold text-[color:var(--foreground)]">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-[color:var(--muted)]">{desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Facility & Workforce Placeholders ─────────────────── */}
      <motion.div variants={fadeUp} className="space-y-4">
        <PlaceholderCard
          icon={Building2}
          title="Facility Readiness (CMS Hospital Compare)"
          source="CMS Hospital Compare and HRSA AHRF facility-level data"
        />
        <PlaceholderCard
          icon={Users}
          title="Workforce Capacity"
          source="HRSA HPSA designations and state workforce registry data"
        />
      </motion.div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const CAPACITY_SOURCES = [
  { name: "CMS Hospital Compare", url: "https://data.cms.gov/provider-data/", detail: "Facility-level quality and operational data for rural hospitals" },
  { name: "HRSA Area Health Resources File", url: "https://data.hrsa.gov/topics/health-workforce/ahrf", detail: "County-level workforce supply indicators" },
  { name: "Microsoft Azure for Healthcare", detail: "Cybersecurity posture assessment and enrollment data via Azure Defender, Sentinel, and Compliance Manager" },
  { name: "HRSA HPSA Designations", detail: "Data coming soon — Health Professional Shortage Area scores pending integration" },
];

export default function CapacityPage() {
  const { state } = useParams<{ state: string }>();
  const validState = state as ValidState;
  const config = STATE_CONFIGS[validState];

  return (
    <div className="p-6 lg:p-10">
      <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-8 max-w-5xl">

        {/* ── Header ─────────────────────────────────────────── */}
        <motion.div variants={fadeUp}>
          <p className="text-xs uppercase tracking-wider text-[color:var(--muted)]">
            {config.name} Infrastructure
          </p>
          <h1 className="mt-2 font-display text-3xl text-[color:var(--foreground)] md:text-4xl">
            Capacity &amp; Readiness
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[color:var(--muted)]">
            Facility readiness, workforce capacity, and cybersecurity posture for rural healthcare in {config.name}.
          </p>
        </motion.div>

        {/* ── State-specific content ─────────────────────────── */}
        {validState === "kentucky" ? (
          <KentuckyCybersecurity />
        ) : (
          <>
            <motion.div variants={fadeUp} className="space-y-4">
              <PlaceholderCard
                icon={Building2}
                title="Facility Readiness (CMS Hospital Compare)"
                source="CMS Hospital Compare and HRSA AHRF facility-level data"
              />
              <PlaceholderCard
                icon={Users}
                title="Workforce Capacity"
                source="HRSA HPSA designations and state workforce registry data"
              />
              <PlaceholderCard
                icon={Shield}
                title="Cybersecurity Program"
                source="Microsoft Azure and Anthropic Glasswing cybersecurity assessment data"
              />
            </motion.div>
          </>
        )}

        {/* ── Sources (collapsed at bottom) ───────────────────── */}
        <ModuleSources sources={CAPACITY_SOURCES} module="Capacity & Readiness" />

      </motion.div>
    </div>
  );
}
