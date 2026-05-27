"use client";

import * as React from "react";
import { Check, MessageCircle } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { buildQuickStartWhatsAppPrefill, buildWhatsAppLink } from "@/lib/marketing/whatsapp";
import { useQuickStart } from "../quick-start-provider";

export interface StepSuccessProps {
  reference: string;
  whatsappNumber: string;
  name: string;
  onClose: () => void;
}

export function StepSuccess({ reference, whatsappNumber, name, onClose }: StepSuccessProps) {
  const { config } = useQuickStart();
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!rootRef.current) return;
      const mm = gsap.matchMedia();
      mm.add(
        {
          base: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const reduced = (context.conditions as { reduced: boolean }).reduced;
          const root = rootRef.current!;
          const check = root.querySelector<SVGPathElement>("[data-success-check]");
          const ring = root.querySelector("[data-success-ring]");
          const ref = root.querySelector("[data-success-ref]");
          const ctas = root.querySelectorAll("[data-success-cta]");
          if (reduced) {
            if (check) {
              check.style.strokeDashoffset = "0";
            }
            return;
          }
          const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
          tl.fromTo(ring, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 });
          if (check) {
            const len = check.getTotalLength();
            check.style.strokeDasharray = `${len}`;
            check.style.strokeDashoffset = `${len}`;
            tl.to(check, { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" }, "-=0.2");
          }
          tl.fromTo(
            ref,
            { y: 12, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 },
            "-=0.2",
          );
          tl.fromTo(
            ctas,
            { y: 12, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, stagger: 0.08 },
            "-=0.3",
          );
        },
      );
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  const waLink = whatsappNumber
    ? buildWhatsAppLink(
        whatsappNumber,
        buildQuickStartWhatsAppPrefill({ name, reference }),
      )
    : null;

  return (
    <div ref={rootRef} className="space-y-5 py-2 text-center">
      <div className="relative mx-auto h-20 w-20">
        <span
          data-success-ring
          className="absolute inset-0 rounded-full bg-orb-mint/40 blur-xl"
          aria-hidden
        />
        <div className="relative flex h-full w-full items-center justify-center rounded-full bg-ink text-on-dark">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              data-success-check
              d="M5 12.5l4 4 10-10"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-display text-2xl md:text-3xl text-ink tracking-tight">
          {config.copy.success.title}
        </h3>
        <p className="text-[15px] text-body">{config.copy.success.body}</p>
      </div>
      <div data-success-ref className="mx-auto inline-flex items-center gap-2 rounded-full bg-surface-strong px-4 py-2 text-sm">
        <Check className="h-4 w-4 text-success" aria-hidden />
        <span className="text-ink">Your reference: <span className="font-mono">{reference.slice(0, 8)}</span></span>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
        {waLink ? (
          <a
            data-success-cta
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-[15px] font-medium text-white hover:opacity-95 transition-opacity"
          >
            <MessageCircle className="h-4 w-4" /> Continue on WhatsApp
          </a>
        ) : null}
        <span data-success-cta>
          <Button variant="outline" size="md" onClick={onClose}>
            Keep exploring
          </Button>
        </span>
      </div>
    </div>
  );
}
