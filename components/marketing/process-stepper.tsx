"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const steps = [
  {
    n: "01",
    title: "Discover",
    body: "Workshops, audits, stakeholder interviews. We map your current state and quantify the opportunity.",
  },
  {
    n: "02",
    title: "Design",
    body: "Strategy, architecture, brand, and product surfaces. Everything moves to a single design language.",
  },
  {
    n: "03",
    title: "Build",
    body: "Cross-functional squad ships in two-week increments. You see working software every Friday.",
  },
  {
    n: "04",
    title: "Launch",
    body: "Cutover plans, comms, training, instrumentation. We obsess over the first 30 days in production.",
  },
  {
    n: "05",
    title: "Optimise",
    body: "Monthly experimentation, performance, and roadmap reviews. Continuous, measurable improvement.",
  },
];

export function ProcessStepper({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <div
        aria-hidden
        className="hidden lg:block absolute top-7 left-0 right-0 h-px bg-gradient-to-r from-transparent via-hairline-strong to-transparent"
      />
      <ol className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
        {steps.map((step, idx) => (
          <motion.li
            key={step.n}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: idx * 0.08 }}
            className="relative"
          >
            <div className="relative mb-5 grid h-14 w-14 place-items-center rounded-full bg-surface-card border border-hairline-strong shadow-soft">
              <span className="font-display text-[20px] text-ink">{step.n}</span>
            </div>
            <h3 className="font-sans text-[18px] font-medium text-ink">{step.title}</h3>
            <p className="mt-2 text-[15px] text-muted leading-relaxed">{step.body}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
