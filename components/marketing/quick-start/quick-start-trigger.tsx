"use client";

import * as React from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Sparkles } from "lucide-react";
import { useQuickStart } from "./quick-start-provider";
import { cn } from "@/lib/utils";

export function QuickStartTrigger() {
  const { openFlow, open, pillHidden, config } = useQuickStart();
  const ref = React.useRef<HTMLButtonElement | null>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const mm = gsap.matchMedia();
      mm.add(
        {
          base: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const reduced = (context.conditions as { reduced: boolean }).reduced;
          gsap.fromTo(
            ref.current,
            { y: 24, opacity: 0, scale: 0.96 },
            { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "expo.out", delay: 0.3 },
          );
          if (!reduced) {
            // Idle breathing — subtle scale + soft shadow pulse on the wrapper
            gsap.to(ref.current, {
              scale: 1.04,
              duration: 1.6,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
          }
        },
      );
      return () => mm.revert();
    },
    { scope: ref },
  );

  if (!config.enabled) return null;
  if (open || pillHidden) return null;

  return (
    <button
      ref={ref}
      type="button"
      onClick={openFlow}
      aria-label="Open Quick Start"
      className={cn(
        "fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[15px] font-medium text-on-dark shadow-lift",
        "hover:bg-primary-active focus:outline-none focus:ring-2 focus:ring-ink/40 transition-colors",
      )}
    >
      <Sparkles className="h-4 w-4" aria-hidden />
      <span>Get started</span>
    </button>
  );
}
