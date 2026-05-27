"use client";

import { Check } from "lucide-react";
import { Textarea } from "@/components/ui/input";
import { useQuickStart } from "../quick-start-provider";
import type { QuickStartService } from "@/lib/marketing/quick-start-server";
import { cn } from "@/lib/utils";

export interface StepNeedsProps {
  services: QuickStartService[];
}

export function StepNeeds({ services }: StepNeedsProps) {
  const { draft, setDraft, config } = useQuickStart();
  const selected = new Set(draft.needs.service_slugs);

  const toggle = (slug: string) => {
    setDraft((d) => {
      const next = new Set(d.needs.service_slugs);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return { ...d, needs: { ...d.needs, service_slugs: Array.from(next) } };
    });
  };

  const showServices = draft.intent !== "custom_request";

  return (
    <div className="space-y-5">
      <p className="text-[15px] text-body">{config.copy.needs.body}</p>

      {showServices && services.length > 0 ? (
        <div className="space-y-2">
          <span className="text-sm font-medium text-body-strong">Pick what fits (multiple ok)</span>
          <div className="grid gap-2 md:grid-cols-2">
            {services.map((s) => {
              const on = selected.has(s.slug);
              return (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => toggle(s.slug)}
                  className={cn(
                    "group flex items-start gap-3 rounded-2xl border bg-surface-card p-3 text-left transition-all",
                    on
                      ? "border-ink shadow-soft ring-1 ring-ink"
                      : "border-hairline hover:border-hairline-strong",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                      on ? "border-ink bg-ink text-on-dark" : "border-hairline-strong",
                    )}
                    aria-hidden
                  >
                    {on ? <Check className="h-3 w-3" /> : null}
                  </span>
                  <span className="space-y-0.5">
                    <span className="block text-[15px] font-medium text-ink">{s.title}</span>
                    <span className="block text-[13px] text-muted line-clamp-2">{s.short}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <label className="space-y-1.5 block">
        <span className="text-sm font-medium text-body-strong">
          {draft.intent === "custom_request"
            ? "Describe your project"
            : "Or tell us in your own words (optional)"}
        </span>
        <Textarea
          rows={4}
          value={draft.needs.custom_request}
          onChange={(e) =>
            setDraft((d) => ({ ...d, needs: { ...d.needs, custom_request: e.target.value } }))
          }
          placeholder="What are you trying to build, fix, or grow?"
        />
      </label>
    </div>
  );
}
