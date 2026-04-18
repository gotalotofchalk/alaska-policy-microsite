"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Lock, Pencil, X } from "lucide-react";
import { useState } from "react";

import { useAdmin } from "@/components/admin/admin-context";

interface OverridableStatProps {
  /** Unique key for this data point (e.g., "pike_county_broadband_pct") */
  dataKey: string;
  /** The current displayed value */
  value: string | number;
  /** Label shown above the value */
  label: string;
  /** Data source and vintage */
  source: string;
  /** State and module for override storage */
  state: string;
  module: string;
  /** Optional override that's already been applied */
  override?: {
    stateValue: string;
    note: string;
    createdAt: string;
  };
  /** Additional CSS class for the wrapper */
  className?: string;
  children?: React.ReactNode;
}

export function OverridableStat({
  dataKey,
  value,
  label,
  source,
  state,
  module,
  override,
  className,
  children,
}: OverridableStatProps) {
  const { isAdmin } = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [stateValue, setStateValue] = useState("");
  const [note, setNote] = useState("");
  const [localOverride, setLocalOverride] = useState(override);

  const handleSubmit = () => {
    if (!stateValue.trim() || !note.trim()) return;
    // For now, store in local component state.
    // TODO: persist via API route to Prisma Override table
    setLocalOverride({
      stateValue: stateValue.trim(),
      note: note.trim(),
      createdAt: new Date().toISOString().split("T")[0],
    });
    setModalOpen(false);
    setStateValue("");
    setNote("");
  };

  return (
    <div className={`relative ${className ?? ""}`}>
      {/* Override pencil icon */}
      <button
        type="button"
        onClick={() => isAdmin && setModalOpen(true)}
        className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-md transition-colors"
        title={isAdmin ? "Edit this value" : "Log in as admin to edit this value"}
        disabled={!isAdmin}
      >
        {isAdmin ? (
          <Pencil className="h-3.5 w-3.5 text-[color:var(--muted)] hover:text-[color:var(--foreground)]" />
        ) : (
          <span className="relative">
            <Pencil className="h-3.5 w-3.5 text-[color:var(--muted)] opacity-30" />
            <Lock className="absolute -bottom-0.5 -right-0.5 h-2 w-2 text-[color:var(--muted)] opacity-50" />
          </span>
        )}
      </button>

      {/* Content */}
      {children ?? (
        <div>
          <p className="text-xs text-[color:var(--muted)]">{label}</p>
          <p className="font-display text-2xl font-semibold text-[color:var(--foreground)]">
            {localOverride ? localOverride.stateValue : value}
          </p>
          <p className="mt-0.5 text-xs text-[color:var(--muted)]">Source: {source}</p>
        </div>
      )}

      {/* Override annotation */}
      {localOverride && (
        <div className="mt-2 rounded-lg border border-dashed border-[color:var(--teal)]/30 bg-[color:rgba(15,124,134,0.04)] px-3 py-2">
          <p className="text-xs text-[color:var(--foreground)]">
            Federal data: {value} <span className="text-[color:var(--muted)]">({source})</span>
          </p>
          <p className="text-xs text-[color:var(--teal)]">
            State-observed: {localOverride.stateValue}{" "}
            <span className="text-[color:var(--muted)]">
              (updated by admin, {localOverride.createdAt}, note: {localOverride.note})
            </span>
          </p>
        </div>
      )}

      {/* Override modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="absolute right-4 top-4 text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
              >
                <X className="h-4 w-4" />
              </button>

              <h3 className="font-display text-lg font-semibold text-[color:var(--foreground)]">
                Override: {label}
              </h3>

              <div className="mt-4 rounded-lg bg-[color:var(--surface-soft)] p-3">
                <p className="text-xs text-[color:var(--muted)]">Current federal value</p>
                <p className="text-sm font-medium text-[color:var(--foreground)]">{value}</p>
                <p className="mt-0.5 text-xs text-[color:var(--muted)]">{source}</p>
              </div>

              <div className="mt-4">
                <label className="text-xs font-medium text-[color:var(--foreground)]">
                  State-observed corrected value
                </label>
                <input
                  type="text"
                  value={stateValue}
                  onChange={(e) => setStateValue(e.target.value)}
                  placeholder="Enter corrected value"
                  className="field-shell mt-1 w-full text-sm"
                />
              </div>

              <div className="mt-4">
                <label className="text-xs font-medium text-[color:var(--foreground)]">
                  Note explaining the correction <span className="text-[color:var(--accent)]">*</span>
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Why is the federal value incorrect?"
                  rows={3}
                  className="field-shell mt-1 w-full resize-none text-sm"
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!stateValue.trim() || !note.trim()}
                className="mt-4 w-full rounded-full bg-[color:var(--foreground)] px-4 py-3 text-white transition-colors hover:bg-[color:#223a54] disabled:opacity-40"
              >
                Submit Override
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
