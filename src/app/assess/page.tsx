import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { ALASKA_CONFIG } from "@/data/alaska-assessment";
import { INTERVENTION_CATALOG } from "@/data/intervention-catalog";
import { CMS_CATEGORY_LABELS } from "@/types/rht-nav";

export default function AssessPage() {
  const regions = ALASKA_CONFIG.regions;
  return (
    <>
      <PageHero eyebrow="Regional Assessment" title="Severity, capacity, readiness, and tier classification." compact />
      <Reveal>
        <section className="grid gap-4 lg:grid-cols-2">
          {regions.map((region) => {
            const tierColor = region.tier === "green" ? "border-[color:rgba(15,124,134,0.2)] bg-[linear-gradient(180deg,rgba(15,124,134,0.04),rgba(255,255,255,0.96))]" : "border-[color:rgba(196,97,42,0.2)] bg-[linear-gradient(180deg,rgba(196,97,42,0.04),rgba(255,255,255,0.96))]";
            const tierLabel = region.pathway === "coordination-hub" ? "Coordination Hub" : region.tier === "green" ? "Fast-Start" : "Build-First";
            return (
              <article key={region.slug} className={`rounded-[1.9rem] border p-6 shadow-[var(--shadow-soft)] ${tierColor}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${region.tier === "green" ? "bg-[color:var(--teal)]" : "bg-[color:var(--accent)]"}`} />
                      <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">{tierLabel}</span>
                    </div>
                    <h2 className="mt-2 font-display text-3xl text-[color:var(--foreground)]">{region.name}</h2>
                    <p className="mt-1 text-sm text-[color:var(--muted)]">Population: {region.population.toLocaleString("en-US")} &middot; Signal: {region.expectedTimeToSignalMonths} months</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider text-[color:var(--muted)]">Severity / Readiness</p>
                    <p className="mt-1 font-display text-2xl text-[color:var(--foreground)]">{region.scores.deficitSeverityScore.toFixed(0)} / {region.scores.executionReadinessScore.toFixed(0)}</p>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  <ScoreBar label="Deficit Severity" score={region.scores.deficitSeverityScore} color="var(--accent)" subScores={[{label:"Population",value:region.scores.populationImpactSubScore},{label:"System",value:region.scores.systemImpactSubScore},{label:"Equity",value:region.scores.equityImpactSubScore}]} />
                  <ScoreBar label="Execution Readiness" score={region.scores.executionReadinessScore} color="var(--teal)" subScores={[{label:"Digital",value:region.scores.digitalReadinessSubScore},{label:"Operational",value:region.scores.operationalReadinessSubScore},{label:"Policy",value:region.scores.policyReadinessSubScore},{label:"Measurement",value:region.scores.measurementReadinessSubScore}]} />
                </div>
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-wider text-[color:var(--muted)]">Top deficits</p>
                  <ul className="mt-2 space-y-1">{region.topDeficits.map((d) => (<li key={d} className="rounded-lg border border-[color:var(--line)] bg-white/60 px-3 py-2 text-sm text-[color:var(--foreground)]">{d}</li>))}</ul>
                </div>
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-wider text-[color:var(--muted)]">Recommended portfolio</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">{region.recommendedInitiatives.map((type) => { const i = INTERVENTION_CATALOG.find((x) => x.type === type); return (<span key={type} className="rounded-full border border-[color:var(--line)] bg-white/80 px-2.5 py-1 text-xs text-[color:var(--foreground)]">{i?.label ?? type}</span>);})}</div>
                </div>
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-wider text-[color:var(--muted)]">CMS categories covered ({region.cmsCategories.length}/6)</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">{region.cmsCategories.map((cat) => (<span key={cat} className="rounded-full bg-[color:rgba(15,124,134,0.1)] px-2.5 py-1 text-xs text-[color:var(--teal)]">{CMS_CATEGORY_LABELS[cat].split("&")[0].trim()}</span>))}</div>
                </div>
                <div className="mt-5"><Link href={`/portfolio-builder?region=${region.slug}`} className="inline-flex rounded-full border border-[color:var(--line)] bg-white px-4 py-2.5 text-sm text-[color:var(--foreground)] transition-colors hover:bg-[color:#f9f5ee]">Build portfolio for {region.name}</Link></div>
              </article>
            );
          })}
        </section>
      </Reveal>
    </>
  );
}

function ScoreBar({label,score,color,subScores}:{label:string;score:number;color:string;subScores:Array<{label:string;value:number}>}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm"><span className="font-medium text-[color:var(--foreground)]">{label}</span><span className="font-display text-lg text-[color:var(--foreground)]">{score.toFixed(1)}</span></div>
      <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-[color:#efe8db]"><div className="h-full rounded-full transition-all duration-500" style={{width:`${Math.min(score,100)}%`,backgroundColor:color}} /></div>
      <div className="mt-2 flex gap-2">{subScores.map((sub) => (<div key={sub.label} className="flex-1"><div className="flex items-center justify-between text-xs text-[color:var(--muted)]"><span>{sub.label}</span><span>{sub.value}</span></div><div className="mt-0.5 h-1 overflow-hidden rounded-full bg-[color:#efe8db]"><div className="h-full rounded-full opacity-60 transition-all duration-500" style={{width:`${Math.min(sub.value,100)}%`,backgroundColor:color}} /></div></div>))}</div>
    </div>
  );
}
