const STEPS = [
  {
    num: "01",
    title: "Diagnose",
    body: "Score every county on Need, Capacity, Readiness using CDC PLACES, HRSA AHRF, FCC BDC, Census ACS.",
    viz: (
      <svg viewBox="0 0 280 150" className="h-full w-full">
        {/* Readiness grid */}
        {Array.from({ length: 120 }).map((_, i) => {
          const col = i % 20;
          const row = Math.floor(i / 20);
          const score = ((i * 37 + 11) % 120) / 120;
          const fill =
            score > 0.78
              ? "var(--green-go)"
              : score > 0.44
                ? "var(--amber-flag)"
                : "var(--red-flag)";
          return (
            <rect
              key={i}
              x={10 + col * 13}
              y={10 + row * 13}
              width={10}
              height={10}
              rx={1.5}
              fill={fill}
              opacity={0.5 + score * 0.5}
            />
          );
        })}
      </svg>
    ),
  },
  {
    num: "02",
    title: "Sequence",
    body: "Portfolio ordered to not skip tiers. Foundation before ecosystem, ecosystem before outcomes.",
    viz: (
      <svg viewBox="0 0 280 150" className="h-full w-full">
        <rect x="30" y="110" width="220" height="24" rx="3" fill="var(--teal)" opacity="0.9" />
        <rect x="60" y="78" width="160" height="24" rx="3" fill="var(--sage)" opacity="0.9" />
        <rect x="95" y="46" width="90" height="24" rx="3" fill="var(--accent)" opacity="0.9" />
        <text x="140" y="128" textAnchor="middle" fontFamily="var(--font-jetbrains), monospace" fontSize="9" fill="white" letterSpacing="1.5">PLATFORM</text>
        <text x="140" y="96" textAnchor="middle" fontFamily="var(--font-jetbrains), monospace" fontSize="9" fill="white" letterSpacing="1.5">ECOSYSTEM</text>
        <text x="140" y="64" textAnchor="middle" fontFamily="var(--font-jetbrains), monospace" fontSize="9" fill="white" letterSpacing="1.5">OUTCOMES</text>
        <text x="30" y="36" fontFamily="var(--font-jetbrains), monospace" fontSize="9" fill="var(--muted)" letterSpacing="1">PORTFOLIO &middot; STACKED</text>
      </svg>
    ),
  },
  {
    num: "03",
    title: "Prove",
    body: "Baseline, delta, counterfactual. Formatted to Section 71401. Reportable in a cabinet meeting.",
    viz: (
      <svg viewBox="0 0 280 150" className="h-full w-full">
        <polyline points="20,110 70,100 120,80 170,60 220,40 260,30" fill="none" stroke="var(--accent)" strokeWidth="2" />
        <polyline points="20,110 70,108 120,105 170,100 220,95 260,90" fill="none" stroke="var(--muted-2)" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="260" cy="30" r="4" fill="var(--accent)" />
        <circle cx="260" cy="90" r="3" fill="var(--muted-2)" />
        <text x="20" y="28" fontFamily="var(--font-jetbrains), monospace" fontSize="9" fill="var(--muted)" letterSpacing="1">OUTCOME LIFT</text>
        <text x="160" y="52" fontFamily="var(--font-jetbrains), monospace" fontSize="8.5" fill="var(--accent)">+18% &middot; ACTUAL</text>
        <text x="160" y="115" fontFamily="var(--font-jetbrains), monospace" fontSize="8.5" fill="var(--muted-2)">COUNTERFACTUAL</text>
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section
      className="py-24"
      id="how"
      style={{
        backgroundColor: "var(--bg-warm)",
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div className="mx-auto max-w-[1320px] px-12">
        {/* Header */}
        <div className="mb-14 grid grid-cols-1 items-end gap-12 md:grid-cols-[1fr_1.3fr]">
          <div>
            <div
              className="font-mono mb-4 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.14em]"
              style={{ color: "var(--muted)" }}
            >
              <span style={{ color: "var(--accent)" }}>04</span>
              <span>How it works</span>
            </div>
            <h2
              className="font-display text-[46px] leading-[1.05] tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              Diagnose. Sequence.
              <br />
              <em style={{ color: "var(--accent)", fontWeight: 400 }}>Prove.</em>
            </h2>
          </div>
          <p
            className="max-w-[520px] text-base leading-relaxed"
            style={{ color: "var(--ink-2)" }}
          >
            The tool moves from data to defensible portfolio to reportable
            outcome. Every recommendation is traceable to a federal source.
            Administrators own the override, always.
          </p>
        </div>

        {/* Flow steps */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className="relative"
              style={{ padding: "36px 28px" }}
            >
              {/* Connecting line between steps */}
              {i < STEPS.length - 1 && (
                <div
                  className="absolute top-[62px] -right-3 hidden md:block"
                  style={{
                    width: 24,
                    height: 1,
                    background: "var(--line-2)",
                  }}
                />
              )}

              {/* Number circle */}
              <div
                className="font-mono mb-5 inline-flex items-center justify-center text-xs font-medium"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "white",
                  border: "1px solid var(--line-2)",
                  color: "var(--foreground)",
                }}
              >
                {step.num}
              </div>

              <div
                className="font-display mb-2 text-[26px] tracking-tight"
                style={{ color: "var(--foreground)" }}
              >
                {step.title}
              </div>

              <p
                className="mb-5 text-[13.5px] leading-relaxed"
                style={{ color: "var(--ink-2)" }}
              >
                {step.body}
              </p>

              {/* Visualization */}
              <div
                className="h-[180px] overflow-hidden"
                style={{
                  background: "white",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--r-lg)",
                  padding: 16,
                }}
              >
                {step.viz}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
