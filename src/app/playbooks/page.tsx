import { DetailCard, DisclosureRow } from "@/components/detail-disclosure";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { getRegionPlaybooks } from "@/lib/data";

export default function PlaybooksPage() {
  const playbooks = getRegionPlaybooks();

  return (
    <>
      <PageHero
        eyebrow="Regional Playbooks"
        title="Each region gets a policy-ready playbook, not a generic technology wish list."
        lede="These playbooks turn the framework into action: what moves first, what waits, and what should change in year one."
        compact
      />

      <Reveal>
        <section className="grid gap-4 lg:grid-cols-2">
          {playbooks.map((region) => (
            <DetailCard
              key={region.slug}
              eyebrow={region.recommendedPathway}
              title={region.name}
              hoverNote={region.headline}
              detail={
                <div className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-3">
                    <PlaybookSignal
                      label="Move first"
                      value={moveFirstCopy(region.recommendedPathway)}
                    />
                    <PlaybookSignal
                      label="Guardrail"
                      value={guardrailCopy(region.recommendedPathway)}
                    />
                    <PlaybookSignal
                      label="Year-one signal"
                      value={yearOneSignalCopy(region.recommendedPathway)}
                    />
                  </div>
                  {region.interventions.map((item, index) => (
                    <DisclosureRow
                      key={item}
                      eyebrow={`Action 0${index + 1}`}
                      title={item}
                      hoverNote={item}
                      detail={<p>{item}</p>}
                    />
                  ))}
                </div>
              }
            >
              <p className="max-w-sm text-sm leading-7 text-[color:var(--muted)]">{region.headline}</p>
            </DetailCard>
          ))}
        </section>
      </Reveal>
    </>
  );
}

function PlaybookSignal({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-[color:var(--line)] bg-white/78 p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted)]">{label}</p>
      <p className="mt-2 text-sm leading-6 text-[color:var(--foreground)]">{value}</p>
    </div>
  );
}

function moveFirstCopy(pathway: string) {
  if (pathway === "Fast-start") {
    return "Activate high-volume primary care sites first.";
  }

  if (pathway === "Build-first") {
    return "Start with a smaller connected footprint.";
  }

  return "Lead statewide reading and referral routing.";
}

function guardrailCopy(pathway: string) {
  if (pathway === "Fast-start") {
    return "Do not outrun referral capacity.";
  }

  if (pathway === "Build-first") {
    return "Do not scale before transfer and staffing are stable.";
  }

  return "Do not spend hub capacity on device count alone.";
}

function yearOneSignalCopy(pathway: string) {
  if (pathway === "Fast-start") {
    return "Screening lift and confirmed follow-up should move quickly.";
  }

  if (pathway === "Build-first") {
    return "Activation and referral reliability should move before reach.";
  }

  return "Turnaround, scheduling, and statewide support should tighten.";
}
