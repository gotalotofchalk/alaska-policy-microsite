"use client";
import { useState } from "react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";

const MAP_VIEWS = [
  { id: "hub-full", label: "Full RHT-NAV Hub", description: "Complete ArcGIS Hub site with all data layers.", url: "https://rht-nav-stanford.hub.arcgis.com/", domain: "all" as const },
  { id: "svi", label: "Social Vulnerability Index", description: "CDC/ATSDR Social Vulnerability Index.", url: "https://rht-nav-stanford.hub.arcgis.com/", domain: "need" as const },
  { id: "disease-burden", label: "Disease Burden", description: "Chronic disease prevalence and behavioral health indicators.", url: "https://rht-nav-stanford.hub.arcgis.com/", domain: "need" as const },
  { id: "provider-access", label: "Provider & Facility Access", description: "Healthcare provider density, HPSA designations, facility locations.", url: "https://rht-nav-stanford.hub.arcgis.com/", domain: "capacity" as const },
  { id: "broadband", label: "Broadband & Connectivity", description: "FCC broadband availability and digital infrastructure.", url: "https://rht-nav-stanford.hub.arcgis.com/", domain: "readiness" as const },
];

const DOMAIN_COLORS = { all: "bg-[color:var(--foreground)] text-white", need: "bg-[color:rgba(196,97,42,0.12)] text-[color:var(--accent)]", capacity: "bg-[color:rgba(16,34,53,0.1)] text-[color:var(--foreground)]", readiness: "bg-[color:rgba(15,124,134,0.12)] text-[color:var(--teal)]" };

export default function MapPage() {
  const [activeView, setActiveView] = useState(MAP_VIEWS[0]);
  return (
    <>
      <PageHero eyebrow="Interactive Map" title="Explore the data layers that feed severity and readiness scoring." lede="Each layer maps to one of the three RHT-NAV assessment domains." compact />
      <Reveal>
        <section className="grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <aside className="space-y-2">
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[color:var(--muted)]">Map layers</p>
            {MAP_VIEWS.map((view) => (
              <button key={view.id} type="button" onClick={() => setActiveView(view)} className={`w-full rounded-[1.2rem] border p-3 text-left transition-all ${activeView.id === view.id ? "border-[color:var(--foreground)] bg-[color:#102235] text-white shadow-lg" : "border-[color:var(--line)] bg-white/80 text-[color:var(--foreground)] hover:bg-white"}`}>
                <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${activeView.id === view.id ? "bg-white/15 text-white/80" : DOMAIN_COLORS[view.domain]}`}>{view.domain === "all" ? "All" : `Domain: ${view.domain}`}</span>
                <p className="mt-1.5 text-sm font-medium">{view.label}</p>
                <p className={`mt-1 text-xs leading-5 ${activeView.id === view.id ? "text-white/65" : "text-[color:var(--muted)]"}`}>{view.description}</p>
              </button>
            ))}
          </aside>
          <div className="surface-card overflow-hidden rounded-[2rem] border">
            <div className="flex items-center justify-between border-b border-[color:var(--line)] px-5 py-3">
              <div><p className="font-medium text-[color:var(--foreground)]">{activeView.label}</p><p className="text-xs text-[color:var(--muted)]">{activeView.description}</p></div>
              <a href={activeView.url} target="_blank" rel="noreferrer" className="rounded-full border border-[color:var(--line)] bg-white px-3 py-1.5 text-xs text-[color:var(--foreground)] transition-colors hover:bg-[color:#f9f5ee]">Open in ArcGIS Hub</a>
            </div>
            <div className="relative h-[600px] w-full bg-[color:#e8e4dc]"><iframe src={activeView.url} className="absolute inset-0 h-full w-full border-0" title={`RHT-NAV Map: ${activeView.label}`} loading="lazy" allow="geolocation" /></div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
