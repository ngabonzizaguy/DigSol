"use client";

import * as React from "react";
import { useInView, motion, useReducedMotion } from "framer-motion";
import anime from "animejs";

type Props = {
  value: string;
  label: string;
  delay?: number;
};

export function StatCounter({ value, label, delay = 0 }: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const numRef = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const numericMatch = value.match(/[\d.]+/);
  const numeric = numericMatch ? parseFloat(numericMatch[0]) : null;
  const prefix = numericMatch ? value.slice(0, numericMatch.index!) : value;
  const suffix = numericMatch ? value.slice(numericMatch.index! + numericMatch[0].length) : "";

  React.useEffect(() => {
    if (!inView || numeric === null || reduce) return;
    const obj = { v: 0 };
    anime({
      targets: obj,
      v: numeric,
      duration: 1600,
      delay: delay * 1000,
      easing: "easeOutExpo",
      round: numeric % 1 === 0 ? 1 : 10,
      update: () => {
        if (numRef.current) {
          numRef.current.textContent = String(obj.v);
        }
      },
    });
  }, [inView, numeric, delay, reduce]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      <p className="font-display text-display-lg text-ink leading-none">
        {numeric !== null ? (
          <>
            {prefix}
            <span ref={numRef}>{reduce ? numeric : 0}</span>
            {suffix}
          </>
        ) : (
          value
        )}
      </p>
      <p className="mt-2 text-[13px] uppercase tracking-wider text-muted">{label}</p>
    </motion.div>
  );
}
