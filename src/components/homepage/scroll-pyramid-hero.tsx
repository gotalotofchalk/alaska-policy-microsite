"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const VALUE_PROPS = [
  {
    headline: (
      <>
        Establish a <em>foundation.</em>
      </>
    ),
    context:
      "Broadband, cybersecurity, EHR, interoperability, cloud & AI \u2014 the five primitives every clinical program assumes but rural regions rarely have.",
  },
  {
    headline: (
      <>
        Build a sustainable <em>ecosystem.</em>
      </>
    ),
    context:
      "Technology partners, advisors, providers and stakeholders \u2014 sequenced to compound, not collide. Pre-negotiated bundles with Microsoft, Esri, BioIntelliSense.",
  },
  {
    headline: (
      <>
        Real health <em>outcomes.</em>
      </>
    ),
    context:
      "Fewer ER visits. Earlier diagnoses. Reduced travel burden. Physician time saved \u2014 measured against the five CMS RHT goals, reportable on demand.",
  },
];

const PHASE_LABELS = ["FOUNDATION", "ECOSYSTEM", "OUTCOMES"];

const TIERS = [
  {
    label: "Foundation",
    gradientFrom: "#1a8891",
    gradientTo: "#0b5b63",
    width: "280px",
    height: "90px",
    clipPath: "polygon(12% 0%, 88% 0%, 100% 100%, 0% 100%)",
  },
  {
    label: "Ecosystem",
    gradientFrom: "#5a8e6b",
    gradientTo: "#3a6a4e",
    width: "200px",
    height: "80px",
    clipPath: "polygon(14% 0%, 86% 0%, 100% 100%, 0% 100%)",
  },
  {
    label: "Outcomes",
    gradientFrom: "#d97a3a",
    gradientTo: "#a84e20",
    width: "120px",
    height: "70px",
    clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
  },
];

export default function ScrollPyramidHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrolled = -rect.top;
      const scrollableDistance = sectionHeight - viewportHeight;
      const rawProgress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

      setProgress(rawProgress);

      if (rawProgress > 0.02 && !hasScrolled) {
        setHasScrolled(true);
      }

      if (rawProgress < 0.1) setPhase(0);
      else if (rawProgress < 0.4) setPhase(1);
      else if (rawProgress < 0.7) setPhase(2);
      else setPhase(3);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolled]);

  const railHeight =
    phase === 0 ? "0%" : phase === 1 ? "33%" : phase === 2 ? "66%" : "100%";

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: "360vh" }}
      data-phase={phase}
    >
      {/* Sticky container */}
      <div
        className="sticky top-0 flex items-start overflow-hidden"
        style={{ height: "100vh", paddingTop: "100px", paddingBottom: "64px" }}
      >
        <div
          className="mx-auto grid w-full gap-12"
          style={{
            maxWidth: "1520px",
            paddingInline: "64px",
            gridTemplateColumns: "1fr 1.2fr",
            height: "100%",
          }}
        >
          {/* Left column */}
          <div className="relative flex gap-8">
            {/* Progress rail */}
            <div className="relative flex flex-col items-center" style={{ width: "20px" }}>
              <div
                className="absolute left-1/2 top-0 h-full -translate-x-1/2"
                style={{
                  width: "2px",
                  backgroundColor: "var(--line)",
                }}
              />
              <div
                className="absolute left-1/2 top-0 -translate-x-1/2 transition-all duration-700 ease-out"
                style={{
                  width: "2px",
                  height: railHeight,
                  backgroundColor: "var(--accent)",
                }}
              />
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="absolute left-1/2 -translate-x-1/2 rounded-full transition-colors duration-500"
                  style={{
                    width: "10px",
                    height: "10px",
                    top: `${i * 33 + 16}%`,
                    backgroundColor: phase > i ? "var(--accent)" : "var(--line-2)",
                    boxShadow: phase > i ? "0 0 8px var(--accent-soft)" : "none",
                  }}
                />
              ))}
            </div>

            {/* Text content */}
            <div className="flex flex-1 flex-col justify-center gap-6">
              {/* Eyebrow */}
              <p
                className="font-mono text-xs uppercase tracking-widest"
                style={{ color: "var(--muted)" }}
              >
                The three-prong framework{" "}
                <span style={{ color: "var(--accent)" }}>
                  &middot; {String(Math.max(1, phase)).padStart(2, "0")} /{" "}
                  {PHASE_LABELS[Math.max(0, phase - 1)]}
                </span>
              </p>

              {/* Value prop lines */}
              <div className="flex flex-col gap-5">
                {VALUE_PROPS.map((vp, i) => {
                  const isActive = phase === i + 1;
                  const isPast = phase > i + 1;

                  return (
                    <div
                      key={i}
                      className="transition-all duration-700 ease-out"
                      style={{
                        opacity: isActive ? 1 : isPast ? 0.45 : 0.22,
                        filter: isActive || isPast ? "none" : "blur(0.5px)",
                      }}
                    >
                      <h1
                        className="font-display text-3xl font-medium leading-tight tracking-tight lg:text-4xl"
                        style={{ color: "var(--foreground)" }}
                      >
                        {vp.headline}
                      </h1>

                      {/* Context */}
                      <div
                        className="overflow-hidden transition-all duration-700 ease-out"
                        style={{
                          maxHeight: isActive ? "120px" : "0px",
                          opacity: isActive ? 1 : 0,
                          marginTop: isActive ? "8px" : "0px",
                        }}
                      >
                        <p
                          className="text-sm leading-relaxed lg:text-base"
                          style={{ color: "var(--ink-2)", maxWidth: "480px" }}
                        >
                          {vp.context}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTAs */}
              <div
                className="flex items-center gap-4 transition-all duration-700 ease-out"
                style={{
                  opacity: phase === 3 ? 1 : 0,
                  transform: phase === 3 ? "translateY(0)" : "translateY(12px)",
                  pointerEvents: phase === 3 ? "auto" : "none",
                }}
              >
                <Link
                  href="/states"
                  className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-white transition-colors hover:opacity-90"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  Start with your state
                  <span aria-hidden="true">&rarr;</span>
                </Link>
                <Link
                  href="#demo"
                  className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-medium transition-colors hover:bg-white/60"
                  style={{
                    borderColor: "var(--line)",
                    color: "var(--foreground)",
                  }}
                >
                  90-second walkthrough
                </Link>
              </div>
            </div>
          </div>

          {/* Right column - Pyramid */}
          <div className="relative flex items-center justify-center">
            {/* Perspective container */}
            <div
              className="relative flex flex-col items-center justify-end"
              style={{
                perspective: "1400px",
                height: "480px",
                width: "100%",
              }}
            >
              {/* Floor shadow */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 transition-opacity duration-700"
                style={{
                  width: "320px",
                  height: "40px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(ellipse at center, rgba(12,27,42,0.15) 0%, transparent 70%)",
                  opacity: phase >= 1 ? 1 : 0,
                }}
              />

              {/* Tiers */}
              <div className="relative flex flex-col items-center" style={{ gap: "6px" }}>
                {/* Render in reverse visual order: peak, mid, base from top to bottom */}
                {[2, 1, 0].map((tierIndex) => {
                  const tier = TIERS[tierIndex];
                  const isVisible = phase > tierIndex;
                  const isActive = phase === tierIndex + 1;

                  return (
                    <div
                      key={tierIndex}
                      className="relative flex flex-col items-center transition-all duration-700 ease-out"
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible
                          ? "translateY(0) rotateX(2deg)"
                          : "translateY(30px) rotateX(8deg)",
                      }}
                    >
                      <div
                        className="transition-shadow duration-500"
                        style={{
                          width: tier.width,
                          height: tier.height,
                          clipPath: tier.clipPath,
                          background: `linear-gradient(180deg, ${tier.gradientFrom} 0%, ${tier.gradientTo} 100%)`,
                          boxShadow: isActive
                            ? `0 0 30px ${tier.gradientFrom}55, 0 4px 20px ${tier.gradientFrom}33`
                            : "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                      {/* Tier caption */}
                      <span
                        className="font-mono mt-2 text-[10px] uppercase tracking-wider transition-opacity duration-500"
                        style={{
                          color: isActive ? tier.gradientFrom : "var(--muted)",
                          opacity: isVisible ? 1 : 0,
                        }}
                      >
                        {tier.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Isometric callouts at phase 3 */}
              <AnimatePresence>
                {phase === 3 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="pointer-events-none absolute inset-0"
                  >
                    {/* Base callout */}
                    <div
                      className="absolute flex items-center gap-2"
                      style={{ bottom: "60px", right: "40px" }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "1px",
                          backgroundColor: "var(--line-2)",
                        }}
                      />
                      <span
                        className="font-mono text-[10px] uppercase tracking-wider"
                        style={{ color: "var(--muted)" }}
                      >
                        Infrastructure
                      </span>
                    </div>

                    {/* Mid callout */}
                    <div
                      className="absolute flex items-center gap-2"
                      style={{ bottom: "170px", right: "60px" }}
                    >
                      <div
                        style={{
                          width: "30px",
                          height: "1px",
                          backgroundColor: "var(--line-2)",
                        }}
                      />
                      <span
                        className="font-mono text-[10px] uppercase tracking-wider"
                        style={{ color: "var(--muted)" }}
                      >
                        Partners
                      </span>
                    </div>

                    {/* Peak callout */}
                    <div
                      className="absolute flex items-center gap-2"
                      style={{ bottom: "290px", right: "80px" }}
                    >
                      <div
                        style={{
                          width: "24px",
                          height: "1px",
                          backgroundColor: "var(--line-2)",
                        }}
                      />
                      <span
                        className="font-mono text-[10px] uppercase tracking-wider"
                        style={{ color: "var(--muted)" }}
                      >
                        Impact
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-700"
          style={{ opacity: hasScrolled ? 0 : 1, pointerEvents: "none" }}
        >
          <span
            className="font-mono text-[11px] uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            Scroll to build
          </span>
          <motion.svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="var(--muted)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </div>
      </div>

      {/* Global styles for em accent */}
      <style jsx global>{`
        [data-phase] h1 em {
          font-style: italic;
          color: var(--accent);
        }
      `}</style>
    </section>
  );
}
