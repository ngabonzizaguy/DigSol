"use client";

import { motion } from "framer-motion";
import { Container } from "../ui/container";
import type { HomeHeroPreviewContent } from "@/lib/marketing/home-content";

type Props = {
  content: HomeHeroPreviewContent;
};

export function HomeHeroPreview({ content }: Props) {
  const bullets = (content.bullets ?? []).filter((b) => b.text?.trim());
  const metrics = (content.metrics ?? []).filter((m) => m.value?.trim() && m.label?.trim());

  if (!content.title?.trim() && bullets.length === 0 && metrics.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden pb-24 lg:pb-32 -mt-8 lg:-mt-12">
      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="liquid rounded-3xl p-2">
            <div className="relative overflow-hidden rounded-[20px] border border-hairline bg-surface-card">
              <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr]">
                {(content.title?.trim() || bullets.length > 0) && (
                  <div className="border-b border-hairline p-8 lg:border-b-0 lg:border-r lg:p-10">
                    {content.eyebrow?.trim() ? (
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{content.eyebrow}</p>
                    ) : null}
                    {content.title?.trim() ? (
                      <h3 className="mt-3 font-display text-[28px] leading-tight text-ink">{content.title}</h3>
                    ) : null}
                    {bullets.length > 0 ? (
                      <ul className="mt-6 space-y-2.5 text-[14.5px] text-body">
                        {bullets.map((b, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-muted">{String(i + 1).padStart(2, "0")}</span>
                            {b.text}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                )}
                {metrics.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 bg-canvas-soft p-6 lg:p-8">
                    {metrics.map((m, i) => (
                      <motion.div
                        key={`${m.label}-${i}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.6,
                          delay: 0.6 + i * 0.08,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="rounded-xl border border-hairline bg-surface-card p-4"
                      >
                        <p className="font-display text-[26px] leading-none text-ink">{m.value}</p>
                        <p className="mt-2 text-[12px] uppercase tracking-wider text-muted">{m.label}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
