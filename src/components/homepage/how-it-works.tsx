const STEPS = [
  {
    num: "STEP 01",
    title: "Diagnose",
    body: "Select your state. RHT-NAV scores every county on Need, Capacity, and Readiness using CDC PLACES, HRSA AHRF, FCC BDC, and Census ACS \u2014 then classifies each as fast-start, conditional, or build-first.",
    screenshot: (
      <svg viewBox="0 0 360 180" className="h-full w-full">
        <text
          x="16"
          y="24"
          fontFamily="var(--font-jetbrains), monospace"
          fontSize="9"
          fill="var(--muted)"
          letterSpacing="0.1em"
        >
          READINESS \u00B7 120 COUNTIES
        </text>
        {/* County grid visualization */}
        {Array.from({ length: 120 }).map((_, i) => {
          const col = i % 24;
          const row = Math.floor(i / 24);
          const r = ((i * 37 + 11) % 120) / 120;
          const fill =
            r < 0.24 ? "var(--green-go)" : r < 0.6 ? "var(--amber-flag)" : "var(--red-flag)";
          return (
            <rect
              key={i}
              x={16 + col * 13}
              y={40 + row * 19}
              width={11}
              height={17}
              fill={fill}
              opacity={0.85}
            />
          );
        })}
        <g
          transform="translate(16, 158)"
          fontFamily="var(--font-jetbrains), monospace"
          fontSize="8.5"
          fill="var(--muted)"
        >
          <rect x="0" y="-7" width="8" height="8" fill="var(--green-go)" />
          <text x="12" y="0">Fast-start 28</text>
          <rect x="90" y="-7" width="8" height="8" fill="var(--amber-flag)" />
          <text x="102" y="0">Conditional 44</text>
          <rect x="198" y="-7" width="8" height="8" fill="var(--red-flag)" />
          <text x="210" y="0">Build-first 48</text>
        </g>
      </svg>
    ),
  },
  {
    num: "STEP 02",
    title: "Sequence",
    body: "Drill into a county. Layer broadband, chronic disease, provider deserts, hospital closures. RHT-NAV proposes an intervention portfolio ordered to not skip tiers \u2014 connectivity before wearables, wearables before AI triage.",
    screenshot: (
      <svg viewBox="0 0 360 180" className="h-full w-full">
        <text
          x="16"
          y="24"
          fontFamily="var(--font-jetbrains), monospace"
          fontSize="9"
          fill="var(--muted)"
          letterSpacing="0.1em"
        >
          PORTFOLIO \u00B7 LETCHER CO., KY
        </text>
        <g transform="translate(20, 50)">
          <line
            x1="0"
            y1="40"
            x2="320"
            y2="40"
            stroke="var(--foreground)"
            strokeOpacity="0.15"
          />
          {[
            { x: 0, label: "Connectivity", q: "Q1", fill: "var(--teal)" },
            { x: 80, label: "Cybersecurity", q: "Q1", fill: "var(--teal)" },
            { x: 160, label: "Partner bundle", q: "Q2", fill: "var(--sage)" },
            { x: 240, label: "RPM + telehealth", q: "Q3", fill: "var(--accent)" },
          ].map((item) => (
            <g key={item.label} transform={`translate(${item.x},0)`}>
              <circle cx="10" cy="40" r="7" fill={item.fill} />
              <text
                x="10"
                y="64"
                textAnchor="middle"
                fontSize="9.5"
                fill="var(--ink-2)"
              >
                {item.label}
              </text>
              <text
                x="10"
                y="78"
                textAnchor="middle"
                fontSize="8.5"
                fill="var(--muted)"
              >
                {item.q}
              </text>
            </g>
          ))}
        </g>
      </svg>
    ),
  },
  {
    num: "STEP 03",
    title: "Prove",
    body: "Generate a CMS-reporting-ready rationale document and a longitudinal outcomes tracker. Baseline, delta, and counterfactual \u2014 the three numbers state reviewers and the Office of Rural Health Transformation ask for.",
    screenshot: (
      <svg viewBox="0 0 360 180" className="h-full w-full">
        <g transform="translate(20, 30)">
          <text
            x="0"
            y="0"
            fontFamily="var(--font-jetbrains), monospace"
            fontSize="9"
            fill="var(--muted)"
            letterSpacing="0.1em"
          >
            RATIONALE \u00B7 v4.4 \u00B7 04-15-2026
          </text>
          <g fill="var(--foreground)">
            <rect x="0" y="14" width="260" height="8" opacity="0.9" rx="1" />
            <rect x="0" y="30" width="180" height="3" opacity="0.25" rx="1" />
            <rect x="0" y="38" width="220" height="3" opacity="0.25" rx="1" />
            <rect x="0" y="46" width="200" height="3" opacity="0.25" rx="1" />
            <rect
              x="0"
              y="62"
              width="140"
              height="6"
              fill="var(--accent)"
              opacity="0.9"
              rx="1"
            />
            <rect x="0" y="76" width="220" height="3" opacity="0.25" rx="1" />
            <rect x="0" y="84" width="240" height="3" opacity="0.25" rx="1" />
            <rect x="0" y="92" width="180" height="3" opacity="0.25" rx="1" />
          </g>
          <g transform="translate(0, 110)">
            <polyline
              points="0,18 30,20 60,14 90,15 120,9 150,11 180,5 210,6 240,2"
              fill="none"
              stroke="var(--teal)"
              strokeWidth="1.5"
            />
            <line
              x1="0"
              y1="20"
              x2="240"
              y2="20"
              stroke="var(--foreground)"
              strokeOpacity="0.12"
            />
            <text
              x="244"
              y="6"
              fontFamily="var(--font-jetbrains), monospace"
              fontSize="8"
              fill="var(--green-go)"
            >
              +12% served
            </text>
          </g>
        </g>
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24" id="how">
      <div className="mx-auto max-w-[1320px] px-12">
        {/* Header */}
        <div className="mb-16 grid grid-cols-1 items-end gap-16 md:grid-cols-[1fr_1.5fr]">
          <div>
            <div
              className="font-mono mb-5 flex items-center gap-3 text-[11.5px] uppercase tracking-[0.14em]"
              style={{ color: "var(--muted)" }}
            >
              <span style={{ color: "var(--accent)" }}>02</span>
              <span>How RHT-NAV works</span>
              <span
                className="flex-1"
                style={{ height: 1, background: "var(--line)" }}
              />
            </div>
            <h2
              className="font-display text-5xl leading-[1.05] tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              Diagnose. Sequence.{" "}
              <em style={{ color: "var(--accent)", fontWeight: 400 }}>
                Prove.
              </em>
            </h2>
          </div>
          <p
            className="max-w-[580px] text-[17px] leading-relaxed"
            style={{ color: "var(--ink-2)" }}
          >
            The tool moves from data to defensible portfolio to reportable
            outcome. Every recommendation is traceable to a federal source. Every
            recommendation can be overridden &mdash; administrators own the
            decision, always.
          </p>
        </div>

        {/* Steps */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{
            borderTop: "1px solid var(--line)",
            borderBottom: "1px solid var(--line)",
          }}
        >
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className="group relative p-9 transition-colors hover:bg-[var(--bg-soft)]"
              style={{
                borderRight:
                  i < STEPS.length - 1 ? "1px solid var(--line)" : undefined,
              }}
            >
              <div
                className="font-mono text-[11px] tracking-[0.1em]"
                style={{ color: "var(--accent)" }}
              >
                {step.num}
              </div>
              <div
                className="font-display mt-4 text-[30px] tracking-tight"
                style={{ color: "var(--foreground)" }}
              >
                {step.title}
              </div>
              <p
                className="mt-3.5 max-w-[340px] text-sm leading-relaxed"
                style={{ color: "var(--ink-2)" }}
              >
                {step.body}
              </p>
              <div
                className="mt-8 h-[180px] overflow-hidden rounded-sm"
                style={{
                  background: "var(--bg-soft)",
                  border: "1px solid var(--line)",
                }}
              >
                {step.screenshot}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
