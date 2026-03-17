import { DetailCard, DisclosureRow } from "@/components/detail-disclosure";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { dataGeneratedAt, sourceNotes } from "@/lib/data";

export default function MethodsPage() {
  const groupedNotes = {
    "Data baselines": sourceNotes.filter((note) =>
      ["Geography", "Population baseline", "Disease baseline", "Connectivity context"].includes(
        note.scope
      )
    ),
    "Clinical and implementation evidence": sourceNotes.filter((note) =>
      [
        "Clinical guidance",
        "Implementation evidence",
        "Workflow evidence",
        "Device evidence",
        "Treatment evidence",
        "Outcomes evidence",
      ].includes(note.scope)
    ),
    "Economic and burden evidence": sourceNotes.filter((note) =>
      ["Economic evidence", "Public health burden", "Quality-of-life evidence"].includes(
        note.scope
      )
    ),
  };

  return (
    <>
      <PageHero
        eyebrow="Methods"
        title="The methods page makes the evidence stack explicit."
        lede="The evidence stack stays separated on purpose: Alaska baselines, literature-backed defaults, and the synthetic bridge behind the final rate estimate."
        compact
      />

      <Reveal>
        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Source-backed",
              summary: "Alaska geography and prevalence stay tied to public datasets.",
              hoverNote:
                "These are the least contestable inputs in the system and should remain visually separate from assumptions-driven outputs.",
              detail:
                "ACS population, CDC PLACES prevalence, and regional mapping are used directly where possible so the public baseline does not depend on synthetic modeling.",
              tone: "paper" as const,
            },
            {
              title: "Literature-backed",
              summary: "Screening throughput and follow-up defaults are anchored in implementation studies.",
              hoverNote:
                "This is the middle layer of evidence: published program performance used to bound what is plausible in deployment.",
              detail:
                "Tele-retinal screening uplift, follow-up completion, and program economics are bounded from peer-reviewed implementation literature rather than guessed ad hoc.",
              tone: "teal" as const,
            },
            {
              title: "Synthetic",
              summary: "The diabetes-rate bridge is explicit, bounded, and editable.",
              hoverNote:
                "The final rate effect is useful for planning, but it is the output most in need of visible caveat.",
              detail:
                "The bridge from better screening and follow-up to a modeled diabetes-rate reduction remains indicative rather than observed and can be tuned in the assumptions workspace.",
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
          <p className="md:col-span-3 text-sm text-[color:var(--muted)]">
            Latest generated data pack: {dataGeneratedAt}.
          </p>
        </section>
      </Reveal>

      <Reveal delay={0.08}>
        <section className="grid gap-4">
          {Object.entries(groupedNotes).map(([groupLabel, notes]) => (
            <article key={groupLabel} className="surface-card rounded-[1.9rem] p-6 md:p-7">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[color:var(--muted)]">
                    Source library
                  </p>
                  <h2 className="mt-2 font-display text-[2.25rem] text-[color:var(--foreground)]">
                    {groupLabel}
                  </h2>
                </div>
                <div className="rounded-full border border-[color:var(--line)] bg-white/75 px-4 py-2 text-sm text-[color:var(--foreground)]">
                  {notes.length} sources
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                {notes.map((note) => (
                  <DisclosureRow
                    key={note.id}
                    eyebrow={note.scope}
                    title={note.name}
                    badge={note.evidenceTier}
                    href={note.url}
                    hoverNote={`${note.year} source. Last refreshed ${note.lastRefreshDate}.`}
                    detail={
                      <div className="space-y-2">
                        <p>{note.summary}</p>
                        <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                          Updated {note.lastRefreshDate}
                        </p>
                      </div>
                    }
                  />
                ))}
              </div>
            </article>
          ))}
        </section>
      </Reveal>
    </>
  );
}
