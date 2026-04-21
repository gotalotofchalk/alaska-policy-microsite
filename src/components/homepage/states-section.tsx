"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  State data                                                         */
/* ------------------------------------------------------------------ */

interface StateInfo {
  abbr: string;
  col: number;
  row: number;
  status: "active" | "pilot" | "wait";
  fullName: string;
  alloc: string;
  counties: number;
  rural: string;
  ready: string;
  slug?: string;
}

const STATES: StateInfo[] = [
  { abbr: "WA", col: 0, row: 0, status: "wait", fullName: "Washington", alloc: "$84M", counties: 39, rural: "14%", ready: "9 fast" },
  { abbr: "MT", col: 1, row: 0, status: "wait", fullName: "Montana", alloc: "$68M", counties: 56, rural: "44%", ready: "7 fast" },
  { abbr: "ND", col: 2, row: 0, status: "wait", fullName: "North Dakota", alloc: "$62M", counties: 53, rural: "41%", ready: "6 fast" },
  { abbr: "MN", col: 3, row: 0, status: "wait", fullName: "Minnesota", alloc: "$142M", counties: 87, rural: "26%", ready: "14 fast" },
  { abbr: "WI", col: 4, row: 0, status: "wait", fullName: "Wisconsin", alloc: "$120M", counties: 72, rural: "30%", ready: "11 fast" },
  { abbr: "MI", col: 5, row: 0, status: "wait", fullName: "Michigan", alloc: "$158M", counties: 83, rural: "25%", ready: "13 fast" },
  { abbr: "NY", col: 6, row: 0, status: "pilot", fullName: "New York", alloc: "$240M", counties: 62, rural: "12%", ready: "18 fast" },
  { abbr: "VT", col: 7, row: 0, status: "wait", fullName: "Vermont", alloc: "$28M", counties: 14, rural: "61%", ready: "3 fast" },
  { abbr: "ME", col: 8, row: 0, status: "wait", fullName: "Maine", alloc: "$46M", counties: 16, rural: "61%", ready: "4 fast" },
  { abbr: "OR", col: 0, row: 1, status: "wait", fullName: "Oregon", alloc: "$88M", counties: 36, rural: "19%", ready: "8 fast" },
  { abbr: "ID", col: 1, row: 1, status: "wait", fullName: "Idaho", alloc: "$44M", counties: 44, rural: "30%", ready: "6 fast" },
  { abbr: "SD", col: 2, row: 1, status: "wait", fullName: "South Dakota", alloc: "$38M", counties: 66, rural: "43%", ready: "5 fast" },
  { abbr: "IA", col: 3, row: 1, status: "active", fullName: "Iowa", alloc: "$126M", counties: 99, rural: "36%", ready: "15 fast" },
  { abbr: "IL", col: 4, row: 1, status: "wait", fullName: "Illinois", alloc: "$186M", counties: 102, rural: "12%", ready: "16 fast" },
  { abbr: "IN", col: 5, row: 1, status: "wait", fullName: "Indiana", alloc: "$142M", counties: 92, rural: "27%", ready: "12 fast" },
  { abbr: "OH", col: 6, row: 1, status: "pilot", fullName: "Ohio", alloc: "$214M", counties: 88, rural: "22%", ready: "17 fast" },
  { abbr: "PA", col: 7, row: 1, status: "wait", fullName: "Pennsylvania", alloc: "$226M", counties: 67, rural: "21%", ready: "16 fast" },
  { abbr: "NJ", col: 8, row: 1, status: "wait", fullName: "New Jersey", alloc: "$92M", counties: 21, rural: "5%", ready: "7 fast" },
  { abbr: "CA", col: 0, row: 2, status: "wait", fullName: "California", alloc: "$312M", counties: 58, rural: "6%", ready: "22 fast" },
  { abbr: "NV", col: 1, row: 2, status: "wait", fullName: "Nevada", alloc: "$46M", counties: 17, rural: "6%", ready: "4 fast" },
  { abbr: "UT", col: 2, row: 2, status: "wait", fullName: "Utah", alloc: "$58M", counties: 29, rural: "10%", ready: "5 fast" },
  { abbr: "CO", col: 3, row: 2, status: "wait", fullName: "Colorado", alloc: "$98M", counties: 64, rural: "14%", ready: "9 fast" },
  { abbr: "KS", col: 4, row: 2, status: "wait", fullName: "Kansas", alloc: "$88M", counties: 105, rural: "26%", ready: "10 fast" },
  { abbr: "MO", col: 5, row: 2, status: "wait", fullName: "Missouri", alloc: "$158M", counties: 114, rural: "30%", ready: "13 fast" },
  { abbr: "KY", col: 6, row: 2, status: "pilot", fullName: "Kentucky", alloc: "$212.9M", counties: 120, rural: "41.6%", ready: "28 fast", slug: "kentucky" },
  { abbr: "WV", col: 7, row: 2, status: "active", fullName: "West Virginia", alloc: "$86M", counties: 55, rural: "51%", ready: "11 fast" },
  { abbr: "VA", col: 8, row: 2, status: "wait", fullName: "Virginia", alloc: "$188M", counties: 95, rural: "24%", ready: "16 fast" },
  { abbr: "AZ", col: 1, row: 3, status: "wait", fullName: "Arizona", alloc: "$118M", counties: 15, rural: "10%", ready: "5 fast" },
  { abbr: "NM", col: 2, row: 3, status: "wait", fullName: "New Mexico", alloc: "$62M", counties: 33, rural: "22%", ready: "6 fast" },
  { abbr: "OK", col: 3, row: 3, status: "wait", fullName: "Oklahoma", alloc: "$124M", counties: 77, rural: "33%", ready: "10 fast" },
  { abbr: "AR", col: 4, row: 3, status: "wait", fullName: "Arkansas", alloc: "$108M", counties: 75, rural: "43%", ready: "9 fast" },
  { abbr: "TN", col: 5, row: 3, status: "pilot", fullName: "Tennessee", alloc: "$174M", counties: 95, rural: "34%", ready: "14 fast" },
  { abbr: "NC", col: 6, row: 3, status: "wait", fullName: "North Carolina", alloc: "$212M", counties: 100, rural: "34%", ready: "18 fast" },
  { abbr: "SC", col: 7, row: 3, status: "wait", fullName: "South Carolina", alloc: "$132M", counties: 46, rural: "34%", ready: "10 fast" },
  { abbr: "TX", col: 3, row: 4, status: "active", fullName: "Texas", alloc: "$362M", counties: 254, rural: "15%", ready: "30 fast", slug: "texas" },
  { abbr: "LA", col: 4, row: 4, status: "wait", fullName: "Louisiana", alloc: "$124M", counties: 64, rural: "27%", ready: "9 fast" },
  { abbr: "MS", col: 5, row: 4, status: "wait", fullName: "Mississippi", alloc: "$92M", counties: 82, rural: "54%", ready: "8 fast" },
  { abbr: "AL", col: 6, row: 4, status: "wait", fullName: "Alabama", alloc: "$126M", counties: 67, rural: "41%", ready: "10 fast" },
  { abbr: "GA", col: 7, row: 4, status: "wait", fullName: "Georgia", alloc: "$202M", counties: 159, rural: "24%", ready: "17 fast" },
  { abbr: "FL", col: 8, row: 4, status: "wait", fullName: "Florida", alloc: "$284M", counties: 67, rural: "10%", ready: "22 fast" },
];

const W = 54, H = 54, GAP = 6, X0 = 48, Y0 = 56;

const STATUS_FILL: Record<string, string> = {
  active: "var(--teal)",
  pilot: "var(--amber-flag)",
  wait: "#e2e6eb",
};

/* ------------------------------------------------------------------ */
/*  Mini county grid (deterministic)                                   */
/* ------------------------------------------------------------------ */

function MiniCountyGrid({ count }: { count: number }) {
  const cols = 20;
  const cells = useMemo(() => {
    const out: { x: number; y: number; fill: string; opacity: number }[] = [];
    for (let i = 0; i < Math.min(count, 120); i++) {
      const c = i % cols;
      const r = Math.floor(i / cols);
      const score = ((i * 37 + 11) % 100) / 100;
      const fill = score > 0.78 ? "var(--teal)" : score > 0.44 ? "var(--amber-flag)" : "var(--red-flag)";
      out.push({ x: 10 + c * 13, y: 10 + r * 13, fill, opacity: 0.55 + score * 0.45 });
    }
    return out;
  }, [count]);

  return (
    <svg viewBox="0 0 300 140" className="h-full w-full">
      {cells.map((cell, i) => (
        <rect key={i} x={cell.x} y={cell.y} width={10} height={10} rx={1.5} fill={cell.fill} opacity={cell.opacity} />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function StatesSection() {
  const [selected, setSelected] = useState("KY");
  const state = STATES.find((s) => s.abbr === selected) ?? STATES.find((s) => s.abbr === "KY")!;

  const statusLabel = state.status === "active" ? "Active \u00B7 live" : state.status === "pilot" ? "Pilot \u00B7 live" : "Foundation ready";
  const statusClass = state.status === "active" ? "active" : state.status === "pilot" ? "pilot" : "wait";

  return (
    <section className="py-24" id="states">
      <div className="mx-auto max-w-[1320px] px-12">
        {/* Header */}
        <div className="mb-14 grid grid-cols-1 items-end gap-12 md:grid-cols-[1fr_1.3fr]">
          <div>
            <div
              className="font-mono mb-4 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.14em]"
              style={{ color: "var(--muted)" }}
            >
              <span style={{ color: "var(--accent)" }}>03</span>
              <span>Pick your state</span>
            </div>
            <h2
              className="font-display text-[46px] leading-[1.05] tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              Every state is a{" "}
              <em style={{ color: "var(--accent)", fontWeight: 400 }}>different</em>{" "}
              month-one.
            </h2>
          </div>
          <p
            className="max-w-[520px] text-base leading-relaxed"
            style={{ color: "var(--ink-2)" }}
          >
            Click a state to preview its readiness dashboard. Active states have
            RHT-NAV signed; pilot states are running live engagements; waiting
            states have pre-built foundation plans ready to activate.
          </p>
        </div>

        {/* Map + preview */}
        <div className="grid grid-cols-1 items-stretch gap-7 lg:grid-cols-[1.6fr_1fr]">
          {/* Map card */}
          <div
            className="overflow-hidden"
            style={{
              background: "white",
              border: "1px solid var(--line)",
              borderRadius: "var(--r-xl)",
              padding: 28,
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <svg viewBox="0 0 640 400" className="w-full" style={{ height: 420 }}>
              <text
                x="48"
                y="34"
                fontFamily="var(--font-jetbrains), monospace"
                fontSize="10"
                fill="var(--muted)"
                letterSpacing="1.5"
              >
                RHT-NAV &middot; NATIONAL COVERAGE &middot; 2026
              </text>
              {STATES.map((s) => {
                const x = X0 + s.col * (W + GAP);
                const y = Y0 + s.row * (H + GAP);
                const isSelected = s.abbr === selected;
                return (
                  <g
                    key={s.abbr}
                    className="cursor-pointer"
                    onClick={() => setSelected(s.abbr)}
                    style={{ transition: "opacity 0.2s" }}
                    opacity={isSelected ? 1 : 0.85}
                  >
                    <rect
                      x={x}
                      y={y}
                      width={W}
                      height={H}
                      rx={6}
                      fill={STATUS_FILL[s.status]}
                      stroke={isSelected ? "var(--foreground)" : "none"}
                      strokeWidth={isSelected ? 2 : 0}
                    />
                    <text
                      x={x + W / 2}
                      y={y + H / 2 + 4}
                      textAnchor="middle"
                      fontFamily="var(--font-jetbrains), monospace"
                      fontSize="10"
                      fontWeight="500"
                      fill={s.status === "wait" ? "var(--muted)" : "white"}
                    >
                      {s.abbr}
                    </text>
                  </g>
                );
              })}
            </svg>
            {/* Legend */}
            <div className="mt-4 flex gap-5 text-xs" style={{ color: "var(--ink-2)" }}>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "var(--teal)" }} />
                Active &middot; live with RHT-NAV
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "var(--amber-flag)" }} />
                Pilot &middot; engagement underway
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "#e2e6eb" }} />
                Foundation ready
              </span>
            </div>
          </div>

          {/* State preview */}
          <div
            className="flex flex-col"
            style={{
              background: "white",
              border: "1px solid var(--line)",
              borderRadius: "var(--r-xl)",
              padding: 28,
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {/* Head */}
            <div className="mb-5 flex items-baseline justify-between">
              <span
                className="font-display text-[28px] font-medium leading-none"
                style={{ color: "var(--foreground)" }}
              >
                {state.fullName}
              </span>
              <span
                className="font-mono rounded-full px-2.5 py-1 text-[10px] tracking-[0.1em] uppercase"
                style={{
                  background:
                    statusClass === "active"
                      ? "var(--teal-soft)"
                      : statusClass === "pilot"
                        ? "var(--gold-soft)"
                        : "var(--background)",
                  color:
                    statusClass === "active"
                      ? "var(--teal-deep)"
                      : statusClass === "pilot"
                        ? "var(--amber-flag)"
                        : "var(--muted)",
                }}
              >
                {statusLabel}
              </span>
            </div>

            {/* KPIs */}
            <div className="mb-5 grid grid-cols-2 gap-3">
              {[
                { label: "Allocation", value: state.alloc },
                { label: "Counties", value: String(state.counties) },
                { label: "Rural share", value: state.rural },
                { label: "Readiness", value: state.ready },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  className="rounded-lg p-3.5"
                  style={{ background: "var(--background)" }}
                >
                  <div
                    className="font-mono mb-1.5 text-[9.5px] uppercase tracking-[0.1em]"
                    style={{ color: "var(--muted)" }}
                  >
                    {kpi.label}
                  </div>
                  <div
                    className="font-display text-[26px] leading-none"
                    style={{ color: "var(--foreground)" }}
                  >
                    {kpi.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Mini county map */}
            <div
              className="mb-4 overflow-hidden"
              style={{
                height: 140,
                background: "var(--background)",
                borderRadius: "var(--r-md)",
              }}
            >
              <MiniCountyGrid count={state.counties} />
            </div>

            {/* CTA */}
            <div
              className="mt-auto flex items-center justify-between border-t pt-4"
              style={{ borderColor: "var(--line)" }}
            >
              <Link
                href={state.slug ? `/${state.slug}/overview` : "/states"}
                className="inline-flex items-center gap-2 text-[13.5px] font-medium"
                style={{ color: "var(--foreground)" }}
              >
                Open {state.fullName} dashboard &rarr;
              </Link>
              <span
                className="font-mono text-[10px] uppercase tracking-[0.08em]"
                style={{ color: "var(--muted)" }}
              >
                UPDATED &middot; APR 2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
