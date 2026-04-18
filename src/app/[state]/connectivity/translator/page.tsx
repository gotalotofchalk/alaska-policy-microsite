"use client";

import { useParams } from "next/navigation";

import { STATE_CONFIGS, type ValidState } from "@/config/states";
import { ConnectivityTranslator } from "@/components/connectivity-translator";
import { ModuleSources } from "@/components/module-sources";

export default function TranslatorPage() {
  const { state } = useParams<{ state: string }>();
  const s = state as ValidState;
  const config = STATE_CONFIGS[s];

  return (
    <div className="py-6 lg:py-10">
      <div className="flex flex-col gap-6 max-w-4xl">
        <div>
          <p className="text-xs uppercase tracking-wider text-[color:var(--muted)]">{config.name} — Connectivity</p>
          <h1 className="mt-2 font-display text-3xl text-[color:var(--foreground)] md:text-4xl">
            Connectivity Translator
          </h1>
        </div>

        <ConnectivityTranslator />

        <ModuleSources
          sources={[
            { name: "FCC Healthcare Bandwidth Guidance", url: "https://www.fcc.gov/health/hcf", detail: "Tiers 1–4 thresholds" },
            { name: "Peer-reviewed telehealth literature", detail: "Tier 4 synchronous specialty requirements" },
            { name: "NTIA BEAD Program", url: "https://broadbandusa.ntia.gov/", detail: "Tier 5 statutory floor (100/20 Mbps)" },
          ]}
          module="Connectivity Translator"
        />
      </div>
    </div>
  );
}
