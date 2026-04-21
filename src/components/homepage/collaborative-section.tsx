const PARTNERS = [
  { tag: "PLATFORM", name: "Microsoft" },
  { tag: "GIS", name: "Esri" },
  { tag: "RPM", name: "BioIntelliSense" },
  { tag: "TELE-ICU", name: "Avel eCare" },
  { tag: "VIRTUAL", name: "Teladoc" },
  { tag: "RURAL", name: "Cibolo Health" },
  { tag: "ADVISORY", name: "AVIA" },
  { tag: "ACADEMIC", name: "Stanford HAI" },
];

export default function CollaborativeSection() {
  return (
    <section className="py-24" id="collaborative">
      <div className="mx-auto max-w-[1320px] px-12">
        {/* Header */}
        <div className="mb-12 grid grid-cols-1 items-end gap-16 md:grid-cols-[1fr_1.5fr]">
          <div>
            <div
              className="font-mono mb-5 flex items-center gap-3 text-[11.5px] uppercase tracking-[0.14em]"
              style={{ color: "var(--muted)" }}
            >
              <span style={{ color: "var(--accent)" }}>04</span>
              <span>Built on the RHT Collaborative</span>
              <span
                className="flex-1"
                style={{ height: 1, background: "var(--line)" }}
              />
            </div>
            <h2
              className="font-display text-5xl leading-[1.05] tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              Platforms that hold. Not point{" "}
              <em style={{ color: "var(--accent)", fontWeight: 400 }}>
                solutions.
              </em>
            </h2>
          </div>
          <p
            className="max-w-[580px] text-[17px] leading-relaxed"
            style={{ color: "var(--ink-2)" }}
          >
            RHT-NAV is co-developed with the Rural Health Transformation
            Collaborative &mdash; a cross-sector group aligning technology,
            clinical, and state government expertise around a
            platform-over-point-solutions thesis.
          </p>
        </div>

        {/* Quote + Logo wall */}
        <div className="grid grid-cols-1 items-center gap-20 md:grid-cols-2">
          {/* Quote */}
          <div>
            <blockquote
              className="font-display text-[32px] leading-[1.35] tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              <span
                className="mr-0.5 text-[72px] leading-none"
                style={{
                  color: "var(--accent)",
                  position: "relative",
                  top: "20px",
                }}
              >
                &ldquo;
              </span>
              We don&apos;t need more islands of innovation. We need a foundation
              that holds, a sequence that scales, and an accountability loop that
              survives the next administration. That is what rural health needs,
              and that is what RHT-NAV builds for.
            </blockquote>
            <div
              className="mt-8 border-t pt-5 text-[13px] leading-relaxed"
              style={{
                color: "var(--ink-2)",
                borderColor: "var(--line)",
              }}
            >
              <strong
                className="mb-0.5 block text-sm font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                David Rhew, MD
              </strong>
              Global Chief Medical Officer, Microsoft
              <br />
              Co-Chair, Rural Health Transformation Collaborative
            </div>
          </div>

          {/* Logo wall */}
          <div>
            <div
              className="grid grid-cols-4"
              style={{ border: "1px solid var(--line)" }}
            >
              {PARTNERS.map((partner, i) => (
                <div
                  key={partner.name}
                  className="font-display relative flex h-[110px] items-center justify-center px-4 text-center text-base transition-colors hover:bg-[var(--bg-soft)]"
                  style={{
                    color: "var(--ink-2)",
                    borderRight:
                      (i + 1) % 4 !== 0
                        ? "1px solid var(--line)"
                        : undefined,
                    borderBottom:
                      i < 4 ? "1px solid var(--line)" : undefined,
                  }}
                >
                  <span
                    className="font-mono absolute top-2.5 left-3 text-[8.5px] tracking-[0.1em]"
                    style={{ color: "var(--muted)" }}
                  >
                    {partner.tag}
                  </span>
                  {partner.name}
                </div>
              ))}
            </div>
            <a
              href="#"
              className="mt-5 inline-flex items-center gap-2 border-b pb-1 text-[13px]"
              style={{
                color: "var(--ink-2)",
                borderColor: "var(--line-2)",
              }}
            >
              View the full Collaborative roster &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
