"use client";

import { motion } from "framer-motion";
import { Wifi, WifiOff, Signal, Radio, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Connectivity Translator — VALIDATED tier thresholds
 *
 * All tiers sourced from FCC healthcare bandwidth guidance,
 * peer-reviewed telehealth bandwidth literature, and NTIA BEAD
 * statutory requirements. See /[state]/data-methodology for
 * full source citations.
 */

interface Tier {
  level: number;
  label: string;
  range: string;
  capabilities: string;
  source: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const TIERS: Tier[] = [
  {
    level: 1,
    label: "Minimal",
    range: "<4 Mbps",
    capabilities: "Phone calls, asynchronous messaging. Insufficient for real-time video.",
    source: "FCC healthcare bandwidth guidance",
    icon: WifiOff,
    color: "#c46128",
    bgColor: "rgba(196,97,42,0.08)",
  },
  {
    level: 2,
    label: "Basic",
    range: "4–10 Mbps",
    capabilities: "Solo practitioner with basic EHR and standard-definition video consultation.",
    source: "FCC healthcare bandwidth guidance",
    icon: Signal,
    color: "#c49a2e",
    bgColor: "rgba(196,154,46,0.08)",
  },
  {
    level: 3,
    label: "Functional",
    range: "10–25 Mbps",
    capabilities: "Small rural clinic running simultaneous EHR and HD video; remote patient monitoring feasible.",
    source: "FCC healthcare bandwidth guidance; peer-reviewed clinical telehealth literature",
    icon: Wifi,
    color: "#3a9ca5",
    bgColor: "rgba(58,156,165,0.08)",
  },
  {
    level: 4,
    label: "Full Telehealth",
    range: "25–100 Mbps",
    capabilities: "Synchronous audiovisual specialty visits, multi-session telehealth, imaging review.",
    source: "Peer-reviewed telehealth bandwidth literature",
    icon: Radio,
    color: "#0f7c86",
    bgColor: "rgba(15,124,134,0.08)",
  },
  {
    level: 5,
    label: "BEAD Floor",
    range: "100/20 Mbps+",
    capabilities: "Full teleradiology, AI-assisted diagnostics, simultaneous specialty consultations, durable for next-generation clinical applications.",
    source: "NTIA BEAD Program statutory requirements",
    icon: Zap,
    color: "#102235",
    bgColor: "rgba(16,34,53,0.08)",
  },
];

export function ConnectivityTranslator() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-lg font-semibold text-[color:var(--foreground)]">
          Connectivity Translator
        </h3>
        <p className="mt-1 text-xs text-[color:var(--muted)]">
          What bandwidth enables at each tier — validated thresholds from FCC healthcare guidance and NTIA BEAD requirements.
        </p>
      </div>

      <div className="space-y-2">
        {TIERS.map((tier) => {
          const Icon = tier.icon;
          return (
            <motion.div
              key={tier.level}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: tier.level * 0.05 }}
              className="flex items-start gap-3 rounded-xl border border-[color:var(--line)] bg-white/80 p-4"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: tier.bgColor }}
              >
                <Icon className="h-4 w-4" style={{ color: tier.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[color:var(--foreground)]">
                    Tier {tier.level}: {tier.label}
                  </span>
                  <span
                    className={cn("rounded-full px-2 py-0.5 text-xs font-medium")}
                    style={{ backgroundColor: tier.bgColor, color: tier.color }}
                  >
                    {tier.range}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[color:var(--foreground)]">{tier.capabilities}</p>
                <p className="mt-0.5 text-xs text-[color:var(--muted)]">Source: {tier.source}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
