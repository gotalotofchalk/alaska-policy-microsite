"use client";

import { motion } from "framer-motion";
import { FileText, Printer } from "lucide-react";
import { useParams } from "next/navigation";

import { STATE_CONFIGS, type ValidState } from "@/config/states";
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
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const STAKEHOLDER_SOURCES = [
  { name: "Aggregated Module Sources", detail: "Report data is aggregated from Need, Connectivity, Capacity, and Portfolio module sources" },
];

export default function StakeholderReportsPage() {
  const { state } = useParams<{ state: string }>();
  const validState = state as ValidState;
  const config = STATE_CONFIGS[validState];

  return (
    <>
      {/* Print-specific styles: hide sidebar and header when printing */}
      <style jsx global>{`
        @media print {
          nav, aside, header, [data-sidebar], [data-site-header] {
            display: none !important;
          }
          main {
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>

      <div className="p-6 lg:p-10">
        <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-8 max-w-5xl">

          {/* ── Header ─────────────────────────────────────────── */}
          <motion.div variants={fadeUp}>
            <p className="text-xs uppercase tracking-wider text-[color:var(--muted)]">
              {config.name}
            </p>
            <h1 className="mt-2 font-display text-3xl text-[color:var(--foreground)] md:text-4xl">
              Stakeholder Reports
            </h1>
          </motion.div>

          {/* ── Explainer Card ───────────────────────────────────── */}
          <motion.div variants={fadeUp}>
            <div className="rounded-2xl border border-[color:var(--line)] bg-white/90 p-6 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--surface-soft)]">
                  <FileText className="h-5 w-5 text-[color:var(--muted)]" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold text-[color:var(--foreground)]">
                    Print-Friendly Briefs
                  </h2>
                  <p className="text-xs text-[color:var(--muted)]">
                    Formatted for sharing with stakeholders and decision-makers
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs text-[color:var(--muted)]">Ctrl+P / Cmd+P to generate PDF</p>
            </div>
          </motion.div>

          {/* ── Print Button ─────────────────────────────────────── */}
          <motion.div variants={fadeUp}>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-5 py-2.5 text-sm font-medium text-[color:var(--foreground)] transition-colors hover:bg-[color:var(--surface-soft)]"
            >
              <Printer className="h-4 w-4" />
              Print Brief
            </button>
          </motion.div>

          {/* ── Coming Soon ──────────────────────────────────────── */}
          <motion.div variants={fadeUp}>
            <div className="rounded-2xl border border-dashed border-[color:var(--line)] bg-white/60 p-8 text-center">
              <p className="text-sm text-[color:var(--muted)]">
                Report content populates as data modules are completed.
              </p>
            </div>
          </motion.div>

          <ModuleSources sources={STAKEHOLDER_SOURCES} module="Stakeholder Reports" />

        </motion.div>
      </div>
    </>
  );
}
