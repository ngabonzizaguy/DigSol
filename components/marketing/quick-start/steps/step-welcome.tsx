"use client";

import { Compass, PenLine, Coffee } from "lucide-react";
import { useQuickStart } from "../quick-start-provider";
import { cn } from "@/lib/utils";

const OPTIONS = [
  {
    id: "find_service" as const,
    title: "Help me find the right service",
    body: "Browse what we already offer and match it to your needs.",
    icon: Compass,
  },
  {
    id: "custom_request" as const,
    title: "I have a specific project in mind",
    body: "Describe it in your own words. We'll build around your goals and budget.",
    icon: PenLine,
  },
  {
    id: "exploring" as const,
    title: "Just exploring",
    body: "Curious what we do. We'll keep it short.",
    icon: Coffee,
  },
];

export function StepWelcome() {
  const { draft, setDraft } = useQuickStart();

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-1">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const selected = draft.intent === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setDraft((d) => ({ ...d, intent: opt.id }))}
              className={cn(
                "group flex items-start gap-4 rounded-2xl border bg-surface-card p-4 text-left transition-all",
                selected
                  ? "border-ink shadow-soft ring-1 ring-ink"
                  : "border-hairline hover:border-hairline-strong hover:shadow-soft",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  selected ? "bg-ink text-on-dark" : "bg-surface-strong text-ink",
                )}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="space-y-1">
                <span className="block text-[16px] font-medium text-ink">{opt.title}</span>
                <span className="block text-[14px] text-body">{opt.body}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
