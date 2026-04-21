"use client";

import Link from "next/link";

const STATE_TILES = [
  {
    badge: "LIVE DEMO",
    abbr: "KY",
    name: "Kentucky",
    desc: "41.6% rural. Quintessential Appalachia plus Delta overlap. Active starlink modeling, BEAD alignment, and CMS reporting scaffold.",
    foot: "120 counties \u00B7 $212.9M FY26",
    active: true,
    href: "/kentucky/overview",
  },
  {
    badge: "FRAMEWORK",
    abbr: "AK",
    name: "Alaska",
    desc: "Extreme geography and tribal health system. Tests the framework\u2019s ability to sequence connectivity where distance itself is the primary burden.",
    foot: "29 boroughs \u00B7 Tribal priority",
    active: false,
    href: "/alaska/overview",
  },
  {
    badge: "FRAMEWORK",
    abbr: "TX",
    name: "Texas",
    desc: "Scale and workforce shortage. East Texas maternal mortality is measured against El Salvador analogs; 25,000 sq mi for 1.6M people.",
    foot: "254 counties \u00B7 $281M FY26",
    active: false,
    href: "/texas/overview",
  },
];

const COMING_SOON = [
  { abbr: "WV", name: "West Virginia" },
  { abbr: "NE", name: "Nebraska" },
  { abbr: "CA", name: "California" },
  { abbr: "NM", name: "New Mexico" },
  { abbr: "MT", name: "Montana" },
  { abbr: "MS", name: "Mississippi" },
];

/* US grid-map state layout (simplified) */
const US_STATES: [string, number, number, "demo" | "framework" | ""][] = [
  ["AK", 0, 3, "framework"], ["WA", 2, 0, ""], ["ID", 3, 0.5, ""], ["MT", 4, 0, ""], ["ND", 5.2, 0, ""], ["MN", 6.4, 0, ""], ["WI", 7.6, 0, ""], ["MI", 8.8, 0.3, ""],
  ["OR", 2, 1, ""], ["NV", 2.8, 1.2, ""], ["WY", 4, 1, ""], ["SD", 5.2, 1, ""], ["IA", 6.2, 1, ""], ["IL", 7.1, 1, ""], ["IN", 8, 1, ""], ["OH", 8.9, 1, ""], ["PA", 9.8, 1, ""], ["NY", 10.6, 0.7, ""], ["ME", 11, 0, ""],
  ["CA", 2, 2, "framework"], ["UT", 3.2, 2, ""], ["CO", 4.2, 2, ""], ["NE", 5.2, 2, "framework"], ["MO", 6.4, 2, ""], ["KY", 7.6, 2, "demo"], ["WV", 8.7, 2, "demo"], ["VA", 9.7, 2, ""], ["NJ", 10.5, 1.5, ""],
  ["AZ", 3.2, 3, ""], ["NM", 4.2, 3, ""], ["KS", 5.2, 3, ""], ["AR", 6.4, 3, ""], ["TN", 7.6, 3, ""], ["NC", 8.9, 3, ""], ["MD", 10, 2.5, ""],
  ["TX", 5, 4, "framework"], ["OK", 5.3, 3.6, ""], ["LA", 6.4, 4, ""], ["MS", 7.4, 4, ""], ["AL", 8.4, 4, ""], ["GA", 9.3, 4, ""], ["SC", 9.8, 3.5, ""],
  ["HI", 2, 4.5, ""], ["FL", 9.6, 4.6, ""],
];

const W = 58, H = 46;

export default function StatesSection() {
  return (
    <section
      id="states"
      className="py-24"
      style={{
        backgroundColor: "var(--bg-soft)",
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div className="mx-auto max-w-[1320px] px-12">
        {/* Header */}
        <div className="mb-16 grid grid-cols-1 items-end gap-16 md:grid-cols-[1fr_1.5fr]">
          <div>
            <div
              className="font-mono mb-5 flex items-center gap-3 text-[11.5px] uppercase tracking-[0.14em]"
              style={{ color: "var(--muted)" }}
            >
              <span style={{ color: "var(--accent)" }}>05</span>
              <span>State entry points</span>
              <span
                className="flex-1"
                style={{ height: 1, background: "var(--line)" }}
              />
            </div>
            <h2
              className="font-display text-5xl leading-[1.05] tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              Every state, a different{" "}
              <em style={{ color: "var(--accent)", fontWeight: 400 }}>
                shape.
              </em>
            </h2>
          </div>
          <p
            className="max-w-[580px] text-[17px] leading-relaxed"
            style={{ color: "var(--ink-2)" }}
          >
            Kentucky is the live demo. Alaska, Texas, Nebraska, and California
            are active state framework views. Adding a new state is a
            configuration change, not a rebuild &mdash; the architecture scales
            horizontally across all 50.
          </p>
        </div>

        {/* US grid map */}
        <div
          className="h-[340px] overflow-hidden rounded-sm"
          style={{
            background: "white",
            border: "1px solid var(--line)",
          }}
        >
          <svg
            viewBox="0 0 960 400"
            preserveAspectRatio="xMidYMid meet"
            className="h-full w-full"
          >
            <defs>
              <pattern
                id="hatch"
                width="6"
                height="6"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="6"
                  stroke="var(--foreground)"
                  strokeWidth="0.5"
                  strokeOpacity="0.15"
                />
              </pattern>
            </defs>
            <text
              x="40"
              y="40"
              fontFamily="var(--font-jetbrains), monospace"
              fontSize="11"
              fill="var(--muted)"
              letterSpacing="0.1em"
            >
              RHT-NAV &middot; NATIONAL VIEW
            </text>
            {US_STATES.map(([abbr, col, row, status]) => {
              const x = 120 + col * (W + 4);
              const y = 70 + row * (H + 4);
              let fill = "var(--background)";
              let stroke = "rgba(12,27,42,0.18)";
              let textFill = "var(--ink-2)";
              if (status === "demo") {
                fill = "var(--accent)";
                stroke = "#a03020";
                textFill = "#ffffff";
              } else if (status === "framework") {
                fill = "url(#hatch)";
                stroke = "rgba(12,27,42,0.35)";
              }
              return (
                <g key={abbr + col}>
                  <rect
                    x={x}
                    y={y}
                    width={W}
                    height={H}
                    rx={2}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={0.7}
                  />
                  <text
                    x={x + W / 2}
                    y={y + H / 2 + 4}
                    textAnchor="middle"
                    fontFamily="var(--font-jetbrains), monospace"
                    fontSize="11"
                    letterSpacing="0.05em"
                    fill={textFill}
                  >
                    {abbr}
                  </text>
                </g>
              );
            })}
            {/* Legend */}
            <g transform="translate(40, 340)">
              <rect x="0" y="0" width="14" height="10" fill="var(--accent)" />
              <text
                x="20"
                y="9"
                fontFamily="var(--font-jetbrains), monospace"
                fontSize="10"
                fill="var(--ink-2)"
              >
                LIVE DEMO
              </text>
              <rect
                x="140"
                y="0"
                width="14"
                height="10"
                fill="url(#hatch)"
                stroke="rgba(12,27,42,0.35)"
                strokeWidth="0.5"
              />
              <text
                x="160"
                y="9"
                fontFamily="var(--font-jetbrains), monospace"
                fontSize="10"
                fill="var(--ink-2)"
              >
                FRAMEWORK VIEW
              </text>
              <rect
                x="320"
                y="0"
                width="14"
                height="10"
                fill="var(--background)"
                stroke="rgba(12,27,42,0.18)"
                strokeWidth="0.6"
              />
              <text
                x="340"
                y="9"
                fontFamily="var(--font-jetbrains), monospace"
                fontSize="10"
                fill="var(--ink-2)"
              >
                ON DECK
              </text>
            </g>
          </svg>
        </div>

        {/* State tiles */}
        <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-4">
          {STATE_TILES.map((tile) => (
            <Link
              key={tile.abbr}
              href={tile.href}
              className="group flex min-h-[260px] cursor-pointer flex-col justify-between rounded-sm bg-white p-7 transition-all hover:-translate-y-0.5"
              style={{
                border: tile.active
                  ? "1px solid var(--accent)"
                  : "1px solid var(--line)",
                background: tile.active
                  ? "linear-gradient(180deg, var(--bg-soft) 0%, white 100%)"
                  : "white",
                boxShadow: "var(--shadow-soft)",
              }}
            >
              <div className="flex items-start justify-between">
                <span
                  className="font-mono rounded-sm px-2 py-1 text-[9.5px] tracking-[0.1em]"
                  style={{
                    background: tile.active
                      ? "var(--accent)"
                      : "var(--line)",
                    color: tile.active ? "white" : "var(--ink-2)",
                  }}
                >
                  {tile.badge}
                </span>
                <span
                  className="font-mono text-[11px]"
                  style={{ color: "var(--muted)" }}
                >
                  {tile.abbr}
                </span>
              </div>
              <div>
                <div
                  className="font-display mt-5 text-[32px] tracking-tight"
                  style={{ color: "var(--foreground)" }}
                >
                  {tile.name}
                </div>
                <p
                  className="mt-2.5 text-[13px] leading-relaxed"
                  style={{ color: "var(--ink-2)" }}
                >
                  {tile.desc}
                </p>
              </div>
              <div
                className="font-mono mt-6 flex items-center justify-between text-[11.5px]"
                style={{ color: "var(--muted)" }}
              >
                <span>{tile.foot}</span>
                <span
                  className="text-sm transition-transform group-hover:translate-x-1"
                  style={{ color: "var(--foreground)" }}
                >
                  &rarr;
                </span>
              </div>
            </Link>
          ))}

          {/* Coming soon */}
          <div
            className="flex min-h-[260px] flex-col justify-between rounded-sm p-7"
            style={{
              background: "var(--bg-soft)",
              border: "1px dashed var(--line-2)",
            }}
          >
            <div className="flex items-start justify-between">
              <span
                className="font-mono rounded-sm border px-2 py-1 text-[9.5px] tracking-[0.1em]"
                style={{
                  borderColor: "var(--line-2)",
                  color: "var(--ink-2)",
                }}
              >
                ON DECK
              </span>
              <span
                className="font-mono text-[11px]"
                style={{ color: "var(--muted)" }}
              >
                +{COMING_SOON.length}
              </span>
            </div>
            <div>
              <div
                className="font-display mt-5 text-[28px] leading-tight tracking-tight"
                style={{ color: "var(--muted)" }}
              >
                {COMING_SOON.map((s) => s.name).join(", ")}
              </div>
              <p
                className="mt-2.5 text-[13px] leading-relaxed"
                style={{ color: "var(--ink-2)" }}
              >
                Onboarding queue. Configuration ready; data join pending state
                health department sign-off.
              </p>
            </div>
            <div
              className="font-mono mt-6 text-[11.5px]"
              style={{ color: "var(--muted)" }}
            >
              Scoped
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
