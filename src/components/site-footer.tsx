import Link from "next/link";
export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--line)] bg-[color:#102235] text-white">
      <div className="mx-auto grid max-w-[100rem] gap-8 px-4 py-10 md:grid-cols-[1.3fr_1fr_1fr] md:px-8 lg:px-12">
        <div className="space-y-3">
          <div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10"><span className="text-xs font-bold text-white">RN</span></div><div><p className="text-[0.68rem] uppercase tracking-[0.34em] text-white/45">Rural Health Transformation</p><p className="font-display text-lg font-semibold text-white">RHT-NAV</p></div></div>
          <p className="max-w-xl text-sm leading-7 text-white/60">A state decision framework for sequencing technology-enabled rural health investments under the Rural Health Transformation Program. Developed at Stanford University in collaboration with the RHT Collaborative.</p>
          <p className="text-xs text-white/35">Prepared for academic purposes. Not an official policy document of CMS, Microsoft, or the RHT Collaborative.</p>
        </div>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.28em] text-white/45">Navigate</p>
          <div className="flex flex-wrap gap-2 text-sm text-white/70">
            <Link href="/assess" className="rounded-full border border-white/12 px-3 py-1 hover:bg-white/8">Assessment</Link>
            <Link href="/map" className="rounded-full border border-white/12 px-3 py-1 hover:bg-white/8">Map</Link>
            <Link href="/portfolio-builder" className="rounded-full border border-white/12 px-3 py-1 hover:bg-white/8">Portfolio Builder</Link>
            <Link href="/calculator" className="rounded-full border border-white/12 px-3 py-1 hover:bg-white/8">Calculator</Link>
            <Link href="/assumptions" className="rounded-full border border-white/12 px-3 py-1 hover:bg-white/8">Admin</Link>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.28em] text-white/45">Framework</p>
          <ul className="space-y-2 text-sm text-white/60">
            <li>Need / Capacity / Readiness scoring</li>
            <li>Green (fast-start) / Red (build-first) tiering</li>
            <li>CMS compliance gate with 3+ category minimum</li>
            <li>Synergy analysis across intervention bundles</li>
            <li>12-month time-to-signal feasibility filter</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
