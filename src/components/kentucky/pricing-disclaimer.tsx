"use client";

import { AlertTriangle } from "lucide-react";

interface PricingDisclaimerProps {
  discountPct: number;
  planName: string;
  retailHardware: number;
  retailMonthly: number;
  compact?: boolean;
}

export function PricingDisclaimer({
  discountPct,
  planName,
  retailHardware,
  retailMonthly,
  compact = false,
}: PricingDisclaimerProps) {
  return (
    <div className="rounded-xl border border-amber-300/60 bg-amber-50/80 p-3">
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <div className="space-y-1">
          <p className="text-xs font-medium text-amber-900">
            Pricing assumption: {discountPct}% bulk discount
          </p>
          <p className="text-[11px] leading-[1.6] text-amber-800">
            All cost estimates assume a {discountPct}% discount off Starlink retail
            pricing ({planName}: ${retailHardware} hardware, ${retailMonthly}/mo
            service at retail).{" "}
            <span className="font-medium">
              No published government or bulk Starlink pricing tier exists.
            </span>{" "}
            This is a configurable modeling estimate. Adjust the discount in
            the settings panel above to explore alternative scenarios.
          </p>
          {!compact && (
            <p className="text-[10px] leading-[1.5] text-amber-700">
              Sources: Starlink.com residential pricing (Jan 2026 restructure).
              SpaceX&apos;s FCC RDOF award was permanently revoked (Dec 2023). Kentucky
              BEAD Draft Final Proposal (Aug 2025) allocates 25% of $1.1B to LEO
              satellite but does not specify per-terminal procurement rates.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
