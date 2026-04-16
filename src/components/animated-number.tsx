"use client";

import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  delay?: number;
  formatFn?: (n: number) => string;
  className?: string;
}

const defaultFormat = (n: number) => Math.round(n).toLocaleString();

export function AnimatedNumber({
  value,
  duration = 1.2,
  delay = 0,
  formatFn = defaultFormat,
  className,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;

    if (reducedMotion) {
      if (ref.current) ref.current.textContent = formatFn(value);
      return;
    }

    const controls = animate(motionValue, value, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
    });

    const unsubscribe = motionValue.on("change", (latest) => {
      if (ref.current) ref.current.textContent = formatFn(latest);
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [isInView, value, duration, delay, formatFn, motionValue, reducedMotion]);

  return (
    <span ref={ref} className={className}>
      {reducedMotion ? formatFn(value) : formatFn(0)}
    </span>
  );
}

/**
 * Parse a stat string like "$213M" into { prefix: "$", number: 213, suffix: "M" }
 * so the number portion can be animated while prefix/suffix stay static.
 */
export function parseStatValue(val: string): { prefix: string; number: number; suffix: string } {
  const match = val.match(/^([^0-9]*)([0-9,.]+)(.*)$/);
  if (!match) return { prefix: "", number: 0, suffix: val };
  return {
    prefix: match[1],
    number: parseFloat(match[2].replace(/,/g, "")),
    suffix: match[3],
  };
}
