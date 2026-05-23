"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Container } from "../ui/container";
import { GradientOrb } from "./gradient-orb";

export function HomeHero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden pt-36 pb-24 lg:pt-44 lg:pb-32">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <GradientOrb color="mint" className="-top-32 -left-20" size={620} slow />
        <GradientOrb color="lavender" className="top-20 right-0" size={520} />
        <GradientOrb color="peach" className="bottom-0 left-1/3" size={560} slow />
      </div>

      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-[12.5px] font-medium text-ink"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Now booking Q3 transformation engagements</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-5xl font-display text-display-mega text-ink text-balance"
        >
          Complete digital transformation — <em className="not-italic text-muted">one trusted partner.</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 max-w-2xl text-[19px] leading-relaxed text-body text-pretty"
        >
          Strategy, design, engineering, automation, AI, and ongoing optimisation — delivered by a single accountable team. We move small businesses to credible, and enterprises to modern.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <Button href="/book-consultation" size="lg">
            Start your project
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button href="/for-enterprise" variant="outline" size="lg">
            Request enterprise briefing
          </Button>
          <span className="ml-2 text-[13px] text-muted">Free 30-minute consultation · No pitch deck</span>
        </motion.div>

        {/* Hero floating preview card */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 lg:mt-20"
        >
          <div className="liquid rounded-3xl p-2">
            <div className="relative overflow-hidden rounded-[20px] bg-surface-card border border-hairline">
              <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr]">
                <div className="p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-hairline">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Engagement preview</p>
                  <h3 className="mt-3 font-display text-[28px] leading-tight text-ink">
                    A 90-day strike team that ships something useful before quarter-end.
                  </h3>
                  <ul className="mt-6 space-y-2.5 text-[14.5px] text-body">
                    <li className="flex gap-2"><span className="text-muted">01</span> Discovery and roadmap in week 1.</li>
                    <li className="flex gap-2"><span className="text-muted">02</span> First production release by week 4.</li>
                    <li className="flex gap-2"><span className="text-muted">03</span> Measurable outcome by week 12.</li>
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-3 p-6 lg:p-8 bg-canvas-soft">
                  {[
                    { v: "+112%", l: "Revenue growth" },
                    { v: "21d → 4h", l: "Compliance" },
                    { v: "-34%", l: "Defect rate" },
                    { v: "98%", l: "Retention" },
                  ].map((m, i) => (
                    <motion.div
                      key={m.l}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.6 + i * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="rounded-xl border border-hairline bg-surface-card p-4"
                    >
                      <p className="font-display text-[26px] leading-none text-ink">{m.v}</p>
                      <p className="mt-2 text-[12px] uppercase tracking-wider text-muted">{m.l}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
