import Link from "next/link";
import { DetailCard } from "@/components/detail-disclosure";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { ALASKA_CONFIG, getGreenRegions, getRedRegions } from "@/data/alaska-assessment";
import { INTERVENTION_CATALOG } from "@/data/intervention-catalog";

export default function Home() {
  const greenCount = getGreenRegions().length;
  const redCount = getRedRegions().length;
  const totalPop = ALASKA_CONFIG.regions.reduce((s, r) => s + r.population, 0);
  const avgSeverity = ALASKA_CONFIG.regions.reduce((s, r) => s + r.scores.deficitSeverityScore, 0) / ALASKA_CONFIG.regions.length;

  return (
    <>
      <PageHero eyebrow="RHT-NAV &middot; Alaska Pilot" title="A state decision framework for sequencing technology-enabled rural health investments." lede="RHT-NAV translates severity data into sequenced, CMS-compliant technology portfolios. Assess need, confirm readiness, select coordinated interventions, and demonstrate measurable outcomes within 12 months.">
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/assess" className="rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm text-white transition-colors hover:bg-[color:#223a54]">View regional assessment</Link>
          <Link href="/portfolio-builder" className="rounded-full border border-[color:var(--line)] bg-white px-5 py-3 text-sm text-[color:var(--foreground)] hover:bg-[color:#f9f5ee]">Build a portfolio</Link>
          <Link href="/map" className="rounded-full border border-[color:var(--line)] bg-white px-5 py-3 text-sm text-[color:var(--foreground)] hover:bg-[color:#f9f5ee]">Explore map layers</Link>
        </div>
      </PageHero>

      <Reveal>
        <section className="grid gap-4 md:grid-cols-4">
          <DetailCard eyebrow="Step 1" title="Assess need" hoverNote="Burden Severity and Access Gap indicators quantify where deficits are most acute." detail={<p>Domain 1 captures health outcomes, disease prevalence, travel distances, and shortage area designations.</p>} tone="paper"><p className="max-w-xs text-sm leading-7 text-[color:var(--muted)]">Quantify burden and access gaps across every major health domain.</p></DetailCard>
          <DetailCard eyebrow="Step 2" title="Measure capacity" hoverNote="Workforce counts, facility financial health, and referral patterns." detail={<p>Domain 2 converts the need picture into a system impact assessment.</p>} tone="teal"><p className="max-w-xs text-sm leading-7 text-[color:var(--muted)]">Evaluate workforce, facilities, and referral infrastructure.</p></DetailCard>
          <DetailCard eyebrow="Step 3" title="Confirm readiness" hoverNote="Digital, operational, policy, and measurement readiness." detail={<p>Domain 3 governs deployment sequencing.</p>} tone="warm"><p className="max-w-xs text-sm leading-7 text-[color:var(--muted)]">Check digital, operational, policy, and measurement infrastructure.</p></DetailCard>
          <DetailCard eyebrow="Step 4" title="Select portfolio" hoverNote="Coordinated intervention bundles outperform isolated point solutions." detail={<p>The compliance gate confirms CMS alignment. The synergy analysis flags disconnected tools.</p>} tone="navy"><p className="max-w-xs text-sm leading-7 text-[color:var(--muted)]">Build CMS-compliant bundles with synergy scoring.</p></DetailCard>
        </section>
      </Reveal>

      <Reveal delay={0.06}>
        <section className="surface-card rounded-[2rem] p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[color:var(--muted)]">Alaska pilot state</p>
              <h2 className="mt-3 font-display text-4xl text-[color:var(--foreground)]">Seven regions, two tiers, one coordinated portfolio.</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[color:var(--muted)]">Alaska was selected as the pilot because it represents one of the most structurally challenging rural healthcare environments in the United States.</p>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <MiniStat label="Population" value={totalPop.toLocaleString()} />
                <MiniStat label="RHTP/year" value={`$${Math.round(ALASKA_CONFIG.rhtpAwardPerYear / 1e6)}M`} />
                <MiniStat label="Avg severity" value={avgSeverity.toFixed(1)} />
                <MiniStat label="Regions" value={String(ALASKA_CONFIG.regions.length)} />
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <TierCard tier="green" label="Fast-Start" count={greenCount} />
                <TierCard tier="red" label="Build-First" count={redCount} />
              </div>
              <div className="rounded-[1.4rem] border border-[color:var(--line)] bg-white/75 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Severity vs. readiness</p>
                <div className="relative mt-3 h-44 rounded-xl border border-[color:var(--line)] bg-[linear-gradient(90deg,rgba(196,97,42,0.08),rgba(255,255,255,0.82)_48%,rgba(15,124,134,0.1))]">
                  {ALASKA_CONFIG.regions.map((r) => (<div key={r.slug} className="absolute flex -translate-x-1/2 translate-y-1/2 flex-col items-center gap-0.5" style={{left:`${r.scores.executionReadinessScore}%`,bottom:`${r.scores.deficitSeverityScore}%`}}><div className={`h-3.5 w-3.5 rounded-full border-2 border-white shadow-md ${r.tier === "green" ? "bg-[color:var(--teal)]" : r.pathway === "coordination-hub" ? "bg-[color:#182f4a]" : "bg-[color:var(--accent)]"}`} /><span className="rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-medium text-[color:var(--foreground)] shadow-sm">{r.name}</span></div>))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.14}>
        <section className="grid gap-4 md:grid-cols-3">
          <ContextCard label="Program" value="$50B over 5 years" note="RHTP authorized under the One Big Beautiful Bill Act. Alaska: $272M/year." />
          <ContextCard label="Accountability" value="12-month window" note="First CMS performance assessments in October 2026." />
          <ContextCard label="Constraint" value="$1.1T Medicaid cuts" note="The investment is temporary. The Medicaid reductions are permanent." />
        </section>
      </Reveal>
    </>
  );
}

function MiniStat({label,value}:{label:string;value:string}) { return (<div className="rounded-xl border border-[color:var(--line)] bg-white/75 px-3 py-2.5"><p className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">{label}</p><p className="mt-1 font-display text-xl leading-none text-[color:var(--foreground)]">{value}</p></div>); }
function TierCard({tier,label,count}:{tier:"green"|"red";label:string;count:number}) { return (<div className={`rounded-[1.3rem] border p-4 ${tier === "green" ? "border-[color:rgba(15,124,134,0.2)] bg-[linear-gradient(180deg,rgba(15,124,134,0.08),rgba(255,255,255,0.92))]" : "border-[color:rgba(196,97,42,0.2)] bg-[linear-gradient(180deg,rgba(196,97,42,0.08),rgba(255,255,255,0.92))]"}`}><div className="flex items-center gap-2"><div className={`h-3 w-3 rounded-full ${tier === "green" ? "bg-[color:var(--teal)]" : "bg-[color:var(--accent)]"}`} /><span className="text-xs font-medium uppercase tracking-wider text-[color:var(--foreground)]">{label}</span></div><p className="mt-2 font-display text-3xl text-[color:var(--foreground)]">{count}</p></div>); }
function ContextCard({label,value,note}:{label:string;value:string;note:string}) { return (<article className="surface-card rounded-[1.7rem] border p-5"><p className="text-[0.72rem] uppercase tracking-[0.28em] text-[color:var(--muted)]">{label}</p><p className="mt-3 font-display text-[2.2rem] leading-none text-[color:var(--foreground)]">{value}</p><p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{note}</p></article>); }
