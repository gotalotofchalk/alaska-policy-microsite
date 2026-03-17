import { DetailCard, DisclosureRow } from "@/components/detail-disclosure";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";

const portfolioCards = [
  {
    title: "Access and coordination",
    tone: "paper" as const,
    metrics: [
      "Additional screens completed",
      "Referral turnaround time",
      "Positive screens with scheduled follow-up",
    ],
  },
  {
    title: "Clinical yield",
    tone: "teal" as const,
    metrics: [
      "Referable cases identified",
      "Earlier interventions started",
      "Potential DME or complex retinal findings flagged",
    ],
  },
  {
    title: "Implementation readiness",
    tone: "warm" as const,
    metrics: [
      "Sites activated",
      "Staff trained",
      "Connectivity and image transfer support in place",
    ],
  },
  {
    title: "Financial return",
    tone: "navy" as const,
    metrics: ["Year-one program cost", "Three-year benefit estimate", "Indicative ROI band"],
  },
];

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="The statewide portfolio view keeps regional decisions tied to measurable public value."
        lede="Read the statewide rollout as a balanced portfolio: visible year-one signals, coverage discipline, and an auditable path from spend to return."
        compact
      />

      <Reveal>
        <section className="grid gap-4 lg:grid-cols-2">
          {portfolioCards.map((card) => (
            <DetailCard
              key={card.title}
              title={card.title}
              hoverNote={`${card.metrics.length} portfolio markers sit under this outcome family.`}
              tone={card.tone}
              detail={
                <div className="space-y-3">
                  {card.metrics.map((metric, index) => (
                    <DisclosureRow
                      key={metric}
                      eyebrow={`Signal 0${index + 1}`}
                      title={metric}
                      hoverNote={metric}
                      detail={<p>{metric}</p>}
                    />
                  ))}
                </div>
              }
            >
              <p className="max-w-sm text-sm leading-7 text-[color:var(--muted)]">
                {card.metrics[0]} remains the lead visible marker in this portfolio lane.
              </p>
            </DetailCard>
          ))}
        </section>
      </Reveal>
    </>
  );
}
