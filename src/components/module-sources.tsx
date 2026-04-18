"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, ChevronDown, ExternalLink } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Source {
  name: string;
  url?: string;
  detail: string;
}

export function ModuleSources({ sources, module }: { sources: Source[]; module: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-8 border-t border-[color:var(--line)] pt-4">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 text-xs text-[color:var(--muted)] transition-colors hover:text-[color:var(--foreground)]"
      >
        <BookOpen className="h-3.5 w-3.5" />
        <span>Data &amp; Methodology — {module}</span>
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-2">
              {sources.map((s) => (
                <div key={s.name} className="flex items-start justify-between gap-2 rounded-lg bg-white/50 px-3 py-2">
                  <div>
                    <p className="text-xs font-medium text-[color:var(--foreground)]">{s.name}</p>
                    <p className="text-xs text-[color:var(--muted)]">{s.detail}</p>
                  </div>
                  {s.url && (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-[color:var(--teal)]">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
