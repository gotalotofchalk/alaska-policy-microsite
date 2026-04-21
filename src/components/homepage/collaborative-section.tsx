const LOGOS = [
  "Microsoft",
  "Esri",
  "BioIntelliSense",
  "Avel eCare",
  "Teladoc",
  "+ 14 more",
];

export default function CollaborativeSection() {
  return (
    <section
      className="mx-auto my-16 max-w-[1320px] px-12"
      id="collaborative"
    >
      <div
        className="overflow-hidden py-20 px-12"
        style={{
          background: "var(--foreground)",
          borderRadius: "var(--r-xl)",
          color: "white",
        }}
      >
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <h2
            className="font-display max-w-[600px] text-[38px] leading-[1.12] tracking-tight"
          >
            Built by the{" "}
            <em style={{ color: "var(--accent-soft)", fontWeight: 400 }}>
              RHT Collaborative.
            </em>
            <br />
            Bipartisan. Multi-sector. Field-tested.
          </h2>
          <div
            className="font-mono text-[10.5px] uppercase tracking-[0.12em]"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            CONSORTIUM &middot; 2024
          </div>
        </div>

        {/* Logo grid */}
        <div
          className="grid grid-cols-3 md:grid-cols-6"
          style={{
            gap: 1,
            background: "rgba(255,255,255,0.12)",
            borderRadius: "var(--r-md)",
            overflow: "hidden",
          }}
        >
          {LOGOS.map((name) => (
            <div
              key={name}
              className="font-display flex min-h-[72px] items-center justify-center px-6 py-6 text-center text-sm font-medium"
              style={{
                background: "var(--foreground)",
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
