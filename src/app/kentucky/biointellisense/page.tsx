"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Heart,
  Thermometer,
  Wind,
  Droplets,
  Moon,
  Footprints,
  Bell,
  BarChart3,
  Wifi,
  Clock,
  Users,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";

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
/*  BioButton Vital Signs                                              */
/* ------------------------------------------------------------------ */

interface VitalSign {
  name: string;
  icon: React.ElementType;
  value: string;
  unit: string;
  status: "normal" | "warning" | "critical";
  description: string;
}

const VITAL_SIGNS: VitalSign[] = [
  { name: "Heart Rate", icon: Heart, value: "72", unit: "bpm", status: "normal", description: "Continuous single-lead ECG with arrhythmia detection" },
  { name: "Respiratory Rate", icon: Wind, value: "16", unit: "br/min", status: "normal", description: "Impedance pneumography with apnea alerting" },
  { name: "Temperature", icon: Thermometer, value: "98.4", unit: "°F", status: "normal", description: "Continuous skin temperature with fever trending" },
  { name: "SpO2", icon: Droplets, value: "97", unit: "%", status: "normal", description: "Pulse oximetry with desaturation alerts" },
  { name: "Activity", icon: Footprints, value: "2,340", unit: "steps", status: "normal", description: "Accelerometer-based activity and fall detection" },
  { name: "Sleep", icon: Moon, value: "7.2", unit: "hrs", status: "normal", description: "Sleep stage classification and quality scoring" },
];

const STATUS_COLORS = {
  normal: { bg: "bg-[color:rgba(15,124,134,0.08)]", text: "text-[color:var(--teal)]", dot: "bg-[color:var(--teal)]" },
  warning: { bg: "bg-[color:rgba(196,161,42,0.08)]", text: "text-[color:#c49a2e]", dot: "bg-[#c49a2e]" },
  critical: { bg: "bg-[color:rgba(196,97,42,0.08)]", text: "text-[color:var(--accent)]", dot: "bg-[color:var(--accent)]" },
};

/* ------------------------------------------------------------------ */
/*  Interactive Vital Card                                             */
/* ------------------------------------------------------------------ */

function VitalCard({ vital }: { vital: VitalSign }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = vital.icon;
  const colors = STATUS_COLORS[vital.status];

  return (
    <motion.button
      type="button"
      onClick={() => setExpanded((p) => !p)}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="w-full rounded-2xl border border-[color:var(--line)] bg-white/90 p-4 text-left shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-lift)]"
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${colors.bg}`}>
          <Icon className={`h-4.5 w-4.5 ${colors.text}`} />
        </div>
        <div className="flex-1">
          <p className="text-xs text-[color:var(--muted)]">{vital.name}</p>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-xl font-semibold text-[color:var(--foreground)]">{vital.value}</span>
            <span className="text-xs text-[color:var(--muted)]">{vital.unit}</span>
          </div>
        </div>
        <div className={`h-2 w-2 rounded-full ${colors.dot}`} />
      </div>
      {expanded && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 border-t border-[color:var(--line)] pt-3 text-xs leading-relaxed text-[color:var(--muted)]"
        >
          {vital.description}
        </motion.p>
      )}
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function BioIntelliSensePage() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8"
    >
      {/* ── Breadcrumbs ─────────────────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <Breadcrumbs items={[
          { label: "Kentucky", href: "/kentucky" },
          { label: "Ecosystem", href: "/kentucky" },
          { label: "BioIntelliSense" },
        ]} />
      </motion.div>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <p className="text-[0.72rem] uppercase tracking-[0.34em] text-[color:var(--muted)]">
          Kentucky Ecosystem Partner
        </p>
        <h1 className="mt-2 font-display text-3xl text-[color:var(--foreground)] md:text-4xl">
          BioIntelliSense
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[color:var(--muted)]">
          FDA-cleared continuous monitoring with the BioButton — a medical-grade wearable that tracks vital signs 24/7, enabling early intervention and reducing hospital readmissions for rural patients.
        </p>
      </motion.div>

      {/* ── BioButton Overview ────────────────────────────────── */}
      <motion.div variants={fadeUp} className="rounded-2xl border border-[color:var(--line)] bg-white/90 p-6 shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00b4d8]/10">
            <Activity className="h-5 w-5 text-[#00b4d8]" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-[color:var(--foreground)]">The BioButton</h2>
            <p className="text-xs text-[color:var(--muted)]">Coin-sized, disposable wearable sensor</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Clock, label: "30-Day Battery", desc: "Single charge lasts a full monitoring cycle" },
            { icon: Wifi, label: "Bluetooth + Cloud", desc: "Streams data to BioCloud via smartphone relay" },
            { icon: Stethoscope, label: "FDA 510(k) Cleared", desc: "Medical-grade vital sign accuracy" },
            { icon: Bell, label: "AI Early Warning", desc: "Predictive alerts before clinical deterioration" },
          ].map(({ icon: FIcon, label, desc }) => (
            <div key={label} className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-3">
              <FIcon className="h-4 w-4 text-[#00b4d8]" />
              <p className="mt-2 text-xs font-semibold text-[color:var(--foreground)]">{label}</p>
              <p className="mt-0.5 text-xs text-[color:var(--muted)]">{desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Interactive Vital Signs ────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <h2 className="font-display text-lg font-semibold text-[color:var(--foreground)]">Monitored Vital Signs</h2>
        <p className="mt-1 text-xs text-[color:var(--muted)]">Tap any card to see how BioButton captures each metric</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {VITAL_SIGNS.map((vital) => (
            <VitalCard key={vital.name} vital={vital} />
          ))}
        </div>
      </motion.div>

      {/* ── Clinical Dashboard Preview ─────────────────────────── */}
      <motion.div variants={fadeUp} className="rounded-2xl border border-[color:var(--line)] bg-white/90 p-6 shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00b4d8]/10">
            <BarChart3 className="h-5 w-5 text-[#00b4d8]" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-[color:var(--foreground)]">BioCloud Clinical Dashboard</h2>
            <p className="text-xs text-[color:var(--muted)]">Population health view for care teams</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4 text-center">
            <p className="font-display text-3xl font-semibold text-[color:var(--teal)]">94%</p>
            <p className="mt-1 text-xs text-[color:var(--muted)]">Patient compliance rate</p>
            <p className="text-xs text-[color:var(--muted)]">(industry avg: ~60%)</p>
          </div>
          <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4 text-center">
            <p className="font-display text-3xl font-semibold text-[color:var(--foreground)]">89%</p>
            <p className="mt-1 text-xs text-[color:var(--muted)]">Reduction in preventable readmissions</p>
            <p className="text-xs text-[color:var(--muted)]">(published clinical studies)</p>
          </div>
          <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4 text-center">
            <p className="font-display text-3xl font-semibold text-[color:#2b7ab8]">24/7</p>
            <p className="mt-1 text-xs text-[color:var(--muted)]">Continuous monitoring</p>
            <p className="text-xs text-[color:var(--muted)]">(vs. spot-checks every 4-8 hrs)</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-dashed border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
          <p className="text-xs font-medium text-[color:var(--foreground)]">How it connects to RHT</p>
          <p className="mt-1 text-xs leading-relaxed text-[color:var(--muted)]">
            BioButton enables post-discharge monitoring for rural patients who would otherwise need to travel hours for follow-up visits. Combined with Starlink broadband coverage and telehealth platforms, a rural facility can monitor chronic disease patients remotely — catching deterioration early, reducing ER visits, and keeping patients closer to home.
          </p>
        </div>
      </motion.div>

      {/* ── Use Cases ─────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="rounded-2xl border border-[color:var(--line)] bg-white/90 p-6 shadow-[var(--shadow-soft)]">
        <h2 className="font-display text-lg font-semibold text-[color:var(--foreground)]">Rural Health Use Cases</h2>
        <p className="mt-1 text-xs text-[color:var(--muted)]">How BioButton fits into Kentucky&apos;s RHT framework</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            {
              title: "Post-Surgical Monitoring",
              desc: "Patients discharged from Critical Access Hospitals can be monitored remotely during recovery. BioButton detects infection indicators (fever, tachycardia, respiratory changes) before they become emergencies.",
              icon: Heart,
            },
            {
              title: "Chronic Disease Management",
              desc: "Continuous monitoring for diabetes, COPD, and heart failure patients. AI algorithms identify decompensation patterns days before clinical symptoms appear, enabling proactive telehealth intervention.",
              icon: Activity,
            },
            {
              title: "Maternal Health in Maternity Deserts",
              desc: "Remote monitoring for high-risk pregnancies in Kentucky's 40 maternity desert counties. Track maternal vitals between prenatal visits, flagging pre-eclampsia and other risks early.",
              icon: Users,
            },
            {
              title: "Behavioral Health Crisis Prevention",
              desc: "Sleep disruption, reduced activity, and vital sign changes can signal mental health crises. Paired with EmPATH crisis response model, enables earlier intervention for at-risk patients.",
              icon: Moon,
            },
          ].map(({ title, desc, icon: CaseIcon }) => (
            <div key={title} className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
              <div className="flex items-center gap-2">
                <CaseIcon className="h-4 w-4 text-[#00b4d8]" />
                <h3 className="text-sm font-semibold text-[color:var(--foreground)]">{title}</h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[color:var(--muted)]">{desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Footer link ───────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="border-t border-[color:var(--line)] pt-6">
        <Breadcrumbs items={[
          { label: "Kentucky", href: "/kentucky" },
          { label: "BioIntelliSense" },
        ]} />
      </motion.div>
    </motion.div>
  );
}
