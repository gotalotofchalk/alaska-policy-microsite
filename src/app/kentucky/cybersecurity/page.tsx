"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
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
} from "lucide-react";
import Link from "next/link";

import { getKYFacilitySummary } from "@/data/kentucky-facilities";
import { usNum } from "@/lib/utils";

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
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function CybersecurityPage() {
  const fSummary = getKYFacilitySummary();

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8"
    >
      {/* ── Back ──────────────────────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <Link
          href="/kentucky"
          className="inline-flex items-center gap-1.5 text-sm text-[color:var(--muted)] transition-colors hover:text-[color:var(--foreground)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Kentucky
        </Link>
      </motion.div>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <p className="text-[0.72rem] uppercase tracking-[0.34em] text-[color:var(--muted)]">
          Kentucky Infrastructure
        </p>
        <h1 className="mt-2 font-display text-3xl text-[color:var(--foreground)] md:text-4xl">
          Cybersecurity Program
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[color:var(--muted)]">
          Protecting rural healthcare facilities through risk assessment, threat detection, and compliance monitoring — powered by Microsoft Azure and Anthropic AI.
        </p>
      </motion.div>

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
              <h3 className="text-sm font-semibold text-[color:var(--foreground)]">Azure SQL & Cosmos DB</h3>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-[color:var(--muted)]">
              HIPAA-compliant database infrastructure with encryption at rest and in transit. Automated backup, geo-redundancy, and disaster recovery for patient data across all rural facilities.
            </p>
          </div>

          <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-[#0078d4]" />
              <h3 className="text-sm font-semibold text-[color:var(--foreground)]">Microsoft Defender for Cloud</h3>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-[color:var(--muted)]">
              Continuous security posture assessment across cloud and hybrid environments. Threat detection, vulnerability scanning, and compliance monitoring tailored for healthcare workloads.
            </p>
          </div>

          <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-[#0078d4]" />
              <h3 className="text-sm font-semibold text-[color:var(--foreground)]">Azure Sentinel (SIEM)</h3>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-[color:var(--muted)]">
              Cloud-native security information and event management. Real-time log aggregation across facility networks, automated incident detection, and response playbooks for healthcare-specific threats.
            </p>
          </div>

          <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
            <div className="flex items-center gap-2">
              <FileWarning className="h-4 w-4 text-[#0078d4]" />
              <h3 className="text-sm font-semibold text-[color:var(--foreground)]">Compliance Manager</h3>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-[color:var(--muted)]">
              Pre-built assessment templates for HIPAA, HITECH, and NIST CSF. Continuous compliance scoring, gap analysis, and remediation tracking across all enrolled facilities.
            </p>
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
            <p className="mt-2 text-[11px] leading-relaxed text-[color:var(--muted)]">
              Claude-powered analysis of network configurations, access patterns, and system logs to identify vulnerabilities before they are exploited. Contextualized for healthcare IT environments.
            </p>
          </div>

          <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[color:var(--teal)]" />
              <h3 className="text-sm font-semibold text-[color:var(--foreground)]">Threat Analysis & Response</h3>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-[color:var(--muted)]">
              Natural-language threat briefings and incident response guidance for facility IT staff. Translates complex security alerts into actionable steps, reducing mean time to respond.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── How It Works ──────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="rounded-2xl border border-[color:var(--line)] bg-white/90 p-6 shadow-[var(--shadow-soft)]">
        <h2 className="font-display text-lg font-semibold text-[color:var(--foreground)]">Assessment Process</h2>
        <p className="mt-1 text-xs text-[color:var(--muted)]">Three-phase cybersecurity onboarding for rural facilities</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            { step: 1, title: "Risk Assessment", desc: "Baseline security posture evaluation using NIST CSF framework. Identifies critical vulnerabilities, compliance gaps, and infrastructure exposure.", icon: FileWarning },
            { step: 2, title: "Enrollment & Deployment", desc: "Azure security tools deployed across facility network. Defender, Sentinel, and Compliance Manager configured for healthcare-specific threat models.", icon: Server },
            { step: 3, title: "Continuous Monitoring", desc: "24/7 threat detection with AI-powered analysis. Ongoing compliance scoring, quarterly assessments, and incident response support.", icon: CheckCircle2 },
          ].map(({ step, title, desc, icon: StepIcon }) => (
            <div key={step} className="relative rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--foreground)] text-[10px] font-bold text-white">
                  {step}
                </span>
                <StepIcon className="h-4 w-4 text-[color:#2b7ab8]" />
              </div>
              <h3 className="mt-2 text-sm font-semibold text-[color:var(--foreground)]">{title}</h3>
              <p className="mt-1 text-[11px] leading-relaxed text-[color:var(--muted)]">{desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Footer link ───────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="border-t border-[color:var(--line)] pt-6">
        <Link
          href="/kentucky"
          className="text-sm text-[color:var(--teal)] underline decoration-[color:var(--teal)]/30 underline-offset-2 hover:decoration-[color:var(--teal)]"
        >
          Back to Kentucky hub
        </Link>
      </motion.div>
    </motion.div>
  );
}
