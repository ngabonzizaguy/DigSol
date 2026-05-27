"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useQuickStart } from "./quick-start-provider";
import { QuickStartFlow } from "./quick-start-flow";

export function QuickStartModal() {
  const { open, closeFlow, config } = useQuickStart();
  const cardRef = React.useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!open || !cardRef.current) return;
      const mm = gsap.matchMedia();
      mm.add(
        {
          base: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const reduced = (context.conditions as { reduced: boolean }).reduced;
          if (reduced) {
            gsap.set(cardRef.current, { opacity: 1, scale: 1, y: 0 });
            return;
          }
          gsap.fromTo(
            cardRef.current,
            { opacity: 0, scale: 0.96, y: 16 },
            { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "expo.out" },
          );
        },
      );
      return () => mm.revert();
    },
    { dependencies: [open], scope: cardRef },
  );

  if (!config.enabled) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? null : closeFlow())}>
      <DialogContent variant="sheet" className="p-0 md:p-0">
        <div ref={cardRef} className="flex max-h-[92vh] md:max-h-[88vh] flex-col">
          <div className="border-b border-hairline px-6 pt-6 pb-4 md:px-8 md:pt-7">
            <div className="flex items-start justify-between gap-4 pr-10">
              <div className="space-y-1.5">
                <DialogTitle>{config.copy.welcome.title}</DialogTitle>
                <DialogDescription>{config.copy.welcome.body}</DialogDescription>
              </div>
            </div>
            <div className="mt-3">
              <Link
                href="/start"
                className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors"
                onClick={closeFlow}
              >
                Prefer a full page?
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-7">
            <QuickStartFlow variant="modal" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
