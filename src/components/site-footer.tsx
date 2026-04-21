"use client";

import Link from "next/link";

export function SiteFooter() {
  return (
    <footer style={{ background: "var(--bg-soft)", borderTop: "1px solid var(--line)" }}>
      <div className="mx-auto max-w-[1320px] px-12 pt-16 pb-8">
        <div
          className="grid grid-cols-1 gap-12 pb-12 md:grid-cols-4"
          style={{ borderBottom: "1px solid var(--line)" }}
        >
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7">
                <svg viewBox="0 0 28 28" className="h-full w-full">
                  <polygon
                    points="14,3 26,25 2,25"
                    fill="none"
                    stroke="var(--foreground)"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <line x1="5" y1="19" x2="23" y2="19" stroke="var(--teal)" strokeWidth="1.4" />
                  <line x1="8" y1="13" x2="20" y2="13" stroke="var(--sage)" strokeWidth="1.4" />
                  <polygon points="14,3 17.3,9 10.7,9" fill="var(--accent)" />
                </svg>
              </div>
              <span
                className="font-display text-[18px] font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                RHT<span style={{ color: "var(--muted)", fontWeight: 400 }}>-</span>NAV
              </span>
            </div>
            <p
              className="mt-3 max-w-[360px] text-xs leading-relaxed"
              style={{ color: "var(--ink-2)" }}
            >
              Rural Health Transformation Navigator. A product of the RHT Collaborative.
            </p>
          </div>

          {/* Product */}
          <div>
            <h5
              className="font-mono mb-3.5 text-[11px] font-medium uppercase tracking-[0.1em]"
              style={{ color: "var(--muted)" }}
            >
              Product
            </h5>
            <ul className="space-y-2.5 text-[13px]" style={{ color: "var(--ink-2)" }}>
              <li><a href="#pyramid" className="transition-colors hover:text-[var(--accent)]">Framework</a></li>
              <li><a href="#how" className="transition-colors hover:text-[var(--accent)]">How it works</a></li>
              <li><Link href="/states" className="transition-colors hover:text-[var(--accent)]">States</Link></li>
              <li><a href="#" className="transition-colors hover:text-[var(--accent)]">Methodology</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h5
              className="font-mono mb-3.5 text-[11px] font-medium uppercase tracking-[0.1em]"
              style={{ color: "var(--muted)" }}
            >
              Resources
            </h5>
            <ul className="space-y-2.5 text-[13px]" style={{ color: "var(--ink-2)" }}>
              <li><a href="#" className="transition-colors hover:text-[var(--accent)]">Section 71401 primer</a></li>
              <li><a href="#" className="transition-colors hover:text-[var(--accent)]">Data sources</a></li>
              <li><a href="#" className="transition-colors hover:text-[var(--accent)]">Case studies</a></li>
              <li><a href="#" className="transition-colors hover:text-[var(--accent)]">Compliance</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5
              className="font-mono mb-3.5 text-[11px] font-medium uppercase tracking-[0.1em]"
              style={{ color: "var(--muted)" }}
            >
              Contact
            </h5>
            <ul className="space-y-2.5 text-[13px]" style={{ color: "var(--ink-2)" }}>
              <li><a href="#" className="transition-colors hover:text-[var(--accent)]">Request a walkthrough</a></li>
              <li><a href="#" className="transition-colors hover:text-[var(--accent)]">State administrators</a></li>
              <li><a href="#" className="transition-colors hover:text-[var(--accent)]">Press</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="font-mono flex flex-wrap items-center justify-between gap-4 pt-7 text-[11.5px] tracking-wide"
          style={{ color: "var(--muted)" }}
        >
          <div>&copy; 2026 Joshua Gottschalk &middot; All data traceable to federal source</div>
        </div>
      </div>
    </footer>
  );
}
