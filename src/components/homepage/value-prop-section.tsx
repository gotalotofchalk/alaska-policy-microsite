const CARDS = [
  {
    tier: "I / BASE",
    tag: "Foundation",
    title: "A foundation that holds.",
    body: "Connectivity, cybersecurity, and interoperability first. Without them, every intervention above collapses under its own weight.",
    meta: "BROADBAND \u00B7 EHR \u00B7 INTEROPERABILITY \u00B7 CLOUD/AI \u00B7 CYBERSECURITY",
    accentVar: "var(--teal)",
  },
  {
    tier: "II / MID",
    tag: "Ecosystem",
    title: "A sequence that scales.",
    body: "The right partners in the right order, matched to each region\u2019s readiness tier. No point solutions. No single-vendor lock-in.",
    meta: "TECHNOLOGY \u00B7 ADVISORS \u00B7 PROVIDERS \u00B7 OTHER",
    accentVar: "var(--sage)",
  },
  {
    tier: "III / PEAK",
    tag: "Outcomes",
    title: "Real health outcomes.",
    body: "Not vanity metrics, not vendor checkboxes. Measurable improvements in the lives of rural people, accruing across years and states.",
    meta: "5 CMS RHT GOALS \u00B7 REPORTABLE \u00B7 LONGITUDINAL",
    accentVar: "var(--accent)",
  },
];

export default function ValuePropSection() {
  return (
    <section
      id="valueprop"
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
              <span style={{ color: "var(--accent)" }}>02</span>
              <span>The three prongs</span>
              <span
                className="flex-1"
                style={{ height: 1, background: "var(--line)" }}
              />
            </div>
            <h2
              className="font-display text-5xl leading-[1.05] tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              The case, in{" "}
              <em style={{ color: "var(--accent)", fontWeight: 400 }}>
                three lines.
              </em>
            </h2>
          </div>
          <p
            className="max-w-[580px] text-[17px] leading-relaxed"
            style={{ color: "var(--ink-2)" }}
          >
            Every variant preserves the pyramid-motion logic: foundation first,
            ecosystem second, outcomes last. The value proposition as the
            framework itself.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {CARDS.map((card) => (
            <article
              key={card.tier}
              className="flex min-h-[360px] flex-col rounded-sm p-9"
              style={{
                background: "white",
                border: "1px solid var(--line)",
                borderTop: `4px solid ${card.accentVar}`,
              }}
            >
              <div className="mb-7 flex items-center justify-between">
                <span
                  className="font-mono text-[10.5px] tracking-[0.14em]"
                  style={{ color: card.accentVar }}
                >
                  {card.tier}
                </span>
                <span
                  className="text-[10.5px] uppercase tracking-[0.12em]"
                  style={{ color: "var(--muted)" }}
                >
                  {card.tag}
                </span>
              </div>
              <h3
                className="font-display mb-5 text-[32px] leading-[1.1] tracking-tight"
                style={{ color: "var(--foreground)" }}
              >
                {card.title}
              </h3>
              <p
                className="flex-1 text-[14.5px] leading-relaxed"
                style={{ color: "var(--ink-2)" }}
              >
                {card.body}
              </p>
              <div
                className="font-mono mt-6 border-t pt-5 text-[10px] tracking-[0.1em]"
                style={{
                  color: "var(--muted)",
                  borderColor: "var(--line)",
                }}
              >
                {card.meta}
              </div>
            </article>
          ))}
        </div>

        {/* Tagline */}
        <div
          className="mt-12 rounded-sm px-9 pt-11 pb-7"
          style={{
            background: "var(--foreground)",
            color: "var(--bg-soft)",
            position: "relative",
          }}
        >
          <div
            className="font-mono absolute top-2.5 left-9 text-[10px] tracking-[0.14em]"
            style={{ color: "var(--accent-soft)" }}
          >
            THROUGH-LINE
          </div>
          <p
            className="font-display text-[28px] leading-[1.3] tracking-tight"
          >
            Establish a foundation. Reach the peak. Deliver real health outcomes.
          </p>
        </div>
      </div>
    </section>
  );
}
