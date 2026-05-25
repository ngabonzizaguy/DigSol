"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Testimonial } from "@/lib/content/testimonials";
import { cn } from "@/lib/utils";

type Props = {
  items: Testimonial[];
};

export function TestimonialCarousel({ items }: Props) {
  const [idx, setIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const count = items.length;

  React.useEffect(() => {
    if (paused || count < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % count), 6000);
    return () => clearInterval(t);
  }, [paused, count]);

  if (count === 0) return null;

  const current = items[idx % count];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative mx-auto max-w-4xl"
    >
      <div className="relative rounded-2xl border border-hairline bg-surface-card p-8 lg:p-12 shadow-soft min-h-[260px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            <p className="font-display text-[28px] lg:text-[32px] leading-snug text-ink text-balance">
              &ldquo;{current.quote}&rdquo;
            </p>
            <footer className="mt-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-surface-strong grid place-items-center font-display text-ink">
                {current.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="text-[14px]">
                <p className="font-medium text-ink">{current.name}</p>
                <p className="text-muted">
                  {current.role}, {current.company}
                </p>
              </div>
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          aria-label="Previous testimonial"
          onClick={() => setIdx((i) => (i - 1 + count) % count)}
          className="grid h-9 w-9 place-items-center rounded-full border border-hairline-strong text-ink hover:bg-surface-strong transition"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === idx ? "w-8 bg-ink" : "w-1.5 bg-muted-soft hover:bg-muted"
              )}
            />
          ))}
        </div>
        <button
          aria-label="Next testimonial"
          onClick={() => setIdx((i) => (i + 1) % count)}
          className="grid h-9 w-9 place-items-center rounded-full border border-hairline-strong text-ink hover:bg-surface-strong transition"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
