import { DisclosureRow } from "@/components/detail-disclosure";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { SeverityReadinessMatrix } from "@/components/severity-readiness-matrix";
import { regionBaselines } from "@/lib/data";
import { formatNumber, formatPercent } from "@/lib/utils";

export default function ExplorePage() {
  const fastStartCount = regionBaselines.filter(
    (region) => region.recommendedPathway === "Fast-start"
  ).length;
  const buildFirstCount = regionBaselines.filter(
    (region) => region.recommendedPathway === "Build-first"
  ).length;
  const highestBurdenRegion = [...regionBaselines].sort(
    (left, right) => right.estimatedAdultsWithDiabetes - left.estimatedAdultsWithDiabetes
  )[0];

  return (
    <>
      <PageHero
        eyebrow="Explore"
        title="Seven Alaska regions, framed as a rollout decision."
        compact
      />

      <Reveal>
        <section className="grid gap-4 md:grid-cols-3">
          <QuickSignal
            label="Highest current burden"
            value={highestBurdenRegion?.name ?? "Anchorage"}
            note={`${formatNumber(
              highestBurdenRegion?.estimatedAdultsWithDiabetes ?? 0
            )} adults with diabetes in the current planning baseline.`}
            tone="paper"
          />
          <QuickSignal
            label="Fast-start regions"
            value={String(fastStartCount)}
            note="Regions whose current readiness suggests they can absorb deployment sooner."
            tone="teal"
          />
          <QuickSignal
            label="Build-first regions"
            value={String(buildFirstCount)}
            note="Regions where infrastructure and referral reliability should be sequenced before scale."
            tone="warm"
          />
        </section>
      </Reveal>

      <Reveal delay={0.04}>
        <SeverityReadinessMatrix regions={regionBaselines} />
      </Reveal>

      <Reveal delay={0.1}>
        <section className="grid gap-4 lg:grid-cols-2">
          {regionBaselines.map((region) => (
            <article key={region.slug} className="surface-card rounded-[1.95rem] p-6 md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[color:var(--muted)]">
                    {region.recommendedPathway}
                  </p>
                  <h2 className="mt-2 font-display text-3xl text-[color:var(--foreground)]">
                    {region.name}
                  </h2>
                </div>
                <div className="rounded-full border border-[color:var(--line)] bg-white px-4 py-2 text-sm text-[color:var(--foreground)]">
                  {region.population > 100000 ? "Population anchor" : "Rural deployment zone"}
                </div>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <Stat label="Population" value={formatNumber(region.population)} />
                <Stat
                  label="Adult diabetes prevalence"
                  value={formatPercent(region.diabetesPrevalencePct)}
                />
                <Stat
                  label="Current eye screening rate"
                  value={formatPercent(region.currentEyeScreeningRatePct)}
                />
                <Stat
                  label="Eligible primary care sites"
                  value={formatNumber(region.eligiblePrimaryCareSites)}
                />
              </div>
              <div className="mt-5 space-y-3">
                <DisclosureRow
                  eyebrow="Pathway"
                  title={region.recommendedPathway}
                  badge={region.population > 100000 ? "Regional anchor" : "Deployment zone"}
                  hoverNote={`This region is currently positioned as ${region.recommendedPathway.toLowerCase()} based on the balance between severity and readiness.`}
                  detail={
                    <p>
                      The pathway is not just a label. It signals whether the region should move
                      quickly with deployment, build readiness first, or carry statewide coordination functions.
                    </p>
                  }
                />
                <div className="grid gap-3 md:grid-cols-2">
                  <ContextCard
                    label="Provider context"
                    value={region.providerContext.label}
                    note={region.providerContext.note}
                    evidenceTier={region.providerContext.evidenceTier}
                  />
                  <ContextCard
                    label="Broadband context"
                    value={region.broadbandContext.label}
                    note={region.broadbandContext.note}
                    evidenceTier={region.broadbandContext.evidenceTier}
                  />
                </div>
              </div>
            </article>
          ))}
        </section>
      </Reveal>
    </>
  );
}

function QuickSignal({
  label,
  value,
  note,
  tone = "paper",
}: {
  label: string;
  value: string;
  note: string;
  tone?: "paper" | "teal" | "warm";
}) {
  const toneClass =
    tone === "teal"
      ? "shadow-soft border-[color:rgba(15,124,134,0.14)] bg-[linear-gradient(180deg,rgba(15,124,134,0.05),rgba(255,255,255,0.92))]"
      : tone === "warm"
        ? "shadow-soft border-[color:rgba(196,97,42,0.14)] bg-[linear-gradient(180deg,rgba(196,97,42,0.05),rgba(255,255,255,0.92))]"
        : "surface-card";

  return (
    <article className={`${toneClass} rounded-[1.7rem] border p-5`}>
      <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[color:var(--muted)]">
        {label}
      </p>
      <p className="mt-3 font-display text-[2.4rem] leading-none text-[color:var(--foreground)]">
        {value}
      </p>
      <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{note}</p>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.3rem] border border-[color:var(--line)] bg-white/75 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">{label}</p>
      <p className="mt-3 font-display text-3xl text-[color:var(--foreground)]">{value}</p>
    </div>
  );
}

function ContextCard({
  label,
  value,
  note,
  evidenceTier,
}: {
  label: string;
  value: string;
  note: string;
  evidenceTier: string;
}) {
  return (
    <DisclosureRow
      eyebrow={label}
      title={value}
      badge={evidenceTier}
      hoverNote={note}
      detail={<p>{note}</p>}
      tone="teal"
    />
  );
}
