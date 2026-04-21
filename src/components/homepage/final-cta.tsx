import Link from "next/link";

const DELIVERABLES = [
  {
    num: "01",
    title: "A readiness-tiered portfolio recommendation",
    desc: "County-by-county, sequenced to not skip tiers. Overridable at every step \u2014 you own the final call, and RHT-NAV records your reasoning.",
  },
  {
    num: "02",
    title: "A CMS-reporting-ready rationale document",
    desc: "Pre-formatted to the Section 71401 criteria: need, plan quality, policy alignment. Every statistic carries its primary citation.",
  },
  {
    num: "03",
    title: "A longitudinal outcomes tracker",
    desc: "Baseline, delta, counterfactual. Built to survive the next funding tranche decision and the next administration.",
  },
  {
    num: "04",
    title: "Access to pre-negotiated Collaborative bundles",
    desc: "Starlink, Azure, BioIntelliSense and others at Collaborative pricing \u2014 typically 60\u201390% off retail. State-specific procurement support included.",
  },
];

export default function FinalCTA() {
  return (
    <section className="py-28" id="final">
      <div className="mx-auto max-w-[1320px] px-12">
        <div className="grid grid-cols-1 gap-20 md:grid-cols-2">
          {/* Left */}
          <div>
            <div
              className="font-mono mb-5 flex items-center gap-3 text-[11.5px] uppercase tracking-[0.14em]"
              style={{ color: "var(--muted)" }}
            >
              <span style={{ color: "var(--accent)" }}>06</span>
              <span>For state administrators</span>
              <span
                className="flex-1"
                style={{ height: 1, background: "var(--line)" }}
              />
            </div>
            <h2
              className="font-display text-[56px] leading-[1.03] tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              What you get, in{" "}
              <em style={{ color: "var(--accent)", fontWeight: 400 }}>
                plain language.
              </em>
            </h2>
            <p
              className="mt-7 max-w-[460px] text-base leading-relaxed"
              style={{ color: "var(--ink-2)" }}
            >
              You were handed $200M+ and a narrow window to show outcomes.
              RHT-NAV gives you the four artifacts state reviewers and CMS will
              actually ask for, with every number traceable to a federal source.
            </p>
            <div className="mt-10 flex gap-4">
              <Link
                href="/states"
                className="inline-flex items-center gap-2.5 rounded-sm px-6 py-3.5 text-sm font-medium transition-colors"
                style={{
                  background: "var(--foreground)",
                  color: "var(--bg-soft)",
                }}
              >
                Start with your state &rarr;
              </Link>
              <a
                href="mailto:joshgott@stanford.edu"
                className="inline-flex items-center gap-2.5 border-b py-3.5 text-sm transition-colors"
                style={{
                  color: "var(--ink-2)",
                  borderColor: "transparent",
                }}
              >
                Talk to the team &rarr;
              </a>
            </div>
          </div>

          {/* Right - Deliverables list */}
          <ul
            style={{ borderTop: "1px solid var(--line)", listStyle: "none" }}
          >
            {DELIVERABLES.map((item) => (
              <li
                key={item.num}
                className="grid grid-cols-[56px_1fr] items-start gap-5 py-5.5"
                style={{ borderBottom: "1px solid var(--line)" }}
              >
                <span
                  className="font-mono pt-1 text-[11px]"
                  style={{ color: "var(--accent)" }}
                >
                  {item.num}
                </span>
                <div>
                  <div
                    className="text-base font-medium"
                    style={{ color: "var(--foreground)" }}
                  >
                    {item.title}
                  </div>
                  <p
                    className="mt-1 text-[13.5px] leading-relaxed"
                    style={{ color: "var(--ink-2)" }}
                  >
                    {item.desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
