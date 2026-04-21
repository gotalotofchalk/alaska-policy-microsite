const STATS = [
  {
    number: "45",
    unit: "%",
    title: "Patients \u2014 without access",
    body: "Share of East Texas residents without reliable broadband. Before telehealth, before remote monitoring, before portable ultrasound \u2014 the foundational rail does not exist.",
    cite: "SOURCE \u00B7 RHT Collaborative field estimate, April 2026",
  },
  {
    number: "41.6",
    unit: "%",
    title: "Clinicians \u2014 geography alone",
    body: "Kentucky residents classified as rural \u2014 1.87M across 25,000 square miles in the eastern region analog. Clinicians carry the burden of distance, paper workflows, and fragmented records on skeleton crews.",
    cite: "SOURCE \u00B7 U.S. Census ACS 2020\u20132024 \u00B7 RHT Collaborative",
  },
  {
    number: "$212.9",
    unit: "M",
    title: "Systems \u2014 one year to prove it",
    body: "Kentucky\u2019s FY2026 RHTP allocation. The formula rewards plan quality and measurable impact; it penalizes point solutions that don\u2019t compound. States have a year to show the ratio worked.",
    cite: "SOURCE \u00B7 CMS, Section 71401, Public Law 119-21",
  },
];

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
        {/* Header */}
        <div className="mb-16 grid grid-cols-1 items-end gap-16 md:grid-cols-[1fr_1.5fr]">
          <div>
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
              One budget window. Three kinds of&nbsp;burden.
            </h2>
          </div>
          <p
            className="max-w-[580px] text-[17px] leading-relaxed"
            style={{ color: "var(--ink-2)" }}
          >
            The RHT funds are a five-year window, not a blank check. CMS will
            claw back discretionary allocations if states can&apos;t report
            measurable outcomes. Meanwhile, the underlying problem sits in three
            places at once &mdash; patients, clinicians, and systems &mdash; and
            each layer compounds the others.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {STATS.map((stat) => (
            <div
              key={stat.title}
              className="pt-6"
              style={{ borderTop: "2px solid var(--foreground)" }}
            >
              <div
                className="font-display text-[84px] leading-none tracking-tight"
                style={{ color: "var(--foreground)" }}
              >
                {stat.number}
                <span
                  className="ml-1.5 text-[32px]"
                  style={{ color: "var(--muted)" }}
                >
                  {stat.unit}
                </span>
              </div>
              <div
                className="mt-6 text-base font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                {stat.title}
              </div>
              <p
                className="mt-2.5 text-sm leading-relaxed"
                style={{ color: "var(--ink-2)" }}
              >
                {stat.body}
              </p>
              <div
                className="font-mono mt-5 text-[10.5px] tracking-wide"
                style={{ color: "var(--muted)" }}
              >
                {stat.cite}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
