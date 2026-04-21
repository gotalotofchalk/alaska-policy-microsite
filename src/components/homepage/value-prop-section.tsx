const PRONGS = [
  {
    tierLabel: "TIER I \u00B7 BASE",
    color: "var(--teal)",
    colorSoft: "var(--teal-soft)",
    colorDeep: "var(--teal-deep)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: "Secure, intelligent, interoperable platform",
    body: "The load-bearing layer. Broadband, EHR systems, cloud infrastructure, and cybersecurity form the non-negotiable base on which everything else is built.",
    chips: ["Broadband", "EHR", "Interop", "Cloud/AI", "Cybersecurity"],
  },
  {
    tierLabel: "TIER II \u00B7 MID",
    color: "var(--sage)",
    colorSoft: "var(--green-soft)",
    colorDeep: "var(--sage)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    title: "Broad partner ecosystem",
    body: "Pre-negotiated bundles of technology vendors, advisory firms, provider networks, and stakeholder groups\u2014matched to each region\u2019s readiness tier.",
    chips: ["Tech", "Advisors", "Providers", "Stakeholders"],
  },
  {
    tierLabel: "TIER III \u00B7 PEAK",
    color: "var(--accent)",
    colorSoft: "var(--accent-soft)",
    colorDeep: "var(--accent)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 16l4-6 4 4 5-8" />
      </svg>
    ),
    title: "Real health outcomes",
    body: "Measured against five CMS RHT goals\u2014not vanity metrics. Longitudinal, reportable improvements in the lives of rural communities.",
    chips: ["Healthy", "Access", "Workforce", "Care", "Tech"],
  },
];

export default function ValuePropSection() {
  return (
    <section
      id="valueprop"
      className="py-24"
      style={{
        backgroundColor: "var(--bg-warm)",
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div className="mx-auto max-w-[1320px] px-12">
        {/* Section header */}
        <div className="mb-16 max-w-[720px]">
          <div
            className="font-mono mb-5 flex items-center gap-3 text-[11.5px] uppercase tracking-[0.14em]"
            style={{ color: "var(--muted)" }}
          >
            <span style={{ color: "var(--accent)" }}>02</span>
            <span>\u00B7</span>
            <span>The three prongs, modular</span>
            <span
              className="flex-1"
              style={{ height: 1, background: "var(--line)" }}
            />
          </div>
          <h2
            className="font-display text-5xl leading-[1.08] tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Foundation, ecosystem,{" "}
            <em style={{ color: "var(--accent)", fontWeight: 400 }}>
              outcomes.
            </em>
          </h2>
          <p
            className="mt-5 text-[17px] leading-relaxed"
            style={{ color: "var(--ink-2)" }}
          >
            Three tiers, each modular and self-contained, stacking from
            infrastructure through ecosystem to measurable health outcomes.
          </p>
        </div>

        {/* Three-column prong card */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{
            background: "white",
            borderRadius: "var(--r-xl)",
            border: "1px solid var(--line)",
            boxShadow: "var(--shadow-sm)",
            overflow: "hidden",
          }}
        >
          {PRONGS.map((prong, i) => {
            const isLast = i === PRONGS.length - 1;
            return (
              <div
                key={prong.tierLabel}
                className="relative"
                style={{
                  padding: "36px 32px",
                  borderRight: isLast ? "none" : "1px solid var(--line)",
                }}
              >
                {/* Header row: tier label + icon */}
                <div className="mb-5 flex items-center justify-between">
                  <span
                    className="font-mono text-[10.5px] tracking-[0.14em]"
                    style={{ color: prong.color }}
                  >
                    {prong.tierLabel}
                  </span>
                  <span
                    className="flex items-center justify-center"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "var(--r-sm)",
                      backgroundColor: prong.colorSoft,
                      color: prong.colorDeep,
                    }}
                  >
                    {prong.icon}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="font-display mb-3 text-[24px] leading-[1.15] tracking-tight"
                  style={{ color: "var(--foreground)" }}
                >
                  {prong.title}
                </h3>

                {/* Body */}
                <p
                  className="mb-6 text-[13.5px] leading-relaxed"
                  style={{ color: "var(--ink-2)" }}
                >
                  {prong.body}
                </p>

                {/* Module chips */}
                <div className="flex flex-wrap gap-1.5">
                  {prong.chips.map((chip) => (
                    <span
                      key={chip}
                      className="font-mono text-[10px] uppercase tracking-[0.08em]"
                      style={{
                        padding: "4px 8px",
                        borderRadius: "var(--r-sm)",
                        border: "1px solid var(--line)",
                        color: "var(--muted)",
                      }}
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                {/* Arrow connector between columns */}
                {!isLast && (
                  <span
                    className="pointer-events-none absolute hidden md:flex items-center justify-center"
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      backgroundColor: "white",
                      border: "1px solid var(--line)",
                      top: "50%",
                      right: -10,
                      transform: "translateY(-50%)",
                      zIndex: 2,
                      color: "var(--muted)",
                      fontSize: 11,
                      lineHeight: 1,
                    }}
                  >
                    &rarr;
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
