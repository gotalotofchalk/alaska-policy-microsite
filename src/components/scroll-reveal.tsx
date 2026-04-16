"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Parallax Y offset in px (positive = moves down slower) */
  parallaxY?: number;
  /** Scale entrance: starts at this value, ends at 1.0 */
  scaleFrom?: number;
  /** Delay before animation starts */
  delay?: number;
}

export function ScrollReveal({
  children,
  className,
  parallaxY = 0,
  scaleFrom,
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end 0.7"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [parallaxY, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [scaleFrom ?? 1, 1],
  );
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  // Simple whileInView mode (no scroll-linked transforms)
  if (!parallaxY && !scaleFrom) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
          delay,
        }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      style={{ y, scale, opacity }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
