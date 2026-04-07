"use client";
import { motion } from "framer-motion";
import { AlertTriangle, Check, CheckCircle2, Clock, LinkIcon, Shield, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { ALASKA_CONFIG } from "@/data/alaska-assessment";
import { calculateSynergyScore, checkCMSCompliance, getUnmetPrerequisites, INTERVENTION_CATALOG } from "@/data/intervention-catalog";
import { CMS_CATEGORY_LABELS } from "@/types/rht-nav";

function PortfolioBuilderInner() {
  const searchParams = useSearchParams();
  const initialRegion = searchParams.get("region") ?? ALASKA_CONFIG.regions[0].slug;
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [selectedInterventions, setSelectedInterventions] = useState<Set<string>>(() => { const region = ALASKA_CONFIG.regions.find((r) => r.slug === initialRegion); return new Set(region?.recommendedInitiatives ?? []); });
  const region = ALASKA_CONFIG.regions.find((r) => r.slug === selectedRegion) ?? ALASKA_CONFIG.regions[0];
  const selected = Array.from(selectedInterventions);
  const synergyScore = calculateSynergyScore(selected);
  const compliance = checkCMSCompliance(selected);
  const unmetPrereqs = getUnmetPrerequisites(selected);
  const totalCostLow = INTERVENTION_CATALOG.filter((i) => selected.includes(i.type)).reduce((s, i) => s + i.estimatedCostRange.low, 0);
  const totalCostHigh = INTERVENTION_CATALOG.filter((i) => selected.includes(i.type)).reduce((s, i) => s + i.estimatedCostRange.high, 0);
  const timeDistribution = { quickWin: INTERVENTION_CATALOG.filter((i) => selected.includes(i.type) && i.estimatedTimeToSignalMonths <= 5).length, mediumTerm: INTERVENTION_CATALOG.filter((i) => selected.includes(i.type) && i.estimatedTimeToSignalMonths > 5 && i.estimatedTimeToSignalMonths <= 9).length, longHorizon: INTERVENTION_CATALOG.filter((i) => selected.includes(i.type) && i.estimatedTimeToSignalMonths > 9).length };

  function toggleIntervention(type: string) { setSelectedInterventions((prev) => { const next = new Set(prev); if (next.has(type)) next.delete(type); else next.add(type); return next; }); }
  function handleRegionChange(slug: string) { setSelectedRegion(slug); const r = ALASKA_CONFIG.regions.find((x) => x.slug === slug); if (r) setSelectedInterventions(new Set(r.recommendedInitiatives)); }

  return (
    <>
      <PageHero eyebrow="Portfolio Builder" title="Select interventions. Check compliance. Score synergy. Sequence deployment." lede="Build a CMS-compliant technology portfolio for any Alaska region." compact />
      <Reveal>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <section className="space-y-4">
            <div className="surface-card rounded-[1.8rem] border p-5">
              <label className="block space-y-2"><span className="text-sm font-medium text-[color:var(--foreground)]">Region</span>
                <select className="field-shell" value={selectedRegion} onChange={(e) => handleRegionChange(e.target.value)}>{ALASKA_CONFIG.regions.map((r) => (<option key={r.slug} value={r.slug}>{r.name} ({r.tier === "green" ? "Fast-Start" : "Build-First"})</option>))}</select>
              </label>
            </div>
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[color:var(--muted)]">Select interventions ({selected.length} of {INTERVENTION_CATALOG.length})</p>
            <div className="space-y-2">
              {INTERVENTION_CATALOG.map((intervention) => { const isSelected = selectedInterventions.has(intervention.type); const isRecommended = region.recommendedInitiatives.includes(intervention.type); const hasUnmet = isSelected && unmetPrereqs.has(intervention.type);
                return (
                  <motion.button key={intervention.type} type="button" onClick={() => toggleIntervention(intervention.type)} className={`w-full rounded-[1.4rem] border p-4 text-left transition-all ${isSelected ? "border-[color:var(--foreground)] bg-[color:#102235] text-white shadow-lg" : "border-[color:var(--line)] bg-white/80 text-[color:var(--foreground)] hover:bg-white"}`} whileHover={{y:-1}} transition={{type:"spring",stiffness:300,damping:25}}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium">{intervention.label}</p>
                          {isRecommended && <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${isSelected ? "bg-white/15 text-white/70" : "bg-[color:rgba(15,124,134,0.12)] text-[color:var(--teal)]"}`}>Recommended</span>}
                          {hasUnmet && <span className="flex items-center gap-1 rounded-full bg-[color:rgba(196,97,42,0.12)] px-2 py-0.5 text-[10px] text-[color:var(--accent)]"><AlertTriangle className="h-3 w-3" /> Prerequisites needed</span>}
                        </div>
                        <p className={`mt-1 text-xs leading-5 ${isSelected ? "text-white/65" : "text-[color:var(--muted)]"}`}>{intervention.description}</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {intervention.rhtCollaborativePartner && <span className={`rounded-full px-2 py-0.5 text-[10px] ${isSelected ? "bg-white/10 text-white/60" : "bg-[color:var(--line)] text-[color:var(--muted)]"}`}>{intervention.rhtCollaborativePartner.split("/")[0].trim()}</span>}
                          <span className={`rounded-full px-2 py-0.5 text-[10px] ${isSelected ? "bg-white/10 text-white/60" : "bg-[color:var(--line)] text-[color:var(--muted)]"}`}>{intervention.estimatedTimeToSignalMonths}mo signal</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] ${isSelected ? "bg-white/10 text-white/60" : "bg-[color:var(--line)] text-[color:var(--muted)]"}`}>${(intervention.estimatedCostRange.low/1000).toFixed(0)}K-${(intervention.estimatedCostRange.high/1000).toFixed(0)}K</span>
                        </div>
                      </div>
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${isSelected ? "border-white/30 bg-white/20" : "border-[color:var(--line)] bg-white"}`}>{isSelected && <Check className="h-4 w-4 text-white" />}</div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </section>

          <section className="space-y-4 xl:sticky xl:top-24 xl:self-start">
            <div className={`rounded-[1.8rem] border p-5 ${compliance.meetsMinimum ? "border-[color:rgba(15,124,134,0.2)] bg-[linear-gradient(180deg,rgba(15,124,134,0.06),rgba(255,255,255,0.96))]" : "border-[color:rgba(196,97,42,0.2)] bg-[linear-gradient(180deg,rgba(196,97,42,0.06),rgba(255,255,255,0.96))]"}`}>
              <div className="flex items-center gap-2">{compliance.meetsMinimum ? <CheckCircle2 className="h-5 w-5 text-[color:var(--teal)]" /> : <XCircle className="h-5 w-5 text-[color:var(--accent)]" />}<p className="text-sm font-medium text-[color:var(--foreground)]">CMS Compliance: {compliance.categoryCount}/6 categories{compliance.meetsMinimum ? " (meets 3+ minimum)" : " (needs 3+)"}</p></div>
              <div className="mt-3 flex flex-wrap gap-1.5">{Object.entries(CMS_CATEGORY_LABELS).map(([key, label]) => { const active = compliance.categories.has(key); return (<span key={key} className={`rounded-full px-2.5 py-1 text-[10px] ${active ? "bg-[color:var(--teal)] text-white" : "bg-[color:var(--line)] text-[color:var(--muted)]"}`}>{label.split("&")[0].trim()}</span>);})}</div>
            </div>
            <div className="surface-card rounded-[1.8rem] border p-5">
              <div className="flex items-center gap-2"><LinkIcon className="h-4 w-4 text-[color:var(--teal)]" /><p className="text-sm font-medium text-[color:var(--foreground)]">Synergy Score</p></div>
              <p className="mt-2 font-display text-4xl text-[color:var(--foreground)]">{synergyScore}<span className="text-lg text-[color:var(--muted)]">/100</span></p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[color:#efe8db]"><div className="h-full rounded-full bg-[linear-gradient(90deg,#0f7c86,#6dc3c2)] transition-all duration-500" style={{width:`${synergyScore}%`}} /></div>
            </div>
            <div className="surface-card rounded-[1.8rem] border p-5">
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-[color:var(--foreground)]" /><p className="text-sm font-medium text-[color:var(--foreground)]">Time-to-Signal</p></div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-[color:var(--line)] bg-white/70 p-3 text-center"><p className="font-display text-2xl" style={{color:"var(--teal)"}}>{timeDistribution.quickWin}</p><p className="text-[10px] font-medium text-[color:var(--foreground)]">Quick-win</p></div>
                <div className="rounded-xl border border-[color:var(--line)] bg-white/70 p-3 text-center"><p className="font-display text-2xl" style={{color:"var(--foreground)"}}>{timeDistribution.mediumTerm}</p><p className="text-[10px] font-medium text-[color:var(--foreground)]">Medium</p></div>
                <div className="rounded-xl border border-[color:var(--line)] bg-white/70 p-3 text-center"><p className="font-display text-2xl" style={{color:"var(--accent)"}}>{timeDistribution.longHorizon}</p><p className="text-[10px] font-medium text-[color:var(--foreground)]">Long</p></div>
              </div>
              {timeDistribution.quickWin === 0 && selected.length > 0 && <p className="mt-2 rounded-lg bg-[color:rgba(196,97,42,0.1)] px-3 py-2 text-xs text-[color:var(--accent)]">Warning: No quick-win interventions selected.</p>}
            </div>
            {unmetPrereqs.size > 0 && <div className="rounded-[1.8rem] border border-[color:rgba(196,97,42,0.2)] bg-[color:rgba(196,97,42,0.04)] p-5"><div className="flex items-center gap-2"><Shield className="h-4 w-4 text-[color:var(--accent)]" /><p className="text-sm font-medium text-[color:var(--foreground)]">Unmet Prerequisites</p></div><div className="mt-3 space-y-2">{Array.from(unmetPrereqs.entries()).map(([type, missing]) => { const i = INTERVENTION_CATALOG.find((x) => x.type === type); return (<div key={type} className="rounded-lg border border-[color:rgba(196,97,42,0.15)] bg-white/80 px-3 py-2 text-xs"><span className="font-medium">{i?.label}</span> needs: {missing.map((m) => INTERVENTION_CATALOG.find((x) => x.type === m)?.label ?? m).join(", ")}</div>);})}</div></div>}
            <div className="rounded-[1.8rem] border border-[color:rgba(16,34,53,0.1)] bg-[linear-gradient(180deg,#102235,#17314a)] p-5 text-white">
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-white/55">Estimated portfolio cost</p>
              <p className="mt-2 font-display text-3xl">${(totalCostLow/1000).toFixed(0)}K - ${(totalCostHigh/1000).toFixed(0)}K</p>
              <p className="mt-1 text-xs text-white/55">{selected.length} interventions for {region.name}</p>
              <div className="mt-4"><Link href="/calculator" className="block rounded-full bg-white/10 px-3 py-2.5 text-center text-sm text-white/90 transition-colors hover:bg-white/20">Run detailed calculator</Link></div>
            </div>
          </section>
        </div>
      </Reveal>
    </>
  );
}

export default function PortfolioBuilderPage() { return (<Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center text-[color:var(--muted)]">Loading...</div>}><PortfolioBuilderInner /></Suspense>); }
