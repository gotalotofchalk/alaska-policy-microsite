"use client";

import Link from "next/link";

export function SiteFooter() {
  return (
    <footer style={{ background: "var(--foreground)", color: "rgba(245, 239, 223, 0.72)" }}>
      <div className="mx-auto max-w-[1320px] px-12 pt-16 pb-8">
        <div
          className="grid grid-cols-1 gap-12 pb-12 md:grid-cols-[2fr_1fr_1fr_1fr]"
          style={{ borderBottom: "1px solid rgba(245, 239, 223, 0.12)" }}
        >
          {/* Brand + disclaimer */}
          <div>
            <div className="flex items-center gap-2.5" style={{ color: "#f5efdf" }}>
              <div className="h-7 w-7">
                <svg viewBox="0 0 28 28" className="h-full w-full">
                  <polygon
                    points="14,3 26,25 2,25"
                    fill="none"
                    stroke="#f5efdf"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <line x1="5" y1="19" x2="23" y2="19" stroke="var(--teal)" strokeWidth="1.4" />
                  <line x1="8" y1="13" x2="20" y2="13" stroke="#6aa280" strokeWidth="1.4" />
                  <polygon points="14,3 17.3,9 10.7,9" fill="var(--accent-soft)" />
                </svg>
              </div>
              <span
                className="font-display text-[18px] font-semibold"
                style={{ color: "#f5efdf" }}
              >
                RHT<span style={{ color: "rgba(245,239,223,0.5)" }}>-</span>NAV
              </span>
            </div>
            <p
              className="mt-3 max-w-[360px] text-xs leading-relaxed"
              style={{ color: "rgba(245, 239, 223, 0.6)" }}
            >
              The Rural Health Transformation Navigator. An academic origin at
              Stanford, co-developed with the RHT Collaborative in partnership
              with Microsoft. Bipartisan, vendor-neutral, evidence-based. Built
              to last.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {["WCAG 2.2 AA", "HIPAA", "FHIR R4", "SOC 2"].map((badge) => (
                <span
                  key={badge}
                  className="font-mono px-2.5 py-1 text-[10px] tracking-[0.08em]"
                  style={{
                    border: "1px solid rgba(245, 239, 223, 0.2)",
                    color: "rgba(245, 239, 223, 0.75)",
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Framework */}
          <div>
            <h5
              className="font-display mb-3.5 text-sm font-medium"
              style={{ color: "#f5efdf" }}
            >
              Framework
            </h5>
            <ul className="space-y-2.5 text-[13px]">
              <li><a href="#pyramid" className="transition-colors hover:text-[#f5efdf]">Three-tier model</a></li>
              <li><a href="#how" className="transition-colors hover:text-[#f5efdf]">How it works</a></li>
              <li><a href="#demo" className="transition-colors hover:text-[#f5efdf]">Kentucky demo</a></li>
              <li><a href="#states" className="transition-colors hover:text-[#f5efdf]">State entry points</a></li>
            </ul>
          </div>

          {/* Methodology */}
          <div>
            <h5
              className="font-display mb-3.5 text-sm font-medium"
              style={{ color: "#f5efdf" }}
            >
              Methodology
            </h5>
            <ul className="space-y-2.5 text-[13px]">
              <li><Link href="/kentucky/data-methodology" className="transition-colors hover:text-[#f5efdf]">Readiness scoring</Link></li>
              <li><Link href="/kentucky/data-methodology" className="transition-colors hover:text-[#f5efdf]">Data sources</Link></li>
              <li><a href="#" className="transition-colors hover:text-[#f5efdf]">Override &amp; overrides log</a></li>
              <li><a href="#" className="transition-colors hover:text-[#f5efdf]">AI governance</a></li>
            </ul>
          </div>

          {/* Institution */}
          <div>
            <h5
              className="font-display mb-3.5 text-sm font-medium"
              style={{ color: "#f5efdf" }}
            >
              Institution
            </h5>
            <ul className="space-y-2.5 text-[13px]">
              <li><a href="#collaborative" className="transition-colors hover:text-[#f5efdf]">RHT Collaborative</a></li>
              <li><a href="#" className="transition-colors hover:text-[#f5efdf]">Stanford origin</a></li>
              <li><a href="#" className="transition-colors hover:text-[#f5efdf]">Microsoft partnership</a></li>
              <li><a href="mailto:joshgott@stanford.edu" className="transition-colors hover:text-[#f5efdf]">Contact the team</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="font-mono flex flex-wrap items-center justify-between gap-4 pt-7 text-[11.5px] tracking-wide"
          style={{ color: "rgba(245, 239, 223, 0.5)" }}
        >
          <div>&copy; 2026 RHT-NAV. All rights reserved.</div>
          <div>
            Data governance: county-level aggregation &middot; no PHI &middot;
            every number traceable to a federal source
          </div>
        </div>
      </div>
    </footer>
  );
}
