"use client";

import { useState, useMemo } from "react";
import {
  KY_COUNTY_BROADBAND,
  KY_BROADBAND_SUMMARY,
} from "@/data/kentucky-broadband-data";
import { KY_RHTP, COVERAGE_MODEL } from "@/data/kentucky-config";

/* ------------------------------------------------------------------ */
/*  Types & helpers                                                     */
/* ------------------------------------------------------------------ */

type Tier = "fast-start" | "conditional" | "build-first";

function classifyCounty(pctServed: number): Tier {
  if (pctServed >= 75) return "fast-start";
  if (pctServed >= 60) return "conditional";
  return "build-first";
}

function mapColorStatus(pctServed: number): "served" | "underserved" | "unserved" {
  if (pctServed > 72) return "served";
  if (pctServed >= 55) return "underserved";
  return "unserved";
}

const STATUS_COLORS = {
  served: "var(--green-go)",
  underserved: "var(--amber-flag)",
  unserved: "var(--red-flag)",
} as const;

const TIER_COLORS: Record<Tier, string> = {
  "fast-start": "var(--green-go)",
  conditional: "var(--amber-flag)",
  "build-first": "var(--red-flag)",
};

/* ------------------------------------------------------------------ */
/*  Data layers                                                        */
/* ------------------------------------------------------------------ */

interface DataLayer {
  id: string;
  label: string;
  source: string;
  defaultOn: boolean;
}

const DATA_LAYERS: DataLayer[] = [
  { id: "broadband", label: "Broadband availability", source: "FCC BDC", defaultOn: true },
  { id: "maternity", label: "Maternity deserts", source: "HRSA", defaultOn: true },
  { id: "chronic", label: "Chronic disease hotspots", source: "CDC PLACES", defaultOn: true },
  { id: "closures", label: "Hospital closures", source: "UNC Sheps Center", defaultOn: false },
  { id: "provider", label: "Provider deserts", source: "HRSA HPSA", defaultOn: false },
];

/* ------------------------------------------------------------------ */
/*  Approximate county centroid positions (normalized 0-100 for SVG)    */
/*  Derived from Kentucky geography — simplified for dot-map display   */
/* ------------------------------------------------------------------ */

// Generate approximate positions based on county index for the dot map
// Kentucky is roughly 380mi E-W x 180mi N-S
function getCountyPosition(index: number): { x: number; y: number } {
  // Use a seeded distribution across Kentucky's shape
  const seed = index * 137.508; // golden angle
  const col = index % 12;
  const row = Math.floor(index / 12);
  const x = 8 + (col * 7.5) + ((seed % 5) - 2.5);
  const y = 12 + (row * 7.8) + ((seed % 4) - 2);
  return { x: Math.min(95, Math.max(5, x)), y: Math.min(88, Math.max(8, y)) };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DemoConsole() {
  // Layer toggles
  const [layers, setLayers] = useState<Record<string, boolean>>(
    Object.fromEntries(DATA_LAYERS.map((l) => [l.id, l.defaultOn]))
  );

  // Starlink anchors slider
  const [anchors, setAnchors] = useState(3);

  // Computed data
  const tierCounts = useMemo(() => {
    const counts: Record<Tier, number> = { "fast-start": 0, conditional: 0, "build-first": 0 };
    KY_COUNTY_BROADBAND.forEach((c) => {
      counts[classifyCounty(c.pctServed)]++;
    });
    return counts;
  }, []);

  const householdsReached = anchors * COVERAGE_MODEL.communityDistributionModel.maxHouseholdsPerHub;

  // Monthly cost: Business Standard at bulk rate * anchors
  // Each anchor is one Business Standard terminal
  const bulkMonthly = 250 * 0.10; // $25/mo per terminal at 90% discount
  const monthlyCost = anchors * bulkMonthly * householdsReached / COVERAGE_MODEL.communityDistributionModel.maxHouseholdsPerHub;
  // Simplified: cost per anchor per month
  const monthlyCostPerAnchor = bulkMonthly;
  const totalMonthlyCost = anchors * monthlyCostPerAnchor;

  // Readiness shift: model a +5% boost per anchor to surrounding counties
  // Count counties currently "build-first" that would move to "conditional"
  const shiftedCounties = useMemo(() => {
    const boost = anchors * 1.5; // each anchor improves avg by ~1.5% in target counties
    let shifted = 0;
    KY_COUNTY_BROADBAND.forEach((c) => {
      const currentTier = classifyCounty(c.pctServed);
      const newTier = classifyCounty(c.pctServed + boost);
      if (currentTier !== newTier) shifted++;
    });
    return shifted;
  }, [anchors]);

  const toggleLayer = (id: string) => {
    setLayers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section
      id="demo"
      className="relative py-24 px-6 lg:px-12"
      style={{ backgroundColor: "var(--foreground)" }}
    >
      {/* Section header */}
      <div className="max-w-6xl mx-auto mb-12">
        <p
          className="font-mono text-xs tracking-widest uppercase mb-4"
          style={{ color: "var(--muted)" }}
        >
          03 &middot; Live &middot; Kentucky walkthrough
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-white mb-4">
          Drop a satellite. Watch the{" "}
          <em style={{ color: "var(--accent)", fontStyle: "italic" }}>tiers</em>{" "}
          shift.
        </h2>
        <p className="text-base max-w-2xl" style={{ color: "var(--muted)" }}>
          Kentucky received{" "}
          <span className="text-white font-medium">
            ${(KY_RHTP.beadAllocation / 1_000_000_000).toFixed(1)}B in BEAD funding
          </span>{" "}
          with {(KY_RHTP.beadLeoSatellitePct * 100).toFixed(0)}% earmarked for LEO satellite
          deployments covering ~{KY_RHTP.beadLeoLocations.toLocaleString()} locations.
          This console models how Starlink anchors shift county readiness tiers
          using real Census broadband adoption data.
        </p>
      </div>

      {/* Console panel */}
      <div
        className="max-w-7xl mx-auto rounded-xl overflow-hidden"
        style={{
          backgroundColor: "#0a1726",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2 font-mono text-xs" style={{ color: "var(--muted)" }}>
            <span className="text-white/60">rht-nav</span>
            <span className="text-white/30">/</span>
            <span className="text-white/60">kentucky</span>
            <span className="text-white/30">/</span>
            <span style={{ color: "var(--teal)" }}>broadband &middot; starlink model</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="relative flex h-2 w-2"
            >
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: "var(--green-go)" }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ backgroundColor: "var(--green-go)" }}
              />
            </span>
            <span className="font-mono text-xs font-medium" style={{ color: "var(--green-go)" }}>
              LIVE
            </span>
          </div>
        </div>

        {/* Three-column layout */}
        <div
          className="grid gap-0"
          style={{ gridTemplateColumns: "280px 1fr 320px" }}
        >
          {/* LEFT: Data layers */}
          <div
            className="p-5 space-y-5"
            style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
          >
            <h3 className="font-mono text-xs uppercase tracking-wider text-white/50 mb-3">
              Data layers
            </h3>

            <div className="space-y-3">
              {DATA_LAYERS.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id)}
                  className="flex items-center gap-3 w-full text-left group"
                >
                  {/* Toggle */}
                  <div
                    className="relative w-8 h-4 rounded-full transition-colors flex-shrink-0"
                    style={{
                      backgroundColor: layers[layer.id]
                        ? "var(--teal)"
                        : "rgba(255,255,255,0.1)",
                    }}
                  >
                    <div
                      className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform"
                      style={{
                        transform: layers[layer.id]
                          ? "translateX(17px)"
                          : "translateX(2px)",
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-white/80 leading-tight">
                      {layer.label}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                      {layer.source}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Readiness summary */}
            <div
              className="mt-6 pt-5"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <h3 className="font-mono text-xs uppercase tracking-wider text-white/50 mb-3">
                Readiness summary
              </h3>
              <p className="text-[10px] mb-3" style={{ color: "var(--muted)" }}>
                {KY_BROADBAND_SUMMARY.totalCounties} counties classified by broadband adoption
              </p>
              <div className="space-y-2">
                {(
                  [
                    ["fast-start", "Fast-start", "\u2265 75%"],
                    ["conditional", "Conditional", "60\u201375%"],
                    ["build-first", "Build-first", "< 60%"],
                  ] as [Tier, string, string][]
                ).map(([tier, label, range]) => (
                  <div key={tier} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: TIER_COLORS[tier] }}
                      />
                      <span className="text-xs text-white/70">{label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-white font-medium">
                        {tierCounts[tier]}
                      </span>
                      <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                        {range}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER: Map visualization */}
          <div className="p-5 flex flex-col">
            <div
              className="relative flex-1 rounded-lg overflow-hidden"
              style={{ backgroundColor: "#081320", minHeight: "320px" }}
            >
              {/* Kentucky outline (simplified path) */}
              <svg
                viewBox="0 0 100 60"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Simplified Kentucky silhouette */}
                <path
                  d="M5,20 L8,18 L12,15 L18,14 L22,12 L28,10 L35,9 L42,8 L48,10 L55,11 L60,10 L65,9 L72,10 L78,12 L82,14 L86,16 L90,18 L93,20 L95,22 L94,26 L92,30 L90,33 L87,36 L84,38 L80,40 L76,42 L72,44 L68,45 L64,46 L60,47 L55,48 L50,48 L45,47 L40,46 L35,45 L30,44 L25,42 L20,40 L16,38 L12,36 L9,34 L7,30 L5,26 Z"
                  fill="rgba(255,255,255,0.03)"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="0.3"
                />

                {/* County dots */}
                {KY_COUNTY_BROADBAND.map((county, i) => {
                  const pos = getCountyPosition(i);
                  const status = mapColorStatus(county.pctServed);
                  const color = STATUS_COLORS[status];
                  return (
                    <circle
                      key={county.fips}
                      cx={pos.x}
                      cy={pos.y}
                      r={Math.max(0.6, Math.min(1.4, county.households / 30000))}
                      fill={color}
                      opacity={0.8}
                    >
                      <title>
                        {county.name.replace(", Kentucky", "")}: {county.pctServed}% served
                      </title>
                    </circle>
                  );
                })}

                {/* Starlink anchor pin */}
                <g>
                  {/* Pulsing beam ring */}
                  <circle
                    cx="50"
                    cy="30"
                    r="6"
                    fill="none"
                    stroke="var(--teal)"
                    strokeWidth="0.3"
                    opacity="0.4"
                  >
                    <animate
                      attributeName="r"
                      values="3;8;3"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.6;0.1;0.6"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle
                    cx="50"
                    cy="30"
                    r="1.5"
                    fill="var(--teal)"
                    stroke="white"
                    strokeWidth="0.3"
                  />
                  <text
                    x="50"
                    y="25"
                    textAnchor="middle"
                    fill="var(--teal)"
                    fontSize="2.5"
                    fontFamily="monospace"
                  >
                    STARLINK ANCHOR
                  </text>
                </g>
              </svg>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-5 mt-3 px-2">
              {(
                [
                  ["served", "Served (> 72%)"],
                  ["underserved", "Underserved (55\u201372%)"],
                  ["unserved", "Unserved (< 55%)"],
                ] as [keyof typeof STATUS_COLORS, string][]
              ).map(([status, label]) => (
                <div key={status} className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: STATUS_COLORS[status] }}
                  />
                  <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Controls & metrics */}
          <div
            className="p-5 space-y-5"
            style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}
          >
            {/* Anchor slider */}
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-white/50 mb-3">
                Starlink anchors
              </h3>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={anchors}
                  onChange={(e) => setAnchors(Number(e.target.value))}
                  className="flex-1 accent-[var(--teal)]"
                  style={{ accentColor: "var(--teal)" }}
                />
                <span className="font-mono text-lg text-white font-bold w-8 text-right">
                  {anchors}
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px]" style={{ color: "var(--muted)" }}>1</span>
                <span className="text-[10px]" style={{ color: "var(--muted)" }}>12</span>
              </div>
            </div>

            {/* Households reached */}
            <div
              className="rounded-lg p-3"
              style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
            >
              <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>
                Households reached
              </p>
              <p className="font-mono text-xl text-white font-bold">
                {householdsReached.toLocaleString()}
              </p>
              <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                {COVERAGE_MODEL.communityDistributionModel.maxHouseholdsPerHub} per anchor
                &middot; {COVERAGE_MODEL.communityDistributionModel.coverageRadiusMiles}-mi radius
              </p>
            </div>

            {/* Metric blocks */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className="rounded-lg p-3"
                style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
              >
                <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>
                  Monthly cost
                </p>
                <p className="font-mono text-sm text-white font-bold">
                  ${totalMonthlyCost.toLocaleString()}
                </p>
                <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                  at 90% bulk discount
                </p>
              </div>
              <div
                className="rounded-lg p-3"
                style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
              >
                <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>
                  Tier shifts
                </p>
                <p className="font-mono text-sm font-bold" style={{ color: "var(--green-go)" }}>
                  +{shiftedCounties}
                </p>
                <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                  counties upgraded
                </p>
              </div>
            </div>

            {/* Plain-English translator */}
            <div
              className="rounded-lg p-4"
              style={{
                backgroundColor: "rgba(58, 122, 78, 0.1)",
                border: "1px solid rgba(58, 122, 78, 0.25)",
              }}
            >
              <p
                className="font-mono text-[10px] uppercase tracking-wider mb-2"
                style={{ color: "var(--green-go)" }}
              >
                Plain-English translator
              </p>
              <p className="text-xs leading-relaxed text-white/80">
                At {COVERAGE_MODEL.beadThreshold.download} Mbps per household, this anchor
                supports a full family on telehealth simultaneously, RPM streams from up to
                4 BioButton wearables, and a 1080p butterfly ultrasound feed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom note */}
      <div className="max-w-7xl mx-auto mt-6 flex items-center justify-between px-2">
        <p className="text-[11px]" style={{ color: "var(--muted)" }}>
          Model based on {KY_BROADBAND_SUMMARY.source}. Coverage radius assumes{" "}
          {COVERAGE_MODEL.communityDistributionModel.description.toLowerCase()}.
        </p>
        <a
          href="#"
          className="font-mono text-[11px] transition-colors hover:text-white"
          style={{ color: "var(--teal)" }}
        >
          View assumptions &rarr;
        </a>
      </div>
    </section>
  );
}
