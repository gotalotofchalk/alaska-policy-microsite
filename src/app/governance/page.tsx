import { DetailCard } from "@/components/detail-disclosure";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";

export default function GovernancePage() {
  return (
    <>
      <PageHero
        eyebrow="Governance"
        title="The public-facing product stays stable because the model assumptions are versioned and visible."
        lede="Governance means the public shell stays calm while the model pack can evolve without hiding what changed."
        compact
      />

      <Reveal>
        <section className="grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "Versioned assumptions",
              summary: "Assumption packs can change without changing the public product shell.",
              hoverNote:
                "Governance starts with separating editorial presentation from model versioning.",
              detail:
                "Each assumption set is versioned so teams can publish a revised model pack later without silently changing what the public sees.",
              tone: "paper" as const,
            },
            {
              title: "Open assumptions workspace",
              summary: "Epidemiology, follow-up, and economic coefficients remain tuneable.",
              hoverNote:
                "This avoids the common failure mode where a public prototype becomes stale because every update requires code edits.",
              detail:
                "The workspace exists so later evidence can refine low, base, and high ranges while keeping a visible record of what changed and why.",
              tone: "teal" as const,
            },
            {
              title: "Public caveats stay attached",
              summary: "The most attractive outputs keep their caveats visible.",
              hoverNote:
                "The site is strongest when it makes the limits of the model legible rather than trying to hide them.",
              detail:
                "The synthetic diabetes-rate bridge remains labeled as indicative, bounded, and assumption-driven even when the rest of the interface is polished.",
              tone: "warm" as const,
            },
          ].map((card) => (
            <DetailCard
              key={card.title}
              title={card.title}
              hoverNote={card.hoverNote}
              detail={<p>{card.detail}</p>}
              tone={card.tone}
            >
              <p className="max-w-xs text-sm leading-7 text-[color:var(--muted)]">{card.summary}</p>
            </DetailCard>
          ))}
        </section>
      </Reveal>

      <Reveal delay={0.08}>
        <section className="grid gap-4 md:grid-cols-3">
          <GovernanceSignal
            label="Public contract"
            value="Keep the logic stable"
            note="The public-facing pages should remain calm and legible even as the model coefficients evolve."
            tone="paper"
          />
          <GovernanceSignal
            label="Model contract"
            value="Keep the assumptions editable"
            note="Teams need to tune evidence ranges without rewriting the site or hiding what changed."
            tone="teal"
          />
          <GovernanceSignal
            label="Trust contract"
            value="Keep caveats attached"
            note="The most attractive outputs should always retain their evidence and caveat framing."
            tone="warm"
          />
        </section>
      </Reveal>
    </>
  );
}

function GovernanceSignal({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: string;
  note: string;
  tone: "paper" | "teal" | "warm";
}) {
  const toneClass =
    tone === "teal"
      ? "shadow-soft border-[color:rgba(15,124,134,0.14)] bg-[linear-gradient(180deg,rgba(15,124,134,0.05),rgba(255,255,255,0.92))]"
      : tone === "warm"
        ? "shadow-soft border-[color:rgba(196,97,42,0.14)] bg-[linear-gradient(180deg,rgba(196,97,42,0.05),rgba(255,255,255,0.92))]"
        : "surface-card";

  return (
    <article className={`${toneClass} rounded-[1.7rem] border p-5`}>
      <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[color:var(--muted)]">
        {label}
      </p>
      <p className="mt-3 font-display text-[2rem] leading-none text-[color:var(--foreground)]">
        {value}
      </p>
      <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{note}</p>
    </article>
  );
}
