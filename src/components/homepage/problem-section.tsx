"use client";

import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const TILES = [
  {
    accent: "#c0392b",
    label: "Residents \u00B7 Broadband gap",
    stat: "45%",
    subtitle: "East Texas without reliable broadband",
    body: "Nearly half of the region lacks the foundational connectivity rail required for telehealth, remote monitoring, and portable diagnostics. Without broadband, downstream health-tech investments cannot reach the patients they are designed to serve.",
    cite: "Source \u00B7 RHT Collaborative field estimate \u00B7 April 2026 \u00B7 FCC BDC v2024.2",
  },
  {
    accent: "#d4a017",
    label: "Clinicians \u00B7 Geography",
    stat: "41.6%",
    subtitle: "Kentucky residents classified as rural",
    body: "1.87 million people spread across 25,000 square miles in the eastern-region analog. Clinicians carry the burden of distance, paper workflows, and fragmented records on skeleton crews \u2014 geography alone compounds every access barrier.",
    cite: "Source \u00B7 U.S. Census ACS 2020\u20132024 \u00B7 HRSA AHRF 2024",
  },
  {
    accent: "#0e8a7d",
    label: "Systems \u00B7 FY26 allocation",
    stat: "$212.9M",
    subtitle: "Kentucky RHTP allocation for FY2026",
    body: "The formula rewards plan quality and measurable impact; it penalizes point solutions that don\u2019t compound. Discretionary allocations can be clawed back if states cannot demonstrate defensible cost-per-outcome ratios within the reporting window.",
    cite: "Source \u00B7 CMS \u00B7 Section 71401 \u00B7 Public Law 119-21",
  },
  {
    accent: "#27ae60",
    label: "Window \u00B7 Proof horizon",
    stat: "12mo",
    subtitle: "To demonstrate a defensible ratio",
    body: "States have one reporting cycle to show measurable outcomes before CMS re-evaluates discretionary funding. The proof horizon is not a suggestion \u2014 it is the structural constraint that shapes every implementation decision.",
    cite: "Source \u00B7 CMS guidance \u00B7 RHT Collaborative methodology",
  },
];

/* ------------------------------------------------------------------ */
/*  Stat Tile (expandable)                                             */
/* ------------------------------------------------------------------ */

function StatTile({
  accent,
  label,
  stat,
  subtitle,
  body,
  cite,
}: (typeof TILES)[number]) {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      className="group relative cursor-pointer text-left transition-shadow duration-200"
      style={{
        background: "#fff",
        border: "1px solid var(--line)",
        borderRadius: "var(--r-lg)",
        padding: 24,
        boxShadow: "0 1px 3px rgba(0,0,0,.06)",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 6px 20px rgba(0,0,0,.08)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 1px 3px rgba(0,0,0,.06)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {/* Left accent stripe */}
      <span
        className="absolute left-0 top-0 h-full"
        style={{ width: 3, background: accent }}
      />

      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <span
          className="font-mono text-[11px] uppercase tracking-[0.12em]"
          style={{ color: "var(--muted)" }}
        >
          {label}
        </span>
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm leading-none transition-transform duration-200"
          style={{
            border: "1px solid var(--line)",
            color: "var(--muted)",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
          aria-hidden
        >
          +
        </span>
      </div>

      {/* Big stat */}
      <div
        className="font-display mt-4 leading-none tracking-tight"
        style={{ fontSize: 64, color: "var(--foreground)" }}
      >
        {stat}
      </div>

      {/* Subtitle */}
      <p
        className="mt-2 text-[15px] leading-snug"
        style={{ color: "var(--ink-2)" }}
      >
        {subtitle}
      </p>

      {/* Expandable area */}
      <div
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: open ? 300 : 0,
          opacity: open ? 1 : 0,
          marginTop: open ? 16 : 0,
        }}
      >
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--ink-2)" }}
        >
          {body}
        </p>
        <span
          className="font-mono mt-3 block text-[10px] tracking-wide"
          style={{ color: "var(--muted)" }}
        >
          {cite}
        </span>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Donut Chart (SVG)                                                  */
/* ------------------------------------------------------------------ */

function DonutChart({ pct }: { pct: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const filled = circ * (pct / 100);
  const gap = circ - filled;

  return (
    <svg
      viewBox="0 0 140 140"
      className="mx-auto"
      style={{ width: 160, height: 160 }}
    >
      {/* Background ring */}
      <circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke="var(--line)"
        strokeWidth="14"
      />
      {/* Filled ring */}
      <circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke="#0e8a7d"
        strokeWidth="14"
        strokeDasharray={`${filled} ${gap}`}
        strokeDashoffset={circ * 0.25}
        strokeLinecap="round"
      />
      {/* Center label */}
      <text
        x="70"
        y="70"
        textAnchor="middle"
        dominantBaseline="central"
        className="font-display"
        style={{ fontSize: 28, fill: "var(--foreground)" }}
      >
        {pct}%
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Section                                                       */
/* ------------------------------------------------------------------ */

export default function ProblemSection() {
  return (
    <section
      className="py-24"
      style={{
        backgroundColor: "var(--bg-soft)",
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div className="mx-auto max-w-[1320px] px-12">
        {/* ---- Section header ---- */}
        <div className="mb-16 max-w-[820px]">
          <div
            className="font-mono mb-5 flex items-center gap-3 text-[11.5px] uppercase tracking-[0.14em]"
            style={{ color: "var(--muted)" }}
          >
            <span style={{ color: "var(--accent)" }}>01</span>
            <span>The shape of the problem</span>
            <span
              className="flex-1"
              style={{ height: 1, background: "var(--line)" }}
            />
          </div>

          <h2
            className="font-display text-5xl leading-[1.05] tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            One budget window. Three{" "}
            <em className="italic">asymmetric</em> gaps.
          </h2>

          <p
            className="mt-6 max-w-[640px] text-[17px] leading-relaxed"
            style={{ color: "var(--ink-2)" }}
          >
            Rural America doesn&apos;t have one problem &mdash; it has three,
            and they compound. A broadband gap that blocks access, a geography
            gap that strains clinicians, and a funding window that demands proof
            before the money moves again.
          </p>
        </div>

        {/* ---- 4-column stat tiles ---- */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TILES.map((tile) => (
            <StatTile key={tile.label} {...tile} />
          ))}
        </div>

        {/* ---- Problem composite diagram ---- */}
        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Left card: Broadband coverage bar */}
          <div
            style={{
              background: "#fff",
              border: "1px solid var(--line)",
              borderRadius: "var(--r-lg)",
              padding: 28,
            }}
          >
            <h3
              className="font-mono mb-6 text-[11px] uppercase tracking-[0.12em]"
              style={{ color: "var(--muted)" }}
            >
              Broadband coverage &middot; East Texas counties
            </h3>

            {/* Segmented bar */}
            <div
              className="flex overflow-hidden"
              style={{ height: 32, borderRadius: 6 }}
            >
              <div
                style={{ width: "31%", background: "#0e8a7d" }}
                title="Served 31%"
              />
              <div
                style={{ width: "24%", background: "#d4a017" }}
                title="Underserved 24%"
              />
              <div
                style={{ width: "45%", background: "#c0392b" }}
                title="Unserved 45%"
              />
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-5 text-[13px]">
              {[
                { color: "#0e8a7d", label: "Served", pct: "31%" },
                { color: "#d4a017", label: "Underserved", pct: "24%" },
                { color: "#c0392b", label: "Unserved", pct: "45%" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: item.color }}
                  />
                  <span style={{ color: "var(--ink-2)" }}>
                    {item.label}{" "}
                    <span
                      className="font-mono text-[11px]"
                      style={{ color: "var(--muted)" }}
                    >
                      {item.pct}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right card: Kentucky rural share donut */}
          <div
            className="flex flex-col items-center justify-center text-center"
            style={{
              background: "#fff",
              border: "1px solid var(--line)",
              borderRadius: "var(--r-lg)",
              padding: 28,
            }}
          >
            <h3
              className="font-mono mb-6 text-[11px] uppercase tracking-[0.12em]"
              style={{ color: "var(--muted)" }}
            >
              Kentucky rural share
            </h3>

            <DonutChart pct={41.6} />

            <p
              className="mt-4 text-[14px] leading-relaxed"
              style={{ color: "var(--ink-2)" }}
            >
              1.87M rural residents &middot; 25,000 sq&nbsp;mi
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
