"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useQuickStart } from "@/components/marketing/quick-start/quick-start-provider";
import { QuickStartFlow } from "@/components/marketing/quick-start/quick-start-flow";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function QuickStartPageClient() {
  const { closeFlow, hidePill, config } = useQuickStart();
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);

  // When the user lands on /start, hide the modal + pill (page is the experience).
  React.useEffect(() => {
    closeFlow();
    hidePill();
  }, [closeFlow, hidePill]);

  // 3-layer orb parallax via ScrollTrigger; respects prefers-reduced-motion via matchMedia.
  useGSAP(
    () => {
      if (!wrapperRef.current) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const orbs = wrapperRef.current!.querySelectorAll<HTMLElement>("[data-orb]");
        orbs.forEach((orb, idx) => {
          const factor = (idx + 1) * 60;
          gsap.to(orb, {
            yPercent: idx % 2 === 0 ? factor : -factor,
            ease: "none",
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5 + idx * 0.3,
            },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: wrapperRef },
  );

  if (!config.enabled) {
    return (
      <div className="rounded-3xl border border-hairline bg-surface-card p-10 text-center">
        <p className="text-body">Quick Start is currently disabled.</p>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      {/* Decorative parallax orbs (atmosphere only). */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          data-orb
          className="absolute -top-32 -left-20 h-80 w-80 rounded-full bg-orb-mint/40 blur-3xl"
        />
        <div
          data-orb
          className="absolute top-40 -right-24 h-96 w-96 rounded-full bg-orb-peach/30 blur-3xl"
        />
        <div
          data-orb
          className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-orb-lavender/30 blur-3xl"
        />
      </div>

      <div className="glass rounded-3xl p-6 md:p-10">
        <QuickStartFlow variant="page" />
      </div>
    </div>
  );
}
