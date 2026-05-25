"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Container } from "../ui/container";
import { GradientOrb } from "./gradient-orb";
import type { HomeHeroContent } from "@/lib/marketing/home-content";

type Props = {
  content: HomeHeroContent;
};

export function HomeHero({ content }: Props) {
  useReducedMotion();

  const headline = content.headline?.trim();
  const emphasis = content.headline_emphasis?.trim();

  return (
    <section className="relative overflow-hidden pt-36 pb-24 lg:pt-44 lg:pb-32">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <GradientOrb color="mint" className="-top-32 -left-20" size={620} slow />
        <GradientOrb color="lavender" className="top-20 right-0" size={520} />
        <GradientOrb color="peach" className="bottom-0 left-1/3" size={560} slow />
      </div>

      <Container className="relative">
        {content.announcement?.trim() ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-[12.5px] font-medium text-ink"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{content.announcement}</span>
          </motion.div>
        ) : null}

        {headline ? (
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-5xl font-display text-display-mega text-ink text-balance"
          >
            {headline}
            {emphasis ? (
              <>
                {" "}
                <em className="not-italic text-muted">{emphasis}</em>
              </>
            ) : null}
          </motion.h1>
        ) : null}

        {content.subtitle?.trim() ? (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 max-w-2xl text-[19px] leading-relaxed text-body text-pretty"
          >
            {content.subtitle}
          </motion.p>
        ) : null}

        {(content.primary_label || content.secondary_label) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            {content.primary_label && content.primary_href ? (
              <Button href={content.primary_href} size="lg">
                {content.primary_label}
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : null}
            {content.secondary_label && content.secondary_href ? (
              <Button href={content.secondary_href} variant="outline" size="lg">
                {content.secondary_label}
              </Button>
            ) : null}
            {content.footnote?.trim() ? (
              <span className="ml-2 text-[13px] text-muted">{content.footnote}</span>
            ) : null}
          </motion.div>
        )}
      </Container>
    </section>
  );
}
